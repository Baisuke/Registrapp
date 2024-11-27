const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const attendanceSchema = new Schema({
  user: String,
  date: Date,
  section: String,
  status: String,
  subject: String,
  sessionId: String,
});

const Attendance = model('Attendance', attendanceSchema);

module.exports = { Attendance };
