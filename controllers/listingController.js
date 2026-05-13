const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/listings (Feed dengan filter)
const getAllListings = async (req, res) => {
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
};

const getListingDetail = async (req, res) => {
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
};

module.exports = { getAllListings, getListingDetail };