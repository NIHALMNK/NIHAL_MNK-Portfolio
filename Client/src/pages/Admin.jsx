import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../config';
import ImageUploader from '../components/forms/ImageUploader.jsx';

const singleDocSections = [
  {
    key: 'site-copy',
    title: 'Global Site Copy',
    description: 'Update hero, stats, services, roles, section headings, and contact info as JSON.',
    path: '/api/content/copy',
  },
];

const collectionSections = [
  {
    key: 'projects',
    title: 'Recent Works',
    icon: '🧱',
    description: 'Cards that appear in the portfolio Recent Work grid.',
    path: '/api/projects',
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'tag', label: 'Tag / Category' },
      { name: 'image', label: 'Cover Image', type: 'image', aspect: 16 / 9 },
      { name: 'color', label: 'Gradient (ex: from-emerald-400/80 to-cyan-400/40)' },
      { name: 'liveUrl', label: 'Live URL' },
      { name: 'githubUrl', label: 'GitHub URL' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'collaborations',
    title: 'Collaborations',
    icon: '🤝',
    description: 'Logos, highlights, and optional links for the marquee scroll.',
    path: '/api/collaborations',
    fields: [
      { name: 'name', label: 'Brand Name' },
      { name: 'logo', label: 'Logo', type: 'image', aspect: 1 },
      { name: 'url', label: 'Website URL' },
      { name: 'highlight', label: 'Highlight' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'starter-projects',
    title: 'Starter Projects',
    icon: '🚀',
    description: 'Carousel cards with media, likes, and a Learn More link.',
    path: '/api/starter-projects',
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'image', label: 'Image', type: 'image', aspect: 4 / 3 },
      { name: 'learnMoreUrl', label: 'Learn More URL' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'testimonials',
    title: 'Testimonials',
    icon: '💬',
    description: 'Quotes submitted by collaborators. Approve to publish.',
    path: '/api/testimonials',
    listPath: '/api/testimonials/admin',
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'role', label: 'Role' },
      { name: 'company', label: 'Company' },
      { name: 'quote', label: 'Message', type: 'textarea' },
      { name: 'avatar', label: 'Avatar', type: 'image', aspect: 1 },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'approved', label: 'Approved', type: 'checkbox' },
    ],
  },
];

const textInputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-teal-300 focus:outline-none';

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('adminUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginStatus, setLoginStatus] = useState('');
  const [prefetchedItems, setPrefetchedItems] = useState({});
  const [sectionCounts, setSectionCounts] = useState({});
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [overviewStatus, setOverviewStatus] = useState('');
  const [overviewError, setOverviewError] = useState('');
  const [activeCollectionKey, setActiveCollectionKey] = useState(collectionSections[0]?.key ?? null);
  const isAuthenticated = Boolean(token);
  const activeCollection = collectionSections.find((section) => section.key === activeCollectionKey);
  const activeCollectionProps = activeCollection ? (({ key, ...rest }) => rest)(activeCollection) : null;
  const summaryCards = [
    { key: 'projects', label: 'Recent Works', helper: 'Visible on the portfolio grid.' },
    { key: 'collaborations', label: 'Collaborations', helper: 'Brands in the marquee.' },
    { key: 'starter-projects', label: 'Starter Projects', helper: 'Carousel cards & likes.' },
    { key: 'testimonials', label: 'Testimonials', helper: 'Quotes awaiting approval.' },
  ];

  useEffect(() => {
    document.body.classList.add('show-system-cursor');
    return () => document.body.classList.remove('show-system-cursor');
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setPrefetchedItems({});
      setSectionCounts({});
      setOverviewStatus('');
      setOverviewError('');
      setActiveCollectionKey(collectionSections[0]?.key ?? null);
    }
  }, [isAuthenticated]);

  const request = useCallback(
    async (path, options = {}) => {
      if (!token) {
        throw new Error('Please login first.');
      }
      const { body, method = 'GET', headers = {} } = options;
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      let data = null;
      try {
        if (response.status !== 204) {
          data = await response.json();
        }
      } catch {
        data = null;
      }

      if (!response.ok) {
        const message = data?.message || 'Request failed';
        throw new Error(message);
      }

      return data;
    },
    [token]
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginStatus('Authenticating...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Invalid credentials');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      setOverviewStatus('');
      setOverviewError('');
      setLoginStatus('Login successful');
    } catch (error) {
      setLoginStatus(error.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setPrefetchedItems({});
    setSectionCounts({});
    setOverviewStatus('');
    setOverviewError('');
  };

  const refreshCollectionsOverview = useCallback(async () => {
    if (!token) return;
    setIsOverviewLoading(true);
    setOverviewError('');
    try {
      const results = await Promise.all(
        collectionSections.map(async (section) => {
          const data = await request(section.listPath || section.path);
          return { key: section.key, items: Array.isArray(data) ? data : [] };
        })
      );

      const nextItems = {};
      const nextCounts = {};
      results.forEach(({ key, items }) => {
        nextItems[key] = items;
        nextCounts[key] = items.length;
      });

      setPrefetchedItems(nextItems);
      setSectionCounts(nextCounts);
      setOverviewStatus('Counts updated just now');
    } catch (error) {
      setOverviewError(error.message);
    } finally {
      setIsOverviewLoading(false);
    }
  }, [token, request]);

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshCollectionsOverview();
  }, [isAuthenticated, refreshCollectionsOverview]);

  const handleToggleApproval = useCallback(
    async (path, item, reload) => {
      try {
        await request(`${path}/${item._id}/approve`, {
          method: 'PATCH',
          body: { approved: !item.approved },
        });
        setOverviewStatus(item.approved ? 'Testimonial hidden from site' : 'Testimonial approved');
        setOverviewError('');
        reload();
      } catch (error) {
        alert(error.message);
      }
    },
    [request, setOverviewError, setOverviewStatus]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-teal-200">Admin</p>
            <h1 className="text-3xl font-semibold">Portfolio Control Center</h1>
            <p className="text-sm text-slate-400">API base: {API_BASE_URL}</p>
          </div>
          {isAuthenticated && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <p>{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="mt-2 text-xs font-semibold uppercase tracking-wide text-teal-200 hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {!isAuthenticated ? (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold mb-4">Sign in to manage content</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="text-sm text-slate-300">Email</label>
                <input
                  type="email"
                  required
                  className={textInputClass}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  className={textInputClass}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-6 py-3 font-semibold text-slate-900"
              >
                Login
              </button>
              {loginStatus && <p className="text-sm text-slate-400">{loginStatus}</p>}
            </form>
          </section>
        ) : (
          <>
            <section className="space-y-4">
              <p className="text-sm text-slate-400">
                Use the panels below to update Mongo-backed content. Changes reflect instantly on the public portfolio once
                saved.
              </p>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => {
                  const value = sectionCounts[card.key];
                  return (
                    <div key={card.key} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{card.label}</p>
                      <p className="mt-3 text-4xl font-semibold">{typeof value === 'number' ? value : '—'}</p>
                      <p className="text-sm text-slate-400 mt-1">{card.helper}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-teal-200">Global Content</p>
                <h2 className="mt-2 text-2xl font-semibold">Site-wide voice & framing</h2>
                <p className="text-sm text-slate-400">
                  This JSON document feeds the hero copy, stats, services, roles, section headings, and footer details.
                </p>
              </div>
              <div className="grid gap-6">
                {singleDocSections.map(({ key, ...sectionProps }) => (
                  <SingleDocEditor key={key} {...sectionProps} request={request} />
                ))}
              </div>
            </section>

            <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-teal-200">Collections</p>
                  <h2 className="mt-2 text-2xl font-semibold">Content libraries</h2>
                  <p className="text-sm text-slate-400">
                    Switch between projects, collaborations, starter projects, and testimonials. Each collection stores live
                    entries in MongoDB.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    onClick={refreshCollectionsOverview}
                    disabled={isOverviewLoading}
                    className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white hover:border-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isOverviewLoading ? 'Refreshing…' : 'Refresh overview'}
                  </button>
                  {overviewStatus && <p className="text-xs text-teal-300">{overviewStatus}</p>}
                  {overviewError && <p className="text-xs text-rose-300">{overviewError}</p>}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {collectionSections.map((section) => {
                  const isActive = section.key === activeCollectionKey;
                  const value = sectionCounts[section.key];
                  return (
                    <button
                      type="button"
                      key={section.key}
                      onClick={() => setActiveCollectionKey(section.key)}
                      className={`flex flex-col justify-between rounded-3xl border px-5 py-4 text-left transition ${
                        isActive
                          ? 'border-teal-300 bg-white text-slate-900 shadow-lg shadow-teal-500/10'
                          : 'border-white/10 bg-black/20 text-white hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{section.icon}</span>
                        <div className="space-y-1">
                          <p className="text-base font-semibold">{section.title}</p>
                          <p className={`text-xs ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                            {section.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 text-right">
                        <p className="text-3xl font-semibold">{typeof value === 'number' ? value : '—'}</p>
                        <p className={`text-xs ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>items</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {activeCollection && activeCollectionProps && (
              <CollectionManager
                key={activeCollection.key}
                {...activeCollectionProps}
                request={request}
                initialItems={prefetchedItems[activeCollection.key] || []}
                authToken={token}
                onItemsChange={(items) => {
                  setSectionCounts((prev) => ({ ...prev, [activeCollection.key]: items.length }));
                  setPrefetchedItems((prev) => ({ ...prev, [activeCollection.key]: items }));
                }}
                renderItemActions={
                  activeCollection.key === 'testimonials'
                    ? (item, helpers) => (
                        <button
                          onClick={() => handleToggleApproval(activeCollection.path, item, helpers.reload)}
                          className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-wide text-white hover:border-teal-300"
                        >
                          {item.approved ? 'Unapprove' : 'Approve'}
                        </button>
                      )
                    : undefined
                }
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function SingleDocEditor({ title, description, path, request }) {
  const [value, setValue] = useState('{}');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadDocument = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await request(path);
      setValue(JSON.stringify(data ?? {}, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [path, request]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const handleSave = async () => {
    setStatus('');
    setError('');
    try {
      const parsed = value.trim() ? JSON.parse(value) : {};
      await request(path, { method: 'PUT', body: parsed });
      setStatus('Saved successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <div className="flex gap-3 text-sm">
          <button
            onClick={loadDocument}
            className="rounded-full border border-white/20 px-4 py-2 text-white hover:border-teal-300"
          >
            Refresh
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-4 py-2 font-semibold text-slate-900"
          >
            Save
          </button>
        </div>
      </div>
      <textarea
        className="mt-4 h-64 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-mono text-teal-100 focus:border-teal-300 focus:outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
      />
      <div className="mt-2 text-sm">
        {isLoading && <p className="text-slate-400">Loading current data…</p>}
        {status && <p className="text-teal-300">{status}</p>}
        {error && <p className="text-rose-300">{error}</p>}
      </div>
    </section>
  );
}

function CollectionManager({
  title,
  path,
  listPath,
  fields,
  request,
  initialItems = [],
  onItemsChange,
  renderItemActions,
  authToken,
}) {
  const initialFormValues = useMemo(
    () =>
      fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.defaultValue ?? (field.type === 'checkbox' ? false : ''),
        }),
        {}
      ),
    [fields]
  );

  const [items, setItems] = useState(initialItems);
  const [formData, setFormData] = useState(initialFormValues);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(initialItems?.length > 0);
  const effectiveListPath = listPath || path;

  useEffect(() => {
    setItems(initialItems || []);
    if (initialItems && initialItems.length > 0) {
      setHasHydrated(true);
    }
  }, [initialItems]);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await request(effectiveListPath);
      const parsed = Array.isArray(data) ? data : [];
      setItems(parsed);
      onItemsChange?.(parsed);
      setHasHydrated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveListPath, onItemsChange, request]);

  useEffect(() => {
    setFormData(initialFormValues);
  }, [initialFormValues]);

  useEffect(() => {
    if (hasHydrated) return;
    loadItems();
  }, [hasHydrated, loadItems]);

  const handleInputChange = (field, event) => {
    const value =
      field.type === 'checkbox'
        ? event.target.checked
        : field.type === 'number'
          ? event.target.value
          : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field.name]: value,
    }));
  };

  const handleImageChange = (fieldName, url) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: url,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormValues);
    setEditingId(null);
    setStatus('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      const payload = {};
      fields.forEach((field) => {
        const raw = formData[field.name];
        if (field.type === 'checkbox') {
          payload[field.name] = Boolean(raw);
          return;
        }
        if (raw === '' || raw === null || raw === undefined) return;
        if (field.type === 'number') {
          const parsed = Number(raw);
          if (!Number.isNaN(parsed)) {
            payload[field.name] = parsed;
          }
        } else {
          payload[field.name] = raw;
        }
      });
      const method = editingId ? 'PUT' : 'POST';
      const target = editingId ? `${path}/${editingId}` : path;
      await request(target, { method, body: payload });
      setStatus(editingId ? 'Item updated' : 'Item created');
      resetForm();
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    setError('');
    try {
      await request(`${path}/${id}`, { method: 'DELETE' });
      if (editingId === id) {
        resetForm();
      }
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    const nextForm = { ...initialFormValues };
    fields.forEach((field) => {
      const value = item[field.name];
      if (field.type === 'number') {
        nextForm[field.name] = typeof value === 'number' ? value : value ?? '';
      } else if (field.type === 'checkbox') {
        nextForm[field.name] = Boolean(value);
      } else {
        nextForm[field.name] = value ?? '';
      }
    });
    setFormData(nextForm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          {editingId && <p className="text-xs uppercase tracking-[0.4em] text-teal-300">Editing item</p>}
        </div>
        <button
          onClick={loadItems}
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-teal-300"
        >
          Refresh list
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.4em] text-slate-400">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                rows={4}
                className={`${textInputClass} min-h-[120px]`}
                value={formData[field.name]}
                onChange={(e) => handleInputChange(field, e)}
              />
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={Boolean(formData[field.name])}
                onChange={(e) => handleInputChange(field, e)}
                className="h-5 w-5 rounded border border-white/20 bg-white/10 accent-teal-400"
              />
            ) : field.type === 'image' ? (
              <ImageUploader
                label={field.label}
                value={formData[field.name]}
                onChange={(url) => handleImageChange(field.name, url)}
                token={authToken}
                aspect={field.aspect}
              />
            ) : (
              <input
                type={field.type === 'number' ? 'number' : 'text'}
                className={textInputClass}
                value={formData[field.name]}
                onChange={(e) => handleInputChange(field, e)}
              />
            )}
          </div>
        ))}
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-6 py-3 font-semibold text-slate-900"
          >
            {editingId ? 'Update' : 'Save'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full border border-white/20 px-6 py-3 text-sm text-white hover:border-teal-300"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Current items</h4>
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-400">No entries yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold">
                      {item.title || item.name || item.brandName || item.company || item._id}
                    </p>
                    {item.tag && <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{item.tag}</p>}
                    {typeof item.order === 'number' && (
                      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Order {item.order}</p>
                    )}
                    {'approved' in item && (
                      <p className={`text-xs ${item.approved ? 'text-teal-300' : 'text-amber-300'}`}>
                        {item.approved ? 'Approved' : 'Pending review'}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-wide text-white hover:border-teal-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-full border border-rose-400/40 px-4 py-1 text-xs uppercase tracking-wide text-rose-200 hover:border-rose-300"
                    >
                      Delete
                    </button>
                    {renderItemActions && (
                      <div className="flex flex-wrap gap-2">{renderItemActions(item, { reload: loadItems })}</div>
                    )}
                  </div>
                </div>
                <pre className="max-h-48 overflow-auto rounded-xl bg-black/40 p-3 text-xs text-teal-100">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-sm">
        {status && <p className="text-teal-300">{status}</p>}
        {error && <p className="text-rose-300">{error}</p>}
      </div>
    </section>
  );
}

export default AdminPage;

