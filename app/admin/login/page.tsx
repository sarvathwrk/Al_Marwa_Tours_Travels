import Link from 'next/link';
import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/5">
          <div className="bg-kiswa px-7 py-6 text-white">
            <p className="font-display text-2xl font-bold tracking-[0.16em]">AL MARWA</p>
            <p className="mt-0.5 text-sm text-gold">Admin</p>
          </div>
          <div className="hizam" aria-hidden />
          <div className="p-7">
            <LoginForm />
          </div>
        </div>
        <p className="mt-5 text-center text-sm">
          <Link href="/" className="text-muted hover:text-haram">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
