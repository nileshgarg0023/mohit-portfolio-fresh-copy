'use client'

import React, { useEffect, useState } from 'react'

export default function MatrixAnimation() {
  const [matrixElements, setMatrixElements] = useState<React.ReactNode[]>([])
  
  useEffect(() => {
    // Create matrix code strings
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
    const generateMatrixString = () => {
      let result = ''
      const length = Math.floor(Math.random() * 20) + 10
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      return result
    }
    
    // Create matrix elements
    const elements: React.ReactNode[] = []
    const count = 50 // Number of matrix strings
    
    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 20
      const duration = Math.random() * 10 + 10
      const left = `${Math.random() * 100}%`
      
      elements.push(
        <div 
          key={i}
          className="matrix-animation"
          style={{
            left,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
          }}
        >
          {generateMatrixString()}
        </div>
      )
    }
    
    setMatrixElements(elements)
  }, [])
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {matrixElements}
    </div>
  )
} 