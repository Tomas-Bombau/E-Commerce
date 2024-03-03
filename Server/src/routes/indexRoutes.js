const express = require("express")
const router = express.Router()
const productsRoute = require("../routes/products")
const cartsRoute = require("../routes/carts")



router.get("/", (req, res) => {
    res.send("HOME")
})

router.use("/products?", productsRoute)
router.use("/carts", cartsRoute)


module.exports = router