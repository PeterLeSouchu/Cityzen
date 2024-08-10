// TIERCE MODULES
import 'dotenv/config';

// INTERNAL MODULES
import { createServer } from 'node:http';

// EXTERNAL MODULES
import app from './app/app.js';


const server = createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}, show http://localhost:${PORT}`);
});
