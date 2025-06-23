import { View, Text } from 'react-native'
import React from 'react'
import { estadologinGlobal } from './contextData';
import { useState } from 'react';

export default function StateLogin({children}) {
    const [perfil, setPerfil] = useState()
    const [isLogin, setisLogin] = useState(false)
    
    const login = () => {
        setisLogin(true)
        
    }

    const logout = () => {
        setisLogin(false)
    }

  return (
    <estadologinGlobal.Provider value={{ perfil, isLogin, login, logout }}>
        {children}
    </estadologinGlobal.Provider>
  )
}