import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Send,
    Paperclip,
    Flame,
    MessageSquare,
    UserPlus,
    ShieldCheck,
    TrendingUp,
    Image as ImageIcon,
    MoreHorizontal,
    Navigation
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PTitle, Card, Btn, Ava, Tag, FileBadge, PullToRefresh, cn } from '../../components/UI'

export default function Feed() {
    const { currentUser, userProfile, userData, saveItem, updateProfile } = useAuth()
    const [text, setText] = useState('')
    const [sub, setSub] = useState(userProfile?.subjects?.[0] || 'General')
    const [files, setFiles] = useState<File[]>([])
    const [search, setSearch] = useState('')
    const fileRef = useRef<HTMLInputElement>(null)

    const feedData = userData?.feed || []
    const connections = userProfile?.connections || []

    const handlePost = async () => {
        if (!text.trim() && files.length === 0) return
        const id = Date.now()
        const payload = {
            id,
            author: userProfile?.name || 'Operator',
            username: userProfile?.username || 'user',
            uni: userProfile?.university || '',
            sub,
            text: text.trim(),
            files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
            ts: new Date().toISOString(),
            respect: 0,
            comments: []
        }
        await saveItem(currentUser.uid, 'feed', id, payload)
        setText('')
        setFiles([])
    }

    const handleRespect = async (id: number) => {
        const post = feedData.find(p => p.id === id)
        if (post) {
            await saveItem(currentUser.uid, 'feed', id, { ...post, respect: (post.respect || 0) + 1 })
        }
    }

    const handleFollow = async () => {
        if (!search.trim()) return
        const clean = search.toLowerCase().replace('@', '')
        if (clean === userProfile?.username) return

        if (!connections.includes(clean)) {
            await updateProfile(currentUser.uid, { connections: [...connections, clean] })
            setSearch('')
        }
    }

    return (
        <PullToRefresh onRefresh={async () => new Promise(res => setTimeout(res, 800))}>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                <PTitle title="INTELLIGENCE FEED" sub="Peer intelligence and operational updates." />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* MAIN COLUMN */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* COMPOSER */}
                        <Card className="p-0 border-white/5 overflow-hidden">
                            <div className="p-6 flex gap-4">
                                <Ava letter={(userProfile?.name || 'O')[0]} className="w-12 h-12 ring-2 ring-orange/20" />
                                <div className="flex-1">
                                    <textarea
                                        value={text}
                                        onChange={e => setText(e.target.value)}
                                        placeholder="Field report: Log a win, share intelligence, or request support..."
                                        className="w-full bg-transparent border-none outline-none text-sm md:text-base font-body text-text placeholder:text-muted/30 resize-none min-h-[100px] py-2"
                                    />

                                    <AnimatePresence>
                                        {files.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="flex flex-wrap gap-2 pb-4"
                                            >
                                                {files.map((f, i) => (
                                                    <FileBadge key={i} name={f.name} size={f.size} onRemove={() => setFiles(files.filter((_, idx) => idx !== i))} />
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] px-6 py-4 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <select
                                        value={sub}
                                        onChange={e => setSub(e.target.value)}
                                        className="bg-card/50 border border-white/10 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 outline-none focus:border-orange/40 transition-all rounded-none"
                                    >
                                        <option value="General">General Sector</option>
                                        {userProfile?.subjects?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                    </select>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => fileRef.current?.click()} className="p-2 text-muted hover:text-orange transition-colors"><Paperclip size={18} /></button>
                                        <button onClick={() => fileRef.current?.click()} className="p-2 text-muted hover:text-orange transition-colors"><ImageIcon size={18} /></button>
                                        <input type="file" multiple ref={fileRef} onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} className="hidden" />
                                    </div>
                                </div>

                                <Btn size="sm" className="h-10 px-6" disabled={!text.trim() && files.length === 0} onClick={handlePost}>
                                    Post Intelligence <Send size={14} className="ml-2" />
                                </Btn>
                            </div>
                        </Card>

                        {/* FEED ITEMS */}
                        <div className="space-y-4">
                            {feedData.length === 0 ? (
                                <Empty
                                    icon={<Navigation size={48} className="text-muted/20 rotate-45" />}
                                    title="SILENCE IN THE SECTOR"
                                    sub="No operational reports found. Be the first to establish a presence."
                                />
                            ) : (
                                [...feedData].reverse().map((p, i) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Card className="p-8 border-white/5 space-y-6 group hover:border-orange/20 transition-all">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-4">
                                                    <Ava letter={p.author?.[0] || 'O'} className={cn("w-10 h-10", p.username === userProfile?.username ? "ring-2 ring-orange" : "ring-1 ring-white/10")} />
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold uppercase tracking-wide group-hover:text-orange transition-colors">{p.author}</span>
                                                            <span className="text-[10px] font-mono text-muted uppercase tracking-tighter">@{p.username}</span>
                                                            <Tag className="py-0 px-2 h-4 text-[8px] bg-orange/5 text-orange border-orange/20">{p.sub}</Tag>
                                                        </div>
                                                        <div className="text-[9px] font-mono text-muted/60 uppercase tracking-widest font-bold">
                                                            {p.uni} // {new Date(p.ts).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="text-muted/20 hover:text-text transition-colors p-1"><MoreHorizontal size={18} /></button>
                                            </div>

                                            <div className="text-sm md:text-base leading-relaxed text-text/90 whitespace-pre-wrap font-body">
                                                {p.text}
                                            </div>

                                            {p.files?.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {p.files.map((f: any, idx: number) => <FileBadge key={idx} name={f.name} size={f.size} />)}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                                <button
                                                    onClick={() => handleRespect(p.id)}
                                                    className={cn(
                                                        "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                                                        p.respect > 0 ? "text-orange glow-orange" : "text-muted hover:text-orange"
                                                    )}
                                                >
                                                    <Flame size={16} fill={p.respect > 0 ? "currentColor" : "none"} strokeWidth={2} />
                                                    Respect {p.respect > 0 && <span className="font-mono text-xs">({p.respect})</span>}
                                                </button>

                                                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-text transition-all">
                                                    <MessageSquare size={16} strokeWidth={2} />
                                                    Intel {p.comments?.length > 0 && <span className="font-mono text-xs">({p.comments.length})</span>}
                                                </button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-6">
                        <Card className="p-8 border-white/5 space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Recruit Peers</h3>
                                <p className="text-[9px] font-mono text-muted uppercase tracking-tighter font-bold">Expansion Protocol Active</p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-orange transition-colors" />
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="OPERATOR_CODE"
                                        className="w-full bg-white/5 border border-white/5 py-3 pl-10 pr-4 text-[10px] font-mono uppercase tracking-widest outline-none focus:border-orange/40 transition-all placeholder:text-muted/20"
                                    />
                                </div>
                                <Btn full size="sm" onClick={handleFollow} className="h-10 text-[10px]">Establish Link <UserPlus size={14} className="ml-2" /></Btn>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between text-[9px] font-bold text-muted uppercase tracking-[0.2em]">
                                    <span>Active Links</span>
                                    <span className="text-orange">{connections.length}</span>
                                </div>

                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {connections.length === 0 ? (
                                        <p className="text-[10px] text-muted/30 italic font-mono uppercase tracking-widest">Awaiting peer synchronization...</p>
                                    ) : (
                                        connections.map((c: string) => (
                                            <div key={c} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 hover:border-orange/20 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <Ava letter={c[0]} className="w-6 h-6 text-[10px] bg-white/10" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">@{c}</span>
                                                </div>
                                                <span className="w-1 h-1 bg-green shadow-[0_0_5px_rgba(34,197,94,0.5)] rounded-full opacity-40 group-hover:opacity-100 transition-opacity"></span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </Card>

                        <div className="p-8 bg-orange/5 border border-orange/10 space-y-4 relative overflow-hidden">
                            <ShieldCheck size={40} className="absolute -bottom-4 -right-4 text-orange/10" />
                            <div className="flex items-center gap-2 text-orange">
                                <TrendingUp size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Engagement Protocols</span>
                            </div>
                            <ul className="text-[10px] text-muted space-y-3 font-medium tracking-wide">
                                <li className="flex gap-2">
                                    <span className="text-orange">01.</span> High-density value distribution is prioritized.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-orange">02.</span> Counter-productive behavior results in disconnect.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-orange">03.</span> Collective growth is the singular objective.
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </PullToRefresh>
    )
}

function AtSign({ size, className }: { size: number, className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
        </svg>
    )
}
