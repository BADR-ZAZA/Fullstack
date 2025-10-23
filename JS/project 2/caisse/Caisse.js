// -----------------------------
// Caisse Enregistreuse
// -----------------------------
const cashRegister = {
  itemsForSale: {
    "Phone": 300,
    "Smart TV": 220,
    "Gaming Console": 150
  },
  shoppingCart: [],

  addItem: function (itemName) {
    if (this.itemsForSale[itemName]) {
      this.shoppingCart.push(itemName);
      log(`${itemName} ajouté au panier.`);
      updateCart();
    } else {
      log(`Désolé, nous ne vendons pas "${itemName}".`);
    }
  },

  calculateTotalPrice: function () {
    let total = 0;
    for (let item of this.shoppingCart) {
      total += this.itemsForSale[item];
    }
    if (total > 400) {
      log("Une réduction de 10% est appliquée !");
      total *= 0.9;
    }
    log(`Total à payer : ${total.toFixed(2)}`);
    return total;
  },

  pay: function (paymentAmount) {
    const totalPrice = this.calculateTotalPrice();
    log(`Montant donné : ${paymentAmount}`);
    if (paymentAmount === totalPrice) {
      log("Merci pour votre paiement exact !");
    } else if (paymentAmount > totalPrice) {
      const change = paymentAmount - totalPrice;
      log(`Merci pour votre achat ! Monnaie à rendre : ${change.toFixed(2)}`);
    } else {
      const missing = totalPrice - paymentAmount;
      log(`Montant insuffisant. Il manque ${missing.toFixed(2)}.`);
    }
  }
};

// -----------------------------
// Fonctions utilitaires
// -----------------------------

function log(message) {
  document.getElementById("console").innerText += message + "\n";
}

function updateCart() {
  const cartList = document.getElementById("cart");
  cartList.innerHTML = "";
  cashRegister.shoppingCart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item + " - $" + cashRegister.itemsForSale[item];
    cartList.appendChild(li);
  });
}

function addItem(itemName) {
  cashRegister.addItem(itemName);
}

function addCustomItem() {
  const name = document.getElementById("customItem").value.trim();
  if (name) {
    cashRegister.addItem(name);
    document.getElementById("customItem").value = "";
  }
}

function pay() {
  const amount = parseFloat(document.getElementById("payment").value);
  if (!isNaN(amount) && amount > 0) {
    cashRegister.pay(amount);
    document.getElementById("payment").value = "";
  } else {
    log("Veuillez entrer un montant valide.");
  }
}