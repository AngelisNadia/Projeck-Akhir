const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_banget_123';

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await prisma.provider.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProvider = await prisma.provider.create({
      data: { name, email, password: hashedPassword, phone }
    });

    res.status(201).json({
      message: "Registrasi Berhasil",
      data: { id: newProvider.id, email: newProvider.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const provider = await prisma.provider.findUnique({ where: { email } });
    if (!provider) return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: provider.id, email: provider.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login berhasil",
      user: { id: provider.id, name: provider.name, email: provider.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logout berhasil" });
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    res.json({ message: `Email berhasil diverifikasi dengan token: ${token}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { register, login, logout, verifyEmail };