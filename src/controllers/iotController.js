import IoTOrder from '../models/IoTOrder.js';

import BrochureRequest from '../models/BrochureRequest.js';

// Créer une commande IoT
export const createIoTOrder = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      company,
      address,
      packType = 'iot-complete',
      paymentMethod = 'on_site'
    } = req.body;

    // Validation
    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Nom complet, email et téléphone sont requis'
      });
    }

    const iotOrder = new IoTOrder({
      customer: {
        fullName,
        email,
        phone,
        company,
        address
      },
      packType,
      paymentMethod
    });

    await iotOrder.save();

    res.status(201).json({
      success: true,
      message: 'Commande IoT créée avec succès',
      data: {
        orderId: iotOrder._id,
        orderNumber: iotOrder.orderNumber,
        customer: iotOrder.customer,
        totalAmount: iotOrder.totalAmount,
        status: iotOrder.status,
        createdAt: iotOrder.createdAt
      }
    });

  } catch (error) {
    console.error('Erreur création commande IoT:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur: ' + error.message
    });
  }
};

// Récupérer toutes les commandes IoT
export const getIoTOrders = async (req, res) => {
  try {
    const orders = await IoTOrder.find().sort({ createdAt: -1 });
    
    const stats = {
      total: await IoTOrder.countDocuments(),
      pending: await IoTOrder.countDocuments({ status: 'pending' }),
      confirmed: await IoTOrder.countDocuments({ status: 'confirmed' }),
      shipped: await IoTOrder.countDocuments({ status: 'shipped' }),
      delivered: await IoTOrder.countDocuments({ status: 'delivered' })
    };

    res.json({
      success: true,
      data: {
        orders,
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Erreur récupération commandes IoT:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes'
    });
  }
};

// Mettre à jour le statut d'une commande IoT
export const updateIoTOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Le statut est requis'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const order = await IoTOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      message: `Statut de la commande mis à jour: ${status}`,
      data: order
    });
  } catch (error) {
    console.error('Erreur mise à jour statut IoT:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
};



// Créer une demande de brochure
export const createBrochureRequest = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, brochureType } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Prénom, nom et email sont requis'
      });
    }

    const brochureRequest = new BrochureRequest({
      firstName,
      lastName,
      email,
      phone,
      company,
      brochureType
    });

    await brochureRequest.save();

    res.status(201).json({
      success: true,
      message: 'Demande de brochure enregistrée avec succès',
      data: {
        requestId: brochureRequest._id,
        requestNumber: brochureRequest.requestNumber,
        status: brochureRequest.status
      }
    });
  } catch (error) {
    console.error('Erreur demande brochure:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de la demande'
    });
  }
};

// Récupérer les statistiques IoT
export const getIoTStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalDemoRequests,
      totalBrochureRequests,
      revenue
    ] = await Promise.all([
      IoTOrder.countDocuments(),
      DemoRequest.countDocuments(),
      BrochureRequest.countDocuments(),
      IoTOrder.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalDemoRequests,
        totalBrochureRequests,
        totalRevenue: revenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Erreur statistiques IoT:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des statistiques'
    });
  }
};