import { useState } from 'react';
import SectionShell from '../layout/SectionShell';
import SectionHeading from '../common/SectionHeading';

const Contact = ({ content = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const hasHeading = Boolean(content?.eyebrow || content?.title || content?.description);
  const hasPrimaryCta = Boolean(content?.primaryCta?.label);
  const hasSecondaryCta = Boolean(content?.secondaryCta?.label);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ loading: false, error: 'Please fill in all fields', success: false });
      return;
    }

    if (formData.message.length < 10) {
      setStatus({ loading: false, error: 'Message should be at least 10 characters', success: false });
      return;
    }

    setStatus({ loading: true, error: '', success: false });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setStatus({ loading: false, error: '', success: true });
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <SectionShell id="contact">
      <div className="grid lg:grid-cols-2 gap-10 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10">
        <div className="space-y-4">
          {hasHeading ? (
            <SectionHeading
              eyebrow={content?.eyebrow}
              title={content?.title}
              description={content?.description}
            />
          ) : (
            <p className="text-sm text-slate-400">Add contact copy in the admin dashboard to show it here.</p>
          )}
          {(hasPrimaryCta || hasSecondaryCta) && (
            <div className="flex flex-wrap gap-4" data-cursor>
              {hasPrimaryCta && (
                <a
                  href={content?.primaryCta?.href}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-900 font-semibold text-center"
                >
                  {content?.primaryCta?.label}
                </a>
              )}
              {hasSecondaryCta && (
                <a
                  href={content?.secondaryCta?.href}
                  download="nihal.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full border border-white/20 text-center hover:border-teal-400/40 hover:bg-teal-400/5 transition-all"
                >
                  {content?.secondaryCta?.label}
                </a>
              )}
            </div>
          )}
        </div>
        <div className="space-y-4" data-cursor>
          {status.error && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="rounded-2xl border border-teal-500/40 bg-teal-500/10 p-3 text-sm text-teal-200">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}
          <div>
            <label className="text-sm text-slate-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-teal-300 outline-none"
              placeholder="Your name"
              disabled={status.loading}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-teal-300 outline-none"
              placeholder="you@email.com"
              disabled={status.loading}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full mt-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-teal-300 outline-none"
              placeholder="Tell me about your idea"
              disabled={status.loading}
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status.loading}
            className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.loading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>
    </SectionShell>
  );
};

export default Contact;