import * as bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { createSession, deleteSession, getSession } from './session';
import { LoginInput } from './validations/auth';

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (!user) {
    throw new Error('Username atau password salah');
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password);
  if (!isValidPassword) {
    throw new Error('Username atau password salah');
  }

  await createSession({
    userId: user.id,
    username: user.username,
    name: user.name,
  });

  return user;
}

export async function logout() {
  await deleteSession();
}

export async function auth() {
  return await getSession();
}
