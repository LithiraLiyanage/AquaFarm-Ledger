import User from '../models/User.js';
import FarmSettings from '../models/FarmSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';

const sendAuth = (res, user, status=200) => res.status(status).json({ success:true, token: signToken(user), user: { id:user._id, name:user.name, email:user.email, role:user.role, farmName:user.farmName } });
export const register = asyncHandler(async(req,res)=>{
  const exists = await User.findOne({ email:req.body.email });
  if (exists) { res.status(409); throw new Error('Email already registered.'); }
  const user = await User.create(req.body);
  await FarmSettings.create({ owner:user._id, farmName:user.farmName, ownerName:user.name, email:user.email });
  sendAuth(res,user,201);
});
export const login = asyncHandler(async(req,res)=>{
  const user = await User.findOne({ email:req.body.email });
  if (!user || !(await user.matchPassword(req.body.password))) { res.status(401); throw new Error('Invalid email or password.'); }
  sendAuth(res,user);
});
export const me = asyncHandler(async(req,res)=> res.json({ success:true, user:req.user }));
