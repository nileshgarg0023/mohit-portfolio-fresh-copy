'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Particles state
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([])
  
  // Create particles on component mount
  useEffect(() => {
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }))
    setParticles(newParticles)
    
    // Simulate loading sequence
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      mouseX.set(x)
      mouseY.set(y)
      
      setCursorPosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])
  
  // Transform values for 3D effect
  const rotateX = useTransform(mouseY, [0, 300], [10, -10])
  const rotateY = useTransform(mouseX, [0, 1000], [-10, 10])
  
  // Spring physics for smooth animation
  const springConfig = { damping: 20, stiffness: 100 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  return (
    <section 
      ref={containerRef}
      className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Particle background */}
      <div className="absolute inset-0 z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-cyan-500"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.3,
            }}
            animate={{
              x: [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
              ],
              y: [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
              ],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Cyber grid lines */}
      <div className="absolute inset-0 z-0">
        <div className="cyber-grid"></div>
      </div>
      
      {/* Interactive 3D card */}
      <motion.div
        className="z-10 perspective-1000 w-full max-w-4xl px-6"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d"
        }}
      >
        <div className="relative">
          {/* Glowing border */}
          <motion.div 
            className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm"
            animate={{
              background: [
                'linear-gradient(90deg, #00f0ff, #7e0fff)',
                'linear-gradient(180deg, #00f0ff, #7e0fff)',
                'linear-gradient(270deg, #00f0ff, #7e0fff)',
                'linear-gradient(360deg, #00f0ff, #7e0fff)'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          
          {/* Main content card */}
          <div className="relative bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <AnimatePresence>
              {isLoaded && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6"
                  >
                    <div className="flex items-center mb-2">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      <div className="font-mono text-green-500 text-xs tracking-wider">SECURE CONNECTION ESTABLISHED</div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-2 cyber-glitch-text">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                        CYBERSECURITY SPECIALIST
                      </span>
                    </h1>
                    <div className="flex items-center mb-4">
                      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                      <div className="px-4 font-mono text-xs text-cyan-500">SYSTEM ACCESS</div>
                      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-8"
                  >
                    <div className="font-mono text-sm text-gray-400 mb-4 leading-relaxed">
                      <TypewriterText text="Protecting digital infrastructures and securing the future with 6+ years of expertise in threat detection, vulnerability assessment, and security architecture." />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {['Penetration Testing', 'Threat Intelligence', 'Security Architecture', 'Incident Response'].map((skill, index) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + (index * 0.1) }}
                          className="px-3 py-1 rounded-full border border-cyan-800 bg-cyan-900/20 text-cyan-400 text-xs font-mono"
                        >
                          {skill}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button className="relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black font-medium px-6 py-2 border-0">
                      <span className="relative z-10">View Portfolio</span>
                      <motion.span 
                        className="absolute inset-0 bg-white"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                        style={{ opacity: 0.2 }}
                      />
                    </Button>
                    <Button variant="outline" className="relative overflow-hidden group border-cyan-500 text-cyan-500 hover:text-cyan-400 hover:bg-transparent px-6 py-2">
                      <span className="relative z-10">Contact Me</span>
                      <motion.span 
                        className="absolute inset-0 border border-cyan-500"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    </Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      
      {/* Interactive cursor follower */}
      {isHovering && (
        <motion.div
          className="fixed w-20 h-20 rounded-full pointer-events-none z-50 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, rgba(0,240,255,0.7) 0%, rgba(0,240,255,0) 70%)',
            left: mouseX,
            top: mouseY,
            translateX: '-50%',
            translateY: '-50%'
          }}
        />
      )}
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-cyan-500 flex justify-center pt-2">
          <motion.div 
            className="w-1 h-2 bg-cyan-500 rounded-full"
            animate={{ opacity: [0.2, 1, 0.2], y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  )
}

// Typewriter effect component
function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('')
  
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 30)
    
    return () => clearInterval(interval)
  }, [text])
  
  return <span>{displayedText}<span className="animate-pulse">|</span></span>
} 