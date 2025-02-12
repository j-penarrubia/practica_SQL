const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const { conexionDB, pool } = require('./database');
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

app.get("/actualizarCursos", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "actualizarCursos.html"));
});

app.get("/ratioAprobadosSuspensos", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "ratioAprobadosSuspensos.html"));
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
        const [centros] = await pool.query("SELECT * FROM centros");
        res.json(centros);
    } catch (error) {
        console.error("Error obteniendo los centros:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

app.get("/getAlumnosCursos", async (req, res) => {
    try {
        const [cursos] = await pool.query("SELECT a.nombre AS nombre_alumno, c.nombre AS nombre_curso, ac.estado FROM alumnos a JOIN alumnosCursos ac ON a.idAlumno = ac.idAlumno JOIN cursos c ON ac.idCurso = c.idCurso");
        res.json(cursos);
    } catch (error) {
        console.error("Error obteniendo los centros:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

app.post("/deleteAlumno/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const [eliminacion] = await pool.query(`DELETE FROM alumnos WHERE nombre = ?;`, [nombre]);
        if (eliminacion.affectedRows > 0) {
            res.json({ message: "Alumno eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Alumno no encontrado" });
        }
    } catch (error) {
        console.error("Error eliminando al alumno:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.put("/updateCurso/:idCurso", async (req, res) => {
    try {
        const { idCurso } = req.params;
        const camposActualizar = req.body; // Datos enviados desde el formulario

        if (!idCurso) {
            return res.status(400).json({ error: "El ID del curso es obligatorio" });
        }

        // Verificar si hay datos para actualizar
        if (Object.keys(camposActualizar).length === 0) {
            return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
        }

        // Construcción dinámica de la consulta
        const campos = [];
        const valores = [];

        for (const campo in camposActualizar) {
            if (["nombre", "fechaImportacion", "nivel", "descripcion", "lugar"].includes(campo)) {
                campos.push(`${campo} = ?`);
                valores.push(camposActualizar[campo]);
            }
        }

        if (campos.length === 0) {
            return res.status(400).json({ error: "Los campos proporcionados no son válidos" });
        }

        // Crear la consulta SQL dinámicamente
        const sql = `UPDATE cursos SET ${campos.join(", ")} WHERE idCurso = ?`;
        valores.push(idCurso); // Agregar el idCurso como último parámetro

        const [resultado] = await pool.query(sql, valores);

        if (resultado.affectedRows > 0) {
            res.json({ message: "Curso actualizado correctamente" });
        } else {
            res.status(404).json({ error: "Curso no encontrado" });
        }
    } catch (error) {
        console.error("Error actualizando el curso:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});