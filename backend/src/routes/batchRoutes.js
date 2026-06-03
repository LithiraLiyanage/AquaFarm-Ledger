import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { crud } from '../controllers/crudController.js';
import Model from '../models/FishBatch.js';
import { batchSchema } from '../validators/schemas.js';

const router = express.Router();
const c = crud(Model, 'pond');
router.use(protect);
router.route('/').get(c.getAll).post(authorize('admin','manager'), validate(batchSchema), c.create);
router.route('/:id').get(c.getOne).put(authorize('admin','manager'), validate(batchSchema), c.update).delete(authorize('admin'), c.remove);
export default router;
