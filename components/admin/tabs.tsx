import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { deleteEnquiry, deleteFaq, deleteGalleryItem, deleteStat, deleteSubscriber, deleteTestimonial, setEnquiryStatus } from '@/app/admin/content-actions';
import { ENQUIRY_INTEREST_LABEL, ENQUIRY_STATUS_LABEL, ENQUIRY_STATUSES, formatInr, PACKAGE_KIND_LABEL, type EnquiryStatus } from '@/lib/constants';
import { getEnquiries, getFaqs, getFounder, getGallery, getLinkedEnquiryIds, getOffers, getPackages, getSettings, getStats, getSubscribers, getTestimonials } from '@/lib/data';
import { ActionForm, Hidden, SubmitButton } from './form';
import {
  AccountForm,
  DeleteForm,
  DeleteOfferForm,
  DeletePackageForm,
  FaqForm,
  FounderForm,
  GalleryForm,
  OfferForm,
  PackageForm,
  RemoveFounderForm,
  SettingsForm,
  StatForm,
  TestimonialForm,
} from './forms';

export const panel = 'rounded-2xl bg-white p-5 shadow-sm shadow-black/5 md:p-6';
export const badge = 'rounded-full px-2.5 py-0.5 text-xs font-semibold';
export const when = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });

/** Page title and one-line help, sitting directly on the page background (no extra card). */
export function Heading({ title, intro, actions }: { title: string; intro: string; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-bold leading-tight text-haram">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">{intro}</p>
      </div>
      {actions}
    </header>
  );
}

type Row = { id: number; summary: ReactNode; form: ReactNode; remove?: ReactNode };

/** The same pattern for every list: existing items as expandable rows, plus an "add" row. */
function CrudList({ title, intro, rows, addLabel, addForm, emptyHint }: { title: string; intro: string; rows: Row[]; addLabel: string; addForm: ReactNode; emptyHint?: string }) {
  return (
    <>
      <Heading title={title} intro={intro} />
      {rows.length === 0 && emptyHint && <p className={`${panel} text-sm text-muted`}>{emptyHint}</p>}
      {rows.map((r) => (
        <details key={r.id} className={panel}>
          <summary className="flex min-h-11 cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2">{r.summary}</summary>
          <div className="mt-5 border-t border-line pt-5">
            {r.form}
            {r.remove}
          </div>
        </details>
      ))}
      <details className={`${panel} !py-3`} open={rows.length === 0}>
        <summary className="flex min-h-10 cursor-pointer items-center font-display text-xl font-bold text-haram">+ {addLabel}</summary>
        <div className="mt-5 border-t border-line pt-5">{addForm}</div>
      </details>
    </>
  );
}

export const Title = ({ children }: { children: ReactNode }) => <span className="font-display text-xl font-bold text-haram">{children}</span>;
const Hidden_ = ({ active }: { active: boolean }) => (active ? null : <span className={`${badge} bg-red-50 text-red-700`}>Hidden</span>);

// ---------- content tabs ----------

export async function PackagesTab() {
  const packages = await getPackages({ includeInactive: true });
  return (
    <CrudList
      title="Packages"
      intro="Edit prices in rupees (₹). Changes appear on the website within a few seconds, in English and Tamil."
      addLabel="Add a package"
      addForm={<PackageForm />}
      rows={packages.map((p) => ({
        id: p.id,
        summary: (
          <>
            <Title>{p.nameEn}</Title>
            <span className={`${badge} bg-mist text-haram`}>{PACKAGE_KIND_LABEL[p.kind].en}</span>
            {p.featured && <span className={`${badge} bg-gold/25 text-gold-deep`}>Popular</span>}
            <Hidden_ active={p.active} />
            <span className="ml-auto text-sm font-semibold text-gold-deep">{p.priceInr != null ? formatInr(p.priceInr) : 'Enquire for price'}</span>
          </>
        ),
        form: <PackageForm pkg={p} />,
        remove: <DeletePackageForm id={p.id} />,
      }))}
    />
  );
}

export async function OffersTab() {
  const offers = await getOffers({ includeInactive: true });
  return (
    <CrudList
      title="Offers popup"
      intro="Active offers appear in a “Latest offers & updates” popup when visitors open the site. With no active offers, no popup is shown."
      addLabel="Add an offer"
      addForm={<OfferForm />}
      rows={offers.map((o) => ({
        id: o.id,
        summary: (
          <>
            <Title>{o.titleEn}</Title>
            <Hidden_ active={o.active} />
          </>
        ),
        form: <OfferForm offer={o} />,
        remove: <DeleteOfferForm id={o.id} />,
      }))}
    />
  );
}

