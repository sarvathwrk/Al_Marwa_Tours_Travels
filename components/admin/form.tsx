'use client';

import { CircleAlert, CircleCheck, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { createContext, useActionState, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { idleState, type FormState } from '@/lib/form';

const FormCtx = createContext<FormState>(idleState);

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export function ActionForm({ action, children, className }: { action: Action; children: ReactNode; className?: string }) {
  const [state, formAction, pending] = useActionState(action, idleState);
  const ref = useRef<HTMLFormElement>(null);

  // After a failed save, take the admin straight to the first field that needs fixing.
  useEffect(() => {
    if (state.status === 'error') ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  return (
    <FormCtx.Provider value={state}>
      <form
        ref={ref}
        action={formAction}
        className={className}
        // A save already in progress must never be sent twice (double click, Enter key, scripted submit).
        onSubmit={(e) => {
          if (pending) e.preventDefault();
        }}
      >
        <Lockable>{children}</Lockable>
        <FormStatus state={state} />
      </form>
    </FormCtx.Provider>
  );
}

/** Greys out and disables every field while the form is being saved, so nothing can be edited or sent twice. */
function Lockable({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <fieldset disabled={pending} aria-busy={pending} className="contents">
      {children}
    </fieldset>
  );
}

function FormStatus({ state }: { state: FormState }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const shown = state.status !== 'idle' && !!state.message;
  useEffect(() => {
    if (shown) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [shown, state]);
  if (!shown) return null;
  const good = state.status === 'success';
  const Icon = good ? CircleCheck : CircleAlert;
  return (
    <p
      ref={ref}
      role={good ? 'status' : 'alert'}
      className={`mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-medium ${good ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}
    >
      <Icon aria-hidden className="mt-0.5 size-[18px] shrink-0" />
      <span>{state.message}</span>
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
  icon,
  revealable,
  placeholder,
  suggestions,
}: FieldBase & {
  defaultValue?: string | number | null;
  type?: 'text' | 'password' | 'number' | 'tel' | 'email' | 'url' | 'date';
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: 'numeric' | 'decimal' | 'tel' | 'text' | 'email' | 'url';
  /** Leading icon inside the input (larger touch-friendly field). */
  icon?: ReactNode;
  /** Password fields: adds a show/hide toggle. */
  revealable?: boolean;
  placeholder?: string;
  /** Existing values offered as you type (keeps names such as batches consistent). */
  suggestions?: string[];
}) {
  const value = useValue(name, defaultValue);
  const listId = useId();
  const invalid = !!useContext(FormCtx).errors?.[name];
  const [shown, setShown] = useState(false);
  const input = (
    <input
      key={value}
      name={name}
      type={revealable && shown ? 'text' : type}
      defaultValue={value}
      required={required}
      maxLength={maxLength}
      autoComplete={autoComplete}
      inputMode={inputMode}
      placeholder={placeholder}
      list={suggestions?.length ? listId : undefined}
      // The show/hide button sits inside the <label>, so name the input explicitly to keep its accessible name clean.
      aria-label={revealable ? label : undefined}
      aria-invalid={invalid}
      className={icon || revealable ? `${control} py-3 ${icon ? 'pl-11' : ''} ${revealable ? 'pr-12' : ''}` : control}
    />
  );
  const datalist = suggestions?.length ? (
    <datalist id={listId}>
      {suggestions.map((v) => (
        <option key={v} value={v} />
      ))}
    </datalist>
  ) : null;
  if (!icon && !revealable) {
    return (
      <Wrapper name={name} label={label} hint={hint} className={className}>
        {input}
        {datalist}
      </Wrapper>
    );
  }
  return (
    <Wrapper name={name} label={label} hint={hint} className={className}>
      <span className="relative block">
        {icon && <span className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-muted">{icon}</span>}
        {input}
        {revealable && (
          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            aria-label={shown ? 'Hide password' : 'Show password'}
            aria-pressed={shown}
            className="absolute inset-y-0 right-1 my-auto grid size-10 place-items-center rounded-full text-muted transition-colors hover:text-haram"
          >
            {shown ? <EyeOff aria-hidden className="size-[18px]" /> : <Eye aria-hidden className="size-[18px]" />}
          </button>
        )}
      </span>
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
  required,
}: FieldBase & { defaultValue?: string; options: { value: string; label: string }[]; required?: boolean }) {
  const value = useValue(name, defaultValue);
  const invalid = !!useContext(FormCtx).errors?.[name];
  return (
    <Wrapper name={name} label={label} hint={hint} className={className}>
      <select key={value} name={name} defaultValue={value} required={required} aria-invalid={invalid} className={control}>
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
  size?: 'md' | 'sm' | 'lg';
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
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-wait disabled:opacity-70 ${{ sm: 'px-4 py-1.5 text-xs', md: 'px-6 py-2.5 text-sm', lg: 'w-full px-6 py-3.5 text-base shadow-lg shadow-haram/20' }[size]} ${look}`}
    >
      {pending && <LoaderCircle aria-hidden className={`animate-spin ${size === 'sm' ? 'size-3.5' : 'size-4'}`} />}
      {pending ? pendingLabel : children}
    </button>
  );
}
