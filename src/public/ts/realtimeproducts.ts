import { io } from "socket.io-client";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
}

const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("product_added", function (product: Product) {
  console.log("Product added:", product);
  const productHtml = `
    <div class="col-lg-4 col-md-6 mb-4 product-item" data-id="${product.id}">
      <div class="card h-100">
        <img class="card-img-top" src="${product.image}" alt="${product.name}">
        <div class="card-body">
          <h4 class="card-title">${product.name}</h4>
          <h5>$${product.price}</h5>
          <p class="card-text">${product.description}</p>
        </div>
      </div>
    </div>`;
  document
    .getElementById("products-container")
    ?.insertAdjacentHTML("beforeend", productHtml);
});

socket.on("product_updated", function (product: Product) {
  console.log("Product updated:", product);
  const productItem = document.querySelector(
    `.product-item[data-id="${product.id}"]`
  );
  if (productItem) {
    const titleElement = productItem.querySelector(
      ".card-title"
    ) as HTMLElement;
    const priceElement = productItem.querySelector("h5") as HTMLElement;
    const descriptionElement = productItem.querySelector(
      ".card-text"
    ) as HTMLElement;
    const imgElement = productItem.querySelector(
      ".card-img-top"
    ) as HTMLImageElement;

    if (titleElement) titleElement.innerText = product.name;
    if (priceElement) priceElement.innerText = `$${product.price}`;
    if (descriptionElement) descriptionElement.innerText = product.description;
    if (imgElement) imgElement.src = product.image;
  }
});

socket.on("product_deleted", function (productId: number) {
  console.log("Product deleted:", productId);
  const productItem = document.querySelector(
    `.product-item[data-id="${productId}"]`
  );
  if (productItem) {
    productItem.remove();
  }
});
