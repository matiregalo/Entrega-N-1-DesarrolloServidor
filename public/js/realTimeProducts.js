const socket = io();

const productForm = document.getElementById("productForm");
const productGrid = document.getElementById("productGrid");

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const productData = Object.fromEntries(formData.entries());
  socket.emit("new product", { productData });
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
      <div class="product-card"  data-id="${product.id}">
        <div class="product-image-container">
          <img
            class="product-image"
            src=${product.thumbnail}
            alt="${product.title}"
          />
        </div>
        <div class="product-info">
          <h2 class="product-title">${product.title}</h2>
          <h3 class="product-description">Descrpcion: ${product.description}</h3>
          <h3 class="product-code">Codigo: ${product.code}</h3>
          <h3 class="product-price">Precio: ${product.price}</h3>
          <h3 class="product-status">Estado: ${product.status}</h3>
          <h3 class="product-stock">Unidades disponibles: ${product.stock}</h3>
          <h3 class="product-category">Categoria: ${product.category}</h3>
          <button class="delete-btn" data-id="${product.id}">Eliminar</button>
        </div>
      </div>
      `;
}
