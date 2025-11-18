import SectionShell from '../layout/SectionShell';

const SiteFooter = ({ socials = [], profile }) => (
  <footer className="border-t border-white/10 bg-black/40 backdrop-blur-2xl mt-16">
    <SectionShell noPadding>
      <div className="max-w-6xl mx-auto px-0 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          {profile?.label && <p className="font-display text-xl">{profile.label}</p>}
          {profile?.tagline && <p className="text-slate-400">{profile.tagline}</p>}
        </div>
        {socials.length > 0 && (
          <div className="flex gap-4 text-sm uppercase tracking-[0.3em] text-slate-300" data-cursor>
            {socials.map((social) => (
              <a key={social.label || social} href={social.href || '#'} className="hover:text-white">
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
