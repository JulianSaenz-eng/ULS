import { Phone, CheckCircle, Calendar } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { images } from '../lib/images';
import { sendContactEmail, ContactFormData } from '../lib/emailService';
import { supabase } from '../lib/supabase';

function BookingPage() {
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormStatus('idle');
    setFormMessage('');

    const formData = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: `Service Requested: ${formData.get('service')}\nPreferred Date: ${formData.get('date')}\n\n${formData.get('message') || ''}`,
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
        form_location: 'booking',
        email_sent: emailSent,
      });

      if (error) {
        console.error('Database error:', error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }

    setFormStatus('success');
    setFormMessage("Thanks! We'll contact you within 24 hours to confirm your appointment.");
    e.currentTarget.reset();
    setFormLoading(false);

    setTimeout(() => {
      setFormStatus('idle');
      setFormMessage('');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gray-200 border-b border-gray-300" />
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
            <a href="/" className="px-2 sm:px-3 lg:px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Home
            </a>
            <a href="/#services" className="px-2 sm:px-3 lg:px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Services
            </a>
            <a href="/#gallery" className="px-2 sm:px-3 lg:px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Gallery
            </a>
            <a href="/#why-choose" className="px-2 sm:px-3 lg:px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Why Choose Us
            </a>
            <a href="/#service-areas" className="px-2 sm:px-3 lg:px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Service Areas
            </a>
            <a href="/booking" className="px-2 sm:px-3 lg:px-5 py-2 text-orange-600 hover:text-orange-700 transition-colors duration-200 font-bold text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">
              Book Now
            </a>
          </div>
        </div>
      </div>

      <main className="pt-32">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-orange-600 w-10 h-10" />
                <h1 className="text-4xl sm:text-5xl font-bold text-black leading-[1.2]">
                  Schedule Your Landscaping Service
                </h1>
              </div>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-black/80 leading-[1.6]">
                  Ready to transform your outdoor space? Book a consultation with our expert landscaping team serving St. Cloud, Kissimmee, and Orlando.
                </p>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <h2 className="text-2xl font-bold text-black mb-4 leading-[1.2]">
                    What to Expect
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-lime-500 w-6 h-6 flex-shrink-0 mt-0.5" />
                      <span className="text-base text-black/80 leading-[1.6]">
                        We'll contact you within 24 hours to confirm your appointment
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-lime-500 w-6 h-6 flex-shrink-0 mt-0.5" />
                      <span className="text-base text-black/80 leading-[1.6]">
                        Free on-site consultation and detailed estimate
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-lime-500 w-6 h-6 flex-shrink-0 mt-0.5" />
                      <span className="text-base text-black/80 leading-[1.6]">
                        Professional recommendations tailored to your property
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-lime-500 w-6 h-6 flex-shrink-0 mt-0.5" />
                      <span className="text-base text-black/80 leading-[1.6]">
                        Transparent pricing with no hidden fees
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                  <h3 className="text-xl font-bold text-orange-900 mb-2 leading-[1.2]">
                    Need immediate assistance?
                  </h3>
                  <p className="text-base text-orange-800 mb-4 leading-[1.6]">
                    Call us directly for urgent requests or same-day service
                  </p>
                  <a
                    href="tel:+14073246738"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 font-bold text-base shadow-md"
                  >
                    <Phone size={20} />
                    407-324-6738
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 lg:sticky lg:top-36">
              <h2 className="text-2xl font-bold text-black mb-2 leading-[1.2]">
                Book Your Consultation
              </h2>
              <p className="text-sm text-black/70 mb-6 leading-[1.6]">
                Fill out the form below and we'll get back to you within 24 hours
              </p>

              {formStatus === 'success' && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                  <CheckCircle size={20} className="flex-shrink-0" />
                  <p className="text-sm font-medium">{formMessage}</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleFormSubmit}>
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
                  <label htmlFor="service" className="block text-sm font-semibold text-black mb-1.5">
                    Service Needed *
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black"
                  >
                    <option value="">Select a service</option>
                    <option value="Landscape Design">Landscape Design</option>
                    <option value="Sod Installation">Sod Installation</option>
                    <option value="Custom Curb Installation">Custom Curb Installation</option>
                    <option value="Irrigation Repair">Irrigation Repair</option>
                    <option value="Lawn Maintenance">Lawn Maintenance</option>
                    <option value="Other">Other / Multiple Services</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-semibold text-black mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-black mb-1.5">
                    Additional Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm text-black resize-none"
                    placeholder="Tell us about your project, property size, or any specific requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? 'Submitting...' : 'Book Consultation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-200 border-t border-gray-300 py-8 mt-24">
        <div className="max-w-[1200px] mx-auto px-8 text-center">
          <p className="text-sm text-black/70">
            © {new Date().getFullYear()} Ultimate Landscape Services. Serving St. Cloud, Kissimmee, Orlando & surrounding areas.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default BookingPage;
