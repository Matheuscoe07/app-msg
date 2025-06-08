import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AppText from '../components/AppText';

export default function Sobre() {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.hamburguer}
        >
            <Feather name="menu" size={32} color="black" />
        </Pressable>

        <AppText style={styles.titulo}>Sobre</AppText>
        <View style={styles.linha} />

        <AppText style={styles.subtitulo}>O App</AppText>
        <AppText style={styles.texto}>
            O <AppText style={styles.bold}>Espirite-se</AppText> é um aplicativo simples, direto e acolhedor que entrega mensagens inspiradoras para quem busca luz, paz e reflexão no seu dia a dia.
            Com base na filosofia espírita kardecista, ele oferece textos curtos e profundos que podem ser lidos a qualquer hora, sem precisar de login ou cadastro.

            {'\n\n'}O app foi criado com a ideia de ser acessível para todos os públicos — desde quem já vive o espiritismo no cotidiano até quem está apenas começando a explorar esses ensinamentos.
            É possível marcar mensagens favoritas, configurar o horário de envio diário e acessar um banco de inspirações com vários conteúdos edificantes.

            {'\n\n'}O projeto é <AppText style={styles.bold}>open source</AppText>, então se você curtir e quiser contribuir, fique à vontade para sugerir melhorias ou até codar junto! 💻✨
            
            {'\n\n'}😸 Github: github.com/Matheuscoe07/app-msg
            {'\n'}
        </AppText>

        <View style={styles.linha} />

        <AppText style={styles.subtitulo}>O Desenvolvedor</AppText>
        <AppText style={styles.texto}>
            Meu nome é <AppText style={styles.bold}>Matheus Coelho</AppText>, sou engenheiro da computação e sou o dev por trás desse projeto. Sou apaixonado por tecnologia, espiritualidade e por aprender fazendo.
            Criei esse app como um espaço de prática, tanto de código quanto de fé.

            {'\n\n'}No processo de desenvolver o <AppText style={styles.bold}>Espirite-se</AppText>, estou usando <AppText style={styles.bold}>React Native com Expo</AppText> e Typescript, integrando com <AppText style={styles.bold}>Supabase</AppText> para gerenciar o banco de dados.
            Tudo foi pensado para rodar leve e sem complicações — tanto para quem usa quanto para quem desenvolve.

            {'\n\n'}Se quiser trocar ideia, dar feedback ou colaborar, é só me chamar:

            {'\n\n'}💼 LinkedIn: linkedin.com/matheuscoe07
            {'\n\n'}
        </AppText>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
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
    titulo: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 64, // espaço após o menu
        marginBottom: 4,
    },
    subtitulo: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 12,
    },
    linha: {
        alignSelf: 'center',
        width: 120,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        marginVertical: 12,
    },
    texto: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        color: '#333',
    },
    bold: {
        fontWeight: '600',
    },
});