# Admin Data Entry Guide

The portfolio now renders **only** the data that lives in MongoDB. Populate each section through the protected API or the built-in admin dashboard.

## 1. Prerequisites
- Server environment: copy `server/env.example` → `.env` and fill `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`.
- Client environment: copy `Client/env.example` → `.env` and set `VITE_API_URL` to your server origin.
- Install dependencies once at the workspace root: `npm install`.
- Start both apps together with `npm run dev` from the workspace root (uses `concurrently`).

## 2. Authenticate
Admin credentials are stored in environment variables. Use the same email/password inside the dashboard login screen or via API.

```
POST /api/auth/login
Content-Type: application/json
{
  "email": "admin@example.com",
  "password": "change-this-password"
}
```

Response:
```
{
  "token": "<JWT>",
  "user": { "name": "Portfolio Admin", "email": "admin@example.com" }
}
```

Include `Authorization: Bearer <token>` for every admin route below. Tokens expire after 1 hour—just re-login to refresh.

## 3. Manage Content Types

### Global Site Copy
- `GET /api/content/copy`
- `PUT /api/content/copy` (admin)

This JSON document holds the hero, stats, services, roles, section headings, contact copy, socials, and footer profile. Edit it from the dashboard’s “Global Site Copy” editor or via API.

### Projects (Recent Work grid)
- `GET /api/projects`
- `POST /api/projects` (admin)
- `PUT /api/projects/:id` (admin)
- `DELETE /api/projects/:id` (admin)
```json
{
  "title": "Dashboard OS",
  "description": "A metrics cockpit...",
  "tag": "Product",
  "image": "https://...",
  "color": "from-emerald-400/80 to-cyan-400/40",
  "liveUrl": "https://...",
  "githubUrl": "https://github.com/...",
  "order": 1
}
```

### Collaborations
- `GET /api/collaborations`
- `POST /api/collaborations` (admin)
- `PUT /api/collaborations/:id` (admin)
- `DELETE /api/collaborations/:id` (admin)

### Starter Projects (carousel with star counter)
- `GET /api/starter-projects`
- `POST /api/starter-projects` (admin)
- `PUT /api/starter-projects/:id` (admin)
- `DELETE /api/starter-projects/:id` (admin)
- `POST /api/starter-projects/:id/like` (public) – increments the like/star count used on the client carousel.

### Testimonials
- Public feed: `GET /api/testimonials`
- Admin list (pending + approved): `GET /api/testimonials/admin` (admin)
- Create/update/remove: `POST /api/testimonials`, `PUT /api/testimonials/:id`, `DELETE /api/testimonials/:id` (admin)
- Toggle approval: `PATCH /api/testimonials/:id/approve` with `{ "approved": true }`
- Public submission form (used by the client modal): `POST /api/testimonials/submit`

### Aggregated content for the client
The portfolio requests one payload:
```
GET /api/content
```
It returns the global copy plus the latest Projects, Collaborations, Starter Projects, and approved Testimonials. Empty collections simply render their “no data yet” states.

## 4. Admin Dashboard Tips
- The dashboard lives at `/admin` and mirrors every endpoint above.
- Each collection lets you add, edit, delete, and (for testimonials) approve entries.
- Use the JSON editor to tweak hero text, stats, services, etc. Press “Refresh” anytime to pull the latest document from MongoDB.

With these APIs populated, the public portfolio contains zero hardcoded/demo content—the UI always reflects what is stored in MongoDB.

