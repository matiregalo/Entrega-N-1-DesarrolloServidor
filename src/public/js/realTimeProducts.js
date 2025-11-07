console.log("🟢 realTimeProducts.js cargado correctamente");

const socket = io();
const productForm = document.getElementById("productForm");
const productGrid = document.getElementById("productGrid");

console.log("🔍 Elementos del DOM:");
console.log("📝 Form:", productForm);
console.log("📦 Product Grid:", productGrid);
console.log("🔌 Socket:", socket);

// Verificar conexión Socket.IO
socket.on("connect", () => {
  console.log("✅ Conectado al servidor Socket.IO. ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Desconectado del servidor Socket.IO");
});

socket.on("connect_error", (error) => {
  console.error("💥 Error de conexión Socket.IO:", error);
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("🔄 Formulario enviado - Iniciando proceso...");

  const formData = new FormData(productForm);
  const productData = Object.fromEntries(formData.entries());

  // Conversión de tipos
  productData.price = parseFloat(productData.price);
  productData.stock = parseInt(productData.stock);
  productData.status = productData.status === "true";
  productData.thumbnails = []; // Temporalmente vacío

  console.log("📤 Enviando producto al servidor:", productData);

  socket.emit("new product", productData);
  productForm.reset();

  console.log("📨 Evento 'new product' emitido");
});

productGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const productId = e.target.getAttribute("data-id");
    console.log("🗑️ Solicitando eliminar producto ID:", productId);
    socket.emit("delete product", productId);
  }
});

// Eventos Socket.IO
socket.on("products history", (products) => {
  console.log("📚 Historial de productos recibido:", products);
  console.log("📊 Cantidad de productos:", products.length);
  renderProducts(products);
});

socket.on("broadcast new product", (newProduct) => {
  console.log("🎉 Nuevo producto recibido:", newProduct);
  addProductToGrid(newProduct);
});

socket.on("products updated", (products) => {
  console.log("🔄 Lista actualizada de productos:", products);
  renderProducts(products);
});

socket.on("product deleted", (productId) => {
  console.log("✅ Producto eliminado confirmado:", productId);
  // Remover el producto del DOM
  const productElement = document.querySelector(`[data-id="${productId}"]`);
  if (productElement) {
    productElement.remove();
    console.log("🗑️ Producto removido del DOM");
  }
});

socket.on("product error", (error) => {
  console.error("💥 Error del servidor:", error);
  alert("❌ Error: " + error.message);
});

function renderProducts(products) {
  console.log("🎨 Renderizando productos en el DOM");
  productGrid.innerHTML = products.map(productTemplate).join("");
  console.log("✅ Productos renderizados");
}

function addProductToGrid(product) {
  console.log("➕ Añadiendo producto individual:", product);
  const productElement = productTemplate(product);
  productGrid.innerHTML += productElement;
}

function productTemplate(product) {
  console.log("🖼️ Creando template para producto:", product.title);

  let thumbnailUrl = "/img/default-product.png";
  if (product.thumbnails && product.thumbnails.length > 0) {
    thumbnailUrl = `/img/${product.thumbnails[0]}`;
  }

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-container">
        <img class="product-image" src="${thumbnailUrl}" alt="${product.title}">
      </div>
      <div class="product-info">
        <h2 class="product-title">${product.title}</h2>
        <p class="product-description">${product.description}</p>
        <p class="product-code">Código: ${product.code}</p>
        <p class="product-price">Precio: $${product.price}</p>
        <p class="product-status">Estado: ${product.status ? "Activo" : "Inactivo"}</p>
        <p class="product-stock">Stock: ${product.stock}</p>
        <p class="product-category">Categoría: ${product.category}</p>
        <button class="delete-btn" data-id="${product.id}">Eliminar</button>
      </div>
    </div>
  `;
}

console.log("🔚 Fin de la carga de realTimeProducts.js");
