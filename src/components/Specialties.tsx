'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Edit this list to update supported specialties
const specialties = [
  'Surgery',
  'Oncology',
  'Obstetrics & Gynecology',
  'Pediatrics',
  'Internal Medicine',
  'Radiology',
  'Dermatology',
  'ENT',
  'Orthopedics',
  'Cardiology',
  'Dentistry',
  'Physical Therapy',
  'Nursing',
  'Public Health',
  'Laboratory Medicine',
  'Psychiatry',
  'Anesthesiology',
  'Ophthalmology',
]

export default function Specialties() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="specialties" className="py-24 bg-gray-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            Medical Fields
          </span>
          <h2 className="section-title mt-3 mb-2">Supported Specialties</h2>
          <div className="gold-line" />
          <p className="section-subtitle mt-4">
            MEDPEN has experience supporting research across a wide range of medical and health science disciplines.
          </p>
        </motion.div>

        {/* Specialty tags */}
        <div ref={ref} className="flex flex-wrap gap-3 justify-center">
          {specialties.map((specialty, i) => (
            <motion.span
              key={specialty}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="px-5 py-2.5 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-navy-900 dark:text-gray-200 rounded-full text-sm font-medium hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 hover:shadow-md transition-all duration-200 cursor-default"
            >
              {specialty}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8"
        >
          Don&apos;t see your specialty? Contact us — we support all medical and health science fields.
        </motion.p>
      </div>
    </section>
  )
}
