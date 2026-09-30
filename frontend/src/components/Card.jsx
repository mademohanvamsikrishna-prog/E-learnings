export function Card({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/80 rounded-2xl shadow-xs ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', title, subtitle, action }) {
  if (title || subtitle || action) {
    return (
      <div className={`flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-4 ${className}`}>
        <div>
          {title && <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )
  }
  return <div className={`pb-4 border-b border-slate-100 mb-4 ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return <div className={`pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-4 ${className}`}>{children}</div>
}

export default Card
