'use client'

import { motion } from 'framer-motion'
import { FaWhatsapp, FaFacebook } from 'react-icons/fa'
import { FiFileText, FiBarChart2, FiBook, FiAward } from 'react-icons/fi'

const floatingCards = [
  { icon: FiFileText,  label: 'Thesis Writing',       color: 'text-gold-400' },
  { icon: FiBarChart2, label: 'Statistical Analysis',  color: 'text-blue-400' },
  { icon: FiBook,      label: 'Literature Review',     color: 'text-green-400' },
  { icon: FiAward,     label: 'Publication Support',   color: 'text-purple-400' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center bg-hero overflow-hidden"
    >
      {/* Background decorative rings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-gold-500/10" />
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full border border-gold-500/10" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full border border-blue-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-gold-400 text-sm font-medium">Medical Academic Excellence</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              MED<span className="text-gold-400">PEN</span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-300 mt-2 block">
                Professional Medical Academic
                <br />Writing &amp; Statistical Support
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
            >
              Specialized support for medical theses, research protocols, statistical analysis,
              manuscript preparation, and publication-ready academic documents.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a
                href="https://wa.me/message/RD2MBNPA3USBN1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95"
              >
                <FaWhatsapp size={22} />
                Contact on WhatsApp
              </a>
              <a
                href="https://www.facebook.com/share/1B79TgQNKh/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <FaFacebook size={22} />
                Visit Facebook Page
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="mt-12 flex flex-wrap gap-4 justify-center lg:justify-start">
              {['100% Confidential', 'Evidence-Based', 'Expert Medical Writers', 'On-Time Delivery'].map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-medium text-gray-400 border border-gray-700 rounded-full px-3 py-1"
                >
                  ✓ {badge}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Visual card grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex flex-col gap-4"
          >
            {/* Main dashboard card */}
            <div className="bg-navy-800/60 backdrop-blur-sm border border-navy-700/60 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-gray-400 text-xs">medpen_project_dashboard.pdf</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center">
                    <FiFileText className="text-gold-400" size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">Thesis — Chapter 3: Results</div>
                    <div className="w-3/4 h-1.5 bg-navy-700 rounded-full mt-1.5">
                      <div className="w-4/5 h-full bg-gold-500 rounded-full" />
                    </div>
                  </div>
                  <span className="text-gold-400 text-xs font-medium">80%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FiBarChart2 className="text-blue-400" size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">SPSS Analysis — Complete</div>
                    <div className="w-3/4 h-1.5 bg-navy-700 rounded-full mt-1.5">
                      <div className="w-full h-full bg-blue-500 rounded-full" />
                    </div>
                  </div>
                  <span className="text-blue-400 text-xs font-medium">100%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <FiBook className="text-green-400" size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">Literature Review</div>
                    <div className="w-3/4 h-1.5 bg-navy-700 rounded-full mt-1.5">
                      <div className="w-1/2 h-full bg-green-500 rounded-full" />
                    </div>
                  </div>
                  <span className="text-green-400 text-xs font-medium">50%</span>
                </div>
              </div>
            </div>

            {/* Bottom stats row */}
            <div className="grid grid-cols-2 gap-4">
              {floatingCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="bg-navy-800/60 backdrop-blur-sm border border-navy-700/60 rounded-xl p-4 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-lg bg-navy-900/50 flex items-center justify-center ${card.color}`}>
                    <card.icon size={20} />
                  </div>
                  <span className="text-gray-300 text-sm font-medium">{card.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" className="fill-white dark:fill-navy-950" />
        </svg>
      </div>
    </section>
  )
}
