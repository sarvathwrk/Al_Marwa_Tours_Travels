import { changeAccount, deleteOffer, deletePackage, saveOffer, savePackage, saveSettings } from '@/app/admin/actions';
import type { Offer, Pkg } from '@/db/schema';
import { PACKAGE_KIND_LABEL, PACKAGE_KINDS } from '@/lib/constants';
import type { PublicSettings } from '@/lib/data';
import { ActionForm, Area, Check, Field, Hidden, Select, SubmitButton } from './form';

const KIND_OPTIONS = PACKAGE_KINDS.map((k) => ({ value: k, label: PACKAGE_KIND_LABEL[k].en }));

export function PackageForm({ pkg }: { pkg?: Pkg }) {
  return (
    <ActionForm action={savePackage} className="grid gap-5">
      {pkg && <Hidden name="id" value={pkg.id} />}
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_110px]">
        <Select name="kind" label="Type" defaultValue={pkg?.kind ?? 'umrah'} options={KIND_OPTIONS} />
        <Field name="duration" label="Duration" hint="Optional, e.g. 15 days" defaultValue={pkg?.duration} maxLength={40} />
        <Field name="sort" label="Order" hint="Lower shows first" type="number" inputMode="numeric" defaultValue={pkg?.sort ?? 0} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="nameEn" label="Name (English)" required maxLength={80} defaultValue={pkg?.nameEn} />
        <Field name="nameTa" label="Name (Tamil)" maxLength={120} defaultValue={pkg?.nameTa} />
        <Field name="taglineEn" label="Short description (English)" maxLength={200} defaultValue={pkg?.taglineEn} />
        <Field name="taglineTa" label="Short description (Tamil)" maxLength={300} defaultValue={pkg?.taglineTa} />
      </div>
      <Field
        name="priceInr"
        label="Price (₹ INR)"
        hint="Whole rupees, for example 125000. Leave blank to show “Enquire for price”."
        inputMode="numeric"
        defaultValue={pkg?.priceInr}
        className="sm:max-w-xs"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Area name="featuresEn" label="Includes (English)" hint="One item per line" defaultValue={pkg?.featuresEn.join('\n')} />
        <Area name="featuresTa" label="Includes (Tamil)" hint="One item per line" defaultValue={pkg?.featuresTa.join('\n')} />
      </div>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
        <Check name="featured" label="Highlight as popular" defaultChecked={pkg?.featured ?? false} />
        <Check name="active" label="Show on website" defaultChecked={pkg?.active ?? true} />
      </div>
      <div>
        <SubmitButton>{pkg ? 'Save package' : 'Add package'}</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function DeletePackageForm({ id }: { id: number }) {
  return (
    <ActionForm action={deletePackage} className="mt-3">
      <Hidden name="id" value={id} />
      <SubmitButton variant="danger" pendingLabel="Deleting…" confirm="Delete this package? This cannot be undone.">
        Delete package
      </SubmitButton>
    </ActionForm>
  );
}

export function OfferForm({ offer }: { offer?: Offer }) {
  return (
    <ActionForm action={saveOffer} className="grid gap-5">
      {offer && <Hidden name="id" value={offer.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="titleEn" label="Headline (English)" required maxLength={100} defaultValue={offer?.titleEn} />
        <Field name="titleTa" label="Headline (Tamil)" maxLength={160} defaultValue={offer?.titleTa} />
        <Area name="bodyEn" label="Details (English)" rows={3} defaultValue={offer?.bodyEn} />
        <Area name="bodyTa" label="Details (Tamil)" rows={3} defaultValue={offer?.bodyTa} />
      </div>
      <div className="flex flex-wrap items-end gap-x-7 gap-y-3">
        <Field name="sort" label="Order" type="number" inputMode="numeric" defaultValue={offer?.sort ?? 0} className="w-28" />
        <Check name="active" label="Show in popup" defaultChecked={offer?.active ?? true} />
      </div>
      <div>
        <SubmitButton>{offer ? 'Save offer' : 'Add offer'}</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function DeleteOfferForm({ id }: { id: number }) {
  return (
    <ActionForm action={deleteOffer} className="mt-3">
      <Hidden name="id" value={id} />
      <SubmitButton variant="danger" pendingLabel="Deleting…" confirm="Delete this offer? This cannot be undone.">
        Delete offer
      </SubmitButton>
    </ActionForm>
  );
}

export function SettingsForm({ settings }: { settings: PublicSettings }) {
  return (
    <ActionForm action={saveSettings} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="phoneDisplay" label="Phone number" hint="Shown as written, e.g. +91 99435 15474" required maxLength={30} type="tel" defaultValue={settings.phoneDisplay} />
        <Field
          name="whatsapp"
          label="WhatsApp number"
          hint="With country code. Spaces and + are fine. Used for all WhatsApp buttons."
          required
          type="tel"
          defaultValue={settings.whatsapp}
        />
        <Field name="email" label="Email" hint="Leave blank to hide it on the website" type="email" maxLength={120} defaultValue={settings.email} />
        <span aria-hidden className="hidden sm:block" />
        <Field name="addressEn" label="Address (English)" maxLength={200} defaultValue={settings.addressEn} />
        <Field name="addressTa" label="Address (Tamil)" maxLength={200} defaultValue={settings.addressTa} />
        <Field name="hoursEn" label="Working hours (English)" maxLength={200} defaultValue={settings.hoursEn} />
        <Field name="hoursTa" label="Working hours (Tamil)" maxLength={200} defaultValue={settings.hoursTa} />
        <Field name="instagram" label="Instagram link" hint="Optional. Starts with https://" type="url" defaultValue={settings.instagram} />
        <Field name="facebook" label="Facebook link" hint="Optional. Starts with https://" type="url" defaultValue={settings.facebook} />
      </div>
      <div>
        <SubmitButton>Save contact details</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function AccountForm({ username }: { username: string }) {
  return (
    <ActionForm action={changeAccount} className="grid max-w-md gap-5">
      <Field name="username" label="Username" required maxLength={40} autoComplete="username" defaultValue={username} />
      <Field name="newPassword" label="New password" hint="Leave blank to keep your current password. At least 10 characters." type="password" autoComplete="new-password" maxLength={200} />
      <Field name="confirmPassword" label="Confirm new password" type="password" autoComplete="new-password" maxLength={200} />
      <Field name="currentPassword" label="Current password" hint="Required to save any change" type="password" autoComplete="current-password" required maxLength={200} />
      <div>
        <SubmitButton>Save account</SubmitButton>
      </div>
    </ActionForm>
  );
}
