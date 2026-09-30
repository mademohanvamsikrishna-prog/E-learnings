export default function AdminDashboard() {
  return (
    <div className="page-container">
      <h1 className="section-title">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {['Total Users', 'Active Courses', 'Enrollments', 'Revenue'].map(label => (
          <div key={label} className="card text-center">
            <p className="text-3xl font-bold text-red-400 mb-1">—</p>
            <p className="text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-2">Platform Management</h2>
        <p className="text-slate-400 text-sm">User management, course moderation, and analytics coming soon.</p>
      </div>
    </div>
  )
}
