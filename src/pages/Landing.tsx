import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
    Zap,
    Target,
    BarChart3,
    Users,
    Database,
    Calendar,
    Cpu,
    UserCircle,
    ArrowRight,
    ChevronDown,
    Timer,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Clock, Btn } from '../components/UI'

const FEATURES = [
    { icon: BarChart3, title: 'RAGE REPORT', desc: 'Live analytics, RAGE Score, study charts, and performance radar.', tag: 'Analytics' },
    { icon: Timer, title: 'RAGE TRACK', desc: 'Study timer, session tracking, habits, and streak counter.', tag: 'Productivity' },
    { icon: Zap, title: 'RAGE FEED', desc: 'Social feed with tactical academic intelligence and peer updates.', tag: 'Intelligence' },
    { icon: Users, title: 'RAGE CONNECT', desc: 'Squad accountability and focus chambers for elite performance.', tag: 'Unity' },
    { icon: Database, title: 'RAGE VAULT', desc: 'Encrypted tactical knowledge base for files and persistent notes.', tag: 'Knowledge' },
    { icon: Target, title: 'RAGE GOALS', desc: 'High-stakes OKR tracking with milestone visualization.', tag: 'Execution' },
    { icon: Calendar, title: 'RAGE TIMETABLE', desc: 'Dynamic combat scheduler with browser-level notification alerts.', tag: 'Operations' },
    { icon: Cpu, title: 'RAGE AI TUTOR', desc: 'Claude-3.5-Sonnet integration for strategic academic support.', tag: 'AI' },
    { icon: UserCircle, title: 'RAGE PROFILE', desc: 'Academic rank system from Spark to RAGE with seasonal stats.', tag: 'Identity' }
]

const REPLACES = [
    { need: 'Study Tracking', curr: 'Strava / Apple Health', rage: 'RAGE TRACK' },
    { need: 'Intelligence Feed', curr: 'Instagram / Threads', rage: 'RAGE FEED' },
    { need: 'Operational Unity', curr: 'Discord / Slack', rage: 'RAGE CONNECT' },
    { need: 'Strategic Identity', curr: 'LinkedIn', rage: 'RAGE PROFILE' },
    { need: 'Knowledge Base', curr: 'Notion / Obsidian', rage: 'RAGE VAULT' },
    { need: 'Execution Tracking', curr: 'Todoist / Trello', rage: 'RAGE GOALS' },
    { need: 'Operational Schedule', curr: 'Google Calendar', rage: 'RAGE TIMETABLE' },
    { need: 'Intelligence Support', curr: 'ChatGPT', rage: 'RAGE AI TUTOR' },
    { need: 'Performance Metrics', curr: 'Spreadsheets', rage: 'RAGE REPORT' }
]

