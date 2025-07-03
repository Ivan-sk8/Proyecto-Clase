const bd = require('../../BD/mysqlv2')

const TABLA = 'usuario'

function todos() {
    return bd.todos(TABLA)
}

function uno(id) {
    return bd.uno(TABLA, id)
}

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; // Puedes usar 10 como nivel de complejidad


async function agregar(body) {
    const hashedPassword = await bcrypt.hash(body.pw, SALT_ROUNDS);
    const nuevoUsuario = {
        id: body.id,
        nombre: body.nombre,
        pw: hashedPassword,
        email: body.email,
        status: body.status
    }
    return bd.agregar(TABLA, nuevoUsuario)
}

function eliminar(body) {
    return bd.eliminar(TABLA, body)
}

async function login(body) {
    // bd.login debe buscar el usuario por email y devolver el usuario completo (incluyendo pw)
    const usuario = await bd.login(TABLA, body);
    if (!usuario) {
        return null;
    }
    // Compara la contraseña recibida con la guardada
    const match = await bcrypt.compare(body.password, usuario.pw);
    if (!match) {
        return null;
    }
    delete usuario.pw; // Opcional: no enviar la contraseña al frontend
    return usuario;
}

module.exports = {
    todos, uno, agregar, eliminar, login
}