'use client'

import { clsx } from 'clsx'

interface KetoScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function KetoScore({ 
  score, 
  size = 'md', 
  showLabel = true,
  className 
}: KetoScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '우수'
    if (score >= 60) return '보통'
    return '부족'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-lg px-4 py-2'
  }

  return (
    <div className={clsx(
      'inline-flex items-center space-x-2 rounded-full border font-medium',
      getScoreColor(score),
      sizeClasses[size],
      className
    )}>
      <span className="font-bold">{score}</span>
      {showLabel && (
        <>
          <span>/</span>
          <span>{getScoreLabel(score)}</span>
        </>
      )}
    </div>
  )
}
