interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  options: Option<T>[]
  selected: T[]
  onToggle: (value: T) => void
  /** Show the pick order on selected pills. */
  showRank?: boolean
  label?: string
}

export default function PreferencePills<T extends string>({ options, selected, onToggle, showRank = false, label }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const idx = selected.indexOf(o.value)
        const on = idx >= 0
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o.value)}
            className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[0.95rem] font-medium transition-colors ${
              on ? 'border-navy bg-navy text-sand' : 'border-navy/30 bg-linen text-navy hover:border-navy'
            }`}
          >
            {showRank && on && (
              <span className="grid size-5 place-items-center rounded-full bg-sun text-xs font-bold text-navy">{idx + 1}</span>
            )}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
