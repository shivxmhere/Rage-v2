import React from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Cpu } from 'lucide-react'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { currentUser, authLoading } = useAuth()

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#080810] relative overflow-hidden">
                {/* Ambient background effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center gap-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <h1 className="font-display text-5xl md:text-6xl text-text tracking-[0.3em] font-bold">RAGE OS</h1>
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-12 bg-orange/20" />
                            <span className="font-mono text-[10px] text-orange uppercase tracking-[0.5em] font-bold">Initializing Nexus Link</span>
                            <div className="h-[1px] w-12 bg-orange/20" />
                        </div>
                    </motion.div>

                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="w-16 h-16 border-t-2 border-r-2 border-orange/40 rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-orange/60">
                            <Cpu size={24} className="animate-pulse" />
                        </div>
                    </div>

                    <motion.p
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="font-mono text-[9px] text-muted uppercase tracking-[0.2em]"
                    >
                        Authenticating Personnel Identity...
                    </motion.p>
                </div>

                {/* Tactical UI accents */}
                <div className="absolute bottom-10 left-10 hidden md:block border-l border-white/5 pl-4 py-2">
                    <div className="text-[8px] font-mono text-muted uppercase tracking-widest leading-relaxed">
                        Sector: Auth_Gate_V4.2<br />
                        Status: Validating_Secure_Link<br />
                        System: Stable
                    </div>
                </div>
            </div>
        )
    }

    if (!currentUser) {
        return <Navigate to="/auth" replace />
    }

    return <>{children}</>
}
