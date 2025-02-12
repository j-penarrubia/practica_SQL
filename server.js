const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const {conexionDB, pool } = require('./database');
conexionDB();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/centros", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "centros.html"));
});

app.get("/alumnosCursos", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "alumnosCursos.html"));
});

app.get("/getCursos", async (req, res) => {
    try {
        const [cursos] = await pool.query("SELECT * FROM cursos");
        res.json(cursos);
    } catch (error) {
        console.error("Error obteniendo los cursos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

app.get("/getCentros", async (req, res) => {
    try {
        const [cursos] = await pool.query("SELECT * FROM centros");
        res.json(cursos);
    } catch (error) {
        console.error("Error obteniendo los centros:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})