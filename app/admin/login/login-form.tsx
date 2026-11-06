'use client';

import { KeyRound, User } from 'lucide-react';
import { ActionForm, Field, SubmitButton } from '@/components/admin/form';
import { login } from './actions';

export default function LoginForm() {
  return (
    <ActionForm action={login} className="grid gap-5">
      <Field
        name="username"
        label="Username"
        autoComplete="username"
        placeholder="Your admin username"
        required
        maxLength={60}
        icon={<User aria-hidden className="size-[18px]" />}
      />
      <Field
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        required
        maxLength={200}
        icon={<KeyRound aria-hidden className="size-[18px]" />}
        revealable
      />
      <div className="pt-1">
        <SubmitButton pendingLabel="Signing in…" size="lg">
          Sign in
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
