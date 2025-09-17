import bcrypt from "bcryptjs";

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

//Hash a password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

// Compare a plain text password with a hashed password
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
