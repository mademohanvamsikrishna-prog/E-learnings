import { Link } from 'react-router-dom'
import { Award, ShieldCheck, Share2, Download, CheckCircle2, ArrowRight } from 'lucide-react'

export function CertificateSection() {
  return (
    <section id="certificates" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-[#5624d0] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Verifiable Qualifications</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight leading-tight">
              Earn Industry-Recognized Certificates
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Showcase your technical competence to recruiters and hiring managers. Every completed track provides a tamper-proof digital certificate with cryptographic verification.
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>One-click credential export to LinkedIn profile</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unique verification hash ID valid for employer background checks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>High-resolution vector PDF ready for portfolios</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link to="/register">
                <button className="btn-primary px-6 py-3 text-sm font-bold">
                  <span>Start Your Certificate Track</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Certificate Visual Document (7 Cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-xl bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xl">
              {/* Inner Diploma Canvas */}
              <div className="relative bg-white rounded-xl border-4 border-slate-100 p-6 sm:p-10 shadow-sm text-center">
                {/* Gold Inner Line Border */}
                <div className="absolute inset-2 border border-purple-200 rounded-lg pointer-events-none" />

                {/* Header */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#5624d0] text-white flex items-center justify-center shadow-xs mb-2">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xs font-mono font-bold tracking-widest text-[#5624d0] uppercase">
                    EDUSPIRE TECHNOLOGY ACADEMY
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Certificate of Completion
                  </h3>
                  <p className="text-3xs text-slate-400 uppercase tracking-widest mt-0.5">
                    This certifies that
                  </p>
                </div>

                {/* Recipient */}
                <div className="my-4">
                  <h4 className="text-xl sm:text-2xl font-bold text-[#5624d0] border-b border-purple-200 inline-block px-6 pb-1">
                    Alex Johnson
                  </h4>
                </div>

                {/* Course Name */}
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  has successfully completed all lectures, coding assessments, and capstone requirements for
                </p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  Mastering Java & Object-Oriented Architecture
                </p>

                {/* Footer Signatures & Seal */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
                  <div className="text-left">
                    <p className="font-semibold text-slate-800">Dr. Sarah Connor</p>
                    <p className="text-3xs text-slate-400">Lead Instructor</p>
                  </div>

                  {/* Gold Seal Badge */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 text-amber-950 flex flex-col items-center justify-center shadow-xs border border-amber-200 font-bold">
                    <ShieldCheck className="w-4 h-4 text-amber-950" />
                    <span className="text-4xs tracking-tighter uppercase font-extrabold">VERIFIED</span>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-slate-800 font-bold">EDS-2026-9482</p>
                    <p className="text-3xs text-slate-400">Credential ID</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CertificateSection
