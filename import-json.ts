import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const data = [
  {
    "codigo": "TR220",
    "nome": "Bico Válvula com Câmara de Ar e Água Agrícola TR220",
    "categoria": "Borracharia"
  },
  {
    "codigo": "TR78A",
    "nome": "Bico Válvula para Câmara de Ar",
    "categoria": "Borracharia"
  },
  {
    "codigo": "TR75A",
    "nome": "Bico Válvula para Câmara de Ar",
    "categoria": "Borracharia"
  },
  {
    "codigo": "TR218",
    "nome": "Bico Válvula para Pneus Agrícolas com Câmara TR218",
    "categoria": "Borracharia"
  },
  {
    "codigo": "5547",
    "nome": "Borracha Vulcanite para Reparo a Quente de Câmara de Ar Top Rubber",
    "categoria": "Borracharia"
  },
  {
    "codigo": "84571",
    "nome": "Borracha Vulcanite para Reparo a Quente de Câmara de Ar Vulcaflex",
    "categoria": "Borracharia"
  },
  {
    "codigo": "119",
    "nome": "Borracha Vulcanite Rolo 1kg Vipal",
    "categoria": "Borracharia"
  },
  {
    "codigo": "256487",
    "nome": "Câmara de Ar 2.75-14 Traseira/Dianteira Biz/Pop",
    "categoria": "Borracharia"
  },
  {
    "codigo": "250918",
    "nome": "Câmara de Ar 3.00-18 90/90-18",
    "categoria": "Borracharia"
  },
  {
    "codigo": "MA19",
    "nome": "Câmara de Ar Bros PB17 90/90-19 110/80-17",
    "categoria": "Borracharia"
  }
];

db.serialize(() => {
    db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', ['Borracharia']);

    let inserted = 0;
    const stmt = db.prepare('INSERT OR IGNORE INTO products (code, name, price, active, stock) VALUES (?, ?, 0, 1, 10)');
    for (const p of data) {
        stmt.run(p.codigo, p.nome);
        inserted++;
    }
    stmt.finalize(() => {
        console.log(`Inserted ${inserted} products!`);
        db.close();
    });
});
