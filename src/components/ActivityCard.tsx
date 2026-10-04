import { ChevronRight, Sparkles } from 'lucide-react'
import { ROLE_LABEL, formatDuration, isMajorRole } from '../engine/sceneEngine'
import type { ScheduledItem } from '../types'

interface Props {
  item: ScheduledItem
  active: boolean
  onOpen: (item: ScheduledItem) => void
}

export default function ActivityCard({ item, active, onOpen }: Props) {
  const a = item.activity
  const major = isMajorRole(item.role)
  const surface = active
    ? 'bg-navy text-sand'
    : major
      ? 'bg-linen hover:bg-white/80'
      : 'border border-navy/25 bg-transparent hover:bg-linen/70'

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`${a.name}, ${item.start}. Open details`}
      className={`group w-full rounded-xl p-4 text-left transition-colors sm:p-5 ${surface}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-sm font-bold ${active ? 'text-sun' : 'text-sun-deep'}`}>{ROLE_LABEL[item.role]}</span>
        {item.tag && (
          <span className="rounded-full bg-sky px-2.5 py-0.5 text-xs font-bold text-navy">{item.tag}</span>
        )}
      </div>
      <div className="mt-1 flex items-start justify-between gap-3">
        <h4 className="font-display text-2xl leading-tight">{a.name}</h4>
        <ChevronRight size={20} className="mt-1.5 shrink-0 opacity-50 transition-transform group-hover:translate-x-1" aria-hidden />
      </div>
      <p className={`mt-1 text-sm ${active ? 'text-sand/75' : 'text-navy/65'}`}>
        {a.area}, {formatDuration(a.minutes)}
      </p>
      <p className="mt-2 max-w-prose">{a.note}</p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 group-hover:underline">
        <Sparkles size={14} aria-hidden /> Why Ona chose this
      </span>
    </button>
  )
}
