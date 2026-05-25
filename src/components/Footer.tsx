'use client'

import { FaWhatsapp, FaFacebook } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'

const quickLinks = [
  { label: 'Home',        href: '#home' },
  { label: 'About',       href: '#about' },
  { label: 'Services',    href: '#services' },
  { label: 'Workflow',    href: '#workflow' },
  { label: 'Specialties', href: '#specialties' },
  { label: 'FAQ',         href: '#faq' },
  { label: 'Contact',     href: '#contact' },
]

const serviceLinks = [
  'Thesis Preparation',
  'Statistical Analysis',
  'Literature Review',
  'Manuscript Editing',
  'Research Protocol',
  'Publication Support',
]

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-navy-950 text-gray-400 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold text-white mb-2">
              MED<span className="text-gold-400">PEN</span>
            </div>
            <p className="text-gold-400/80 text-sm mb-4 font-medium">
              Medical Academic Writing &amp; Research Support
            </p>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Specialized academic and statistical support for medical researchers, postgraduate
              students, and healthcare professionals across Egypt and the Arab world.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/message/RD2MBNPA3USBN1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href="https://www.facebook.com/share/1B79TgQNKh/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
              >
                <FaFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => scrollTo('#services')}
                    className="text-sm hover:text-gold-400 transition-colors text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} MEDPEN. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1">
            Built with <FiHeart className="text-red-400" size={12} /> for the medical research community
          </p>
        </div>
      </div>
    </footer>
  )
}
