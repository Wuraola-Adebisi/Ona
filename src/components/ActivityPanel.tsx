import { ArrowRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import {
  INTEREST_LABELS,
  ROLE_LABEL,
  energyLabel,
  formatDuration,
  travelText,
} from '../engine/sceneEngine'
import type { ScheduledItem } from '../types'

interface Props {
  item: ScheduledItem | null
  onClose: () => void
}

export default function ActivityPanel({ item, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = item !== null

  useEffect(() => {
    if (!open) return

    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-navy/50 transition-opacity duration-300 ${
          open
            ? 'opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={
          item
            ? `Details for ${item.activity.name}`
            : 'Details'
        }
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-linen text-navy shadow-2xl transition-transform duration-300 ${
          open
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >
        {item && (
          <>
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-navy/15 bg-linen/95 px-6 py-4 backdrop-blur sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-deep">
                  {ROLE_LABEL[item.role]}
                </p>

                <p className="mt-0.5 text-sm text-navy/60 tnum">
                  {item.start}–{item.end}
                </p>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="grid size-10 place-items-center rounded-full border border-navy/30 transition-colors hover:bg-navy hover:text-sand"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 p-6 sm:p-8">
              <h2 className="font-display text-4xl leading-tight">
                {item.activity.name}
              </h2>

              <p className="mt-2 text-navy/70">
                {item.activity.area}
              </p>

              <p className="mt-5 text-[1.05rem] leading-relaxed">
                {item.activity.note}
              </p>

              <section className="mt-9 rounded-tl-3xl rounded-br-3xl bg-mist/70 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-deep">
                  Why this fits
                </p>

                <h3 className="mt-1 font-display text-2xl">
                  Why this fits
                </h3>

                <p className="mt-3 leading-relaxed">
                  {item.why}
                </p>
              </section>

              <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 border-t-2 border-navy pt-5">
                <div>
                  <dt className="text-sm text-navy/60">Time</dt>
                  <dd className="mt-1 font-bold tnum">
                    {item.start}–{item.end}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-navy/60">
                    Duration
                  </dt>
                  <dd className="mt-1 font-bold">
                    {formatDuration(item.activity.minutes)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-navy/60">
                    Travel
                  </dt>
                  <dd className="mt-1 font-medium">
                    {travelText(item)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-navy/60">
                    Energy
                  </dt>
                  <dd className="mt-1 font-medium">
                    {energyLabel(item.activity.energy)}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 border-t border-navy/15 pt-5">
                <p className="text-sm font-bold">
                  Fits your trip because
                </p>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.activity.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-mist px-3 py-1.5 text-sm font-medium"
                    >
                      {INTEREST_LABELS[tag]}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-9 inline-flex items-center gap-2 font-bold underline underline-offset-4"
              >
                Back to the itinerary
                <ArrowRight size={16} aria-hidden />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}