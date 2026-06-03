import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { crud } from '../controllers/crudController.js';
import Model from '../models/FeedLog.js';
import { feedSchema } from '../validators/schemas.js';

const router = express.Router();
const c = crud(Model, 'pond batch');
router.use(protect);
router.route('/').get(c.getAll).post(authorize('admin','manager','technician'), validate(feedSchema), c.create);
router.route('/:id').get(c.getOne).put(authorize('admin','manager','technician'), validate(feedSchema), c.update).delete(authorize('admin'), c.remove);
export default router;
