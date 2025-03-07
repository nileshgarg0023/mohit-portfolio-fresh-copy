'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150])
  
  // Hexagon grid for cybersecurity theme
  const hexagons = Array.from({ length: 20 }, (_, i) => i)
  
  return (
    <section 
      id="about" 
      ref={containerRef}
      className="min-h-screen py-20 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="cyber-grid opacity-30"></div>
        <div className="scan-line"></div>
        
        {/* Floating hexagons */}
        {hexagons.map((hex, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 border border-cyan-500/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1 + (Math.random() * 0.2),
              rotate: Math.random() * 360,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
            }}
            animate={{
              y: [Math.random() * 20 - 10, Math.random() * 20 - 10],
              rotate: [Math.random() * 360, Math.random() * 360 + 180],
              scale: [0.8 + (Math.random() * 0.4), 1 + (Math.random() * 0.4)]
            }}
            transition={{
              duration: 10 + (Math.random() * 20),
              repeat: Infinity,
              ease: "linear",
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section header with glitch effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 cyber-glitch-text" data-text="ABOUT">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                SYSTEM OVERVIEW
              </span>
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <div className="px-4 font-mono text-xs text-cyan-500">SECURITY CLEARANCE REQUIRED</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            </div>
          </motion.div>
          
          {/* 3D interactive card layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile card with 3D effect */}
            <motion.div
              style={{ y: y1 }}
              className="col-span-1 md:col-span-1"
            >
              <motion.div
                initial={{ opacity: 0, rotateY: 30 }}
                animate={isInView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative h-full"
              >
                <div className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm border-glow bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
                <div className="relative h-full bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30">
                  <div className="holographic mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-cyan-500/50 p-1">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500/80 to-purple-600/80 flex items-center justify-center">
                        <span className="text-3xl">👨‍💻</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">Mohit Gera</h3>
                    <p className="text-cyan-400 text-sm font-mono">Cybersecurity Specialist</p>
                  </div>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-300">6+ Years Experience</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-300">Maruti Suzuki & TCS</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-300">Security Architecture</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-300">Threat Intelligence</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Main content with terminal effect */}
            <motion.div
              style={{ y: y2 }}
              className="col-span-1 md:col-span-2"
            >
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative h-full"
              >
                <div className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm border-glow bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
                <div className="relative h-full bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30">
                  {/* Terminal header */}
                  <div className="flex items-center mb-4 border-b border-cyan-800/50 pb-2">
                    <div className="flex space-x-2 mr-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="font-mono text-xs text-cyan-400">cybersecurity_profile.sh</div>
                  </div>
                  
                  {/* Terminal content */}
                  <div className="font-mono text-sm space-y-4">
                    <TerminalLine 
                      command="./display_profile.sh --section=summary" 
                      delay={0.6}
                      isInView={isInView}
                    >
                      <p className="text-gray-300 leading-relaxed mt-2">
                        Cybersecurity professional with 6+ years of experience in protecting critical infrastructure 
                        and sensitive data. Specialized in threat detection, vulnerability assessment, and implementing 
                        robust security architectures for enterprise environments.
                      </p>
                    </TerminalLine>
                    
                    <TerminalLine 
                      command="./display_profile.sh --section=expertise" 
                      delay={1.2}
                      isInView={isInView}
                    >
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="col-span-1">
                          <h4 className="text-cyan-400 mb-2">Core Competencies</h4>
                          <ul className="list-disc list-inside text-gray-300 space-y-1">
                            <li>Security Architecture</li>
                            <li>Penetration Testing</li>
                            <li>Threat Intelligence</li>
                            <li>Incident Response</li>
                          </ul>
                        </div>
                        <div className="col-span-1">
                          <h4 className="text-cyan-400 mb-2">Specialized Skills</h4>
                          <ul className="list-disc list-inside text-gray-300 space-y-1">
                            <li>Network Security</li>
                            <li>Cloud Security</li>
                            <li>Vulnerability Assessment</li>
                            <li>Security Compliance</li>
                          </ul>
                        </div>
                      </div>
                    </TerminalLine>
                    
                    <TerminalLine 
                      command="./display_profile.sh --section=approach" 
                      delay={1.8}
                      isInView={isInView}
                    >
                      <p className="text-gray-300 leading-relaxed mt-2">
                        I approach cybersecurity with a proactive mindset, focusing on identifying and mitigating 
                        vulnerabilities before they can be exploited. My methodology combines technical expertise 
                        with strategic thinking to develop comprehensive security solutions that protect against 
                        evolving threats while enabling business objectives.
                      </p>
                    </TerminalLine>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Stats with animated counters */}
          <motion.div
            style={{ y: y3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {[
              { value: "50+", label: "Security Audits", icon: "🔍", delay: 0.2 },
              { value: "100+", label: "Vulnerabilities Patched", icon: "🛡️", delay: 0.4 },
              { value: "25+", label: "Security Architectures", icon: "🏗️", delay: 0.6 },
              { value: "10+", label: "Certifications", icon: "🏆", delay: 0.8 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: stat.delay }}
                className="relative"
              >
                <div className="absolute -inset-0.5 rounded-xl opacity-50 blur-sm border-glow bg-gradient-to-br from-cyan-500/20 to-purple-600/20"></div>
                <div className="relative bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/20 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl md:text-2xl font-bold text-cyan-400 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400 font-mono">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Terminal line component with typing effect
function TerminalLine({ 
  command, 
  children, 
  delay,
  isInView
}: { 
  command: string, 
  children: React.ReactNode,
  delay: number,
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center">
        <span className="text-green-500 mr-2">$</span>
        <span className="text-cyan-300">{command}</span>
      </div>
      {children}
    </motion.div>
  )
} 