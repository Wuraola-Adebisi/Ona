import { Minus, Plus, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PreferencePills from "../components/PreferencePills";
import SceneResult from "../components/SceneResult";
import TripCard from "../components/TripCard";
import { DESTINATIONS, getDestination } from "../data/destinations";
import { searchDestinations } from "../data/destinationCatalog";
import {
  AVOID_LABELS,
  INTEREST_LABELS,
  INTEREST_ORDER,
  PACE_BLURBS,
  PACE_LABELS,
  buildScene,
  describeParsed,
  readBrief,
} from "../engine/sceneEngine";
import type {
  Avoid,
  Brief,
  DestinationId,
  Interest,
  Pace,
  Scene,
} from "../types";

const PLACEHOLDER =
  "Four days in Lisbon. I love architecture, food and cafés, I want to see the important stuff, but I do not want to rush around all day.";

const unique = <T,>(items: T[]) => [...new Set(items)];

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];

export default function Plan() {
  const location = useLocation();
  const prefill = (location.state as { brief?: Brief } | null)?.brief;

  const [text, setText] = useState("");
  const [destId, setDestId] = useState<DestinationId | null>(
    prefill?.destination ?? null,
  );
  const [destinationQuery, setDestinationQuery] = useState("");
  const [days, setDays] = useState(prefill?.days ?? 4);
  const [interests, setInterests] = useState<Interest[]>(
    prefill?.interests ?? [],
  );
  const [pace, setPace] = useState<Pace>(prefill?.pace ?? "relaxed");
  const [avoid, setAvoid] = useState<Avoid[]>(prefill?.avoid ?? []);
  const [scene, setScene] = useState<Scene | null>(null);
  const [building, setBuilding] = useState(false);

  const timer = useRef<number | undefined>(undefined);

  const parsed = useMemo(() => readBrief(text), [text]);
  const chips = describeParsed(parsed);
  const destination = getDestination(destId);
  const maxDays = destination.zones.length;
  const destinationResults = useMemo(
    () => searchDestinations(destinationQuery).slice(0, 8),
    [destinationQuery],
  );

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (!parsed.destination) return;

    setDestId(parsed.destination);
    setDays((current) =>
      Math.min(current, getDestination(parsed.destination!).zones.length),
    );
  }, [parsed.destination]);

  useEffect(() => {
    if (parsed.days) {
      setDays(
        Math.min(
          parsed.days,
          getDestination(parsed.destination ?? destId).zones.length,
        ),
      );
    }
  }, [parsed.days, parsed.destination, destId]);

  useEffect(() => {
    if (parsed.pace) setPace(parsed.pace);
  }, [parsed.pace]);

  const selectDestination = (id: DestinationId) => {
    const next = getDestination(id);
    setDestId(id);
    setDays((current) => Math.min(current, next.zones.length));
    setDestinationQuery("");
  };

  const merged = (): Brief => ({
    destination: destId ?? "",
    days: Math.max(1, Math.min(days, maxDays)),
    interests: unique([...parsed.interests, ...interests]),
    pace,
    avoid: unique([...parsed.avoid, ...avoid]),
  });

  const applyParsed = (): Brief => {
    const brief = merged();

    setDestId(brief.destination);
    setDays(brief.days);
    setInterests(brief.interests);
    setPace(brief.pace);
    setAvoid(brief.avoid);

    return brief;
  };

  const build = (brief: Brief) => {
    setBuilding(true);

    timer.current = window.setTimeout(() => {
      setScene(buildScene(brief));
      setBuilding(false);
    }, 900);
  };

  const canBuild = Boolean(destId) && merged().interests.length > 0;

  if (scene) {
    return (
      <SceneResult
        scene={scene}
        onChange={setScene}
        action={{
          label: "Edit trip",
          onClick: () => setScene(null),
        }}
      />
    );
  }

  if (building) {
    return (
      <section className="grid min-h-[75vh] place-items-center bg-navy px-5 text-sand">
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-3 text-sun">
            <Sparkles size={20} />
            <span className="text-sm font-bold uppercase tracking-[0.16em]">
              Building your trip
            </span>
          </div>

          <h1 className="mt-6 font-display text-5xl leading-none sm:text-7xl">
            Putting the days together.
          </h1>

          <div className="mt-10 space-y-4 text-lg text-sand/70">
            {[
              "Reading your preferences",
              "Choosing places that fit",
              "Sequencing the days",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="size-2 animate-pulse rounded-full bg-sun" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun-deep">
            Plan a trip
          </p>

          <h1 className="mt-4 font-display text-5xl leading-[0.92] sm:text-7xl">
            Start with how you actually want to travel.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/70">
            Give Ona a sentence or two. Destination, duration, interests and
            pace can all come from the same brief. The controls below are there
            when you want more say.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <div>
            <label
              htmlFor="trip-brief"
              className="text-sm font-bold uppercase tracking-[0.14em]"
            >
              Tell Ona about the trip
            </label>

            <textarea
              id="trip-brief"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={8}
              placeholder={PLACEHOLDER}
              className="mt-3 w-full resize-y border-2 border-navy bg-linen p-6 text-lg leading-relaxed placeholder:text-navy/40 focus:border-sun focus:outline-none"
            />

            <div className="mt-4 min-h-12" aria-live="polite">
              {parsed.unknownPlace && (
                <p className="border-l-4 border-sun bg-sun/15 px-4 py-3 text-sm">
                  <strong>{parsed.unknownPlace}</strong> is not in Ona's current
                  destination library yet. You can choose a destination below.
                </p>
              )}

              {chips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-mist px-3 py-1.5 text-sm font-medium"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="border-l-2 border-navy bg-linen p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/50">
              Current brief
            </p>
            <p className="mt-3 font-display text-3xl">
              {destination?.name ?? "Choose a destination"}
            </p>
            <p className="mt-1 text-sm text-navy/65">
              {destination?.tagline ?? "Pick somewhere from the library before you build."}
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-navy/15 pt-5">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-navy/45">
                  Duration
                </dt>
                <dd className="mt-1 font-bold">
                  {days} {days === 1 ? "day" : "days"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-navy/45">
                  Pace
                </dt>
                <dd className="mt-1 font-bold">{PACE_LABELS[pace]}</dd>
              </div>
            </dl>

            <p className="mt-7 text-sm leading-relaxed text-navy/65">
              You can start vague and tighten the brief as you go. Nothing is
              final until you build the trip.
            </p>
          </aside>
        </div>
      </section>

      <section className="border-y border-navy/15 bg-sand-deep">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
              Destination
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">
              Where are you going?
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-navy/65">
              Ona's destination library is separate from the planning logic.
              Adding a city means adding its places and context, not rewriting
              the planner.
            </p>
          </div>

          <div className="mt-8 max-w-xl">
            <label htmlFor="destination-search" className="sr-only">
              Search destinations
            </label>
            <div className="relative">
              <Search
                size={18}
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/45"
              />
              <input
                id="destination-search"
                value={destinationQuery}
                onChange={(event) => setDestinationQuery(event.target.value)}
                placeholder="Search the destination library"
                className="w-full border-2 border-navy bg-linen py-3.5 pl-11 pr-4 outline-none placeholder:text-navy/40 focus:border-sun"
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-bold">
                {destinationQuery ? "Matching destinations" : "In the library"}
              </p>
              <p className="text-xs uppercase tracking-[0.12em] text-navy/45">
                {DESTINATIONS.length} available
              </p>
            </div>

            {destinationResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {destinationResults.map((item) => {
                  const destination = getDestination(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={destId === item.id}
                      onClick={() => selectDestination(item.id)}
                      className="text-left"
                    >
                      <TripCard
                        destination={destination}
                        meta={item.country}
                        selected={destId === item.id}
                        compact
                      />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="border-2 border-dashed border-navy/25 bg-linen p-6 sm:p-8">
                <p className="font-display text-2xl">Not in the library yet.</p>
                <p className="mt-2 max-w-xl leading-relaxed text-navy/65">
                  Ona is designed around a destination dataset, so unsupported
                  places are not silently turned into generic itineraries.
                  Expand the library, then the same planner can use the new
                  destination.
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl">How long?</h3>

              <div
                className="mt-4 inline-flex items-center border-2 border-navy"
                role="group"
                aria-label="Trip length"
              >
                <button
                  type="button"
                  aria-label="One day fewer"
                  disabled={days <= 1}
                  onClick={() =>
                    setDays((current) => Math.max(1, current - 1))
                  }
                  className="grid size-11 place-items-center transition-colors hover:bg-navy hover:text-sand disabled:opacity-30"
                >
                  <Minus size={18} />
                </button>

                <span
                  className="tnum min-w-24 text-center font-bold"
                  aria-live="polite"
                >
                  {days} {days === 1 ? "day" : "days"}
                </span>

                <button
                  type="button"
                  aria-label="One day more"
                  disabled={days >= maxDays}
                  onClick={() =>
                    setDays((current) => Math.min(maxDays, current + 1))
                  }
                  className="grid size-11 place-items-center transition-colors hover:bg-navy hover:text-sand disabled:opacity-30"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl">What matters to you?</h3>
              <p className="mt-1 text-sm text-navy/65">
                The first two interests carry the most weight.
              </p>

              <div className="mt-4">
                <PreferencePills
                  label="Interests"
                  showRank
                  options={INTEREST_ORDER.map((interest) => ({
                    value: interest,
                    label: INTEREST_LABELS[interest],
                  }))}
                  selected={interests}
                  onToggle={(value) =>
                    setInterests((current) => toggle(current, value))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
              Pace
            </p>
            <h2 className="mt-2 font-display text-4xl">
              How should the days feel?
            </h2>

            <div
              role="group"
              aria-label="Trip pace"
              className="mt-6 grid gap-3"
            >
              {(["relaxed", "balanced", "packed"] as Pace[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={pace === option}
                  onClick={() => setPace(option)}
                  className={`border-2 p-4 text-left transition-colors ${
                    pace === option
                      ? "border-navy bg-navy text-sand"
                      : "border-navy/25 bg-linen hover:border-navy"
                  }`}
                >
                  <span className="block font-display text-xl">
                    {PACE_LABELS[option]}
                  </span>
                  <span
                    className={`mt-1 block text-sm ${
                      pace === option ? "text-sand/70" : "text-navy/65"
                    }`}
                  >
                    {PACE_BLURBS[option]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
              Boundaries
            </p>
            <h2 className="mt-2 font-display text-4xl">Keep out.</h2>
            <p className="mt-3 max-w-md leading-relaxed text-navy/65">
              Tell Ona what would make the trip feel wrong. These constraints
              are used when places and days are scored.
            </p>

            <div className="mt-6">
              <PreferencePills
                label="Things to avoid"
                options={(Object.keys(AVOID_LABELS) as Avoid[]).map((item) => ({
                  value: item,
                  label: AVOID_LABELS[item],
                }))}
                selected={avoid}
                onToggle={(value) =>
                  setAvoid((current) => toggle(current, value))
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-navy/15 pt-8 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={!canBuild}
            onClick={() => build(applyParsed())}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-8 py-4 font-bold text-sand transition-colors hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-35"
          >
            Build my trip
            <Sparkles size={17} />
          </button>

          {!canBuild && (
            <p className="text-sm text-navy/60">
              {!destId ? "Choose a destination first." : "Tell Ona at least one thing you want from the trip."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
