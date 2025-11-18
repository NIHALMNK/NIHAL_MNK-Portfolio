import { motion } from 'framer-motion';
import SectionShell from '../layout/SectionShell';

const Hero = ({ content = {} }) => {
  const showEyebrow = Boolean(content.eyebrow);
  const showSubtitle = Boolean(content.subtitle);
  const showQuote = Boolean(content.quote);
  const primaryCtaEnabled = Boolean(content.primaryCta?.label);
  const secondaryCtaEnabled = Boolean(content.secondaryCta?.label);
  const highlight = content.highlight || {};
  const highlightItems = Array.isArray(highlight.items) ? highlight.items : [];
  const highlightHasContent = Boolean(highlight.eyebrow || highlight.title || highlightItems.length);

  return (
    <SectionShell noPadding className="pt-16" id="hero">
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        <div className="space-y-8">
          {showEyebrow && (
            <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-teal-200">{content.eyebrow}</p>
          )}
          {(content.title || showSubtitle) && (
            <motion.h1
              className="text-4xl md:text-6xl font-display leading-tight"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {content.title}
              {showSubtitle && <span className="block text-teal-300">{content.subtitle}</span>}
            </motion.h1>
          )}
          {showQuote && (
            <motion.p
              className="text-lg text-slate-200 max-w-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              {content.quote}
            </motion.p>
          )}
          {(primaryCtaEnabled || secondaryCtaEnabled) && (
            <div className="flex flex-wrap gap-4" data-cursor>
              {primaryCtaEnabled && (
                <a
                  href={content.primaryCta.href}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-900 font-semibold shadow-glass"
                >
                  {content.primaryCta.label}
                </a>
              )}
              {secondaryCtaEnabled && (
                <a href={content.secondaryCta.href} className="px-6 py-3 rounded-full border border-white/20 text-white">
                  {content.secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>

        {highlightHasContent && (
          <motion.div
            className="relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-glass"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[32px]" />
            <div className="relative space-y-6">
              {(highlight.eyebrow || highlight.title) && (
                <div>
                  {highlight.eyebrow && (
                    <p className="text-sm uppercase tracking-[0.4em] text-slate-300">{highlight.eyebrow}</p>
                  )}
                  {highlight.title && <h3 className="text-2xl font-display">{highlight.title}</h3>}
                </div>
              )}
              {highlightItems.length > 0 && (
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                  {highlightItems.map((item, index) => (
                    <div key={`${item.label || 'highlight'}-${index}`}>
                      {item.label && (
                        <p className="text-xs uppercase tracking-[0.4em] text-teal-200">{item.label}</p>
                      )}
                      <p>{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </SectionShell>
  );
};

export default Hero;
