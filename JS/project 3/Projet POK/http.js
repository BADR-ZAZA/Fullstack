// --- Simple app state ---
const cache = new Map(); // cache by id and lowercase name
const history = []; // last 10 searches (strings)
let currentController = null;

// --- DOM ---
const qEl = document.getElementById('q');
const searchBtn = document.getElementById('searchBtn');
const surpriseBtn = document.getElementById('surpriseBtn');
const cancelBtn = document.getElementById('cancelBtn');
const statusEl = document.getElementById('status');
const cardEl = document.getElementById('card');
const cardInner = document.getElementById('cardInner');
const historyList = document.getElementById('historyList');

// --- Helpers ---
function setStatus(txt){ statusEl.textContent = txt; }
function setLoading(on=true){ if(on) setStatus('Loading...'); }

function renderCard(pokemon, species){
  // species may be undefined if unavailable
  const color = species?.color?.name || 'gray';
  cardEl.style.borderColor = color;
  const typesHTML = pokemon.types.map(t=>`<div class="type">${t.type.name}</div>`).join('');
  const statsHTML = pokemon.stats.map(s=>`<div><strong>${s.stat.name}:</strong> ${s.base_stat}</div>`).join('');
  const sprite = (pokemon.sprites?.other?.['official-artwork']?.front_default) || pokemon.sprites?.front_default || '';
  cardInner.innerHTML = `
    <div class="row">
      <div class="sprite">${sprite?`<img src="${sprite}" alt="${pokemon.name}" style="max-width:100%;max-height:100%">`:'—'}</div>
      <div style="flex:1;text-align:left">
        <h2 style="margin:0;text-transform:capitalize">${pokemon.name} <span class="small">#${pokemon.id}</span></h2>
        <div class="types">${typesHTML}</div>
        <div class="small" style="margin-top:8px">${species?.flavor_text || ''}</div>
        <div class="stats">${statsHTML}</div>
      </div>
    </div>
  `;
}

function showError(msg){ cardEl.style.borderColor = 'transparent'; cardInner.innerHTML = `<div style="color:#ffb4b4">${msg}</div>`; setStatus(msg); }

function addHistory(q){
  const text = String(q).trim(); if(!text) return;
  history.unshift(text);
  while(history.length>10) history.pop();
  renderHistory();
}

function renderHistory(){
  historyList.innerHTML = '';
  if(history.length===0){ historyList.innerHTML = '<div class="small">No history yet</div>'; return; }
  history.forEach(item=>{
    const btn = document.createElement('div');
    btn.className = 'history-item';
    btn.textContent = item;
    btn.onclick = ()=>{ qEl.value = item; startSearch(item); };
    historyList.appendChild(btn);
  })
}

