// app/register/page.tsx

import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Create Account - TaskFlow',
  description: 'Create your free TaskFlow account',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
