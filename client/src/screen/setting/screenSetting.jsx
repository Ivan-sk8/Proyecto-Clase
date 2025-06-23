import { StyleSheet, Text, View } from "react-native";
import { useContext } from 'react';
import { estadologinGlobal } from '../../context/contextData';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React from "react";

export default function screenSetting() {
  const { logout } = useContext(estadologinGlobal); 
  return (
    <View style={styles.container}>
      <Button
        icon="robot-happy"
        mode="outlined"
        onPress={() => logout()}
        style={styles.minimalButton}
        labelStyle={styles.minimalLabel}
      >
        Logout
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
    minimalButton: {
        borderColor: '#4F8EF7',
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 2,
        elevation: 0,
    },
    minimalLabel: {
        color: '#4F8EF7',
        fontSize: 16,
        textTransform: 'none',
        fontWeight: '500',
    },
});