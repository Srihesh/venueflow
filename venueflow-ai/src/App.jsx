import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Smartphone, Activity } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Attendee from './pages/Attendee';

function VerticalDock() {
  const location = useLocation();

  return (
    <nav className="glass-nav w-20 fixed left-0 top-0 bottom-0 z-50 flex flex-col items-center py-8 justify-between">
      {/* Brand Logo */}
      <div className="flex flex-col items-center gap-2 group cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all">
           <Activity size={20} className="text-white" />
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col gap-8">
        <Link 
          to="/" 
          className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
            location.pathname === '/' 
            ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20' 
            : 'text-slate-500 hover:text-white hover:bg-white/5'
          }`}
          title="Command Center"
        >
          <LayoutDashboard size={22} />
        </Link>
        <Link 
          to="/attendee" 
          className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
            location.pathname === '/attendee' 
            ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20' 
            : 'text-slate-500 hover:text-white hover:bg-white/5'
          }`}
          title="Mobile View"
        >
          <Smartphone size={22} />
        </Link>
      </div>

      {/* Bottom Spacer/User Icon placeholder */}
      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* 
        The top-level container covers the whole screen.
        The map in the dashboard will act as the literal background.
      */}
      <div className="h-screen w-screen bg-cine-dark text-slate-200 flex font-sans overflow-hidden">
        <VerticalDock />
        <main className="flex-1 w-full relative ml-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attendee" element={<Attendee />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
