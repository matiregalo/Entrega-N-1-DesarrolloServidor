const API_BASE_URL = "/api/carts";

async function addToCart(productId) {
  if (!productId) {
    return false;
  }
  let cart = null;
  if (window.getOrCreateCart) {
    cart = await window.getOrCreateCart();
  } else {
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
        return false;
      }
    }
  }

  if (!cart) {
    return false;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/${cart}/products/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error al agregar el producto: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return false;
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

    try {
      const success = await addToCart(productId);

      if (success) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        let attempts = 0;
        const maxAttempts = 40; 
        while (!window.showCartSidebar && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          attempts++;
        }

        if (window.showCartSidebar) {
          await window.showCartSidebar(true);
        } else {
          console.error(
            "showCartSidebar no está disponible después de esperar",
          );
        }
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    } finally {
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = originalText;
    }
  });
});
