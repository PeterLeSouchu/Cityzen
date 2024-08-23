// TIERCE MODULES
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { generateToken } from './config/csrf.config.js';

// EXTERNAL MODULES
import router from './routers/index.router.js';
import apiDocumentation from './config/swagger.config.js';

const app = express();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'public/images')));

// CORS handler
app.use(
  cors({
    origin: 'https://cityzen.onrender.com',
    credentials: true,
    withCredentials: true,
  })
);

// Create session
app.use(
  session({
    secret: process.env.SESSION_PASSWORD,
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: 'cityzen.onrender.com', // Configure le domaine ici
      secure: true, // Assure-toi que le cookie est envoyé uniquement via HTTPS
      httpOnly: true, // Rend le cookie inaccessible via JavaScript (par sécurité)
      sameSite: 'strict', // Configure SameSite ('Lax', 'Strict' ou 'None')
      maxAge: 1000 * 60 * 60 * 24, // 24h de validité
    },
    // cookie: {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24, // 24h de validité
    //   sameSite: 'strict',
    // },
  })
);

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/csrf-token', (req, res) => {
  const csrfToken = generateToken(req);
  console.log('voici le token ');
  console.log(req.session);
  console.log(csrfToken);
  res.json({ csrfToken });
});

// Swagger doc
apiDocumentation(app);

// Router
app.use(router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dist', 'index.html'));
});

export default app;
