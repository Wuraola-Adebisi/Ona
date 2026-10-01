import { Link } from 'react-router-dom'
import { Logo } from './Header'

export default function Footer() {
  return (
    <footer className="bg-navy text-sand">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo light />

          <p className="mt-5 max-w-sm leading-relaxed text-sand/65">
            Ona helps you turn the way you want to travel into a trip that
            actually fits.
          </p>

          <Link
            to="/plan"
            className="mt-7 inline-block rounded-full bg-sun px-6 py-3 font-bold text-navy transition-colors hover:bg-[#eaa060]"
          >
            Plan a trip
          </Link>
        </div>

        <div>
          <p className="font-bold">Ona</p>

          <ul className="mt-4 space-y-3 text-sand/70">
            <li>
              <Link className="hover:text-sun" to="/plan">
                Plan a trip
              </Link>
            </li>
            <li>
              <Link className="hover:text-sun" to="/how-it-works">
                How it works
              </Link>
            </li>
            <li>
              <Link className="hover:text-sun" to="/examples">
                Examples
              </Link>
            </li>
            <li>
              <Link className="hover:text-sun" to="/about">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-bold">Legal</p>

          <ul className="mt-4 space-y-3 text-sand/70">
            <li>
              <Link className="hover:text-sun" to="/privacy">
                Privacy
              </Link>
            </li>
            <li>
              <Link className="hover:text-sun" to="/terms">
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sand/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-sm text-sand/45 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Ona. All rights reserved.</p>
          <p>Travel planning shaped around you.</p>
        </div>
      </div>
    </footer>
  )
}