'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'

const testimonials = [
  {
    quote:
      'MEDPEN completely transformed my thesis chapter. The statistical analysis was flawless, and the SPSS output interpretation was exactly what my supervisor needed. Highly professional and confidential service.',
    role: 'Postgraduate Surgery Researcher',
    specialty: 'General Surgery — MS Candidate',
  },
  {
    quote:
      'I had been struggling with my literature review for months. The MEDPEN team delivered a comprehensive, well-structured review within the agreed timeline. The references were properly formatted and the writing was academic and precise.',
    role: 'Obstetrics & Gynecology Resident',
    specialty: 'OB/GYN — MD Candidate',
  },
  {
    quote:
      'The discussion section they wrote for my manuscript was the best part of the paper according to the reviewers. They really understood the clinical context and connected the results to current evidence beautifully.',
    role: 'Medical Master\'s Candidate',
    specialty: 'Internal Medicine — MSc',
  },
  {
    quote:
      'Outstanding statistical support. They handled my ROC curve analysis and logistic regression in R perfectly. The tables were publication-ready and the reporting followed the journal guidelines precisely.',
    role: 'Clinical Research Fellow',
    specialty: 'Oncology — PhD Track',
  },
  {
    quote:
      'Fast, reliable, and confidential. MEDPEN helped me format my entire thesis according to our university requirements, including the Arabic summary. I submitted on time thanks to their support.',
    role: 'Postgraduate Pediatrics Candidate',
    specialty: 'Pediatrics — MD Thesis',
  },
]

function StarRating() {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar key={i} size={16} className="text-gold-400 fill-gold-400" style={{ fill: 'currentColor' }} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  return (
    <section className="py-24 bg-white dark:bg-navy-950">
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
            What Clients Say
          </span>
          <h2 className="section-title mt-3 mb-2">Testimonials</h2>
          <div className="gold-line" />
          <p className="section-subtitle mt-4">
            Trusted by medical researchers and postgraduate students across Egypt and the Arab world.
          </p>
        </motion.div>

        <div ref={ref} className="max-w-3xl mx-auto">
          {/* Main testimonial */}
          <div className="relative bg-gray-50 dark:bg-navy-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-navy-700">
            {/* Quote mark */}
            <div className="absolute top-6 left-8 text-6xl text-gold-500/20 font-serif leading-none select-none">
              &ldquo;
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="relative z-10"
              >
                <StarRating />
                <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed mb-8 italic">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-navy-900 dark:bg-navy-700 flex items-center justify-center text-gold-400 font-bold text-lg">
                    {testimonials[current].role[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-navy-900 dark:text-white text-sm">
                      {testimonials[current].role}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {testimonials[current].specialty}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-navy-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gold-500 hover:text-gold-500 transition-all"
            >
              <FiChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-gold-500 w-6' : 'bg-gray-300 dark:bg-navy-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-navy-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gold-500 hover:text-gold-500 transition-all"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
