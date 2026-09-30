import { Search, X } from 'lucide-react'

export function SearchBar({
  value = '',
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search courses, lessons, topics...',
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(value)
    }
  }

  const sizes = {
    sm: 'py-1.5 pl-8 pr-7 text-xs',
    md: 'py-2.5 pl-9 pr-9 text-sm',
    lg: 'py-3.5 pl-11 pr-10 text-base',
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3',
    lg: 'w-5 h-5 left-3.5',
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${
          iconSizes[size] || iconSizes.md
        }`}
      >
        <Search className="w-full h-full" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-500/15 transition-all shadow-2xs ${
          sizes[size] || sizes.md
        }`}
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            onChange?.('')
            onClear?.()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
