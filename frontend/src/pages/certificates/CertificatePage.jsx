import { useState } from 'react'
import {
  Award, Download, Share2, ExternalLink, CheckCircle2,
  ShieldCheck, Sparkles, GraduationCap, Copy, Check,
} from 'lucide-react'
import { mockCertificates, mockUser } from '@/data/mockData'

export function CertificatePage() {
  const [selectedCertId, setSelectedCertId] = useState(mockCertificates[0].id)
  const [copySuccess,    setCopySuccess]    = useState(false)

  const cert = mockCertificates.find((c) => c.id === selectedCertId) || mockCertificates[0]

  const handleCopy = () => {
    navigator.clipboard?.writeText(cert.verificationUrl)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" /> Official Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Certificates</h1>
          <p className="text-white/40 text-xs mt-1">Verified proof of your technical curriculum completion.</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-bold text-emerald-300">{mockCertificates.length} Verified Credentials</span>
        </div>
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left: cert switcher */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 px-1">
            Earned ({mockCertificates.length})
          </p>
          {mockCertificates.map((c) => {
            const isSelected = c.id === selectedCertId
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCertId(c.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-amber-500/40 bg-amber-500/8 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    : 'border-white/6 bg-white/3 hover:border-white/12 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isSelected
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                      : 'bg-white/6 text-white/40 border-white/10'
                  }`}>
                    {c.grade}
                  </span>
                  <span className="text-[10px] text-white/25 font-mono">{c.issueDate}</span>
                </div>
                <h4 className="text-sm font-bold text-white/80 leading-snug">{c.courseTitle}</h4>
                <p className="text-[10px] text-white/30 mt-1">by {c.instructor}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-purple-400 font-semibold pt-2 border-t border-white/6">
                  <span className="font-mono text-white/20 text-[9px]">{c.credentialId}</span>
                  <span className="flex items-center gap-0.5">View <ExternalLink className="w-3 h-3 ml-0.5" /></span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: certificate display */}
        <div className="lg:col-span-2 space-y-4">

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-white/8 bg-white/4">
            <div className="text-xs text-white/35">
              Credential ID: <strong className="font-mono text-white/60">{cert.credentialId}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/8 bg-white/5 text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                {copySuccess ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Share to LinkedIn</>}
              </button>
              <button
                onClick={() => alert(`Downloading ${cert.courseTitle} PDF`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-[0_4px_16px_rgba(124,58,237,0.3)]"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          </div>

          {/* Certificate document — parchment on dark */}
          <div className="relative">
            {/* Outer dark glow ring */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-amber-500/20 via-purple-500/10 to-indigo-500/20 blur-lg" />

            <div className="relative rounded-3xl overflow-hidden border-4 border-amber-500/20 bg-[#0e0c09] shadow-2xl">
              {/* Parchment gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-purple-900/10" />

              {/* Inner ornate border */}
              <div className="absolute inset-4 border border-amber-500/10 rounded-2xl pointer-events-none" />

              {/* Corner ornaments */}
              {[['top-5 left-5', 'border-t-2 border-l-2'], ['top-5 right-5', 'border-t-2 border-r-2'],
                ['bottom-5 left-5', 'border-b-2 border-l-2'], ['bottom-5 right-5', 'border-b-2 border-r-2']].map(([pos, border], i) => (
                <div key={i} className={`absolute ${pos} w-5 h-5 ${border} border-amber-500/30`} />
              ))}

              {/* Content */}
              <div className="relative z-10 p-8 sm:p-12 text-center">

                {/* Brand */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/20 border border-amber-500/30 flex items-center justify-center shadow-lg mb-3">
                    <GraduationCap className="w-8 h-8 text-amber-400" />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.25em] text-amber-400/70 uppercase">
                    EduSpire PRO · Academy of Technology
                  </span>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    Certificate of Completion
                  </h2>
                  <p className="text-xs text-white/30 uppercase tracking-widest mt-2">This certifies that</p>
                </div>

                {/* Recipient */}
                <div className="my-6">
                  <div className="inline-block border-b-2 border-amber-500/30 px-8 pb-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300" style={{ fontFamily: 'Georgia, serif' }}>
                      {cert.studentName || mockUser?.name || 'Alex Johnson'}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="max-w-lg mx-auto space-y-2 text-sm text-white/40 leading-relaxed mb-6">
                  <p>has successfully completed all assessments, projects, and challenges for:</p>
                  <h4 className="text-base sm:text-lg font-bold text-white/80" style={{ fontFamily: 'Georgia, serif' }}>
                    {cert.courseTitle}
                  </h4>
                  <p className="text-[11px] text-emerald-400 font-semibold">Graduated with Distinction · {cert.grade}</p>
                </div>

                {/* Footer row */}
                <div className="mt-8 pt-6 border-t border-white/6 grid grid-cols-3 items-center gap-6">
                  <div className="text-left">
                    <p className="text-xs font-bold text-white/60">{cert.issueDate}</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-wider mt-0.5">Date of Issue</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-xl border-2 border-amber-400/40"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                      <ShieldCheck className="w-6 h-6 text-amber-950" />
                      <span className="text-[8px] font-black text-amber-950 uppercase tracking-tighter">VERIFIED</span>
                    </div>
                    <span className="text-[9px] text-white/20 mt-1.5">Official Seal</span>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-white/60 italic" style={{ fontFamily: 'Georgia, serif' }}>
                      {cert.instructor}
                    </p>
                    <p className="text-[9px] text-white/20 uppercase tracking-wider mt-0.5">Instructor Signature</p>
                  </div>
                </div>

                {/* Verification URL */}
                <div className="mt-6 pt-4 border-t border-white/4 flex flex-col sm:flex-row items-center justify-between text-[9px] text-white/20 gap-2">
                  <span className="font-mono">{cert.verificationUrl}</span>
                  <span>Cryptographically signed · Tamper-proof</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificatePage
