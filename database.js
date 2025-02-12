const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'bf73utbbo74laudnhiyg-mysql.services.clever-cloud.com',
    user: 'u3qbnzxhxdumwijf',
    password: '0yySfaOUvOG9CwiaOi8y',
    database: 'bf73utbbo74laudnhiyg',
    waitForConnections: true,
    connectionLimit: 10, // Máximo de conexiones simultáneas
    queueLimit: 0
});

const conexionDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Conectado a la base de datos MySQL");
        connection.release(); // Liberamos la conexión. Esto es una función propia del uso de pools de conexiones, en lugar de estar constantemente conectados, liberamos la conexión para que otros usuarios puedan conectarse.
    } catch (err) {
        console.error("❌ Error al conectar con MySQL:", err);
    }
};

module.exports = {conexionDB, pool};