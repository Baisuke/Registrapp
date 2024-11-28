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
app.post('/api/mark-attendance', async (req, res) => {
  console.log('Ruta /api/mark-attendance llamada');
  const { studentId, sessionId, subject, attendanceStatus, date, section } = req.body;

  // Validar que los datos requeridos estén presentes
  if (!studentId || !sessionId || !subject || !attendanceStatus || !date || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos en el cuerpo de la solicitud' });
  }

  try {
    const database = client.db("registrapp");
    const attendance = database.collection("attendance");

    // Formatear la fecha para que solo incluya YYYY-MM-DD
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const newRecord = {
      studentId,
      sessionId,
      subject,
      attendanceStatus,
      date: formattedDate,
      section, // Guardar la sección también
    };

    await attendance.insertOne(newRecord);
    res.status(200).send('Asistencia registrada correctamente');
  } catch (err) {
    console.error('Error al registrar asistencia', err);
    res.status(500).send('Error al registrar la asistencia');
  }
});

app.get('/generate-qrcode', async (req, res) => {
  const { sessionId, subject, section } = req.query;

  // Validar parámetros
  if (!sessionId || !subject || !section) {
    return res.status(400).json({ error: 'Faltan parámetros: sessionId, subject o section' });
  }

  const data = {
    sessionId, 
    subject, 
    section, 
  };

  QRCode.toDataURL(JSON.stringify(data), (err, url) => {
    if (err) {
      console.error('Error generando QR:', err);
      return res.status(500).json({ error: 'Error generando el QR' });
    } else {
      res.json({ qrCodeUrl: url });
    }
  });
});


// **Iniciar Servidor**
app.listen(port, '0.0.0.0', async () => {
  await connectDB(); // Conexión inicial a la base de datos
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
