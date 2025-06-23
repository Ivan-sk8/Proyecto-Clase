import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { estadoGlobal } from './contextData';

export default function StateGlobal({children}) {

    const [contador, setContador] = React.useState(0);

    const sumar = () => {
        setContador(contador + 1);
    }

    const restar = () => {
        setContador(contador - 1);
    }

  return (
      <estadoGlobal.Provider value={{ contador, sumar, restar }}>
        {children}
      </estadoGlobal.Provider>
  )
}
