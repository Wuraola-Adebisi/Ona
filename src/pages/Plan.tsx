import { Minus, Plus, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PreferencePills from "../components/PreferencePills";
import SceneResult from "../components/SceneResult";
import TripCard from "../components/TripCard";
import { DESTINATIONS, getDestination } from "../data/destinations";
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
  const [destId, setDestId] = useState<DestinationId>(
    prefill?.destination ?? "lisbon",
  );
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

  const merged = (): Brief => ({
    destination: destId,
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

  const canBuild = merged().interests.length > 0;

  if (scene) {
    return (
      <SceneResult
        ona={ona}
        onChange={setOna}
        action={{
          label: "Change my trip",
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
              Working on your trip
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
                <span className="size-2 rounded-full bg-sun animate-pulse" />
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
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun-deep">
            Shape your trip
          </p>

          <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-7xl">
            Where do you want to go, and how do you want to experience it?
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/70">
            Start with a sentence. Tell Ona where you are going, how long you
            have, what you care about and anything you already know you want to
            avoid.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div>
            <label
              htmlFor="trip-brief"
              className="text-sm font-bold uppercase tracking-[0.14em]"
            >
              Your trip
            </label>

            <textarea
              id="trip-brief"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={7}
              placeholder={PLACEHOLDER}
              className="mt-3 w-full resize-y border-2 border-navy bg-linen p-6 text-lg leading-relaxed placeholder:text-navy/40 focus:border-sun focus:outline-none"
            />

            <div className="mt-4 min-h-12" aria-live="polite">
              {parsed.unknownPlace && (
                <p className="border-l-4 border-sun bg-sun/15 px-4 py-3 text-sm">
                  Ona does not have {parsed.unknownPlace} in its current
                  destination library. You can choose another destination below.
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

          <aside className="bg-linen p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 shrink-0 text-sun-deep" size={19} />
              <div>
                <p className="font-bold">You can be vague.</p>
                <p className="mt-1 text-sm leading-relaxed text-navy/65">
                  Ona is built to work from the way you naturally describe a
                  trip. You can refine the details below if you want more
                  control.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-navy/15 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/50">
                Currently planning
              </p>
              <p className="mt-2 font-display text-2xl">{destination.name}</p>
              <p className="text-sm text-navy/65">
                {days} {days === 1 ? "day" : "days"}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-navy/15 bg-sand-deep">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
                Refine it
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                Give Ona a little more direction.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-navy/65">
              Anything you already wrote above is included. These controls
              simply give you another way to shape the result.
            </p>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl">Where are you going?</h3>

              <div
                className="mt-5 grid grid-cols-2 gap-4"
                role="group"
                aria-label="Destination"
              >
                {DESTINATIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={destId === item.id}
                    onClick={() => {
                      setDestId(item.id);
                      setDays((current) =>
                        Math.min(current, item.zones.length),
                      );
                    }}
                    className="text-left"
                  >
                    <TripCard
                      destination={item}
                      meta={item.country}
                      selected={destId === item.id}
                      compact
                    />
                  </button>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <span className="font-bold">How long?</span>

                <div
                  className="inline-flex items-center border-2 border-navy"
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
            </div>

            <div>
              <h3 className="font-display text-2xl">What matters to you?</h3>
              <p className="mt-1 text-sm text-navy/65">
                Pick as many as you like. The first two carry the most weight.
              </p>

              <div className="mt-5">
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

              <div className="mt-10">
                <h3 className="font-display text-2xl">
                  How should the days feel?
                </h3>

                <div
                  role="group"
                  aria-label="Trip pace"
                  className="mt-4 grid gap-3"
                >
                  {(["relaxed", "balanced", "packed"] as Pace[]).map(
                    (option) => (
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
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-navy/15 pt-10">
            <h3 className="font-display text-2xl">Keep out</h3>

            <div className="mt-4">
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

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                Tell Ona at least one thing you want from the trip.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
