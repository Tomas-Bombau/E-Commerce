

const socket = io()

socket.on("newProduct", (products) => {

    const newprod = document.getElementById("container")

    newprod.innerHTML += 
    products.forEach(element => {
        `<ul>
            <li>Imagen: ${element.thumbnails}</li>
            <li>Producto: ${element.title}</li>
            <li>Descripción: ${element.description}}</li>
            <li>Precio: ${element.price}</li>
            <li>Stock: ${element.stock}}</li>
            <li>Categoria: ${element.category}</li>
    </ul>`
    });
    
})

