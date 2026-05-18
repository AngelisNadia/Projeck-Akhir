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

export const getAdminListingsCtrl = new GetAdminListingsController();
export const updateListingStatusCtrl = new UpdateListingStatusController();
export const getAdminStatsCtrl = new GetAdminStatsController();