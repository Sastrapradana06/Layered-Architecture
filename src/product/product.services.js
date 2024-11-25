const CustomError = require("../utils");
const {
  findProducts,
  findProductById,
  insertProduct,
  updateProduct,
  deleteProductId,
  deleteAllProducts,
} = require("./product.repository");

const getProducts = async () => {
  const products = await findProducts();
  return products;
};

const getProductById = async (id) => {
  const product = await findProductById(id);
  console.log(product);

  if (!product) {
    throw new CustomError("Product not found", 404, "P2025");
  }

  return product;
};

const createProduct = async (product) => {
  const createdProduct = await insertProduct(product);
  return createdProduct;
};

const editProduct = async (id, product) => {
  await getProductById(id);
  const updatedProduct = await updateProduct(id, product);

  return updatedProduct;
};

const deleteProductById = async (id) => {
  const deletedProduct = await deleteProductId(id);
  return deletedProduct;
};

const deleteProducts = async () => {
  const deletedProducts = await deleteAllProducts();
  return deletedProducts;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  editProduct,
  deleteProductById,
  deleteProducts,
};
