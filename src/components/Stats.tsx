'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiFileText, FiActivity, FiBarChart2, FiEdit3 } from 'react-icons/fi'

// Edit these numbers to update the displayed statistics
const stats = [
  { icon: FiFileText,  value: 320, label: 'Medical Theses Supported',    suffix: '+' },
  { icon: FiActivity,  value: 180, label: 'Research Projects Completed',  suffix: '+' },
  { icon: FiBarChart2, value: 250, label: 'Statistical Reports Prepared', suffix: '+' },
  { icon: FiEdit3,     value: 140, label: 'Manuscripts Edited',           suffix: '+' },
]

function Counter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })
  const started = useRef(false)

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true
      const startTime = performance.now()
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(eased * target))
        if (progress < 1) requestAnimationFrame(step)
        else setCount(target)
      }
      requestAnimationFrame(step)
    }
  }, [inView, target, duration])

  return <span ref={ref}>{count}</span>
}

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="py-20 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto mb-4">
                <stat.icon size={24} className="text-gold-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                <Counter target={stat.value} />
                <span className="text-gold-400">{stat.suffix}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
