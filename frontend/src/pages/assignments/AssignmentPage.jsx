import { useState } from 'react'
import {
  FileText, UploadCloud, CheckCircle2, Clock, Download,
  Award, Calendar, FileCheck, Send, Trash2, X,
} from 'lucide-react'
import { mockAssignments } from '@/data/mockData'

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    Submitted:   { cls: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',  dot: 'bg-indigo-400' },
    Graded:      { cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25', dot: 'bg-emerald-400' },
    'In Progress':{ cls: 'bg-amber-500/15 text-amber-300 border-amber-500/25',   dot: 'bg-amber-400' },
    Late:        { cls: 'bg-red-500/15 text-red-300 border-red-500/25',           dot: 'bg-red-400' },
  }
  const s = map[status] || { cls: 'bg-white/8 text-white/30 border-white/10', dot: 'bg-white/30' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status === 'Graded' ? 'Graded (96/100)' : status}
    </span>
  )
}

// ─── Feedback Modal ───────────────────────────────────────────────────────────
function FeedbackModal({ asg, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] p-6 space-y-4 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Instructor Feedback</h3>
            <p className="text-xs text-white/40 mt-0.5">{asg.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/8 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-400 font-semibold">Final Grade</p>
            <div className="text-3xl font-extrabold text-white mt-0.5">{asg.grade}<span className="text-lg text-white/30">/{asg.points}</span></div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Award className="w-7 h-7 text-emerald-400" />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-2">Notes from {asg.feedback?.instructor}</p>
          <p className="text-sm text-white/60 bg-white/4 p-4 rounded-xl border border-white/6 leading-relaxed italic">
            "{asg.feedback?.comments}"
          </p>
        </div>
      </div>
    </div>
  )
}

export function AssignmentPage() {
  const [selectedAsgId, setSelectedAsgId]   = useState(mockAssignments[0].id)
  const [selectedFile, setSelectedFile]     = useState(null)
  const [isUploading, setIsUploading]       = useState(false)
  const [uploadSuccess, setUploadSuccess]   = useState(false)
  const [feedbackOpen, setFeedbackOpen]     = useState(false)

  const active = mockAssignments.find((a) => a.id === selectedAsgId) || mockAssignments[0]

  const handleFileChange = (e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]) }

  const handleUploadSubmit = () => {
    if (!selectedFile) return
    setIsUploading(true)
    setTimeout(() => { setIsUploading(false); setUploadSuccess(true) }, 800)
  }

  const submitted = active.status === 'Submitted' || uploadSuccess

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="pb-5 border-b border-white/6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5" /> Project Submissions
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Assignments</h1>
        <p className="text-white/40 text-xs mt-1">Review requirements, download boilerplates, and submit solutions.</p>
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* Left: Assignment list */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 px-1">
            All Assignments ({mockAssignments.length})
          </p>
          {mockAssignments.map((asg) => {
            const isSelected = asg.id === selectedAsgId
            return (
              <div
                key={asg.id}
                onClick={() => { setSelectedAsgId(asg.id); setSelectedFile(null); setUploadSuccess(false) }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-purple-500/40 bg-purple-500/8 shadow-[0_0_20px_rgba(124,58,237,0.1)]'
                    : 'border-white/6 bg-white/3 hover:border-white/12 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] text-white/30 truncate max-w-[130px]">{asg.courseTitle}</span>
                  <StatusPill status={asg.status} />
                </div>
                <h4 className="text-xs font-bold text-white/80 line-clamp-2">{asg.title}</h4>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/6 text-[10px] text-white/30">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{asg.dueDate.split('•')[0]}</span>
                  <span className="font-bold text-white/50">{asg.points} pts</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: Detail workspace */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6 space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-white/6">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">{active.courseTitle}</span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">{active.title}</h2>
                <p className="text-xs text-white/40 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-white/25" />
                  Due: <strong className="text-white/60">{active.dueDate}</strong>
                </p>
              </div>
              <StatusPill status={active.status} />
            </div>

            {/* Instructions */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-2">Instructions</p>
              <div className="p-4 bg-white/3 rounded-xl border border-white/6 text-xs text-white/60 leading-relaxed whitespace-pre-line font-mono">
                {active.instructions}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-3">Starter Files & Rubric</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'starter-template.zip', meta: 'Project Skeleton · 3.2 MB', icon: Download, color: 'indigo', action: 'Download' },
                  { name: 'grading-rubric.pdf',   meta: 'PDF Guide · 450 KB',        icon: FileCheck, color: 'purple', action: 'View' },
                ].map((f) => {
                  const Icon = f.icon
                  return (
                    <div key={f.name} className="p-3 rounded-xl border border-white/6 bg-white/3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 truncate">
                        <div className={`w-8 h-8 rounded-lg bg-${f.color}-500/15 border border-${f.color}-500/20 flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 text-${f.color}-400`} />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-white/70 truncate">{f.name}</p>
                          <p className="text-[10px] text-white/25">{f.meta}</p>
                        </div>
                      </div>
                      <button className="text-[11px] font-bold text-purple-400 border border-purple-500/20 bg-purple-500/8 px-2.5 py-1.5 rounded-lg hover:bg-purple-500/20 transition-colors cursor-pointer">
                        {f.action}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upload / Submitted state */}
            {submitted ? (
              <div className="p-5 bg-indigo-500/8 border border-indigo-500/20 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Submission Uploaded</h4>
                      <p className="text-[10px] text-white/35">Submitted on {active.submittedDate || 'Today at 4:32 PM'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-1 rounded-full">
                    {uploadSuccess ? 'Just Submitted' : 'Awaiting Grade'}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-indigo-500/15 bg-white/3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-white/70">{selectedFile?.name || active.submittedFile || 'assignment-v1.zip'}</span>
                    <span className="text-white/25 text-[10px]">({active.fileSize || '4.8 MB'})</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400">✓ Scanned</span>
                </div>
                {active.feedback && (
                  <div className="pt-3 border-t border-indigo-500/15 flex items-center justify-between">
                    <span className="text-xs text-white/40">Instructor feedback available</span>
                    <button
                      onClick={() => setFeedbackOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" /> View Feedback ({active.grade}/100)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/25">Upload Solution</p>
                <label htmlFor="assignment-file" className="block border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/40 hover:bg-purple-500/3 transition-all cursor-pointer">
                  <input
                    id="assignment-file" type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".zip,.tar.gz,.pdf,.java,.py"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-sm font-semibold text-white/70">
                    {selectedFile
                      ? <span className="text-purple-400 font-bold">{selectedFile.name}</span>
                      : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-[10px] text-white/25 mt-1">ZIP, TAR.GZ, PDF (Max 25MB)</p>
                </label>

                {selectedFile && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/8">
                    <span className="text-xs text-white/60 truncate">{selectedFile.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedFile(null)} className="p-1.5 text-white/25 hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleUploadSubmit}
                        disabled={isUploading}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 disabled:opacity-60 transition-all cursor-pointer"
                      >
                        {isUploading
                          ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Uploading…</>
                          : <><Send className="w-3.5 h-3.5" /> Submit Assignment</>
                        }
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {feedbackOpen && <FeedbackModal asg={active} onClose={() => setFeedbackOpen(false)} />}
    </div>
  )
}

export default AssignmentPage
