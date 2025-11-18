import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import SectionShell from '../layout/SectionShell';
import SectionHeading from '../common/SectionHeading';

const RecentWork = ({ gallery = [], moreProjects, heading }) => {
  const hasHeading = Boolean(heading?.eyebrow || heading?.title || heading?.description);
  const hasProjects = gallery.length > 0;
  const [visibleCount, setVisibleCount] = useState(6);
  const visibleProjects = useMemo(() => gallery.slice(0, visibleCount), [gallery, visibleCount]);
  const hasMore = gallery.length > visibleCount;

  return (
    <SectionShell id="work">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {hasHeading && (
            <SectionHeading eyebrow={heading?.eyebrow} title={heading?.title} description={heading?.description} />
          )}
          {moreProjects?.label && (
            <div className="max-w-sm space-y-3">
              {moreProjects.blurb && <p className="text-sm text-slate-300">{moreProjects.blurb}</p>}
              {moreProjects.href && (
                <a
                  href={moreProjects.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-200 hover:text-white transition-colors"
                >
                  {moreProjects.label}
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}
        </div>
        {hasProjects ? (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {visibleProjects.map((item, index) => (
                <motion.article
                  key={item.id || item.title || `project-${index}`}
                  className="group relative rounded-3xl border border-white/10 overflow-hidden min-h-[260px]"
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                >
                  {item.image && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70 opacity-80 group-hover:opacity-90 transition duration-500" />
                  <div className="relative h-full p-6 flex flex-col justify-end gap-2">
                    {item.tag && <span className="text-xs tracking-[0.4em] uppercase text-white/80">{item.tag}</span>}
                    {item.title && <h3 className="text-2xl font-semibold">{item.title}</h3>}
                    {item.description && (
                      <motion.p
                        className="text-sm text-white/80 backdrop-blur-md bg-white/5 rounded-2xl p-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300"
                      >
                        {item.description}
                      </motion.p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-white/80">
                    {item.liveUrl && (
                      <a href={item.liveUrl} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                        View Live
                      </a>
                    )}
                    {item.githubUrl && (
                      <a href={item.githubUrl} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                        Source
                      </a>
                    )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 3, gallery.length))}
                  className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:border-teal-300"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-400">No projects have been added yet.</p>
        )}
      </div>
    </SectionShell>
  );
};

export default RecentWork;
