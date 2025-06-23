import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'; // Se añadió 'Alert'
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useContext, useState } from 'react'; // Se añadió 'useState' para gestionar estados
import { estadologinGlobal } from '../../context/contextData';

import React from 'react';

export default function Login() {
  // Estados para almacenar el email y la contraseña ingresados por el usuario
  const [email, setEmail] = useState(""); // Estado individual para email
  const [password, setPassword] = useState(""); // Estado individual para password
  // Estado para controlar si una operación de red está en curso (ej. envío de datos al servidor)
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga

  // Hook de navegación para cambiar entre pantallas
  const rutas = useNavigation();
  // Accede a la función 'login' del contexto global de autenticación
  const { login } = useContext(estadologinGlobal);

  // Define la URL base de tu API. Usa una variable de entorno o un fallback local.
  const api = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

  // Función asíncrona para manejar el intento de inicio de sesión
  const handlogin = async () => {
    // 1. Funcionalidad: Validación básica: Comprueba si los campos de email o contraseña están vacíos.
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos Vacíos', 'Por favor, ingresa tu correo electrónico y contraseña.');
      return; // Detiene la función si hay campos vacíos.
    }

    setLoading(true); // 2. Funcionalidad: Activa el estado de carga para deshabilitar botones y mostrar feedback.

    try {
      // Realiza la petición POST a la API de login
      const response = await fetch(`${api}/api/usuario/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indica que el cuerpo de la petición es JSON
        },
        body: JSON.stringify({ // Convierte el objeto de email y password a una cadena JSON
          email: email,
          password: password,
        }),
      });

      const data = await response.json(); // Parsea la respuesta del servidor (esperada en formato JSON)

      if (response.ok) { // Si la respuesta HTTP tiene un código de estado 2xx (éxito)
        // 3. Funcionalidad: Llama a la función global para cambiar el estado de autenticación de la aplicación
        login();
        // 4. Funcionalidad: Muestra un mensaje de éxito al usuario.
        Alert.alert('Éxito', '¡Inicio de sesión exitoso!');
        // 5. Funcionalidad: Limpia los campos del formulario después de un login exitoso.
        setEmail('');
        setPassword('');
        // Opcional: Navega a la pantalla principal de la aplicación.
        // Asegúrate de que 'nombreDeTuPantallaPrincipal' sea el nombre de la ruta definida en tu navegador.
        // rutas.replace('nombreDeTuPantallaPrincipal');

      } else { // Si la respuesta HTTP indica un error (ej. 401 Unauthorized, 400 Bad Request)
        // 6. Funcionalidad: Muestra un mensaje de error detallado, usando el mensaje del servidor si está disponible.
        Alert.alert('Error al iniciar sesión', data.message || 'Credenciales incorrectas. Intenta de nuevo.');
      }
    } catch (error) {
      // 7. Funcionalidad: Captura cualquier error que ocurra durante la petición (ej. problema de red, servidor no disponible).
      console.error("Error en la solicitud de login:", error); // Imprime el error completo para depuración.
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } finally {
      // 8. Funcionalidad: Siempre desactiva el estado de carga (loading), sin importar si la petición fue exitosa o fallida.
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Se mantiene el diseño original. Se adapta 'variant="displayLarge"' a 'style' para compatibilidad con Text de React Native. */}
      <Text style={{ fontSize: 40, fontWeight: 'bold' }}>LOGIN</Text>
      
      <TextInput
        label="Email"
        value={email} // Vincula el valor al estado 'email'
        onChangeText={setEmail} // Actualiza el estado 'email' cuando el texto cambia
        keyboardType="email-address" // 9. Funcionalidad: Sugiere un teclado optimizado para direcciones de correo electrónico.
        autoCapitalize="none" // Para evitar la capitalización automática en el email
        // El 'mode' de TextInput no se especifica aquí, por lo que usará el predeterminado de react-native-paper ('flat').
        // Si el diseño original implicaba 'outlined', se añadiría 'mode="outlined"'.
        // Tu código original no especificaba mode, por lo que se mantiene sin ello aquí.
      />
      <TextInput
        label="Password"
        value={password} // Vincula el valor al estado 'password'
        onChangeText={setPassword} // Actualiza el estado 'password' cuando el texto cambia
        secureTextEntry={true} // Oculta el texto ingresado (para contraseñas)
      />
      
      {/* Botón de registro */}
      <Button
        icon="robot-happy" // Mantiene el icono de tu diseño
        mode="outlined"
        onPress={() => rutas.push('crearcuenta')}
        disabled={loading} // 10. Funcionalidad: Deshabilita el botón si la operación de login está en curso.
      >
        register
      </Button>
      
      {/* Botón de login */}
      <Button
        icon="robot-happy" // Mantiene el icono de tu diseño
        mode="contained"
        onPress={handlogin} // Llama a la función de login cuando se presiona
        disabled={loading} // 11. Funcionalidad: Deshabilita el botón si la operación de login está en curso.
      >
        {/* 12. Funcionalidad: Muestra un texto diferente en el botón mientras está cargando. */}
        {loading ? 'Iniciando Sesión...' : 'login'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});