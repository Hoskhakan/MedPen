'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  FiFileText, FiClipboard, FiBookOpen, FiUsers, FiBarChart2,
  FiPieChart, FiEdit3, FiCheckSquare, FiGlobe, FiTrendingUp,
  FiLayout, FiSend,
} from 'react-icons/fi'

const services = [
  {
    icon: FiFileText,
    title: 'Medical Thesis Preparation',
    description:
      'End-to-end support for MD, MSc, and PhD theses — from proposal to final submission, structured to Egyptian university standards.',
  },
  {
    icon: FiClipboard,
    title: 'Research Protocol Writing',
    description:
      'Comprehensive protocol development including objectives, study design, inclusion/exclusion criteria, and ethical considerations.',
  },
  {
    icon: FiBookOpen,
    title: 'Literature Review',
    description:
      'Systematic and narrative reviews sourced from PubMed, Cochrane, Scopus, and other peer-reviewed databases with proper APA/Vancouver citation.',
  },
  {
    icon: FiUsers,
    title: 'Patients & Methods Section',
    description:
      'Detailed methodology writing covering study design, sampling, instruments, ethical approval, and data collection procedures.',
  },
  {
    icon: FiBarChart2,
    title: 'Results Section Writing',
    description:
      'Clear, objective presentation of study findings with appropriate statistical reporting, tables, and figure legends.',
  },
  {
    icon: FiPieChart,
    title: 'Discussion Section Writing',
    description:
      'Expert interpretation of results, comparison with current literature, limitations, and clinically relevant conclusions.',
  },
  {
    icon: FiTrendingUp,
    title: 'Statistical Analysis',
    description:
      'Full statistical support using SPSS, R, Stata, and MedCalc — descriptive stats, inferential tests, regression, survival analysis, and ROC curves.',
  },
  {
    icon: FiLayout,
    title: 'Tables & Figures Preparation',
    description:
      'Publication-quality tables, charts, and figures formatted to journal or university specifications with APA-compliant labeling.',
  },
  {
    icon: FiEdit3,
    title: 'Manuscript Editing & Journal Formatting',
    description:
      'Language editing, structural refinement, and journal-specific formatting to meet submission requirements of target publications.',
  },
  {
    icon: FiCheckSquare,
    title: 'Plagiarism Reduction',
    description:
      'Academic paraphrasing and rewording to reduce similarity index while preserving scientific meaning and integrity.',
  },
  {
    icon: FiGlobe,
    title: 'Arabic & English Academic Writing',
    description:
      'Bilingual academic writing services in both Arabic and English, suitable for Egyptian university thesis summaries and international journals.',
  },
  {
    icon: FiSend,
    title: 'Publication Support',
    description:
      'Journal selection, submission letter drafting, response to reviewer comments, and guidance through the peer-review process.',
  },
]

export default function Services() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            What We Offer
          </span>
          <h2 className="section-title mt-3 mb-2">Our Services</h2>
          <div className="gold-line" />
          <p className="section-subtitle mt-4">
            A comprehensive suite of academic services tailored specifically for the medical research community.
          </p>
        </motion.div>

        {/* Grid */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="card group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-navy-900 dark:bg-navy-700 flex items-center justify-center mb-4 group-hover:bg-gold-500 transition-colors duration-300">
                <service.icon
                  size={22}
                  className="text-gold-400 group-hover:text-navy-900 transition-colors duration-300"
                />
              </div>
              <h3 className="font-semibold text-navy-900 dark:text-white mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA below grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-14"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Not sure which service you need? Get in touch and we will guide you.
          </p>
          <a
            href="https://wa.me/message/RD2MBNPA3USBN1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Discuss Your Project
          </a>
        </motion.div>
      </div>
    </section>
  )
}
