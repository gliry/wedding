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
import { BotanicalVine } from './components/effects/BotanicalVine'
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
        <BotanicalVine variant={1} />
        <Address />
        <BotanicalVine variant={2} />
        <WhenWhere />
        <BotanicalVine variant={2} />
        <Schedule />
        <BotanicalVine variant={3} />
        <DressCode />
        <BotanicalVine variant={4} />
        <RSVP />
        <BotanicalVine variant={5} />
        <FAQ />
        <BotanicalVine variant={1} />
        <Contacts />
        <BotanicalVine variant={2} />
        <Finale />
      </main>
    </>
  )
}

export default App
