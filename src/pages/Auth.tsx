import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Key,
    Mail,
    User,
    ArrowRight,
    AtSign,
    Info,
    ShieldCheck,
    Chrome,
    Box
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Btn, Input, Card } from '../components/UI'

export default function Auth() {
    const { currentUser, signup, login, loginWithGoogle, quote } = useAuth()
    const navigate = useNavigate()

    const [tab, setTab] = useState<'signin' | 'signup'>('signin')
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')
    const [showForgot, setShowForgot] = useState(false)

    // Form State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirmPass, setConfirmPass] = useState('')

    if (currentUser) return <Navigate to="/app" replace />

    const handleSignIn = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setErr('')
        if (!email.trim() || !password) { setErr('All credentials required'); return }
        setLoading(true)
        try {
            await login(email.trim(), password)
            navigate('/app')
        } catch (e: any) {
            setErr(e.message?.includes('auth/user-not-found') ? 'Subject not found' : 'Access denied: Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    const handleSignUp = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setErr('')
        if (!name.trim() || !email.trim() || !password) { setErr('All fields required'); return }
        if (password !== confirmPass) { setErr('Password parity mismatch'); return }
        if (password.length < 6) { setErr('Complexity error: Min 6 characters'); return }

        setLoading(true)
        try {
            await signup(email.trim(), password, name.trim())
            navigate('/onboarding')
        } catch (e: any) {
            setErr(e.message || 'System error: Signup failed')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = async () => {
        setLoading(true)
        try {
            await loginWithGoogle(navigate)
        } catch (e: any) {
            if (!e.message?.includes('popup-closed')) setErr('External auth link failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden font-body">
            {/* LEFT: Branding/Atmosphere */}
            <div className="hidden md:flex flex-1 relative flex-col items-center justify-center p-12 overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(232,93,4,0.1),transparent_60%)]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(232,93,4,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(232,93,4,0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center"
                >
                    <h1 className="font-display text-9xl text-orange tracking-widest glow-orange mb-2">RAGE</h1>
                    <div className="flex items-center gap-4 text-muted font-mono text-[10px] tracking-[0.5em] uppercase mb-12">
                        <span className="w-12 h-px bg-orange/30"></span>
                        Interface Access
                        <span className="w-12 h-px bg-orange/30"></span>
                    </div>
                    <p className="max-w-xs mx-auto italic text-muted text-xs leading-relaxed opacity-60">
                        "{quote}"
                    </p>
                </motion.div>

                {/* Tactical status lines at bottom */}
                <div className="absolute bottom-8 left-12 right-12 flex justify-between font-mono text-[8px] text-white/10 uppercase tracking-[0.3em]">
                    <span>System v2.0.4 // TECHLIONS CORE</span>
                    <span>Status: Awaiting Pilot</span>
                </div>
            </div>

            {/* RIGHT: Auth Portal */}
            <div className="w-full md:w-[480px] flex flex-col justify-center p-8 md:p-16 relative bg-card/20">
                <div className="max-w-sm mx-auto w-full space-y-8">
                    <div className="space-y-2">
                        <h2 className="font-display text-4xl uppercase tracking-wider">{tab === 'signin' ? 'AUTHORIZED ENTRY' : 'NEW PROTOCOL'}</h2>
                        <p className="text-muted text-[10px] uppercase font-mono tracking-widest">Awaiting Credentials...</p>
                    </div>

                    <div className="flex gap-1 bg-white/5 p-1">
                        <button
                            onClick={() => setTab('signin')}
                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'signin' ? 'bg-orange text-black' : 'text-muted hover:text-text'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setTab('signup')}
                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'signup' ? 'bg-orange text-black' : 'text-muted hover:text-text'}`}
                        >
                            Request Access
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={tab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={tab === 'signin' ? handleSignIn : handleSignUp}
                            className="space-y-4"
                        >
                            {tab === 'signup' && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2"><User size={10} /> Pilot Designation</label>
                                    <input
                                        required
                                        placeholder="Full Name"
                                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-orange/50 outline-none transition-all placeholder:text-muted/30"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2"><AtSign size={10} /> Communication Link</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="email@rage.os"
                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-orange/50 outline-none transition-all placeholder:text-muted/30"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2"><Key size={10} /> Encryption Key</label>
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-orange/50 outline-none transition-all placeholder:text-muted/30"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            {tab === 'signup' && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={10} /> Confirm Encryption</label>
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-orange/50 outline-none transition-all placeholder:text-muted/30"
                                        value={confirmPass}
                                        onChange={e => setConfirmPass(e.target.value)}
                                    />
                                </div>
                            )}

                            {err && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-3 p-3 bg-red/10 border border-red/20 text-red text-[10px] uppercase font-bold tracking-widest"
                                >
                                    <Info size={14} /> {err}
                                </motion.div>
                            )}

                            <Btn
                                full
                                size="lg"
                                type="submit"
                                disabled={loading}
                                className="h-14 mt-4"
                            >
                                {loading ? 'Processing...' : tab === 'signin' ? 'Verify Entry' : 'Register Operator'}
                            </Btn>
                        </motion.form>
                    </AnimatePresence>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest"><span className="bg-background px-4 text-muted/40">External Auth Channels</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleGoogle}
                            className="flex items-center justify-center gap-3 border border-white/10 py-3 text-[10px] font-bold uppercase tracking-widest hover:border-orange/50 hover:bg-orange/5 transition-all text-muted hover:text-text"
                        >
                            <Chrome size={14} className="text-orange/60" /> Google
                        </button>
                        <button
                            onClick={() => setErr('Enterprise link offline')}
                            className="flex items-center justify-center gap-3 border border-white/10 py-3 text-[10px] font-bold uppercase tracking-widest hover:border-blue-400/50 hover:bg-blue-400/5 transition-all text-muted hover:text-text"
                        >
                            <Box size={14} className="text-blue-400/60" /> Microsoft
                        </button>
                    </div>

                    <div className="text-center pt-8">
                        <button
                            onClick={() => setShowForgot(!showForgot)}
                            className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted/40 hover:text-orange transition-colors"
                        >
                            Lost access protocol?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
