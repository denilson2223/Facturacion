let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
let productos = JSON.parse(localStorage.getItem('productos') || '[]');
let factura = {
    productos: [],
    cliente: null,
    subtotal: 0,
    iva: 0,
    total: 0
};

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function cargarClientes() {
    const select = document.getElementById('clienteFactura');
    select.innerHTML = clientes.map(c => `<option value="${c.nit}">${c.nombre}</option>`).join('');
    select.addEventListener('change', (e) => {
        const nit = e.target.value;
        factura.cliente = clientes.find(c => c.nit === nit);
    });
}

function guardarCliente() {
    const nit = document.getElementById('nit').value;
    const nombre = document.getElementById('nombreCliente').value;
    const direccion = document.getElementById('direccion').value;
    
    clientes.push({ nit, nombre, direccion });
    localStorage.setItem('clientes', JSON.stringify(clientes));
    cargarClientes();
}

function guardarProducto() {
    const codigo = document.getElementById('codigo').value;
    const nombre = document.getElementById('nombreProducto').value;
    const precio = parseFloat(document.getElementById('precio').value);
    
    productos.push({ codigo, nombre, precio });
    localStorage.setItem('productos', JSON.stringify(productos));
}

function actualizarTotales() {
    factura.subtotal = factura.productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    factura.iva = factura.subtotal * 0.13;
    factura.total = factura.subtotal + factura.iva;
    
    document.getElementById('subtotal').textContent = factura.subtotal.toFixed(2);
    document.getElementById('iva').textContent = factura.iva.toFixed(2);
    document.getElementById('total').textContent = factura.total.toFixed(2);
}

function agregarProducto() {
    const codigo = document.getElementById('codigoProducto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const producto = productos.find(p => p.codigo === codigo);
    
    if (producto && cantidad > 0) {
        factura.productos.push({ ...producto, cantidad });
        mostrarListaProductos();
        actualizarTotales();
    } else {
        alert("Producto no encontrado o cantidad inválida");
    }
}

function mostrarListaProductos() {
    const lista = document.getElementById('listaProductos');
    lista.innerHTML = factura.productos.map(p => 
        `<p>${p.nombre} - $${p.precio} x ${p.cantidad}</p>`
    ).join('');
}

function generarFactura() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.text(`Factura #${Date.now()}`, 10, 10);
    if (factura.cliente) {
        doc.text(`Cliente: ${factura.cliente.nombre}`, 10, 20);
    }
    factura.productos.forEach((p, i) => {
        doc.text(`${p.nombre} - $${p.precio} x ${p.cantidad}`, 10, 30 + (i * 10));
    });
    doc.save('factura.pdf');
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}
