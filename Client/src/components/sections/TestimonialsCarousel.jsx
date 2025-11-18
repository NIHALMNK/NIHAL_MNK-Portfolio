import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionShell from '../layout/SectionShell';
import SectionHeading from '../common/SectionHeading';

const slideVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const TestimonialsCarousel = ({ testimonials = [], heading, apiBaseUrl }) => {
  const [active, setActive] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', company: '', quote: '', avatar: '' });
  const [formStatus, setFormStatus] = useState({ state: 'idle', message: '' });
  const hasHeading = Boolean(heading?.eyebrow || heading?.title || heading?.description);
  const hasTestimonials = testimonials.length > 0;

  useEffect(() => {
    if (!hasTestimonials) return undefined;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [hasTestimonials, testimonials.length]);

  const handleSelect = (index) => setActive(index);
  const current = hasTestimonials ? testimonials[active] : null;

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormStatus({ state: 'idle', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ state: 'loading', message: 'Sending your words...' });
    try {
      const response = await fetch(`${apiBaseUrl}/api/testimonials/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to submit testimonial right now');
      }
      setFormStatus({ state: 'success', message: data.message || 'Submitted for review!' });
      setFormData({ name: '', role: '', company: '', quote: '', avatar: '' });
    } catch (error) {
      setFormStatus({ state: 'error', message: error.message });
    }
  };

  return (
    <SectionShell>
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-10 space-y-10 overflow-hidden">
        {hasHeading && (
          <SectionHeading eyebrow={heading?.eyebrow} title={heading?.title} description={heading?.description} />
        )}
        {hasTestimonials ? (
          <>
            <div className="relative min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.name}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="grid lg:grid-cols-[0.4fr_1fr] gap-8 items-center"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 blur-2xl bg-teal-400/30 rounded-full" />
                      {current.avatar && (
                        <img
                          src={current.avatar}
                          alt={current.name}
                          className="relative w-24 h-24 rounded-full object-cover border-2 border-white/30"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div>
                      {current.name && <p className="text-lg font-semibold text-white">{current.name}</p>}
                      {current.role && <p className="text-sm text-slate-300">{current.role}</p>}
                    </div>
                  </div>
                  {current.quote && <p className="text-2xl text-white/90 leading-relaxed">{current.quote}</p>}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name || `testimonial-${index}`}
                  onClick={() => handleSelect(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === active ? 'w-10 bg-white' : 'w-6 bg-white/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">No testimonials available yet.</p>
        )}
        <div className="mt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:border-teal-300"
          >
            Share your experience
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#050816]/95 p-8">
              <button
                onClick={handleModalClose}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
              <h3 className="text-2xl font-semibold mb-2">Submit a testimonial</h3>
              <p className="text-sm text-slate-400 mb-6">
                Your note is reviewed before publishing to keep the section high-signal.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm text-slate-400">
                    Name
                    <input
                      type="text"
                      required
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </label>
                  <label className="text-sm text-slate-400">
                    Role
                    <input
                      type="text"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                      value={formData.role}
                      onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                    />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm text-slate-400">
                    Company
                    <input
                      type="text"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                      value={formData.company}
                      onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    />
                  </label>
                  <label className="text-sm text-slate-400">
                    Avatar URL
                    <input
                      type="url"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                      value={formData.avatar}
                      onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                    />
                  </label>
                </div>
                <label className="text-sm text-slate-400">
                  Testimonial
                  <textarea
                    required
                    rows={4}
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                    value={formData.quote}
                    onChange={(e) => setFormData((prev) => ({ ...prev, quote: e.target.value }))}
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-6 py-3 font-semibold text-slate-900"
                  disabled={formStatus.state === 'loading'}
                >
                  {formStatus.state === 'loading' ? 'Sending…' : 'Submit for review'}
                </button>
                {formStatus.message && (
                  <p
                    className={`text-sm ${
                      formStatus.state === 'error'
                        ? 'text-rose-300'
                        : formStatus.state === 'success'
                          ? 'text-teal-300'
                          : 'text-slate-400'
                    }`}
                  >
                    {formStatus.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
};

export default TestimonialsCarousel;
