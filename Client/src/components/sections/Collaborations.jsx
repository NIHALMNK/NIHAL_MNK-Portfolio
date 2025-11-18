import SectionShell from '../layout/SectionShell';
import SectionHeading from '../common/SectionHeading';

const Collaborations = ({ brands = [], heading }) => {
  const hasHeading = Boolean(heading?.eyebrow || heading?.title || heading?.description);
  const formatted = brands.map((brand) =>
    typeof brand === 'string'
      ? { id: brand, name: brand }
      : { id: brand._id || brand.name, name: brand.name, logo: brand.logo, url: brand.url, highlight: brand.highlight }
  );
  const marquee = formatted.length > 0 ? [...formatted, ...formatted] : [];

  return (
    <SectionShell>
      <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 overflow-hidden">
        {hasHeading && (
          <SectionHeading eyebrow={heading?.eyebrow} title={heading?.title} description={heading?.description} />
        )}
        {marquee.length > 0 ? (
          <div className="relative overflow-hidden py-4">
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#050816] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#050816] to-transparent pointer-events-none" />
            <div className="flex gap-8 animate-marquee" data-cursor>
              {marquee.map((brand, index) => (
                <a
                  key={`${brand.id}-${index}`}
                  href={brand.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/10 bg-white/5 h-24 min-w-[200px] px-6 flex flex-col items-center justify-center text-center text-white hover:border-teal-200 transition-colors"
                >
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="h-10 object-contain" loading="lazy" />
                  ) : (
                    <span className="text-lg font-display tracking-[0.3em]">{brand.name}</span>
                  )}
                  {brand.highlight && <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mt-2">{brand.highlight}</span>}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No collaborations have been published yet.</p>
        )}
      </div>
    </SectionShell>
  );
};

export default Collaborations;
