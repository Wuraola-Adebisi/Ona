import type { Destination } from '../types'
import DestinationArt from './DestinationArt'

interface Props {
  destination: Destination
  meta: string
  selected?: boolean
  compact?: boolean
}

/** Presentational only. Wrap it in a Link or button where it needs to be clickable. */
export default function TripCard({ destination, meta, selected = false, compact = false }: Props) {
  return (
    <div
      className={`group overflow-hidden bg-navy text-sand transition-transform ${
        selected ? 'outline-4 outline-sun' : ''
      } ${compact ? 'rounded-t-[5rem] rounded-b-lg' : 'rounded-t-[9rem] rounded-b-xl'}`}
    >
      <DestinationArt
        destination={destination}
        className={`w-full transition-transform duration-500 group-hover:scale-[1.03] ${compact ? 'aspect-[5/4]' : 'aspect-[4/5]'}`}
      />
      <div className={compact ? 'px-4 py-3' : 'px-5 py-4'}>
        <p className={`font-display leading-none ${compact ? 'text-2xl' : 'text-3xl'}`}>{destination.name}</p>
        <p className="mt-1.5 text-sm text-sand/75">{meta}</p>
      </div>
    </div>
  )
}
