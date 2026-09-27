import type { ReactNode } from 'react'

function Page({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-5xl leading-none sm:text-6xl">{title}</h1>
      <p className="mt-4 text-navy/65">Last updated {updated}</p>
      <div className="mt-10 space-y-8 text-lg leading-relaxed text-navy/85 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-navy">
        {children}
      </div>
    </div>
  )
}

export function Privacy() {
  return (
    <Page title="Privacy" updated="September 2026">
      <p>Scene is a portfolio demo. This page explains what it does with what you type.</p>
      <section>
        <h2>What stays on your device</h2>
        <p>
          The trip you describe is processed in your browser by code that ships with the page. It is not sent to a server, and Scene has no
          accounts, no database and no analytics of its own.
        </p>
      </section>
      <section>
        <h2>Cookies and storage</h2>
        <p>Scene does not set cookies and does not write to local storage. Refreshing the page clears your trip.</p>
      </section>
      <section>
        <h2>Third parties</h2>
        <p>
          Fonts are loaded from Google Fonts, which means your browser contacts Google when the page loads. The site is hosted on a
          static hosting provider that may keep standard access logs.
        </p>
      </section>
      <section>
        <h2>Questions</h2>
        <p>If you have a question about this page, contact the person who built Scene using the details on their portfolio.</p>
      </section>
    </Page>
  )
}

export function Terms() {
  return (
    <Page title="Terms" updated="September 2026">
      <p>By using Scene you agree to the following. Scene is a demo, so the terms are short.</p>
      <section>
        <h2>Sample data</h2>
        <p>
          Itineraries are generated from a small set of sample places. Opening hours, prices, distances and travel times are approximate
          and can be wrong. Check every detail with the venue or a current source before you travel.
        </p>
      </section>
      <section>
        <h2>No bookings</h2>
        <p>Scene does not book, sell or reserve anything. It has no partnerships with the places it mentions.</p>
      </section>
      <section>
        <h2>No warranty</h2>
        <p>Scene is provided as it is. The builder is not liable for any loss that comes from following a sample itinerary.</p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>The demo and these terms may change or disappear without notice.</p>
      </section>
    </Page>
  )
}
