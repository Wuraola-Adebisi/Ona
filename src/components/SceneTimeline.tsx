import { CloudRain, Clock, Moon, Undo2 } from 'lucide-react'
import { Fragment } from 'react'
import { travelText } from '../engine/sceneEngine'
import type { Adjust, Day, ScheduledItem } from '../types'
import ActivityCard from './ActivityCard'

interface Props {
  day: Day
  activeId: string | null
  onOpen: (item: ScheduledItem) => void
  onAdjust: (kind: Adjust) => void
  onReset: () => void
}

const ADJUSTMENTS: { kind: Adjust; ask: string; action: string; Icon: typeof Clock }[] = [
  { kind: 'slower', ask: 'The day feels too busy?', action: 'Make it slower', Icon: Clock },
  { kind: 'rain', ask: 'Rain on this day?', action: 'Rework the day', Icon: CloudRain },
  { kind: 'tired', ask: 'Feeling tired?', action: 'Give me an easier evening', Icon: Moon },
]

const grid = 'grid grid-cols-[3.75rem_1fr] gap-x-3 sm:grid-cols-[4.5rem_1fr] sm:gap-x-5'

export default function SceneTimeline({ day, activeId, onOpen, onAdjust, onReset }: Props) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-display text-4xl leading-none sm:text-5xl">{day.zone.title}</h3>
        <p className="mt-3 max-w-xl text-navy/75">{day.zone.blurb}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {ADJUSTMENTS.map(({ kind, ask, action, Icon }) => (
          <button
            key={kind}
            type="button"
            onClick={() => onAdjust(kind)}
            className="group flex flex-col items-start gap-1 border-2 border-navy p-4 text-left transition-colors hover:bg-navy hover:text-sand"
          >
            <Icon size={18} aria-hidden className="text-sun-deep group-hover:text-sun" />
            <span className="mt-1 text-sm text-navy/70 group-hover:text-sand/75">{ask}</span>
            <span className="font-display text-lg leading-snug">{action}</span>
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {day.notice && (
          <div className="mt-4 flex items-start justify-between gap-4 border-l-4 border-sun bg-sun/20 px-4 py-3 text-[0.95rem]">
            <p>{day.notice}</p>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex shrink-0 items-center gap-1.5 font-bold underline underline-offset-4"
            >
              <Undo2 size={14} aria-hidden /> Undo
            </button>
          </div>
        )}
      </div>

      <ol className="mt-8">
        {day.items.map((it, i) => (
          <Fragment key={it.activity.id}>
            {i > 0 && (
              <li className={grid}>
                <div />
                <p className="border-l-2 border-dashed border-navy/30 py-2.5 pl-5 text-sm text-navy/60 sm:pl-7">{travelText(it)}</p>
              </li>
            )}
            <li className={grid}>
              <div className="pt-5 text-right">
                <span className="tnum text-lg font-bold">{it.start}</span>
              </div>
              <div className="relative border-l-2 border-navy/30 pl-5 sm:pl-7">
                <span aria-hidden className="absolute -left-[0.55rem] top-[1.55rem] size-4 rounded-full border-2 border-navy bg-sand" />
                <ActivityCard item={it} active={activeId === it.activity.id} onOpen={onOpen} />
              </div>
            </li>
          </Fragment>
        ))}
      </ol>
    </div>
  )
}
