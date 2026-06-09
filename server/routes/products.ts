import express from 'express';
import { dbGet, dbQuery, dbRun } from '../db';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await dbQuery(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/', async (req, res) => {
    // Add product
    const { code, name, description, price, cost, stock, min_stock, category_id, brand, application, active } = req.body;
    try {
        const result = await dbRun(
            `INSERT INTO products (code, name, description, price, cost, stock, min_stock, category_id, brand, application, active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
             [code, name, description, price, cost, stock || 0, min_stock || 0, category_id, brand, application, active ?? 1]
        );
        res.json({ id: result.lastID, success: true });
    } catch(err) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

export default router;
