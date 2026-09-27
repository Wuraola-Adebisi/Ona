import { Link } from 'react-router-dom'
import DestinationArt from '../components/DestinationArt'
import TripCard from '../components/TripCard'
import { getDestination } from '../data/destinations'
import { EXAMPLES } from '../data/examples'
import { buildScene, PACE_LABELS } from '../engine/sceneEngine'

const lisbonScene = buildScene(EXAMPLES[0].brief)

const WHAT = [
  {
    title: 'It reads what you meant',
    body: 'A line like \u201CI do not want to rush\u201D becomes a pace, a limit on stops per day and more time between them.',
  },
  {
    title: 'It puts the day in order',
    body: 'Stops are grouped by neighbourhood and sequenced so the walking makes sense, with meals where a day needs them.',
  },
  {
    title: 'It says why each stop is there',
    body: 'Open any stop to see which thing you told Scene put it in the plan, and how far it is from the one before.',
  },
  {
    title: 'It changes when the day does',
    body: 'Too busy, raining or tired: one tap and the day is reworked while the rest of the trip stays put.',
  },
]

export default function Home() {
  const d = lisbonScene.destination
  const day = lisbonScene.days[0]

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24 lg:pt-16">
        <div>
          <h1 className="font-display text-[clamp(3.2rem,8.5vw,6.6rem)] leading-[0.95] tracking-tight">
            A trip that feels like yours.
          </h1>
          <p className="mt-7 max-w-xl text-xl lg:max-w-[26rem] xl:max-w-xl leading-relaxed text-navy/80">
            Tell Scene where you’re going, what you care about, and how you want the trip to feel. It builds an itinerary around you,
            not around a generic list of tourist attractions.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/plan" className="rounded-full bg-sun px-8 py-4 text-lg font-bold text-navy transition-colors hover:bg-[#eaa060]">
              Plan a trip
            </Link>
            <Link
              to="/examples"
              className="rounded-full border-2 border-navy px-8 py-3.5 text-lg font-medium transition-colors hover:bg-navy hover:text-sand"
            >
              See an example
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <DestinationArt destination={d} className="aspect-[4/5] w-full rounded-t-[14rem] rounded-b-2xl" />
          <div className="absolute -bottom-6 left-4 w-[min(19rem,88%)] bg-linen p-5 sm:-left-4 xl:-left-8">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-3xl uppercase leading-none">{d.name}</p>
              <p className="tnum text-sm font-bold">4 days</p>
            </div>
            <p className="mt-1 text-sm text-navy/70">{PACE_LABELS[lisbonScene.pace]}, architecture and food</p>
            <p className="mt-4 font-bold tnum">Day 01, {day.zone.title}</p>
            <ol className="mt-2 space-y-1.5">
              {day.items.map((it) => (
                <li key={it.activity.id} className="flex gap-3 text-[0.95rem]">
                  <span className="tnum w-11 shrink-0 font-bold text-sun-deep">{it.start}</span>
                  <span>{it.activity.name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-navy text-sand">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">Finding things to do was never the hard part.</h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-sand/80">
              You already have saved posts, map pins, tips from friends and a hotel in a specific neighbourhood. What is missing is a plan
              where all of it fits: what to do, in what order, how far apart, and how long each thing takes.
            </p>
          </div>
          <div className="space-y-5">
            <div className="border border-sand/25 p-6">
              <p className="text-sm text-sand/65">A typical list</p>
              <p className="mt-2 font-display text-2xl text-sand/70 line-through decoration-sun decoration-2">Here are 25 things to do in Paris.</p>
            </div>
            <div className="bg-sand p-6 text-navy">
              <p className="text-sm text-navy/65">A Scene brief</p>
              <p className="mt-2 font-display text-2xl leading-snug">
                I have three days, I like architecture and food, I do not want tourist traps, I hate rushing between places, and I want one
                really good dinner.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <h2 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">What Scene does with a brief</h2>
        <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {WHAT.map((w) => (
            <div key={w.title} className="border-t-2 border-navy pt-4">
              <h3 className="font-display text-2xl">{w.title}</h3>
              <p className="mt-2 max-w-md text-navy/80">{w.body}</p>
            </div>
          ))}
        </div>
        <Link to="/how-it-works" className="mt-12 inline-block font-bold underline decoration-sun decoration-2 underline-offset-8">
          See how a sentence becomes a plan
        </Link>
      </section>

      <section className="bg-sand-deep">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <h2 className="font-display text-4xl sm:text-5xl">Trips to look at</h2>
          <p className="mt-3 max-w-xl text-lg text-navy/75">Four sample trips, each built from a short brief. Open one to move stops around and change the mood.</p>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {EXAMPLES.map((e) => (
              <Link key={e.id} to={`/examples?trip=${e.id}`} aria-label={`${getDestination(e.id).name}, ${e.brief.days} days`}>
                <TripCard
                  destination={getDestination(e.id)}
                  meta={`${e.brief.days} days, ${PACE_LABELS[e.brief.pace].toLowerCase()}`}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sun">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl font-display text-4xl leading-tight sm:text-5xl">Tell Scene about your next trip.</h2>
          <Link to="/plan" className="rounded-full bg-navy px-8 py-4 text-lg font-medium text-sand transition-colors hover:bg-navy-soft">
            Plan a trip
          </Link>
        </div>
      </section>
    </div>
  )
}
