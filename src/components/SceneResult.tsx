import { ArrowLeft, CloudRain, Moon, Wind } from "lucide-react";
import { useCallback, useState } from "react";
import {
  INTEREST_LABELS,
  MOODS,
  adjustDay,
  buildScene,
  resetDay,
} from "../engine/sceneEngine";
import type { Adjust, Mood, Scene, ScheduledItem } from "../types";
import ActivityPanel from "./ActivityPanel";
import DestinationArt from "./DestinationArt";
import InterpretationPanel from "./InterpretationPanel";
import RouteDiagram from "./RouteDiagram";
import SceneTimeline from "./SceneTimeline";

interface Props {
  scene: Scene;
  onChange: (scene: Scene) => void;
  action?: { label: string; onClick: () => void };
}

const two = (number: number) => String(number).padStart(2, "0");

const ADJUSTMENTS: {
  kind: Adjust;
  label: string;
  body: string;
  Icon: typeof Wind;
}[] = [
  {
    kind: "slower",
    label: "Slow this day down",
    body: "Fewer major stops, a later start and more breathing room.",
    Icon: Wind,
  },
  {
    kind: "rain",
    label: "Plan around rain",
    body: "Swap exposed stops for indoor alternatives where possible.",
    Icon: CloudRain,
  },
  {
    kind: "tired",
    label: "Ease up tonight",
    body: "Drop the late stops and make dinner the end of the day.",
    Icon: Moon,
  },
];

export default function SceneResult({ scene, onChange, action }: Props) {
  const [dayIdx, setDayIdx] = useState(0);
  const [open, setOpen] = useState<ScheduledItem | null>(null);

  const close = useCallback(() => setOpen(null), []);

  const idx = Math.min(dayIdx, scene.days.length - 1);
  const day = scene.days[idx];
  const destination = scene.destination;

  const meta = [
    scene.ctx.moodLabel,
    ...scene.brief.interests
      .slice(0, 2)
      .map((interest) => INTEREST_LABELS[interest]),
  ].join(" · ");

  const changeMood = (mood: Mood) => {
    setOpen(null);
    onChange(buildScene(scene.brief, mood, scene.pace));
  };

  const adjust = (kind: Adjust) => {
    setOpen(null);
    onChange(adjustDay(scene, idx, kind));
  };

  return (
    <div>
      <header className="bg-navy text-sand">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10 md:grid-cols-[1fr_18rem] md:items-end">
          <div>
            <button
              type="button"
              onClick={action?.onClick}
              className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-sand/65 transition-colors hover:text-sand"
            >
              <ArrowLeft size={16} />
              {action?.label ?? "Edit trip"}
            </button>

            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sun">
              Your trip
            </p>

            <h1 className="mt-3 font-display text-[clamp(3.5rem,11vw,8rem)] leading-[0.82] tracking-tight">
              {destination.name}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sand/70">
              <span className="font-bold text-sand">
                {scene.days.length} {scene.days.length === 1 ? "day" : "days"}
              </span>
              <span>{meta}</span>
            </div>
          </div>

          <DestinationArt
            destination={destination}
            className="hidden aspect-[4/5] w-full rounded-t-[8rem] md:block"
          />
        </div>
      </header>

      <main>
        <section className="border-b border-navy/15 bg-sand-deep">
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/45">
                  Pace
                </p>
                <p className="mt-1 font-display text-2xl">{scene.interpretation.pace}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/45">
                  Priorities
                </p>
                <p className="mt-1 font-display text-2xl">
                  {scene.brief.interests.length
                    ? scene.brief.interests
                        .slice(0, 2)
                        .map((interest) => INTEREST_LABELS[interest])
                        .join(" + ")
                    : "Open-ended"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/45">
                  Rhythm
                </p>
                <p className="mt-1 font-display text-2xl">
                  {scene.interpretation.travel.toLowerCase()} travel
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <section>
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
                Tune the trip
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                Change the feeling, not the brief.
              </h2>
              <p className="mt-3 text-navy/65">
                Pick a mood and Ona will rebuild the days around the same
                destination, interests and constraints.
              </p>
            </div>

            <div
              role="group"
              aria-label="Trip mood"
              className="mt-6 flex flex-wrap gap-2.5"
            >
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  aria-pressed={scene.mood === mood.id}
                  onClick={() => changeMood(mood.id)}
                  className={`rounded-full border-2 px-5 py-2.5 font-medium transition-colors ${
                    scene.mood === mood.id
                      ? "border-navy bg-navy text-sand"
                      : "border-navy/25 bg-linen hover:border-navy"
                  }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <InterpretationPanel data={scene.interpretation} />
          </section>

          <section className="mt-16" aria-label="Your days">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
                Your days
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                A trip with a shape.
              </h2>
              <p className="mt-3 text-navy/65">
                Each day stays geographically coherent. Open any stop to see
                why it made the cut.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Trip days"
              className="mt-8 flex gap-2 overflow-x-auto border-b-2 border-navy pb-px"
            >
              {scene.days.map((item, index) => (
                <button
                  key={item.index}
                  role="tab"
                  type="button"
                  aria-selected={index === idx}
                  onClick={() => {
                    setDayIdx(index);
                    setOpen(null);
                  }}
                  className={`min-w-36 shrink-0 border-b-4 px-4 pb-4 pt-2 text-left transition-colors ${
                    index === idx
                      ? "border-sun text-navy"
                      : "border-transparent text-navy/50 hover:text-navy"
                  }`}
                >
                  <span className="block text-xs font-bold uppercase tracking-[0.12em]">
                    Day {two(index + 1)}
                  </span>
                  <span className="mt-1 block font-display text-xl leading-tight">
                    {item.zone.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
              <div role="tabpanel">
                <SceneTimeline
                  day={day}
                  activeId={open?.activity.id ?? null}
                  onOpen={setOpen}
                  onAdjust={adjust}
                  onReset={() => onChange(resetDay(scene, idx))}
                />
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-navy/45">
                  Route
                </p>
                <RouteDiagram
                  items={day.items}
                  activeId={open?.activity.id ?? null}
                  title={day.zone.title}
                />
              </aside>
            </div>
          </section>

          <section className="mt-16 border-t-2 border-navy pt-10">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
                Change one day
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                Keep the rest of the trip intact.
              </h2>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {ADJUSTMENTS.map(({ kind, label, body, Icon }) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => adjust(kind)}
                  className="group flex items-start gap-4 border-2 border-navy/20 bg-linen p-5 text-left transition-colors hover:border-navy hover:bg-navy hover:text-sand"
                >
                  <Icon
                    size={20}
                    className="mt-0.5 shrink-0 text-sun-deep group-hover:text-sun"
                  />
                  <span>
                    <strong className="block font-display text-xl">{label}</strong>
                    <span className="mt-1 block text-sm text-navy/65 group-hover:text-sand/70">
                      {body}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      <ActivityPanel item={open} onClose={close} />
    </div>
  );
}
