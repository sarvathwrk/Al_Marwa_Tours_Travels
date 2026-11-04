import { changeAccount, deleteOffer, deletePackage, saveOffer, savePackage, saveSettings } from '@/app/admin/actions';
import { deleteFounder, saveFaq, saveFounder, saveGalleryItem, saveStat, saveTestimonial } from '@/app/admin/content-actions';
import type { Faq, Founder, GalleryItem, Offer, Pkg, Stat, Testimonial } from '@/db/schema';
import { PACKAGE_KIND_LABEL, PACKAGE_KINDS } from '@/lib/constants';
import type { PublicSettings } from '@/lib/data';
import type { FormState } from '@/lib/form';
import { ActionForm, Area, Check, Field, Hidden, Select, SubmitButton } from './form';

const KIND_OPTIONS = PACKAGE_KINDS.map((k) => ({ value: k, label: PACKAGE_KIND_LABEL[k].en }));
const RATING_OPTIONS = [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} ${n === 1 ? 'star' : 'stars'}` }));

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

/** One delete button for any list item. */
export function DeleteForm({ action, id, label, confirm }: { action: Action; id: number; label: string; confirm: string }) {
  return (
    <ActionForm action={action} className="mt-3">
      <Hidden name="id" value={id} />
      <SubmitButton variant="danger" pendingLabel="Deleting…" confirm={confirm}>
        {label}
      </SubmitButton>
    </ActionForm>
  );
}

const OrderAndVisibility = ({ sort, active, activeLabel = 'Show on website' }: { sort?: number; active?: boolean; activeLabel?: string }) => (
  <div className="flex flex-wrap items-end gap-x-7 gap-y-3">
    <Field name="sort" label="Order" hint="Lower shows first" type="number" inputMode="numeric" defaultValue={sort ?? 0} className="w-32" />
    <Check name="active" label={activeLabel} defaultChecked={active ?? true} />
  </div>
);

// ---------- packages ----------

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

export const DeletePackageForm = ({ id }: { id: number }) => (
  <DeleteForm action={deletePackage} id={id} label="Delete package" confirm="Delete this package? This cannot be undone." />
);

// ---------- offers ----------

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
      <OrderAndVisibility sort={offer?.sort} active={offer?.active} activeLabel="Show in popup" />
      <div>
        <SubmitButton>{offer ? 'Save offer' : 'Add offer'}</SubmitButton>
      </div>
    </ActionForm>
  );
}

export const DeleteOfferForm = ({ id }: { id: number }) => (
  <DeleteForm action={deleteOffer} id={id} label="Delete offer" confirm="Delete this offer? This cannot be undone." />
);

// ---------- numbers ----------

export function StatForm({ stat }: { stat?: Stat }) {
  return (
    <ActionForm action={saveStat} className="grid gap-5">
      {stat && <Hidden name="id" value={stat.id} />}
      <div className="grid gap-4 sm:grid-cols-[160px_1fr_1fr]">
        <Field name="value" label="Number" hint="e.g. 200+ or 98%" required maxLength={20} defaultValue={stat?.value} />
        <Field name="labelEn" label="Label (English)" required maxLength={80} defaultValue={stat?.labelEn} />
        <Field name="labelTa" label="Label (Tamil)" maxLength={120} defaultValue={stat?.labelTa} />
      </div>
      <OrderAndVisibility sort={stat?.sort} active={stat?.active} />
      <div>
        <SubmitButton>{stat ? 'Save number' : 'Add number'}</SubmitButton>
      </div>
    </ActionForm>
  );
}

// ---------- gallery ----------

export function GalleryForm({ item }: { item?: GalleryItem }) {
  return (
    <ActionForm action={saveGalleryItem} className="grid gap-5">
      {item && <Hidden name="id" value={item.id} />}
      <Field
        name="imageUrl"
        label="Photo link"
        hint="A full link to the photo, starting with https://. Upload it to your image host first, then paste the link."
        type="url"
        required
        maxLength={500}
        defaultValue={item?.imageUrl}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="captionEn" label="Caption (English)" required maxLength={100} defaultValue={item?.captionEn} />
        <Field name="captionTa" label="Caption (Tamil)" maxLength={160} defaultValue={item?.captionTa} />
      </div>
      <OrderAndVisibility sort={item?.sort} active={item?.active} />
      <div>
        <SubmitButton>{item ? 'Save photo' : 'Add photo'}</SubmitButton>
      </div>
    </ActionForm>
  );
}

// ---------- reviews ----------

export function TestimonialForm({ review }: { review?: Testimonial }) {
  return (
    <ActionForm action={saveTestimonial} className="grid gap-5">
      {review && <Hidden name="id" value={review.id} />}
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_160px]">
        <Field name="name" label="Traveller name" required maxLength={80} defaultValue={review?.name} />
        <Field name="detailEn" label="Detail (English)" hint="e.g. Umrah 2025, Salem" maxLength={100} defaultValue={review?.detailEn} />
        <Select name="rating" label="Rating" defaultValue={String(review?.rating ?? 5)} options={RATING_OPTIONS} />
      </div>
      <Field name="detailTa" label="Detail (Tamil)" maxLength={160} defaultValue={review?.detailTa} className="sm:max-w-md" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Area name="quoteEn" label="Review (English)" rows={4} defaultValue={review?.quoteEn} />
        <Area name="quoteTa" label="Review (Tamil)" rows={4} defaultValue={review?.quoteTa} />
      </div>
      <OrderAndVisibility sort={review?.sort} active={review?.active} />
      <div>
        <SubmitButton>{review ? 'Save review' : 'Add review'}</SubmitButton>
      </div>
    </ActionForm>
  );
}

// ---------- FAQ ----------

export function FaqForm({ faq }: { faq?: Faq }) {
  return (
    <ActionForm action={saveFaq} className="grid gap-5">
      {faq && <Hidden name="id" value={faq.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="questionEn" label="Question (English)" required maxLength={160} defaultValue={faq?.questionEn} />
        <Field name="questionTa" label="Question (Tamil)" maxLength={240} defaultValue={faq?.questionTa} />
        <Area name="answerEn" label="Answer (English)" rows={4} defaultValue={faq?.answerEn} />
        <Area name="answerTa" label="Answer (Tamil)" rows={4} defaultValue={faq?.answerTa} />
      </div>
      <OrderAndVisibility sort={faq?.sort} active={faq?.active} />
      <div>
        <SubmitButton>{faq ? 'Save question' : 'Add question'}</SubmitButton>
      </div>
    </ActionForm>
  );
}

// ---------- founder ----------

export function FounderForm({ founder }: { founder: Founder | null }) {
  return (
    <ActionForm action={saveFounder} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="nameEn" label="Name (English)" required maxLength={80} defaultValue={founder?.nameEn} />
        <Field name="nameTa" label="Name (Tamil)" maxLength={120} defaultValue={founder?.nameTa} />
        <Field name="roleEn" label="Role (English)" hint="e.g. Founder" maxLength={100} defaultValue={founder?.roleEn} />
        <Field name="roleTa" label="Role (Tamil)" maxLength={160} defaultValue={founder?.roleTa} />
        <Area name="bioEn" label="About (English)" rows={7} hint="Leave a blank line between paragraphs" defaultValue={founder?.bioEn} />
        <Area name="bioTa" label="About (Tamil)" rows={7} hint="Leave a blank line between paragraphs" defaultValue={founder?.bioTa} />
      </div>
      <Field
        name="photoUrl"
        label="Photo link"
        hint="Optional. A full link starting with https://. Leave blank to show the text only."
        type="url"
        maxLength={500}
        defaultValue={founder?.photoUrl}
      />
      <Check name="active" label="Show on website" defaultChecked={founder?.active ?? true} />
      <div>
        <SubmitButton>Save founder section</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function RemoveFounderForm() {
  return (
    <ActionForm action={deleteFounder} className="mt-3">
      <SubmitButton variant="danger" pendingLabel="Removing…" confirm="Remove the founder section? This cannot be undone.">
        Remove founder section
      </SubmitButton>
    </ActionForm>
  );
}

// ---------- contact + account ----------

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
        <Field
          name="latitude"
          label="Office latitude"
          hint="For the map in the contact section. In Google Maps, right-click your office and copy the first number. Leave both blank to hide the map."
          inputMode="decimal"
          defaultValue={settings.latitude}
        />
        <Field name="longitude" label="Office longitude" hint="The second number from the same right-click." inputMode="decimal" defaultValue={settings.longitude} />
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
