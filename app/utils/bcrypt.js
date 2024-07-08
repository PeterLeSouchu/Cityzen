import bcrypt from 'bcrypt';

async function hashPassword(password) {
  const SALT_ROUNDS = 10;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export {
  hashPassword
};
