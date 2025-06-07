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
        <Drawer.Navigator initialRouteName="Início">
        <Drawer.Screen name="Início" component={Home} />
        <Drawer.Screen name="Favoritos" component={Favoritos} />
        <Drawer.Screen name="Configurações" component={Configuracoes} />
        <Drawer.Screen name="Banco de Inspirações" component={BancoInspiracoes} />
        <Drawer.Screen name="Sobre" component={Sobre} />
        </Drawer.Navigator>
    );
}