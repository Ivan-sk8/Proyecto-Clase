import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { estadoGlobal } from '../../context/contextData'
import { Card, Button, Divider } from 'react-native-paper';

export default function screenHome() {
  const { contador, sumar, restar } = useContext(estadoGlobal);

  return (
    <View style={styles.container}>
      <Card style={styles.card} elevation={3}>
        <Card.Title title="Home" subtitle="Pantalla principal" />
        <Divider />
        <Card.Content>
          <Text style={styles.label}>Contador:</Text>
          <Text style={styles.counter}>{contador}</Text>
          <View style={styles.buttonRow}>
            <Button mode="contained" onPress={sumar} style={styles.buttonPlus}>
              Sumar
            </Button>
            <Button mode="outlined" onPress={restar} style={styles.buttonMinus}>
              Restar
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 12,
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    color: '#22223b',
    marginTop: 10,
    marginBottom: 2,
  },
  counter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 18,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  buttonPlus: {
    borderRadius: 8,
    marginRight: 8,
  },
  buttonMinus: {
    borderRadius: 8,
    marginLeft: 8,
  },
});