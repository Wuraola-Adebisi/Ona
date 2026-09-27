import { ArrowRight, Check, Compass, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import DestinationArt from "../components/DestinationArt";
import TripCard from "../components/TripCard";
import { getDestination } from "../data/destinations";
import { EXAMPLES } from "../data/examples";
import { buildScene, PACE_LABELS } from "../engine/sceneEngine";

const lisbonScene = buildScene(EXAMPLES[0].brief);
const destination = lisbonScene.destination;
const firstDay = lisbonScene.days[0];

const BENEFITS = [
  {
    number: "01",
    title: "Tell it what matters",
    body: "Describe the trip in your own words. Scene picks up the things that matter to you, from architecture and food to how much moving around you can tolerate.",
  },
  {
    number: "02",
    title: "Get a trip that fits",
    body: "Scene turns those preferences into a realistic day-by-day plan, grouping places that make sense together and leaving room to actually enjoy them.",
  },
  {
    number: "03",
    title: "Change the plan without starting over",
    body: "Plans change. Make a day slower, swap it for a rainy-day version, or ease up when you are tired. Scene adjusts the day around the change.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-28 lg:pt-20">
        <div>
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.18em] text-sun-deep">
            Travel planning, without the spreadsheet
          </p>

          <h1 className="max-w-4xl font-display text-[clamp(3.6rem,8vw,7rem)] leading-[0.9] tracking-tight">
            Plan a trip around how you actually want to travel.
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-relaxed text-navy/75">
            Tell Scene where you are going, what you care about, what you would
            rather avoid, and how you want your days to feel. It builds the
            itinerary around those things.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-4 font-bold text-sand transition-colors hover:bg-navy-soft"
            >
              Plan my trip
              <ArrowRight size={18} />
            </Link>

            <a
              href="#how"
              className="font-medium underline decoration-sun decoration-2 underline-offset-8"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy/65">
            <span>Start with a sentence</span>
            <span>•</span>
            <span>Set the pace</span>
            <span>•</span>
            <span>Adjust as you go</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <DestinationArt
            destination={destination}
            className="aspect-[4/5] w-full rounded-t-[12rem] rounded-b-3xl"
          />

          <div className="absolute -bottom-8 left-4 w-[min(20rem,90%)] bg-linen p-5 shadow-xl shadow-navy/10 sm:-left-6 lg:-left-10">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-display text-3xl uppercase leading-none">
                {destination.name}
              </p>
              <p className="tnum text-sm font-bold">
                {lisbonScene.days.length} days
              </p>
            </div>

            <p className="mt-2 text-sm text-navy/65">
              {PACE_LABELS[lisbonScene.pace]}, architecture & food
            </p>

            <div className="mt-5 border-t border-navy/15 pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/50">
                Day 01
              </p>
              <p className="mt-1 font-display text-xl">{firstDay.zone.title}</p>

              <ol className="mt-3 space-y-2">
                {firstDay.items.slice(0, 4).map((item) => (
                  <li key={item.activity.id} className="flex gap-3 text-sm">
                    <span className="tnum w-11 shrink-0 font-bold text-sun-deep">
                      {item.start}
                    </span>
                    <span>{item.activity.name}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="bg-navy text-sand">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun">
              A better starting point
            </p>

            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">
              You do not need another list of places to visit.
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-sand/75">
              You probably already have saved posts, map pins, recommendations
              from friends and a vague idea of what you want. The difficult part
              is turning all of that into days that actually work together.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((item) => (
              <article
                key={item.number}
                className="border-t border-sand/25 pt-5"
              >
                <span className="tnum text-sm font-bold text-sun">
                  {item.number}
                </span>
                <h3 className="mt-6 font-display text-3xl">{item.title}</h3>
                <p className="mt-4 leading-relaxed text-sand/70">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun-deep">
              The difference
            </p>

            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Your preferences should change the itinerary.
            </h2>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-navy/70">
              “I do not want to rush” should mean something more than a sentence
              in a prompt. It should change how many major stops you get, how
              much travel is between them and how much room the day has to
              breathe.
            </p>

            <Link
              to="/how-it-works"
              className="mt-8 inline-flex items-center gap-2 font-bold underline decoration-sun decoration-2 underline-offset-8"
            >
              See how Scene interprets a trip
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-linen p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-sand p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/50">
                  You say
                </p>
                <p className="mt-4 font-display text-2xl leading-snug">
                  “I want to see a lot, but I hate spending my whole day
                  travelling between places.”
                </p>
              </div>

              <div className="bg-navy p-6 text-sand">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-sand/50">
                  Scene plans for
                </p>

                <ul className="mt-5 space-y-4">
                  {[
                    "Fewer cross-city journeys",
                    "Neighbourhood-based days",
                    "A manageable number of major stops",
                    "More time where it matters",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check size={18} className="mt-0.5 shrink-0 text-sun" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand-deep">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun-deep">
                Start somewhere
              </p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">
                Where are you going?
              </h2>
            </div>

            <Link
              to="/plan"
              className="inline-flex items-center gap-2 font-bold underline decoration-sun decoration-2 underline-offset-8"
            >
              Build my trip
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {EXAMPLES.map((example) => (
              <Link
                key={example.id}
                to={`/examples?trip=${example.id}`}
                aria-label={`Explore a ${example.brief.days}-day trip to ${getDestination(example.id).name}`}
              >
                <TripCard
                  destination={getDestination(example.id)}
                  meta={`${example.brief.days} days · ${PACE_LABELS[
                    example.brief.pace
                  ].toLowerCase()}`}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sun">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-navy/60">
              Your next trip
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
              Start with what you want the trip to feel like.
            </h2>
          </div>

          <Link
            to="/plan"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-7 py-4 font-bold text-sand transition-colors hover:bg-navy-soft"
          >
            Plan my trip
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
