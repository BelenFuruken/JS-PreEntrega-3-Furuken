// Variables
const baseDeDatos = [
    {
        id: 1,
        nombre: 'Remera',
        precio: 8000,
        imagen: '../img/remera.JPG'
    },
    {
        id: 2,
        nombre: 'Short',
        precio: 12000,
        imagen: '../img/short.JPG'
    },
    {
        id: 3,
        nombre: 'Hoodies',
        precio: 20000,
        imagen: '../img/hoodie.JPG'
    },
    {
        id: 4,
        nombre: 'Casacas',
        precio: 17000,
        imagen: '../img/casaca.JPG'
    }

];

let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-comprar');
const DOMbotonBorrarTodo = document.querySelector('#boton-eliminar-todo');

// Funciones:

//Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
function renderizarProductos() {
    // Por cada elemento del array de objetos "baseDeDatos" voy a generar
    // todo esto (que es la estructura de la tarjeta de cada producto)
    baseDeDatos.forEach((info) => {
        // Estructura
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
        // Body
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
        // Titulo
        const miNodoTitle = document.createElement('h6');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = info.nombre;
        // Imagen
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', info.imagen);
        // Precio
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${info.precio}${divisa}`;
        // Boton 
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary');
        miNodoBoton.textContent = '+';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', aniadirProductoAlCarrito);
        // Insertamos
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}

// Evento para añadir un producto al carrito de la compra
function aniadirProductoAlCarrito(evento) {
    // Añadimos el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute('marcador'))
    console.log("el carrito guardo: "+carrito);
    // Actualizamos el carrito 
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();
}

//Dibuja todos los productos guardados en el carrito
function renderizarCarrito() {
    // Vaciamos todo el html
    DOMcarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos (es decir, 
        //con el numero de id guardado en el array de carritos bucamos la informacion
        // que contiene).
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
            return itemId === item ? total += 1 : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        //con la informacion entera completamos:
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio*numeroUnidadesItem}${divisa}`;
        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        // Mezclamos nodos
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
}

//Evento para borrar un elemento del carrito
function borrarItemCarrito(evento) {
    //PREGUNTA PARA CONFIRMAR CON SWEET ALERT
    Swal.fire({
        title: 'Seguro desea borrarlo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Articulo eliminado con éxito',
            icon: 'success'
        })
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
        }
      })
    
}

// Calcula el precio total teniendo en cuenta los productos repetidos
function calcularTotal() {
    // Recorremos el array del carrito 
    return carrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        return total + miItem[0].precio;
    }, 0).toFixed(2);
}

// Varia el carrito y vuelve a dibujarlo
function Comprar() {
    const chequearCompra = (rta) =>{
        return new Promise ((resolve,reject) => {
            if (carrito.length == 0){
                reject("El carrito esta vacio");
            }else {
                resolve(carrito.length);
            }
        })
    }
    chequearCompra().then((cant)=>{
        Swal.fire(
            'Su compra ha sido realizado con éxito!',
            'Cantidad: '+cant+' elementos',
            'success'
        //Promesa favorable.  
        )
    }).catch((error)=>{
        Swal.fire({
            icon: 'error',
            title: 'No tiene nada en su carrito de compras',
        //Promesa desfavorable.
        })
    })
}

function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
    // Borra LocalStorage
    localStorage.clear();

}

function guardarCarritoEnLocalStorage () {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage () {
    // ¿Existe un carrito previo guardado en LocalStorage?
    if (localStorage.getItem('carrito') !== null) {
        // Carga la información
        carrito = JSON.parse(localStorage.getItem('carrito'));
    }
}

// Eventos
DOMbotonVaciar.addEventListener('click', Comprar);
DOMbotonBorrarTodo.addEventListener('click',vaciarCarrito);


// Inicio
cargarCarritoDeLocalStorage();   
renderizarProductos();
renderizarCarrito();