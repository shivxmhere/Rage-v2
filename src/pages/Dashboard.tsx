import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion'
import {
    BarChart3,
    Timer,
    Rss,
    Users,
    Box,
    Target,
    Calendar,
    Cpu,
    User,
    Menu,
    X,
    Sun,
    Moon,
    LogOut,
    Plus,
    Zap,
    ChevronRight,
    TrendingUp,
    LayoutGrid
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Clock, cn } from '../components/UI'

/** ─── Sub-Components ─── */

function LevelUpOverlay({ score, onClose }: { score: number | null, onClose: () => void }) {
    if (!score) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/95 backdrop-blur-xl z-[9999] flex flex-col items-center justify-center p-6"
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(40)].map((_, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 1, x: '50vw', y: '50vh', scale: 0 }}
                            animate={{
                                opacity: 0,
                                x: `calc(50vw + ${(Math.random() - 0.5) * 800}px)`,
                                y: `calc(50vh + ${(Math.random() - 0.5) * 800}px)`,
                                scale: Math.random() * 3 + 1
                            }}
                            transition={{ duration: 1.5 + Math.random(), ease: 'easeOut' }}
                            className="absolute w-1.5 h-1.5 bg-orange rounded-full shadow-[0_0_15px_#E85D04]"
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0.8, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="text-center space-y-8 z-10"
                >
                    <div className="space-y-2">
                        <h2 className="font-display text-8xl md:text-9xl text-orange glow-orange leading-none tracking-tighter">ASCENSION</h2>
                        <p className="font-mono text-sm text-muted uppercase tracking-[0.4em]">Capacity Limit Reached // Level Up</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 flex flex-col items-center space-y-2">
                        <span className="text-xs font-bold text-muted uppercase tracking-widest">New Tactical Rank</span>
                        <span className="font-display text-5xl text-text">ELITE OPERATOR</span>
                        <div className="text-orange font-mono text-xs pt-4">RAGE Score: {score}</div>
                    </div>

                    <button
                        onClick={onClose}
                        className="group relative px-12 py-5 bg-orange text-black font-display text-xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                    >
                        Acknowledge Evolution
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

const NAV_ITEMS = [
    { path: '', label: 'Report', icon: BarChart3, color: 'text-blue-400' },
    { path: 'track', label: 'Track', icon: Timer, color: 'text-orange' },
    { path: 'feed', label: 'Feed', icon: Rss, color: 'text-green-400' },
    { path: 'connect', label: 'Connect', icon: Users, color: 'text-purple-400' },
    { path: 'vault', label: 'Vault', icon: Box, color: 'text-amber-400' },
    { path: 'goals', label: 'Goals', icon: Target, color: 'text-red-400' },
    { path: 'timetable', label: 'Schedule', icon: Calendar, color: 'text-sky-400' },
    { path: 'ai', label: 'AI Tutor', icon: Cpu, color: 'text-orange' },
    { path: 'profile', label: 'Profile', icon: User, color: 'text-white' }
]

const MOBILE_NAV = [
    { path: '', label: 'Home', icon: LayoutGrid },
    { path: 'track', label: 'Track', icon: Timer },
    { center: true, icon: Plus },
    { path: 'feed', label: 'Intelligence', icon: Zap },
    { path: 'profile', label: 'Identity', icon: User }
]

