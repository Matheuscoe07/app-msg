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
    try {
        // Confere e pede permissão
        const { status } = await Notifications.getPermissionsAsync();
        console.log("Permissão atual:", status);

        if (status !== 'granted') {
            const ask = await Notifications.requestPermissionsAsync();
            console.log("Permissão após request:", ask.status);
            if (ask.status !== 'granted') {
                console.warn("Usuário não deu permissão pra notificações");
                return;
            }
        }

        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.setItem(CHAVE_HORARIO, JSON.stringify({ hora, minuto }));

        const fraseSorteada = sortearFrase();

        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '✨ Mensagem do dia ✨',
                    body: fraseSorteada,
                    data: { tipo: 'inspiracao' },
                },
                trigger: {
                    hour: hora,
                    minute: minuto,
                    second: 0,
                    repeats: true,
                } as Notifications.CalendarTriggerInput,
            });
            console.log("✅ Notificação calendar agendada às", `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`);

        } catch (err) {
            console.error("Falha ao agendar como calendar:", JSON.stringify(err, null, 2));

            // fallback pra garantir testes
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '⚠️ Fallback Teste',
                    body: 'Isso é um teste via timeInterval pra garantir que funciona',
                },
                trigger: {
                    type: 'timeInterval',
                    seconds: 5,
                    repeats: false,
                } as Notifications.TimeIntervalTriggerInput,
            });
            console.log("✅ Fallback agendado pra daqui 5s");
        }

    } catch (err) {
        console.error("Erro geral ao agendar notificação:", err);
        console.error("Erro detalhado:", JSON.stringify(err, null, 2));
    }
}

export async function recuperarHorarioNotificacao(): Promise<{ hora: number, minuto: number } | null> {
    try {
        const dados = await AsyncStorage.getItem(CHAVE_HORARIO);
        if (dados) return JSON.parse(dados);
        return null;
    } catch (err) {
        console.error("Erro ao recuperar horário:", JSON.stringify(err, null, 2));
        return null;
    }
}

export async function cancelarNotificacoes() {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.removeItem(CHAVE_HORARIO);
        console.log("🚫 Notificações canceladas e horário removido do storage.");
    } catch (err) {
        console.error("Erro ao cancelar notificações:", JSON.stringify(err, null, 2));
    }
}