export async function GalleryTab() {
  const items = await getGallery({ includeInactive: true });
  return (
    <CrudList
      title="Gallery"
      intro="The photo carousel on the home page. Paste a link to each photo; it appears in both languages with the captions you set."
      addLabel="Add a photo"
      addForm={<GalleryForm />}
      emptyHint="No photos yet, so the gallery section is hidden on the website."
      rows={items.map((g) => ({
        id: g.id,
        summary: (
          <>
            <Image src={g.imageUrl} alt="" width={48} height={48} unoptimized className="size-12 rounded-lg bg-mist object-cover" />
            <Title>{g.captionEn}</Title>
            <Hidden_ active={g.active} />
          </>
        ),
        form: <GalleryForm item={g} />,
        remove: <DeleteForm action={deleteGalleryItem} id={g.id} label="Delete photo" confirm="Delete this photo from the gallery?" />,
      }))}
    />
  );
}

export async function NumbersTab() {
  const stats = await getStats({ includeInactive: true });
  return (
    <CrudList
      title="Numbers"
      intro="Headline figures shown in the About section, such as pilgrims guided or years of experience. Only add figures you can stand behind. With none added, the About section shows its standard highlights."
      addLabel="Add a number"
      addForm={<StatForm />}
      emptyHint="No numbers yet. The About section is showing its standard highlights."
      rows={stats.map((s) => ({
        id: s.id,
        summary: (
          <>
            <span className="font-display text-2xl font-bold text-gold-deep">{s.value}</span>
            <Title>{s.labelEn}</Title>
            <Hidden_ active={s.active} />
          </>
        ),
        form: <StatForm stat={s} />,
        remove: <DeleteForm action={deleteStat} id={s.id} label="Delete number" confirm="Delete this number?" />,
      }))}
    />
  );
}

export async function ReviewsTab() {
  const reviews = await getTestimonials({ includeInactive: true });
  return (
    <CrudList
      title="Reviews"
      intro="Traveller reviews shown in a carousel. Add real reviews only, with the traveller’s permission. With none added, the section is hidden."
      addLabel="Add a review"
      addForm={<TestimonialForm />}
      emptyHint="No reviews yet, so the reviews section is hidden on the website."
      rows={reviews.map((t) => ({
        id: t.id,
        summary: (
          <>
            <Title>{t.name}</Title>
            <span className={`${badge} bg-gold/25 text-gold-deep`}>{'★'.repeat(t.rating)}</span>
            <Hidden_ active={t.active} />
          </>
        ),
        form: <TestimonialForm review={t} />,
        remove: <DeleteForm action={deleteTestimonial} id={t.id} label="Delete review" confirm="Delete this review?" />,
      }))}
    />
  );
}

export async function FaqTab() {
  const faqs = await getFaqs({ includeInactive: true });
  return (
    <CrudList
      title="FAQ"
      intro="Questions and answers in the accordion on the home page."
      addLabel="Add a question"
      addForm={<FaqForm />}
      emptyHint="No questions yet, so the FAQ section is hidden on the website."
      rows={faqs.map((f) => ({
        id: f.id,
        summary: (
          <>
            <Title>{f.questionEn}</Title>
            <Hidden_ active={f.active} />
          </>
        ),
        form: <FaqForm faq={f} />,
        remove: <DeleteForm action={deleteFaq} id={f.id} label="Delete question" confirm="Delete this question?" />,
      }))}
    />
  );
}

export async function FounderTab() {
  const founder = await getFounder({ includeInactive: true });
  return (
    <>
      <Heading title="Founder" intro="A short “meet our founder” section with a photo and a few paragraphs. It stays hidden until you save it." />
      <section className={panel}>
        <FounderForm founder={founder} />
        {founder && <RemoveFounderForm />}
      </section>
    </>
  );
}

export async function ContactTab() {
  const settings = await getSettings();
  return (
    <>
      <Heading title="Contact details" intro="Shown in the contact cards, footer and every WhatsApp link." />
      <section className={panel}>
        <SettingsForm settings={settings} />
      </section>
    </>
  );
}

export function AccountTab({ username }: { username: string }) {
  return (
    <>
      <Heading title="Account" intro="Your username and password are stored in the database. Changing the password signs out other devices." />
      <section className={panel}>
        <AccountForm username={username} />
      </section>
    </>
  );
}

// ---------- inbox ----------

const STATUS_STYLE: Record<EnquiryStatus, string> = {
  new: 'bg-gold/25 text-gold-deep',
  contacted: 'bg-sage text-haram',
  closed: 'bg-mist text-muted',
};

