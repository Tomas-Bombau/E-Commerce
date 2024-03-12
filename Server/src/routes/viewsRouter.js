const express = require("express")
const router = express.Router()
const { Server } = require("socket.io")
const fs = require("fs")
const path = require("path"); 
filePath = path.join(__dirname, "../productos.json")


router.get("/", async (req, res) => {
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

router.get("/realtimeproducts", async (req, res) => {
    try {
 
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

module.exports = router