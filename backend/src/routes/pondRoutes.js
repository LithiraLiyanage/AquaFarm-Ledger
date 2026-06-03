import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { crud } from '../controllers/crudController.js';
import Model from '../models/Pond.js';
import { pondSchema } from '../validators/schemas.js';

const router = express.Router();
const c = crud(Model, '');
router.use(protect);
router.route('/').get(c.getAll).post(authorize('admin','manager'), validate(pondSchema), c.create);
router.route('/:id').get(c.getOne).put(authorize('admin','manager'), validate(pondSchema), c.update).delete(authorize('admin'), c.remove);
export default router;
