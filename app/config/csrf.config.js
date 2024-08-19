import { doubleCsrf } from 'csrf-csrf';
import 'dotenv/config';
console.log(process.env.CSRF_SECRET);

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  // ne fonctionne pas en dev sur chromium __Host-psifi.x-csrf-token
  cookieName: '__Host-psifi.x-csrf-token',
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  },
  secret: process.env.CSRF_SIGNING_SECRET, // Clé secrète pour signer le cookie CSRF
});

export { generateToken, doubleCsrfProtection };
