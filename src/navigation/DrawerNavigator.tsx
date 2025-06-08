import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text } from 'react-native';
import Home from '../screens/Home';
import Favoritos from '../screens/favoritos';
import Configuracoes from '../screens/configuracoes';
import BancoInspiracoes from '../screens/banco_inspiracoes';
import Sobre from '../screens/sobre';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
        initialRouteName="Início"
        screenOptions={{
            headerShown: false,
            drawerStyle: {
            backgroundColor: '#fff',
            width: 240,
            },
            drawerActiveBackgroundColor: 'transparent',
            drawerInactiveBackgroundColor: 'transparent',
            drawerActiveTintColor: '#000',
            drawerInactiveTintColor: '#000',
            drawerLabelStyle: {
            fontSize: 18,
            marginLeft: 0,
            fontFamily: 'Montserrat_400Regular',
            },
        }}
        >
        <Drawer.Screen name="Início" component={Home} />
        <Drawer.Screen name="Favoritos" component={Favoritos} />
        <Drawer.Screen name="Configurações" component={Configuracoes} />
        <Drawer.Screen
            name="BancoInspiracoes"
            component={BancoInspiracoes}
            options={{
            drawerLabel: () => (
                <Text
                style={{
                    fontSize: 18,
                    fontFamily: 'Montserrat_400Regular',
                    color: '#000',
                }}
                >
                Banco de{'\n'}Inspirações
                </Text>
            ),
            }}
        />
        <Drawer.Screen name="Sobre" component={Sobre} />
        </Drawer.Navigator>
    );
}