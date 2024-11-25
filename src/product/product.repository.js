// Berkomunikasi langsung ke Database
// ORM Object Relational Mapping

const prisma = require("../db/prisma");

const findProducts = async () => {
  return await prisma.product.findMany();
};

const findProductById = async (id) => {
  return await prisma.product.findUnique({
    where: {
      id,
    },
  });
};

const insertProduct = async (productData) => {
  return await prisma.product.create({
    data: productData,
  });
};

const updateProduct = async (id, productData) => {
  return await prisma.product.update({
    where: {
      id,
    },
    data: {
      ...productData,
    },
  });
};

const deleteProductId = async (id) => {
  return await prisma.product.delete({
    where: {
      id,
    },
  });
};

const deleteAllProducts = async () => {
  return await prisma.product.deleteMany();
};

module.exports = {
  findProducts,
  findProductById,
  insertProduct,
  updateProduct,
  deleteProductId,
  deleteAllProducts,
};
