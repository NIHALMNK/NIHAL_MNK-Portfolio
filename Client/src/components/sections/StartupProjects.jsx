import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import SectionShell from '../layout/SectionShell';
import SectionHeading from '../common/SectionHeading';

const displayCount = 3;

const StartupProjects = ({ projects = [], heading, onLike }) => {
  const hasHeading = Boolean(heading?.eyebrow || heading?.title || heading?.description);
  const hasProjects = projects.length > 0;
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (projects.length <= displayCount) return undefined;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [projects.length]);

  useEffect(() => {
    setStartIndex(0);
  }, [projects.length]);

  const visibleProjects = useMemo(() => {
    if (!hasProjects) return [];
    return Array.from({ length: Math.min(displayCount, projects.length) }, (_, offset) => {
      const index = (startIndex + offset) % projects.length;
      return projects[index];
    });
  }, [projects, startIndex, hasProjects]);

  return (
    <SectionShell>
      <div className="space-y-8">
        {hasHeading && (
          <SectionHeading eyebrow={heading?.eyebrow} title={heading?.title} description={heading?.description} />
        )}
        {hasProjects ? (
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${startIndex}-${projects.length}`}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="grid md:grid-cols-3 gap-6"
              >
                {visibleProjects.map((project) => (
                  <article
                    key={project._id}
                    className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6 flex flex-col gap-4"
                data-cursor
              >
                    {project.image && (
                      <div className="overflow-hidden rounded-2xl">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="h-40 w-full object-cover transition duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                <h3 className="text-2xl font-semibold">{project.name}</h3>
                      {project.description && <p className="text-sm text-slate-300">{project.description}</p>}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <button
                        onClick={() => onLike?.(project._id)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-teal-300"
                      >
                        ⭐ {project.likes ?? 0}
                        <span className="text-xs uppercase tracking-[0.3em]">Like</span>
                      </button>
                      {project.learnMoreUrl && (
                        <a
                          href={project.learnMoreUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 hover:bg-white"
                        >
                          Learn More
                        </a>
                      )}
              </div>
                  </article>
            ))}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No starter projects have been added yet.</p>
        )}
      </div>
    </SectionShell>
  );
};

export default StartupProjects;
