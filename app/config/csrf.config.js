import { doubleCsrf } from 'csrf-csrf';
import 'dotenv/config';
console.log(process.env.CSRF_SECRET);

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  // ne fonctionne pas en dev sur chromium __Host-psifi.x-csrf-token
  cookieName: 'psifi.x-csrf-token',
  cookie: {
    httpOnly: true, // Essayez sans httpOnly
    secure: false, // Essayez sans secure
    sameSite: 'Lax', // Essayez Lax pour tester
    path: '/', // Assurez-vous que le cookie est accessible sur le bon chemin
  }, // Utiliser des cookies pour stocker le token
  secret: process.env.CSRF_SIGNING_SECRET, // Clé secrète pour signer le cookie CSRF
  // Autres options de configuration selon vos besoins
});

export { generateToken, doubleCsrfProtection };
