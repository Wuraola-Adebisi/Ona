import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

const PIPELINE = [
  ['01', 'You describe the trip', 'Tell Ona what you want in ordinary language.'],
  ['02', 'Ona interprets it', 'Preferences become meaningful constraints around pace, priorities, travel and time.'],
  ['03', 'The itinerary takes shape', 'Places are selected and grouped into days that make geographic and practical sense.'],
  ['04', 'The day gets sequenced', 'Stops are ordered, timed and given enough room to breathe.'],
  ['05', 'You can change it', 'A different mood, bad weather or low energy can change a day without throwing away the whole trip.'],
]

export default function About() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun-deep">
          About Ona
        </p>

        <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.92] sm:text-7xl">
          A good itinerary should understand the traveller, not just the destination.
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-navy/70">
          Ona is built around a simple idea: the same city can make very
          different trips for very different people.
        </p>
      </section>

      <section className="bg-navy text-sand">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun">
              The problem
            </p>

            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Finding places is easy. Making them fit is not.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-sand/75">
            <p>
              Travel planning has become very good at giving people more
              options. Search results, social posts, maps and recommendation
              lists can tell you what exists in a city.
            </p>

            <p>
              They are much less useful at answering what you should actually
              do with your limited time.
            </p>

            <p>
              Ona focuses on that gap: turning preferences, constraints and
              context into a trip that feels coherent rather than cramming as
              much as possible into a calendar.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun-deep">
              How Ona thinks
            </p>

            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Your words should change the plan.
            </h2>

            <p className="mt-5 max-w-md leading-relaxed text-navy/70">
              “I do not want to rush” is not just a preference label. It
              should affect the number of stops, travel between them, start
              times and the amount of empty space in the day.
            </p>
          </div>

          <ol>
            {PIPELINE.map(([number, title, body]) => (
              <li
                key={number}
                className="grid grid-cols-[3rem_1fr] gap-5 border-t-2 border-navy py-6"
              >
                <span className="tnum font-bold text-sun-deep">
                  {number}
                </span>

                <div>
                  <h3 className="font-display text-2xl sm:text-3xl">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-navy/70">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-sand-deep">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-linen p-8 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
                Built for flexibility
              </p>

              <h2 className="mt-4 font-display text-3xl">
                A plan should be editable.
              </h2>

              <ul className="mt-7 space-y-4">
                {[
                  'Make a day slower',
                  'Adapt when the weather changes',
                  'Ease up when you are tired',
                  'Switch the overall mood of the trip',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check size={18} className="mt-1 shrink-0 text-sun-deep" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy p-8 text-sand sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun">
                Built to become smarter
              </p>

              <h2 className="mt-4 font-display text-3xl">
                The planning layer comes first.
              </h2>

              <p className="mt-5 leading-relaxed text-sand/75">
                Ona's product architecture separates understanding the
                traveller from generating the itinerary. That makes the
                planning layer suitable for progressively richer AI
                interpretation and real-world travel data as the product grows.
              </p>
            </div>
          </div>

          <Link
            to="/plan"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-sun px-7 py-4 font-bold text-navy transition-colors hover:bg-[#eaa060]"
          >
            Plan a trip
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}