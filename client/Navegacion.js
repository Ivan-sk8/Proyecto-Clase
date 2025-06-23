import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import { useContext } from "react";
import StateLogin from "./src/context/StateLogin";
import { estadologinGlobal } from "./src/context/contextData";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Llamar los screen principales

import screenAcercade from "./src/screen/acercade/screenAcercade";
import screenSetting from "./src/screen/setting/screenSetting";
import screenHome from "./src/screen/home/screenHome";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';


// llamar los creen hjos home
import lucesCasa from "./src/screen/home/lucesCasa";
import puertasCasa from "./src/screen/home/puertasCasa";
import detallesHome from "./src/screen/home/detallesHome";

//llamar los screen de login
import login from "./src/screen/login/login";
import register from "./src/screen/login/register";


function MyStackHome() {
   return (
      <Stack.Navigator>
           <Tab.Screen
            name="home2" 
            component={screenHome} 
            options={{ headerShown: false }}
         />
         <Tab.Screen
            name="lucesCasa" 
            component={lucesCasa} 
            options={{ headerShown: false }}
         />
         <Tab.Screen
            name="puertasCasa" 
            component={puertasCasa} 
            options={{ headerShown: false }}
         />
         <Tab.Screen
            name="detallesHome" 
            component={detallesHome} 
            options={{ headerShown: false }}
         />
      </Stack.Navigator>
   );
}

function MyTabs() {
   return (
      <Tab.Navigator>
         <Tab.Screen
            name="home" 
            component={MyStackHome} 
            options={{
               headerShown:false,
               tabBarIcon: ({ color, size }) => (
                  <AntDesign name="heart" size={size} color={color} />
               ),
               tabBarLabelPosition: 'beside-icon',
               tabBarBadge: 67,
               color: 'white',
               backgroundColor: 'black',
            }}
         />
         <Tab.Screen
            name="About" 
            component={screenAcercade} 
            options={{
               headerShown:false,
               tabBarIcon: ({ color, size }) => (
                  <Entypo name="info-with-circle" size={size} color={color} />
               ),
               tabBarLabelPosition: 'beside-icon',
               color: 'white',
               backgroundColor: 'black',
            }}
         />
         <Tab.Screen
            name="Settings" 
            component={screenSetting} 
            options={{
               headerShown:false,
               tabBarIcon: ({ color, size }) => (
                  <Ionicons name="settings-sharp" size={size} color={color} />
               ),
               tabBarLabelPosition: 'beside-icon',
               tabBarBadge: 2,
               color: 'white',
               backgroundColor: 'black',
            }}
         />
      </Tab.Navigator>
   )
}


function ScreenLogin() {
   return (
      <Stack.Navigator>
         <Stack.Screen
            name="login" 
            component={login} 
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="crearcuenta" 
            component={register} 
            options={{ headerShown: true }}
         />
      </Stack.Navigator>
   );
}

export default function navigation() {
   const { isLogin } = useContext(estadologinGlobal);
   
   return(
      <>
            {isLogin ? <MyTabs /> : <ScreenLogin />}
        </>
     
   ) 
}