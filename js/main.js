const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProducto = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
const irAPagar = document.querySelector("#ir-a-pagar");
const irAlCarrito = document.querySelector("#ir-al-carrito");

fetch("./data/productos.json")
    .then((resp) => resp.json())
    .then((data) => {
        mostrarProductos(data);
    });


function mostrarProductos(productos) {
    productos.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
        <img class="producto-img" src="${producto.img}" alt="">
        <h3>${producto.titulo}</h3>
        <p>$${producto.precio}</p>
        `;

        let button = document.createElement("button");
        button.classList.add("producto-btn");
        button.innerHTML = "Agregar al carrito";
        button.addEventListener("click", () => {
            agregarAlCarrito(producto);
        })

        div.append(button);
        contenedorProducto.append(div);
    });
}

const agregarAlCarrito = (producto) => {
    let productoCarrito = carrito.find((item) => item.id === producto.id);
    if (productoCarrito){
        productoCarrito.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1});
    }
    actualizarCarrito();

    Toastify({
        text: producto.titulo + " agregado",
        avatar: producto.img,
        duration: 1200,
        close: true,
        className: "toast-agregar",
        style: {
        background: "linear-gradient(to right, #F1F1F1, #0F3D3E)",
        width: "250px",
        },
    }).showToast();
}

function actualizarCarrito () {
    if (carrito.length === 0 ){
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        vaciarCarrito.classList.add("d-none");
        irAPagar.classList.add("d-none");
        irAlCarrito.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        vaciarCarrito.classList.remove("d-none");
        irAPagar.classList.remove("d-none");
        irAlCarrito.classList.remove("d-none");

        carritoProductos.innerHTML = "";
        carrito.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.titulo}</h3>
                <p>$${producto.precio}</p>
                <p>${producto.cantidad}</p>
                <p>$${(producto.cantidad) * (producto.precio)}</p>
            `;

            let button = document.createElement("button");
            button.classList.add("carrito-producto-btn");
            button.innerText = "⛔";
            button.addEventListener("click", () => {
                borrarDelCarrito(producto);
            });

            div.append(button);
            carritoProductos.append(div);
        });
    }
    actualizarTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
actualizarCarrito();

function borrarDelCarrito (producto) {
    const indice = carrito.findIndex((item) => item.id === producto.id);
    if (carrito[indice].cantidad > 1) {
        carrito[indice].cantidad--;
    } else {
        carrito.splice(indice, 1);
    }
    actualizarCarrito();

    Toastify({
        text: producto.titulo + " eliminado",
        avatar: producto.img,
        duration: 1200,
        close: true,
        className: "toast-agregar",
        style: {
        background: "linear-gradient(to right, #F1F1F1, #0F3D3E)",
        width: "280px",
        },
    }).showToast();
}

function actualizarTotal () {
    const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    carritoTotal.innerText = "$" + total;
}

vaciarCarrito.addEventListener("click", () => {
    const cantidadTotal = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    Swal.fire({
        title: "¿Estás seguro de vaciar todo el carrito?",
        text: "Se borrarán " + cantidadTotal + " productos.",
        icon: "question",
        showDenyButton: true,
        denyButtonText: "No",
        confirmButtonText: "Si"
    }).then ((result) => {
        if (result.isConfirmed){
            carrito.length = 0;
            actualizarCarrito();
            Swal.fire({
                icon: "success",
                title: "Carrito Vacío",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    })
});