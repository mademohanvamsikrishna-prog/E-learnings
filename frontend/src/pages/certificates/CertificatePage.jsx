import { useState } from 'react'
import {
  Award,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Sparkles,
  QrCode,
  GraduationCap,
} from 'lucide-react'
import { mockCertificates, mockUser } from '@/data/mockData'
import { Button, Card, Badge, Modal } from '@/components'
import { Card3DTilt } from '@/components/animations'

export function CertificatePage() {
  const [selectedCertId, setSelectedCertId] = useState(mockCertificates[0].id)
  const [copySuccess, setCopySuccess] = useState(false)
  const [fullscreenModal, setFullscreenModal] = useState(false)

  const activeCert = mockCertificates.find((c) => c.id === selectedCertId) || mockCertificates[0]

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(activeCert.verificationUrl)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ─── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D5]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF7] text-[#12372A] border border-[#E8E2D5] text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-[#E89B5A]" />
            <span>Official Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12372A] tracking-tight">
            My Certificates
          </h1>
          <p className="text-[#68756D] text-xs sm:text-sm mt-1">
            Verified proof of your technical curriculum completion and project mastery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="lg" icon={CheckCircle2}>
            {mockCertificates.length} Verified Credentials
          </Badge>
        </div>
      </div>

      {/* ─── Main Layout: Certificate Canvas Preview & Certificates List ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Certificate Switcher (Left 1 Col) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#68756D] uppercase tracking-wider px-1">
            Earned Certificates ({mockCertificates.length})
          </h3>

          {mockCertificates.map((cert) => {
            const isSelected = cert.id === selectedCertId
            return (
              <div
                key={cert.id}
                onClick={() => setSelectedCertId(cert.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#2F7D62] bg-[#FFFDF7] shadow-sm ring-2 ring-[#2F7D62]/20'
                    : 'border-[#E8E2D5] bg-white hover:border-[#2F7D62] hover:bg-[#FFFDF7]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant="primary" size="sm">
                    {cert.grade}
                  </Badge>
                  <span className="text-2xs font-mono text-[#8E9C94]">{cert.issueDate}</span>
                </div>
                <h4 className="text-sm font-bold text-[#12372A] leading-snug">
                  {cert.courseTitle}
                </h4>
                <p className="text-2xs text-[#68756D] mt-1">
                  Instructor: {cert.instructor}
                </p>
                <div className="mt-3 flex items-center justify-between text-2xs text-[#2F7D62] font-semibold pt-2 border-t border-[#E8E2D5]/70">
                  <span className="font-mono text-3xs text-[#8E9C94]">{cert.credentialId}</span>
                  <span className="flex items-center gap-0.5">
                    View Document <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Certificate Display Area (Right 2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8E2D5] shadow-xs">
            <div className="text-xs text-[#68756D]">
              Credential ID: <strong className="font-mono text-[#12372A]">{activeCert.credentialId}</strong>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                icon={Share2}
              >
                {copySuccess ? 'Copied Link!' : 'Share to LinkedIn'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={Download}
                onClick={() => alert(`Downloading official PDF certificate for ${activeCert.courseTitle}`)}
              >
                Download PDF
              </Button>
            </div>
          </div>

          {/* Premium 3D Certificate Visual Document Container */}
          <Card3DTilt maxTilt={4} className="rounded-3xl">
            <div className="relative bg-[#FFFDF7] rounded-3xl border-8 border-[#EFE9DC] p-8 sm:p-12 shadow-2xl shadow-[#12372A]/10 overflow-hidden text-center text-[#17231D]">
              {/* Ornate Inner Border */}
              <div className="absolute inset-3 border-2 border-[#E8E2D5] rounded-2xl pointer-events-none" />

              {/* Corner Decorative Dots */}
              <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-[#E89B5A]" />
              <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-[#E89B5A]" />
              <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-[#E89B5A]" />
              <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-[#E89B5A]" />

              {/* Header Brand */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#12372A] text-white flex items-center justify-center shadow-md mb-3">
                  <GraduationCap className="w-8 h-8 text-[#E89B5A]" />
                </div>
                <span className="text-xs font-mono tracking-widest text-[#2F7D62] font-bold uppercase">
                  EDUSPIRE 3D ACADEMY OF TECHNOLOGY
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#12372A] font-serif tracking-tight mt-3">
                  Certificate of Completion
                </h2>
                <p className="text-xs text-[#68756D] uppercase tracking-widest mt-1">
                  This acknowledges that
                </p>
              </div>

              {/* Recipient Name */}
              <div className="relative z-10 my-6">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#12372A] font-serif border-b-2 border-[#E8E2D5] inline-block px-8 pb-2">
                  {activeCert.studentName || mockUser.name}
                </h3>
              </div>

              {/* Curriculum description */}
              <div className="relative z-10 max-w-xl mx-auto space-y-2 text-xs sm:text-sm text-[#68756D] leading-relaxed">
                <p>
                  has successfully passed all formal assessments, practical assignments, and hands-on coding challenges to master the curriculum for:
                </p>
                <h4 className="text-base sm:text-lg font-bold text-[#12372A] font-serif pt-1">
                  {activeCert.courseTitle}
                </h4>
                <p className="text-2xs text-[#2F7D62] font-semibold pt-1">
                  Graduated with Distinction: {activeCert.grade}
                </p>
              </div>

              {/* Signatures & Seal Grid */}
              <div className="relative z-10 mt-10 pt-8 border-t border-[#E8E2D5] grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
                {/* Issue Date */}
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-xs text-[#12372A]">{activeCert.issueDate}</p>
                  <p className="text-2xs text-[#8E9C94] uppercase tracking-wider mt-0.5">Date of Issue</p>
                </div>

                {/* Gold Official Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 text-amber-950 flex flex-col items-center justify-center shadow-md border-2 border-amber-200/90 font-serif">
                    <ShieldCheck className="w-6 h-6 text-amber-950" />
                    <span className="text-3xs font-extrabold uppercase tracking-tighter">VERIFIED</span>
                  </div>
                </div>

                {/* Instructor Signature */}
                <div className="text-center sm:text-right">
                  <p className="font-serif font-bold text-[#12372A] text-xs italic">
                    {activeCert.instructor}
                  </p>
                  <p className="text-2xs text-[#8E9C94] uppercase tracking-wider mt-0.5">
                    Authorized Instructor Signature
                  </p>
                </div>
              </div>

              {/* Verification Link & ID Footer */}
              <div className="relative z-10 mt-8 pt-4 border-t border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between text-2xs text-[#8E9C94] gap-2">
                <span className="font-mono">Verification: {activeCert.verificationUrl}</span>
                <span>Valid cryptographically signed document</span>
              </div>
            </div>
          </Card3DTilt>
        </div>
      </div>
    </div>
  )
}

export default CertificatePage
