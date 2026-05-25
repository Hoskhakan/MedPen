'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

export default function FloatingWhatsApp() {
  const [tooltipVisible, setTooltipVisible] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      <AnimatePresence>
        {tooltipVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-navy-800 shadow-xl rounded-2xl p-4 max-w-[220px] border border-gray-100 dark:border-navy-700"
          >
            <button
              onClick={() => setTooltipVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <FiX size={14} />
            </button>
            <p className="text-navy-900 dark:text-white text-xs font-semibold mb-1">
              Chat with MEDPEN
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Send us your project details on WhatsApp and we will respond promptly.
            </p>
            <a
              href="https://wa.me/message/RD2MBNPA3USBN1"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-400 transition-colors"
            >
              <FaWhatsapp size={14} />
              Start Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setTooltipVisible(!tooltipVisible)}
        aria-label="Open WhatsApp chat"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/40 flex items-center justify-center hover:bg-green-400 transition-colors relative"
      >
        <FaWhatsapp size={28} />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white animate-pulse" />
      </motion.button>
    </div>
  )
}
