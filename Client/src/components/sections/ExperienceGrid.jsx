import SectionShell from '../layout/SectionShell';

const ExperienceGrid = ({ stats }) => (
  <SectionShell id="experience" noPadding>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" data-cursor>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-5 hover:-translate-y-1 transition-transform"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">{stat.label}</p>
          <p className="text-2xl md:text-3xl font-semibold mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  </SectionShell>
);

export default ExperienceGrid;
