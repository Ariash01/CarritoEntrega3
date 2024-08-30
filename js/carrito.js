let carritoLS = JSON.parse(localStorage.getItem("carrito")) || []; 

const vaciarCarrito = document.querySelector("#vaciar-carrito");
const carritoTotal = document.querySelector("#carrito-total");
const paginaCarritos = document.querySelector("#pagina-carrito");
const formulario = document.querySelector("#formulario");


function actualizarTotal() {
    const total = carritoLS.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    carritoTotal.innerText = "$" + total;
}


function mostrarProductos() {
    paginaCarritos.innerHTML = "";

    carritoLS.forEach(producto => {
        let div = document.createElement("div");
        div.classList.add("pagina-carrito-producto");
        div.innerHTML = `
            <img src="${producto.img}" alt="">
            <h2>${producto.titulo}</h2>
            <p>$${producto.precio.toLocaleString()}</p>
            <p>${producto.cantidad}</p>
            <p>$${producto.cantidad * producto.precio}</p>
        `;
        paginaCarritos.append(div);
    });
    actualizarTotal();
}


function actualizarCarrito() {
    if (carritoLS.length === 0) {
        paginaCarritos.classList.add("d-none");
        vaciarCarrito.classList.add("d-none");
    } else {
        paginaCarritos.classList.remove("d-none");
        vaciarCarrito.classList.remove("d-none");
    }
    mostrarProductos();
}


formulario.addEventListener("submit", (event) => {
    event.preventDefault(); 

    if (formulario.checkValidity()) {
        const cantidadTotal = carritoLS.reduce((acc, prod) => acc + prod.cantidad, 0);
        Swal.fire({
            title: "¿Estás seguro de vaciar todo el carrito?",
            text: "Se borrarán " + cantidadTotal + " productos.",
            icon: "question",
            showDenyButton: true,
            denyButtonText: "No",
            confirmButtonText: "Sí"
        }).then((result) => {
            if (result.isConfirmed) {
                carritoLS.length = 0;
                localStorage.setItem("carrito", JSON.stringify(carritoLS));
                actualizarCarrito();
                Swal.fire({
                    icon: "success",
                    title: "Carrito Vacío",
                    showConfirmButton: false,
                    timer: 1500,
                }).then (() => {
                    window.location.href = "./index.html"
                });
                formulario.reset();
            }
        });
    } else {
        formulario.reportValidity();
    }
});

actualizarCarrito();