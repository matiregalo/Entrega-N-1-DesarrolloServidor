const socket = io();
const productForm = document.getElementById("productForm");
const productGrid = document.getElementById("productGrid");

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(productForm);
  const productData = Object.fromEntries(formData.entries());

  productData.price = parseFloat(productData.price);
  productData.stock = parseInt(productData.stock);
  productData.status = productData.status === "true";
  productData.thumbnails = [];
  socket.emit("new product", productData);
  productForm.reset();
});

productGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const productId = e.target.getAttribute("data-id");
    socket.emit("delete product", productId);
  }
});

socket.on("products history", (products) => {
  renderProducts(products);
});

socket.on("broadcast new product", (newProduct) => {
  addProductToGrid(newProduct);
});

function renderProducts(products) {
  productGrid.innerHTML = products.map(productTemplate).join("");
}

function addProductToGrid(product) {
  productGrid.innerHTML += productTemplate(product);
}

function productTemplate(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-container">
        <img class="product-image" src="${product.thumbnails}" alt="${product.title}">
      </div>
      <div class="product-info">
        <h2 class="product-title">${product.title}</h2>
        <p class="product-description">${product.description}</p>
        <p class="product-code">Código: ${product.code}</p>
        <p class="product-price">Precio: $${product.price}</p>
        <p class="product-status">Estado: ${product.status}</p>
        <p class="product-stock">Stock: ${product.stock}</p>
        <p class="product-category">Categoría: ${product.category}</p>
        <button class="delete-btn" data-id="${product.id}">Eliminar</button>
      </div>
    </div>
  `;
}
