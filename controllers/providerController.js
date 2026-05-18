import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
class GetProvidersController {
  async handle(req, res) {
    try {
      const providers = await prisma.provider.findMany();
      res.status(200).json({
        success: true,
        data: providers
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
class UpdateProviderController {
  async handle(req, res) {
    try {
      const { id } = req.params; 
      const { name, phone } = req.body;
      const updated = await prisma.provider.update({
        where: { id: id },
        data: { name, phone }
      });

      res.json({ 
        success: true, 
        message: "Data berhasil diperbarui", 
        data: updated 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
class DeleteProviderController {
  async handle(req, res) {
    try {
      const { id } = req.params;
      
      await prisma.provider.delete({
        where: { id: id }
      });
      
      res.json({ 
        success: true, 
        message: "Data berhasil dihapus" 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
export const getProvidersCtrl = new GetProvidersController();
export const updateProviderCtrl = new UpdateProviderController();
export const deleteProviderCtrl = new DeleteProviderController();