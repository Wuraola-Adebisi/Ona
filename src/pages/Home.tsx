import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import DestinationArt from "../components/DestinationArt";
import { EXAMPLES } from "../data/examples";
import { getDestination } from "../data/destinations";
import { buildScene, PACE_LABELS } from "../engine/sceneEngine";

const demo = buildScene(EXAMPLES[0].brief);
const demoDestination = demo.destination;

const POINTS = [
  ["01", "Start with how you travel", "A sentence is enough. Ona picks up what matters: pace, interests, energy, food, culture, quiet, nightlife and the things you would rather skip."],
  ["02", "Turn preferences into days", "Your preferences should affect the actual route. Fewer unnecessary crossings, sensible neighbourhoods and enough room for the parts you care about."],
  ["03", "Keep the plan editable", "A good itinerary is not a contract. Change the pace, reshape a day or make room for a slower evening without rebuilding everything."],
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:pb-28 lg:pt-20">
        <div className="grid items-end gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sun-deep">Travel, shaped around you</p>
            <h1 className="mt-6 max-w-5xl font-display text-[clamp(4rem,9vw,8rem)] leading-[0.86] tracking-[-0.04em]">
              Go somewhere. Make it yours.
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-navy/70 sm:text-2xl">
              Tell Ona where you are going and what you want from the trip. It turns the brief into days that make sense for you.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link to="/plan" className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-4 font-bold text-sand hover:bg-navy-soft">
                Plan a trip <ArrowRight size={18} />
              </Link>
              <Link to="/examples" className="font-bold underline decoration-sun decoration-2 underline-offset-8">
                See examples
              </Link>
            </div>
          </div>

          <div className="relative lg:pb-8">
            <DestinationArt destination={demoDestination} className="aspect-[4/5] w-full rounded-[2rem] lg:rounded-t-[12rem]" />
            <div className="absolute -bottom-5 left-5 w-[min(23rem,90%)] bg-linen p-5 shadow-xl shadow-navy/10 sm:left-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy/50">A sample brief</p>
                  <p className="mt-1 font-display text-3xl">{demoDestination.name}</p>
                </div>
                <span className="tnum text-sm font-bold">{demo.days.length} days</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-navy/65">
                Architecture, cafés and food. Relaxed pace. Avoid the obvious tourist traps.
              </p>
              <div className="mt-4 border-t border-navy/15 pt-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/45">Day 01</p>
                <p className="mt-1 font-display text-xl">{demo.days[0].zone.title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy text-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sun">The idea</p>
              <h2 className="mt-5 max-w-xl font-display text-5xl leading-[0.95] sm:text-6xl">
                Your itinerary should respond to you.
              </h2>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {POINTS.map(([number, title, body]) => (
                <article key={number} className="border-t border-sand/25 pt-5">
                  <span className="tnum text-sm font-bold text-sun">{number}</span>
                  <h3 className="mt-7 font-display text-2xl leading-tight">{title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-sand/70">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sun-deep">A different starting point</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95]">Not a list. A trip.</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-navy/70">
              You can already find thousands of recommendations. The harder part is deciding what belongs together, what can wait and how the whole day should feel.
            </p>
            <Link to="/how-it-works" className="mt-8 inline-flex items-center gap-2 font-bold underline decoration-sun decoration-2 underline-offset-8">
              How Ona thinks about a trip <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-sand-deep p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-navy/45">You say</p>
              <p className="mt-5 font-display text-3xl leading-tight">“I want to see a lot, but I don't want to spend the whole day travelling.”</p>
            </div>
            <div className="bg-linen p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-navy/45">Ona builds around it</p>
              <ul className="mt-5 space-y-4 text-sm">
                {["Neighbourhood-based days", "Fewer unnecessary crossings", "A manageable number of major stops", "Room to slow down"].map((item) => (
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sun-deep">Example trips</p>
              <h2 className="mt-3 font-display text-5xl leading-none">Four ways to use Ona.</h2>
              <p className="mt-4 max-w-xl text-navy/65">These are examples, not the limits of where you can go. The destination library is data, not the product.</p>
            </div>
            <Link to="/examples" className="font-bold underline decoration-sun decoration-2 underline-offset-8">Explore examples</Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {EXAMPLES.map((example) => (
              <Link key={example.id} to={`/examples?trip=${example.id}`} className="group">
                <div className="overflow-hidden">
                  <DestinationArt destination={getDestination(example.id)} className="aspect-[4/5] w-full rounded-t-[5rem] transition-transform duration-500 group-hover:scale-[1.02]" />
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl">{getDestination(example.id).name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-navy/50">{example.brief.days} days · {PACE_LABELS[example.brief.pace]}</p>
                  </div>
                  <ArrowRight size={17} className="mb-1 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sun">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy/55">Your next trip</p>
            <h2 className="mt-2 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">Start with where you're going.</h2>
          </div>
          <Link to="/plan" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-7 py-4 font-bold text-sand hover:bg-navy-soft">
            Plan my trip <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
