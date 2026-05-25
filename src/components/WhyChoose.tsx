'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  FiStar, FiShield, FiBook, FiBarChart2, FiLock, FiClock, FiMessageCircle,
} from 'react-icons/fi'

const reasons = [
  {
    icon: FiStar,
    title: 'Medical-Specialty-Based Writing',
    description:
      'Our team members have clinical backgrounds, ensuring medical accuracy and specialty-appropriate language in every document.',
  },
  {
    icon: FiBook,
    title: 'Evidence-Based Academic Structure',
    description:
      'All work is grounded in current peer-reviewed literature using systematic, reproducible research methodology.',
  },
  {
    icon: FiStar,
    title: 'Egyptian & International Standards',
    description:
      'We are familiar with Egyptian university thesis requirements and international journal formatting guidelines (APA, Vancouver, AMA).',
  },
  {
    icon: FiBarChart2,
    title: 'Professional Statistical Analysis',
    description:
      'Biostatistical support using SPSS, R, Stata, and MedCalc with transparent reporting of all tests, assumptions, and results.',
  },
  {
    icon: FiLock,
    title: 'Confidential File Handling',
    description:
      'Your patient data, research files, and personal identity are never shared. We operate under strict non-disclosure practices.',
  },
  {
    icon: FiClock,
    title: 'Clear Deadlines & Organized Follow-Up',
    description:
      'We set realistic timelines and provide regular progress updates so you always know the status of your project.',
  },
  {
    icon: FiMessageCircle,
    title: 'WhatsApp-Based Communication',
    description:
      'Direct, fast, and convenient communication via WhatsApp — no complicated portals, no delays, just straightforward support.',
  },
  {
    icon: FiShield,
    title: 'Revision Until Satisfaction',
    description:
      'We stand behind our work with revision rounds to ensure every deliverable meets your expectations and requirements.',
  },
]

export default function WhyChoose() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section className="py-24 bg-navy-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-500/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-blue-500/5 translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-400 font-semibold text-sm uppercase tracking-widest">
            Our Advantages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-2">
            Why Choose MEDPEN?
          </h2>
          <div className="gold-line" />
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-4">
            We combine medical knowledge, academic expertise, and professional service to give you
            the support you deserve.
          </p>
        </motion.div>

        {/* Grid */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-navy-800/50 border border-navy-700/50 rounded-2xl p-5 hover:border-gold-500/40 hover:bg-navy-800/80 transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-navy-900/70 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                <reason.icon size={20} className="text-gold-400" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-2">{reason.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
