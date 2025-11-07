const socket = io();
const productForm = document.getElementById("productForm");
const productGrid = document.getElementById("productGrid");

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("📦 Formulario enviado");

  const formData = new FormData(productForm);
  console.log("📋 FormData creado:", formData);
  
  try {
    console.log("🚀 Enviando petición HTTP a /products...");
    const response = await fetch('/products', {
      method: 'POST',
      body: formData  // ✅ Enviamos el FormData completo con el archivo
    });
    
    console.log("📨 Respuesta recibida, status:", response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log("✅ Producto agregado exitosamente:", result);
      productForm.reset();
      console.log("🔄 Formulario reseteado");
    } else {
      const error = await response.json();
      console.error("❌ Error del servidor:", error.message);
      alert('Error: ' + error.message);
    }
  } catch (error) {
    console.error("💥 Error de conexión:", error);
    alert('Error de conexión: ' + error.message);
  }
});

productGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const productId = e.target.getAttribute("data-id");
    console.log("🗑️ Eliminando producto ID:", productId);
    socket.emit("delete product", productId);
  }
});

socket.on("products history", (products) => {
  console.log("📜 Historial de productos recibido:", products.length, "productos");
  renderProducts(products);
});

socket.on("broadcast new product", (newProduct) => {
  console.log("🆕 Nuevo producto recibido via socket:", newProduct);
  addProductToGrid(newProduct);
});

socket.on("products updated", (products) => {
  console.log("🔄 Lista de productos actualizada:", products.length, "productos");
  renderProducts(products);
});

socket.on("product deleted", (productId) => {
  console.log("🗑️ Producto eliminado ID:", productId);
  // Remover el producto del DOM
  const productElement = document.querySelector(`[data-id="${productId}"]`);
  if (productElement) {
    productElement.remove();
    console.log("✅ Producto removido del DOM");
  }
});

socket.on("product error", (error) => {
  console.error('❌ Error del servidor via socket:', error.message);
  alert('Error: ' + error.message);
});

function renderProducts(products) {
  console.log("🎨 Renderizando productos en el grid");
  productGrid.innerHTML = products.map(productTemplate).join("");
}

function addProductToGrid(product) {
  console.log("➕ Agregando producto al grid:", product.title);
  productGrid.innerHTML += productTemplate(product);
}

function productTemplate(product) {
  console.log("🖼️ Creando template para producto:", product.title);
  console.log("📸 Thumbnails del producto:", product.thumbnails);
  
  // ✅ CORREGIDO: thumbnails es un array, tomamos el primer elemento
  const imageUrl = Array.isArray(product.thumbnails) 
    ? product.thumbnails[0] 
    : product.thumbnails;
  
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-container">
        <img class="product-image" src="${imageUrl}" alt="${product.title}">
      </div>
      <div class="product-info">
        <h2 class="product-title">${product.title}</h2>
        <p class="product-description">${product.description}</p>
        <p class="product-code">Código: ${product.code}</p>
        <p class="product-price">Precio: $${product.price}</p>
        <p class="product-status">Estado: ${product.status ? 'Activo' : 'Inactivo'}</p>
        <p class="product-stock">Stock: ${product.stock}</p>
        <p class="product-category">Categoría: ${product.category}</p>
        <button class="delete-btn" data-id="${product.id}">Eliminar</button>
      </div>
    </div>
  `;
}