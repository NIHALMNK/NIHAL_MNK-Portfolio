import SectionShell from '../layout/SectionShell';
import SectionHeading from '../common/SectionHeading';

const Roles = ({ roles = [], heading }) => {
  const hasHeading = Boolean(heading?.eyebrow || heading?.title || heading?.description);
  const hasRoles = roles.length > 0;

  return (
    <SectionShell>
      <div className="space-y-10">
        {hasHeading && (
          <SectionHeading eyebrow={heading?.eyebrow} title={heading?.title} description={heading?.description} />
        )}
        {hasRoles ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div
                key={role.name}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6"
                data-cursor
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">{role.name}</h3>
                  <span className="text-xs uppercase tracking-[0.4em] text-teal-200">Role</span>
                </div>
                <p className="text-sm text-slate-300">{role.stacks.join(', ')}</p>
                {role.tools && role.tools.length > 0 && (
                  <p className="text-sm text-slate-400 mt-2">Tools: {role.tools.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No roles configured yet.</p>
        )}
      </div>
    </SectionShell>
  );
};

export default Roles;
