const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_banget_123';

const getProviders = async (req, res) => {
  try {
    const providers = await prisma.provider.findMany();
    res.status(200).json({
      success: true,
      data: providers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProvider = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, phone } = req.body;

    const updated = await prisma.provider.update({
      where: { id: parseInt(id) },
      data: { name, phone }
    });

    res.json({ message: "Data berhasil diperbarui", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.provider.delete({
      where: { id: id
 }
    });
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProviders, updateProvider, deleteProvider };