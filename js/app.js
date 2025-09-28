// js/app.js
(function() {
  const CART_KEY = 'FeliShop_cart_v1';

  const cartButton = document.getElementById('cart-button');
  const cartEl = document.getElementById('cart');
  const cartItemsEl = document.getElementById('cart-items');
  const cartCounterEls = document.querySelectorAll('#cart-counter, #cart-count');
  const closeCartBtn = document.getElementById('close-cart');

  // Obtener carrito
  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // Actualizar contador
  function updateCartCount() {
    const cart = getCart();
    cartCounterEls.forEach(el => el.textContent = cart.length);
  }

  function renderCart() {
    const cart = getCart();
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'El carrito está vacío';
      li.style.listStyle = 'none';
      cartItemsEl.appendChild(li);
      return;
    }

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.marginBottom = '0.5rem';
      li.style.listStyle = 'none';

      li.innerHTML = `
        <span>${item.name} - $${item.price}</span>
        <button class="btn btn-sm btn-danger remove-item" data-index="${index}">✕</button>
      `;

      cartItemsEl.appendChild(li);
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        const updatedCart = getCart();
        updatedCart.splice(index, 1);
        saveCart(updatedCart);
        updateCartCount();
        renderCart();
      });
    });
  }

  // Agregar producto
  function addToCart(id, name, price) {
    const cart = getCart();
    cart.push({ id, name, price: Number(price), addedAt: new Date().toISOString() });
    saveCart(cart);
    updateCartCount();
    renderCart();
  }

  // Botones "Agregar al carrito"
  function bindAddButtons() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name || btn.getAttribute('data-name');
        const price = btn.dataset.price || btn.getAttribute('data-price') || 0;

        addToCart(id, name, price);

        const original = btn.innerHTML;
        btn.innerHTML = 'Añadido ✓';
        btn.classList.add('btn-adding');
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove('btn-adding');
        }, 900);
      });
    });
  }

  // Mostrar/ocultar carrito
  function bindCartToggle() {
    if (!cartButton || !cartEl) return;

    cartButton.addEventListener('click', () => {
      cartEl.style.display = (cartEl.style.display === 'block') ? 'none' : 'block';
    });

    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => {
        cartEl.style.display = 'none';
      });
    }
  }

  // Gallery thumbnails
  function bindGalleryThumbs() {
    document.querySelectorAll('.thumbs .thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const mainImg = document.querySelector('.product-gallery .main-img');
        if (!mainImg) return;
        mainImg.src = thumb.src;
      });
    });
  }

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
    bindAddButtons();
    bindCartToggle();
    bindGalleryThumbs();
  });

})();
