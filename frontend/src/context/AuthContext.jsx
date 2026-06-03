import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('aquafarm_user')||'null')); const [loading,setLoading]=useState(false);
 const login=async(email,password)=>{setLoading(true); try{const {data}=await api.post('/auth/login',{email,password}); localStorage.setItem('aquafarm_token',data.token); localStorage.setItem('aquafarm_user',JSON.stringify(data.user)); setUser(data.user); return data.user;}finally{setLoading(false)}};
 const register=async(payload)=>{setLoading(true); try{const {data}=await api.post('/auth/register',payload); localStorage.setItem('aquafarm_token',data.token); localStorage.setItem('aquafarm_user',JSON.stringify(data.user)); setUser(data.user); return data.user;}finally{setLoading(false)}};
 const logout=()=>{localStorage.removeItem('aquafarm_token');localStorage.removeItem('aquafarm_user');setUser(null)};
 useEffect(()=>{if(localStorage.getItem('aquafarm_token')) api.get('/auth/me').then(({data})=>{setUser(data.user);localStorage.setItem('aquafarm_user',JSON.stringify(data.user))}).catch(()=>logout())},[]);
 const value=useMemo(()=>({user,login,register,logout,loading,isAuthed:!!user}),[user,loading]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);
