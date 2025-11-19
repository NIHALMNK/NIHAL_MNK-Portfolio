import { useCallback, useEffect, useState } from 'react';
import CustomCursor from '../components/CustomCursor';
import Hero from '../components/sections/Hero';
import ExperienceGrid from '../components/sections/ExperienceGrid';
import Services from '../components/sections/Services';
import About from '../components/sections/About';
import Roles from '../components/sections/Roles';
import RecentWork from '../components/sections/RecentWork';
import Collaborations from '../components/sections/Collaborations';
import StartupProjects from '../components/sections/StartupProjects';
import TestimonialsCarousel from '../components/sections/TestimonialsCarousel';
import Contact from '../components/sections/Contact';
import SiteFooter from '../components/sections/SiteFooter';
import { API_BASE_URL } from '../config';

function PortfolioPage() {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: '' });

  useEffect(() => {
    const controller = new AbortController();
    const loadContent = async () => {
      setStatus({ loading: true, error: '' });
      try {
        const response = await fetch(`${API_BASE_URL}/api/content`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Failed to load site content');
        }
        const data = await response.json();
        setContent(data);
        setStatus({ loading: false, error: '' });
      } catch (error) {
        if (error.name === 'AbortError') return;
        setStatus({ loading: false, error: error.message });
      }
    };

    loadContent();
    return () => controller.abort();
  }, []);

  const handleStarterLike = useCallback(
    async (projectId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/starter-projects/${projectId}/like`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Unable to update likes right now');
        }
        const result = await response.json();
        setContent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            starterProjects: prev.starterProjects.map((project) =>
              project._id === projectId ? { ...project, likes: result.likes } : project
            ),
          };
        });
      } catch (error) {
        console.error(error);
      }
    },
    [setContent]
  );

  const isLoading = status.loading;
  const hasError = Boolean(status.error);

  return (
    <div className="bg-[#050816] text-white min-h-screen">
      <CustomCursor color="#ffffff" ringColor="rgba(96, 245, 255, 0.9)" points={7} ringSize={54} pointSize={4} />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute -top-32 -right-24 w-[480px] h-[480px] bg-[#5f3df7] blur-[120px] rounded-full" />
          <div className="absolute top-40 left-10 w-[360px] h-[360px] bg-[#2be4dc] blur-[150px] rounded-full" />
          <div className="absolute bottom-10 right-1/4 w-[280px] h-[280px] bg-[#ff4fd8] blur-[140px] rounded-full" />
        </div>

        <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
          {hasError && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200 mb-8">
              {status.error}
            </div>
          )}
          {isLoading && (
            <div className="py-24 text-center text-slate-300 animate-pulse">Loading portfolio content…</div>
          )}
          {!isLoading && content && (
            <>
              <Hero content={content.heroContent} />
              <br />
              {content.stats?.length > 0 && <ExperienceGrid stats={content.stats} />}
              <Services services={content.services} heading={content.sectionCopy?.services} />
              <About
                copy={content.aboutCopy}
                heading={content.sectionCopy?.about}
                principles={content.aboutDetails?.principles}
                instruments={content.aboutDetails?.instruments}
              />
              <Roles roles={content.roles} heading={content.sectionCopy?.roles} />
              <RecentWork gallery={content.projects} moreProjects={content.moreProjects} heading={content.sectionCopy?.work} />
              <Collaborations brands={content.collaborations} heading={content.sectionCopy?.collaborations} />
              <StartupProjects
                projects={content.starterProjects}
                heading={content.sectionCopy?.startups}
                onLike={handleStarterLike}
              />
              <TestimonialsCarousel
                testimonials={content.testimonials}
                heading={content.sectionCopy?.testimonials}
                apiBaseUrl={API_BASE_URL}
              />
              <Contact content={content.contactContent} />
            </>
          )}
        </main>
      </div>

      {!isLoading && content && <SiteFooter socials={content.socials} profile={content.footerProfile} />}
    </div>
  );
}

export default PortfolioPage;

