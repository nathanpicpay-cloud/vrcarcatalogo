import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const rawCategories = [
    'Borracharia', 'Acessórios', 'Ferramentas', 'Calotas', 'Química'
];

db.serialize(() => {
    // Basic category insertion
    for (const cat of rawCategories) {
        db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', [cat]);
    }

    const rawText = fs.readFileSync(path.join(__dirname, 'raw_products.txt'), 'utf-8');
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const products = [];
    let currentCode = '';
    let currentName = '';

    for (const line of lines) {
        if (line.includes('Cód: ')) {
            // Might have "UN/1 Cód: 123"
            const parts = line.split('Cód: ');
            if (parts.length > 1) {
                currentCode = parts[1].trim();
            }
        } else if (currentCode && !currentName) {
            currentName = line;
            // Finish product
            if (currentCode && currentName) {
                products.push({ code: currentCode, name: currentName });
                currentCode = '';
                currentName = '';
            }
        }
    }

    let inserted = 0;
    const stmt = db.prepare('INSERT OR IGNORE INTO products (code, name, price, active, stock) VALUES (?, ?, 0, 1, 10)');
    for (const p of products) {
        stmt.run(p.code, p.name);
        inserted++;
    }
    stmt.finalize(() => {
        console.log(`Inserted ${inserted} products!`);
        db.close();
    });
});
