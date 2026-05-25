import Navbar         from '@/components/Navbar'
import Hero           from '@/components/Hero'
import About          from '@/components/About'
import Services       from '@/components/Services'
import Workflow       from '@/components/Workflow'
import WhyChoose      from '@/components/WhyChoose'
import Stats          from '@/components/Stats'
import Specialties    from '@/components/Specialties'
import Testimonials   from '@/components/Testimonials'
import FAQ            from '@/components/FAQ'
import Contact        from '@/components/Contact'
import Footer         from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import BackToTop      from '@/components/BackToTop'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Workflow />
        <WhyChoose />
        <Stats />
        <Specialties />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </>
  )
}
