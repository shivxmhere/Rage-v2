import React, { useState, useEffect, useRef, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Clock as ClockIcon,
    X,
    ChevronRight,
    Plus,
    Paperclip,
    RefreshCcw,
    AlertCircle,
    TrendingUp
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** ─── Utility ─── */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** ─── Live Clock ─── */
interface ClockProps {
    full?: boolean;
    className?: string;
}

export function Clock({ full, className }: ClockProps) {
    const [t, setT] = useState(new Date())
    useEffect(() => {
        const i = setInterval(() => setT(new Date()), 1000)
        return () => clearInterval(i)
    }, [])

    const fmt = (n: number) => String(n).padStart(2, '0')
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const time = `${fmt(t.getHours())}:${fmt(t.getMinutes())}:${fmt(t.getSeconds())}`
    const date = full ? ` ${days[t.getDay()]}, ${fmt(t.getDate())} ${months[t.getMonth()]} ${t.getFullYear()}` : ''

    return (
        <div className={cn("flex items-center gap-2 font-mono text-xs text-muted tracking-widest uppercase", className)}>
            <ClockIcon size={14} className="text-orange/70" />
            <span>{time}{date}</span>
        </div>
    )
}

/** ─── Motivation Bar ─── */
interface MotivationBarProps {
    quote: string;
    onClose?: () => void;
}

export function MotivationBar({ quote, onClose }: MotivationBarProps) {
    return (
        <div className="bg-card border-b border-white/5 py-2 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <TrendingUp size={14} className="text-orange" />
                <span className="italic text-xs text-muted font-mono leading-none">"{quote}"</span>
            </div>
            {onClose && (
                <button onClick={onClose} className="text-muted hover:text-text transition-colors p-1">
                    <X size={14} />
                </button>
            )}
        </div>
    )
}

/** ─── Button ─── */
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    full?: boolean;
}

export function Btn({
    variant = 'primary',
    size = 'md',
    full,
    className,
    children,
    ...props
}: BtnProps) {
    const variants = {
        primary: "bg-orange text-black",
        ghost: "bg-transparent text-orange hover:bg-orange/10",
        outline: "bg-transparent text-text border border-white/10 hover:border-orange/50",
        danger: "bg-transparent text-red border border-red/30 hover:bg-red/10",
        success: "bg-green text-black"
    }

    const sizes = {
        sm: "px-4 py-1.5 text-xs",
        md: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base"
    }

    // Angular clip-path for primary/success
    const isClipped = ['primary', 'success'].includes(variant)
    const clipPath = isClipped ? 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' : 'none'

    return (
        <motion.button
            whileHover={props.disabled ? {} : { filter: 'brightness(1.1)', scale: 1.02 }}
            whileTap={props.disabled ? {} : { scale: 0.95 }}
            style={{ clipPath }}
            className={cn(
                "font-display uppercase tracking-widest font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                full ? "w-full" : "w-auto",
                className
            )}
            {...(props as any)}
        >
            {children}
        </motion.button>
    )
}

