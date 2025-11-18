import SectionShell from '../layout/SectionShell';
import SectionHeading from '../common/SectionHeading';

const Services = ({ services = [], heading }) => {
  const hasHeading = Boolean(heading?.eyebrow || heading?.title || heading?.description);
  const hasServices = services.length > 0;

  return (
    <SectionShell id="services">
      <div className="space-y-10">
        {hasHeading && (
          <SectionHeading eyebrow={heading?.eyebrow} title={heading?.title} description={heading?.description} />
        )}
        {hasServices ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-2xl hover:-translate-y-1 transition-transform"
                data-cursor
              >
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-slate-300">{service.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No services have been published yet.</p>
        )}
      </div>
    </SectionShell>
  );
};

export default Services;
