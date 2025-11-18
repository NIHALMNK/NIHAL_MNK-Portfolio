import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const SectionShell = ({ id, children, className = '', noPadding = false }) => (
  <motion.section
    id={id}
    className={`relative ${noPadding ? '' : 'py-10 md:py-16'} ${className}`.trim()}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={sectionVariants}
  >
    <div className="relative" data-cursor>
      {children}
    </div>
  </motion.section>
);

export default SectionShell;
