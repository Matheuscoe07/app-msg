import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import {
    buscarFraseAleatoria,
    isErro,
    ResultadoFrase,
} from '../services/supabase';

export default function Home() {
    const [frase, setFrase] = useState<string>('');
    const [autor, setAutor] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const [carregando, setCarregando] = useState<boolean>(true);

    useEffect(() => {
        const carregar = async () => {
        const resultado: ResultadoFrase = await buscarFraseAleatoria();

        if (isErro(resultado)) {
            setErro(resultado.erro);
            console.warn('❗Erro:', resultado.erro);
            setFrase('');
            setAutor('');
        } else {
            setFrase(resultado.frase);
            setAutor(resultado.autor);
            setErro('');
        }

        setCarregando(false);
        };

        carregar();
    }, []);

    if (carregando) {
        return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
            <Text style={styles.loading}>Carregando mensagem...</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>
        {erro ? (
            <Text style={styles.erro}>Erro: {erro}</Text>
        ) : (
            <>
            <Text style={styles.texto}>"{frase}"</Text>
            <Text style={styles.autor}>— {autor}</Text>
            </>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    texto: {
        fontSize: 24,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 12,
    },
    autor: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
    loading: {
        marginTop: 12,
        fontSize: 16,
    },
    erro: {
        textAlign: 'center',
        fontSize: 16,
        color: 'red',
    },
});