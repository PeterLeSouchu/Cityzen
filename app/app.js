// TIERCE MODULES
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';

// EXTERNAL MODULES
import router from './routers/index.router.js';



const app = express();

//app.use(express.static(path.join(import.meta.dirname, 'uploads')));

// ? Comment rendre les fichiers static du front qui ont leur propre repo ?
// app.use(express.static(path.join(import.meta.dirname, '/')))


// CORS handler
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
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
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
    },
  })
);


// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Router
app.use(router);

export default app;