export async function EnquiriesTab({ status }: { status?: EnquiryStatus }) {
  const [all, linked] = await Promise.all([getEnquiries(), getLinkedEnquiryIds()]);
  const enquiries = status ? all.filter((e) => e.status === status) : all;
  const title = status ? `${ENQUIRY_STATUS_LABEL[status]} enquiries` : 'Enquiries';
  return (
    <>
      <Heading title={title} intro="Messages sent from the website contact form, newest first. Mark them as you follow up, or add the person to Customers once they apply." />
      {enquiries.length === 0 && (
        <p className={`${panel} text-sm text-muted`}>
          {status ? `No ${ENQUIRY_STATUS_LABEL[status].toLowerCase()} enquiries.` : 'No enquiries yet. They will appear here as soon as someone submits the form.'}
        </p>
      )}
      {enquiries.map((e) => {
        const digits = e.phone.replace(/\D/g, '');
        return (
          <article key={e.id} className={panel}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Title>{e.name}</Title>
              <span className={`${badge} ${STATUS_STYLE[e.status]}`}>{ENQUIRY_STATUS_LABEL[e.status]}</span>
              <span className={`${badge} bg-mist text-haram`}>{ENQUIRY_INTEREST_LABEL[e.interest].en}</span>
              <span className={`${badge} bg-mist text-muted`}>{e.locale === 'ta' ? 'Tamil' : 'English'} site</span>
              <time dateTime={e.createdAt.toISOString()} className="ml-auto text-xs text-muted">
                {when.format(e.createdAt)}
              </time>
            </div>
            <dl className="mt-4 grid gap-x-8 gap-y-1 text-[15px] sm:grid-cols-2">
              <div className="flex gap-2">
                <dt className="text-muted">Phone</dt>
                <dd>
                  <a href={`tel:${e.phone.replace(/[^\d+]/g, '')}`} className="font-semibold text-haram hover:underline">
                    {e.phone}
                  </a>
                  {digits && (
                    <>
                      {' · '}
                      <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className="text-haram hover:underline">
                        WhatsApp
                      </a>
                    </>
                  )}
                </dd>
              </div>
              {e.email && (
                <div className="flex gap-2">
                  <dt className="text-muted">Email</dt>
                  <dd>
                    <a href={`mailto:${e.email}`} className="break-all text-haram hover:underline">
                      {e.email}
                    </a>
                  </dd>
                </div>
              )}
              {e.travellers && (
                <div className="flex gap-2">
                  <dt className="text-muted">Travellers</dt>
                  <dd>{e.travellers}</dd>
                </div>
              )}
            </dl>
            {e.message && <p className="mt-4 whitespace-pre-line rounded-xl bg-mist p-4 text-[15px]">{e.message}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {linked.has(e.id) ? (
                <span className={`${badge} bg-sage text-haram`}>✓ In Customers</span>
              ) : (
                <Link
                  href={`/admin?tab=customers&fromEnquiry=${e.id}`}
                  className="inline-flex items-center rounded-full bg-haram px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-haram-2"
                >
                  Add as customer
                </Link>
              )}
              {ENQUIRY_STATUSES.filter((s) => s !== e.status).map((s) => (
                <ActionForm key={s} action={setEnquiryStatus}>
                  <Hidden name="id" value={e.id} />
                  <Hidden name="status" value={s} />
                  <SubmitButton size="sm" variant="ghost" pendingLabel="Updating…">
                    {s === 'new' ? 'Reopen' : s === 'contacted' ? 'Mark contacted' : 'Close'}
                  </SubmitButton>
                </ActionForm>
              ))}
              <ActionForm action={deleteEnquiry}>
                <Hidden name="id" value={e.id} />
                <SubmitButton size="sm" variant="danger" pendingLabel="Deleting…" confirm="Delete this enquiry? This cannot be undone.">
                  Delete
                </SubmitButton>
              </ActionForm>
            </div>
          </article>
        );
      })}
    </>
  );
}

export async function SubscribersTab() {
  const subscribers = await getSubscribers();
  return (
    <>
      <Heading title="Newsletter" intro={`${subscribers.length} ${subscribers.length === 1 ? 'person has' : 'people have'} subscribed from the website footer.`} />
      {subscribers.length === 0 ? (
        <p className={`${panel} text-sm text-muted`}>No subscribers yet.</p>
      ) : (
        <section className={`${panel} overflow-x-auto`}>
          <table className="w-full min-w-[480px] text-left text-[15px]">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Site</th>
                <th className="pb-3 font-semibold">Joined</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 pr-4 font-medium text-haram">{s.email}</td>
                  <td className="py-3 pr-4 text-muted">{s.locale === 'ta' ? 'Tamil' : 'English'}</td>
                  <td className="py-3 pr-4 text-muted">{when.format(s.createdAt)}</td>
                  <td className="py-3 text-right">
                    <ActionForm action={deleteSubscriber}>
                      <Hidden name="id" value={s.id} />
                      <SubmitButton size="sm" variant="danger" pendingLabel="Removing…" confirm={`Remove ${s.email}?`}>
                        Remove
                      </SubmitButton>
                    </ActionForm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}
