import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Pressable,
    StyleSheet,
    SafeAreaView,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from '../components/AppText';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Feather, AntDesign } from '@expo/vector-icons';

type Mensagem = {
    frase: string;
    autor: string;
};

export default function Favoritos() {
    const navigation = useNavigation();
    const [favoritos, setFavoritos] = useState<Mensagem[]>([]);

    useEffect(() => {
        carregarFavoritos();
    }, []);

    const carregarFavoritos = async () => {
        try {
            const data = await AsyncStorage.getItem('mensagens_favoritas');
            const lista = data ? JSON.parse(data) : [];
            setFavoritos(lista);
        } catch (e) {
            console.error('Erro ao carregar favoritos:', e);
        }
    };

    const removerFavorito = async (frase: string, autor: string) => {
        try {
            const novaLista = favoritos.filter(
                (msg) => !(msg.frase === frase && msg.autor === autor)
            );
            setFavoritos(novaLista);
            await AsyncStorage.setItem('mensagens_favoritas', JSON.stringify(novaLista));
        } catch (e) {
            console.error('Erro ao remover favorito:', e);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <Pressable
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={styles.hamburguer}
            >
                <Feather name="menu" size={32} color="black" />
            </Pressable>

            <View style={styles.tituloContainer}>
                <AppText style={styles.titulo}>Frases</AppText>
                <AppText style={styles.titulo}>Favoritas</AppText>
                <View style={styles.linha} />
            </View>

            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={{ paddingBottom: 32 }}
                    data={favoritos}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.linhaFrase}>
                                <View style={{ flex: 1 }}>
                                    <AppText style={styles.frase}>{item.frase}</AppText>
                                    <AppText style={styles.autor}>— {item.autor}</AppText>
                                </View>
                                <Pressable
                                    onPress={() => removerFavorito(item.frase, item.autor)}
                                    hitSlop={8}
                                >
                                    <AntDesign name="heart" size={24} color="#e63946" />
                                </Pressable>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <AppText style={{ textAlign: 'center', marginTop: 40 }}>
                            Nenhuma frase favoritada ainda.
                        </AppText>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
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
    tituloContainer: {
        marginTop: 64,
        alignItems: 'center',
        marginBottom: 8,
    },
    titulo: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
    },
    linha: {
        alignSelf: 'center',
        width: 120,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        marginVertical: 12,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    card: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f3f3f3',
    },
    linhaFrase: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    frase: {
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
    },
    autor: {
        fontSize: 14,
        marginTop: 8,
        fontFamily: 'Montserrat_400Italic',
        color: '#555',
    },
});