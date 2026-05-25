'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

const navLinks = [
  { label: 'Home',        href: '#home' },
  { label: 'About',       href: '#about' },
  { label: 'Services',    href: '#services' },
  { label: 'Workflow',    href: '#workflow' },
  { label: 'Specialties', href: '#specialties' },
  { label: 'FAQ',         href: '#faq' },
  { label: 'Contact',     href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [darkMode, setDarkMode]   = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('medpen-dark')
    if (stored === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('medpen-dark', String(next))
  }

  const handleNav = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNav('#home')}
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl font-bold text-white tracking-wide">
            MED<span className="text-gold-500">PEN</span>
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNav(link.href)}
                className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors duration-200"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-gray-300 hover:text-gold-400 hover:bg-navy-800/50 transition-all"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <a
            href="https://wa.me/message/RD2MBNPA3USBN1"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            <FaWhatsapp size={16} />
            WhatsApp
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-navy-900/98 backdrop-blur-md border-t border-navy-800 px-4 pb-4"
          >
            <ul className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="w-full text-left py-2.5 px-3 text-gray-300 hover:text-gold-400 hover:bg-navy-800/50 rounded-lg transition-all text-sm font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="https://wa.me/message/RD2MBNPA3USBN1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2.5 px-3 bg-green-500 text-white rounded-lg text-sm font-semibold"
                >
                  <FaWhatsapp size={16} />
                  Contact on WhatsApp
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
