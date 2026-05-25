'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

const faqs = [
  {
    question: 'What services does MEDPEN provide?',
    answer:
      'MEDPEN offers a comprehensive range of medical academic services including thesis preparation, research protocol writing, literature reviews, patients and methods sections, results and discussion writing, statistical analysis (SPSS, R, Stata, MedCalc), tables and figures preparation, manuscript editing, journal formatting, plagiarism reduction through paraphrasing, Arabic and English academic writing, and full publication support.',
  },
  {
    question: 'Do you help with statistical analysis?',
    answer:
      'Yes. Statistical analysis is one of our core services. We provide full biostatistical support including descriptive statistics, inferential tests (t-test, ANOVA, chi-square, Mann-Whitney), correlation and regression analyses, survival analysis (Kaplan-Meier), ROC curve analysis, and more. All analysis is performed with appropriate reporting of tests, assumptions, and p-values.',
  },
  {
    question: 'Can you work with SPSS files?',
    answer:
      'Absolutely. We work with SPSS (.sav) data files, as well as Excel, R datasets, and Stata files. You can send us your raw data and we will perform the appropriate analysis, generate output, and write the results section with clear interpretation of all statistical findings.',
  },
  {
    question: 'Do you provide Arabic thesis summaries?',
    answer:
      'Yes. We offer bilingual writing services in both Arabic and English. We can prepare Arabic summaries (الملخص العربي) formatted to your university requirements, as well as full Arabic sections or complete Arabic documents when needed.',
  },
  {
    question: 'Can you format the document according to my university requirements?',
    answer:
      'Yes. We are familiar with the formatting requirements of Egyptian universities and can adapt your thesis or dissertation to specific margin settings, font requirements, heading styles, citation formats (Vancouver, APA, AMA), and reference list styles as specified by your institution or faculty.',
  },
  {
    question: 'How can I contact MEDPEN?',
    answer:
      'The easiest way to reach us is via WhatsApp. Simply click the WhatsApp button on this page or message us directly to describe your project. You can also visit our Facebook page for more information. We typically respond within a few hours during working days.',
  },
  {
    question: 'Is my research data kept confidential?',
    answer:
      'Confidentiality is a core principle at MEDPEN. Your research data, patient information, personal details, and all documents are handled with strict privacy. We do not share, publish, or distribute any client materials. You can request a confidentiality agreement if required.',
  },
  {
    question: 'How long does it take to complete a project?',
    answer:
      'Timelines vary depending on the complexity and scope of the work. A single chapter or statistical analysis typically takes 3–7 days. A full thesis may take several weeks. We discuss and agree on a realistic timeline before starting any project, and we provide regular progress updates throughout.',
  },
]

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border border-gray-200 dark:border-navy-700 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-navy-800 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors"
      >
        <span className="font-semibold text-navy-900 dark:text-white text-sm pr-4">
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-gold-500"
        >
          <FiChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-white dark:bg-navy-800">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-gray-50 dark:bg-navy-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">
            Have Questions?
          </span>
          <h2 className="section-title mt-3 mb-2">Frequently Asked Questions</h2>
          <div className="gold-line" />
          <p className="section-subtitle mt-4">
            Answers to the most common questions about our services and process.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} faq={faq} index={i} />
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 p-6 bg-navy-900 rounded-2xl"
        >
          <p className="text-gray-300 mb-4">Still have questions? We are happy to help.</p>
          <a
            href="https://wa.me/message/RD2MBNPA3USBN1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Ask on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
