'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiSend, FiSearch, FiBarChart2, FiEdit3, FiCheckCircle } from 'react-icons/fi'

const steps = [
  {
    step: '01',
    icon: FiSend,
    title: 'Send Your Study Details',
    description:
      'Share your research topic, specialty, university requirements, available data, and any specific guidelines via WhatsApp or our contact form.',
  },
  {
    step: '02',
    icon: FiSearch,
    title: 'Initial Academic Review',
    description:
      'Our team evaluates your project scope, identifies the required services, and provides a clear outline of the work plan and timeline.',
  },
  {
    step: '03',
    icon: FiBarChart2,
    title: 'Writing & Statistical Planning',
    description:
      'We design the structural framework of your document and perform the appropriate statistical plan based on your study design and data type.',
  },
  {
    step: '04',
    icon: FiEdit3,
    title: 'Draft Preparation',
    description:
      'Skilled medical writers and biostatisticians prepare each section with scientific precision, evidence-based references, and professional academic language.',
  },
  {
    step: '05',
    icon: FiCheckCircle,
    title: 'Revision & Final Delivery',
    description:
      'We incorporate your feedback through revision rounds and deliver the final, polished document ready for submission or publication.',
  },
]

export default function Workflow() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="workflow" className="py-24 bg-white dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="section-title mt-3 mb-2">Our Simple Process</h2>
          <div className="gold-line" />
          <p className="section-subtitle mt-4">
            From your first message to final delivery — a clear, structured workflow designed for busy medical professionals.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center text-center relative"
              >
                {/* Circle */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-navy-900 dark:bg-navy-800 border-2 border-gold-500/30 flex items-center justify-center shadow-lg group-hover:border-gold-500 transition-colors">
                    <step.icon size={28} className="text-gold-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold-500 text-navy-900 text-xs font-bold flex items-center justify-center shadow">
                    {step.step}
                  </div>
                </div>

                <h3 className="font-semibold text-navy-900 dark:text-white mb-3 text-sm">
                  {step.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
