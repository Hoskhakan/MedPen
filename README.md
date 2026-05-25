# MEDPEN — Medical Academic Writing & Research Support

A professional, modern, fully-responsive Next.js website for **MEDPEN**, a specialized medical academic writing and research support service.

---

## Tech Stack

| Technology     | Version  | Purpose                        |
|----------------|----------|--------------------------------|
| Next.js        | 14       | React framework (App Router)   |
| React          | 18       | UI library                     |
| TypeScript     | 5        | Type safety                    |
| Tailwind CSS   | 3.4      | Utility-first styling          |
| Framer Motion  | 11       | Smooth animations              |
| React Icons    | 5        | Icon library                   |
| react-intersection-observer | 9 | Scroll-triggered animations |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd medpen

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with SEO metadata
│   ├── page.tsx          # Main page (assembles all sections)
│   └── globals.css       # Global styles and Tailwind utilities
└── components/
    ├── Navbar.tsx         # Sticky navigation with dark mode toggle
    ├── Hero.tsx           # Hero section with CTA buttons
    ├── About.tsx          # About MEDPEN section
    ├── Services.tsx       # Services grid (12 service cards)
    ├── Workflow.tsx       # 5-step process section
    ├── WhyChoose.tsx      # Trust points (8 reasons)
    ├── Stats.tsx          # Animated achievement counters
    ├── Specialties.tsx    # Supported medical specialties
    ├── Testimonials.tsx   # Client testimonials carousel
    ├── FAQ.tsx            # Accordion FAQ section
    ├── Contact.tsx        # Contact form + WhatsApp/Facebook
    ├── Footer.tsx         # Site footer
    ├── FloatingWhatsApp.tsx  # Floating WhatsApp button
    └── BackToTop.tsx      # Back-to-top button
```

---

## Easy Customization

### 1. Brand Links
Both WhatsApp and Facebook links are set in each component. To update them globally, search for:
- WhatsApp: `https://wa.me/message/RD2MBNPA3USBN1`
- Facebook: `https://www.facebook.com/share/1B79TgQNKh/`

### 2. Colors
Edit `tailwind.config.ts` to change the brand color palette:
- **Navy**: `colors.navy.*` — primary background/text color
- **Gold**: `colors.gold.*` — accent color

### 3. Statistics
Edit the `stats` array in `src/components/Stats.tsx` to update achievement numbers.

### 4. Services
Edit the `services` array in `src/components/Services.tsx` to add, remove, or modify services.

### 5. Specialties
Edit the `specialties` array in `src/components/Specialties.tsx`.

### 6. FAQ
Edit the `faqs` array in `src/components/FAQ.tsx`.

### 7. SEO Metadata
Edit `src/app/layout.tsx` to update the page title, description, and Open Graph data.

### 8. Contact Form Backend
The contact form in `src/components/Contact.tsx` currently uses frontend validation only.
To add a backend, replace the `// TODO: integrate backend` comment in the `handleSubmit`
function with your API call (e.g., Resend, EmailJS, Formspree, or your own endpoint).

---

## Features

- Fully responsive (mobile-first design)
- Dark / light mode toggle (persisted in localStorage)
- Smooth scroll navigation
- Framer Motion animations (scroll-triggered)
- Animated statistics counters
- Testimonials carousel
- Accordion FAQ
- Contact form with validation
- Floating WhatsApp button with tooltip
- Back-to-top button
- SEO-optimized metadata
- Accessibility-friendly (ARIA labels, semantic HTML)

---

## License

All rights reserved — MEDPEN.
