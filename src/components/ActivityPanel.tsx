import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { INTEREST_LABELS, ROLE_LABEL, energyLabel, formatDuration, travelText } from '../engine/sceneEngine'
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-navy/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={item ? `Details for ${item.activity.name}` : 'Details'}
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-linen text-navy transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {item && (
          <div className="flex-1 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-bold text-sun-deep">{ROLE_LABEL[item.role]}</p>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="grid size-10 place-items-center rounded-full border border-navy/30 hover:bg-navy hover:text-sand"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="mt-2 font-display text-4xl leading-tight">{item.activity.name}</h2>
            <p className="mt-2 text-navy/70">{item.activity.area}</p>
            <p className="mt-4">{item.activity.note}</p>

            <section className="mt-8 border-t-2 border-navy pt-5">
              <h3 className="text-base font-bold">Why this is here</h3>
              <p className="mt-3 text-[1.05rem] leading-relaxed">{item.why}</p>
            </section>

            <dl className="mt-8 space-y-5 border-t-2 border-navy pt-5">
              <div>
                <dt className="text-base font-bold">Travel</dt>
                <dd className="mt-1">{travelText(item)}</dd>
              </div>
              <div>
                <dt className="text-base font-bold">Time</dt>
                <dd className="mt-1">
                  <span className="tnum">
                    {item.start} to {item.end}
                  </span>
                  , {formatDuration(item.activity.minutes)}
                </dd>
              </div>
              <div>
                <dt className="text-base font-bold">Pace</dt>
                <dd className="mt-1">{energyLabel(item.activity.energy)}</dd>
              </div>
            </dl>

            <ul className="mt-8 flex flex-wrap gap-2">
              {item.activity.tags.map((t) => (
                <li key={t} className="rounded-full bg-mist px-3 py-1 text-sm font-medium">
                  {INTEREST_LABELS[t]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </>
  )
}
