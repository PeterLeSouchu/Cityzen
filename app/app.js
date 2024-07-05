// TIERCE MODULES
import express from 'express';
import session from 'express-session';

// EXTERNAL MODULES
import router from './routers/index.router.js';



const app = express();

// ? Comment rendre les fichiers static du front qui ont leur propre repo ?
// app.use(express.static(path.join(import.meta.dirname, '/')))

// CORS authorization
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

  // response to preflight request
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

app.use(session({
  secret: process.env.SESSION_PASSWORD,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 60*60*24,
    sameSite: 'lax',
  }
}));

// Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Router: router variable not exist now. Is only for information. To do
app.use(router);

export default app;