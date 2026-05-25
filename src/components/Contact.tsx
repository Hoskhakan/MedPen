'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaFacebook } from 'react-icons/fa'
import { FiSend, FiCheckCircle } from 'react-icons/fi'

const services = [
  'Medical Thesis Preparation',
  'Research Protocol Writing',
  'Literature Review',
  'Patients & Methods Section',
  'Results Section Writing',
  'Discussion Section Writing',
  'Statistical Analysis',
  'Tables & Figures Preparation',
  'Manuscript Editing & Formatting',
  'Plagiarism Reduction',
  'Arabic Academic Writing',
  'Publication Support',
  'Other',
]

const specialties = [
  'Surgery', 'Oncology', 'Obstetrics & Gynecology', 'Pediatrics',
  'Internal Medicine', 'Radiology', 'Dermatology', 'ENT', 'Orthopedics',
  'Cardiology', 'Dentistry', 'Physical Therapy', 'Nursing', 'Public Health',
  'Laboratory Medicine', 'Psychiatry', 'Anesthesiology', 'Ophthalmology', 'Other',
]

type FormData = {
  name: string
  phone: string
  service: string
  specialty: string
  message: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim())     errors.name    = 'Name is required.'
  if (!data.phone.trim())    errors.phone   = 'Phone number is required.'
  if (!data.service)         errors.service  = 'Please select a service.'
  if (!data.specialty)       errors.specialty = 'Please select your specialty.'
  if (!data.message.trim())  errors.message  = 'Message is required.'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', service: '', specialty: '', message: '',
  })
  const [errors, setErrors]     = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    // TODO: integrate backend or form submission service here
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 bg-white dark:bg-navy-950">
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
            Get in Touch
          </span>
          <h2 className="section-title mt-3 mb-2">Contact MEDPEN</h2>
          <div className="gold-line" />
          <p className="section-subtitle mt-4">
            Ready to start your project? Reach out via WhatsApp, Facebook, or fill in the form below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — Direct contact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-8 border border-gray-100 dark:border-navy-700">
              <h3 className="font-bold text-navy-900 dark:text-white text-xl mb-2">
                Prefer to chat directly?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                The fastest way to reach us is via WhatsApp. Send us your project details and we
                will get back to you promptly with a plan and timeline.
              </p>

              <a
                href="https://wa.me/message/RD2MBNPA3USBN1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-6 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all duration-200 mb-4 justify-center hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/30"
              >
                <FaWhatsapp size={24} />
                Contact on WhatsApp
              </a>

              <a
                href="https://www.facebook.com/share/1B79TgQNKh/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 justify-center hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/30"
              >
                <FaFacebook size={24} />
                Visit Facebook Page
              </a>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Response Time', value: 'Within hours' },
                { label: 'Languages',     value: 'Arabic & English' },
                { label: 'Availability',  value: 'Sat–Thu' },
                { label: 'Confidentiality', value: '100% Assured' },
              ].map((item) => (
                <div key={item.label} className="bg-navy-900 rounded-xl p-4 text-center">
                  <div className="text-gold-400 font-bold text-sm mb-1">{item.value}</div>
                  <div className="text-gray-400 text-xs">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <FiCheckCircle size={56} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">
                  Message Received!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Thank you for reaching out. We will review your details and contact you very soon.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', service: '', specialty: '', message: '' }) }}
                  className="mt-6 btn-outline-gold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Dr. Ahmed Mohamed"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-navy-800 text-navy-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${errors.name ? 'border-red-400' : 'border-gray-200 dark:border-navy-700'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+20 1XX XXX XXXX"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-navy-800 text-navy-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${errors.phone ? 'border-red-400' : 'border-gray-200 dark:border-navy-700'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service Required *
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-navy-800 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${errors.service ? 'border-red-400' : 'border-gray-200 dark:border-navy-700'}`}
                  >
                    <option value="">Select a service...</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Medical Specialty *
                  </label>
                  <select
                    name="specialty"
                    value={form.specialty}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-navy-800 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${errors.specialty ? 'border-red-400' : 'border-gray-200 dark:border-navy-700'}`}
                  >
                    <option value="">Select your specialty...</option>
                    {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Details *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Briefly describe your research project, study stage, data availability, deadline, and any specific requirements..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-navy-800 text-navy-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none transition-all ${errors.message ? 'border-red-400' : 'border-gray-200 dark:border-navy-700'}`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-navy-900 hover:bg-navy-800 dark:bg-gold-500 dark:hover:bg-gold-400 text-white dark:text-navy-900 font-bold rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-95 shadow-lg"
                >
                  <FiSend size={18} />
                  Send Message
                </button>

                <p className="text-center text-gray-400 text-xs">
                  Your information is handled with strict confidentiality.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
