# MulaWave v4 — Start here

1. Open `server/.env.example`, create `server/.env`, and add your MongoDB Atlas URI and JWT secret.
2. Run backend:
   `cd server && npm install && npm run dev`
3. Open another terminal at the project root:
   `npm install && npm run dev`
4. Register a customer in the frontend.
5. Promote a development account to `super_admin` in MongoDB.
6. Log in again and open `/admin`.
7. Confirm customers, orders, role changes, settings and audit logs are coming from the API.

Do not use the development promotion step in a live financial environment.
