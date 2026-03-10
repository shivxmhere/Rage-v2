import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip
} from 'recharts'
import {
    BarChart3,
    Clock,
    Zap,
    Target,
    History,
    Activity,
    ChevronRight,
    ShieldAlert,
    ArrowUpRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PTitle, Card, Stat, MotivationBar, Empty, PullToRefresh, Btn } from '../../components/UI'

export default function Report() {
    const { userProfile, userData, quote, rageScore } = useAuth()
    const navigate = useNavigate()

    const sessions = userData?.sessions || []
    const goals = userData?.goals || []
    const vault = userData?.vault || []
    const feed = userData?.feed || []
    const habits = userData?.habits || []

    // Computed Metrics
    const totalHrs = useMemo(() => {
        return Math.round((sessions.reduce((a, c) => a + (c.secs || 0), 0) / 3600) * 10) / 10
    }, [sessions])

    const goalsDone = useMemo(() => goals.filter(g => g.done).length, [goals])

    // Last 7 days chart data
    const weekData = useMemo(() => {
        const res = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const ds = d.toDateString()
            const secsThisDay = sessions
                .filter(s => s.startedAt && new Date(s.startedAt).toDateString() === ds)
                .reduce((a, c) => a + (c.secs || 0), 0)
            res.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                hours: Math.round((secsThisDay / 3600) * 10) / 10
            })
        }
        return res
    }, [sessions])

    // Subject breakdown
    const subData = useMemo(() => {
        const map: Record<string, number> = {}
        sessions.forEach(s => {
            if (s.subject) map[s.subject] = (map[s.subject] || 0) + (s.secs || 0)
        })
        return Object.keys(map)
            .map(k => ({
                name: k.length > 8 ? k.substring(0, 8) + '..' : k,
                hours: Math.round((map[k] / 3600) * 10) / 10
            }))
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 5)
    }, [sessions])

    // Radar chart
    const radarData = useMemo(() => {
        const hMax = 50, gpMax = 10, vMax = 20, sMax = 20, stMax = 14
        const hrsP = Math.min(totalHrs, hMax) / hMax * 100
        const goalsP = Math.min(goalsDone, gpMax) / gpMax * 100
        const vaultP = Math.min(vault.length, vMax) / vMax * 100
        const socialP = Math.min(feed.length, sMax) / sMax * 100
        const strP = Math.min(userProfile?.streak || 0, stMax) / stMax * 100

        return [
            { subject: 'Intel', A: hrsP || 10 },
            { subject: 'Habits', A: 40 }, // Default base for viz
            { subject: 'Goals', A: goalsP || 10 },
            { subject: 'Vault', A: vaultP || 10 },
            { subject: 'Social', A: socialP || 10 },
            { subject: 'Resilience', A: strP || 10 }
        ]
    }, [totalHrs, goalsDone, vault, feed, userProfile])

    return (
        <PullToRefresh onRefresh={async () => new Promise(res => setTimeout(res, 800))}>
            <div className="space-y-8 pb-12">
                <MotivationBar quote={quote} />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <PTitle
                        title="SITUATIONAL REPORT"
                        sub="Objective assessment of operational performance."
                        className="mb-0"
                    />
                    <div className="bg-orange/10 border border-orange/20 px-4 py-2 flex items-center gap-3">
                        <Activity size={14} className="text-orange" />
                        <span className="font-mono text-[9px] text-orange uppercase tracking-[0.2em] font-bold">System Integrity: 98.4%</span>
                    </div>
                </div>

                {/* TOP STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-6 border-orange/20 bg-orange/5 group hover:bg-orange/10 transition-all">
                        <Stat val={rageScore} label="RAGE INDEX" color="text-orange" />
                        <div className="mt-4 flex items-center gap-1 text-[9px] font-mono text-orange/50 uppercase tracking-widest">
                            <ArrowUpRight size={10} /> Top 2% Globally
                        </div>
                    </Card>
                    <Card className="p-6 border-white/5 hover:border-white/10 transition-all">
                        <Stat val={totalHrs} label="FIELD HOURS" />
                        <div className="mt-4 flex items-center gap-1 text-[9px] font-mono text-muted uppercase tracking-widest">
                            <Clock size={10} /> Active Deployment
                        </div>
                    </Card>
                    <Card className="p-6 border-white/5 hover:border-white/10 transition-all">
                        <Stat val={userProfile?.streak || 0} label="STREAK" color="text-green-400" />
                        <div className="mt-4 flex items-center gap-1 text-[9px] font-mono text-green-400/50 uppercase tracking-widest">
                            <Zap size={10} /> Persistence Lock
                        </div>
                    </Card>
                    <Card className="p-6 border-white/5 hover:border-white/10 transition-all">
                        <Stat val={goalsDone} label="OBJECTIVES" />
                        <div className="mt-4 flex items-center gap-1 text-[9px] font-mono text-muted uppercase tracking-widest">
                            <Target size={10} /> Mission Success
                        </div>
                    </Card>
                </div>

                {sessions.length === 0 ? (
                    <Empty
                        icon={<ShieldAlert size={48} className="text-orange/20" />}
                        title="NO DATA INTEL"
                        sub="Establish your first operational study session to begin intelligence gathering."
                        cta={<Btn onClick={() => navigate('/app/track')}>Initialize Timer</Btn>}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LARGE CHARTS COLUMN */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="p-8 border-white/5 h-[360px] flex flex-col">
                                <div className="flex items-center justify-between mb-8 text-[10px] font-bold text-muted uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><BarChart3 size={12} /> Deployment Intensity (7D)</span>
                                    <span className="text-orange">Scale: Hours</span>
                                </div>
                                <div className="flex-1 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="glowOrange" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#E85D04" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#E85D04" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis
                                                dataKey="name"
                                                stroke="rgba(255,255,255,0.05)"
                                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }}
                                                axisLine={false}
                                                tickLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                stroke="rgba(255,255,255,0.05)"
                                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0d0d1c', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0' }}
                                                itemStyle={{ color: '#E85D04', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}
                                                cursor={{ stroke: 'rgba(232,93,4,0.2)', strokeWidth: 1 }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="hours"
                                                stroke="#E85D04"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#glowOrange)"
                                                animationDuration={1500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-8 border-white/5 h-[300px] flex flex-col">
                                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-6 border-l-2 border-orange/50 pl-3">Sector Allocation</div>
                                    <div className="flex-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={subData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                <XAxis dataKey="name" stroke="none" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 'bold' }} />
                                                <Tooltip
                                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                                    contentStyle={{ backgroundColor: '#0d0d1c', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0' }}
                                                />
                                                <Bar dataKey="hours" fill="#E85D04" radius={[0, 0, 0, 0]} barSize={32} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card className="p-8 border-white/5 h-[300px] flex flex-col">
                                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4 border-l-2 border-orange/50 pl-3">Capability Radar</div>
                                    <div className="flex-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart outerRadius="70%" data={radarData}>
                                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }} />
                                                <Radar
                                                    dataKey="A"
                                                    stroke="#E85D04"
                                                    fill="#E85D04"
                                                    fillOpacity={0.15}
                                                    animationDuration={2000}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* SIDEBAR: RECENT SESSIONS */}
                        <Card className="p-8 border-white/5 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2"><History size={14} /> Chronological Log</h3>
                                <button className="text-[10px] font-bold uppercase text-orange hover:underline underline-offset-4">Full Audit</button>
                            </div>

                            <div className="space-y-4 flex-1">
                                {sessions.length === 0 && <p className="text-muted text-xs italic opacity-40">No entries in tactical log...</p>}
                                {[...sessions].reverse().slice(0, 10).map((s, i) => (
                                    <motion.div
                                        key={s.id || i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.03] hover:border-orange/30 transition-all cursor-default"
                                    >
                                        <div className="space-y-1">
                                            <div className="text-xs font-bold uppercase tracking-wide group-hover:text-orange transition-colors">{s.subject || 'UNSPECIFIED'}</div>
                                            <div className="text-[9px] font-mono text-muted uppercase">{s.startedAt ? new Date(s.startedAt).toLocaleDateString() : 'N/A'} // {s.startedAt ? new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-display text-xl text-orange/80 group-hover:text-orange transition-colors">
                                                {Math.floor((s.secs || 0) / 60)}<span className="text-[10px] ml-0.5">M</span>
                                            </span>
                                            <div className="w-8 h-0.5 bg-orange/20 mt-1" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-white/5 mt-8">
                                <Btn full variant="outline" className="h-12 text-[10px]" onClick={() => navigate('/app/track')}>
                                    Initiate New Session <ChevronRight size={14} className="ml-1" />
                                </Btn>
                            </div>
                        </Card>

                    </div>
                )}
            </div>
        </PullToRefresh>
    )
}
