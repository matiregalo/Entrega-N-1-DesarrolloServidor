const API_BASE_URL = "/api/carts";

/**
 * Agrega un producto al carrito y muestra el sidebar
 */
async function addToCart(productId) {
  if (!productId) {
    return null;
  }

  // Obtener o crear carrito usando la función del cart-sidebar.js
  let cart = null;
  if (window.getOrCreateCart) {
    cart = await window.getOrCreateCart();
  } else {
    // Fallback si el script no está cargado
    const savedCartId = localStorage.getItem("cartId");
    if (savedCartId) {
      cart = savedCartId;
    } else {
      try {
        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          cart = data.payload._id;
          localStorage.setItem("cartId", cart);
        }
      } catch (error) {
        console.error("Error al crear el carrito:", error);
        return null;
      }
    }
  }

  if (!cart) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/${cart}/products/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al agregar el producto: ${response.status}`);
    }

    // Mostrar el sidebar del carrito
    if (window.showCartSidebar) {
      await window.showCartSidebar();
    }

    return true;
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCartBtn");

  if (!addToCartBtn) {
    return;
  }

  addToCartBtn.addEventListener("click", async () => {
    const productId = addToCartBtn.getAttribute("data-product-id");

    if (!productId) {
      return;
    }

    const originalText = addToCartBtn.textContent;
    addToCartBtn.disabled = true;
    addToCartBtn.textContent = "Agregando...";

    await addToCart(productId);

    addToCartBtn.disabled = false;
    addToCartBtn.textContent = originalText;
  });
});