/** ─── Input Components ─── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    err?: string;
}

export function Input({ label, hint, err, className, ...props }: InputProps) {
    return (
        <div className={cn("mb-4 space-y-1.5", className)}>
            {label && <label className="block text-[10px] font-bold text-muted uppercase tracking-widest">{label}</label>}
            <input
                className={cn(
                    "w-full bg-background/50 border border-white/10 rounded-none px-4 py-2.5 text-sm text-text transition-all focus:border-orange/50 focus:ring-1 focus:ring-orange/20 outline-none placeholder:text-muted/50 font-body",
                    err && "border-red/50 focus:border-red/50 focus:ring-red/10"
                )}
                {...props}
            />
            {hint && <p className="text-[10px] text-muted font-mono">{hint}</p>}
            {err && <div className="flex items-center gap-1.5 text-[10px] text-red uppercase font-bold"><AlertCircle size={10} /> {err}</div>}
        </div>
    )
}

export function Textarea({ label, hint, err, className, ...props }: any) {
    return (
        <div className={cn("space-y-1.5", className)}>
            {label && <label className="block text-[10px] font-bold text-muted uppercase tracking-widest">{label}</label>}
            <textarea
                className={cn(
                    "w-full bg-background/50 border border-white/10 rounded-none px-4 py-2.5 text-sm text-text transition-all focus:border-orange/50 focus:ring-1 focus:ring-orange/20 outline-none placeholder:text-muted/50 font-body min-h-[100px] resize-none",
                    err && "border-red/50 focus:border-red/50 focus:ring-red/10"
                )}
                {...props}
            />
            {hint && <p className="text-[10px] text-muted font-mono">{hint}</p>}
            {err && <div className="flex items-center gap-1.5 text-[10px] text-red uppercase font-bold"><AlertCircle size={10} /> {err}</div>}
        </div>
    )
}

export function Select({ label, hint, err, className, children, ...props }: any) {
    return (
        <div className={cn("space-y-1.5", className)}>
            {label && <label className="block text-[10px] font-bold text-muted uppercase tracking-widest">{label}</label>}
            <select
                className={cn(
                    "w-full bg-background/50 border border-white/10 rounded-none px-4 py-2.5 text-sm text-text transition-all focus:border-orange/50 focus:ring-1 focus:ring-orange/20 outline-none font-body appearance-none",
                    err && "border-red/50 focus:border-red/50 focus:ring-red/10"
                )}
                {...props}
            >
                {children}
            </select>
            {hint && <p className="text-[10px] text-muted font-mono">{hint}</p>}
            {err && <div className="flex items-center gap-1.5 text-[10px] text-red uppercase font-bold"><AlertCircle size={10} /> {err}</div>}
        </div>
    )
}

export function FileBadge({ name, size, onRemove }: { name: string; size: number; onRemove?: () => void }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 text-[10px] font-mono text-muted uppercase tracking-tighter">
            <Paperclip size={12} className="text-orange" />
            <span className="max-w-[120px] truncate">{name}</span>
            <span className="opacity-40">({(size / 1024).toFixed(0)}KB)</span>
            {onRemove && (
                <button onClick={onRemove} className="ml-1 text-muted/40 hover:text-red transition-colors">
                    <X size={12} />
                </button>
            )}
        </div>
    )
}

/** ─── Card ─── */
interface CardProps {
    children: ReactNode;
    className?: string;
    glow?: boolean;
    activeGlow?: boolean;
    onClick?: () => void;
    noPadding?: boolean;
}

export function Card({ children, className, glow, activeGlow, onClick, noPadding }: CardProps) {
    return (
        <motion.div
            whileHover={onClick ? { y: -2, borderColor: 'rgba(232, 93, 4, 0.3)' } : {}}
            onClick={onClick}
            className={cn(
                "bg-card border border-white/5 relative transition-all group overflow-hidden",
                onClick && "cursor-pointer",
                glow && "shadow-[0_0_20px_rgba(232,93,4,0.05)]",
                activeGlow && "border-orange shadow-[0_0_30px_rgba(232,93,4,0.15)]",
                noPadding ? "" : "p-6",
                className
            )}
        >
            {/* Subtle corner detail */}
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                <div className="absolute top-0 right-0 w-px h-2 bg-white/20 group-hover:bg-orange/50 transition-colors"></div>
                <div className="absolute top-0 right-0 w-2 h-px bg-white/20 group-hover:bg-orange/50 transition-colors"></div>
            </div>
            {children}
        </motion.div>
    )
}

/** ─── Page Title ─── */
export function PTitle({ title, sub, action, className }: { title: string; sub?: string; action?: ReactNode; className?: string }) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8", className)}>
            <div>
                <h1 className="font-display text-5xl md:text-6xl text-text tracking-wider uppercase leading-none">{title}</h1>
                {sub && <p className="text-muted text-xs font-mono uppercase tracking-widest mt-2 flex items-center gap-2">
                    <span className="w-8 h-px bg-orange/40"></span> {sub}
                </p>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    )
}

/** ─── Stat ─── */
export function Stat({ val, label, color, suffix }: any) {
    return (
        <div className="space-y-1">
            <div className="flex items-baseline gap-1">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: color || 'var(--orange)' }}
                    className="font-display text-4xl md:text-5xl leading-none"
                >
                    {val}
                </motion.div>
                {suffix && <span className="text-muted text-lg font-display uppercase">{suffix}</span>}
            </div>
            <div className="text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                {label}
            </div>
        </div>
    )
}

