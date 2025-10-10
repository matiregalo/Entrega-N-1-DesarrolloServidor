import fs from "fs/promises";
import crypto from "crypto";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async addProduct(newProduct) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);
      const newId = this.generateNewId();
      const product = { id: newId, ...newProduct };
      products.push(product);
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(products, null, 2),
        "utf-8",
      );
      return products;
    } catch (error) {}
  }
}
