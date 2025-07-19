const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');


const app = express();
connectDB();


app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/delegations', require('./routes/delegationsRoutes'));
app.use('/api/subcategories', require('./routes/subcategoriesRoutes'));
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.use('/api/categories', require('./routes/categoryRoutes'));
const secteurRoutes = require('./routes/secteursRouter');
app.use('/api/secteurs', secteurRoutes);
// Ensure this is after userRoutes to avoid conflicts


const gouvernoratRoutes=require('./routes/gouvernoratRoutes');
app.use('/api/gouvernorats',gouvernoratRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is up and running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});