/** ─── Progress Bar ─── */
export function Bar({ val = 0, max = 100, label }: any) {
    const pct = Math.min(100, (val / max) * 100)
    const isFull = pct >= 100

    return (
        <div className="space-y-2">
            {(label || true) && (
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{label}</span>
                    <span className="text-[10px] font-mono text-muted">{Math.round(pct)}%</span>
                </div>
            )}
            <div className="h-1 bg-white/5 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                        "h-full transition-colors duration-500",
                        isFull ? "bg-green shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-orange shadow-[0_0_10px_rgba(232,93,4,0.3)]"
                    )}
                />
            </div>
        </div>
    )
}

/** ─── Tag ─── */
export function Tag({ children, onRemove, active }: any) {
    return (
        <span className={cn(
            "inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all",
            active ? "bg-orange text-black" : "bg-white/5 text-muted hover:bg-white/10"
        )}>
            {children}
            {onRemove && (
                <button onClick={onRemove} className="hover:text-red transition-colors">
                    <X size={10} />
                </button>
            )}
        </span>
    )
}

/** ─── Avatar ─── */
export function Ava({ letter, size = 40, src }: any) {
    return (
        <div
            style={{ width: size, height: size }}
            className="bg-orange flex items-center justify-center font-display text-black font-bold flex-shrink-0"
        >
            {src ? (
                <img src={src} alt="" className="w-full h-full object-cover" />
            ) : (
                <span style={{ fontSize: size * 0.5 }}>{(letter || 'R')[0].toUpperCase()}</span>
            )}
        </div>
    )
}

/** ─── Empty State ─── */
export function Empty({ icon, title, sub, action }: any) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
            <div className="text-white/10">
                {icon || <AlertCircle size={48} strokeWidth={1} />}
            </div>
            <div>
                <h3 className="font-display text-2xl text-text/80 uppercase tracking-wider">{title || 'NO DATA DETECTED'}</h3>
                <p className="text-muted text-xs font-mono mt-1">{sub || 'Awaiting synchronization...'}</p>
            </div>
            {action}
        </div>
    )
}

/** ─── AddRow ─── */
export function AddRow({ value, onChange, onAdd, placeholder }: any) {
    return (
        <div className="flex items-center gap-2">
            <div className="relative flex-1">
                <input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && value.trim() && onAdd()}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/5 px-4 py-2 text-sm text-text outline-none focus:border-orange/30 placeholder:text-muted/30 font-body"
                />
            </div>
            <button
                onClick={onAdd}
                disabled={!value?.trim()}
                className="bg-white/10 hover:bg-orange hover:text-black disabled:opacity-30 p-2.5 transition-all text-orange"
            >
                <Plus size={18} />
            </button>
        </div>
    )
}

/** ─── PullToRefresh ─── */
export function PullToRefresh({ onRefresh, children }: { onRefresh: () => Promise<void>, children: ReactNode }) {
    const [pullDist, setPullDist] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const startY = useRef(0)

    const handleTouchStart = (e: React.TouchEvent) => {
        if (window.scrollY > 0 || refreshing) return
        const scrollEl = document.getElementById('content-area')
        if (scrollEl && scrollEl.scrollTop > 5) return
        startY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startY.current === 0 || refreshing) return
        const y = e.touches[0].clientY
        if (y > startY.current) {
            const dist = Math.min((y - startY.current) * 0.4, 80)
            setPullDist(dist)
        }
    }

    const handleTouchEnd = async () => {
        if (startY.current === 0 || refreshing) return
        if (pullDist > 50) {
            setRefreshing(true)
            await onRefresh()
            setRefreshing(false)
        }
        setPullDist(0)
        startY.current = 0
    }

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative min-h-full"
        >
            <AnimatePresence>
                {(pullDist > 0 || refreshing) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-0 left-0 right-0 flex justify-center py-4 pointer-events-none z-50"
                    >
                        <div className="bg-card border border-white/10 w-10 h-10 flex items-center justify-center">
                            <RefreshCcw
                                size={18}
                                className={cn("text-orange", refreshing && "animate-spin")}
                                style={{ transform: !refreshing ? `rotate(${pullDist * 4}deg)` : 'none' }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                animate={{ y: refreshing ? 60 : pullDist }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
                {children}
            </motion.div>
        </div>
    )
}
