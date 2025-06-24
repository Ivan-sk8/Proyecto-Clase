const bd = require('../../BD/mysqlv2');
const TABLA = 'puertas';

function todos() {
  return bd.todos(TABLA);
}

function uno(id) {
  return bd.uno(TABLA, id);
}

function agregar(body) {
  // body debe tener: nombre, cantidad, estado
  return bd.agregar(TABLA, {
    nombre: body.nombre,
    cantidad: body.cantidad,
    estado: body.estado
  });
}

function eliminar(body) {
  return bd.eliminar(TABLA, body);
}

async function actualizarEstado(id, estado) {
    return bd.actualizarEstado(TABLA, id, estado);
}

module.exports = { todos, uno, agregar, eliminar, actualizarEstado };