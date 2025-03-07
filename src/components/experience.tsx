'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import type { Experience } from '@/lib/supabase'

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })
  
  // Fetch experiences data
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('start_date', { ascending: false })

        if (error) throw error
        setExperiences(data || [])
      } catch (error) {
        console.error('Error fetching experiences:', error)
        setError('Failed to load experience data')
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

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
                MISSION LOG
              </span>
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <div className="px-4 font-mono text-xs text-cyan-500">CLASSIFIED OPERATIONS</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            </div>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-20">
              <div className="text-cyan-400 animate-pulse font-mono">
                Decrypting mission data...
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-20">
              <div className="text-red-400 font-mono">
                {error}
              </div>
            </div>
          )}

          {/* Experience timeline */}
          {!loading && !error && (
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"></div>

              {/* Experience cards */}
              <div className="space-y-16">
                {experiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className={`relative flex flex-col md:flex-row gap-8 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4">
                      <div className="absolute -inset-2 rounded-full opacity-50 blur-sm bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
                      <div className="relative w-full h-full rounded-full bg-black border border-cyan-500/50"></div>
                    </div>

                    {/* Date */}
                    <div className="w-full md:w-1/2 text-center md:text-right px-4 font-mono text-sm text-cyan-400/70">
                      {new Date(experience.start_date).toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'long'
                      })}
                      {' - '}
                      {experience.current ? (
                        'Present'
                      ) : experience.end_date ? (
                        new Date(experience.end_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })
                      ) : ''}
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2 px-4">
                      <div className="relative">
                        {/* Glowing border */}
                        <div className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
                        
                        <div className="relative bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30">
                          {/* Terminal header */}
                          <div className="flex items-center mb-4 border-b border-cyan-800/50 pb-2">
                            <div className="flex space-x-2 mr-4">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="font-mono text-xs text-cyan-400">mission_details.sh</div>
                          </div>

                          <h3 className="text-xl font-bold text-cyan-400 mb-2">{experience.position}</h3>
                          <div className="text-cyan-400/70 font-mono text-sm mb-4">{experience.company}</div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-start mb-2">
                                <span className="text-green-500 mr-2">$</span>
                                <span className="text-cyan-400 font-mono text-sm">cat mission.txt</span>
                              </div>
                              <p className="text-gray-300 font-mono text-sm pl-4">{experience.mission}</p>
                            </div>

                            <div>
                              <div className="flex items-start mb-2">
                                <span className="text-green-500 mr-2">$</span>
                                <span className="text-cyan-400 font-mono text-sm">cat achievements.txt</span>
                              </div>
                              <ul className="space-y-2 pl-4">
                                {experience.achievements.map((achievement, i) => (
                                  <li key={i} className="text-gray-300 font-mono text-sm flex items-start">
                                    <span className="text-cyan-400 mr-2">→</span>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Animated scan line */}
                          <div className="scan-line"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 