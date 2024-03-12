const express = require("express")
const router = express.Router()
const { Server } = require("socket.io")
const fs = require("fs")
const path = require("path"); 
filePath = path.join(__dirname, "../productos.json")


router.get("/home", async (req, res) => {
    try {
        const products = await fs.promises.readFile(filePath, "utf-8")
        const allProducts = JSON.parse(products)
        res.render("home", {
            allProducts
        })
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get("/realtimeproducts", async (_, res) => {
    try {
        const products = await fs.promises.readFile(filePath, "utf-8")
        const allProducts = JSON.parse(products)
        res.render("realTimeProducts", {
            allProducts,
            useWS: true,
            scripts: [
                "realTimeProducts.js"
            ]
        })
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.post("/realtimeproducts", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

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
    
        req.app.get("ws").emit("newProduct", newProduct)
        res.status(201).json({ status: "Product created successfully", newProduct: newProduct });
    } catch (error) {
      res.status(500).json({message: error.message})
  }}
)

module.exports = router