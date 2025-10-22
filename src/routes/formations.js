import express from 'express' ;
import Formation from '../models/Formation';

const router = express.Router();

// GET toutes les formations
router.get('/', async (req, res) => {
  try {
    const formations = await Formation.find({ isActive: true }).sort({ order: 1 });
    res.json(formations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET une formation par ID
router.get('/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    res.json(formation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;