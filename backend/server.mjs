import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import QRCode from 'qrcode';


const app = express();
const port = 3000;
const corsOptions = {
  origin: ['http://tuservidor.com', 'http://localhost:4200', 'http://192.168.x.x:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // Procesa cuerpos JSON

const mongoUri = "mongodb+srv://usuario:inazuma2@cluster0.5q3gh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(mongoUri);
// **Conexión inicial a MongoDB**
async function connectDB() {
  try {
    await client.connect();
    console.log('Conexión exitosa a MongoDB');
  } catch (err) {
    console.error('Error conectando a MongoDB', err);
    process.exit(1);
  }
}

// **Endpoint para obtener asistencia**
app.get('/api/get-attendance', async (req, res) => {
  const { date, section } = req.query;

  if (!date || !section) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos: date o section' });
  }

  try {
    const database = client.db("registrapp");
    const attendance = database.collection("attendance");

    const query = { date, section };
    const options = {
      projection: { _id: 0, studentId: 1, attendanceStatus: 1, date: 1, section: 1 },
    };

    const attendanceRecords = await attendance.find(query, options).toArray();
    res.json(attendanceRecords);
  } catch (err) {
    console.error('Error al consultar la base de datos', err);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// **Endpoint para marcar asistencia**
app.post('192.168.140.15:3000/api/mark-attendance', async (req, res) => {
  console.log('Ruta /api/mark-attendance llamada');
  const { studentId, sessionId, subject, attendanceStatus, date } = req.body;

  if (!studentId || !sessionId || !subject || !attendanceStatus || !date) {
    return res.status(400).json({ error: 'Faltan datos requeridos en el cuerpo de la solicitud' });
  }

  try {
    const database = client.db("registrapp");
    const attendance = database.collection("attendance");

    const newRecord = {
      studentId,
      sessionId,
      subject,
      attendanceStatus,
      date,
    };

    await attendance.insertOne(newRecord);
    res.status(200).send('Asistencia registrada correctamente');
  } catch (err) {
    console.error('Error al registrar asistencia', err);
    res.status(500).send('Error al registrar la asistencia');
  }
});

app.get('/generate-qrcode', async (req, res) => {
  const { sessionId, subject } = req.query;

  // Validar parámetros
  if (!sessionId || !subject) {
    return res.status(400).json({ error: 'Faltan parámetros: sessionId o subject' });
  }

  const data = { sessionId, subject };

  // Generar y enviar el código QR
  QRCode.toDataURL(JSON.stringify(data), (err, url) => {
    if (err) {
      console.error('Error generando QR:', err);
      res.status(500).send('Error generando el QR');
    } else {
      res.send(url); // Retorna el código QR en formato Base64
    }
  });
});

// **Iniciar Servidor**
app.listen(port, async () => {
  await connectDB(); // Conexión inicial a la base de datos
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
