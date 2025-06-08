import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export default function AppText(props: TextProps) {
    return (
        <Text {...props} style={[styles.text, props.style]}>
        {props.children}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Montserrat_400Regular',
        color: '#000', // opcional, mas bom pra garantir consistência
    },
});