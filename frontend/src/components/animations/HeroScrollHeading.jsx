import { useEffect, useState, useRef } from 'react'

export function HeroScrollHeading({ scrollProgress = 0 }) {
  // lines to render
  const lines = [
    { text: 'LEARN', serif: false, accent: false },
    { text: 'CREATE', serif: true, accent: false },
    { text: 'BECOME', serif: false, accent: true },
  ]

  // Progress from 0 (widely spaced letters) to 1 (tight, united headline)
  const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1)

  // As scroll moves:
  // letterSpacing starts at ~32px and smoothly tightens to -2px
  const letterSpacing = 28 * (1 - clampedProgress) - 2
  // scale starts slightly grander and focuses
  const scale = 1.08 - clampedProgress * 0.08
  // opacity transitions to 100% crisp focus
  const blur = Math.max(0, (1 - clampedProgress) * 2.5)

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        filter: blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none',
        transition: 'filter 0.1s linear, transform 0.1s linear',
      }}
      className="select-none text-center my-6 flex flex-col items-center justify-center font-extrabold tracking-tight"
    >
      {lines.map((line, lineIdx) => {
        const letters = line.text.split('')
        return (
          <div
            key={line.text}
            className={`flex items-center justify-center leading-[0.9] sm:leading-[0.88] ${
              line.serif ? 'font-editorial italic font-normal tracking-wide' : 'font-sans font-extrabold tracking-tight'
            }`}
          >
            {letters.map((char, charIdx) => {
              // Calculate individual subtle drift based on progress
              const offsetFactor = (charIdx - (letters.length - 1) / 2) * (1 - clampedProgress) * 22
              const yFactor = Math.sin(charIdx * 1.2 + lineIdx) * (1 - clampedProgress) * 14

              return (
                <span
                  key={charIdx}
                  style={{
                    transform: `translate3d(${offsetFactor.toFixed(1)}px, ${yFactor.toFixed(1)}px, 0)`,
                    marginRight: `${letterSpacing}px`,
                    display: 'inline-block',
                    transition: 'transform 0.08s ease-out, margin-right 0.08s ease-out',
                  }}
                  className={`text-5xl sm:text-7xl md:text-8xl lg:text-[7.25rem] transition-colors duration-300 ${
                    line.accent
                      ? 'text-[#12372A] drop-shadow-sm'
                      : line.serif
                      ? 'text-[#2F7D62]'
                      : 'text-[#12372A]'
                  }`}
                >
                  {char}
                </span>
              )
            })}
            <span
              className={`text-3xl sm:text-5xl md:text-6xl ${
                line.accent ? 'text-[#E89B5A]' : 'text-[#2F7D62]'
              }`}
            >
              .
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default HeroScrollHeading
