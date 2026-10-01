import { ArrowRight, Check, Clock3, Compass, MapPin, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const INPUTS = [
  {
    icon: Clock3,
    title: "Your pace",
    body: "Slow mornings, full days, or somewhere in between.",
  },
  {
    icon: MapPin,
    title: "What you want to see",
    body: "Food, galleries, beaches, neighbourhoods, nightlife, or a mix.",
  },
  {
    icon: Utensils,
    title: "What matters to you",
    body: "The things worth making room for, and the things you would skip.",
  },
  {
    icon: Compass,
    title: "The way you want the trip to feel",
    body: "Easy and open, or planned enough that you do not have to think about it.",
  },
];

function TripSketch() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-navy p-5 text-sand shadow-2xl shadow-navy/15 sm:p-7">
      <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-sun opacity-90" />
      <div className="absolute -bottom-24 -left-12 h-48 w-48 rounded-full border-[34px] border-sand/10" />

      <div className="relative">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-sand/50">
          <span>Your trip</span>
          <span>Ona</span>
        </div>

        <div className="mt-10 rounded-2xl bg-sand/8 p-5 ring-1 ring-sand/10 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-sand/45">A good day</p>
              <p className="mt-2 font-display text-3xl">Room to wander</p>
            </div>
            <span className="rounded-full bg-sun px-3 py-1 text-xs font-bold text-navy">Day 02</span>
          </div>

          <svg viewBox="0 0 520 150" className="mt-8 h-auto w-full" aria-hidden="true">
            <path
              d="M35 106 C110 35 155 120 230 67 S360 32 485 88"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="5 9"
              className="text-sand/45"
            />
            {[
              [35, 106, "08:30"],
              [145, 83, "10:30"],
              [285, 61, "13:00"],
              [390, 54, "16:30"],
              [485, 88, "19:30"],
            ].map(([x, y, label], index) => (
              <g key={String(label)}>
                <circle
                  cx={x}
                  cy={y}
                  r={index === 2 ? 10 : 7}
                  fill={index === 2 ? "var(--color-sun)" : "var(--color-sand)"}
                />
                <text
                  x={x}
                  y={Number(y) + 27}
                  textAnchor="middle"
                  fill="currentColor"
                  className="fill-sand/55 text-[10px] font-bold"
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl bg-sand/8 px-3 py-3 text-sand/65">Coffee</div>
            <div className="rounded-xl bg-sun px-3 py-3 font-bold text-navy">Explore</div>
            <div className="rounded-xl bg-sand/8 px-3 py-3 text-sand/65">Dinner</div>
          </div>
        </div>

        <p className="mt-5 max-w-sm text-sm leading-relaxed text-sand/55">
          Not a list of places. A day arranged so the places actually work together.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:pb-28 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.82fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sun-deep">Travel planning, without the spreadsheet</p>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(4rem,9vw,8rem)] leading-[0.86] tracking-[-0.04em]">
              Plan a trip that feels like yours.
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-navy/70 sm:text-2xl">
              Tell Ona where you are going and what you want from the trip. It turns that into a day-by-day plan you can actually use.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link to="/plan" className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-4 font-bold text-sand hover:bg-navy-soft">
                Plan a trip <ArrowRight size={18} />
              </Link>
              <Link to="/examples" className="font-bold underline decoration-sun decoration-2 underline-offset-8">
                See trips people might take
              </Link>
            </div>
          </div>

          <TripSketch />
        </div>
      </section>

      <section className="bg-navy text-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sun">Start with the trip, not the search box</p>
              <h2 className="mt-5 max-w-xl font-display text-5xl leading-[0.95] sm:text-6xl">
                You do not need to know exactly what you want yet.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-sand/65">
                Give Ona the rough version. A few details are enough to start shaping the days.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl bg-sand/15 sm:grid-cols-2">
              {INPUTS.map(({ icon: Icon, title, body }, index) => (
                <article key={title} className="bg-navy p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <Icon size={22} className="text-sun" strokeWidth={1.8} />
                    <span className="tnum text-xs font-bold text-sand/30">0{index + 1}</span>
                  </div>
                  <h3 className="mt-10 font-display text-2xl">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-sand/60">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sun-deep">The difference</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95]">The hard part is not finding places.</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-navy/70">
              It is deciding what belongs together, what can wait, and how much you can realistically fit into a day.
            </p>
            <Link to="/how-it-works" className="mt-8 inline-flex items-center gap-2 font-bold underline decoration-sun decoration-2 underline-offset-8">
              How Ona puts a trip together <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-sand-deep p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-navy/45">You tell Ona</p>
              <p className="mt-5 font-display text-3xl leading-tight">
                “I want to see a lot, but I do not want to spend the whole day travelling.”
              </p>
            </div>
            <div className="bg-linen p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-navy/45">The plan reflects it</p>
              <ul className="mt-5 space-y-4 text-sm">
                {["Nearby places grouped together", "Fewer unnecessary crossings", "A realistic number of stops", "Room to wander"].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check size={17} className="mt-0.5 shrink-0 text-sun-deep" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-sand-deep">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sun-deep">See it in practice</p>
              <h2 className="mt-3 font-display text-5xl leading-none">A few trips, different priorities.</h2>
              <p className="mt-4 max-w-xl text-navy/65">
                Browse a few starting points to see how changing the traveller changes the itinerary.
              </p>
            </div>
            <Link to="/examples" className="font-bold underline decoration-sun decoration-2 underline-offset-8">Explore trips</Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Food first", "Build a trip around meals, markets and places worth lingering over."],
              ["See the city", "Cover the places you came for without turning every day into a race."],
              ["Slow it down", "Leave space for long mornings, wandering and changing your mind."],
              ["Make the most of it", "Fit more into a short trip while keeping the route sensible."],
            ].map(([title, body], index) => (
              <Link
                key={title}
                to="/examples"
                className="group min-h-56 border border-navy/10 bg-linen p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="tnum text-xs font-bold text-sun-deep">0{index + 1}</span>
                <h3 className="mt-12 font-display text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy/60">{body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">
                  Explore <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sun">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy/55">Ready when you are</p>
            <h2 className="mt-2 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">Start with where you are going.</h2>
          </div>
          <Link to="/plan" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-7 py-4 font-bold text-sand hover:bg-navy-soft">
            Plan my trip <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
