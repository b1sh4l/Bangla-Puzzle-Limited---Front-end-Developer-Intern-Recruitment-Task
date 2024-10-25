let cart = [];
const cartSidebar = document.querySelector(".cart-sidebar");
const cartItemsElement = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const overlay = document.querySelector(".overlay");
const cartCountElement = document.querySelector(".cart-count");

document.querySelector(".cart-icon").addEventListener("click", function () {
  cartSidebar.classList.add("active");
  overlay.classList.add("active");
});

document.querySelector(".close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

function closeCart() {
  cartSidebar.classList.remove("active");
  overlay.classList.remove("active");
}

document.querySelectorAll(".add-btn").forEach((button) => {
  button.classList.add("add-to-cart");
  const menuItem = button.closest(".menu-item");
  const itemName = menuItem.querySelector(".item-title").textContent;
  const itemPrice = parseFloat(
    menuItem.querySelector(".item-price").textContent.replace("$", "")
  );
  const itemId = itemName.toLowerCase().replace(/\s+/g, "-");
  const itemImage = menuItem.querySelector("img").getAttribute("src");

  button.setAttribute("data-id", itemId);
  button.setAttribute("data-price", itemPrice);
  button.setAttribute("data-image", itemImage);

  button.addEventListener("click", function () {
    if (!cart.find((item) => item.id === itemId)) {
      cart.push({
        id: itemId,
        name: itemName,
        price: itemPrice,
        quantity: 1,
        image: itemImage,
      });
      updateCart();
      this.innerText = "Added to Cart";
      this.disabled = true;
      cartSidebar.classList.add("active");
      overlay.classList.add("active");
    }
  });
});

function updateCart() {
    cartItemsElement.innerHTML = "";
    let subtotal = 0;
    let total = 0;
    let itemCount = 0;
  
    cart.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      total += itemSubtotal;
      itemCount += item.quantity;
      cartItemsElement.innerHTML += `
                      <div class="cart-item">
                          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                          <div class="cart-item-details">
                              <p>${item.name} - $${item.price}/each</p>
                              <p class="item-subtotal">Subtotal: $${itemSubtotal.toFixed(2)}</p>
                          </div>
                          <div class="quantity-controls">
                              <button class="decrease-quantity" data-id="${item.id}">-</button>
                              <span>${item.quantity}</span>
                              <button class="increase-quantity" data-id="${item.id}">+</button>
                              <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                          </div>
                      </div>
                  `;
    });
  
    totalPriceElement.textContent = total.toFixed(2);
    cartCountElement.textContent = itemCount;
  
    attachCartEventListeners();
  }

function attachCartEventListeners() {
  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");
      increaseQuantity(itemId);
    });
  });

  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");
      decreaseQuantity(itemId);
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");
      removeItem(itemId);
    });
  });
}

function increaseQuantity(itemId) {
  const item = cart.find((i) => i.id === itemId);
  if (item) {
    item.quantity++;
    updateCart();
  }
}

function decreaseQuantity(itemId) {
  const item = cart.find((i) => i.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity--;
    updateCart();
  }
}

function removeItem(itemId) {
  cart = cart.filter((i) => i.id !== itemId);
  updateCart();
  const addButton = document.querySelector(`.add-to-cart[data-id="${itemId}"]`);
  if (addButton) {
    addButton.disabled = false;
    addButton.innerText = "Add to Order";
  }

  if (cart.length === 0) {
    closeCart();
  }
}