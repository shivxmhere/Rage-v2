import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar,
    Clock,
    Bell,
    Plus,
    Trash2,
    Activity,
    ShieldAlert,
    BarChart,
    ChevronRight,
    AlarmClock,
    Layout
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PTitle, Card, Btn, Input, Select, Tag, cn } from '../../components/UI'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

type TimetableSlot = {
    id: number
    time: string
    dur: number
    subject: string
    note: string
    alarm: boolean
}

type TimetableData = {
    [key: string]: TimetableSlot[]
}

export default function Timetable() {
    const { currentUser, userProfile, updateProfile } = useAuth()
    const [day, setDay] = useState(DAYS[(new Date().getDay() + 6) % 7])

    // Form State
    const [time, setTime] = useState('09:00')
    const [dur, setDur] = useState(60)
    const [sub, setSub] = useState(userProfile?.subjects?.[0] || 'General')
    const [note, setNote] = useState('')
    const [alarm, setAlarm] = useState(true)

    const timetable: TimetableData = userProfile?.timetable || {
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
    }

    // Permissions & Alarms
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission()
        }
    }, [])

    useEffect(() => {
        const today = DAYS[(new Date().getDay() + 6) % 7]
        const slots = timetable[today] || []
        const timeouts: any[] = []

        slots.forEach(s => {
            if (!s.alarm) return
            const [h, m] = s.time.split(':').map(Number)
            const now = new Date()
            const slotTime = new Date()
            slotTime.setHours(h, m, 0, 0)

            const diff = slotTime.getTime() - now.getTime()
            if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
                const t = setTimeout(() => {
                    if (Notification.permission === "granted") {
                        new Notification(`RAGE OPS: Deployment Alert`, {
                            body: `Objective: ${s.subject} for ${s.dur} min. "${s.note || 'Execute now.'}"`,
                            icon: '/apple-touch-icon.png'
                        })
                    }
                }, diff)
                timeouts.push(t)
            }
        })

        return () => timeouts.forEach(clearTimeout)
    }, [timetable])

    const handleAddSlot = async () => {
        if (!time) return
        const currentSlots = timetable[day] || []
        const newSlot: TimetableSlot = { id: Date.now(), time, dur: Number(dur), subject: sub, note, alarm }
        const updated = [...currentSlots, newSlot].sort((a, b) => a.time.localeCompare(b.time))

        await updateProfile(currentUser.uid, { timetable: { ...timetable, [day]: updated } })
        setNote('')
    }

    const handleDeleteSlot = async (id: number) => {
        const updated = (timetable[day] || []).filter(s => s.id !== id)
        await updateProfile(currentUser.uid, { timetable: { ...timetable, [day]: updated } })
    }

    // Active Check Logic
    const currentTime = useMemo(() => {
        const now = new Date()
        return { h: now.getHours(), m: now.getMinutes(), day: DAYS[(now.getDay() + 6) % 7] }
    }, [])

    const isSlotActive = (d: string, tStr: string, dMin: number) => {
        if (d !== currentTime.day) return false
        const [th, tm] = tStr.split(':').map(Number)
        const slotStart = th * 60 + tm
        const current = currentTime.h * 60 + currentTime.m
        return current >= slotStart && current < (slotStart + dMin)
    }

    // Analytics
    const dailyMins = useMemo(() => DAYS.map(d => (timetable[d] || []).reduce((a, c) => a + c.dur, 0)), [timetable])
    const maxMins = Math.max(...dailyMins, 1)

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12">
            <PTitle title="DYNAMIC SCHEDULE" sub="Tactical planning for total domain dominance." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* MAIN SCHEDULE VIEW */}
                <div className="lg:col-span-2 space-y-6">
                    {/* DAY TABS */}
                    <div className="flex bg-white/5 p-1 border border-white/5 relative overflow-x-auto custom-scrollbar">
                        {DAYS.map(d => {
                            const isToday = d === currentTime.day
                            const isActive = day === d
                            return (
                                <button
                                    key={d}
                                    onClick={() => setDay(d)}
                                    className={cn(
                                        "flex-1 min-w-[80px] py-4 flex flex-col items-center gap-1.5 transition-all relative border-r border-white/5 last:border-none",
                                        isActive ? "bg-orange/10 text-orange" : "text-muted hover:text-text hover:bg-white/[0.02]"
                                    )}
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{d.substring(0, 3)}</span>
                                    {isToday && <div className="w-1 h-1 bg-green shadow-[0_0_5px_#22c55e] rounded-full" />}
                                    {isActive && <motion.div layoutId="dayUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange" />}
                                </button>
                            )
                        })}
                    </div>

                    <Card className="min-h-[500px] p-8 border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                            <Calendar size={240} />
                        </div>

                        <div className="flex items-center justify-between mb-10">
                            <div className="space-y-1">
                                <h3 className="font-display text-3xl uppercase tracking-widest text-text">{day}'S PROTOCOL</h3>
                                <p className="font-mono text-[9px] text-muted uppercase tracking-[0.4em] font-bold">Sequence Status: {timetable[day]?.length ? 'DEFINED' : 'CLEAR'}</p>
                            </div>
                            <div className="hidden md:flex gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-muted uppercase">Deployment Load</span>
                                    <span className="font-display text-2xl text-orange">{(timetable[day] || []).reduce((a, c) => a + c.dur, 0)}<span className="text-xs ml-0.5 opacity-50">MIN</span></span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {!(timetable[day]?.length) ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-30">
                                    <Layout size={64} className="text-muted" />
                                    <p className="text-xs font-mono uppercase tracking-[0.2em]">Deployment Matrix Empty For {day}</p>
                                </div>
                            ) : (
                                timetable[day].map((s, i) => {
                                    const active = isSlotActive(day, s.time, s.dur)
                                    return (
                                        <motion.div
                                            key={s.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={cn(
                                                "grid grid-cols-[80px_1fr_40px] gap-6 p-6 border transition-all relative overflow-hidden",
                                                active ? "bg-green/5 border-green/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]" : "bg-white/[0.02] border-white/5 hover:border-orange/20"
                                            )}
                                        >
                                            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green shadow-[0_0_10px_#22c55e]" />}

                                            <div className="flex flex-col justify-center">
                                                <div className={cn("font-display text-3xl tracking-tighter leading-none", active ? "text-green-400" : "text-text")}>{s.time}</div>
                                                <div className="text-[9px] font-mono text-muted uppercase font-bold mt-1">GMT+5:30</div>
                                            </div>

                                            <div className="flex flex-col justify-center border-l border-white/5 pl-6 gap-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={cn("text-sm font-bold uppercase tracking-widest", active ? "text-green-400 glow-green" : "text-text")}>{s.subject}</span>
                                                    <Tag className="h-4 py-0 px-2 text-[9px] font-mono bg-white/5 border-white/10 text-muted">{s.dur} MIN</Tag>
                                                    {s.alarm && <AlarmClock size={12} className="text-orange/60" />}
                                                </div>
                                                {s.note && <p className="text-[11px] text-muted font-body leading-tight opacity-60 italic">"{s.note}"</p>}
                                            </div>

                                            <div className="flex items-center justify-end">
                                                <button onClick={() => handleDeleteSlot(s.id)} className="p-2 text-muted/20 hover:text-red transition-colors"><Trash2 size={16} /></button>
                                            </div>

                                            {active && (
                                                <motion.div
                                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    className="absolute right-4 top-4"
                                                >
                                                    <div className="flex items-center gap-2 text-[8px] font-bold text-green-400 uppercase tracking-widest">
                                                        <Activity size={10} className="animate-pulse" /> Live Now
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>
                    </Card>
                </div>

                {/* SIDEBAR PROTOCOLS */}
                <div className="space-y-6">
                    <Card className="p-8 border-white/5 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Assignment Protocol</h3>
                            <p className="text-[9px] font-mono text-muted uppercase tracking-tighter font-bold">Reserve Strategic Window</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Commencement" type="time" value={time} onChange={e => setTime(e.target.value)} />
                            <Input label="Duration (m)" type="number" min="5" value={dur} onChange={e => setDur(Number(e.target.value))} />
                        </div>

                        <Select label="Deployment Sector" value={sub} onChange={e => setSub(e.target.value)}>
                            <option value="General">General Ops</option>
                            {userProfile?.subjects?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                        </Select>

                        <Input label="Mission Note" placeholder="Objective details..." value={note} onChange={e => setNote(e.target.value)} />

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className={cn("w-5 h-5 flex items-center justify-center border mt-0.5 transition-all text-black", alarm ? "bg-orange border-orange" : "border-white/10 group-hover:border-orange/30")}>
                                {alarm && <Bell size={12} />}
                            </div>
                            <input type="checkbox" checked={alarm} onChange={e => setAlarm(e.target.checked)} className="hidden" />
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Audio Intelligence</span>
                                <p className="text-[8px] font-mono text-muted uppercase">Enable browser-level notification protocols</p>
                            </div>
                        </label>

                        <Btn full size="lg" className="h-14 text-[10px]" onClick={handleAddSlot}>
                            Lock To {day.substring(0, 3)} Plan <ChevronRight size={14} className="ml-1" />
                        </Btn>
                    </Card>

                    <Card className="p-8 border-white/5 space-y-6 bg-gradient-to-br from-card to-card/20">
                        <div className="flex items-center gap-2 text-muted">
                            <BarChart size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Intensity Map</span>
                        </div>

                        <div className="flex items-flex-end gap-2 h-24">
                            {DAYS.map((d, i) => {
                                const hPct = Math.max((dailyMins[i] / maxMins) * 100, 5)
                                const isToday = d === currentTime.day
                                return (
                                    <div key={d} className="flex-1 flex flex-col justify-end gap-2 h-full">
                                        <div className="bg-white/5 w-full h-full relative group">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${hPct}%` }}
                                                className={cn(
                                                    "absolute bottom-0 left-0 right-0 transition-all",
                                                    isToday ? "bg-green shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-orange opacity-60 group-hover:opacity-100"
                                                )}
                                            />
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-background px-1 border border-white/5 whitespace-nowrap">
                                                {dailyMins[i]}m
                                            </div>
                                        </div>
                                        <span className={cn("text-[9px] font-bold uppercase text-center", isToday ? "text-green-400" : "text-muted/40")}>{d[0]}</span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="pt-4 border-t border-white/5 text-center">
                            <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
                                Total Load: {Math.floor(dailyMins.reduce((a, b) => a + b, 0) / 60)}h Targeted / Week
                            </span>
                        </div>
                    </Card>

                    <div className="p-6 bg-orange/5 border border-orange/10 flex items-start gap-4">
                        <ShieldAlert size={20} className="text-orange shrink-0 mt-0.5" />
                        <p className="text-[10px] text-muted leading-relaxed font-medium">
                            <span className="text-orange font-bold uppercase tracking-widest italic">Alert:</span> Over-scheduling without recovery leads to efficiency degradation. Reserve 15% window for tactical pauses.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
