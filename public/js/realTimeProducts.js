const socket = io();

const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const productData = Object.fromEntries(formData.entries());
  socket.emit("new product", { productData });
  productForm.reset();
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
      <div class="product-card">
        <div class="product-image-container">
          <img
            class="product-image"
            src=${this.thumbnail}
            alt="${this.title}"
          />
        </div>
        <div class="product-info">
          <h2 class="product-title">${this.title}</h2>
          <h3 class="product-description">Descrpcion: ${this.description}</h3>
          <h3 class="product-code">Codigo: ${this.code}</h3>
          <h3 class="product-price">Precio: ${this.price}</h3>
          <h3 class="product-status">Estado: ${this.status}</h3>
          <h3 class="product-stock">Unidades disponibles: ${this.stock}</h3>
          <h3 class="product-category">Categoria: ${this.category}</h3>
        </div>
      </div>
      `;
}
