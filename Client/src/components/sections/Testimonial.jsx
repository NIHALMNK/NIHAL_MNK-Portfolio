import SectionShell from '../layout/SectionShell';
import SectionHeading from '../common/SectionHeading';

const Testimonial = ({ quote }) => (
  <SectionShell>
    <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-10 space-y-6">
      <SectionHeading eyebrow="Testimonials" title="What collaborators say." />
      <blockquote className="text-2xl md:text-3xl text-white/90 leading-relaxed">{quote}</blockquote>
    </div>
  </SectionShell>
);

export default Testimonial;
