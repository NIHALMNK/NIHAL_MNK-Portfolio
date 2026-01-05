import { useState, useRef } from 'react';
import SectionShell from '../layout/SectionShell';
import SectionHeading from '../common/SectionHeading';

const Contact = ({ content = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '' // Anti-spam field
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, error: '', success: false });
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const formRef = useRef(null);

  const hasHeading = Boolean(content?.eyebrow || content?.title || content?.description);
  const hasPrimaryCta = Boolean(content?.primaryCta?.label);
  const hasSecondaryCta = Boolean(content?.secondaryCta?.label);

  const MAX_MESSAGE_LENGTH = 500;
  const MIN_MESSAGE_LENGTH = 10;
  const RATE_LIMIT_MS = 5000; // 5 seconds between submissions

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim()
    };

    if (!trimmedData.name) {
      newErrors.name = 'Name is required';
    } else if (trimmedData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!trimmedData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(trimmedData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!trimmedData.message) {
      newErrors.message = 'Message is required';
    } else if (trimmedData.message.length < MIN_MESSAGE_LENGTH) {
      newErrors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
    } else if (trimmedData.message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error message
    if (status.error) {
      setStatus(prev => ({ ...prev, error: '' }));
    }
  };

  const handleKeyPress = (e) => {
    // Allow Enter key to submit (except in textarea)
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Check honeypot (anti-spam)
    if (formData.honeypot) {
      console.log('Spam detected');
      return;
    }

    // Rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      setStatus({ 
        loading: false, 
        error: 'Please wait a few seconds before submitting again', 
        success: false 
      });
      return;
    }

    // Validate form
    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setStatus({ loading: true, error: '', success: false });
    setLastSubmitTime(now);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setStatus({ loading: false, error: '', success: true });
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      setErrors({});
      
      // Reset success message after 8 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 8000);
    } catch (error) {
      setStatus({ 
        loading: false, 
        error: error.message || 'Something went wrong. Please try again.', 
        success: false 
      });
    }
  };

  const messageLength = formData.message.length;
  const isMessageTooLong = messageLength > MAX_MESSAGE_LENGTH;

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
                
                  <a href={content?.primaryCta?.href}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-900 font-semibold text-center hover:opacity-90 transition-opacity"
                >
                  {content?.primaryCta?.label}
                </a>
              )}
              {hasSecondaryCta && (
                
                  <a href={content?.secondaryCta?.href}
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

        <div ref={formRef} className="space-y-4" data-cursor onKeyPress={handleKeyPress}>
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />

          {status.error && (
            <div 
              className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200"
              role="alert"
              aria-live="polite"
            >
              {status.error}
            </div>
          )}
          
          {status.success && (
            <div 
              className="rounded-2xl border border-teal-500/40 bg-teal-500/10 p-3 text-sm text-teal-200"
              role="alert"
              aria-live="polite"
            >
              ✓ Message sent successfully! We'll get back to you soon.
            </div>
          )}

          <div>
            <label htmlFor="name" className="text-sm text-slate-300 block mb-1">
              Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl bg-white/5 border ${
                errors.name ? 'border-rose-500/40' : 'border-white/10'
              } focus:border-teal-300 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="Your name"
              disabled={status.loading}
              aria-required="true"
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              maxLength={100}
            />
            {errors.name && (
              <p id="name-error" className="text-xs text-rose-400 mt-1" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-sm text-slate-300 block mb-1">
              Email <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl bg-white/5 border ${
                errors.email ? 'border-rose-500/40' : 'border-white/10'
              } focus:border-teal-300 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="you@email.com"
              disabled={status.loading}
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              maxLength={100}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-rose-400 mt-1" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="message" className="text-sm text-slate-300">
                Message <span className="text-rose-400">*</span>
              </label>
              <span 
                className={`text-xs ${
                  isMessageTooLong 
                    ? 'text-rose-400' 
                    : messageLength > MAX_MESSAGE_LENGTH * 0.9 
                    ? 'text-amber-400' 
                    : 'text-slate-500'
                }`}
              >
                {messageLength}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-3 rounded-2xl bg-white/5 border ${
                errors.message ? 'border-rose-500/40' : 'border-white/10'
              } focus:border-teal-300 outline-none transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="Tell me about your idea"
              disabled={status.loading}
              aria-required="true"
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : 'message-hint'}
              maxLength={MAX_MESSAGE_LENGTH + 50}
            />
            {errors.message ? (
              <p id="message-error" className="text-xs text-rose-400 mt-1" role="alert">
                {errors.message}
              </p>
            ) : (
              <p id="message-hint" className="text-xs text-slate-500 mt-1">
                Minimum {MIN_MESSAGE_LENGTH} characters required
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={status.loading || isMessageTooLong}
            className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            aria-label={status.loading ? 'Sending message' : 'Send message'}
          >
            {status.loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      </div>
    </SectionShell>
  );
};

export default Contact;