export default function Dashboard() {
    const { userProfile, rageScore, logout, theme, toggleTheme } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [collapsed, setCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [levelUpScore, setLevelUpScore] = useState<number | null>(null)

    const prevScore = useRef(rageScore)

    // Listen for level up
    useEffect(() => {
        if (rageScore > prevScore.current) {
            const prevLvl = Math.floor(prevScore.current / 1000)
            const curLvl = Math.floor(rageScore / 1000)
            if (curLvl > prevLvl && curLvl > 0) setLevelUpScore(rageScore)
        }
        prevScore.current = rageScore
    }, [rageScore])

    // Animated Score
    const scoreMV = useMotionValue(0)
    const displayScore = useTransform(scoreMV, (v) => Math.round(v))

    useEffect(() => {
        const animation = animate(scoreMV, rageScore, { duration: 1.2, ease: [0.22, 1, 0.36, 1] })
        return animation.stop
    }, [rageScore])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const unmappedNav = NAV_ITEMS.filter(n => !MOBILE_NAV.find(m => m.path === n.path && !m.center))

    return (
        <div className="flex h-screen bg-background text-text overflow-hidden font-body">
            {/* SIDEBAR (Desktop) */}
            {!isMobile && (
                <motion.aside
                    animate={{ width: collapsed ? 84 : 280 }}
                    className="h-screen border-r border-white/5 bg-card/30 backdrop-blur-xl flex flex-col z-50 transition-all duration-300 relative"
                >
                    {/* Logo Area */}
                    <div className="h-20 flex items-center px-6 border-b border-white/5 justify-between overflow-hidden">
                        <div className="flex items-center gap-3">
                            <div className="min-w-[32px] h-8 bg-orange flex items-center justify-center font-display text-xl text-black">R</div>
                            {!collapsed && <span className="font-display text-2xl tracking-[0.2em] text-orange whitespace-nowrap">RAGE OS</span>}
                        </div>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 text-muted hover:text-orange transition-colors"
                        >
                            <Menu size={18} />
                        </button>
                    </div>

                    {/* Nav Section */}
                    <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1.5 custom-scrollbar">
                        {NAV_ITEMS.map((item) => {
                            const isActive = location.pathname === (item.path ? `/app/${item.path}` : '/app')
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === ''}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 group relative transition-all rounded-none",
                                        isActive ? "bg-white/5 text-orange" : "text-muted hover:bg-white/[0.03] hover:text-text"
                                    )}
                                >
                                    <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} className={cn("transition-colors", isActive ? "text-orange" : "group-hover:text-orange")} />
                                    {!collapsed && <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">{item.label}</span>}

                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebarActive"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-orange shadow-[0_0_10px_#E85D04]"
                                        />
                                    )}
                                </NavLink>
                            )
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-white/5 bg-card/10">
                        <button
                            onClick={() => navigate('/app/profile')}
                            className={cn(
                                "w-full flex items-center gap-4 p-3 hover:bg-white/5 transition-all group",
                                collapsed ? "justify-center" : "justify-start"
                            )}
                        >
                            <div className="w-10 h-10 bg-orange/10 border border-orange/20 flex items-center justify-center font-display text-xl text-orange group-hover:bg-orange group-hover:text-black transition-all">
                                {(userProfile?.name || 'R')[0].toUpperCase()}
                            </div>
                            {!collapsed && (
                                <div className="text-left overflow-hidden">
                                    <div className="text-[11px] font-bold text-text truncate uppercase tracking-widest leading-none">{userProfile?.name}</div>
                                    <div className="text-[9px] font-mono text-muted mt-1 uppercase tracking-tighter opacity-60 line-clamp-1">@{userProfile?.username || 'GUEST'}</div>
                                </div>
                            )}
                        </button>
                    </div>
                </motion.aside>
            )}

            {/* MAIN VIEWPORT */}
            <main className="flex-1 flex flex-col min-w-0 bg-background relative">
                {/* Top Header Bar */}
                <header className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        {isMobile ? (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange flex items-center justify-center font-display text-xl text-black">R</div>
                                <span className="font-display text-2xl tracking-[0.15em] text-orange">RAGE</span>
                            </div>
                        ) : (
                            <Clock className="text-[10px]" full />
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="w-10 h-10 border border-white/10 flex items-center justify-center text-muted hover:text-orange hover:border-orange/20 transition-all"
                        >
                            <AnimatePresence mode="wait">
                                {theme === 'dark' ? (
                                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Sun size={18} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Moon size={18} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* RAGE Score Badge */}
                        <div className="h-10 border border-white/10 px-4 flex items-center gap-3 bg-white/[0.02]">
                            <TrendingUp size={14} className="text-orange" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[8px] font-mono text-muted uppercase tracking-[0.2em]">Live Rage Index</span>
                                <div className="flex items-baseline gap-1">
                                    <motion.span className="font-display text-xl tracking-wide text-orange">{displayScore}</motion.span>
                                    <span className="text-[10px] font-display text-muted">CAP</span>
                                </div>
                            </div>
                        </div>

                        {!isMobile && (
                            <button
                                onClick={() => logout(navigate)}
                                className="p-3 text-muted/40 hover:text-red transition-colors"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </header>

                {/* Dynamic Content Area */}
                <div
                    id="content-area"
                    className={cn(
                        "flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative",
                        isMobile ? "pb-24 p-6" : "p-10"
                    )}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="min-h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* BOTTOM NAV (Mobile) */}
                {isMobile && (
                    <nav className="fixed bottom-0 left-0 right-0 h-[calc(64px+env(safe-area-inset-bottom))] border-t border-white/5 bg-background/80 backdrop-blur-2xl z-[100] flex items-center px-4 pb-[env(safe-area-inset-bottom)]">
                        {MOBILE_NAV.map((n, i) => {
                            if (n.center) {
                                return (
                                    <div key="cnt" className="flex-1 flex justify-center -mt-10">
                                        <motion.button
                                            whileTap={{ scale: 0.9, y: 2 }}
                                            onClick={() => setDrawerOpen(true)}
                                            className="w-16 h-16 bg-orange rounded-full flex items-center justify-center text-black shadow-[0_8px_32px_rgba(232,93,4,0.3)] border-4 border-background"
                                        >
                                            <Plus size={28} strokeWidth={3} />
                                        </motion.button>
                                    </div>
                                )
                            }
                            const isActive = location.pathname === (n.path ? `/app/${n.path}` : '/app')
                            return (
                                <button
                                    key={n.path}
                                    onClick={() => navigate(n.path!)}
                                    className={cn(
                                        "flex-1 flex flex-col items-center justify-center gap-1 transition-all h-full relative",
                                        isActive ? "text-orange" : "text-muted"
                                    )}
                                >
                                    <n.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.1em]">{n.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeDot"
                                            className="absolute bottom-1 w-1 h-1 bg-orange rounded-full"
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </nav>
                )}
            </main>

            {/* MORE DRAWER (Mobile) */}
            <AnimatePresence>
                {isMobile && drawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDrawerOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-card border-t border-white/10 z-[201] rounded-t-[32px] overflow-hidden flex flex-col p-6 pb-[calc(24px+env(safe-area-inset-bottom))]"
                        >
                            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-8 flex-shrink-0" />

                            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-4">
                                    <h3 className="font-display text-2xl uppercase tracking-widest text-orange pl-2">System Modules</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {unmappedNav.map(item => (
                                            <button
                                                key={item.path}
                                                onClick={() => { navigate(item.path); setDrawerOpen(false) }}
                                                className="bg-white/5 border border-white/5 flex flex-col items-start p-4 gap-3 active:bg-orange/10 active:border-orange/30 transition-all"
                                            >
                                                <item.icon size={20} className="text-orange" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-display text-2xl uppercase tracking-widest text-muted pl-2 opacity-50">Operations</h3>
                                    <button
                                        onClick={() => { logout(navigate); setDrawerOpen(false) }}
                                        className="w-full bg-red/10 border border-red/20 py-4 px-6 flex items-center justify-between text-red active:bg-red/20 transition-all group"
                                    >
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Logout Protocol</span>
                                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <LevelUpOverlay score={levelUpScore} onClose={() => setLevelUpScore(null)} />
        </div>
    )
}
