import { ArrowRight, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { images } from '../lib/images';
import { sendContactEmail, ContactFormData } from '../lib/emailService';
import { supabase } from '../lib/supabase';

function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [showcaseOffset, setShowcaseOffset] = useState(0);
  const showcase2Ref = useRef<HTMLDivElement>(null);
  const [showcase2Offset, setShowcase2Offset] = useState(0);
  const showcase3Ref = useRef<HTMLDivElement>(null);
  const [showcase3Offset, setShowcase3Offset] = useState(0);

  const [heroFormLoading, setHeroFormLoading] = useState(false);
  const [heroFormStatus, setHeroFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [heroFormMessage, setHeroFormMessage] = useState('');

  const [ctaFormLoading, setCtaFormLoading] = useState(false);
  const [ctaFormStatus, setCtaFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [ctaFormMessage, setCtaFormMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (showcaseRef.current) {
        const rect = showcaseRef.current.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const elementBottom = elementTop + rect.height;
        const currentScroll = window.scrollY;

        if (currentScroll > elementTop && currentScroll < elementBottom) {
          const relativeScroll = currentScroll - elementTop;
          setShowcaseOffset(relativeScroll * 0.4);
        } else if (currentScroll >= elementBottom) {
          setShowcaseOffset((elementBottom - elementTop) * 0.4);
        } else {
          setShowcaseOffset(0);
        }
      }

      if (showcase2Ref.current) {
        const rect = showcase2Ref.current.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const elementBottom = elementTop + rect.height;
        const currentScroll = window.scrollY;

        if (currentScroll > elementTop && currentScroll < elementBottom) {
          const relativeScroll = currentScroll - elementTop;
          setShowcase2Offset(relativeScroll * 0.4);
        } else if (currentScroll >= elementBottom) {
          setShowcase2Offset((elementBottom - elementTop) * 0.4);
        } else {
          setShowcase2Offset(0);
        }
      }

      if (showcase3Ref.current) {
        const rect = showcase3Ref.current.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const elementBottom = elementTop + rect.height;
        const currentScroll = window.scrollY;

        if (currentScroll > elementTop && currentScroll < elementBottom) {
          const relativeScroll = currentScroll - elementTop;
          setShowcase3Offset(relativeScroll * 0.4);
        } else if (currentScroll >= elementBottom) {
          setShowcase3Offset((elementBottom - elementTop) * 0.4);
        } else {
          setShowcase3Offset(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHeroFormLoading(true);
    setHeroFormStatus('idle');
    setHeroFormMessage('');

    const formData = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: (formData.get('message') as string) || '',
    };

    let emailSent = false;

    try {
      await sendContactEmail(data);
      emailSent = true;
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        form_location: 'hero',
        email_sent: emailSent,
      });

      if (error) {
        console.error('Database error:', error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }

    setHeroFormStatus('success');
    setHeroFormMessage("Thanks! We'll contact you within 24 hours.");
    e.currentTarget.reset();
    setHeroFormLoading(false);

    setTimeout(() => {
      setHeroFormStatus('idle');
      setHeroFormMessage('');
    }, 5000);
  };

  const handleCtaFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCtaFormLoading(true);
    setCtaFormStatus('idle');
    setCtaFormMessage('');

    const formData = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: (formData.get('message') as string) || '',
    };

    let emailSent = false;

    try {
      await sendContactEmail(data);
      emailSent = true;
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        form_location: 'cta',
        email_sent: emailSent,
      });

      if (error) {
        console.error('Database error:', error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }

    setCtaFormStatus('success');
    setCtaFormMessage("Thanks! We'll contact you within 24 hours.");
    e.currentTarget.reset();
    setCtaFormLoading(false);

    setTimeout(() => {
      setCtaFormStatus('idle');
      setCtaFormMessage('');
    }, 5000);
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gray-200 border-b border-gray-300">
        </div>
        <div className="relative flex items-center justify-between h-20">
          <a href="/" className="hidden lg:flex flex-shrink-0 items-center group cursor-pointer pl-4 lg:pl-8">
            <div className="relative">
              <img
                src={images.logo}
                alt="Ultimate Landscape Services Logo"
                className="h-32 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </a>

          <div className="flex lg:hidden items-center justify-between w-full px-2 sm:px-4">
            <a href="/" className="flex items-center group cursor-pointer flex-shrink-0">
              <div className="relative flex-shrink-0">
                <img
                  src={images.logo}
                  alt="Ultimate Landscape Services Logo"
                  className="h-24 sm:h-28 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </a>
          </div>

          <a
            href="tel:+14073246738"
            className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 px-2 sm:px-3 lg:px-8 h-20 text-white hover:opacity-90 transition-all duration-300 font-semibold whitespace-nowrap flex-shrink-0"
            style={{ backgroundColor: '#f06916' }}
          >
            <Phone size={18} className="sm:w-5 sm:h-5 lg:w-[22px] lg:h-[22px]" />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="text-[10px] sm:text-xs lg:text-sm font-normal hidden md:inline">Call us now:</span>
              <span className="text-sm sm:text-base lg:text-xl font-bold">407-324-6738</span>
            </div>
          </a>
        </div>

        </nav>

      <div className="fixed top-20 left-0 right-0 z-40 bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-center gap-0.5 sm:gap-1 h-12 overflow-x-auto">
            <a href="#home" className="px-2 sm:px-3 lg:px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Home
            </a>
            <a href="#services" className="px-2 sm:px-3 lg:px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Services
            </a>
            <a href="#gallery" className="px-2 sm:px-3 lg:px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Gallery
            </a>
            <a href="#why-choose" className="px-2 sm:px-3 lg:px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Why Choose Us
            </a>
            <a href="#service-areas" className="px-2 sm:px-3 lg:px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Service Areas
            </a>
            <a href="/booking" className="px-2 sm:px-3 lg:px-5 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200 font-bold text-[11px] sm:text-xs lg:text-sm whitespace-nowrap rounded">
              Book Now
            </a>
          </div>
        </div>
      </div>

      <main id="home" className="pt-32">
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${images.hero})`,
              transform: `translateY(${scrollY * 0.5}px)`,
              top: '-20%',
              bottom: '-20%',
              left: 0,
              right: 0
            }}
          />
          <div className="relative">
          <div className="relative max-w-[1400px] mx-auto px-4 py-10 sm:py-12 lg:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div className="flex items-center">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.2]">
                  Landscaping Services in St. Cloud, Kissimmee & Orlando, Florida
                </h1>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-black mb-2 leading-[1.2]">
                  Request a Free Estimate
                </h2>
                <p className="text-sm text-black/70 mb-6 leading-[1.6]">
                  We'll contact you within 24 hours
                </p>

                {heroFormStatus === 'success' && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                    <CheckCircle size={20} className="flex-shrink-0" />
                    <p className="text-sm font-medium">{heroFormMessage}</p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleHeroFormSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-black mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-black mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-black mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black"
                      placeholder="(407) 555-0123"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-black mb-1.5">
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black resize-none"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={heroFormLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Get Free Estimate
                  </button>
                </form>
              </div>
            </div>
          </div>
          </div>
        </div>

        <section id="services" className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4 leading-[1.2]">
                We offer <span className="text-[#f06916]">professional landscaping</span> services throughout <span className="text-[#f06916]">St. Cloud, Kissimmee, and Orlando, Florida</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#f06916] hover:border-[#f06916] hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={images.landscapeCard}
                    alt="Landscape Design"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-4 leading-[1.2]">
                    Landscape Design
                  </h3>
                  <p className="text-base text-black/80 leading-[1.6]">
                    Custom landscape designs tailored to enhance curb appeal, functionality, and long-term value for Florida homes.
                  </p>
                </div>
              </div>

              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-lime-500/50 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={images.sod}
                    alt="Sod Installation"
                    className="w-full h-full object-cover scale-125 group-hover:scale-[1.35] transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-4 leading-[1.2]">
                    Sod Installation
                  </h3>
                  <p className="text-base text-black/80 leading-[1.6]">
                    High-quality sod installation for instant, healthy lawns that thrive in Central Florida's climate.
                  </p>
                </div>
              </div>

              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-lime-500/50 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={images.curbInstallation}
                    alt="Custom Curb Installation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-4 leading-[1.2]">
                    Custom Curb Installation
                  </h3>
                  <p className="text-base text-black/80 leading-[1.6]">
                    Decorative concrete and landscape curbing to define beds, prevent erosion, and elevate your property's look.
                  </p>
                </div>
              </div>

              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-lime-500/50 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={images.irrigationRepair}
                    alt="Irrigation Repair"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-4 leading-[1.2]">
                    Irrigation Repair
                  </h3>
                  <p className="text-base text-black/80 leading-[1.6]">
                    Sprinkler system diagnostics, repairs, and upgrades to keep your lawn properly watered and efficient.
                  </p>
                </div>
              </div>

              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-lime-500/50 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={images.lawnMaintenance}
                    alt="Lawn Maintenance"
                    className="w-full h-full object-cover object-[center_30%] group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-4 leading-[1.2]">
                    Lawn Maintenance
                  </h3>
                  <p className="text-base text-black/80 leading-[1.6]">
                    Reliable lawn maintenance services to keep your yard clean, healthy, and consistently maintained.
                  </p>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-[#f06916] to-orange-600 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-bold text-white mb-4 leading-[1.2]">
                  Ready to Transform Your Landscape?
                </h3>
                <p className="text-base text-white/95 leading-[1.6] mb-6">
                  Get a free estimate for your next landscaping project.
                </p>
                <a
                  href="tel:+14073246738"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#f06916] rounded-lg hover:bg-white/95 transition-all duration-300 font-semibold text-base shadow-md hover:shadow-lg"
                >
                  <Phone size={20} />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="gallery" ref={showcaseRef} className="relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={images.showcase3}
              alt="Professional landscape design showcase featuring decorative spheres and custom curbing"
              className="w-full h-full object-cover"
              style={{
                transform: `translateY(${showcaseOffset}px)`
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
            <div className="max-w-[1400px] mx-auto px-8 py-12 w-full">
              <div className="max-w-[600px]">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-[1.2]">
                  Transform Your Outdoor Space
                </h3>
                <p className="text-lg text-white/95 leading-[1.6] mb-6">
                  Expert landscaping services that bring beauty, functionality, and lasting value to your property.
                </p>
                <a
                  href="tel:+14073246738"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#f06916] text-white rounded-xl hover:bg-[#d95a12] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  <Phone size={24} />
                  Get Your Free Estimate
                </a>
              </div>
            </div>
          </div>
        </section>

        <section ref={showcase2Ref} className="relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={images.showcase2}
              alt="Beautiful landscaping transformation with vibrant plants and custom design"
              className="w-full h-full object-cover"
              style={{
                transform: `translateY(${showcase2Offset}px)`
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
            <div className="max-w-[1400px] mx-auto px-8 py-12 w-full">
              <div className="max-w-[600px]">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-[1.2]">
                  Elevate Your Property's Curb Appeal
                </h3>
                <p className="text-lg text-white/95 leading-[1.6] mb-6">
                  Professional landscaping solutions designed to enhance your home's beauty and create outdoor spaces you'll love.
                </p>
                <a
                  href="tel:+14073246738"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#f06916] text-white rounded-xl hover:bg-[#d95a12] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  <Phone size={24} />
                  Schedule Your Consultation
                </a>
              </div>
            </div>
          </div>
        </section>

        <section ref={showcase3Ref} className="relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={images.showcase1}
              alt="Premium landscape design showcasing elegant outdoor living"
              className="w-full h-full object-cover"
              style={{
                transform: `translateY(${showcase3Offset}px)`
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
            <div className="max-w-[1400px] mx-auto px-8 py-12 w-full">
              <div className="max-w-[600px]">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-[1.2]">
                  Quality Craftsmanship You Can Trust
                </h3>
                <p className="text-lg text-white/95 leading-[1.6] mb-6">
                  From precision installation to meticulous maintenance, we deliver landscaping excellence that transforms your property into something extraordinary.
                </p>
                <a
                  href="tel:+14073246738"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#f06916] text-white rounded-xl hover:bg-[#d95a12] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  <Phone size={24} />
                  Start Your Project Today
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="why-choose" className="py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="max-w-[720px] mx-auto text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4 leading-[1.2]">
                Why Homeowners Choose Ultimate Landscape Services
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-12">
                <div className="border-l-4 border-lime-500 pl-8">
                  <h3 className="text-2xl font-bold text-black mb-3 leading-[1.2]">
                    Locally Owned & Operated
                  </h3>
                  <p className="text-base text-black/80 leading-[1.6]">
                    As a local business, we understand the unique landscaping challenges of Central Florida. We're invested in our community and committed to building lasting relationships with homeowners.
                  </p>
                </div>

                <div className="border-l-4 border-lime-500 pl-8">
                  <h3 className="text-2xl font-bold text-black mb-3 leading-[1.2]">
                    Professional & Reliable Service
                  </h3>
                  <p className="text-base text-black/80 leading-[1.6]">
                    We show up on time, communicate clearly, and deliver consistent results. Our team brings expertise and professionalism to every project, big or small.
                  </p>
                </div>

                <div className="border-l-4 border-lime-500 pl-8">
                  <h3 className="text-2xl font-bold text-black mb-3 leading-[1.2]">
                    Attention to Detail on Every Project
                  </h3>
                  <p className="text-base text-black/80 leading-[1.6]">
                    We don't cut corners. From precise edging to thorough cleanup, we take pride in the quality of our work and ensure your property looks its absolute best.
                  </p>
                </div>

                <div className="border-l-4 border-lime-500 pl-8">
                  <h3 className="text-2xl font-bold text-black mb-3 leading-[1.2]">
                    Honest Pricing & Clear Communication
                  </h3>
                  <p className="text-base text-black/80 leading-[1.6]">
                    No hidden fees or surprises. We provide transparent estimates and keep you informed throughout the entire process, so you always know what to expect.
                  </p>
                </div>

                <div className="border-l-4 border-lime-500 pl-8">
                  <h3 className="text-2xl font-bold text-black mb-3 leading-[1.2]">
                    Serving Central Florida Homeowners
                  </h3>
                  <p className="text-base text-black/80 leading-[1.6]">
                    From Orlando to Kissimmee, Oviedo to St. Cloud, we're proud to serve homeowners throughout Central Florida with dependable landscaping services they can trust.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px]">
                  <img
                    src={images.teamMember}
                    alt="Ultimate Landscape Services Team Member"
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="service-areas" className="py-24 bg-slate-50">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="max-w-[1000px] mx-auto text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4 leading-[1.2]">
                We proudly provide <span className="text-[#f06916]">professional landscaping</span> and <span className="text-[#f06916]">irrigation services</span> throughout <span className="text-[#f06916]">Central Florida</span> and surrounding communities.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <MapPin className="text-orange-500 w-6 h-6 flex-shrink-0" />
                    <h3 className="text-base text-black font-medium">St. Cloud, FL</h3>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <MapPin className="text-orange-500 w-6 h-6 flex-shrink-0" />
                    <h3 className="text-base text-black font-medium">Kissimmee, FL</h3>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <MapPin className="text-orange-500 w-6 h-6 flex-shrink-0" />
                    <h3 className="text-base text-black font-medium">Orlando, FL</h3>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <MapPin className="text-orange-500 w-6 h-6 flex-shrink-0" />
                    <h3 className="text-base text-black font-medium">Oviedo, FL</h3>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <MapPin className="text-orange-500 w-6 h-6 flex-shrink-0" />
                    <h3 className="text-base text-black font-medium">Ocoee, FL</h3>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <MapPin className="text-orange-500 w-6 h-6 flex-shrink-0" />
                    <h3 className="text-base text-black font-medium">Winter Garden, FL</h3>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <a
                    href="tel:+14073246738"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#f06916] text-white rounded-xl hover:bg-[#d95a12] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    <Phone size={24} />
                    Call 407-324-6738
                  </a>
                  <a
                    href="#services"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#f06916] rounded-xl hover:bg-slate-50 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl border-2 border-[#f06916]"
                  >
                    And More
                    <ArrowRight size={24} />
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-lg">
                <iframe
                  src="https://maps.google.com/maps?cid=9780115015933702841&output=embed"
                  loading="lazy"
                  width="100%"
                  height="480"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                  allowFullScreen
                  className="w-full"
                  style={{ border: 0 }}
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-24 bg-gradient-to-br from-orange-500 to-orange-600">
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 leading-[1.2]">
                  Ready to Improve Your Yard? Let's Get Started
                </h2>
                <p className="text-xl text-white/95 mb-12 leading-[1.6]">
                  Local professionals serving St. Cloud, Kissimmee, and Orlando. Clear pricing. No pressure. Just honest landscaping work done right.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:+14073246738"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 rounded-xl hover:bg-white/95 transition-all duration-300 shadow-2xl hover:shadow-3xl font-bold text-lg min-h-[56px]"
                  >
                    <Phone size={24} />
                    Call a Local Expert
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-black mb-2 leading-[1.2]">
                  Request a Free Estimate
                </h3>
                <p className="text-sm text-black/70 mb-6 leading-[1.6]">
                  We'll contact you within 24 hours
                </p>

                {ctaFormStatus === 'success' && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                    <CheckCircle size={20} className="flex-shrink-0" />
                    <p className="text-sm font-medium">{ctaFormMessage}</p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleCtaFormSubmit}>
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-black mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-black mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-semibold text-black mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      required
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black"
                      placeholder="(407) 555-0123"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-black mb-1.5">
                      Project Details
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={3}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black resize-none"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={ctaFormLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Get Free Estimate
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
