import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from './context/AuthContext'

// Lazy load all pages for elite performance
const Landing = lazy(() => import('./pages/Landing'))
const Auth = lazy(() => import('./pages/Auth'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Sub-pages in dashboard
const Report = lazy(() => import('./pages/dashboard/Report'))
const Track = lazy(() => import('./pages/dashboard/Track'))
const Feed = lazy(() => import('./pages/dashboard/Feed'))
const Connect = lazy(() => import('./pages/dashboard/Connect'))
const Vault = lazy(() => import('./pages/dashboard/Vault'))
const Goals = lazy(() => import('./pages/dashboard/Goals'))
const Timetable = lazy(() => import('./pages/dashboard/Timetable'))
const AIChat = lazy(() => import('./pages/dashboard/AIChat'))
const Profile = lazy(() => import('./pages/dashboard/Profile'))

function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[99999]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <h1 className="font-display text-7xl text-orange tracking-[0.1em] glow-orange">RAGE OS</h1>
                <p className="font-mono text-[10px] text-muted tracking-widest mt-4 uppercase">Initializing Terminal... Stage 1/3</p>
                <div className="w-48 h-0.5 bg-white/5 mt-8 relative overflow-hidden">
                    <motion.div
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute inset-0 bg-orange shadow-[0_0_10px_rgba(232,93,4,1)] w-1/2"
                    />
                </div>
            </motion.div>
        </div>
    )
}

function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full h-full relative"
        >
            {children}
        </motion.div>
    )
}

/** ─── Guards ─── */
const AppGuard = () => {
    const { currentUser, userProfile, authLoading } = useAuth()
    if (authLoading) return <LoadingScreen />
    if (!currentUser) return <Navigate to="/auth" replace />
    if (!userProfile?.onboardingComplete) return <Navigate to="/onboarding" replace />
    return <Outlet />
}

const AuthGuard = () => {
    const { currentUser, userProfile, authLoading } = useAuth()
    if (authLoading) return <LoadingScreen />
    if (currentUser && userProfile?.onboardingComplete) return <Navigate to="/app" replace />
    return <Outlet />
}

const OnboardingGuard = () => {
    const { currentUser, userProfile, authLoading } = useAuth()
    if (authLoading) return <LoadingScreen />
    if (!currentUser) return <Navigate to="/auth" replace />
    if (userProfile?.onboardingComplete) return <Navigate to="/app" replace />
    return <Suspense fallback={<LoadingScreen />}><Onboarding /></Suspense>
}

export default function App() {
    const location = useLocation()
    const topPath = location.pathname.split('/')[1] || '/'

    return (
        <div className="antialiased font-body min-h-screen bg-background text-text overflow-hidden">
            <AnimatePresence mode="wait">
                <Routes location={location} key={topPath}>
                    <Route path="/" element={<PageWrapper><Suspense fallback={<LoadingScreen />}><Landing /></Suspense></PageWrapper>} />

                    <Route element={<AuthGuard />}>
                        <Route path="/auth" element={<PageWrapper><Suspense fallback={<LoadingScreen />}><Auth /></Suspense></PageWrapper>} />
                    </Route>

                    <Route path="/onboarding" element={<PageWrapper><OnboardingGuard /></PageWrapper>} />

                    <Route path="/app" element={<AppGuard />}>
                        <Route element={<Suspense fallback={<LoadingScreen />}><Dashboard /></Suspense>}>
                            <Route index element={<Suspense fallback={null}><Report /></Suspense>} />
                            <Route path="track" element={<Suspense fallback={null}><Track /></Suspense>} />
                            <Route path="feed" element={<Suspense fallback={null}><Feed /></Suspense>} />
                            <Route path="connect" element={<Suspense fallback={null}><Connect /></Suspense>} />
                            <Route path="vault" element={<Suspense fallback={null}><Vault /></Suspense>} />
                            <Route path="goals" element={<Suspense fallback={null}><Goals /></Suspense>} />
                            <Route path="timetable" element={<Suspense fallback={null}><Timetable /></Suspense>} />
                            <Route path="ai" element={<Suspense fallback={null}><AIChat /></Suspense>} />
                            <Route path="profile" element={<Suspense fallback={null}><Profile /></Suspense>} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AnimatePresence>
        </div>
    )
}
