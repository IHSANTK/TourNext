require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./Routes/Userrouter'); 
const adminRoutes = require('./Routes/Adminrouter'); 
const googleAuthRoutes = require('./Routes/GoogleAuthRoutes'); // Add this line

const app = express();

mongoose.connect(process.env.MONGOOSE_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', userRoutes);
app.use('/', adminRoutes);
app.use('/', googleAuthRoutes); 

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port :http://localhost:${PORT}`);
});
