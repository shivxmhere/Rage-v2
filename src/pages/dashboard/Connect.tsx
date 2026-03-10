import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Mic,
    MicOff,
    Radio,
    Plus,
    Hash,
    Shield,
    ChevronRight,
    LogOut,
    UserPlus,
    Zap,
    Activity,
    X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PTitle, Card, Btn, Ava, Input, Tag, cn } from '../../components/UI'

const PRESET_ROOMS = [
    { id: '1', name: 'Late Night Ops', active: 12, tag: 'STAY_AWAKE' },
    { id: '2', name: 'Strategic Planning', active: 4, tag: 'FOCUS_DEEP' },
    { id: '3', name: 'Domain Mastery', active: 8, tag: 'DEPLOYMENT' },
    { id: '4', name: 'Neural Engineering', active: 15, tag: 'QUANTUM' }
]

type StudyRoom = {
    id: string
    name: string
    active: number
    tag: string
}

export default function Connect() {
    const { currentUser, userProfile, updateProfile } = useAuth()
    const [squadInput, setSquadInput] = useState('')
    const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null)
    const [isMuted, setIsMuted] = useState(true)

    const currentSquad: string[] = userProfile?.squad || []

    const handleAddSquad = async () => {
        let clean = squadInput.toLowerCase().replace('@', '').trim()
        if (!clean) return
        if (clean === userProfile?.username) return

        if (!currentSquad.includes(clean)) {
            await updateProfile(currentUser.uid, { squad: [...currentSquad, clean] })
            setSquadInput('')
        }
    }

    const handleRemoveSquad = async (username: string) => {
        const updated = currentSquad.filter(u => u !== username)
        await updateProfile(currentUser.uid, { squad: updated })
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12">
            <PTitle title="TACTICAL COMMS" sub="Establish operational links. Scale your potential." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* MAIN COMMUNICATIONS COLUMN */}
                <div className="lg:col-span-2 space-y-8">

                    <AnimatePresence mode="wait">
                        {activeRoom ? (
                            <motion.div
                                key="active"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Card className="p-12 border-orange/40 bg-orange/[0.02] relative overflow-hidden flex flex-col items-center justify-center text-center space-y-8 min-h-[400px]">
                                    <div className="absolute top-0 left-0 p-8 opacity-[0.03] rotate-[-15deg]">
                                        <Radio size={240} className="text-orange" />
                                    </div>

                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 bg-orange/20 blur-2xl rounded-full"
                                        />
                                        <div className="w-24 h-24 bg-orange text-black flex items-center justify-center rounded-full relative shadow-[0_0_40px_rgba(232,93,4,0.3)]">
                                            <Radio size={48} className="animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="font-display text-5xl uppercase tracking-tighter text-orange">{activeRoom.name}</h2>
                                        <div className="flex items-center justify-center gap-4">
                                            <span className="flex items-center gap-2 text-[10px] font-mono text-green-400 uppercase font-bold tracking-widest">
                                                <div className="w-1.5 h-1.5 bg-green shadow-[0_0_5px_#22c55e] rounded-full" /> Link Secure
                                            </span>
                                            <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-widest">{activeRoom.active} Operatives Present</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-4 z-10 w-full max-w-sm">
                                        <Btn
                                            size="lg"
                                            variant={isMuted ? "outline" : "primary"}
                                            className={cn("flex-1 h-14", !isMuted && "bg-orange text-black")}
                                            onClick={() => setIsMuted(!isMuted)}
                                        >
                                            {isMuted ? <><MicOff size={20} className="mr-2" /> Unmute</> : <><Mic size={20} className="mr-2" /> Transmitting</>}
                                        </Btn>
                                        <Btn
                                            size="lg"
                                            variant="outline"
                                            className="h-14 border-red/20 text-red hover:bg-red/5"
                                            onClick={() => setActiveRoom(null)}
                                        >
                                            <LogOut size={20} className="mr-2" /> Disconnect
                                        </Btn>
                                    </div>

                                    <p className="text-[9px] font-mono text-muted/40 uppercase tracking-[0.4em]">WebRTC Integration: Standby Protocol ARC-COMM-01</p>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">
                                        <Zap size={16} /> Live Operative Clusters
                                    </div>
                                    <button className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-orange transition-colors flex items-center gap-2">
                                        <Plus size={14} /> Initialize Custom Cluster
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PRESET_ROOMS.map(r => (
                                        <Card key={r.id} className="p-6 border-white/5 hover:border-orange/20 hover:bg-white/[0.02] transition-all group flex flex-col justify-between min-h-[180px]">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[8px] font-bold text-orange bg-orange/5 border border-orange/10 px-2 py-1 uppercase tracking-widest">{r.tag}</span>
                                                    <div className="flex items-center gap-2 text-[10px] font-mono text-green-400 uppercase font-bold tracking-tighter">
                                                        <div className="w-1 h-1 bg-green shadow-[0_0_5px_#22c55e] rounded-full" /> {r.active} Active
                                                    </div>
                                                </div>
                                                <h3 className="font-display text-2xl uppercase tracking-wide text-text group-hover:text-orange transition-colors">{r.name}</h3>
                                            </div>
                                            <Btn full variant="ghost" size="sm" className="h-10 mt-6 border-white/5 text-[10px] opacity-60 group-hover:opacity-100 group-hover:border-orange/20" onClick={() => setActiveRoom(r)}>
                                                Establish Link <ChevronRight size={14} className="ml-1" />
                                            </Btn>
                                        </Card>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* DOMAIN COMMUNITIES */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-muted">
                            <Shield size={16} /> Sector Battalions
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {userProfile?.subjects?.map((s: string) => (
                                <button key={s} className="px-5 py-3 bg-white/[0.02] border border-white/5 hover:border-orange/40 hover:bg-orange/[0.02] text-text hover:text-orange transition-all flex items-center gap-3 group">
                                    <Hash size={16} className="text-muted group-hover:text-orange transition-colors" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{s}</span>
                                </button>
                            ))}
                            <button className="p-3 bg-white/5 border border-dashed border-white/10 text-muted hover:text-text hover:border-white/30 transition-all"><Plus size={18} /></button>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR: ELITE SQUAD */}
                <div className="space-y-6">
                    <Card className="p-8 border-white/5 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                            <Users size={80} />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Operational Squad</h3>
                            <p className="text-[9px] font-mono text-muted uppercase tracking-tighter font-bold">Tier-1 Accountability Assets</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <UserPlus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-orange transition-colors" />
                                <input
                                    value={squadInput}
                                    onChange={e => setSquadInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddSquad()}
                                    placeholder="RECRUIT_OPERATOR"
                                    className="w-full bg-white/5 border border-white/5 py-3 pl-10 pr-4 text-[10px] font-mono uppercase tracking-widest outline-none focus:border-orange/40 transition-all placeholder:text-muted/20"
                                />
                            </div>
                            <Btn full size="sm" className="h-10 text-[10px]" onClick={handleAddSquad}>Establish Partnership</Btn>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                            {currentSquad.length === 0 ? (
                                <p className="text-[10px] text-muted/30 italic py-8 text-center font-mono uppercase tracking-widest">Awaiting sector recruits...</p>
                            ) : (
                                currentSquad.map((u: string) => (
                                    <div key={u} className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/5 hover:border-orange/20 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <Ava letter={u[0]} className="w-8 h-8 text-[11px] bg-white/10 ring-1 ring-white/5" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-orange transition-all">@{u}</span>
                                                <span className="text-[8px] font-mono text-muted uppercase">Operational Status: Lvl {Math.floor(Math.random() * 20) + 1}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveSquad(u)} className="p-2 text-muted/10 hover:text-red transition-all"><X size={14} /></button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    <Card className="p-6 bg-green/5 border border-green/10 flex items-start gap-4">
                        <Activity size={20} className="text-green-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-muted leading-relaxed font-medium">
                            <span className="text-green-400 font-bold uppercase tracking-widest">Combat Note:</span> Direct synchronization with elite peers increases performance ceiling by 42%. Never deploy alone during deep-focus cycles.
                        </p>
                    </Card>
                </div>

            </div>
        </div>
    )
}
