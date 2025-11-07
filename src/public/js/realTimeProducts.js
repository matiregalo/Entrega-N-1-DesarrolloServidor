const socket = io();
const productForm = document.getElementById("productForm");
const productGrid = document.getElementById("productGrid");

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  try {
    const response = await fetch("/products", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      productForm.reset();
    } else {
      const error = await response.json();
      alert("Error: " + error.message);
    }
  } catch (error) {
    alert("Error de conexión: " + error.message);
  }
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

socket.on("products updated", (products) => {
  renderProducts(products);
});

function renderProducts(products) {
  productGrid.innerHTML = products.map(productTemplate).join("");
}

function addProductToGrid(product) {
  productGrid.innerHTML += productTemplate(product);
}

function productTemplate(product) {
  const imageUrl = Array.isArray(product.thumbnails)
    ? product.thumbnails[0]
    : product.thumbnails;

  return `<div class="item" data-id="${product.id}">
        <div class="img-item-container">
          <img class="img-item" src="${imageUrl}" alt="${product.title}" />
        </div>
        <div class="text-item">
          <h2 class="title-item">${product.title}</h2>
          <p class="product-description">${product.description}</p>
          <div class="product-details">
            <p class="product-code">Código: ${product.code}</p>
            <p class="product-status">Estado: ${
              product.status ? "Activo" : "Inactivo"
            }</p>
            <p class="product-stock">Stock: ${product.stock}</p>
            <p class="product-category">Categoría: ${product.category}</p>
          </div>
          <p class="product-price">Precio: $${product.price}</p>
          <button
            class="button-item delete-btn"
            data-id="${product.id}"
          >Eliminar</button>
        </div>
      </div>`;
}
