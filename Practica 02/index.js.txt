const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tu_contraseña',
    database: 'nombre_base'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

const PORT = 3000;

// CATEGORIAS

// POST /categorias
app.post('/categorias', (req, res) => {
    const { nombre, descripcion } = req.body;
    const sql = 'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)';
    db.query(sql, [nombre, descripcion], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nombre, descripcion });
    });
});

// GET /categorias
app.get('/categorias', (req, res) => {
    db.query('SELECT * FROM categorias', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET /categorias/:id con productos asociados
app.get('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const sqlCat = 'SELECT * FROM categorias WHERE id = ?';
    const sqlProd = 'SELECT * FROM productos WHERE categoria_id = ?';

    db.query(sqlCat, [id], (err, catResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (catResults.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });

        db.query(sqlProd, [id], (err, prodResults) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                categoria: catResults[0],
                productos: prodResults
            });
        });
    });
});

// PUT /categorias/:id actualizar categoría
app.put('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const sql = 'UPDATE categorias SET nombre=?, descripcion=?, fecha_act=NOW() WHERE id=?';
    db.query(sql, [nombre, descripcion, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json({ id, nombre, descripcion });
    });
});

// DELETE /categorias/:id eliminar categoría y productos (ON DELETE CASCADE ya hace el trabajo)
app.delete('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM categorias WHERE id=?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json({ message: 'Categoría y productos eliminados correctamente' });
    });
});

// PRODUCTOS

// POST /productos
app.post('/productos', (req, res) => {
    const { nombre, precio, stock, categoria_id } = req.body;
    const sql = 'INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, precio, stock, categoria_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nombre, precio, stock, categoria_id });
    });
});

// GET /productos con nombre de categoría
app.get('/productos', (req, res) => {
    const sql = `
        SELECT p.id, p.nombre, p.precio, p.stock, p.categoria_id, c.nombre AS categoria_nombre
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET /productos/:id con nombre de categoría
app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT p.id, p.nombre, p.precio, p.stock, p.categoria_id, c.nombre AS categoria_nombre
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = ?
    `;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(results[0]);
    });
});

// PUT /productos/:id actualizar producto
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock, categoria_id } = req.body;
    const sql = `
        UPDATE productos
        SET nombre=?, precio=?, stock=?, categoria_id=?, fecha_act=NOW()
        WHERE id=?
    `;
    db.query(sql, [nombre, precio, stock, categoria_id, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ id, nombre, precio, stock, categoria_id });
    });
});

// PATCH /productos/:id/stock incrementar o decrementar stock
app.patch('/productos/:id/stock', (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body; // puede ser positiva o negativa
    const sql = 'UPDATE productos SET stock = stock + ?, fecha_act=NOW() WHERE id=?';
    db.query(sql, [cantidad, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: `Stock actualizado en ${cantidad}` });
    });
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
