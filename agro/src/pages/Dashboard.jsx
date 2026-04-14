import { Users, Box, Wallet2, AlertTriangle, TrendingUp, ArrowUpRight } from "lucide-react";
import Card from "../components/ui/Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

export default function Dashboard() {
  const stats = [
    { label: "Total Customers", value: "1,248", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Total Products", value: "356", icon: Box, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Total Sales", value: "₹4.5L", icon: Wallet2, color: "text-primary-400", bg: "bg-primary-500/10", border: "border-primary-500/20" },
    { label: "Low Stock Alert", value: "12", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Overview</h1>
          <p className="text-sm text-tmuted mt-1">Welcome back, let's see what's happening today.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-surfaceBorder text-tmain hover:bg-surface/80 rounded-xl text-sm font-semibold transition-all shadow-lg group">
          <TrendingUp size={16} className="text-primary-400 group-hover:text-primary-300 transition-colors" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="flex items-start justify-between group cursor-pointer hover:border-surfaceBorder/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-700">
                <Icon size={120} />
              </div>
              <div className="space-y-2 relative z-10">
                <span className="text-sm font-medium text-tmuted">{stat.label}</span>
                <p className="text-3xl font-bold text-tmain tracking-tight">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.border} border group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-lg`}>
                <Icon size={24} className={stat.color} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-tmain">Revenue Analytics</h3>
              <p className="text-xs text-tmuted">Monthly sales performance</p>
            </div>
            <select className="text-sm bg-surface text-tmain border border-surfaceBorder rounded-lg px-3 py-1.5 outline-none focus:border-primary-500 transition-colors">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid var(--surface-border)', background: 'var(--surface)', backdropFilter: 'blur(8px)', color: 'var(--text-main)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-tmain">Recent Activity</h3>
            <span className="text-xs font-semibold text-primary-400 bg-primary-500/10 px-2 py-1 rounded-md">Live</span>
          </div>
          <div className="space-y-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-surface/50 transition-colors group cursor-default">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0 border border-surfaceBorder group-hover:border-primary-500/30 transition-colors">
                  <ArrowUpRight size={16} className="text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-tmain font-medium">Order #10{i}4 processed</p>
                  <p className="text-xs text-tmuted mt-0.5">By Ramesh Kumar</p>
                </div>
                <span className="text-xs text-tmuted/60 font-medium">{i * 2}h ago</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
