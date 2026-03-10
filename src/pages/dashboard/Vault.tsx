import React, { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Search,
    Filter,
    FileText,
    File as FileIcon,
    Tag as TagIcon,
    Trash2,
    Clock,
    ChevronDown,
    UploadCloud,
    X,
    Database
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PTitle, Card, Btn, Input, Textarea, Select, Tag, Empty, FileBadge, cn } from '../../components/UI'

type VaultItem = {
    id: number
    type: 'Note' | 'File'
    title: string
    sub: string
    content?: string
    tags: string[]
    files: Array<{ name: string; size: number; type: string }>
    ts: string
}

export default function Vault() {
    const { currentUser, userProfile, userData, saveItem, deleteItem } = useAuth()

    const [filter, setFilter] = useState<'All' | 'Note' | 'File'>('All')
    const [search, setSearch] = useState('')
    const [showAdd, setShowAdd] = useState(false)

    // Entry State
    const [type, setType] = useState<'Note' | 'File'>('Note')
    const [title, setTitle] = useState('')
    const [sub, setSub] = useState(userProfile?.subjects?.[0] || 'General')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const fileRef = useRef<HTMLInputElement>(null)

    const vaultData: VaultItem[] = userData?.vault || []

    const handleSave = async () => {
        if (!title.trim() || (type === 'Note' && !content.trim()) || (type === 'File' && files.length === 0)) return

        const id = Date.now()
        const item: VaultItem = {
            id,
            type,
            title: title.trim(),
            sub,
            content: type === 'Note' ? content.trim() : '',
            tags,
            files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
            ts: new Date().toISOString()
        }

        await saveItem(currentUser.uid, 'vault', id, item)
        handleReset()
    }

    const handleReset = () => {
        setShowAdd(false)
        setTitle('')
        setContent('')
        setTags([])
        setFiles([])
        setTagInput('')
        setType('Note')
    }

    const handleDelete = async (id: number) => {
        if (confirm('Declassification Protocol: Permanent deletion. Proceed?')) {
            await deleteItem(currentUser.uid, 'vault', id)
        }
    }

    const filteredList = useMemo(() => {
        return vaultData.filter(item => {
            const matchFilter = filter === 'All' || item.type === filter
            const matchSearch = !search ||
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.sub.toLowerCase().includes(search.toLowerCase()) ||
                item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
            return matchFilter && matchSearch
        }).sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    }, [vaultData, filter, search])

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <PTitle
                    title="TACTICAL VAULT"
                    sub="Secure repository for mission-critical knowledge."
                    className="mb-0"
                />
                <Btn onClick={() => setShowAdd(true)} className="h-12 px-8">
                    <Plus size={18} className="mr-2" /> Initial Archive
                </Btn>
            </div>

            {/* ADD ENTRY MODAL */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm"
                    >
                        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-orange/20 shadow-[0_0_50px_rgba(232,93,4,0.1)] custom-scrollbar">
                            <div className="p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h2 className="font-display text-3xl uppercase tracking-wider text-orange">Classify New Intel</h2>
                                        <p className="font-mono text-[9px] text-muted uppercase tracking-[0.4em]">Protocol ARC-01-VAULT</p>
                                    </div>
                                    <button onClick={handleReset} className="p-2 text-muted hover:text-red transition-colors"><X size={20} /></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="flex gap-1 p-1 bg-white/5">
                                            <button onClick={() => setType('Note')} className={cn("flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all", type === 'Note' ? "bg-orange text-black" : "text-muted hover:text-text")}>Electronic Note</button>
                                            <button onClick={() => setType('File')} className={cn("flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all", type === 'File' ? "bg-orange text-black" : "text-muted hover:text-text")}>File Payload</button>
                                        </div>

                                        <Input label="Intelligence Title" placeholder="e.g. Q3 Strategic Analysis" value={title} onChange={e => setTitle(e.target.value)} />

                                        {type === 'Note' ? (
                                            <Textarea
                                                label="Content Data"
                                                placeholder="Input tactical knowledge here (Markdown compatible)..."
                                                className="min-h-[240px]"
                                                value={content}
                                                onChange={(e: any) => setContent(e.target.value)}
                                            />
                                        ) : (
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Payload Uplink</label>
                                                <div
                                                    onClick={() => fileRef.current?.click()}
                                                    className="w-full h-48 border-2 border-dashed border-white/5 bg-white/[0.02] hover:border-orange/40 hover:bg-orange/[0.02] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
                                                >
                                                    <UploadCloud size={48} className="text-muted group-hover:text-orange transition-colors" />
                                                    <div className="text-center">
                                                        <div className="text-[10px] font-bold uppercase tracking-widest">Deploy Files</div>
                                                        <p className="text-[9px] text-muted mt-1 uppercase font-mono">Max Payload: 25MB per chunk</p>
                                                    </div>
                                                </div>
                                                <input type="file" multiple ref={fileRef} className="hidden" onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} />
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {files.map((f, i) => (
                                                        <FileBadge key={i} name={f.name} size={f.size} onRemove={() => setFiles(files.filter((_, x) => x !== i))} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        <Select label="Sector (Subject)" value={sub} onChange={(e: any) => setSub(e.target.value)}>
                                            <option value="General">General Cluster</option>
                                            {userProfile?.subjects?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                        </Select>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center justify-between">
                                                MetaData Tags
                                                <span className="font-mono text-[8px] opacity-50 uppercase">Press Enter</span>
                                            </label>
                                            <div className="relative">
                                                <TagIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                                <input
                                                    value={tagInput}
                                                    onChange={e => setTagInput(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter' && tagInput.trim()) {
                                                            if (!tags.includes(tagInput.toLowerCase().trim())) {
                                                                setTags([...tags, tagInput.toLowerCase().trim()])
                                                            }
                                                            setTagInput('')
                                                        }
                                                    }}
                                                    placeholder="CLASSIFY BY TAG..."
                                                    className="w-full bg-white/5 border border-white/5 py-3 pl-10 pr-4 text-[10px] font-mono uppercase tracking-widest outline-none focus:border-orange/40 transition-all"
                                                />
                                            </div>
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {tags.map(t => (
                                                    <Tag key={t} onRemove={() => setTags(tags.filter(x => x !== t))}>{t}</Tag>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-12 space-y-3">
                                            <Btn full size="lg" className="h-14 text-lg" onClick={handleSave}>Archive Data Payload</Btn>
                                            <Btn full variant="ghost" className="h-14 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100" onClick={handleReset}>Abort Protocol</Btn>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOOLBAR */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 border-y border-white/5">
                <div className="flex bg-white/5 p-1 rounded-none">
                    {['All', 'Note', 'File'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-none",
                                filter === f ? "bg-orange text-black" : "text-muted hover:text-text"
                            )}
                        >
                            {f}s
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-[320px]">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="SEARCH VAULT MATRIX..."
                        className="w-full bg-white/5 border border-white/5 py-3 pl-12 pr-4 text-[10px] font-mono uppercase tracking-widest outline-none focus:border-orange/20 transition-all"
                    />
                </div>
            </div>

            {/* GRID */}
            {filteredList.length === 0 ? (
                <Empty
                    icon={<Database size={48} className="text-muted/20" />}
                    title={search ? "NO ALIGNING INTEL" : "VAULT EMPTY"}
                    sub={search ? "Adjust your search parameters for better results." : "Your tactical repository is clean. Start archiving mission data."}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredList.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="p-0 border-white/5 flex flex-col h-full group hover:border-orange/30 transition-all">
                                    <div className="p-6 space-y-4 flex-1">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("p-2 rounded-none border border-white/10", item.type === 'Note' ? "text-green-400" : "text-blue-400")}>
                                                    {item.type === 'Note' ? <FileText size={16} /> : <FileIcon size={16} />}
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">{item.sub}</span>
                                            </div>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-muted/20 hover:text-red transition-colors"><Trash2 size={16} /></button>
                                        </div>

                                        <h3 className="font-display text-2xl uppercase tracking-wide group-hover:text-orange transition-colors">{item.title}</h3>

                                        {item.type === 'Note' ? (
                                            <p className="text-xs text-muted leading-relaxed line-clamp-4 font-body">{item.content}</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {item.files?.map((f, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/5 text-[9px] font-mono uppercase tracking-tighter">
                                                        <span className="flex items-center gap-2 max-w-[140px] truncate"><FileIcon size={10} className="shrink-0" /> {f.name}</span>
                                                        <span className="text-muted opacity-50">{(f.size / 1024).toFixed(0)}KB</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-6 py-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {item.tags.slice(0, 2).map(t => (
                                                <span key={t} className="text-[8px] font-bold text-orange/40 uppercase tracking-widest">#{t}</span>
                                            ))}
                                            {item.tags.length > 2 && <span className="text-[8px] font-bold text-muted uppercase">+{item.tags.length - 2}</span>}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted/40 uppercase">
                                            <Clock size={10} />
                                            {new Date(item.ts).toLocaleDateString()}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
