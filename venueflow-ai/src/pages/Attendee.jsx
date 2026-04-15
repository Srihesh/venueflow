import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { getWayfindingResponse } from '../gemini';
import { Send, MapPin, Feather, Coffee, ScanFace, Activity } from 'lucide-react';

export default function Attendee() {
  const [data, setData] = useState(null);
  const [chat, setChat] = useState([{ sender: 'bot', text: 'CONNECTION ESTABLISHED. VENUE AI ASSISTANT STANDING BY.' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const currentZone = "North Stand";

  useEffect(() => {
    const dataRef = ref(db, 'venueData');
    const unsub = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setData(val);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setChat(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const context = {
      userZone: currentZone,
      gates: data?.gates || {},
      concessions: data?.concessions || [],
      stadiumCrowdLevels: data?.zones || {}
    };

    const reply = await getWayfindingResponse(userMsg, context);
    setChat(prev => [...prev, { sender: 'bot', text: reply }]);
    setIsTyping(false);
  };

  const currentZoneLevel = data?.zones ? data.zones[currentZone] : 0;
  const statusLabel = currentZoneLevel > 0.7 ? "High Congestion" : currentZoneLevel > 0.4 ? "Moderate Flow" : "Clear Area";
  const statusColor = currentZoneLevel > 0.7 ? "text-red-400" : currentZoneLevel > 0.4 ? "text-yellow-400" : "text-emerald-400";

  return (
    <div className="flex justify-center items-center h-full min-h-screen py-[5vh] lg:py-10 relative">
      
      {/* Background Cinematic Lighting */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_40%)]"></div>

      {/* Cinematic Glass Device Frame */}
      <div className="w-full max-w-md h-[90vh] glass-panel overflow-hidden flex flex-col relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10">
        
        {/* Modern Header */}
        <div className="pt-8 pb-6 px-8 border-b border-white/10 bg-black/20 flex justify-between items-start">
          <div>
            <p className="font-sans text-[10px] text-blue-400 tracking-[0.4em] font-bold uppercase mb-2 flex items-center gap-2">
               <MapPin size={12} /> Live Device Tracking
            </p>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-black text-white uppercase tracking-wider">{currentZone}</h1>
              <p className={`font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 mt-1 ${statusColor}`}>
                 <Activity size={12} /> {statusLabel}
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur">
             <ScanFace size={18} className="text-slate-400" />
          </div>
        </div>

        {/* Dynamic Ledger Data */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
           
          {/* Entries Data */}
          <section>
            <h2 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">
              Access Terminals (Wait Times)
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {!data ? <div className="text-xs text-slate-500 col-span-2">Syncing Node Arrays...</div> : Object.entries(data.gates).map(([gate, wait]) => {
                const waitColor = wait > 30 ? "text-red-400" : wait > 15 ? "text-yellow-400" : "text-white";
                return (
                  <div key={gate} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col relative shadow-sm hover:bg-white/10 transition-colors">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 mb-2">GATE {gate}</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-black ${waitColor}`}>{wait}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Min</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Provisioning Data */}
          <section>
            <h2 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-2">
              <Coffee size={12} /> Provisioning Nodes
            </h2>
            <div className="space-y-3">
              {!data ? <div className="text-xs text-slate-500">Inquiring parameters...</div> : data.concessions.map((stall) => {
                 return (
                  <div key={stall.id} className="flex justify-between items-center border border-white/5 bg-black/20 p-4 rounded-xl">
                    <span className="text-sm font-bold tracking-wider text-slate-200">{stall.name}</span>
                    <div className="font-sans font-bold text-xs bg-blue-500/10 px-2 py-1 rounded text-blue-400 border border-blue-500/20">
                       {stall.waitTime} Min
                    </div>
                  </div>
                )}
              )}
            </div>
          </section>

        </div>

        {/* Cinematic Chat AI Area */}
        <div className="h-[300px] border-t border-white/10 flex flex-col bg-black/40">
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-sm leading-relaxed custom-scrollbar relative">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                    : 'bg-white/10 text-slate-200 border border-white/10 rounded-2xl rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="text-blue-400 font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest bg-blue-500/10 px-3 py-2 rounded-full border border-blue-500/20">
                   <Feather size={12} className="animate-pulse" /> Processing Directive...
                 </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-black/60 border-t border-white/10">
            <form onSubmit={handleSend} className="flex gap-2 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Vanguard AI..." 
                className="flex-1 font-sans text-sm pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-white placeholder-slate-500"
              />
              <button 
                type="submit" 
                aria-label="Send Message to Vanguard AI"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 bottom-2 w-10 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg"
              >
                <Send size={16} className="-ml-0.5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
