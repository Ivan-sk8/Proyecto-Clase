import { StyleSheet, Text, View } from 'react-native';
import { Card, Switch, Icon, MD3Colors } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';

// Componente individual para cada "luz" o dispositivo en la lista
const LuzItem = ({ luzData, onToggle, apiEndpoint }) => {
  // Si no hay datos de luz, no renderiza nada
  if (!luzData) {
    return null;
  }

  // Estado local para el interruptor, inicializado con el estado de la luz que viene de la API
  const [estaEncendida, setEstaEncendida] = useState(luzData.estado);

  // Función que se ejecuta cuando el interruptor cambia de valor
  const toggleSwitch = async () => {
    const estadoPrevio = estaEncendida; // Guardar el estado actual antes de cambiarlo
    const nuevoEstado = !estaEncendida;

    setEstaEncendida(nuevoEstado); // 1. Actualiza el estado local del interruptor inmediatamente para feedback rápido

    try {
      // 2. Realiza la llamada a la API para actualizar el estado en la base de datos
      const response = await fetch(`${apiEndpoint}/api/luces/${luzData.id}`, {
        method: 'PUT', // O 'PATCH' si tu API solo espera el cambio de estado
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }), // Envía el nuevo estado al backend
      });

      if (!response.ok) {
        // Si la respuesta de la API no es OK, lanza un error
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`);
      }

      // Si la API responde OK, llama a la función 'onToggle' del padre si existe
      // Esto puede ser útil si el padre necesita actualizar su estado o logs.
      if (onToggle) {
        onToggle(luzData.id, nuevoEstado);
      }
      console.log(`Luz ${luzData.id} actualizada en DB a: ${nuevoEstado}`);

    } catch (error) {
      // 3. Si hay un error en la llamada a la API, revierte el estado del interruptor en la UI
      console.error(`Error al actualizar la luz ${luzData.id}:`, error);
      setEstaEncendida(estadoPrevio); // Revierte el estado del interruptor en la UI
      // Opcional: Mostrar una alerta al usuario sobre el fallo
      // Alert.alert('Error', `No se pudo actualizar la luz ${luzData.nombre}. Por favor, inténtalo de nuevo.`);
    }
  };

  return (
    <Card style={luzItemStyles.card}>
      <View style={luzItemStyles.cardContent}>
        {/* Ícono de campana, con el color morado de la imagen */}
        <MaterialCommunityIcons name="bell" size={24} color="#8A2BE2" style={luzItemStyles.icon} />
        {/* Texto con el nombre de la luz, extraído directamente del campo 'nombre' de la base de datos */}
        <Text style={luzItemStyles.lightName}>{luzData.nombre}</Text>
        {/* Interruptor (Switch) */}
        <Switch
          value={estaEncendida}
          onValueChange={toggleSwitch}
          color="#8A2BE2" // Color del interruptor cuando está encendido
        />
      </View>
      {/* Se elimina la sección de detalles (ID, Cantidad) según la solicitud */}
    </Card>
  );
};


export default function lucesCasa() {
  // Estado para la lista de luces que se obtendrá de la API (ahora un array)
  const [luces, setLuces] = useState([]); // Cambiado a un array vacío
  const [loading, setLoading] = useState(true); // Estado para controlar la carga de la API
  const [error, setError] = useState(null); // Estado para manejar errores de la API

  // Define la URL base de tu API
  const api = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

  // useEffect para realizar la llamada a la API al montar el componente
  useEffect(() => {
    const fetchLuces = async () => { // Renombrado a fetchLuces (plural)
      try {
        setLoading(true); // Activa el estado de carga
        setError(null); // Limpia errores previos
        // Modificado el endpoint para obtener TODAS las luces (asumiendo que /api/luces devuelve un array)
        const response = await fetch(`${api}/api/luces`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        // Asegúrate de que 'result' sea un array o conviértelo a uno si es un objeto con una propiedad de array.
        // Por ejemplo, si tu API devuelve { data: [...] }, usarías result.data.
        setLuces(result); // Guarda los datos de las luces en el estado
      } catch (err) {
        console.error("Error al obtener datos de las luces:", err);
        setError(err.message); // Almacena el mensaje de error
      } finally {
        setLoading(false); // Desactiva el estado de carga
      }
    };

    fetchLuces(); // Llama a la función de fetch
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Función que se pasará a LuzItem para manejar el cambio de estado de una luz específica
  const handleToggleLuz = (idLuz, nuevoEstado) => {
    console.log(`Luz con ID: ${idLuz} cambió a: ${nuevoEstado}. La actualización de la DB se maneja en LuzItem.`);
    // Opcional: si necesitas que el componente padre sepa el estado más reciente de la luz
    // y quieres una actualización optimista sin refetch, puedes actualizar el array 'luces' aquí:
    setLuces(prevLuces =>
      prevLuces.map(luz =>
        luz.id === idLuz ? { ...luz, estado: nuevoEstado } : luz
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Encabezado "lucesCasa" */}
      <Text style={styles.headerTitle}>lucesCasa</Text>
      
      <View style={styles.contentArea}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando datos de las luces...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error al cargar las luces: {error}</Text>
        ) : luces.length > 0 ? ( // Verifica si hay luces para renderizar
          // Si los datos de las luces se cargaron, mapea sobre el array y renderiza un LuzItem para cada una
          luces.map(luz => (
            <LuzItem
              key={luz.id} // Asegúrate de que cada luz tenga un 'id' único para la key
              luzData={luz} // Pasa el objeto completo de la luz
              onToggle={handleToggleLuz}
              apiEndpoint={api} // <--- Pasar la URL base de la API al componente hijo
            />
          ))
        ) : (
          <Text style={styles.noDataText}>No se encontraron datos para las luces.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Un fondo claro
    paddingTop: 50, // Espacio para la barra de estado superior
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 8, // Espacio a los lados de las tarjetas
    // Removido alignItems y justifyContent para permitir que las tarjetas fluyan verticalmente
    // según el tamaño de la lista
    paddingTop: 20, // Espacio superior para la tarjeta
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center', // Centra el texto de carga
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

const luzItemStyles = StyleSheet.create({
  card: {
    width: '95%', // La tarjeta ocupa la mayor parte del ancho disponible
    alignSelf: 'center', // Centra la tarjeta si el contenedor no lo hace
    marginVertical: 8,
    marginHorizontal: 8, // Margen horizontal ajustado para mantener el 95% de ancho
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: 'white',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 15,
  },
  lightName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  // La sección 'details' y 'detailText' se eliminaron de los estilos
  // ya que la sección 'details' fue removida del JSX de LuzItem.
});