export default function Landing() {
    const navigate = useNavigate()
    const { theme, toggleTheme, quote } = useAuth()
    const { scrollY } = useScroll()

    const navBg = useTransform(scrollY, [0, 50], ["rgba(8,8,16,0)", "rgba(8,8,16,0.9)"])
    const navBorder = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)"])
    const navBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(24px)"])

    return (
        <div className="bg-background text-text selection:bg-orange/40">
            {/* NAVIGATION */}
            <motion.nav
                style={{
                    backgroundColor: navBg,
                    borderColor: navBorder,
                    backdropFilter: navBlur
                }}
                className="fixed top-0 left-0 right-0 z-50 border-b px-6 py-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange flex items-center justify-center font-display text-xl text-black">R</div>
                    <span className="font-display text-2xl tracking-[0.2em] text-orange">RAGE OS</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Clock full className="text-[10px]" />
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/auth')} className="text-[10px] font-bold uppercase tracking-widest hover:text-orange transition-colors">Combat Log</button>
                        <Btn size="sm" onClick={() => navigate('/auth')}>Deploy System</Btn>
                    </div>
                </div>
            </motion.nav>

            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
                {/* Futuristic Grid/Radial Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(circle_at_50%_50%,rgba(232,93,4,0.12),transparent_40%)]" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(rgba(232,93,4,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(232,93,4,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />
                </div>

                <div className="max-w-5xl w-full text-center relative z-10 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="inline-block border border-orange/40 px-4 py-1 text-[10px] uppercase font-mono tracking-[0.3em] bg-orange/5 text-orange animate-pulse">
                            Protocol: Performance Excellence
                        </div>

                        <h1 className="font-display text-[clamp(64px,12vw,160px)] leading-[0.85] uppercase tracking-tight">
                            Rise <span className="text-orange">Achieve</span> <br />
                            Grow <span className="text-orange outline-text">Evolve</span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-2xl mx-auto space-y-6"
                    >
                        <p className="text-lg md:text-xl text-muted font-body font-medium leading-relaxed">
                            Replace fragments with a unified <span className="text-text font-bold uppercase tracking-widest text-sm underline decoration-orange decoration-2 underline-offset-8">Student Operating System</span>. Built for those who refuse the status quo.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6">
                            <Btn size="lg" className="w-full md:w-auto h-16 text-lg" onClick={() => navigate('/auth')}>
                                Initiate Sequence <ArrowRight size={20} className="ml-2" />
                            </Btn>
                            <Btn variant="outline" size="lg" className="w-full md:w-auto h-16 text-lg" onClick={() => document.getElementById('intel')?.scrollIntoView({ behavior: 'smooth' })}>
                                View Tactical Intel
                            </Btn>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 0.8 }}
                        className="font-mono italic text-[10px] tracking-widest text-muted max-w-sm mx-auto h-12"
                    >
                        "{quote}"
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-orange/30 flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => document.getElementById('intel')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <span className="font-mono text-[9px] uppercase tracking-widest">Descent</span>
                    <ChevronDown size={14} />
                </motion.div>
            </section>

            {/* INTEL STRIP */}
            <div className="border-y border-white/5 bg-card/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5 py-8">
                    {[
                        { val: '09', label: 'Legacy Apps Replaced' },
                        { val: '0.0ms', label: 'Tactical Latency' },
                        { val: '1000', label: 'RAGE Cap Limit' },
                        { val: '∞', label: 'Potential Output' },
                    ].map((s, i) => (
                        <div key={i} className="px-8 flex flex-col items-center md:items-start">
                            <span className="font-display text-4xl text-orange">{s.val}</span>
                            <span className="text-[9px] font-bold text-muted uppercase tracking-[0.2em]">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODULES GRID */}
            <section id="intel" className="py-32 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="space-y-2">
                        <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-none">
                            Tactical <span className="text-orange">Ecosystem</span>
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-px bg-orange" />
                            <p className="font-mono text-[10px] text-muted uppercase tracking-[0.3em]">Module Cluster 01-09</p>
                        </div>
                    </div>
                    <p className="max-w-md text-muted text-sm leading-relaxed">
                        Eliminate context switching. A singular interface for high-intensity academic operations. Every module designed for maximum lethality.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-white/5">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ backgroundColor: 'rgba(232, 93, 4, 0.05)' }}
                            className="bg-background p-10 group relative transition-colors"
                        >
                            <div className="absolute top-4 right-6 text-[10px] font-mono text-white/5 group-hover:text-orange/20 transition-colors">MOD//0{i + 1}</div>
                            <f.icon className="text-orange mb-8 group-hover:scale-110 transition-transform" size={32} strokeWidth={1.5} />
                            <h3 className="font-display text-3xl uppercase tracking-wide mb-3">{f.title}</h3>
                            <p className="text-muted text-sm leading-relaxed mb-6 h-10 overflow-hidden line-clamp-2">{f.desc}</p>
                            <div className="flex items-center gap-2">
                                <span className="h-px w-4 bg-orange/40 group-hover:w-8 transition-all" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-orange/60">{f.tag}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* DEPLOYMENT TABLE */}
            <section className="py-24 px-6 bg-card/20 border-y border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16 space-y-2">
                        <h2 className="font-display text-4xl uppercase tracking-[0.2em]">Operational Shift</h2>
                        <p className="font-mono text-[10px] text-muted uppercase tracking-[0.3em]">System Redundancy Elimination</p>
                    </div>

                    <div className="border border-white/5 overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 bg-white/5 px-8 py-5 border-b border-white/5">
                            {['OBJECTIVE', 'LEGACY PROTOCOL', 'RAGE OS MODULE'].map(h => (
                                <div key={h} className="text-[10px] font-bold text-orange uppercase tracking-widest">{h}</div>
                            ))}
                        </div>
                        {REPLACES.map((row, i) => (
                            <div key={i} className="grid grid-cols-3 gap-4 px-8 py-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                <div className="text-sm font-bold uppercase tracking-wide text-text/80">{row.need}</div>
                                <div className="text-sm font-mono text-muted/50 line-through group-hover:text-red/30 transition-colors">{row.curr}</div>
                                <div className="text-sm font-bold text-orange/90 group-hover:glow-orange transition-all">{row.rage}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-40 px-6 overflow-hidden relative">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="font-display text-6xl md:text-9xl uppercase leading-[0.8] mb-12">
                        The <span className="text-orange">Gap</span> Between <br />
                        Intent and <span className="text-orange border-text">Action</span>
                    </h2>
                    <p className="text-muted max-w-xl mx-auto mb-12 font-medium">
                        Join the collective of elite students who scale their output through systematic discipline. Your era of stagnation ends today.
                    </p>
                    <div className="flex flex-col items-center gap-6">
                        <Btn size="lg" className="h-20 px-12 text-2xl" onClick={() => navigate('/auth')}>
                            Deploy Operating System
                        </Btn>
                        <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-muted animate-pulse">Waiting for synchronization...</span>
                    </div>
                </div>

                {/* Background Accents */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,93,4,0.05),transparent_70%)] pointer-events-none" />
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/5 px-6 py-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-orange flex items-center justify-center font-display text-sm text-black">R</div>
                            <span className="font-display text-xl tracking-widest text-orange">RAGE OS</span>
                        </div>
                        <p className="text-[10px] text-muted font-mono uppercase tracking-widest">
                            Built for students who refuse to be average. © 2026
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted">
                            <a href="#" className="hover:text-orange transition-colors">Manifesto</a>
                            <a href="#" className="hover:text-orange transition-colors">Support</a>
                            <a href="#" className="hover:text-orange transition-colors">Privacy</a>
                        </div>
                        <Clock className="text-[10px]" />
                    </div>
                </div>
            </footer>
        </div>
    )
}
