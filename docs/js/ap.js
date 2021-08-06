const formulario = document.querySelector('#formulario');
const viajeListado = document.querySelector('#lista ul');
const boton = document.querySelector('#boton')

evenListeners();
function evenListeners (){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto)
}


class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante()
    }
    calcularRestante (){
        const gastado = this.gastos.reduce((total, gasto) => total+Number(gasto.costo), 0 );
        this.restante = this.presupuesto-Number(gastado);
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter ( gasto => gasto.id !== id)
        this.calcularRestante()
    }

}

class UI {
    insertarPresupuesto(cantidad) {
        const { presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta (mensaje, tipo){
        const mensajeDiv = document.createElement('div')
        mensajeDiv.classList.add('text-center', 'alert')
        if (tipo === 'error') {
            mensajeDiv.classList.add('alert-danger')
        } else {
            mensajeDiv.classList.add('alert-success')
        }
        mensajeDiv.textContent = mensaje;
        document.querySelector('.cotizacion').insertBefore(mensajeDiv, boton)

        setTimeout(() => {
            mensajeDiv.remove();
        }, 2000);
    }

    mostrarGastos(gastos) {

        this.limpiarHTML();

        gastos.forEach(gasto => {
            const {destino, transporte, hospedaje, costo, id} = gasto;

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            console.log(nuevoGasto)
            nuevoGasto.innerHTML = `Destino: ${destino} <br> Tipo transporte: ${transporte} <br> Hotel: ${hospedaje} <br> Costo: ${costo}`

            const btnBorrar = document.createElement('button')
            btnBorrar.className = 'btn btn-danger borrar-gasto'
            btnBorrar.innerHTML = 'Borrar &times'
            btnBorrar.onclick = () => {
                eliminarGasto(id)
            }
            nuevoGasto.appendChild(btnBorrar);
            viajeListado.appendChild(nuevoGasto)
        })
    }
    limpiarHTML(){
        while(viajeListado.firstChild){
            viajeListado.removeChild(viajeListado.firstChild)
        }
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante ;
        console.log(restante)
    }
    comprobarPresupuesto (presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante')

        if ((presupuesto/4)>restante) {
            restanteDiv.classList.remove('alert-warning')
            restanteDiv.classList.add('alert-danger')
        } else if ((presupuesto/2)>restante){
            restanteDiv.classList.remove('alert-danger');
            restanteDiv.classList.add('alert-warning')
        } else {
            restanteDiv.classList.remove('alert-warning', 'alert-danger')
        }
        if (restante<= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado');
            formulario.querySelector('input[type="submit"]').disabled = true;
        }
    }
}


const ui = new UI();
let presupuesto;


function preguntarPresupuesto (){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto de viaje?')
    if (presupuestoUsuario <= 0 || presupuestoUsuario === '' || isNaN(presupuestoUsuario) ) {
    window.location.reload()
    }
    presupuesto = new Presupuesto(presupuestoUsuario)
    ui.insertarPresupuesto(presupuesto)
}

function agregarGasto (e){
    e.preventDefault()
    const destinoSelect = document.querySelector('#destinos')
    const destino = destinoSelect.options[destinoSelect.selectedIndex].text
    const transporteSelect  = document.querySelector('#transporte')
    const transporte = transporteSelect.options[transporteSelect.selectedIndex].text
    const hospedajeSelect = document.querySelector('#hospedaje')
    const hospedaje = hospedajeSelect.options[hospedajeSelect.selectedIndex].text
    let costo;
     if (destino == 'Colombia' & hospedaje == 'Hotel 3 estrellas'){ costo = 200; } else if (destino == 'Colombia' & hospedaje == 'Hotel 4 estrellas') {costo = 300} else if (destino == 'Colombia' & hospedaje == 'Hotel 5 estrellas') {costo = 400} else if (destino == 'Mexico' & hospedaje == 'Hotel 3 estrellas'){ costo = 250; } else if (destino == 'Mexico' & hospedaje == 'Hotel 4 estrellas') {costo = 350} else if (destino == 'Mexico' & hospedaje == 'Hotel 5 estrellas') {costo = 400} else if (destino == 'Grecia' & hospedaje == 'Hotel 3 estrellas'){ costo = 300; } else if (destino == 'Grecia' & hospedaje == 'Hotel 4 estrellas') {costo = 400} else if (destino == 'Grecia' & hospedaje == 'Hotel 5 estrellas') {costo = 500} else if (destino == 'Francia' & hospedaje == 'Hotel 3 estrellas'){ costo = 300; } else if (destino == 'Francia' & hospedaje == 'Hotel 4 estrellas') {costo = 400} else if (destino == 'Francia' & hospedaje == 'Hotel 5 estrellas') {costo = 500}
     

     if ( destino === '-Seleccionar-' || transporte === '-Seleccionar-' || hospedaje === '-Seleccionar-' ){
         ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
         return;
     } else { ui.imprimirAlerta('Cotización exitosa')}

    const gasto = {destino, transporte, hospedaje, id: Date.now(), costo}
   
    presupuesto.nuevoGasto(gasto);

    const {gastos, restante} = presupuesto
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)

    formulario.reset()
}

function eliminarGasto (id) {
    presupuesto.eliminarGasto(id)

    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}