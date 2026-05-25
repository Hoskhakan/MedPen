'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiShield, FiTarget, FiAward, FiUsers } from 'react-icons/fi'

const pillars = [
  {
    icon: FiAward,
    title: 'Scientific Accuracy',
    description:
      'Every document is written with rigorous adherence to evidence-based principles and peer-reviewed sources.',
  },
  {
    icon: FiShield,
    title: 'Confidentiality',
    description:
      'Your research data and personal information are handled with the utmost discretion and professional privacy.',
  },
  {
    icon: FiTarget,
    title: 'Structured Formatting',
    description:
      'Outputs conform to Egyptian university thesis standards and international journal submission guidelines.',
  },
  {
    icon: FiUsers,
    title: 'Expert Support Team',
    description:
      'Our writers and statisticians hold advanced medical and academic qualifications with real research experience.',
  },
]

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="about" className="py-24 bg-white dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
              About MEDPEN
            </span>
            <h2 className="section-title mt-3 mb-2 text-left">
              Your Trusted Medical Academic Partner
            </h2>
            <div className="w-16 h-1 bg-gold-500 rounded-full mb-6" />
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              MEDPEN is a specialized academic and statistical support service founded to meet the
              growing demands of medical researchers, postgraduate students, and healthcare
              professionals across Egypt and the Arab world.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              We understand the unique pressures of medical academia — tight deadlines, complex
              statistical requirements, strict university formatting rules, and high scientific
              standards. Our team bridges the gap between clinical expertise and academic excellence,
              providing end-to-end support from the initial research idea through to final publication.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Whether you are a master&apos;s candidate preparing your first thesis, a consultant
              submitting to a peer-reviewed journal, or a department chief overseeing a multicenter
              study, MEDPEN delivers with precision, confidentiality, and measurable results.
            </p>
          </motion.div>

          {/* Right — Pillars grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="card"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-900 dark:bg-navy-800 flex items-center justify-center mb-4">
                  <pillar.icon className="text-gold-400" size={22} />
                </div>
                <h3 className="font-semibold text-navy-900 dark:text-white mb-2">{pillar.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
