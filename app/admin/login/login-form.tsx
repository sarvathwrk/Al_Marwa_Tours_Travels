'use client';

import { ActionForm, Field, SubmitButton } from '@/components/admin/form';
import { login } from './actions';

export default function LoginForm() {
  return (
    <ActionForm action={login} className="grid gap-5">
      <Field name="username" label="Username" autoComplete="username" required maxLength={60} />
      <Field name="password" label="Password" type="password" autoComplete="current-password" required maxLength={200} />
      <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
    </ActionForm>
  );
}
