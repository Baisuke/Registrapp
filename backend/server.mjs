import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import QRCode from 'qrcode';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
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
app.post('/api/mark-attendance', async (req, res) => {
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

// **Endpoint para generar QR**
app.get('/generate-qrcode', (req, res) => {
  const { sessionId, subject } = req.query;

  if (!sessionId || !subject) {
    return res.status(400).send('Faltan parámetros requeridos: sessionId o subject');
  }

  const data = { sessionId, subject };

  QRCode.toDataURL(JSON.stringify(data), function (err, url) {
    if (err) {
      console.error('Error generando el código QR', err);
      res.status(500).send('Error generando el código QR');
    } else {
      res.send(url);
    }
  });
});

// **Iniciar Servidor**
app.listen(port, async () => {
  await connectDB(); // Conexión inicial a la base de datos
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
