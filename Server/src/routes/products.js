const express = require("express")
const router = express.Router()
const productControllers = require("../controllers/productControllers.js")


router.get("/", productControllers.getAllProducts)
router.get("/:pid", productControllers.getProductById)
router.post("/", productControllers.createProduct)
router.put("/:pid", productControllers.updateProduct)
router.delete("/:pid", productControllers.deleteProduct)


module.exports = router