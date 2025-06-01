import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoTrueClient } from '@supabase/gotrue-js';
import { PostgrestClient } from '@supabase/postgrest-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// 🔐 Cliente de autenticação (opcional para seu app, mas ajuda na estrutura futura)
export const auth = new GoTrueClient({
    url: `${supabaseUrl}/auth/v1`,
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'supabase.auth.token',
    storage: AsyncStorage,
  fetch,
});

// 💾 Cliente de banco de dados REST
export const db = new PostgrestClient(`${supabaseUrl}/rest/v1`, {
    headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
    },
    fetch,
});

// ✅ Tipos de retorno
export type ResultadoFrase =
    | { frase: string; autor: string }
    | { erro: string };

// ✅ Type Guard para distinguir entre sucesso e erro
export function isErro(res: ResultadoFrase): res is { erro: string } {
    return 'erro' in res;
}

// 🔎 Função para buscar uma frase aleatória da tabela "frases"
export async function buscarFraseAleatoria(): Promise<ResultadoFrase> {
    const { data, error } = await db.from('frases').select('frase, autor');

    if (error) {
        console.error('⚠️ Erro Supabase:', error);
        return { erro: error.message || 'Erro desconhecido' };
    }

    if (!data || data.length === 0) {
        console.warn('⚠️ Nenhuma frase encontrada.');
        return { erro: 'Nenhuma frase encontrada.' };
    }

    const aleatoria = data[Math.floor(Math.random() * data.length)];

    return {
        frase: aleatoria.frase || 'Sem texto',
        autor: aleatoria.autor || 'Autor desconhecido',
    };
}