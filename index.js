const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Tambah ini
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listing'); 

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes); 

app.get('/', (req, res) => {
  res.send('Backend Bantu Nyata Is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});