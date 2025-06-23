import { StyleSheet, Text, View } from "react-native";
import { Card, Button } from "react-native-paper";
import { Icon, MD3Colors } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import React from "react";
const hola = "Hola Mundo";
const dark = true; // Cambia a true para el modo oscuro

export default function lucesCasa() {

  const rutas = useNavigation();
  // Puedes usar navigation para navegar a otras pantallas si es necesario
  // Por ejemplo: navigation.navigate('detallesHome');

  return (
    <View style={{ padding: 10 }}>
      <Card style={{ padding: 5, marginTop: 20 }}>
        <Icon source="camera" color={MD3Colors.error50} size={70} />
        <Button
          icon="arrow-right"
          mode={dark? "contained" : "outlined"}
          onPress={() => rutas.push("detallesHome")} //se agrega el parentesis para que envie solo cuando se presiona, si no se pone te envia de inmediato a donde quieres
          
          //con REMPLACE puedes cambiar la pantalla actual en lugar de agregar una pantalla nueva, util como en login o formularios donde no piensas regresar a esa pestaña
        >
          {hola}
        </Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({});
