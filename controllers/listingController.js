import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class GetAllListingsController {
  async handle(req, res) {
    try {
      const { search, category, city, page = 1 } = req.query;
      const limit = 10; 
      const skip = (parseInt(page) - 1) * limit;

      const listings = await prisma.listing.findMany({
        where: {
          status: 'APPROVED', 
          AND: [
            search ? { name: { contains: search } } : {},
            city ? { city: { contains: city } } : {},
            category ? { category: { slug: category } } : {},
          ],
        },
        include: {
          category: true,
          media: { where: { isPrimary: true } }, 
        },
        take: limit,
        skip: skip,
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({ success: true, data: listings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
class GetListingDetailController {
  async handle(req, res) {
    try {
      const { id } = req.params;
      const listing = await prisma.listing.findUnique({
        where: { id: id },
        include: {
          category: true,
          media: true, 
          provider: {
            select: { name: true, phone: true } 
          }
        },
      });

      if (!listing) return res.status(404).json({ message: "Listing tidak ditemukan" });

      res.status(200).json({ success: true, data: listing });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
class CreateListingController {
  async handle(req, res) {
    try {
      const { 
        name, categoryId, description, city, 
        priceMin, priceMax, whatsapp, email, instagram 
      } = req.body;

      const newListing = await prisma.listing.create({
        data: {
          name,
          description,
          city,
          priceMin: parseInt(priceMin),
          priceMax: parseInt(priceMax),
          whatsapp,
          email,
          instagram,
          providerId: req.user.id, 
          categoryId: categoryId,
        }
      });

      res.status(201).json({ 
        success: true, 
        message: "Listing berhasil dibuat, menunggu verifikasi admin", 
        data: newListing 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
class UpdateListingController {
  async handle(req, res) {
    try {
      const { id } = req.params;
      const { name, description, city, priceMin, priceMax, whatsapp, email, instagram } = req.body;

      const checkListing = await prisma.listing.findFirst({
        where: { id: id, providerId: req.user.id }
      });

      if (!checkListing) {
        return res.status(403).json({ message: "Kamu tidak punya akses mengedit listing ini" });
      }

      const updated = await prisma.listing.update({
        where: { id: id },
        data: {
          name, description, city,
          priceMin: parseInt(priceMin),
          priceMax: parseInt(priceMax),
          whatsapp, email, instagram,
          status: 'PENDING' 
        }
      });

      res.json({ success: true, message: "Listing berhasil diupdate", data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

class GetProviderDashboardController {
  async handle(req, res) {
    try {
      const listings = await prisma.listing.findMany({
        where: { providerId: req.user.id },
        include: { 
          category: true,
          _count: { select: { views: true } } 
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: listings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
class GetProviderStatsController {
  async handle(req, res) {
    try {
      const stats = await prisma.listingView.groupBy({
        by: ['type'],
        where: { 
          listing: { providerId: req.user.id } 
        },
        _count: { _all: true }
      });
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const getAllListingsCtrl = new GetAllListingsController();
export const getListingDetailCtrl = new GetListingDetailController();
export const createListingCtrl = new CreateListingController();
export const updateListingCtrl = new UpdateListingController();
export const getProviderDashboardCtrl = new GetProviderDashboardController();
export const getProviderStatsCtrl = new GetProviderStatsController();