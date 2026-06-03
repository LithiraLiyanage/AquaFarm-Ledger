import { asyncHandler } from '../utils/asyncHandler.js';
import Pond from '../models/Pond.js';
import FishBatch from '../models/FishBatch.js';
import FeedLog from '../models/FeedLog.js';
import WaterQualityLog from '../models/WaterQualityLog.js';
import MortalityLog from '../models/MortalityLog.js';
import HarvestPlan from '../models/HarvestPlan.js';
import CostRecord from '../models/CostRecord.js';
import Alert from '../models/Alert.js';
import FarmSettings from '../models/FarmSettings.js';
import { waterQualityScore, calcHarvest } from '../services/calculators.js';
import { waterAlerts, createAlert } from '../services/alertService.js';

export const createWaterLog = asyncHandler(async(req,res)=>{
  const calc = waterQualityScore(req.body);
  const log = await WaterQualityLog.create({ ...req.body, owner:req.user._id, ...calc });
  await waterAlerts(log);
  res.status(201).json({ success:true, data: await log.populate('pond') });
});

export const updateWaterLog = asyncHandler(async(req,res)=>{
  const calc = waterQualityScore(req.body);
  const log = await WaterQualityLog.findOneAndUpdate({ _id:req.params.id, owner:req.user._id }, { ...req.body, ...calc }, { new:true, runValidators:true }).populate('pond');
  if (!log) { res.status(404); throw new Error('Water log not found.'); }
  res.json({ success:true, data:log });
});

export const createMortality = asyncHandler(async(req,res)=>{
  const batch = await FishBatch.findOne({ _id:req.body.batch, owner:req.user._id });
  if (!batch) { res.status(404); throw new Error('Batch not found.'); }
  if (req.body.deadCount > batch.currentStock) { res.status(400); throw new Error('Death count cannot exceed current stock.'); }
  const log = await MortalityLog.create({ ...req.body, owner:req.user._id });
  batch.currentStock -= req.body.deadCount;
  await batch.save();
  if (req.body.deadCount >= 20 || (req.body.deadCount / Math.max(1,batch.initialStock)) * 100 > 2) {
    await createAlert({ owner:req.user._id, title:'High mortality detected', type:'Mortality', severity:'Critical', pond:req.body.pond, batch:req.body.batch, message:`${req.body.deadCount} deaths recorded for ${batch.batchName}. Immediate inspection recommended.` });
  }
  res.status(201).json({ success:true, data: await log.populate('pond batch') });
});

export const createHarvest = asyncHandler(async(req,res)=>{
  const batch = await FishBatch.findOne({ _id:req.body.batch, owner:req.user._id });
  if (!batch) { res.status(404); throw new Error('Batch not found.'); }
  const costs = await CostRecord.aggregate([{ $match:{ owner:req.user._id, batch:batch._id } }, { $group:{ _id:null, total:{ $sum:'$amount' } } }]);
  const calc = calcHarvest(batch.currentStock, req.body.estimatedAverageWeight, req.body.sellingPricePerKg, costs[0]?.total || batch.totalBatchCost || 0);
  const plan = await HarvestPlan.create({ ...req.body, owner:req.user._id, estimatedBiomass:calc.biomass, estimatedRevenue:calc.revenue, estimatedProfit:calc.profit });
  if (new Date(req.body.expectedHarvestDate) <= new Date(Date.now()+1000*60*60*24*14)) {
    await createAlert({ owner:req.user._id, title:'Batch ready soon', type:'Harvest', severity:'Medium', pond:req.body.pond, batch:req.body.batch, message:`${batch.batchName} is approaching harvest window.` });
  }
  res.status(201).json({ success:true, data: await plan.populate('pond batch') });
});

export const getDashboardReport = asyncHandler(async(req,res)=>{
  const owner = req.user._id;
  const [ponds,batches,feeds,water,mortality,costs,alerts,harvests] = await Promise.all([
    Pond.find({owner}), FishBatch.find({owner}).populate('pond'), FeedLog.find({owner}).populate('pond batch').sort({feedingDate:-1}).limit(12),
    WaterQualityLog.find({owner}).populate('pond').sort({recordedAt:-1}).limit(20), MortalityLog.find({owner}).populate('pond batch').sort({date:-1}).limit(20),
    CostRecord.find({owner}).sort({date:-1}), Alert.find({owner}).populate('pond batch').sort({createdAt:-1}).limit(10), HarvestPlan.find({owner}).populate('pond batch').sort({expectedHarvestDate:1})
  ]);
  const totalStock = batches.reduce((s,b)=>s+b.currentStock,0);
  const initialStock = batches.reduce((s,b)=>s+b.initialStock,0);
  const today = new Date().toISOString().slice(0,10);
  const todayFeed = feeds.filter(f=>new Date(f.feedingDate).toISOString().slice(0,10)===today).reduce((s,f)=>s+f.quantityKg,0);
  const monthlyCost = costs.filter(c=>new Date(c.date).getMonth()===new Date().getMonth()).reduce((s,c)=>s+c.amount,0);
  const avgWaterScore = water.length ? Math.round(water.reduce((s,w)=>s+w.score,0)/water.length) : 100;
  const harvestValue = harvests.reduce((s,h)=>s+h.estimatedRevenue,0);
  const totalDead = mortality.reduce((s,m)=>s+m.deadCount,0);
  res.json({ success:true, data:{
    stats:{ totalPonds:ponds.length, activeBatches:batches.filter(b=>b.status!=='Closed').length, totalStock, todayFeed, mortalityRate: initialStock ? Number(((totalDead/initialStock)*100).toFixed(2)) : 0, waterQualityScore:avgWaterScore, estimatedHarvestValue:harvestValue, monthlyCost },
    ponds, batches, feeds, water, mortality, costs, alerts, harvests,
    charts:{
      waterTrend: water.slice().reverse().map(w=>({ name:new Date(w.recordedAt).toLocaleDateString(), score:w.score, ph:w.ph, oxygen:w.dissolvedOxygen })),
      feedUsage: feeds.slice().reverse().map(f=>({ name:new Date(f.feedingDate).toLocaleDateString(), kg:f.quantityKg })),
      mortalityTrend: mortality.slice().reverse().map(m=>({ name:new Date(m.date).toLocaleDateString(), deaths:m.deadCount })),
      costByCategory: Object.values(costs.reduce((a,c)=>{a[c.category]=a[c.category]||{name:c.category,value:0}; a[c.category].value+=c.amount; return a;},{})),
      harvestForecast: harvests.map(h=>({ name:h.batch?.batchName || 'Batch', revenue:h.estimatedRevenue, profit:h.estimatedProfit }))
    }
  }});
});

export const getSettings = asyncHandler(async(req,res)=>{
  let settings = await FarmSettings.findOne({ owner:req.user._id });
  if (!settings) settings = await FarmSettings.create({ owner:req.user._id, farmName:req.user.farmName, ownerName:req.user.name, email:req.user.email });
  res.json({ success:true, data:settings });
});
export const updateSettings = asyncHandler(async(req,res)=>{
  const settings = await FarmSettings.findOneAndUpdate({ owner:req.user._id }, req.body, { new:true, upsert:true, runValidators:true });
  res.json({ success:true, data:settings });
});
