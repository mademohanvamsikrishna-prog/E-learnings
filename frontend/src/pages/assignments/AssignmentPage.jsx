import { useState } from 'react'
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Award,
  Check,
  Calendar,
  FileCheck,
  Send,
  Trash2,
} from 'lucide-react'
import { mockAssignments } from '@/data/mockData'
import { Button, Card, Badge, Modal } from '@/components'

export function AssignmentPage() {
  const [selectedAsgId, setSelectedAsgId] = useState(mockAssignments[0].id)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

  const activeAssignment = mockAssignments.find((a) => a.id === selectedAsgId) || mockAssignments[0]

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUploadSubmit = () => {
    if (!selectedFile) return
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setUploadSuccess(true)
    }, 800)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return <Badge variant="primary" size="sm" withDot>Submitted</Badge>
      case 'Graded':
        return <Badge variant="success" size="sm" withDot>Graded (96/100)</Badge>
      case 'In Progress':
        return <Badge variant="warning" size="sm" withDot>In Progress</Badge>
      case 'Late':
        return <Badge variant="danger" size="sm" withDot>Late</Badge>
      default:
        return <Badge variant="neutral" size="sm">Not Started</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ─── Header ─────────────────────────────────────────────────────────────── */}
      <div className="pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Hands-on Project Submissions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Assignments
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Review requirements, download project boilerplates, and submit solutions for evaluation.
        </p>
      </div>

      {/* ─── Main Grid: Assignments List (Left) + Detail Workspace (Right) ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Assignment Switcher List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            All Assignments ({mockAssignments.length})
          </h3>

          {mockAssignments.map((asg) => {
            const isSelected = asg.id === selectedAsgId
            return (
              <div
                key={asg.id}
                onClick={() => {
                  setSelectedAsgId(asg.id)
                  setSelectedFile(null)
                  setUploadSuccess(false)
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-indigo-600 bg-white shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-2xs font-semibold text-slate-400 truncate max-w-[140px]">
                    {asg.courseTitle}
                  </span>
                  {getStatusBadge(asg.status)}
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                  {asg.title}
                </h4>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-2xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {asg.dueDate.split('•')[0]}
                  </span>
                  <span className="font-semibold text-slate-700">{asg.points} pts</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right 2 Columns: Detailed Assignment Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-2xs font-semibold text-indigo-600 uppercase tracking-wider block">
                  {activeAssignment.courseTitle}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  {activeAssignment.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Due Date: <strong className="text-slate-700">{activeAssignment.dueDate}</strong>
                </p>
              </div>

              <div>{getStatusBadge(activeAssignment.status)}</div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Assignment Instructions
              </h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                {activeAssignment.instructions}
              </div>
            </div>

            {/* Attachments / Starter Files */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Starter Attachments & Rubric
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 truncate">starter-template.zip</p>
                      <p className="text-2xs text-slate-400">Project Skeleton • 3.2 MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Download
                  </Button>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 truncate">grading-rubric.pdf</p>
                      <p className="text-2xs text-slate-400">PDF Guide • 450 KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Submission State vs File Uploader */}
            {activeAssignment.status === 'Submitted' || uploadSuccess ? (
              <div className="p-5 bg-indigo-50/60 border border-indigo-200/80 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Your Submission is Uploaded</h4>
                      <p className="text-2xs text-slate-500">
                        Submitted on {activeAssignment.submittedDate || 'Today at 4:32 PM'}
                      </p>
                    </div>
                  </div>

                  <Badge variant="primary" size="sm">
                    {uploadSuccess ? 'Just Submitted' : 'Awaiting Grade'}
                  </Badge>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-900">
                      {selectedFile?.name || activeAssignment.submittedFile || 'assignment-v1.zip'}
                    </span>
                    <span className="text-slate-400 text-2xs">
                      ({activeAssignment.fileSize || '4.8 MB'})
                    </span>
                  </div>

                  <span className="text-2xs font-semibold text-emerald-600">✓ Virus Scanned</span>
                </div>

                {activeAssignment.feedback && (
                  <div className="pt-3 border-t border-indigo-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">
                      Instructor grade and feedback available
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setFeedbackModalOpen(true)}
                      icon={Award}
                    >
                      View Feedback ({activeAssignment.grade}/100)
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Drag-and-drop file upload zone */
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Upload Your Assignment Solution
                </h4>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-500 transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    id="assignment-file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".zip,.tar.gz,.pdf,.java,.py"
                  />
                  <label htmlFor="assignment-file" className="cursor-pointer block space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                      {selectedFile ? (
                        <span className="text-indigo-600 font-bold">{selectedFile.name}</span>
                      ) : (
                        <>Click to upload or drag and drop your project archive</>
                      )}
                    </p>
                    <p className="text-2xs text-slate-400">
                      ZIP, TAR.GZ, PDF, or code files (Max 25MB)
                    </p>
                  </label>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-xs text-slate-700 truncate">{selectedFile.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={handleUploadSubmit}
                        isLoading={isUploading}
                        icon={Send}
                      >
                        Submit Assignment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Instructor Feedback Modal */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title="Instructor Feedback & Grade"
        subtitle={activeAssignment.title}
      >
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-800 font-medium">Final Grade</p>
              <h3 className="text-2xl font-extrabold text-emerald-900">
                {activeAssignment.grade} / {activeAssignment.points} (A+)
              </h3>
            </div>
            <Award className="w-10 h-10 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Instructor Notes from {activeAssignment.feedback?.instructor}:
            </p>
            <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed italic">
              "{activeAssignment.feedback?.comments}"
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AssignmentPage
