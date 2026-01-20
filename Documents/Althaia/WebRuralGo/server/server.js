const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Conectar MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.io para notificaciones en tiempo real
const activeUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('🔌 Usuario conectado:', socket.id);

  // Registrar usuario en línea
  socket.on('user_online', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`✅ Usuario ${userId} en línea`);
  });

  // Escuchar solicitud de viaje
  socket.on('trip_requested', (tripData) => {
    console.log('📍 Viaje solicitado:', tripData);
    // Emitir a todos los conductores en línea
    io.emit('new_trip_available', tripData);
  });

  // Conductor acepta viaje
  socket.on('trip_accepted', (tripData) => {
    console.log('✅ Viaje aceptado');
    const passengerSocket = activeUsers.get(tripData.passengerId.toString());
    if (passengerSocket) {
      io.to(passengerSocket).emit('trip_accepted_notification', {
        message: `El conductor ${tripData.driverName} ha aceptado tu viaje`,
        trip: tripData
      });
    }
  });

  // Conductor inicia viaje
  socket.on('trip_started', (tripData) => {
    console.log('🚗 Viaje iniciado');
    const passengerSocket = activeUsers.get(tripData.passengerId.toString());
    if (passengerSocket) {
      io.to(passengerSocket).emit('trip_started_notification', {
        message: 'Tu viaje ha comenzado',
        trip: tripData
      });
    }
  });

  // Actualizar ubicación en tiempo real
  socket.on('update_location', (locationData) => {
    // Emitir ubicación actualizada a pasajeros en viajes activos
    io.emit('driver_location_updated', {
      driverId: socket.userId,
      ...locationData
    });
  });

  // Conductor completa viaje
  socket.on('trip_completed', (tripData) => {
    console.log('✅ Viaje completado');
    const passengerSocket = activeUsers.get(tripData.passengerId.toString());
    if (passengerSocket) {
      io.to(passengerSocket).emit('trip_completed_notification', {
        message: 'Tu viaje ha finalizado',
        trip: tripData
      });
    }
  });

  // Desconexión
  socket.on('disconnect', () => {
    activeUsers.delete(socket.userId);
    console.log('❌ Usuario desconectado:', socket.id);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📍 URL del servidor: http://localhost:${PORT}`);
});

module.exports = { app, io };
