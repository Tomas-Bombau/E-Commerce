const fs = require("fs");
path = require("path")
const filePathCart = path.join(__dirname, "../carritos.json")
const filePathProduct = path.join(__dirname, "../productos.json")

//! CREATE CART BY ID
 const createCart = async (req, res) => {
    try {
        const carts = await fs.promises.readFile(filePathCart);
        const allCarts = JSON.parse(carts);
    
        const idGenerator = parseInt(Math.random() * 1000);
    
        const newCart = {
          id: idGenerator,
          products: []
        }
    
        const idRepetead = allCarts.some(
            cart => cart.id === newCart.id
          );

        if (idRepetead) {
        res.status(400);
        res.json({ error: "Repetead ID, try again" });
        return;
        }
    
        allCarts.push(newCart)
        const cartsToSave = JSON.stringify(allCarts, null, "\t")
        await fs.promises.writeFile(filePathCart, cartsToSave);
        res.status(201).json({ status: "Cart created successfully", newCart: newCart });
    } catch (error) {
        res.send(error)
    }
}

//! GET CART BY ID
const getCartById = async (req, res) => {
    const cid = +req.params.cid
    
    try {
      if(isNaN(cid)){
        res.status(400).json({ error: "Invalid product Id" });
        return;
      }
      const carts = await fs.promises.readFile(filePathCart);
      const allCarts = JSON.parse(carts);

      const findCart = allCarts.find(cart => cart.id === cid)
      if(!findCart){
        res.status(404).json({error: "Cart not found"})
        return
      }
      const productsInCart = findCart.products
      res.status(200).json(productsInCart)
    } catch (error) {
      res.send(error)
    }
}

const insertProductIntoCart = async (req, res) => {
  const cid = +req.params.cid
  const pid = +req.params.pid

  try {
    if(isNaN(cid) || isNaN(pid)){
      res.status(400).json({ error: isNaN(cid) ? `Invalid cart Id` : "Invalid product Id" });
        return;
    }

    const carts = await fs.promises.readFile(filePathCart);
    const allCarts = JSON.parse(carts);
    const findCart = allCarts.find(cart => cart.id === cid)

    const products = await fs.promises.readFile(filePathProduct);
    const allProducts = JSON.parse(products);
    const findProduct = allProducts.find(product => product.id === pid)

    if(!findCart || !findProduct){
      res.status(404).json({error: !findCart ? `Cart not found` : "Product not found"})
      return
    }

    const productsInCart = findCart.products
    const findProductInCart = productsInCart.findIndex(product => product.pid === pid)

    if(findProductInCart < 0){
      productsInCart.push({pid: pid, quantity: 1})
    } else {
      productsInCart[findProductInCart] = {...productsInCart[findProductInCart], quantity: productsInCart[findProductInCart].quantity + 1}
    }

    const productAddedToCart = JSON.stringify(allCarts, null, "\t")
    await fs.promises.writeFile(filePathCart, productAddedToCart)
    res.status(201).json({status:"Product added to cart successfully", addedProductId: pid })
  } catch (error) {
    res.send(error)
  }
}
 
 
module.exports = {getCartById, createCart, insertProductIntoCart}