import { asyncHandler } from '../utils/asyncHandler.js';
export const crud = (Model, populate = '') => ({
  getAll: asyncHandler(async(req,res)=>{
    const query = { owner: req.user._id };
    if (req.query.pond) query.pond = req.query.pond;
    if (req.query.batch) query.batch = req.query.batch;
    const items = await Model.find(query).populate(populate).sort({ createdAt:-1 });
    res.json({ success:true, count:items.length, data:items });
  }),
  getOne: asyncHandler(async(req,res)=>{
    const item = await Model.findOne({ _id:req.params.id, owner:req.user._id }).populate(populate);
    if (!item) { res.status(404); throw new Error('Record not found.'); }
    res.json({ success:true, data:item });
  }),
  create: asyncHandler(async(req,res)=>{
    const item = await Model.create({ ...req.body, owner:req.user._id });
    const populated = await Model.findById(item._id).populate(populate);
    res.status(201).json({ success:true, data:populated });
  }),
  update: asyncHandler(async(req,res)=>{
    const item = await Model.findOneAndUpdate({ _id:req.params.id, owner:req.user._id }, req.body, { new:true, runValidators:true }).populate(populate);
    if (!item) { res.status(404); throw new Error('Record not found.'); }
    res.json({ success:true, data:item });
  }),
  remove: asyncHandler(async(req,res)=>{
    const item = await Model.findOneAndDelete({ _id:req.params.id, owner:req.user._id });
    if (!item) { res.status(404); throw new Error('Record not found.'); }
    res.json({ success:true, message:'Deleted successfully.' });
  })
});
