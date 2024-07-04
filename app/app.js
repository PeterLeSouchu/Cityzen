// TIERCE MODULES
import express from 'express';

// EXTERNAL MODULES
import router from './routers/index.router.js';



const app = express();

// ? Comment rendre les fichiers static du front qui ont leur propre repo ?
// app.use(express.static(path.join(import.meta.dirname, '/')))

// Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Router: router variable not exist now. Is only for information. To do
app.use(router);

export default app;