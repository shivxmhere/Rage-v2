import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Play,
    Pause,
    Square,
    CheckCircle2,
    Plus,
    Calendar,
    Zap,
    Clock as ClockIcon,
    Tag as TagIcon,
    AlertCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PTitle, Card, Btn, Select, Input, Tag } from '../../components/UI'

const fmtObj = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sc = s % 60
    return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`
}

export default function Track() {
    const { currentUser, userProfile, userData, saveItem, updateProfile, quote } = useAuth()
    const [active, setActive] = useState(false)
    const [pause, setPause] = useState(false)
    const [secs, setSecs] = useState(0)
    const [subject, setSubject] = useState(userProfile?.subjects?.[0] || 'General')
    const [note, setNote] = useState('')
    const [startT, setStartT] = useState<Date | null>(null)

    const timerRef = useRef<any>(null)

    const sessions = userData?.sessions || []
    const habits = userData?.habits || []

    useEffect(() => {
        if (active && !pause) {
            timerRef.current = setInterval(() => setSecs(s => s + 1), 1000)
        } else {
            clearInterval(timerRef.current)
        }
        return () => clearInterval(timerRef.current)
    }, [active, pause])

    const toggle = () => {
        if (!active) {
            setActive(true)
            setPause(false)
            setSecs(0)
            setStartT(new Date())
            return
        }
        setPause(!pause)
    }

    const stop = async () => {
        if (!active) return
        if (secs > 60 && startT) {
            setLoading(true)
            const sessId = Date.now()
            const sess = {
                id: sessId,
                subject,
                secs,
                note,
                startedAt: startT.toISOString(),
                endedAt: new Date().toISOString()
            }
            await saveItem(currentUser.uid, 'sessions', sessId, sess)
            await updateStreak()
            setLoading(false)
        }
        setActive(false)
        setPause(false)
        setSecs(0)
        setNote('')
    }

    const [loading, setLoading] = useState(false)

    const updateStreak = async () => {
        const dStr = new Date().toDateString()
        const lastDate = userProfile?.lastStudyDate
        let currentStreak = userProfile?.streak || 0

        if (lastDate === dStr) return // Already studied today

        if (lastDate) {
            const last = new Date(lastDate)
            const diff = (new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
            if (diff <= 1.5) currentStreak += 1
            else currentStreak = 1
        } else {
            currentStreak = 1
        }

        await updateProfile(currentUser.uid, { streak: currentStreak, lastStudyDate: dStr })
    }

    const toggleHabit = async (id: string | number) => {
        const today = new Date().toDateString()
        const habitToToggle = habits.find(h => h.id === id)
        if (!habitToToggle) return

        const doneDate = habitToToggle.doneDate === today ? null : today
        await saveItem(currentUser.uid, 'habits', id, { ...habitToToggle, doneDate })
    }

    const addHabit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            const id = Date.now()
            const newHabit = { id, title: e.currentTarget.value.trim(), doneDate: null }
            await saveItem(currentUser.uid, 'habits', id, newHabit)
            e.currentTarget.value = ''
        }
    }

    const todayStr = new Date().toDateString()
    const todaySecs = sessions
        .filter(s => s.startedAt && new Date(s.startedAt).toDateString() === todayStr)
        .reduce((a, c) => a + (c.secs || 0), 0)
    const habsDone = habits.filter(h => h.doneDate === todayStr).length

    // Ring Calculation
    const RADIUS = 140
    const CIRCUM = 2 * Math.PI * RADIUS
    const progress = (secs % 3600) / 3600 // Resets every hour for visual flair
    const offset = CIRCUM - progress * CIRCUM

    return (
        <div className="space-y-8 pb-12">
            <PTitle title="TACTICAL TRACK" sub="Measure what matters. Control the clock." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* TIMER CORE */}
                <Card className={`lg:col-span-2 p-12 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700 ${active && !pause ? 'border-orange/40 bg-orange/[0.02]' : 'border-white/5'}`}>
                    {/* Visual Background Pulse */}
                    <AnimatePresence>
                        {active && !pause && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,93,4,0.03),transparent_70%)] pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    {/* TIMER RING */}
                    <div className="relative w-[320px] h-[320px] flex items-center justify-center mb-12">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="160" cy="160" r={RADIUS}
                                className="stroke-white/5 fill-none"
                                strokeWidth="4"
                            />
                            <motion.circle
                                cx="160" cy="160" r={RADIUS}
                                className="stroke-orange fill-none"
                                strokeWidth="4"
                                strokeDasharray={CIRCUM}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1, ease: "linear" }}
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* GOW EFFECT */}
                        <AnimatePresence>
                            {active && !pause && (
                                <motion.div
                                    animate={{ opacity: [0.1, 0.4, 0.1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-[30px] rounded-full border-4 border-orange/20 blur-md pointer-events-none"
                                />
                            )}
                        </AnimatePresence>

                        <div className="text-center z-10">
                            <motion.div
                                initial={false}
                                animate={{ color: active && !pause ? '#E85D04' : '#eeeef8', scale: active && !pause ? 1.05 : 1 }}
                                className="font-display text-8xl tracking-widest leading-none drop-shadow-[0_0_20px_rgba(232,93,4,0.1)]"
                            >
                                {fmtObj(secs)}
                            </motion.div>
                            <div className="font-mono text-[10px] text-muted uppercase tracking-[0.4em] mt-4 font-bold flex items-center justify-center gap-2">
                                {active ? <><Activity size={10} className="animate-pulse text-orange" /> Operational Status: {pause ? 'HELD' : 'ACTIVE'}</> : 'PROTOCOL: STANDBY'}
                            </div>
                        </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex items-center gap-4 z-10 w-full max-w-sm">
                        <Btn
                            size="lg"
                            className={`flex-1 h-14 ${!active ? 'bg-orange text-black' : 'bg-white/10 text-text'}`}
                            onClick={toggle}
                        >
                            {!active ? (
                                <><Play size={18} className="mr-2" /> Start</>
                            ) : pause ? (
                                <><Play size={18} className="mr-2" /> Resume</>
                            ) : (
                                <><Pause size={18} className="mr-2" /> Pause</>
                            )}
                        </Btn>
                        {active && (
                            <Btn
                                size="lg"
                                variant="outline"
                                className="h-14 border-red/20 text-red hover:bg-red/5"
                                onClick={stop}
                                disabled={loading}
                            >
                                <Square size={16} />
                            </Btn>
                        )}
                    </div>

                    {/* SUBJECT SELECTOR */}
                    <div className="mt-12 w-full max-w-sm space-y-4">
                        <Select
                            label="Engagement Sector"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            disabled={active}
                            className="bg-card/50"
                        >
                            <option value="General">General Intel</option>
                            {userProfile?.subjects?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                        </Select>

                        {active && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Input
                                    label="Session Intelligence Log"
                                    placeholder="Focus: Deep work on architecture..."
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </motion.div>
                        )}
                    </div>
                </Card>

                {/* SIDEBAR: STATS & HABITS */}
                <div className="space-y-6">
                    <Card className="p-6 border-white/5 bg-gradient-to-br from-card/40 to-card/10">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest mb-1">
                                    <Calendar size={10} className="text-orange" /> Today's Gain
                                </div>
                                <div className="font-display text-3xl text-orange">{Math.round(todaySecs / 60)}<span className="text-xs ml-0.5 opacity-50">MIN</span></div>
                            </div>
                            <div className="border-l border-white/5 pl-4">
                                <div className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest mb-1">
                                    <Zap size={10} className="text-green-400" /> Momentum
                                </div>
                                <div className="font-display text-3xl text-green-400">{userProfile?.streak || 0}<span className="text-xs ml-0.5 opacity-50">DAYS</span></div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <CheckCircle2 size={80} />
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-text">Standard Procedures</h3>
                                <p className="text-[9px] font-mono text-muted uppercase tracking-tighter">Consistency Is Strength</p>
                            </div>
                            <Tag className="bg-orange/10 text-orange border-orange/20 text-[10px] font-mono">{habsDone}/{habits.length}</Tag>
                        </div>

                        <div className="space-y-3">
                            {habits.length === 0 && <p className="text-xs text-muted/40 italic py-4">No SOPs defined in matrix...</p>}
                            {habits.map(h => {
                                const isDone = h.doneDate === todayStr
                                return (
                                    <motion.div
                                        key={h.id}
                                        onClick={() => toggleHabit(h.id)}
                                        className={`flex items-center gap-4 p-4 border transition-all cursor-pointer group ${isDone ? 'bg-green/5 border-green/20 opacity-60' : 'bg-white/[0.02] border-white/5 hover:border-orange/30'}`}
                                    >
                                        <div className={`w-5 h-5 flex items-center justify-center border transition-all ${isDone ? 'bg-green border-green' : 'border-white/10 group-hover:border-orange/50'}`}>
                                            {isDone && <CheckCircle2 size={12} className="text-black" />}
                                        </div>
                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDone ? 'line-through text-muted' : 'text-text'}`}>{h.title}</span>
                                    </motion.div>
                                )
                            })}

                            <div className="relative mt-6">
                                <Plus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <input
                                    type="text"
                                    placeholder="DEFINE NEW PROCEDURE..."
                                    onKeyDown={addHabit}
                                    className="w-full bg-transparent border-b border-white/5 py-3 pl-10 text-[10px] font-mono uppercase tracking-widest outline-none focus:border-orange/50 transition-colors"
                                />
                            </div>
                        </div>
                    </Card>

                    <div className="p-4 bg-orange/5 border border-orange/10 flex items-start gap-4">
                        <AlertCircle size={20} className="text-orange shrink-0 mt-0.5" />
                        <p className="text-[10px] text-muted leading-relaxed font-medium">
                            <span className="text-orange font-bold uppercase tracking-widest">Operator Note:</span> Studying without focus is tactical waste. Ensure your environment is secure and distractions are neutralized.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

function Activity({ size, className }: { size: number, className: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    )
}
