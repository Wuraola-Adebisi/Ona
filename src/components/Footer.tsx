import { Link } from 'react-router-dom'
import { Logo } from './Header'

export default function Footer() {
  return (
    <footer className="bg-navy text-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sand/75">
            Travel planning should account for how you want to spend your time, not just where you could go.
          </p>
        </div>
        <div>
          <p className="font-bold">Explore</p>
          <ul className="mt-3 space-y-2 text-sand/80">
            <li><Link className="hover:text-sun" to="/plan">Plan a trip</Link></li>
            <li><Link className="hover:text-sun" to="/how-it-works">How it works</Link></li>
            <li><Link className="hover:text-sun" to="/examples">Examples</Link></li>
            <li><Link className="hover:text-sun" to="/about">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold">Legal</p>
          <ul className="mt-3 space-y-2 text-sand/80">
            <li><Link className="hover:text-sun" to="/privacy">Privacy</Link></li>
            <li><Link className="hover:text-sun" to="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand/15">
        <p className="mx-auto max-w-6xl px-5 py-5 text-sm text-sand/60 sm:px-8">
          Scene is a portfolio demo. Itineraries come from sample data for four cities and are not bookable.
        </p>
      </div>
    </footer>
  )
}
