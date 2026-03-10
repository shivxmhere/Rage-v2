import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Check,
    ChevronRight,
    ChevronLeft,
    Flame,
    Rocket,
    Trophy,
    BrainCircuit,
    ShieldAlert,
    Plus
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Btn, Input, Card, AddRow, Tag, Textarea } from '../components/UI'

const STEPS = ['Initiation', 'Identity', 'Tactical Subjects', 'Primary Directive', 'SOPs', 'Deployment']

export default function Onboarding() {
    const { currentUser, userProfile, completeOnboarding, saveItem, quote, checkUsername } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [err, setErr] = useState('')

    // Onboarding Data State
    const [username, setUsername] = useState('')
    const [course, setCourse] = useState('')
    const [uni, setUni] = useState('')
    const [year, setYear] = useState('')
    const [bio, setBio] = useState('')
    const [subjects, setSubjects] = useState<string[]>([])
    const [currentSub, setCurrentSub] = useState('')
    const [goal, setGoal] = useState('')
    const [goalDetail, setGoalDetail] = useState('')
    const [habits, setHabits] = useState<string[]>([])
    const [currentHab, setCurrentHab] = useState('')
    const [loading, setLoading] = useState(false)

    const handleNext = async () => {
        setErr('')
        if (step === 2) {
            if (!username || !course || !uni) { setErr('All identity fields required'); return }
            if (!/^[a-z0-9_]{3,15}$/.test(username)) {
                setErr('Username must be 3-15 chars, lowercase, numbers, or underscores.'); return
            }
            setLoading(true)
            const isAvail = await checkUsername(username)
            setLoading(false)
            if (!isAvail) { setErr('Identification Conflict: Username taken'); return }
        }
        if (step === 3 && subjects.length === 0) { setErr('Add at least one tactical subject'); return }
        if (step === 4 && (!goal || !goalDetail)) { setErr('Operational objective required'); return }

        setStep(s => s + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    const handleLaunch = async () => {
        setLoading(true)
        try {
            const now = Date.now()
            // Parallel operations for speed
            const savePromises = [
                ...habits.map((h, i) => saveItem(currentUser.uid, 'habits', now + i, {
                    title: h,
                    doneDate: null,
                    createdAt: new Date().toISOString()
                })),
                saveItem(currentUser.uid, 'goals', now + 100, {
                    title: goal,
                    detail: goalDetail,
                    subject: subjects[0] || 'General',
                    progress: 0,
                    target: 100,
                    unit: '%',
                    done: false,
                    createdAt: new Date().toISOString()
                })
            ]

            await Promise.all(savePromises)

            await completeOnboarding(currentUser.uid, {
                username: username.toLowerCase().trim(),
                university: uni,
                course,
                year,
                subjects,
                goal,
                goalDetail,
                bio,
                level: "Spark",
                rageScore: 0,
                streak: 0,
                lastStudyDate: null,
                onboardingComplete: true
            })

            // Final punchy navigation
            setTimeout(() => navigate("/app"), 500)
        } catch (e: any) {
            console.error(e)
            setErr('Synchronization failure: ' + (e.message || 'Unknown protocol error'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden font-body">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(232,93,4,0.05),transparent_60%)] pointer-events-none" />

            <div className="max-w-md w-full relative z-10 space-y-8">
                {/* Progress Tracker */}
                <div className="flex gap-2">
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${step > i ? 'bg-orange shadow-[0_0_8px_rgba(232,93,4,0.5)]' : 'bg-white/5'}`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20, rotateY: 10 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -20, rotateY: -10 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Card className="p-8 md:p-10 border-white/10 shadow-2xl relative overflow-hidden">
                            {/* Subtle corner detail */}
                            <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-white/10 uppercase tracking-widest leading-none">
                                TECHLIONS PROTOCOL // Step 0{step}
                            </div>

                            {step === 1 && (
                                <div className="text-center space-y-6">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="w-20 h-20 bg-orange/10 flex items-center justify-center rounded-3xl mx-auto border border-orange/20"
                                    >
                                        <Flame className="text-orange" size={40} />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h2 className="font-display text-4xl uppercase tracking-wider text-orange leading-none">TECHLIONS ACTIVATION</h2>
                                        <div className="flex items-center justify-center gap-2">
                                            <p className="text-muted text-[10px] uppercase tracking-widest font-mono">Pilot: {(userProfile?.name || 'Unknown').split(' ')[0]}</p>
                                            <span className="text-white/10">•</span>
                                            <button onClick={() => logout(navigate)} className="text-[10px] uppercase tracking-widest font-mono text-orange/40 hover:text-orange transition-colors">Abort & Switch Account</button>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 px-6 py-6 border-l-2 border-orange relative">
                                        <span className="absolute -top-3 left-4 bg-background px-2 text-[8px] font-mono text-orange/50 uppercase tracking-[0.2em]">Intercepted Wisdom</span>
                                        <p className="italic text-sm text-text/80 leading-relaxed font-body">"{quote}"</p>
                                    </div>
                                    <Btn full size="lg" className="h-16" onClick={handleNext}>Initialize Systems <ChevronRight size={18} className="ml-2" /></Btn>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <h2 className="font-display text-3xl uppercase tracking-wide">Signal Identity</h2>
                                        <p className="text-xs text-muted font-mono uppercase tracking-[0.2em]">Establish tactical credentials</p>
                                    </div>
                                    <div className="space-y-4">
                                        <Input label="Tactical Codename" placeholder="e.g. shadow_operator" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} />
                                        <Input label="Operational Field (Major)" placeholder="e.g. Theoretical Computation" value={course} onChange={e => setCourse(e.target.value)} />
                                        <Input label="Intelligence Hub (University)" placeholder="e.g. MIT Cluster" value={uni} onChange={e => setUni(e.target.value)} />
                                        <Input label="Current Phase (Year/Sem)" placeholder="e.g. Phase 03 // Final" value={year} onChange={e => setYear(e.target.value)} />
                                        <Textarea
                                            label="Operator Bio"
                                            placeholder="Briefly state your core mission..."
                                            className="min-h-[80px]"
                                            value={bio}
                                            onChange={(e: any) => setBio(e.target.value)}
                                        />
                                    </div>
                                    {err && <div className="p-3 bg-red/10 border border-red/20 text-red text-[10px] uppercase font-bold tracking-widest flex items-center gap-2"><ShieldAlert size={14} /> {err}</div>}
                                    <div className="flex gap-3">
                                        <Btn variant="outline" full onClick={() => setStep(s => s - 1)}>Abort</Btn>
                                        <Btn full onClick={handleNext} disabled={loading}>{loading ? 'Syncing...' : 'Confirm'}</Btn>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <h2 className="font-display text-3xl uppercase tracking-wide text-orange">Tactical Subjects</h2>
                                        <p className="text-xs text-muted font-mono uppercase tracking-[0.2em]">Map your cognitive battlefield</p>
                                    </div>
                                    <AddRow
                                        value={currentSub}
                                        onChange={setCurrentSub}
                                        placeholder="e.g. Advanced Calculus"
                                        onAdd={() => { if (currentSub.trim() && !subjects.includes(currentSub)) setSubjects([...subjects, currentSub.trim()]); setCurrentSub('') }}
                                    />
                                    <div className="flex flex-wrap gap-2 min-h-[100px] items-start">
                                        {subjects.length === 0 && <span className="text-[10px] text-muted/30 font-mono uppercase tracking-widest italic pt-2">Awaiting subject uplink...</span>}
                                        {subjects.map(s => (
                                            <Tag key={s} onRemove={() => setSubjects(subjects.filter(x => x !== s))}>{s}</Tag>
                                        ))}
                                    </div>
                                    {err && <div className="p-3 bg-red/10 border border-red/20 text-red text-[10px] uppercase font-bold tracking-widest flex items-center gap-2"><ShieldAlert size={14} /> {err}</div>}
                                    <div className="flex gap-3">
                                        <Btn variant="outline" full onClick={() => setStep(s => s - 1)}>Back</Btn>
                                        <Btn full onClick={handleNext}>Proceed</Btn>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <h2 className="font-display text-3xl uppercase tracking-wide">Primary Directive</h2>
                                        <p className="text-xs text-muted font-mono uppercase tracking-[0.2em]">Define your ultimate objective</p>
                                    </div>
                                    <div className="space-y-5">
                                        <Input label="Directive Title" placeholder="e.g. Secure Alpha-Class Internship" value={goal} onChange={e => setGoal(e.target.value)} />
                                        <Textarea
                                            label="Why it Matters?"
                                            placeholder="Define the leverage this objective provides..."
                                            value={goalDetail}
                                            onChange={(e: any) => setGoalDetail(e.target.value)}
                                        />
                                    </div>
                                    {err && <div className="p-3 bg-red/10 border border-red/20 text-red text-[10px] uppercase font-bold tracking-widest flex items-center gap-2"><ShieldAlert size={14} /> {err}</div>}
                                    <div className="flex gap-3">
                                        <Btn variant="outline" full onClick={() => setStep(s => s - 1)}>Back</Btn>
                                        <Btn full onClick={handleNext}>Confirm Directive</Btn>
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <h2 className="font-display text-3xl uppercase tracking-wide">Daily SOPs</h2>
                                        <p className="text-xs text-muted font-mono uppercase tracking-[0.2em]">Standard Operating Procedures</p>
                                    </div>
                                    <AddRow
                                        value={currentHab}
                                        onChange={setCurrentHab}
                                        placeholder="e.g. 0500 System Boot (Wakeup)"
                                        onAdd={() => { if (currentHab.trim() && !habits.includes(currentHab)) setHabits([...habits, currentHab.trim()]); setCurrentHab('') }}
                                    />
                                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                        {habits.length === 0 && <span className="text-[10px] text-muted/30 font-mono uppercase tracking-widest italic">Define your daily loops...</span>}
                                        {habits.map(h => (
                                            <div key={h} className="group flex items-center justify-between p-3 bg-white/5 border border-white/5 hover:border-orange/30 transition-all">
                                                <span className="text-xs uppercase font-medium">{h}</span>
                                                <button onClick={() => setHabits(habits.filter(x => x !== h))} className="opacity-0 group-hover:opacity-100 text-red/60 hover:text-red transition-all"><Plus size={14} className="rotate-45" /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <Btn variant="outline" full onClick={() => setStep(s => s - 1)}>Back</Btn>
                                        <Btn full onClick={handleNext}>{habits.length > 0 ? 'Proceed' : 'Bypass SOPs'}</Btn>
                                    </div>
                                </div>
                            )}

                            {step === 6 && (
                                <div className="text-center space-y-8">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 2.5 }}
                                        className="w-24 h-24 bg-green/10 flex items-center justify-center rounded-full mx-auto border border-green/20"
                                    >
                                        <Rocket className="text-green" size={48} />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h2 className="font-display text-5xl uppercase tracking-widest text-green">All Systems GO</h2>
                                        <p className="text-xs text-muted font-mono uppercase tracking-[0.2em]">System ready for deployment</p>
                                    </div>
                                    <div className="space-y-4 pt-4">
                                        <Btn
                                            full
                                            size="lg"
                                            className="h-20 text-2xl bg-green hover:bg-green/90 group relative overflow-hidden"
                                            onClick={handleLaunch}
                                            disabled={loading}
                                        >
                                            <AnimatePresence mode="wait">
                                                {loading ? (
                                                    <motion.div
                                                        key="l"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black animate-spin rounded-full" />
                                                        UPLINKING DATA...
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="n"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="flex items-center gap-3"
                                                    >
                                                        LAUNCH TECHLIONS OS <Rocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Btn>
                                        <p className="text-[10px] font-mono text-muted/30 uppercase tracking-[0.6em] animate-pulse">Quantum Encryption Protocols Active</p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Branded watermark */}
            <div className="absolute bottom-6 font-display text-4xl text-white/5 pointer-events-none uppercase tracking-widest">TECHLIONS</div>
        </div>
    )
}
