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
        <div className="mx-auto grid max-w-6xl items-end gap-10 px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 md:grid-cols-[1fr_17rem]">
          <div>
            <button
              type="button"
              onClick={action?.onClick}
              className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-sand/65 transition-colors hover:text-sand"
            >
              <ArrowLeft size={16} />
              {action?.label ?? "Change my trip"}
            </button>

            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sun">
              Your trip
            </p>

            <h1 className="mt-3 font-display text-[clamp(3.5rem,11vw,8rem)] uppercase leading-[0.84] tracking-tight">
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

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <section>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
              Shape the trip
            </p>

            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              What should the trip feel like?
            </h2>

            <p className="mt-2 text-navy/65">
              Change the overall mood and Scene will rebuild the itinerary
              around it.
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

        <section className="mt-16">
          <InterpretationPanel data={scene.interpretation} />
        </section>

        <section className="mt-16" aria-label="Your itinerary">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
                Your itinerary
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                {day.zone.title}
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-navy/60">
              Open a stop to see why it is here. You can also change one day
              without rebuilding the whole trip.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Trip days"
            className="mt-7 flex gap-3 overflow-x-auto pb-2"
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
                className={`shrink-0 border-2 px-5 py-3 text-left transition-colors ${
                  index === idx
                    ? "border-navy bg-navy text-sand"
                    : "border-navy/25 hover:border-navy"
                }`}
              >
                <span className="block text-xs font-bold uppercase tracking-[0.12em]">
                  Day {two(index + 1)}
                </span>
                <span className="mt-1 block font-display text-lg leading-tight">
                  {item.zone.title}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
            <div role="tabpanel">
              <SceneTimeline
                day={day}
                activeId={open?.activity.id ?? null}
                onOpen={setOpen}
                onAdjust={adjust}
                onReset={() => onChange(resetDay(scene, idx))}
              />
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <RouteDiagram
                items={day.items}
                activeId={open?.activity.id ?? null}
                title={day.zone.title}
              />
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-navy/15 pt-10">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
            Need to change the day?
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => adjust("slower")}
              className="flex items-start gap-4 border-2 border-navy/20 bg-linen p-5 text-left transition-colors hover:border-navy"
            >
              <Wind size={20} className="mt-0.5 shrink-0" />
              <span>
                <strong className="block font-display text-xl">
                  Make it slower
                </strong>
                <span className="mt-1 block text-sm text-navy/65">
                  Fewer major stops, later start and more breathing room.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => adjust("rain")}
              className="flex items-start gap-4 border-2 border-navy/20 bg-linen p-5 text-left transition-colors hover:border-navy"
            >
              <CloudRain size={20} className="mt-0.5 shrink-0" />
              <span>
                <strong className="block font-display text-xl">
                  Make it rainy-day friendly
                </strong>
                <span className="mt-1 block text-sm text-navy/65">
                  Swap outdoor stops for nearby indoor alternatives.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => adjust("tired")}
              className="flex items-start gap-4 border-2 border-navy/20 bg-linen p-5 text-left transition-colors hover:border-navy"
            >
              <Moon size={20} className="mt-0.5 shrink-0" />
              <span>
                <strong className="block font-display text-xl">
                  I am tired
                </strong>
                <span className="mt-1 block text-sm text-navy/65">
                  Ease up the evening and keep dinner as the final stop.
                </span>
              </span>
            </button>
          </div>
        </section>
      </div>

      <ActivityPanel item={open} onClose={close} />
    </div>
  );
}