// --- Network utilities ---
function fetchWithTimeout(url, {signal, timeout=8000} = {}){
  return new Promise((resolve, reject)=>{
    const timer = setTimeout(()=>{
      reject(new Error('Timeout'));
    }, timeout);

    fetch(url, {signal}).then(resp=>{
      clearTimeout(timer);
      resolve(resp);
    }).catch(err=>{
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function retry(fn, {retries=2, backoffMs=300} = {}){
  let attempt = 0;
  while(true){
    try{ return await fn(); }
    catch(err){
      attempt++;
      // retry on network errors or 5xx
      const shouldRetry = attempt <= retries && (err.message==='Failed to fetch' || err.message==='Timeout' || err.status>=500 || !err.status);
      if(!shouldRetry) throw err;
      await new Promise(r=>setTimeout(r, backoffMs * attempt));
    }
  }
}

// --- Async/await production handler ---
async function fetchPokemon(query, {signal, timeout=8000} = {}){
  const q = String(query).trim().toLowerCase();
  // check cache first
  if(cache.has(q)){
    const data = cache.get(q);
    return {pokemon: data.pokemon, species: data.species};
  }

  const base = 'https://pokeapi.co/api/v2';
  // first fetch /pokemon/{q}
  const pokemonUrl = `${base}/pokemon/${encodeURIComponent(q)}`;

  // We'll fetch pokemon then species in parallel using the id
  const resp = await retry(()=>fetchWithTimeout(pokemonUrl, {signal, timeout}), {retries:2, backoffMs:300});
  if(!resp.ok){
    const err = new Error('HTTP ' + resp.status);
    err.status = resp.status; throw err;
  }
  const pokemon = await resp.json();

  // now fetch species in parallel (by id)
  const speciesUrl = `${base}/pokemon-species/${pokemon.id}`;
  const [speciesResp] = await Promise.all([
    retry(()=>fetchWithTimeout(speciesUrl, {signal, timeout}), {retries:2, backoffMs:300}).catch(e=>null)
  ]);

  const species = speciesResp && speciesResp.ok ? await speciesResp.json() : null;

  // massage flavor_text to a single short sentence if available
  const flavor = species?.flavor_text_entries?.find(ft=>ft.language?.name==='en')?.flavor_text?.replace(/\n|\f/g, ' ') || '';
  if(species) species.flavor_text = flavor;

  // cache by id and name
  cache.set(String(pokemon.id), {pokemon, species});
  cache.set(pokemon.name.toLowerCase(), {pokemon, species});

  return {pokemon, species};
}

// --- Promise chaining style (for demo) ---
function fetchPokemonThenStyle(query, {signal, timeout=8000} = {}){
  const q = String(query).trim().toLowerCase();
  const base = 'https://pokeapi.co/api/v2';
  const pokemonUrl = `${base}/pokemon/${encodeURIComponent(q)}`;
  return fetchWithTimeout(pokemonUrl, {signal, timeout})
    .then(resp => {
      if(!resp.ok){ const err = new Error('HTTP ' + resp.status); err.status = resp.status; throw err; }
      return resp.json();
    })
    .then(pokemon => {
      const speciesUrl = `${base}/pokemon-species/${pokemon.id}`;
      return Promise.all([
        Promise.resolve(pokemon),
        fetchWithTimeout(speciesUrl, {signal, timeout}).then(r=>r.ok? r.json() : null).catch(()=>null)
      ]);
    })
    .then(([pokemon, species]) => {
      // cache
      cache.set(String(pokemon.id), {pokemon, species});
      cache.set(pokemon.name.toLowerCase(), {pokemon, species});
      return {pokemon, species};
    });
}

// --- Fake callback pipeline (demo) ---
function fakeCallbackPipeline(query, cb){
  // simulate a few async validation/normalization steps
  setTimeout(()=>{
    const normalized = String(query).trim().toLowerCase();
    if(!normalized){ return cb(new Error('empty')); }
    setTimeout(()=>{
      // simulate async success/failure
      if(Math.random() < 0.02) return cb(new Error('simulated callback failure'));
      cb(null, normalized);
    }, 220);
  }, 180);
}

// --- Controller management ---
function abortCurrent(){ if(currentController){ currentController.abort(); currentController = null; setStatus('Aborted'); } }

async function startSearch(query){
  // if user typed, use that; otherwise pass through
  abortCurrent();
  addHistory(query);

  currentController = new AbortController();
  const signal = currentController.signal;

  setLoading(true);
  cardInner.style.opacity = 0.6;
  try{
    // demo: run fake callback pipeline first (non-blocking simulated steps)
    const normalized = await new Promise((resolve, reject)=>{
      fakeCallbackPipeline(query, (err, val)=>{ if(err) reject(err); else resolve(val); });
    }).catch(err=>{ /* ignore callback failures, continue */ return String(query).trim().toLowerCase(); });

    // If in cache serve immediately while we fetch fresh in background
    if(cache.has(normalized)){
      const cached = cache.get(normalized);
      renderCard(cached.pokemon, cached.species);
      setStatus('Served from cache — fetching fresh in background...');
    }

    // Use production async/await handler
    const result = await fetchPokemon(normalized, {signal, timeout:7000});
    renderCard(result.pokemon, result.species);
    setStatus('OK');
  }catch(err){
    if(err.name === 'AbortError'){
      showError('Request cancelled');
    } else if(err.status === 404 || /404/.test(err.message)){
      showError('Not found (404)');
    } else if(err.message === 'Timeout'){
      showError('Request timed out');
    } else {
      showError('Network error: ' + (err.message || err));
    }
  } finally{
    cardEl.style.opacity = 1;
    currentController = null;
  }
}

// --- Wiring UI ---
searchBtn.addEventListener('click', ()=>{
  const q = qEl.value || '';
  if(!q) return setStatus('Type a name or id first');
  startSearch(q);
});

surpriseBtn.addEventListener('click', ()=>{
  // choose a random id within a reasonable range
  const randomId = Math.floor(Math.random()*1010) + 1;
  qEl.value = randomId;
  startSearch(randomId);
});

cancelBtn.addEventListener('click', ()=>{ abortCurrent(); });

// allow enter to search
qEl.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ searchBtn.click(); } });

// initial render
renderHistory();

// Expose some functions for debugging in console
window._fetchPokemon = fetchPokemon;
window._fetchThen = fetchPokemonThenStyle;
window._cache = cache;
