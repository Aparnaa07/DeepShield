"use client";

import { motion } from "framer-motion";
import { Activity, ShieldAlert, CheckCircle2, Server, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', analyses: 120, deepfakes: 4 },
  { name: 'Tue', analyses: 210, deepfakes: 12 },
  { name: 'Wed', analyses: 180, deepfakes: 8 },
  { name: 'Thu', analyses: 300, deepfakes: 19 },
  { name: 'Fri', analyses: 250, deepfakes: 14 },
  { name: 'Sat', analyses: 340, deepfakes: 24 },
  { name: 'Sun', analyses: 280, deepfakes: 16 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center justify-between">
        <motion.h1 variants={itemVariants} className="text-3xl font-display font-bold text-cyan-400">
          Dashboard
        </motion.h1>
        <motion.div variants={itemVariants} className="flex items-center gap-2 bg-obsidian-900 border border-cyan-900/50 px-4 py-2 rounded-full">
          <Server className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">SYSTEM ONLINE</span>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="card-hover group">
          <div className="flex justify-between items-start mb-4">
            <div className="section-label group-hover:text-cyan-400 transition-colors">Total Analyses</div>
            <div className="p-2 bg-cyan-900/20 rounded-lg group-hover:bg-cyan-900/40 transition-colors">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="text-4xl font-mono text-white mb-2">1,680</div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+12% this week</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card-hover group">
          <div className="flex justify-between items-start mb-4">
            <div className="section-label text-rose-500 group-hover:text-rose-400 transition-colors">Deepfakes Detected</div>
            <div className="p-2 bg-rose-900/20 rounded-lg group-hover:bg-rose-900/40 transition-colors">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div className="text-4xl font-mono text-white mb-2">97</div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
            <TrendingUp className="w-3 h-3" />
            <span>+4% this week</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card-hover group">
          <div className="flex justify-between items-start mb-4">
            <div className="section-label text-emerald-500 group-hover:text-emerald-400 transition-colors">System Health</div>
            <div className="p-2 bg-emerald-900/20 rounded-lg group-hover:bg-emerald-900/40 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-4xl font-mono text-white mb-2">99.9%</div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>All sub-systems nominal</span>
          </div>
        </div>

      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <motion.div variants={itemVariants} className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div className="section-label mb-0">Analysis Traffic Overview</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDeepfakes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7', fontFamily: 'Space Mono' }}
                />
                <Area type="monotone" dataKey="analyses" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorAnalyses)" />
                <Area type="monotone" dataKey="deepfakes" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorDeepfakes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity Mini-Feed */}
        <motion.div variants={itemVariants} className="card">
          <div className="section-label mb-6">Recent Detections</div>
          <div className="space-y-4">
            {[
              { id: 'DS-4905', risk: 'HIGH', time: '2m ago', file: 'ceo_speech.mp4' },
              { id: 'DS-4904', risk: 'LOW', time: '14m ago', file: 'interview_raw.mov' },
              { id: 'DS-4903', risk: 'MED', time: '1h ago', file: 'auth_face.jpg' },
              { id: 'DS-4902', risk: 'HIGH', time: '2h ago', file: 'urgent_request.wav' },
              { id: 'DS-4901', risk: 'LOW', time: '3h ago', file: 'onboarding.mp4' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-obsidian-800 transition-colors border border-transparent hover:border-obsidian-700">
                <div className={`w-2 h-2 rounded-full ${
                  item.risk === 'HIGH' ? 'bg-rose-500 animate-pulse' : 
                  item.risk === 'MED' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-body text-slate-200 truncate">{item.file}</div>
                  <div className="text-xs font-mono text-slate-500 flex justify-between mt-1">
                    <span>{item.id}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
