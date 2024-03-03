const express = require("express")
const router = express.Router()
const cartControllers = require("../controllers/cartControllers.js")


router.get("/:cid", cartControllers.getCartById)
router.post("/:cid/products/:pid", cartControllers.insertProductIntoCart)
router.post("/", cartControllers.createCart)

// router.post("/:cdi/product/:pid", cartControllers.getCartById)


module.exports = router

