import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { db } from '../services/supabase'; // ajusta pro teu path certinho
import AppText from '../components/AppText';

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

    const buscarMensagens = async () => {
        setCarregando(true);

        const from = pagina * LIMITE;
        const to = from + LIMITE - 1;

        const { data, error } = await db
        .from('frases') // nome da tua tabela
        .select('id, frase, autor')
        .order('id', { ascending: false }) // pra manter consistência
        .range(from, to);

        if (error) {
        console.error('Erro ao buscar mensagens:', error.message);
        } else {
        const embaralhadas = [...data].sort(() => Math.random() - 0.5);
        setMensagens(prev => [...prev, ...embaralhadas]);
        setPagina(prev => prev + 1);
        }

        setCarregando(false);
    };

    useEffect(() => {
        buscarMensagens();
    }, []);

    return (
        <View style={styles.container}>
        <FlatList
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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