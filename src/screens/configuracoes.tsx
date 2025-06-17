import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Pressable,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { agendarNotificacao, recuperarHorarioNotificacao } from '../utils/notificacao';
import AppText from '../components/AppText';

export default function Configuracoes() {
    const navigation = useNavigation();
    const [hora, setHora] = useState(new Date());
    const [mostrarPicker, setMostrarPicker] = useState(false);

    useEffect(() => {
        const carregarHorarioSalvo = async () => {
        const salvo = await recuperarHorarioNotificacao();
        if (salvo) {
            const novaData = new Date();
            novaData.setHours(salvo.hora);
            novaData.setMinutes(salvo.minuto);
            setHora(novaData);
        }
        };

        carregarHorarioSalvo();
    }, []);

    const aoSelecionarHora = (_: any, selectedDate?: Date) => {
        setMostrarPicker(false);
        if (selectedDate) setHora(selectedDate);
    };

    const salvarHorario = async () => {
        const horas = hora.getHours();
        const minutos = hora.getMinutes();

        try {
        await agendarNotificacao(horas, minutos);
        Alert.alert('✨ Notificação agendada ✨', `Você receberá uma mensagem todo dia às ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`);
        } catch (err) {
        Alert.alert('Erro ao agendar notificação', 'Tente novamente');
        }
    };

    return (
        <View style={styles.container}>
        {/* Botão hamburguer */}
        <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.hamburguer}
        >
            <Feather name="menu" size={32} color="black" />
        </Pressable>

        <View style={styles.tituloContainer}>
            <AppText style={styles.titulo}>Configurações</AppText>
            <View style={styles.linha} />
        </View>

        <AppText style={styles.subtitulo}>Horário da Notificação</AppText>
        <Pressable style={styles.caixaHora} onPress={() => setMostrarPicker(true)}>
            <AppText style={styles.hora}>
            {hora.getHours().toString().padStart(2, '0')}:
            {hora.getMinutes().toString().padStart(2, '0')}
            </AppText>
        </Pressable>

        {mostrarPicker && (
            <DateTimePicker
            value={hora}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={aoSelecionarHora}
            />
        )}

        <Pressable style={styles.botao} onPress={salvarHorario}>
            <AppText style={styles.textoBotao}>Salvar horário</AppText>
        </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    hamburguer: {
        position: 'absolute',
        top: 80,
        left: 40,
        zIndex: 10,
        backgroundColor: 'transparent',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 56,
        textAlign: 'center',
    },
    linha: {
        alignSelf: 'center',
        width: 120,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        marginVertical: 12,
    },
    subtitulo: {
        fontSize: 18,
        marginBottom: 10,
    },
    caixaHora: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    hora: {
        fontSize: 18,
    },
    botao: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
    },
    tituloContainer: {
        marginTop: 64,
        alignItems: 'center',
        marginBottom: 8,
    },
});