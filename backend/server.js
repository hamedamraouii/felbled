const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');


const app = express();
connectDB();


app.use(cors());
app.use(express.json());

app.use('/api/delegations', require('./routes/delegationsRoutes'));
app.use('/api/subcategories', require('./routes/subcategoriesRoutes'));
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

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
