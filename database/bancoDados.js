import * as SQLite from 'expo-sqlite';
let banco;
export async function conectarBanco() {
 if (!banco) {
 banco = await SQLite.openDatabaseAsync('receitas.db');
 await banco.execAsync(`PRAGMA journal_mode = WAL`);
 }
 return banco;
}


export async function criarTabela() {
 const db = await conectarBanco();
 await db.execAsync(`
 CREATE TABLE IF NOT EXISTS receitas (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 titulo TEXT NOT NULL
 );
 `);
}



export async function adicionarReceita(titulo) {
 const db = await conectarBanco();
 const resultado = await db.runAsync(
 'INSERT INTO receitas (titulo) VALUES (?);',
 titulo
 );
 return resultado.lastInsertRowId;
}


export async function listarReceitas() {
 const db = await conectarBanco();
 const receitas = await db.getAllAsync('SELECT * FROM receitas;');
 return receitas;
}


export async function atualizarReceita(id, novoTitulo) {
 const db = await conectarBanco();
 await db.runAsync(
 'UPDATE receitas SET titulo = ? WHERE id = ?;',
 novoTitulo,
 id
 );
}


export async function deletarReceita(id) {
 const db = await conectarBanco();
 await db.runAsync(
 'DELETE FROM receitas WHERE id = ?;',
 id
 );
}