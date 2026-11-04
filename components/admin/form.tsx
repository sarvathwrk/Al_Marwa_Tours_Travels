'use client';

import { createContext, useActionState, useContext, useId, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { idleState, type FormState } from '@/lib/form';

const FormCtx = createContext<FormState>(idleState);

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export function ActionForm({ action, children, className }: { action: Action; children: ReactNode; className?: string }) {
  const [state, formAction] = useActionState(action, idleState);
  return (
    <FormCtx.Provider value={state}>
      <form action={formAction} className={className}>
        {children}
        <FormStatus state={state} />
      </form>
    </FormCtx.Provider>
  );
}

function FormStatus({ state }: { state: FormState }) {
  if (state.status === 'idle' || !state.message) return null;
  const good = state.status === 'success';
  return (
    <p
      role={good ? 'status' : 'alert'}
      className={`mt-4 rounded-md px-3.5 py-2.5 text-sm font-medium ${good ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}
    >
      {state.message}
    </p>
  );
}

const control =
  'w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-[15px] font-normal text-ink outline-none transition-colors focus:border-gold aria-[invalid=true]:border-red-500';

type FieldBase = { name: string; label: string; hint?: string; className?: string };

function Wrapper({ name, label, hint, className, children }: FieldBase & { children: ReactNode }) {
  const errors = useContext(FormCtx).errors?.[name];
  const hintId = useId();
  return (
    <div className={`grid gap-1.5 ${className ?? ''}`}>
      <label className="text-sm font-semibold text-haram">
        {label}
        <div className="mt-1.5">{children}</div>
      </label>
      {hint && !errors && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {errors?.[0] && (
        <p role="alert" className="text-xs font-medium text-red-700">
          {errors[0]}
        </p>
      )}
    </div>
  );
}

/** Keeps what the admin typed after a validation error; otherwise shows the saved value. */
function useValue(name: string, initial: string | number | null | undefined) {
  const state = useContext(FormCtx);
  return state.fields?.[name] ?? String(initial ?? '');
}

export function Field({
  name,
  label,
  hint,
  className,
  defaultValue,
  type = 'text',
  required,
  maxLength,
  autoComplete,
  inputMode,
}: FieldBase & {
  defaultValue?: string | number | null;
  type?: 'text' | 'password' | 'number' | 'tel' | 'email' | 'url';
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: 'numeric' | 'decimal' | 'tel' | 'text' | 'email' | 'url';
}) {
  const value = useValue(name, defaultValue);
  const invalid = !!useContext(FormCtx).errors?.[name];
  return (
    <Wrapper name={name} label={label} hint={hint} className={className}>
      <input
        key={value}
        name={name}
        type={type}
        defaultValue={value}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={invalid}
        className={control}
      />
    </Wrapper>
  );
}

export function Area({
  name,
  label,
  hint,
  className,
  defaultValue,
  rows = 4,
}: FieldBase & { defaultValue?: string | null; rows?: number }) {
  const value = useValue(name, defaultValue);
  const invalid = !!useContext(FormCtx).errors?.[name];
  return (
    <Wrapper name={name} label={label} hint={hint} className={className}>
      <textarea key={value} name={name} rows={rows} defaultValue={value} aria-invalid={invalid} className={`${control} resize-y`} />
    </Wrapper>
  );
}

export function Select({
  name,
  label,
  hint,
  className,
  defaultValue,
  options,
}: FieldBase & { defaultValue?: string; options: { value: string; label: string }[] }) {
  const value = useValue(name, defaultValue);
  return (
    <Wrapper name={name} label={label} hint={hint} className={className}>
      <select key={value} name={name} defaultValue={value} className={control}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

export function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  const state = useContext(FormCtx);
  const checked = state.fields ? state.fields[name] === 'on' : !!defaultChecked;
  return (
    <label className="flex items-center gap-2.5 text-sm font-semibold text-haram">
      <input key={String(checked)} type="checkbox" name={name} defaultChecked={checked} className="size-4 accent-[#0f3d33]" />
      {label}
    </label>
  );
}

export function Hidden({ name, value }: { name: string; value: string | number }) {
  return <input type="hidden" name={name} value={value} />;
}

export function SubmitButton({
  children,
  pendingLabel = 'Saving…',
  variant = 'primary',
  size = 'md',
  confirm,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: 'primary' | 'danger' | 'ghost';
  size?: 'md' | 'sm';
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  const look = {
    primary: 'bg-haram text-white hover:bg-haram-2',
    danger: 'border border-red-300 text-red-700 hover:bg-red-50',
    ghost: 'border border-line bg-white text-haram hover:border-haram',
  }[variant];
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={`rounded-full font-semibold transition-colors disabled:opacity-60 ${size === 'sm' ? 'px-4 py-1.5 text-xs' : 'px-6 py-2.5 text-sm'} ${look}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
