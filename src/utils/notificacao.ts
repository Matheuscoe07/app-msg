import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_HORARIO = 'horario_notificacao';

const frasesNotificacao = [
    '✨ A vida sempre fala com você. Toque para ouvir ✨',
    '✨ Sua inspiração de hoje chegou. Clique e sinta ✨',
    '✨ Já recebeu sua luz do dia? Ela tá aqui ✨',
];

function sortearFrase() {
    const indice = Math.floor(Math.random() * frasesNotificacao.length);
    return frasesNotificacao[indice];
}

export async function agendarNotificacao(hora: number, minuto: number) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.setItem(CHAVE_HORARIO, JSON.stringify({ hora, minuto }));

    const fraseSorteada = sortearFrase();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '✨ Mensagem do dia ✨',
            body: fraseSorteada,
            data: { tipo: 'inspiracao' },
        },
        trigger: {
            type: 'calendar',
            hour: hora,
            minute: minuto,
            repeats: true,
        } as Notifications.CalendarTriggerInput,
    });
}

export async function recuperarHorarioNotificacao(): Promise<{ hora: number, minuto: number } | null> {
    const dados = await AsyncStorage.getItem(CHAVE_HORARIO);
    if (dados) return JSON.parse(dados);
    return null;
}

export async function cancelarNotificacoes() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(CHAVE_HORARIO);
}