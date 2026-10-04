import type { ReactNode } from 'react'

function Page({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-5xl leading-none sm:text-6xl">
        {title}
      </h1>

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
      <p>
        Ona is a travel-planning product that uses the information you
        provide to build an itinerary around your preferences, constraints,
        and the way you want to travel.
      </p>

      <section>
        <h2>What Ona processes</h2>
        <p>
          When you create a trip, Ona processes information such as your
          destination, trip length, interests, preferred pace, things you want
          to avoid, and anything else you include in your trip brief.
        </p>
      </section>

      <section>
        <h2>Current version</h2>
        <p>
          The current version processes trip information locally in your
          browser using Ona&apos;s planning engine. There are currently no
          user accounts or persistent trip database.
        </p>
      </section>

      <section>
        <h2>Future AI services</h2>
        <p>
          Future versions of Ona may use external AI and cloud services to
          interpret natural-language trip briefs, generate itineraries, and
          support dynamic replanning. If those services are introduced, this
          policy will be updated to explain what information is sent, why it
          is sent, and how it is handled.
        </p>
      </section>

      <section>
        <h2>Cookies and storage</h2>
        <p>
          Ona does not currently require an account or use cookies for
          personalisation. Trip state is currently held in the browser while
          you use the planner.
        </p>
      </section>

      <section>
        <h2>Third parties</h2>
        <p>
          Fonts may be loaded from Google Fonts, which means your browser
          contacts Google when the page loads. Ona may also be hosted on a
          third-party hosting provider that keeps standard technical access
          logs.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          If you have a question about how Ona handles information, contact
          the person responsible for the product through the contact details
          provided on the product or portfolio site.
        </p>
      </section>
    </Page>
  )
}

export function Terms() {
  return (
    <Page title="Terms" updated="September 2026">
      <p>
        By using Ona, you agree to use the product for personal travel
        planning and to verify important information before relying on an
        itinerary.
      </p>

      <section>
        <h2>Planning information</h2>
        <p>
          Ona generates travel suggestions from its available destination
          information and planning logic. Opening hours, prices, availability,
          distances, travel times, events, and other details can change or be
          inaccurate. Always verify important details with the relevant venue,
          transport provider, or another current source before travelling.
        </p>
      </section>

      <section>
        <h2>No bookings</h2>
        <p>
          Ona does not currently book flights, hotels, restaurants,
          attractions, transport, or other travel services. Mentioning a
          place does not imply a partnership, endorsement, or commercial
          relationship with that place.
        </p>
      </section>

      <section>
        <h2>Your decisions</h2>
        <p>
          Ona provides planning assistance rather than professional travel,
          medical, financial, legal, or safety advice. You remain responsible
          for deciding whether an itinerary, activity, route, or destination
          is appropriate for your circumstances.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          Ona may add, remove, or change features as the product develops.
          These terms may be updated when material changes are made.
        </p>
      </section>
    </Page>
  )
}