import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Send,
    Paperclip,
    Brain,
    Cpu,
    Sparkles,
    Terminal,
    MessageSquare,
    AlertTriangle,
    ChevronRight,
    Maximize2,
    Trash2,
    Zap
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PTitle, Card, Btn, Input, FileBadge, Ava, cn } from '../../components/UI'

type AIChatMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
    ts: number
    files?: Array<{ name: string; size: number }>
    err?: boolean
}

export default function AIChat() {
    const { currentUser, userProfile, userData, saveItem, deleteItem } = useAuth()
    const [inp, setInp] = useState('')
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<File[]>([])

    const apiKey = import.meta.env.VITE_GROQ_API_KEY
    const fileRef = useRef<HTMLInputElement>(null)
    const chatEnd = useRef<HTMLDivElement>(null)

    const sysContext = `You are the RAGE OS AI Tutor (Neural Nexus). You are an expert academic strategist.
Student Data:
- Name: ${userProfile?.name || 'Operator'}
- Sector: ${userProfile?.course} at ${userProfile?.university}
- Domains: ${(userProfile?.subjects || []).join(', ')}
- Objective: ${userProfile?.goal}
Guidelines: Brutally efficient, first-principles focused, structured markdown output. Use tactical military-academic jargon.`

    const msgs: AIChatMessage[] = (userData?.aiChats || []).sort((a: any, b: any) => a.ts - b.ts)

    useEffect(() => {
        chatEnd.current?.scrollIntoView({ behavior: 'smooth' })
    }, [msgs, loading])

    const handleSend = async (txt = inp) => {
        if (!txt.trim() && files.length === 0) return
        if (loading) return

        const uId = Date.now().toString()
        const uMsg: AIChatMessage = {
            id: uId,
            role: 'user',
            content: txt.trim(),
            ts: Date.now(),
            files: files.map(f => ({ name: f.name, size: f.size }))
        }

        await saveItem(currentUser.uid, 'aiChats', uId, uMsg)

        const contextMsgs = [...msgs, uMsg]
        setInp('')
        setFiles([])
        setLoading(true)

        const apiMsgs = [
            { role: 'system', content: sysContext },
            ...contextMsgs.slice(-10).map(m => ({
                role: m.role,
                content: m.content + (m.files?.length ? ` [Payload: ${m.files.map(x => x.name).join(', ')}]` : '')
            }))
        ]

        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: apiMsgs,
                    temperature: 0.6,
                    max_tokens: 2000
                })
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error.message)

            const aId = (Date.now() + 1).toString()
            const aMsg: AIChatMessage = {
                id: aId,
                role: 'assistant',
                content: data.choices[0].message.content,
                ts: Date.now()
            }
            await saveItem(currentUser.uid, 'aiChats', aId, aMsg)
        } catch (e: any) {
            const eId = (Date.now() + 1).toString()
            const eMsg: AIChatMessage = {
                id: eId,
                role: 'assistant',
                content: `NEURAL NEXUS ERROR: ${e.message}. Attempting to re-establish link...`,
                ts: Date.now(),
                err: true
            }
            await saveItem(currentUser.uid, 'aiChats', eId, eMsg)
        }
        setLoading(false)
    }

    const handleClear = async () => {
        if (confirm('Neural Purge: Permanent deletion of chat history. Proceed?')) {
            for (const m of msgs) {
                await deleteItem(currentUser.uid, 'aiChats', m.id)
            }
        }
    }

    const PRESETS = [
        { label: "ELI5 Domain", icon: <Brain size={12} /> },
        { label: "Tactical Summary", icon: <Terminal size={12} /> },
        { label: "Challenge Me", icon: <Zap size={12} /> },
        { label: "Debug Payload", icon: <Cpu size={12} /> },
        { label: "Optimize Goal", icon: <Sparkles size={12} /> }
    ]

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <PTitle
                    title="NEURAL NEXUS"
                    sub="Quantum-level academic intelligence. Mission-aware response."
                    className="mb-0"
                />
                <div className="flex items-center gap-3">
                    <div className="bg-orange/5 border border-orange/20 px-4 py-2 flex items-center gap-3">
                        <Cpu size={14} className="text-orange animate-pulse" />
                        <span className="font-mono text-[9px] text-orange uppercase tracking-[0.2em] font-bold">Llama-3.3-70B Active</span>
                    </div>
                    <button onClick={handleClear} className="p-3 bg-white/5 hover:bg-red/10 border border-white/5 hover:border-red/20 text-muted/40 hover:text-red transition-all"><Trash2 size={16} /></button>
                </div>
            </div>

            <Card className="flex-1 flex flex-col p-0 border-white/5 overflow-hidden bg-card/10 backdrop-blur-sm">
                {/* CHAT VIEWPORT */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
                    {msgs.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40">
                            <div className="relative">
                                <div className="absolute inset-0 bg-orange/20 blur-2xl rounded-full" />
                                <Brain size={80} className="text-orange relative" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-display text-4xl uppercase tracking-widest text-text">Neural Link Established</h3>
                                <p className="font-mono text-[10px] text-muted uppercase tracking-[0.4em] max-w-sm mx-auto leading-loose">
                                    Awaiting operational inquiries for sector <b>{userProfile?.course?.toUpperCase()}</b>.
                                </p>
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {msgs.map((m) => (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                    "flex gap-6",
                                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className="flex-shrink-0">
                                    {m.role === 'assistant' ? (
                                        <div className="w-10 h-10 bg-orange/10 border border-orange/20 flex items-center justify-center text-orange"><Cpu size={20} /></div>
                                    ) : (
                                        <Ava letter={(userProfile?.name || 'U')[0]} className="w-10 h-10 ring-1 ring-white/10" />
                                    )}
                                </div>

                                <div className={cn(
                                    "max-w-[85%] md:max-w-[75%] space-y-2",
                                    m.role === 'user' ? "items-end" : "items-start"
                                )}>
                                    <div className={cn(
                                        "px-6 py-4 border transition-all relative group",
                                        m.role === 'user'
                                            ? "bg-white/[0.03] border-white/5 rounded-none"
                                            : m.err
                                                ? "bg-red/5 border-red/20 text-red"
                                                : "bg-orange/[0.02] border-orange/10 rounded-none shadow-[0_0_30px_rgba(232,93,4,0.03)]"
                                    )}>
                                        {m.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-3 text-[9px] font-bold text-orange uppercase tracking-widest border-b border-orange/10 pb-2">
                                                NEURAL_NEXUS_v3.3 <Sparkles size={10} />
                                            </div>
                                        )}
                                        <div className="text-sm md:text-base leading-relaxed font-body whitespace-pre-wrap selection:bg-orange selection:text-black">
                                            {m.content}
                                        </div>

                                        {m.files && m.files.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                                                {m.files.map((f, idx) => (
                                                    <FileBadge key={idx} name={f.name} size={f.size} />
                                                ))}
                                            </div>
                                        )}

                                        <div className={cn(
                                            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2",
                                            m.role === 'user' ? "right-full mr-2" : "left-full ml-2"
                                        )}>
                                            <button className="text-muted/20 hover:text-text p-1"><Maximize2 size={14} /></button>
                                        </div>
                                    </div>
                                    <div className={cn("text-[9px] font-mono text-muted/40 uppercase tracking-tighter px-2", m.role === 'user' ? "text-right" : "text-left")}>
                                        {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // {m.role.toUpperCase()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                            <div className="w-10 h-10 bg-orange/5 border border-orange/10 flex items-center justify-center text-orange animate-pulse"><Cpu size={20} /></div>
                            <div className="bg-orange/[0.01] border border-orange/5 px-6 py-4 flex gap-3 items-center">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map(x => (
                                        <motion.div
                                            key={x}
                                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: x * 0.2 }}
                                            className="w-1.5 h-1.5 bg-orange"
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] font-mono text-orange/60 uppercase tracking-widest font-bold">Nexus Processing Segment...</span>
                            </div>
                        </motion.div>
                    )}

                    <div ref={chatEnd} />
                </div>

                {/* INPUT PROTOCOL */}
                <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 space-y-6">
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {PRESETS.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(p.label)}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/5 hover:border-orange/40 hover:bg-orange/[0.02] text-muted hover:text-orange transition-all whitespace-nowrap text-[10px] uppercase font-bold tracking-widest rounded-none"
                            >
                                {p.icon} {p.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex flex-col gap-4">
                        <AnimatePresence>
                            {files.length > 0 && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="flex flex-wrap gap-2 pb-2">
                                    {files.map((f, i) => <FileBadge key={i} name={f.name} size={f.size} onRemove={() => setFiles(files.filter((_, x) => x !== i))} />)}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-end gap-3">
                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={loading}
                                className="w-14 h-14 bg-white/[0.03] border border-white/5 flex items-center justify-center text-muted hover:text-orange hover:border-orange/20 transition-all shrink-0"
                            >
                                <Paperclip size={20} />
                            </button>
                            <input type="file" multiple ref={fileRef} onChange={e => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} className="hidden" />

                            <div className="flex-1 relative">
                                <textarea
                                    value={inp}
                                    onChange={e => setInp(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                                    disabled={loading}
                                    placeholder="Input operational inquiry or payload..."
                                    className="w-full bg-white/[0.02] border border-white/5 p-4 pr-14 text-sm font-body text-text placeholder:text-muted/20 outline-none focus:border-orange/20 transition-all resize-none max-h-40 min-h-[56px] custom-scrollbar"
                                    rows={1}
                                    onInput={e => {
                                        const target = e.target as HTMLTextAreaElement
                                        target.style.height = 'auto'
                                        target.style.height = `${target.scrollHeight}px`
                                    }}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={loading || (!inp.trim() && files.length === 0)}
                                    className="absolute right-3 bottom-3 p-2 bg-orange text-black hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[8px] font-mono text-muted uppercase tracking-[0.2em]">
                                    <MessageSquare size={10} className="text-orange" /> {msgs.length} Cycles
                                </div>
                                <div className="flex items-center gap-1.5 text-[8px] font-mono text-muted uppercase tracking-[0.2em]">
                                    <Terminal size={10} className="text-orange" /> Llama-3.3-70B
                                </div>
                            </div>
                            <div className="text-[8px] font-mono text-muted/30 uppercase tracking-[0.2em]">
                                Shift + Enter for multi-line deployment
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="bg-orange/5 border border-orange/10 p-4 flex items-start gap-4 mx-4 md:mx-0">
                <AlertTriangle size={18} className="text-orange shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted leading-relaxed font-medium">
                    <span className="text-orange font-bold uppercase tracking-widest italic">Nexus Protocol:</span> AI responses are generated via quantum-probabilistic models. Verify mission-critical data independently. Neural Nexus is not liable for structural academic failure.
                </p>
            </div>
        </div>
    )
}
