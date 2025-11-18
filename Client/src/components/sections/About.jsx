import { motion } from 'framer-motion';
import SectionShell from '../layout/SectionShell';
import SectionHeading from '../common/SectionHeading';

const About = ({ copy, heading, principles = [], instruments = [] }) => {
  const hasHeading = Boolean(heading?.eyebrow || heading?.title || copy || heading?.description);
  const hasPrinciples = principles.length > 0;
  const hasInstruments = instruments.length > 0;

  return (
    <SectionShell id="about">
      <div className="grid lg:grid-cols-2 gap-10 items-center rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative space-y-6">
          {hasHeading ? (
            <SectionHeading
              eyebrow={heading?.eyebrow}
              title={heading?.title}
              description={copy || heading?.description}
            />
          ) : (
            <p className="text-sm text-slate-400">No about content has been published yet.</p>
          )}
        </div>
        <motion.div
          className="relative rounded-3xl border border-white/10 bg-black/20 p-8 space-y-6"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          {hasPrinciples && (
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-teal-200">Principles</p>
              <ul className="mt-4 space-y-3 text-slate-200 text-base">
                {principles.map((principle, index) => (
                  <li key={`${principle}-${index}`}>{principle}</li>
                ))}
              </ul>
            </div>
          )}
          {hasInstruments && (
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-teal-200">Instruments</p>
              <p className="text-slate-300">{instruments.join(' • ')}</p>
            </div>
          )}
          {!hasPrinciples && !hasInstruments && (
            <p className="text-sm text-slate-400">Add principles or tools through the admin dashboard.</p>
          )}
        </motion.div>
      </div>
    </SectionShell>
  );
};

export default About;
