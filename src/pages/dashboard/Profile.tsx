import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    Settings,
    Award,
    Flame,
    Zap,
    Globe,
    GraduationCap,
    Target,
    BookOpen,
    Edit3,
    Save,
    X,
    LogOut,
    ChevronRight,
    Shield,
    Activity,
    Trash2,
    Lock,
    Moon,
    Sun
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PTitle, Card, Btn, Input, Textarea, Tag, Ava, cn } from '../../components/UI'

const LEVELS = [
    { n: 'Spark', min: 0, c: '#a1a1aa', m: 'INITIAL_IGNITION' },
    { n: 'Spark+', min: 10, c: '#fcd34d', m: 'STEADY_BURN' },
    { n: 'Flame', min: 50, c: '#fb923c', m: 'CONSISTENT_FLOW' },
    { n: 'Inferno', min: 200, c: '#ef4444', m: 'OMNIPRESENT_FORCE' },
    { n: 'RAGE', min: 500, c: '#E85D04', m: 'ABS_DOMINANCE' }
].sort((a, b) => a.min - b.min) // Ensure ascending order for calculation

export default function Profile() {
    const { currentUser, userProfile, userData, updateProfile, rageScore, theme, logout } = useAuth()
    const [isEditing, setIsEditing] = useState(false)

    // Edit State
    const [name, setName] = useState(userProfile?.name || '')
    const [bio, setBio] = useState(userProfile?.bio || '')
    const [uni, setUni] = useState(userProfile?.university || '')
    const [course, setCourse] = useState(userProfile?.course || '')
    const [year, setYear] = useState(userProfile?.year || '')
    const [goal, setGoal] = useState(userProfile?.goal || '')
    const [subs, setSubs] = useState<string[]>(userProfile?.subjects || [])
    const [newSub, setNewSub] = useState('')

    const sessions = userData?.sessions || []
    const totalHrs = useMemo(() => Math.round(sessions.reduce((a: number, c: any) => a + c.secs, 0) / 3600), [sessions])

    const currentLvl = useMemo(() => {
        return [...LEVELS].reverse().find(l => totalHrs >= l.min) || LEVELS[0]
    }, [totalHrs])

    const nextLvl = useMemo(() => {
        const idx = LEVELS.findIndex(l => l.n === currentLvl.n)
        return LEVELS[Math.min(idx + 1, LEVELS.length - 1)]
    }, [currentLvl])

    const progress = useMemo(() => {
        if (currentLvl.n === 'RAGE') return 100
        const total = nextLvl.min - currentLvl.min
        const current = totalHrs - currentLvl.min
        return Math.min(100, Math.round((current / total) * 100))
    }, [totalHrs, currentLvl, nextLvl])

    const handleSave = async () => {
        await updateProfile(currentUser.uid, {
            name,
            bio,
            university: uni,
            course,
            year,
            goal,
            subjects: subs
        })
        setIsEditing(false)
    }

    const handleLevelTag = (n: string) => {
        if (n === 'RAGE') return "bg-orange/10 border-orange/40 text-orange"
        return "bg-white/5 border-white/5 text-muted"
    }

    const subjectStats = useMemo(() => {
        const map: Record<string, number> = {}
        sessions.forEach((s: any) => { map[s.subject] = (map[s.subject] || 0) + s.secs })
        return map
    }, [sessions])

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <PTitle
                    title="PERSONNEL DOSSIER"
                    sub="Strategic identity parameters. Verified performance."
                    className="mb-0"
                />
                <div className="flex gap-4">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <Btn variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Btn>
                            <Btn onClick={handleSave} className="px-8"><Save size={18} className="mr-2" /> Commit Changes</Btn>
                        </div>
                    ) : (
                        <Btn variant="outline" onClick={() => setIsEditing(true)}><Edit3 size={18} className="mr-2" /> Update Parameters</Btn>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* LEFT COLUMN: IDENTIFICATION & STATUS */}
                <div className="space-y-6">
                    <Card className="p-8 border-white/5 flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-orange/[0.05] to-transparent" />
                        <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity rotate-12">
                            <Shield size={220} />
                        </div>

                        {/* AVATAR SYSTEM */}
                        <div className="relative">
                            <div
                                className="w-32 h-32 rounded-none flex items-center justify-center text-4xl font-display text-white relative z-10 border-2 border-orange/20 shadow-[0_0_30px_rgba(232,93,4,0.1)] transition-transform group-hover:scale-105 duration-500"
                                style={{ background: `linear-gradient(135deg, ${currentLvl.c}88, #000)` }}
                            >
                                {(userProfile?.name || 'S')[0]}
                            </div>
                            <div className="absolute -bottom-3 -right-3 bg-background border border-orange/20 p-2 z-20">
                                <Award size={20} className="text-orange shadow-glow" />
                            </div>
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h2 className="font-display text-3xl uppercase tracking-widest text-text">{userProfile?.name}</h2>
                            <div className="font-mono text-[10px] text-orange uppercase tracking-[.4em] font-bold">ARC-OP-{userProfile?.username?.toUpperCase() || 'ANON-X'}</div>
                        </div>

                        {/* RANK PROGRESSION */}
                        <div className="w-full bg-white/[0.02] border border-white/5 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">CURRENT_RANK</span>
                                    <span className="text-sm font-bold text-orange uppercase tracking-wider">{currentLvl.n}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">DEPLOYMENT</span>
                                    <span className="text-sm font-bold text-text font-mono">{totalHrs}H</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="h-1 bg-white/5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-orange shadow-[0_0_10px_rgba(232,93,4,0.4)] transition-all duration-1000"
                                    />
                                </div>
                                <div className="flex justify-between font-mono text-[8px] text-muted uppercase tracking-widest">
                                    <span>{currentLvl.min}H Threshold</span>
                                    <span>{progress}% Target</span>
                                    <span>{currentLvl.n === 'RAGE' ? 'MAX' : `${nextLvl.min}H Next`}</span>
                                </div>
                            </div>
                        </div>

                        {/* CORE METRICS */}
                        <div className="grid grid-cols-3 w-full gap-4 pt-4 border-t border-white/5">
                            <div className="flex flex-col gap-1 items-center">
                                <span className="font-display text-2xl text-text leading-none">{rageScore}</span>
                                <span className="text-[8px] font-bold text-muted uppercase tracking-widest">Rage_Score</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center border-x border-white/5">
                                <span className="font-display text-2xl text-orange leading-none">{userProfile?.streak || 0}</span>
                                <span className="text-[8px] font-bold text-muted uppercase tracking-widest">Streak</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center">
                                <span className="font-display text-2xl text-text leading-none">{sessions.length}</span>
                                <span className="text-[8px] font-bold text-muted uppercase tracking-widest">Ops</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-white/5 space-y-6">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                            <span>System Controls</span>
                            <Settings size={14} />
                        </div>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-orange/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="text-muted group-hover:text-orange"><Moon size={16} /></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Dark Synthesis Mode</span>
                                </div>
                                <div className="w-10 h-5 bg-orange p-1 flex items-center justify-end border border-orange/40">
                                    <div className="w-3 h-3 bg-black" />
                                </div>
                            </button>
                            <button onClick={logout} className="w-full flex items-center gap-3 p-4 border border-red/5 hover:bg-red/5 hover:border-red/20 transition-all text-red/40 hover:text-red">
                                <LogOut size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Deactivate Link [Logout]</span>
                            </button>
                        </div>
                    </Card>
                </div>

                {/* RIGHT COLUMN: PARAMETERS & ARCHIVE */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                key="edit"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card className="p-10 border-orange/20 space-y-10">
                                    <div className="space-y-1 border-b border-white/5 pb-4">
                                        <h3 className="font-display text-3xl uppercase tracking-widest text-orange transition-colors">Parameter Modulation</h3>
                                        <p className="font-mono text-[9px] text-muted uppercase tracking-[0.4em] font-bold">Authorized Sector: Internal_Core_V.4</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-8">
                                            <Input label="Operational Name" value={name} onChange={e => setName(e.target.value)} />
                                            <Input label="Strategic Institution" value={uni} onChange={e => setUni(e.target.value)} />
                                        </div>
                                        <div className="space-y-8">
                                            <Input label="Deployment Sector (Degree)" value={course} onChange={e => setCourse(e.target.value)} />
                                            <Input label="Cycle Current (Year/Sem)" value={year} onChange={e => setYear(e.target.value)} />
                                        </div>
                                    </div>

                                    <Textarea label="Personnel Strategic Summary (Bio)" rows={3} value={bio} onChange={e => setBio(e.target.value)} />

                                    <div className="space-y-6 pt-6 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Domain Specializations</label>
                                            <span className="text-[9px] font-mono text-muted/40 uppercase">{subs.length} Active</span>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-2">
                                                <input
                                                    value={newSub}
                                                    onChange={e => setNewSub(e.target.value)}
                                                    placeholder="Add New Domain..."
                                                    className="flex-1 bg-white/5 border border-white/5 p-4 text-[10px] font-mono uppercase tracking-[0.2em] outline-none focus:border-orange/40 transition-all"
                                                />
                                                <Btn size="lg" className="px-6" onClick={() => { if (newSub && !subs.includes(newSub)) { setSubs([...subs, newSub]); setNewSub('') } }}>ADD</Btn>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {subs.map(s => <Tag key={s} onRemove={() => setSubs(subs.filter(x => x !== s))} className="bg-orange/5 border-orange/20 text-[10px]">{s}</Tag>)}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="view"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <Card className="p-10 border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                        <GraduationCap size={240} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                        <div className="space-y-12">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-muted">
                                                    <Activity size={16} />
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Operational Background</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-3xl font-display uppercase tracking-widest text-text leading-tight">{userProfile?.course}</h3>
                                                    <div className="flex items-center gap-3 text-sm font-mono text-muted uppercase">
                                                        <Globe size={14} className="text-orange" /> {userProfile?.university} <span className="opacity-30">//</span> {userProfile?.year}
                                                    </div>
                                                </div>
                                                {userProfile?.bio && (
                                                    <p className="text-sm font-body leading-relaxed text-muted/80 italic border-l-2 border-orange/40 pl-6 py-2 mt-6">
                                                        "{userProfile.bio}"
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-6 pt-10 border-t border-white/5">
                                                <div className="flex items-center gap-3 text-muted">
                                                    <Target size={16} />
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Strategic Objective</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-lg font-bold uppercase tracking-widest text-orange">{userProfile?.goal}</h4>
                                                    <p className="text-xs text-muted leading-relaxed font-body opacity-60">Objective detail tracking active. Progress monitoring enabled in Sector 7.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-muted">
                                                    <BookOpen size={16} />
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Domain Investment (L7D)</span>
                                                </div>
                                                <span className="text-[9px] font-mono text-muted/40 uppercase">Hours_Unit</span>
                                            </div>

                                            <div className="space-y-3">
                                                {userProfile?.subjects?.map((s: string) => {
                                                    const hours = Math.round((subjectStats[s] || 0) / 3600 * 10) / 10
                                                    return (
                                                        <div key={s} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-orange/20 transition-all group overflow-hidden relative">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-orange/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <span className="text-[11px] font-bold uppercase tracking-widest relative z-10">{s}</span>
                                                            <div className="flex items-center gap-3 relative z-10">
                                                                <span className={cn("text-sm font-mono font-bold transition-colors", hours > 0 ? "text-orange" : "text-muted/20")}>{hours}H</span>
                                                                <ChevronRight size={14} className="text-muted/20 group-hover:text-orange transition-colors" />
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="p-6 bg-orange/5 border border-orange/10 mt-10">
                                                <p className="text-[9px] font-mono text-muted leading-relaxed uppercase tracking-widest">
                                                    Total Data Persistence: <b>{sessions.length}</b> Captured Events // <b>{totalHrs}H</b> Total Deployment Time // Subject Spread Corrected.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* SECURITY PROTOCOL SECTION */}
                                <Card className="p-8 border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-white/5 border border-white/10"><Lock size={24} /></div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold uppercase tracking-widest">Security & Payload Integrity</h4>
                                            <p className="text-[10px] text-muted font-mono uppercase">Encryption: AES-256 // Link Status: SECURE</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <Btn size="sm" variant="outline" className="flex-1 md:px-6">Update Auth</Btn>
                                        <Btn size="sm" variant="danger" className="flex-1 md:px-6 border-red/10 text-red/40 hover:text-red hover:bg-red/5">Purge Data</Btn>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    )
}
