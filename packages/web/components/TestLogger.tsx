/**
 * 개발용 로깅 컴포넌트
 * API 호출 횟수와 React 렌더링 패턴을 추적
 */
'use client'

import { useEffect, useRef } from 'react'

interface TestLoggerProps {
  componentName: string
  onMount?: () => void
}

export default function TestLogger({ componentName, onMount }: TestLoggerProps) {
  const renderCountRef = useRef(0)
  const mountCountRef = useRef(0)
  
  // 렌더링 횟수 추적
  renderCountRef.current += 1
  
  useEffect(() => {
    mountCountRef.current += 1
    
    console.log(`🔍 [${componentName}] 마운트 #${mountCountRef.current}`)
    console.log(`🎨 [${componentName}] 총 렌더링 횟수: ${renderCountRef.current}`)
    console.log(`🏗️ [${componentName}] React Strict Mode: ${process.env.NODE_ENV === 'development' ? '활성화' : '비활성화'}`)
    
    if (onMount) {
      console.log(`📡 [${componentName}] API 호출 시작...`)
      onMount()
    }
    
    // 언마운트 감지
    return () => {
      console.log(`💀 [${componentName}] 언마운트됨`)
    }
  }, [componentName, onMount])
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-xs opacity-75 z-50">
      <div>{componentName}</div>
      <div>렌더링: {renderCountRef.current}회</div>
      <div>마운트: {mountCountRef.current}회</div>
      <div>Strict Mode: {process.env.NODE_ENV === 'development' ? 'ON' : 'OFF'}</div>
    </div>
  )
}
