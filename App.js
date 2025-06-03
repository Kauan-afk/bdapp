import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet
} from 'react-native';
import {
    criarTabela,
    adicionarReceita,
    listarReceitas,
    atualizarReceita,
    deletarReceita
} from './database/bancoDados';
export default function App() {
    const [receitas, setReceitas] = useState([]);
    const [title, setTitle] = useState('');
    const [modoEdicao, setModoEdicao] = useState(false);
    const [procurar, setProcurar] = useState('');
    const [description, setDescription] = useState('')
    const [method, setMethod] = useState('')
    const [id, setId] = useState(null)


    useEffect(() => {
        async function iniciar() {
            await criarTabela();
            await carregarReceitas();
        }
        iniciar();
    }, []);



    async function carregarReceitas() {
        const dados = await listarReceitas();
        setReceitas(dados);
    }


    const receitasFiltradas = receitas.filter(r =>
        r.titulo.toLowerCase().includes(procurar.toLowerCase())
    );


    async function salvar() {
        if (modoEdicao) {
            await atualizarReceita(id, title);
            setModoEdicao(false);
            setId(null);
        } else {
            await adicionarReceita(title);
        }
        setTitle('');
        setDescription('');
        setMethod('');
        await carregarReceitas();
    }


    function editar(receita) {
        setTitle(receita.titulo);
        setId(receita.id);
        setDescription('');
        setMethod('');
        setModoEdicao(true);
    }


    async function excluir(id) {
        await deletarReceita(id);
        await carregarReceitas();
    }


    return (
        <View style={styles.app}>
            <Text style={styles.titulo}>RECEITAS</Text>
            <TextInput
                style={styles.input}
                placeholder="Pesquisar receitas"
                value={procurar}
                onChangeText={setProcurar}
            />
            <TextInput
                style={styles.input}
                placeholder="Adicione uma Receita"
                value={title}
                onChangeText={setTitle}
            />
            <Button title={modoEdicao ? "Atualizar" : "Adicionar"}
                onPress={salvar} />
            <FlatList
                style={styles.listagem}
                data={receitasFiltradas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.text}>{item.titulo}</Text>
                        <View style={styles.botoes}>
                            <Button title="Editar" onPress={() => editar(item)} />
                            <Button title="Excluir" onPress={() => excluir(item.id)} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    app: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        backgroundColor: "#555555"
    },
    titulo: {
        fontSize: 24,
        marginBottom: 10,
        color: "#fff",
        textAlign: 'center'
    },
    
    text:{
        color: "#fff"
    },
    input: {
        borderWidth: 1,
        borderColor: '#fff',
        padding: 8,
        marginBottom: 10,
        color: "#fff",
        borderRadius: 5
    },
    item: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#fff',
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 5
    },
    botoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        borderRadius: 5
    }
});