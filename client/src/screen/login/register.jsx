import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'; // Se añadió 'Alert' para mensajes de usuario
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; // Se mantiene si los botones lo usan
import { useContext, useState } from 'react'; // Se añadió 'useState' para gestionar estados
import { estadologinGlobal } from '../../context/contextData';

import React from 'react';

// El componente ahora se llama 'CrearCuenta' (o 'Register' si prefieres) y contiene la lógica de registro.
export default function CrearCuenta() {
  // Estados para los campos del formulario de registro y el indicador de carga
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga

  // Hook de navegación para cambiar entre pantallas
  const rutas = useNavigation();
  // Se mantiene el contexto global aunque la función 'login' no se use directamente aquí.
  const { login } = useContext(estadologinGlobal);

  // Define la URL base de tu API
  const api = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

  // Función asíncrona para manejar el registro de un nuevo usuario
  const handRegister = async () => {
    // 1. Funcionalidad: Validación básica: Comprueba si los campos están vacíos.
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Campos Vacíos', 'Por favor, completa todos los campos (Nombre, Correo y Contraseña).');
      return; // Detiene la función si hay campos vacíos.
    }

    setLoading(true); // 2. Funcionalidad: Activa el estado de carga para deshabilitar botones y mostrar feedback.

    try {
      // 3. Funcionalidad: Realiza la petición POST a la API para agregar un nuevo usuario
      const response = await fetch(`${api}/api/usuario/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indica que el cuerpo de la petición es JSON
        },
        body: JSON.stringify({ // Convierte los datos del formulario a una cadena JSON
          "id": 0, // Se usa 'id: 0' según tu ejemplo de Postman para agregar.
                   // Si tu 'id' en la DB es AUTO_INCREMENT, es mejor omitir este campo.
          "nombre": nombre,
          "pw": password, // Asumiendo que 'pw' es el nombre del campo para contraseña en tu backend
          "email": email,
          "status": 1 // Asumiendo que el status por defecto para un nuevo usuario es 1 (activo)
        }),
      });

      const data = await response.json(); // Parsea la respuesta del servidor (esperada en formato JSON)

      // 4. Funcionalidad: Verifica si el registro fue exitoso según la respuesta del servidor.
      // Se asume éxito si response.ok es true y el backend indica que filas fueron afectadas.
      if (response.ok && data.body && data.body.resultado && data.body.resultado.affectedRows > 0) {
        Alert.alert('Registro Exitoso', '¡Tu cuenta ha sido creada con éxito! Ahora puedes iniciar sesión.'); // Mensaje de éxito
        setNombre(''); // 5. Funcionalidad: Limpia los campos del formulario.
        setEmail('');
        setPassword('');
        // 6. Funcionalidad: Redirige al usuario a la pantalla de login después del registro exitoso.
        rutas.replace('Login'); // Asume que tu ruta de login se llama 'Login'.

      } else { // Si la respuesta HTTP indica un error o no se afectaron filas.
        // 7. Funcionalidad: Muestra mensaje de error, usando el mensaje del servidor si está disponible.
        const serverMessage = data.message || (data.body && data.body.resultado && data.body.resultado.info) || 'No se pudo crear la cuenta.';
        Alert.alert('Error al Registrar', serverMessage);
      }
    } catch (error) {
      // 8. Funcionalidad: Captura errores de red (ej. servidor no disponible).
      console.error("Error en la solicitud de registro:", error); // Imprime el error completo para depuración.
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } finally {
      // 9. Funcionalidad: Siempre desactiva el estado de carga (loading), sin importar el resultado.
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* DISEÑO: Título principal. Se replica el estilo del segundo ejemplo. */}
      <Text style={{ fontSize: 40, fontWeight: 'bold' }}>REGISTRAR</Text> {/* Adaptado de "LOGIN" */}
      
      {/* DISEÑO: Campo para el nombre. Se replica el estilo de los TextInput del segundo ejemplo. */}
      <TextInput
        label="Nombre Completo"
        value={nombre}
        onChangeText={setNombre}
        // No se especifica 'mode' ni 'leftIcon' para replicar el diseño simple del segundo ejemplo
      />
      {/* DISEÑO: Campo para el correo electrónico. Se replica el estilo de los TextInput del segundo ejemplo. */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" // Funcionalidad: Teclado optimizado para email.
        autoCapitalize="none" // Para evitar la capitalización automática.
      />
      {/* DISEÑO: Campo para la contraseña. Se replica el estilo de los TextInput del segundo ejemplo. */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // Oculta el texto ingresado.
      />
      
      {/* DISEÑO: Botón para iniciar sesión (que en este componente es un enlace para volver). */}
      {/* Se replica el estilo del botón "register" del segundo ejemplo. */}
      <Button
        icon="robot-happy" // Mantiene el icono de tu diseño.
        mode="outlined"
        onPress={() => rutas.push('Login')} // Funcionalidad: Navega a la pantalla de Login.
        disabled={loading} // Funcionalidad: Deshabilita el botón mientras se carga.
      >
        ¿Ya tienes cuenta? Inicia sesión {/* Texto adaptado para el enlace de login */}
      </Button>
      
      {/* DISEÑO: Botón de registro (principal de este componente). */}
      {/* Se replica el estilo del botón "login" del segundo ejemplo. */}
      <Button
        icon="robot-happy" // Mantiene el icono de tu diseño.
        mode="contained"
        onPress={handRegister} // Funcionalidad: Llama a la función de registro.
        disabled={loading} // Funcionalidad: Deshabilita el botón mientras se carga.
      >
        {/* Funcionalidad: Muestra un texto diferente en el botón mientras está cargando. */}
        {loading ? 'Registrando...' : 'Registrarse'}
      </Button>
    </View>
  );
}

// DISEÑO: Estilos copiados directamente del segundo componente (Register) para asegurar la consistencia.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
