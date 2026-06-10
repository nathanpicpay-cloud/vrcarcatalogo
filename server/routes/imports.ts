import express from 'express';
import multer from 'multer';
import { dbRun, dbGet } from '../db';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    // Simple parser: assumes lines might have patterns like: [Código] [Nome do Produto] [Preço] etc
    // Since we don't know the exact PDF layout, we will split by lines and try to find a pattern or 
    // just return the raw lines to the frontend for the user to map, 
    // but the user asked for "cadastro automático". 
    // Let's implement a heuristic parser.
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const parsedProducts = [];
    
    // Heuristic: try to find lines that start with a code (numbers/letters), followed by description.
    for (const line of lines) {
      // Look for something like: "123456 - Produto Exemplo 12.90" or just lines with text.
      // We will extract basic info if it looks like a product.
      const match = line.match(/^([A-Za-z0-9]+)[\s\-]+(.+?)(?:\s+R\$\s*([\d,.]+))?$/);
      if (match) {
        const code = match[1];
        const name = match[2].trim();
        const priceStr = match[3];
        let price = 0;
        if (priceStr) {
           price = parseFloat(priceStr.replace('.', '').replace(',', '.'));
        }
        
        parsedProducts.push({
           code,
           name,
           price,
           stock: 10,
           active: 1
        });
      }
    }

    // In a real scenario, this would import directly or return for confirmation.
    // Let's return the extracted products to the frontend for review before saving.
    res.json({
       success: true,
       extractedData: parsedProducts.length > 0 ? parsedProducts : [{ code: 'N/A', name: 'Nenhum padrão detectado', price: 0 }]
    });

  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'Erro ao processar o PDF' });
  }
});

// Import confirmed products
router.post('/confirm', async (req, res) => {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Produtos inválidos' });
    }

    try {
        for (const p of products) {
            await dbRun(
                `INSERT INTO products (code, name, price, stock, active) VALUES (?, ?, ?, ?, ?)`,
                [p.code || '', p.name || 'Sem nome', p.price || 0, p.stock || 10, p.active ?? 1]
            );
        }
        res.json({ success: true, count: products.length });
    } catch(err) {
        res.status(500).json({ error: 'Erro ao salvar produtos' });
    }
});

export default router;
