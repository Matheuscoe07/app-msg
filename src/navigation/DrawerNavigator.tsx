import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
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
                    backgroundColor: '#fff', // fundo branco liso
                    width: 240, // largura do drawer
                },
                drawerActiveBackgroundColor: 'transparent', // sem cor de fundo ativa
                drawerInactiveBackgroundColor: 'transparent',
                drawerActiveTintColor: '#000', // texto preto
                drawerInactiveTintColor: '#000',
                drawerLabelStyle: {
                    fontSize: 18,
                    marginLeft: 0,
                },
            }}
        >
            <Drawer.Screen name="Início" component={Home} />
            <Drawer.Screen name="Favoritos" component={Favoritos} />
            <Drawer.Screen name="Configurações" component={Configuracoes} />
            <Drawer.Screen name="Banco de Inspirações" component={BancoInspiracoes} />
            <Drawer.Screen name="Sobre" component={Sobre} />
        </Drawer.Navigator>
    );
}