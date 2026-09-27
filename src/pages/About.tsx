import { Link } from 'react-router-dom'

const PIPELINE = [
  ['A trip brief', 'Free text, plus a few optional controls.'],
  ['Preference extraction', 'Destination, length, interests, pace and dislikes.'],
  ['Constraint interpretation', 'Preferences become limits: stops per day, travel tolerance, buffer time.'],
  ['Itinerary generation', 'Neighbourhood-based days, chosen against those limits.'],
  ['Activity sequencing', 'Stops ordered and timed so the day flows.'],
  ['Reasoning', 'Each stop carries the reason it was chosen.'],
  ['Dynamic replanning', 'A change in mood, weather or energy reworks one day.'],
]

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-5xl leading-none sm:text-7xl">About Scene</h1>
      <p className="mt-8 max-w-3xl font-display text-3xl leading-snug sm:text-4xl">
        Travel planning should account for how you want to spend your time, not just where you could go.
      </p>

      <div className="mt-14 grid gap-14 lg:grid-cols-2">
        <div className="max-w-xl space-y-5 text-lg leading-relaxed text-navy/85">
          <h2 className="font-display text-3xl text-navy">The problem</h2>
          <p>
            People rarely lack ideas for a trip. They have saved posts, map pins and recommendations from friends. What they lack is a plan
            in which those things fit together with the hotel, the opening hours, the distances and their own energy.
          </p>
          <p>
            A good itinerary answers what to do, but also in what order, how far apart things are, how long each will take, and what happens
            when something falls through.
          </p>
          <h2 className="pt-4 font-display text-3xl text-navy">What the AI is for</h2>
          <p>
            The AI is not there to write a list. Its job is to interpret an ambiguous human description and turn it into a structured plan,
            then adapt that plan when the constraints change. “I do not want to rush” is a pace, a stop limit and a buffer, not a mood.
          </p>
        </div>

        <div>
          <h2 className="font-display text-3xl">The intended pipeline</h2>
          <ol className="mt-6">
            {PIPELINE.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t-2 border-navy py-4">
                <span className="tnum font-bold text-sun-deep">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="font-display text-xl leading-tight">{t}</p>
                  <p className="mt-1 text-navy/75">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="bg-navy p-8 text-sand">
          <h2 className="font-display text-3xl">What runs today</h2>
          <p className="mt-3 text-sand/85">
            This demo runs entirely in your browser. A small local engine reads your text with keyword rules, scores a hand-built set of
            places for Lisbon, Tokyo, New York and Cape Town, and schedules them. There is no language model behind it yet, and hours,
            prices and availability are not modelled.
          </p>
        </div>
        <div className="bg-mist p-8">
          <h2 className="font-display text-3xl">What comes next</h2>
          <p className="mt-3 text-navy/85">
            The engine’s interface is written so a language model can replace the keyword reading and return the same structured itinerary.
            Places, maps and weather would then feed that plan with real data.
          </p>
        </div>
      </div>

      <Link to="/plan" className="mt-12 inline-block rounded-full bg-sun px-8 py-4 text-lg font-bold text-navy hover:bg-[#eaa060]">
        Plan a trip
      </Link>
    </div>
  )
}
