import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { db } from '../services/supabase';
import AppText from '../components/AppText';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

type Mensagem = {
    id: number;
    frase: string;
    autor: string;
};

export default function BancoInspiracoes() {
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [pagina, setPagina] = useState(0);
    const LIMITE = 20;

    const navigation = useNavigation();

    const buscarMensagens = async () => {
        setCarregando(true);

        const from = pagina * LIMITE;
        const to = from + LIMITE - 1;

        const { data, error } = await db
            .from('frases')
            .select('id, frase, autor')
            .order('id', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Erro ao buscar mensagens:', error.message);
        } else {
            const embaralhadas = [...data].sort(() => Math.random() - 0.5);
            setMensagens((prev) => [...prev, ...embaralhadas]);
            setPagina((prev) => prev + 1);
        }

        setCarregando(false);
    };

    useEffect(() => {
        buscarMensagens();
    }, []);

    return (
        <SafeAreaView style={styles.safe}>
            {/* Botão de menu igual Home e Sobre */}
            <Pressable
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={styles.hamburguer}
            >
                <Feather name="menu" size={32} color="black" />
            </Pressable>

            {/* Título dividido + linha decorativa */}
            <View style={styles.tituloContainer}>
                <AppText style={styles.titulo}>Banco de</AppText>
                <AppText style={styles.titulo}>Inspirações</AppText>
                <View style={styles.linha} />
            </View>

            {/* Lista de frases */}
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={{ paddingBottom: 32 }}
                    data={mensagens}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <AppText style={styles.frase}>{item.frase}</AppText>
                            <AppText style={styles.autor}>— {item.autor}</AppText>
                        </View>
                    )}
                    ListFooterComponent={
                        carregando ? (
                            <ActivityIndicator size="large" color="#000" />
                        ) : (
                            <Pressable style={styles.botao} onPress={buscarMensagens}>
                                <Text style={styles.botaoTexto}>Carregar mais</Text>
                            </Pressable>
                        )
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
        fontWeight: '700', // ou use 'Montserrat_700Bold' se estiver carregando como fonte separada
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
    botao: {
        marginTop: 16,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#ccc',
    },
    botaoTexto: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 16,
    },
});