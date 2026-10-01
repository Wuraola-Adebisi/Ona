import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SceneResult from "../components/SceneResult";
import TripCard from "../components/TripCard";
import { getDestination } from "../data/destinations";
import { EXAMPLES, type Example } from "../data/examples";
import { PACE_LABELS, buildScene } from "../engine/sceneEngine";
import type { DestinationId, Scene } from "../types";

function ExampleTrip({ example }: { example: Example }) {
  const navigate = useNavigate();
  const [scene, setOna] = useState<Scene>(() => buildScene(example.brief));

  return (
    <SceneResult
      scene={scene}
      onChange={setOna}
      action={{
        label: "Build my own trip",
        onClick: () =>
          navigate("/plan", {
            state: { brief: example.brief },
          }),
      }}
    />
  );
}

export default function Examples() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("trip") as DestinationId | null;
  const current = EXAMPLES.find((item) => item.id === requested) ?? EXAMPLES[0];

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pt-16">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun-deep">
          Start with an example
        </p>

        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.92] sm:text-7xl">
          See how different travellers can use Ona.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/70">
          These are starting points, not fixed itineraries. Open one to see how
          a particular set of preferences shapes the days, then change the mood
          or build your own trip.
        </p>

        <div
          role="group"
          aria-label="Trip examples"
          className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {EXAMPLES.map((example) => (
            <button
              key={example.id}
              type="button"
              aria-pressed={current.id === example.id}
              onClick={() => setParams({ trip: example.id }, { replace: true })}
              className="text-left"
            >
              <TripCard
                compact
                selected={current.id === example.id}
                destination={getDestination(example.id)}
                meta={`${example.brief.days} days · ${PACE_LABELS[
                  example.brief.pace
                ].toLowerCase()}`}
              />
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-4 border-l-4 border-sun bg-linen px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/50">
              Traveller brief
            </p>
            <p className="mt-2 max-w-2xl text-lg leading-relaxed">
              {current.said}
            </p>
          </div>
        </div>
      </section>

      <ExampleTrip key={current.id} example={current} />

      <section className="bg-sun">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy/55">
              Your trip will be different.
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Start with your own brief.
            </h2>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 font-bold underline decoration-navy decoration-2 underline-offset-8"
          >
            Choose another trip
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
