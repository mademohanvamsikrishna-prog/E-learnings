import { useEffect, useRef, useState } from 'react'

export function TextReveal({
  text = '',
  className = '',
  letterSpacing = 'normal',
  tag: Tag = 'h2',
  delay = 0,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (containerRef.current) observer.unobserve(containerRef.current)
        }
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <Tag ref={containerRef} className={`inline-flex flex-wrap gap-x-2 overflow-hidden ${className}`}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block overflow-hidden py-1">
          <span
            className="inline-block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              transitionDelay: `${delay + wordIdx * 60}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  )
}

export default TextReveal
