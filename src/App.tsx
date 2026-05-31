import './lib/gsap'
import { SmoothScroll } from './components/providers/SmoothScroll'
import { Scene } from './components/canvas/Scene'
import { Hero } from './components/sections/Hero'
import { Address } from './components/sections/Address'
import { WhenWhere } from './components/sections/WhenWhere'
import { Schedule } from './components/sections/Schedule'
import { DressCode } from './components/sections/DressCode'
import { RSVP } from './components/sections/RSVP'
import { FAQ } from './components/sections/FAQ'
import { Contacts } from './components/sections/Contacts'
import { Finale } from './components/sections/Finale'
import { FilmGrain } from './components/effects/FilmGrain'
import { IntroLockscreen } from './components/intro/IntroLockscreen'
import {
  IntroPhaseProvider,
  PreloadHeroTextures,
  useIntroPhase,
} from './lib/useIntroPhase'
import { usePaletteTint } from './lib/usePaletteTint'

function App() {
  return (
    <IntroPhaseProvider>
      <PreloadHeroTextures />
      <SmoothScroll />
      <Scene />
      <IntroLockscreen />
      <MainContent />
    </IntroPhaseProvider>
  )
}

function MainContent() {
  const { state } = useIntroPhase()
  if (state.phase !== 'done' && state.phase !== 'skipped') return null
  return <ContentLayer />
}

function ContentLayer() {
  usePaletteTint()

  return (
    <>
      <FilmGrain />
      <main className="relative z-10">
        <Hero />
        {/* Opaque backdrop so the fixed hero (WebGL / mobile photo) never shows
            through transparent content sections while scrolling. Banded
            sections (sage-soft, Finale) paint over this locally. */}
        <div className="bg-bg">
          <Address />
          <WhenWhere />
          <Schedule />
          <DressCode />
          <RSVP />
          <FAQ />
          <Contacts />
          <Finale />
        </div>
      </main>
    </>
  )
}

export default App
