// Layer untuk handle request dan response
// Layer untuk validasi data body
const env = require("dotenv").config();

const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  getProductById,
  createProduct,
  editProduct,
  deleteProductById,
  getProducts,
  deleteProducts,
} = require("./product.services");

const productSchema = Joi.object({
  name: Joi.string().min(5).required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
});

// GET /
router.get("/", async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).json({ message: "Success", products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Id must be a string" });
  }

  try {
    const product = await getProductById(id);

    return res.status(200).json({ message: "Success", product });
  } catch (error) {
    console.log(error);

    res.status(error.statusCode).json({ error: error.message });
  }
});

// POST /
router.post("/", async (req, res) => {
  const { value, error } = productSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      error: `Missing fields: ${error.details.map(
        (detail) => detail.context.label
      )}`,
    });
  }

  try {
    const createdProduct = await createProduct(value);

    res
      .status(201)
      .json({ message: "Success Product Created", data: createdProduct });
  } catch (error) {
    res.status(error.code == "P2002" ? 400 : 500).json({
      error: error.code == "P2002" ? `${value.name} already exists` : "Failed",
    });
  }
});

// EDIT /
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Id must be a string" });
  }
  const { value, error } = productSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      error: `Missing fields: ${error.details.map(
        (detail) => detail.context.label
      )}`,
    });
  }

  try {
    const result = await editProduct(id, value);

    res.status(201).json({ message: "Success Product Updated", data: result });
  } catch (error) {
    console.log(error);
    switch (error.code) {
      case "P2002":
        res.status(400).json({ error: `Product already exists` });
        break;
      case "P2025":
        res.status(404).json({ error: "Product not found" });
        break;
      default:
        res.status(500).json({ error: "Failed" });
    }
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const newProduct = req.body;

  try {
    const result = await editProduct(id, newProduct);

    res.status(201).json({ message: "Success Product Updated", data: result });
  } catch (error) {
    console.log(error);
    switch (error.code) {
      case "P2002":
        res.status(400).json({ error: `${newProduct.name} already exists` });
        break;
      case "P2025":
        res.status(404).json({ error: "Product not found" });
        break;
      default:
        res.status(500).json({ error: "Failed" });
    }
  }
});

// DELETE /
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Id must be a string" });
  }
  try {
    const deleteProduct = await deleteProductById(id);

    res
      .status(200)
      .json({ message: "Success Product Deleted", data: deleteProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/", async (req, res) => {
  const deleteMultipleProducts = await deleteProducts();

  console.log({ deleteMultipleProducts });
  res.status(200).json({ message: "Success Product Deleted All" });
});

module.exports = router;
