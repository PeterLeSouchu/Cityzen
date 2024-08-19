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
// app.use(express.static(path.join(__dirname, 'public/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'public/images')));

// ? Comment rendre les fichiers static du front qui ont leur propre repo ?
// app.use(express.static(path.join(import.meta.dirname, '/')))

// CORS handler
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
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
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24h de validité
      sameSite: 'lax',
    },
  })
);

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/csrf-token', (req, res) => {
  const csrfToken = generateToken(req, res);
  console.log('voici le token ');
  console.log(csrfToken);
  res.json({ csrfToken });
});

// Swagger doc
apiDocumentation(app);

// Router
app.use(router);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/dist', 'index.html'));
// });

export default app;
