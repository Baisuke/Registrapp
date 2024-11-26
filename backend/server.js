const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Attendance } = require('../models/attendance');
const router = express.Router();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://<tu-usuario>:<tu-contraseña>@<tu-cluster>.mongodb.net/<tu-bd>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Modelo para almacenar datos
const UserDataSchema = new mongoose.Schema({
  user: String,
  scannedData: String,
});
const UserData = mongoose.model('UserData', UserDataSchema);


router.get('/get-attendance', async (req, res) => {
    const { date, section } = req.query;
  
    try {
      const attendanceRecords = await Attendance.find({
        date: date,
        section: section,
      });
  
      if (attendanceRecords.length === 0) {
        return res.status(404).send({ message: 'No se encontró asistencia para esta fecha y sección.' });
      }
  
      res.status(200).send(attendanceRecords);
    } catch (error) {
      console.error('Error al consultar la asistencia:', error);
      res.status(500).send({ message: 'Error interno del servidor.', error });
    }
  });

module.exports = router;
app.post('/api/storeUserData', async (req, res) => {
    const { user, date, subject, sessionId } = req.body;
  
    try {
      // Guardar en la base de datos
      await db.collection('attendance').insertOne({ user, date, subject, sessionId });
      res.status(200).send('Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar datos:', error);
      res.status(500).send('Error al guardar datos');
    }
  });

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/api/getUserData', async (req, res) => {
    try {
      // Busca todos los datos almacenados en la colección
      const userDataList = await UserData.find();
      res.status(200).json({ message: 'Datos obtenidos exitosamente', data: userDataList });
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener los datos', error: err });
    }
  });
