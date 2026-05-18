import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class GetCategoriesController {
  async handle(req, res) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' } 
      });

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil semua data kategori",
        data: categories
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

export const getCategoriesCtrl = new GetCategoriesController();