import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
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

dotenv.config();
await connectDB();
await Promise.all([User.deleteMany(),Pond.deleteMany(),FishBatch.deleteMany(),FeedLog.deleteMany(),WaterQualityLog.deleteMany(),MortalityLog.deleteMany(),HarvestPlan.deleteMany(),CostRecord.deleteMany(),Alert.deleteMany(),FarmSettings.deleteMany()]);
const user = await User.create({ name:'Lithira Demo Owner', email:'owner@aquafarm.dev', password:'Demo@12345', role:'admin', farmName:'Negombo Smart Aqua Farm' });
await FarmSettings.create({ owner:user._id, farmName:'Negombo Smart Aqua Farm', ownerName:user.name, location:'Negombo, Sri Lanka', contactNumber:'+94 77 123 4567', email:user.email });
const ponds = await Pond.insertMany([
 {owner:user._id,name:'Lagoon Pearl Pond',code:'POND-001',location:'North Block',pondType:'Earthen',waterType:'Brackish',area:1200,depth:1.5,capacity:12000,status:'Active'},
 {owner:user._id,name:'Purple Tide Tank',code:'POND-002',location:'East Block',pondType:'Concrete',waterType:'Freshwater',area:700,depth:1.3,capacity:6500,status:'Active'},
 {owner:user._id,name:'Aqua Nova Pond',code:'POND-003',location:'South Block',pondType:'Earthen',waterType:'Freshwater',area:950,depth:1.4,capacity:9000,status:'Active'},
 {owner:user._id,name:'Harvest Bay Cage',code:'POND-004',location:'Lagoon Side',pondType:'Cage',waterType:'Brackish',area:400,depth:2.0,capacity:4500,status:'Maintenance'}
]);
const d=(days)=>new Date(Date.now()+days*86400000);
const batches = await FishBatch.insertMany([
 {owner:user._id,pond:ponds[0]._id,batchName:'Tilapia Alpha 2026',species:'Tilapia',initialStock:9000,currentStock:8820,averageWeight:0.42,stockingDate:d(-125),expectedHarvestDate:d(35),supplier:'Kurunegala Hatchery',costPerFingerling:18,totalBatchCost:162000,status:'Growing'},
 {owner:user._id,pond:ponds[1]._id,batchName:'Catfish NightWave',species:'Catfish',initialStock:5200,currentStock:5110,averageWeight:0.58,stockingDate:d(-150),expectedHarvestDate:d(20),supplier:'Matara Aqua Seeds',costPerFingerling:22,totalBatchCost:114400,status:'Ready to Harvest'},
 {owner:user._id,pond:ponds[2]._id,batchName:'Carp Greenline',species:'Carp',initialStock:7200,currentStock:7105,averageWeight:0.31,stockingDate:d(-90),expectedHarvestDate:d(70),supplier:'Dambulla Hatchery',costPerFingerling:15,totalBatchCost:108000,status:'Growing'},
 {owner:user._id,pond:ponds[3]._id,batchName:'Prawn Lagoon Gold',species:'Prawns',initialStock:4000,currentStock:3900,averageWeight:0.08,stockingDate:d(-55),expectedHarvestDate:d(85),supplier:'Chilaw Prawn Center',costPerFingerling:12,totalBatchCost:48000,status:'Growing'},
 {owner:user._id,pond:ponds[0]._id,batchName:'Tilapia Beta Trial',species:'Tilapia',initialStock:2200,currentStock:2182,averageWeight:0.19,stockingDate:d(-45),expectedHarvestDate:d(115),supplier:'Kurunegala Hatchery',costPerFingerling:18,totalBatchCost:39600,status:'Growing'}
]);
const feeds=[]; for(let i=0;i<14;i++){ feeds.push({owner:user._id,pond:ponds[i%3]._id,batch:batches[i%4]._id,feedType:i%2?'Pellet Grower':'High Protein Starter',feedBrand:i%2?'Prima Aqua':'CIC Aqua',quantityKg:80+i*4,costPerKg:330,feedingTime:i%2?'17:00':'08:00',feedingDate:d(-i),staffName:i%2?'Nimal Perera':'Kasun Silva',notes:'Routine feed'}); } await FeedLog.insertMany(feeds);
const waters=[]; for(let i=0;i<18;i++){ const body={ph:6.8+(i%5)*0.35,temperature:26+(i%6),dissolvedOxygen:4.4+(i%5)*0.55,ammonia:(i%4)*0.18}; const calc=waterQualityScore(body); waters.push({owner:user._id,pond:ponds[i%3]._id,recordedAt:d(-i),...body,turbidity:12+i,salinity:i%3,...calc,notes:'Automated sample reading'}); } await WaterQualityLog.insertMany(waters);
await MortalityLog.insertMany([{owner:user._id,pond:ponds[0]._id,batch:batches[0]._id,date:d(-6),deadCount:18,suspectedReason:'Low oxygen spike',actionTaken:'Added aeration',staffName:'Nimal Perera'},{owner:user._id,pond:ponds[1]._id,batch:batches[1]._id,date:d(-3),deadCount:8,suspectedReason:'Handling stress',actionTaken:'Reduced disturbance',staffName:'Kasun Silva'}]);
await CostRecord.insertMany([{owner:user._id,pond:ponds[0]._id,batch:batches[0]._id,category:'Feed',amount:325000,date:d(-12),description:'Monthly pellet feed'},{owner:user._id,pond:ponds[1]._id,batch:batches[1]._id,category:'Medicine',amount:28000,date:d(-8),description:'Preventive treatment'},{owner:user._id,category:'Labor',amount:185000,date:d(-2),description:'Monthly labor cost'},{owner:user._id,pond:ponds[2]._id,batch:batches[2]._id,category:'Fingerlings',amount:108000,date:d(-85),description:'Carp fingerlings'}]);
for (const b of batches.slice(0,3)) { const calc=calcHarvest(b.currentStock,b.averageWeight*1.35,780,b.totalBatchCost); await HarvestPlan.create({owner:user._id,pond:b.pond,batch:b._id,expectedHarvestDate:b.expectedHarvestDate,estimatedAverageWeight:b.averageWeight*1.35,estimatedBiomass:calc.biomass,sellingPricePerKg:780,estimatedRevenue:calc.revenue,estimatedProfit:calc.profit,status:b.status==='Ready to Harvest'?'Ready':'Planned'}); }
await Alert.insertMany([{owner:user._id,title:'Low oxygen warning',type:'Water Quality',severity:'High',pond:ponds[0]._id,batch:batches[0]._id,message:'Dissolved oxygen dropped below 5 mg/L. Increase aeration.',status:'Unread'},{owner:user._id,title:'Harvest window approaching',type:'Harvest',severity:'Medium',pond:ponds[1]._id,batch:batches[1]._id,message:'Catfish NightWave is ready for harvest planning.',status:'Unread'}]);
console.log('Seed completed. Demo login: owner@aquafarm.dev / Demo@12345');
process.exit(0);
