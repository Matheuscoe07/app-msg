import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {
    buscarFraseAleatoria,
    isErro,
    ResultadoFrase,
} from '../services/supabase';
import AppText from '../components/AppText';

export default function Home() {
    const [frase, setFrase] = useState<string>('');
    const [autor, setAutor] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const [carregando, setCarregando] = useState<boolean>(true);
    const [favoritada, setFavoritada] = useState<boolean>(false);

    const rotation = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    useEffect(() => {
        carregarMensagem();
    }, []);

    const animarRefresh = () => {
        rotation.setValue(0);
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ).start();
    };

    const verificarSeJaFavoritada = async (novaFrase: string, novoAutor: string) => {
        try {
            const favoritas = await AsyncStorage.getItem('mensagens_favoritas');
            const lista = favoritas ? JSON.parse(favoritas) : [];
            const existe = lista.some(
                (item: { frase: string; autor: string }) =>
                    item.frase === novaFrase && item.autor === novoAutor
            );
            setFavoritada(existe);
        } catch (e) {
            console.error('Erro ao verificar favorito:', e);
        }
    };

    const carregarMensagem = async () => {
        setCarregando(true);
        animarRefresh();

        const resultado: ResultadoFrase = await buscarFraseAleatoria();

        if (isErro(resultado)) {
            setErro(resultado.erro);
            setFrase('');
            setAutor('');
            setFavoritada(false);
        } else {
            setFrase(resultado.frase);
            setAutor(resultado.autor);
            setErro('');
            await verificarSeJaFavoritada(resultado.frase, resultado.autor);
        }

        setCarregando(false);
        rotation.stopAnimation();
    };

    const alternarFavorito = async () => {
        try {
            const favoritas = await AsyncStorage.getItem('mensagens_favoritas');
            const lista = favoritas ? JSON.parse(favoritas) : [];

            const index = lista.findIndex(
                (item: { frase: string; autor: string }) =>
                    item.frase === frase && item.autor === autor
            );

            let novaLista;

            if (index >= 0) {
                novaLista = [...lista];
                novaLista.splice(index, 1);
                setFavoritada(false);
            } else {
                novaLista = [...lista, { frase, autor }];
                setFavoritada(true);
            }

            await AsyncStorage.setItem('mensagens_favoritas', JSON.stringify(novaLista));
        } catch (e) {
            console.error('Erro ao alternar favorito:', e);
        }
    };

    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    if (carregando) {
        return (
            <View style={styles.container}>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <Feather name="refresh-ccw" size={36} color="#666" />
                </Animated.View>
                <AppText style={styles.loading}>Buscando mensagem...</AppText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={styles.hamburguer}
            >
                <Feather name="menu" size={32} color="black" />
            </Pressable>

            {erro ? (
                <AppText style={styles.erro}>Erro: {erro}</AppText>
            ) : (
                <>
                    <AppText style={styles.texto}>"{frase}"</AppText>
                    <AppText style={styles.autor}>— {autor}</AppText>

                    <View style={styles.botoesContainer}>
                        <Pressable style={styles.iconeBotao} onPress={carregarMensagem}>
                            <Feather name="refresh-ccw" size={28} color="#333" />
                        </Pressable>

                        <Pressable style={styles.iconeBotao} onPress={alternarFavorito}>
                            <AntDesign
                                name="heart"
                                size={28}
                                color={favoritada ? '#e63946' : '#999'}
                            />
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    hamburguer: {
        position: 'absolute',
        top: 80,
        left: 40,
        zIndex: 1,
        padding: 0,
        backgroundColor: 'transparent',
    },
    texto: {
        fontSize: 24,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 12,
        fontFamily: 'Montserrat_400Italic',
    },
    autor: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        fontFamily: 'Montserrat_400Regular',
    },
    loading: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    erro: {
        textAlign: 'center',
        fontSize: 16,
        color: 'red',
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        marginTop: 24,
        width: '100%',
    },
    iconeBotao: {
        padding: 12,
        borderRadius: 50,
        backgroundColor: '#eee',
    },
});