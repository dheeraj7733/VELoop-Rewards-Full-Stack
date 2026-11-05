# VELoop Rewards API

## Authentication endpoints
| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a regular user account |
| POST | `/api/auth/login` | Verify credentials and start a session |
| GET | `/api/auth/me` | Return the currently authenticated user |
| POST | `/api/auth/logout` | Clear the session cookie |
| GET | `/api/admin/dashboard` | Example admin-only protected endpoint |

## Credential and token handling
- Passwords are hashed with bcrypt (12 salt rounds). Plain-text passwords are never stored.
- Login compares the submitted password with the stored hash using `bcrypt.compare`.
- Successful login issues a signed JWT with a 15-minute expiry.
- The JWT is stored in an HttpOnly cookie, not localStorage or sessionStorage.
- The browser sends the cookie on requests configured with `credentials: 'include'`.
- Middleware verifies the JWT and reloads the user from MongoDB. Admin middleware checks the database role.
- Public registration always assigns `user`; it never trusts a role sent by the client.

## Run locally
1. Open a terminal in `backend/`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set a private random `JWT_SECRET` of at least 32 characters and your MongoDB URI.
5. Start MongoDB locally or use a MongoDB Atlas connection string.
6. Run `npm run dev`.
7. Check `http://localhost:5000/api/health`.

In `frontend/`, create `.env` with:
`VITE_API_URL=http://localhost:5000`

Then run `npm install` and `npm run dev`. The frontend defaults to the same local API URL if `VITE_API_URL` is omitted.

## Example request bodies
Register: `{ "name": "Example User", "email": "user@example.com", "password": "a-long-password" }`

Login: `{ "email": "user@example.com", "password": "a-long-password" }`

## Production checklist
- Use HTTPS and keep `JWT_SECRET` private; never commit `.env`.
- Set `FRONTEND_URL` to the exact deployed frontend origin.
- For cookie-based auth across separately hosted sites, configure cookie SameSite/Secure and CSRF protection for the actual deployment topology. Prefer frontend/backend custom domains under the same site where practical.
- Add refresh-token rotation and revocation before requiring long-lived sessions.
- Provision admin accounts only through a trusted server-side process. Do not expose public admin registration.
- Add email verification, password reset, and audit logging before production launch.
