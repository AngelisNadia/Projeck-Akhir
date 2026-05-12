const express = require('express');
const cookieParser = require('cookie-parser'); // Tambah ini
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser()); // Tambah ini supaya bisa baca cookie

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend Bantu Nyata Is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});