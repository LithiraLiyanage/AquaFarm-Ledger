import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CrudPage from './pages/CrudPage.jsx';
import PondDetails from './pages/PondDetails.jsx';
import BatchDetails from './pages/BatchDetails.jsx';
import Alerts from './pages/Alerts.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';
export default function App(){return <BrowserRouter><Routes><Route path="/" element={<LandingPage/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route element={<ProtectedRoute/>}><Route path="/app" element={<AppLayout/>}><Route index element={<Navigate to="dashboard"/>}/><Route path="dashboard" element={<Dashboard/>}/><Route path="ponds" element={<CrudPage type="ponds"/>}/><Route path="ponds/:id" element={<PondDetails/>}/><Route path="batches" element={<CrudPage type="batches"/>}/><Route path="batches/:id" element={<BatchDetails/>}/><Route path="feed-logs" element={<CrudPage type="feed"/>}/><Route path="feed-schedule" element={<CrudPage type="schedule"/>}/><Route path="water-quality" element={<CrudPage type="water"/>}/><Route path="mortality" element={<CrudPage type="mortality"/>}/><Route path="harvest-planning" element={<CrudPage type="harvest"/>}/><Route path="cost-analytics" element={<CrudPage type="costs"/>}/><Route path="alerts" element={<Alerts/>}/><Route path="reports" element={<Reports/>}/><Route path="settings" element={<Settings/>}/><Route path="profile" element={<Profile/>}/></Route></Route><Route path="*" element={<NotFound/>}/></Routes></BrowserRouter>}
