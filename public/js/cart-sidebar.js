const API_BASE_URL = "/api/carts";

let cartId = null;

async function getOrCreateCart() {
  if (cartId) {
    return cartId;
  }

  const savedCartId = localStorage.getItem("cartId");
  if (savedCartId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${savedCartId}`);
      if (response.ok) {
        cartId = savedCartId;
        return cartId;
      } else {
        localStorage.removeItem("cartId");
      }
    } catch (error) {
      console.error("Error al verificar el carrito:", error);
      localStorage.removeItem("cartId");
    }
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al crear el carrito: ${response.status}`);
    }

    const data = await response.json();

    if (!data.payload || !data.payload._id) {
      throw new Error("Respuesta inválida del servidor");
    }

    cartId = data.payload._id;
    localStorage.setItem("cartId", cartId);
    return cartId;
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    return null;
  }
}

async function fetchCart(cartId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${cartId}`);
    if (!response.ok) {
      throw new Error("Error al obtener el carrito");
    }
    const data = await response.json();
    return data.payload || [];
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return null;
  }
}

function renderCartSidebar(products) {
  const cartSidebarContent = document.getElementById("cartSidebarContent");
  if (!cartSidebarContent) return;

  if (!products || products.length === 0) {
    cartSidebarContent.innerHTML = `
      <div class="empty-cart-sidebar">
        <p>Tu carrito está vacío</p>
      </div>
    `;
    return;
  }

  let html = '<div class="cart-items">';

  products.forEach((item) => {
    const product = item.product;
    const imageSrc =
      product.thumbnails && product.thumbnails[0]
        ? product.thumbnails[0]
        : "/img/default-product.png";
    html += `
      <div class="cart-item">
        <img
          src="${imageSrc}"
          alt="${product.title}"
          class="cart-item-image"
        />
        <div class="cart-item-details">
          <h4 class="product-name">
            <a href="/products/${product._id}">${product.title}</a>
          </h4>
          <p class="unit-price">Precio unitario: $${product.price}</p>
          <p class="quantity">Cantidad: ${item.quantity}</p>
        </div>
      </div>
    `;
  });

  html += "</div>";
  html += `
    <div class="cart-summary">
      <div class="summary-row">
        <span>Total de productos:</span>
        <span>${products.length}</span>
      </div>
    </div>
  `;

  cartSidebarContent.innerHTML = html;
}

async function showCartSidebar(forceShow = false) {
  const cartSidebar = document.getElementById("cartSidebar");
  if (!cartSidebar) {
    console.warn("cartSidebar element not found");
    return;
  }

  // Si forceShow es true, marcar que se está mostrando manualmente
  if (forceShow) {
    isManuallyShowing = true;
    // Prevenir que loadCartOnInit interfiera
    loadCartOnInitExecuted = true;
  }

  const cart = await getOrCreateCart();
  if (!cart) {
    if (forceShow) {
      // Mostrar mensaje de carga
      const cartSidebarContent = document.getElementById("cartSidebarContent");
      if (cartSidebarContent) {
        cartSidebarContent.innerHTML =
          '<div class="cart-loading">Cargando carrito...</div>';
      }
      cartSidebar.style.display = "block";
      cartSidebar.offsetHeight;
      cartSidebar.style.transform = "translateX(0)";
    }
    return;
  }

  // Si forceShow es true, mostrar primero "Cargando..." y luego intentar obtener el carrito
  if (forceShow) {
    // Mostrar el sidebar inmediatamente con mensaje de carga
    const cartSidebarContent = document.getElementById("cartSidebarContent");
    if (cartSidebarContent) {
      cartSidebarContent.innerHTML =
        '<div class="cart-loading">Cargando carrito...</div>';
    }
    cartSidebar.style.display = "block";
    cartSidebar.offsetHeight;
    cartSidebar.style.transform = "translateX(0)";
  }

  // Intentar obtener el carrito con múltiples intentos si forceShow es true
  let cartData = null;
  if (forceShow) {
    // Intentar hasta 6 veces con esperas incrementales
    for (let attempt = 0; attempt < 6; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1))); // 300ms, 600ms, 900ms, 1200ms, 1500ms, 1800ms
      cartData = await fetchCart(cart);
      if (cartData && cartData.length > 0) {
        break; // Si encontramos productos, salir del loop
      }
    }
  } else {
    cartData = await fetchCart(cart);
  }

  if (cartData && cartData.length > 0) {
    renderCartSidebar(cartData);
    cartSidebar.style.display = "block";
    cartSidebar.offsetHeight;
    cartSidebar.style.transform = "translateX(0)";
    // NO resetear isManuallyShowing cuando forceShow es true - mantener el carrito abierto
  } else {
    // Si no hay productos
    if (forceShow) {
      // Si forceShow es true, mantener el carrito abierto y seguir intentando
      const cartSidebarContent = document.getElementById("cartSidebarContent");
      if (cartSidebarContent) {
        cartSidebarContent.innerHTML =
          '<div class="cart-loading">Cargando carrito...</div>';
      }
      cartSidebar.style.display = "block";
      cartSidebar.offsetHeight;
      cartSidebar.style.transform = "translateX(0)";

      // Intentar recargar el carrito después de un momento más largo
      setTimeout(async () => {
        const updatedCartData = await fetchCart(cart);
        if (updatedCartData && updatedCartData.length > 0) {
          renderCartSidebar(updatedCartData);
        } else {
          // Si aún no hay productos, mostrar carrito vacío pero mantenerlo abierto
          const cartSidebarContent =
            document.getElementById("cartSidebarContent");
          if (cartSidebarContent) {
            cartSidebarContent.innerHTML =
              '<div class="empty-cart-sidebar"><p>Tu carrito está vacío</p></div>';
          }
        }
      }, 1500);
    } else {
      // Si no hay productos y no se fuerza, ocultar el carrito
      renderCartSidebar([]);
      cartSidebar.style.transform = "translateX(100%)";
      setTimeout(() => {
        cartSidebar.style.display = "none";
      }, 300);
    }
  }
}

function hideCartSidebar() {
  const cartSidebar = document.getElementById("cartSidebar");
  if (cartSidebar) {
    cartSidebar.style.transform = "translateX(100%)";
    setTimeout(() => {
      cartSidebar.style.display = "none";
    }, 300);
  }
}

// Variable para rastrear si el carrito se está mostrando manualmente
let isManuallyShowing = false;
let loadCartOnInitExecuted = false;

/**
 * Carga el carrito automáticamente al iniciar la página si hay productos
 */
async function loadCartOnInit() {
  // No cargar automáticamente si el carrito se está mostrando manualmente
  if (isManuallyShowing) {
    return;
  }

  // Solo ejecutar una vez
  if (loadCartOnInitExecuted) {
    return;
  }

  loadCartOnInitExecuted = true;

  const cart = await getOrCreateCart();
  if (!cart) return;

  const cartData = await fetchCart(cart);
  if (cartData && cartData.length > 0) {
    // Solo mostrar si el carrito no está ya visible
    const cartSidebar = document.getElementById("cartSidebar");
    if (cartSidebar && cartSidebar.style.display !== "block") {
      renderCartSidebar(cartData);
      cartSidebar.style.display = "block";
      cartSidebar.offsetHeight;
      cartSidebar.style.transform = "translateX(0)";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const closeCartBtn = document.getElementById("closeCartBtn");
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", hideCartSidebar);
  }

  const cartSidebar = document.getElementById("cartSidebar");
  if (cartSidebar) {
    cartSidebar.addEventListener("click", (e) => {
      if (e.target === cartSidebar) {
        hideCartSidebar();
      }
    });
  }

  // Cargar el carrito automáticamente si hay productos
  loadCartOnInit();
});

window.showCartSidebar = showCartSidebar;
window.getOrCreateCart = getOrCreateCart;
