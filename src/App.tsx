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
import { PhotoBreak } from './components/sections/PhotoBreak'
import { SaluteBreak } from './components/sections/SaluteBreak'
import { HeartsBreak } from './components/sections/HeartsBreak'
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
        {/* Every section below is an opaque full-width band, so the fixed hero
            never shows through. Bands alternate olive / sage-soft / cream and
            are punctuated by full-bleed photo breaks for colour play. */}
        <Address />
        <WhenWhere />
        {/* Portrait photo break on mobile, landscape on desktop. Cinematic
            pin & zoom: tall sticky section, image scrubs 1.5→1.0. No caption. */}
        <div className="md:hidden">
          <PhotoBreak slug="img_2324" pinZoom zoomFrom={2.6} zoomOutAt={0.6} />
        </div>
        <div className="hidden md:block">
          <PhotoBreak slug="img_2318" pinZoom />
        </div>
        <Schedule />
        {/* Interactive break — shake/cursor → confetti salute. */}
        <SaluteBreak />
        <DressCode />
        <RSVP />
        {/* Interactive break — tap/click → hearts. */}
        <HeartsBreak />
        <FAQ />
        <Contacts />
        <Finale />
      </main>
    </>
  )
}

export default App
