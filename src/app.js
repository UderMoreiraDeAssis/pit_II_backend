const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./util/swagger');

const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const allowedOrigins = [process.env.FRONT_WHITELIST];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/time-entries', require('./routes/timeEntryRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/productivity', require('./routes/productivityRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Create unique index on email field
    mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true }, (err, result) => {
      if (err) {
        console.error('Error creating unique index on email:', err);
      } else {
        console.log('Unique index on email created successfully');
      }
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use(require('./middlewares/errorHandlingMiddleware'));

// const mongoose = require('mongoose');
// require('dotenv').config();

// // Importar os modelos
// const User = require('./models/User');
// const Task = require('./models/Task');
// const Project = require('./models/Project');
// const TimeEntry = require('./models/TimeEntry');

// // Função de limpeza
// const clearDatabase = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('Conectado ao MongoDB. Limpando dados...');

//     // Deletar documentos de todas as coleções
//     await User.deleteMany({});
//     await Task.deleteMany({});
//     await Project.deleteMany({});
//     await TimeEntry.deleteMany({});

//     console.log('Banco de dados limpo com sucesso!');
//     mongoose.connection.close();
//   } catch (err) {
//     console.error('Erro ao limpar o banco de dados:', err);
//     process.exit(1);
//   }
// };

// clearDatabase();

// const bcrypt = require('bcryptjs');
// const hash = '$2a$10$mWGT4IAgpEcVRwe5QiEBDOfROZ0l9QLuTbREGI2PNrv6wvGIqOi1.'; // do MongoDB
// const isValid = bcrypt.compareSync('password123', hash);
// console.log(isValid); // Deve retornar true

// const User = require('./models/User'); // Certifique-se de ajustar o caminho

// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(async () => {
//     console.log('Conectado ao MongoDB');
//     const users = await User.find();
//     console.log('Usuários registrados:', users);
//     mongoose.connection.close();
//   })
//   .catch((err) => console.error('Erro ao conectar ou listar usuários:', err));

module.exports = app;
