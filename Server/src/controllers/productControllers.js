const fs = require("fs");
path = require("path")
filePath = path.join(__dirname, "../productos.json")

//! GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await fs.promises.readFile(filePath);
    const allProducts = JSON.parse(products);
    if (!limit) {
      res.status(200);
      res.json(allProducts);
    } else {
      const limitedProducts = allProducts.slice(0, limit);
      res.status(200);
      res.json(limitedProducts);
    }
  } catch (error) {
    res.send(error);
  }
};


//! GET PRODUCT BY ID
const getProductById = async (req, res) => {
  const pid = +req.params.pid;
  try {
    if (isNaN(pid)) {
      res.status(400).json({ error: "Invalid product Id" });
      return;
    }

    const products = await fs.promises.readFile(filePath);
    const allProducts = JSON.parse(products);
    const productFound = allProducts.find((p) => p.id === pid);

    if (!productFound) {
      res.status(404);
      res.json({ error: "Product not found" });
      return;
    }
    res.status(200).json(productFound);
  } catch (error) {
    res.send(error);
  }
};


//! CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;

    if (
      !title ||
      !description ||
      !code ||
      (!price && price != 0) ||
      !category ||
      (!stock && stock != 0)
    ) {
      res.status(400).json({ error: "Some data is missing" });
      return;
    }

    if(thumbnails && typeof thumbnails !== "object"){
      res.status(400).json({ error: "Thumbnails must be an array" });
      return;
    }

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof code !== "string" ||
      typeof category !== "string"
    ) {
      res.status(400).json({
        error: "Title, description, code and category must be strings",
      });
      return;
    }

    if (
      typeof price !== "number" ||
      typeof stock !== "number" ||
      price < 0 ||
      stock < 0
    ) {
      res
        .status(400)
        .json({ error: "Price and stock must be numbers bigger than 0" });
      return;
    }

    const idGenerator = parseInt(Math.random() * 1000);

    const newProduct = {
      id: idGenerator,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails,
    };

    const products = await fs.promises.readFile(filePath);
    const allProducts = JSON.parse(products);
    const idRepetead = allProducts.some(
      product => product.id === newProduct.id
    );
    if (idRepetead) {
      res.status(400);
      res.json({ error: "Repetead ID, try again" });
      return;
    }

    allProducts.push(newProduct);
    const productsToSave = JSON.stringify(allProducts, null, "\t");
    await fs.promises.writeFile(filePath, productsToSave);
    res
      .status(201)
      .json({ status: "Product created successfully", newProduct: newProduct });
  } catch (error) {
    res.send(error);
  }
};


//! UPDATE PRODUCT
const updateProduct = async (req, res) => {
  const pid = +req.params.pid
  const productData = req.body
  try {
   if (isNaN(pid)) {
      res.status(400).json({ error: "Invalid product Id" });
      return;
    }

    if (
      typeof productData.title !== "string" ||
      typeof productData.description !== "string" ||
      typeof productData.code !== "string" ||
      typeof productData.category !== "string"
    ) {
      res.status(400).json({
        error: "Title, description, code and category must be strings",
      });
      return;
    }

    if (
      typeof productData.price !== "number" ||
      typeof productData.stock !== "number" ||
      productData.price < 0 ||
      productData.stock < 0
    ) {
      res
        .status(400)
        .json({ error: "Price and stock must be numbers bigger than 0" });
      return;
    }
   
    const products = await fs.promises.readFile(filePath);
    const allProducts = JSON.parse(products); 
    const productToUpdate =  allProducts.findIndex(p => p.id === pid)

    if (productToUpdate < 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }



    allProducts[productToUpdate] = {...allProducts[productToUpdate], ...productData}


    const updatedProducts = JSON.stringify(allProducts, null, "\t")
    await fs.promises.writeFile(filePath, updatedProducts);
    res.status(201).json({ status: "Product updated successfully"})
  } catch (error) {
   res.send(error)
  }
};





//! DELETE PRODUCT
const deleteProduct = async (req, res) => {
  const pid = +req.params.pid;

  try {
    if (isNaN(pid)) {
      res.status(400).json({ error: "Invalid product Id" });
      return;
    }

    const products = await fs.promises.readFile(filePath);
    const allProducts = JSON.parse(products);
    const foundProduct = allProducts.findIndex((p) => p.id === pid);

    if (foundProduct < 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    allProducts.splice(foundProduct, 1);
    const newProductArray = JSON.stringify(allProducts, null, "\t");
    await fs.promises.writeFile(filePath, newProductArray);
    res.status(200).json({
      status: "Product deleted successfully",
      newProductArray: allProducts,
    });
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
