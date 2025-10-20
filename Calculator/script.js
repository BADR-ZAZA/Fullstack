const displayEl = document.getElementById("display"); // l-element li ghadi ywarri les numbers
const keysEl = document.getElementById("keys"); // l-container dyal les boutons
const historyEl = document.getElementById("history"); // l-history dyal calculation

// state dyal calculator
let state = { current: "0", previous: null, operator: null, overwrite: false, history: [] };

// function bash t-update display
const updateDisplay = () => (displayEl.textContent = state.current);

// function bash t-render history
const renderHistory = () => (historyEl.innerHTML = state.history.map(i => `<li>${i}</li>`).join(""));

// listener 3la click dyal les buttons
keysEl.addEventListener("click", e => {
    const btn = e.target.closest("button"); // jbed l-button li clicked
    if (!btn) return; // ila ma kanch button, exit
    handleClick(btn, e);
});

// function li t-handle click 3la button
function handleClick(btn, e) {
    const { type, value } = btn.dataset; // jbed type w value
    if (type === "digit") inputDigit(value); // ila digit => input
    if (type === "operator") { e.stopPropagation(); chooseOperator(value); } // ila operator => choose
    if (type === "decimal") inputDecimal(); // decimal point
    if (type === "equals") evaluate(); // equal button
    if (type === "command") handleCommand(value); // commands AC, CE, ±, %
}

// function li t-input digit
function inputDigit(digit) {
    state.current = state.overwrite ? digit : (state.current === "0" ? digit : state.current + digit); // update number
    state.overwrite = false;
    updateDisplay(); // show number
}

// function li t-input decimal
function inputDecimal() {
    if (state.overwrite) state.current = "0."; // ila overwrite, start new number
    else if (!state.current.includes(".")) state.current += "."; // ila ma fihash dot
    state.overwrite = false;
    updateDisplay();
}

// function li t-choose operator
function chooseOperator(op) {
    if (state.previous && state.operator && !state.overwrite) evaluate(); // ila kayn previous w operator, evaluate first
    Object.assign(state, { operator: op, previous: state.current, overwrite: true }); // save operator w previous number
}

// function li t-evaluate result
function evaluate() {
    if (!state.previous || !state.operator) return; // ila ma kaynch previous w operator, exit

    const prev = +state.previous;
    const curr = +state.current; // convert to number
    const ops = { "+": prev + curr, "-": prev - curr, "*": prev * curr, "/": curr ? prev / curr : "Error" }; // operator calculation
    let result = ops[state.operator];

    if (result === "Error") state = {  ...state, current: "Error", previous: null, operator: null }; // ila division by 0
    else {
        state.current = formatNumber(result); // format number
        state.history = [`${state.previous} ${state.operator} ${curr} = ${state.current}`, ...state.history].slice(0, 5); // update history
        renderHistory();
        Object.assign(state, { previous: null, operator: null }); // reset operator w previous
    }
    state.overwrite = true; // next input overwrite
    updateDisplay();
}

// function li t-handle commands AC, CE, ±, %
function handleCommand(cmd) {
    if (cmd === "AC") state = { current: "0", previous: null, operator: null, overwrite: false, history: [] }; // reset kolchi
    if (cmd === "CE") state.current = "0"; // clear current
    if (cmd === "±" && state.current !== "0") state.current = (-parseFloat(state.current)).toString(); // switch sign
    if (cmd === "%") state.current = (parseFloat(state.current) / 100).toString(); // percentage
    renderHistory();
    updateDisplay();
}

// keyboard support
document.addEventListener("keydown", e => {
    if (!isNaN(e.key)) inputDigit(e.key); // digits
    else if (e.key === ".") inputDecimal(); // decimal
    else if (["+", "-", "*", "/"].includes(e.key)) chooseOperator(e.key); // operators
    else if (e.key === "Enter") evaluate(); // equal
    else if (e.key === "Backspace") handleCommand("CE"); // clear current
    else if (e.key === "Escape") handleCommand("AC"); // reset all
});

// function li t-format number
const formatNumber = n => {
    let num = +n;
    if (isNaN(num)) return "Error"; // ila ma number
    return (Math.abs(num) > 1e12 || Math.abs(num) < 1e-12) // ila number kbira bzf wla sghira
        ? num.toExponential(5)
        : parseFloat(num.toFixed(10)).toString().slice(0, 12); // limit digits
};