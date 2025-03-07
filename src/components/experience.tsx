'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

// Experience data
const experiences = [
  {
    id: 1,
    company: "Maruti Suzuki",
    position: "Senior Cybersecurity Specialist",
    period: "2020 - Present",
    description: "Leading security architecture and implementation for connected vehicle platforms. Conducting threat modeling and penetration testing for automotive systems. Developing security frameworks compliant with automotive standards.",
    achievements: [
      "Reduced security vulnerabilities by 75% through implementation of proactive security measures",
      "Led a team of 5 security professionals in securing connected vehicle infrastructure",
      "Implemented NIST cybersecurity framework across the organization"
    ],
    icon: "🚗",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    company: "Tata Consultancy Services",
    position: "Cybersecurity Analyst",
    period: "2017 - 2020",
    description: "Performed vulnerability assessments and penetration testing for enterprise clients. Implemented SIEM solutions and security monitoring systems. Developed incident response procedures and conducted security training.",
    achievements: [
      "Detected and mitigated 20+ critical security incidents before they caused damage",
      "Implemented security monitoring solutions for 15+ enterprise clients",
      "Received recognition for outstanding performance in threat detection"
    ],
    icon: "🏢",
    color: "from-purple-500 to-indigo-600"
  }
]

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  
  return (
    <section 
      id="experience" 
      ref={containerRef}
      className="min-h-screen py-20 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="cyber-grid opacity-30"></div>
        <div className="scan-line"></div>
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4 cyber-glitch-text" data-text="EXPERIENCE">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                MISSION HISTORY
              </span>
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <div className="px-4 font-mono text-xs text-cyan-500">OPERATIONAL TIMELINE</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            </div>
          </motion.div>
          
          {/* Interactive timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-500/50 via-blue-500/50 to-purple-600/50"></div>
            
            {/* Experience cards */}
            <div className="space-y-24">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  style={{ y: y1 }}
                  className="relative"
                >
                  {/* Timeline node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + (index * 0.2) }}
                    className={`absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br ${exp.color} flex items-center justify-center z-10 border-2 border-black`}
                  >
                    <span className="text-xl">{exp.icon}</span>
                  </motion.div>
                  
                  {/* Experience card */}
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    transition={{ duration: 0.6, delay: 0.3 + (index * 0.2) }}
                    className={`relative w-full md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}
                  >
                    <div className="relative">
                      {/* Glowing border */}
                      <div className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm border-glow bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
                      
                      {/* Card content */}
                      <div className="relative bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30">
                        {/* Terminal-style header */}
                        <div className="flex items-center mb-4 border-b border-cyan-800/50 pb-2">
                          <div className="flex space-x-2 mr-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="font-mono text-xs text-cyan-400">mission_log_{exp.id}.sh</div>
                        </div>
                        
                        {/* Company and position */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-white mb-1">{exp.company}</h3>
                          <div className="flex justify-between items-center">
                            <p className="text-cyan-400 font-mono text-sm">{exp.position}</p>
                            <span className="bg-cyan-900/30 text-cyan-400 text-xs px-2 py-1 rounded font-mono">
                              {exp.period}
                            </span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <div className="mb-4 font-mono text-sm text-gray-300">
                          <div className="flex items-start mb-2">
                            <span className="text-green-500 mr-2">$</span>
                            <span className="text-cyan-400">./display_mission.sh --summary</span>
                          </div>
                          <p className="pl-4 leading-relaxed">{exp.description}</p>
                        </div>
                        
                        {/* Achievements */}
                        <div className="font-mono text-sm">
                          <div className="flex items-start mb-2">
                            <span className="text-green-500 mr-2">$</span>
                            <span className="text-cyan-400">./display_achievements.sh</span>
                          </div>
                          <ul className="pl-4 space-y-2">
                            {exp.achievements.map((achievement, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                                transition={{ duration: 0.5, delay: 0.5 + (index * 0.2) + (i * 0.1) }}
                                className="flex items-start"
                              >
                                <span className="text-cyan-500 mr-2">→</span>
                                <span className="text-gray-300">{achievement}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Data flow animation */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 data-flow"></div>
                      </div>
                    </div>
                    
                    {/* Connecting line to timeline for desktop */}
                    <div className={`hidden md:block absolute top-1/2 w-12 h-0.5 bg-gradient-to-r ${
                      index % 2 === 0 
                        ? 'right-0 translate-x-full from-transparent to-cyan-500' 
                        : 'left-0 -translate-x-full from-cyan-500 to-transparent'
                    }`}></div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Future indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="inline-block relative">
              <div className="absolute -inset-1 rounded-xl opacity-50 blur-sm border-glow bg-gradient-to-br from-cyan-500/20 to-purple-600/20"></div>
              <div className="relative px-6 py-3 rounded-xl border border-cyan-500/30 bg-black/60 font-mono text-sm text-cyan-400">
                <span className="mr-2">⚡</span>
                Continuously evolving to counter emerging cyber threats
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 