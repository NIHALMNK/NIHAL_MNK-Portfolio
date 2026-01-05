import SectionShell from '../layout/SectionShell';

const SiteFooter = ({ socials = [], profile }) => (
  <footer className="border-t border-white/10 bg-black/40 backdrop-blur-2xl mt-16">
    <SectionShell noPadding>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
        <div>
          {profile?.label && <p className="font-display text-lg sm:text-xl">{profile.label}</p>}
          {profile?.tagline && <p className="text-sm sm:text-base text-slate-400">{profile.tagline}</p>}
        </div>
        {socials.length > 0 && (
          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-300" data-cursor>
            {socials.map((social) => (
              <a key={social.label || social} href={social.href || '#'} className="hover:text-white transition-colors">
                {social.label || social}
              </a>
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  </footer>
);

export default SiteFooter;