'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowUp } from 'react-icons/fi'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 flex items-center justify-center shadow-lg hover:bg-navy-800 dark:hover:bg-gold-400 transition-colors hover:scale-110 active:scale-95"
        >
          <FiArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
