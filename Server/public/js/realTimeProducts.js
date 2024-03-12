

const socket = io()

socket.on("newProduct", (product) => {
    const container = document.getElementById("container")

    container.innerHTML += `
        <div>
            <ul>
                <li>Imagen: ${product.thumbnails}</li>
                <li>Producto: ${product.title}</li>
                <li>Descripción: ${product.description}</li>
                <li>Precio: ${product.price}</li>
                <li>Stock: ${product.stock}</li>
                <li>Categoria: ${product.category}</li>
            </ul>
        </div>
    `
    
})



