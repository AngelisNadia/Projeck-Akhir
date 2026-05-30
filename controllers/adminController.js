import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class GetAdminListingsController {
  async handle(req, res) {
    try {
      const { status } = req.query;

      const listings = await prisma.listing.findMany({
        where: status ? { status: status } : {}, 
        include: {
          category: true,
          provider: {
            select: { name: true, email: true, phone: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({ success: true, data: listings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

class UpdateListingStatusController {
  async handle(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.query; 
      const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];
      if (!status || !validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({ 
          success: false, 
          message: "Status tidak valid! Gunakan PENDING, APPROVED, REJECTED, atau SUSPENDED" 
        });
      }

      const updatedListing = await prisma.listing.update({
        where: { id: id },
        data: { status: status.toUpperCase() }
      });

      res.status(200).json({ 
        success: true, 
        message: `Status listing berhasil diperbarui menjadi ${status}`, 
        data: updatedListing 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

class GetAdminStatsController {
  async handle(req, res) {
    try {
      const [totalListings, totalProviders, pendingListings] = await Promise.all([
        prisma.listing.count(),
        prisma.provider.count(),
        prisma.listing.count({ where: { status: 'PENDING' } })
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalListings,
          totalProviders,
          pendingListings
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
class CreateCategoryController {
  async handle(req, res) {
    try {
      const { name, slug } = req.body;

      if (!name || !slug) {
        return res.status(400).json({ success: false, message: "Nama dan slug kategori wajib diisi!" });
      }

      const categoryExists = await prisma.category.findUnique({ where: { slug } });
      if (categoryExists) {
        return res.status(400).json({ success: false, message: "Slug kategori sudah terdaftar, gunakan slug lain" });
      }

      const newCategory = await prisma.category.create({
        data: { name, slug: slug.toLowerCase() }
      });

      res.status(201).json({
        success: true,
        message: "Kategori baru berhasil ditambahkan",
        data: newCategory
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
class UpdateCategoryController {
  async handle(req, res) {
    try {
      const { id } = req.params;
      const { name, slug } = req.body;
      const updatedCategory = await prisma.category.update({
        where: { id: id }, 
        data: { 
          name, 
          slug: slug ? slug.toLowerCase() : undefined 
        }
      });

      res.status(200).json({
        success: true,
        message: "Kategori berhasil diperbarui",
        data: updatedCategory
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
class DeleteCategoryController {
  async handle(req, res) {
    try {
      const { id } = req.params;

      await prisma.category.delete({
        where: { id: id } 
      });

      res.status(200).json({
        success: true,
        message: "Kategori berhasil dihapus"
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const getAdminListingsCtrl = new GetAdminListingsController();
export const updateListingStatusCtrl = new UpdateListingStatusController();
export const getAdminStatsCtrl = new GetAdminStatsController();
export const createCategoryCtrl = new CreateCategoryController();
export const updateCategoryCtrl = new UpdateCategoryController();
export const deleteCategoryCtrl = new DeleteCategoryController();