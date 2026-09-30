import { useState } from 'react'

const sizes = {
  xs: 'w-6 h-6 text-2xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
}

export function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  isOnline,
  className = '',
}) {
  const [hasError, setHasError] = useState(false)
  const sizeClass = sizes[size] || sizes.md

  const getInitials = (n) => {
    if (!n) return '?'
    const parts = n.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || name}
          onError={() => setHasError(true)}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-white border border-slate-200/80`}
        />
      ) : (
        <div
          className={`${sizeClass} rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center ring-2 ring-white select-none`}
        >
          {getInitials(name)}
        </div>
      )}

      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        />
      )}
    </div>
  )
}

export default Avatar
