import { StyleSheet, Text, View } from 'react-native';
import { Card, Switch } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
1
// Componente individual para cada "puerta" en la lista
const PuertaItem = ({ puertaData, onToggle, apiEndpoint }) => {
  if (!puertaData) return null;

  const [estaAbierta, setEstaAbierta] = useState(puertaData.estado);

  const toggleSwitch = async () => {
    const estadoPrevio = estaAbierta;
    const nuevoEstado = !estaAbierta;
    setEstaAbierta(nuevoEstado);

    try {
      const response = await fetch(`${apiEndpoint}/api/puertas/${puertaData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`);
      }

      if (onToggle) {
        onToggle(puertaData.id, nuevoEstado);
      }
      console.log(`Puerta ${puertaData.id} actualizada en DB a: ${nuevoEstado}`);
    } catch (error) {
      console.error(`Error al actualizar la puerta ${puertaData.id}:`, error);
      setEstaAbierta(estadoPrevio);
    }
  };

  return (
    <Card style={puertaItemStyles.card}>
      <View style={puertaItemStyles.cardContent}>
        <MaterialCommunityIcons name={estaAbierta? 'door':'door-open'} size={24} color="#8A2BE2" style={puertaItemStyles.icon} />
        <Text style={puertaItemStyles.doorName}>{puertaData.nombre}</Text>
        <Switch
          value={estaAbierta}
          onValueChange={toggleSwitch}
          color="#8A2BE2"
        />
      </View>
      {/* Puedes agregar más detalles si lo deseas */}
    </Card>
  );
};

export default function puertasCasa() {
  const [puertas, setPuertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchPuertas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${api}/api/puertas`, { method: "GET" });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        const result = await response.json();
        setPuertas(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPuertas();
  }, []);

  const handleTogglePuerta = (idPuerta, nuevoEstado) => {
    setPuertas(prevPuertas =>
      prevPuertas.map(puerta =>
        puerta.id === idPuerta ? { ...puerta, estado: nuevoEstado } : puerta
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>puertasCasa</Text>
      <View style={styles.contentArea}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando datos de las puertas...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error al cargar las puertas: {error}</Text>
        ) : puertas.length > 0 ? (
          puertas.map(puerta => (
            <PuertaItem
              key={puerta.id}
              puertaData={puerta}
              onToggle={handleTogglePuerta}
              apiEndpoint={api}
            />
          ))
        ) : (
          <Text style={styles.noDataText}>No se encontraron datos para las puertas.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 50,
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
    paddingHorizontal: 8,
    paddingTop: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
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

const puertaItemStyles = StyleSheet.create({
  card: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: 8,
    marginHorizontal: 8,
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
  doorName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});