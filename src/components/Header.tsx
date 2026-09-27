import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/examples', label: 'Examples' },
  { to: '/about', label: 'About' },
]

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-[1.7rem] leading-none ${light ? 'text-sand' : 'text-navy'}`}>
      Scene
      <span aria-hidden className="size-3 rounded-full bg-sun" />
    </span>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `py-1 text-[0.95rem] font-medium border-b-2 transition-colors ${
      isActive ? 'border-sun' : 'border-transparent hover:border-navy/40'
    }`

  return (
    <header className="sticky top-0 z-30 border-b border-navy/15 bg-sand/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" aria-label="Scene home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/plan" className="rounded-full bg-navy px-5 py-2.5 text-[0.95rem] font-medium text-sand transition-colors hover:bg-navy-soft">
            Plan a trip
          </Link>
        </nav>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-navy/30 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-navy/15 px-5 pb-5 pt-3 md:hidden" aria-label="Mobile">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2.5 text-lg font-medium">
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/plan"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-navy px-5 py-3 text-center font-medium text-sand"
          >
            Plan a trip
          </Link>
        </nav>
      )}
    </header>
  )
}
