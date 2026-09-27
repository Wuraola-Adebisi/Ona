import { Outlet, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
import About from './pages/About'
import Examples from './pages/Examples'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import { Privacy, Terms } from './pages/Legal'
import Plan from './pages/Plan'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-sand"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </>
  )
}
