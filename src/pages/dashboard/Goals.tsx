import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Target,
    Trophy,
    Trash2,
    Calendar,
    Zap,
    Activity,
    ChevronRight,
    ShieldCheck,
    Flag,
    X,
    PlusCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PTitle, Card, Btn, Input, Textarea, Select, Bar, Tag, cn } from '../../components/UI'

type Goal = {
    id: number
    title: string
    detail: string
    subject: string
    progress: number
    target: number
    unit: string
    deadline: string
    done: boolean
    createdAt: string
}

export default function Goals() {
    const { currentUser, userProfile, userData, saveItem, deleteItem } = useAuth()
    const [showAdd, setShowAdd] = useState(false)

    // Entry State
    const [title, setTitle] = useState('')
    const [detail, setDetail] = useState('')
    const [sub, setSub] = useState('General')
    const [target, setTarget] = useState(100)
    const [unit, setUnit] = useState('%')
    const [deadline, setDeadline] = useState('')

    const goalsData: Goal[] = userData?.goals || []

    const handleSave = async () => {
        if (!title.trim() || target <= 0) return
        const id = Date.now()
        const goal: Goal = {
            id,
            title: title.trim(),
            detail: detail.trim(),
            subject: sub,
            progress: 0,
            target: Number(target),
            unit,
            deadline,
            done: false,
            createdAt: new Date().toISOString()
        }
        await saveItem(currentUser.uid, 'goals', id, goal)
        handleReset()
    }

    const handleReset = () => {
        setShowAdd(false)
        setTitle('')
        setDetail('')
        setTarget(100)
        setUnit('%')
        setDeadline('')
    }

    const handleIncrement = async (id: number, amt: number) => {
        const goal = goalsData.find(g => g.id === id)
        if (!goal) return
        const newProgress = Math.min(goal.target, goal.progress + amt)
        await saveItem(currentUser.uid, 'goals', id, {
            ...goal,
            progress: newProgress,
            done: newProgress >= goal.target
        })
    }

    const handleDelete = async (id: number) => {
        if (confirm('Mission Abortion: Permanent deletion of objective. Proceed?')) {
            await deleteItem(currentUser.uid, 'goals', id)
        }
    }

    const active = goalsData.filter(g => !g.done)
    const completed = goalsData.filter(g => g.done)

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <PTitle
                    title="MISSION OBJECTIVES"
                    sub="Clear targets. Absolute commitment."
                    className="mb-0"
                />
                <Btn onClick={() => setShowAdd(true)} className="h-12 px-8">
                    <Plus size={18} className="mr-2" /> Assign Directive
                </Btn>
            </div>

            {/* ADD MISSION MODAL */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60"
                    >
                        <Card className="w-full max-w-2xl p-0 border-orange/20 overflow-hidden">
                            <div className="p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h2 className="font-display text-3xl uppercase tracking-wider text-orange">Define Target</h2>
                                        <p className="font-mono text-[9px] text-muted uppercase tracking-[0.4em]">Strategic Directive Initialization</p>
                                    </div>
                                    <button onClick={handleReset} className="p-2 text-muted hover:text-red transition-colors"><X size={20} /></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-6">
                                        <Input label="Directive Title" placeholder="e.g. Master React Core Patterns" value={title} onChange={e => setTitle(e.target.value)} />
                                        <Textarea label="Strategic Rationale" placeholder="Why does this objective matter?" rows={3} value={detail} onChange={e => setDetail(e.target.value)} />
                                    </div>

                                    <div className="space-y-6">
                                        <Select label="Deployment Sector" value={sub} onChange={e => setSub(e.target.value)}>
                                            <option value="General">General Operations</option>
                                            {userProfile?.subjects?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                        </Select>
                                        <Input label="Target Goal (Value)" type="number" min="1" value={target} onChange={e => setTarget(Number(e.target.value))} />
                                    </div>

                                    <div className="space-y-6">
                                        <Input label="Measurement Unit" placeholder="e.g. %, Modules, Papers" value={unit} onChange={e => setUnit(e.target.value)} />
                                        <Input label="Mission Deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <Btn variant="ghost" full className="h-12" onClick={handleReset}>Abort</Btn>
                                    <Btn full className="h-12" onClick={handleSave}>Initialize Objective</Btn>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ACTIVE DIRECTIVES */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-orange">
                    <Activity size={16} />
                    Active Directives <span className="text-muted/40 ml-2 font-mono">[{active.length}]</span>
                </div>

                {active.length === 0 ? (
                    <Card className="p-12 border-dashed border-white/5 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
                            <Target size={32} className="text-muted/20" />
                        </div>
                        <p className="text-sm text-muted uppercase tracking-widest font-bold">No active directives found.</p>
                        <p className="text-[10px] text-muted/40 mt-2 uppercase font-mono">Status: Drift Detected. Initiative Required.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {active.map((g, i) => (
                            <motion.div
                                key={g.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="p-8 border-white/5 flex flex-col group hover:border-orange/30 transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                        <Target size={120} />
                                    </div>

                                    <div className="flex items-start justify-between mb-8">
                                        <div className="space-y-2">
                                            <Tag className="bg-white/5 border-white/10 text-[8px] font-mono text-muted/60">{g.subject.toUpperCase()}</Tag>
                                            <h3 className="font-display text-2xl uppercase tracking-wide text-text group-hover:text-orange transition-colors">{g.title}</h3>
                                            <p className="text-xs text-muted leading-relaxed font-body max-w-[80%]">{g.detail}</p>
                                        </div>
                                        <button onClick={() => handleDelete(g.id)} className="p-2 text-muted/20 hover:text-red transition-colors z-10"><Trash2 size={18} /></button>
                                    </div>

                                    <div className="mt-auto space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold tracking-widest">
                                                <span className="text-orange">{g.progress} {g.unit}</span>
                                                <span className="text-muted">{g.target} {g.unit}</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(g.progress / g.target) * 100}%` }}
                                                    className="h-full bg-orange shadow-[0_0_10px_rgba(232,93,4,0.3)] transition-all duration-1000"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                                            <div className="flex gap-2 flex-1">
                                                {[1, 5, 25].map(v => (
                                                    <button
                                                        key={v}
                                                        onClick={() => handleIncrement(g.id, v)}
                                                        className="flex-1 py-1.5 bg-white/[0.03] border border-white/5 hover:border-orange/40 text-[10px] font-mono text-muted hover:text-orange transition-all uppercase font-bold"
                                                    >
                                                        +{v}
                                                    </button>
                                                ))}
                                            </div>
                                            {g.deadline && (
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-orange/60 uppercase">
                                                    <Calendar size={12} /> {new Date(g.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* COMPLETED MISSIONS */}
            {completed.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400 opacity-60">
                        <Trophy size={16} />
                        Mission Log: Secured <span className="text-muted/40 ml-2 font-mono">[{completed.length}]</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completed.map(g => (
                            <div key={g.id} className="p-6 bg-white/[0.01] border border-white/5 flex items-center justify-between group opacity-40 hover:opacity-100 transition-all">
                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-text line-through opacity-50">{g.title}</h4>
                                    <p className="text-[9px] font-mono text-muted uppercase tracking-tighter">{g.target} {g.unit} // Success</p>
                                </div>
                                <div className="bg-green/10 p-2 border border-green/20">
                                    <ShieldCheck size={16} className="text-green-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* FOOTER QUOTE */}
            <div className="pt-12 text-center">
                <div className="inline-flex items-center gap-4 bg-orange/5 border border-orange/10 px-8 py-3">
                    <Flag size={14} className="text-orange" />
                    <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] font-bold">Execution Is The Only Strategy That Matters.</p>
                </div>
            </div>
        </div>
    )
}
