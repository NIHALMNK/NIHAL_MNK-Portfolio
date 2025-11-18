import { motion } from 'framer-motion';

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const SectionHeading = ({ eyebrow, title, description, align = 'left' }) => {
  const alignmentClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return (
    <motion.div
      className={`space-y-4 ${alignmentClass}`}
      variants={headingVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {eyebrow && (
        <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-teal-200">{eyebrow}</p>
      )}
      {title && (
        <h2 className="text-3xl md:text-4xl font-display leading-tight max-w-3xl mx-auto">{title}</h2>
      )}
      {description && (
        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">{description}</p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
