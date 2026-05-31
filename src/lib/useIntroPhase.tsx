import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react'
import { useTexture } from '@react-three/drei'
import {
  introReducer,
  initialIntroState,
  type IntroState,
  type IntroEvent,
} from './introMachine'

type ContextValue = {
  state: IntroState
  dispatch: Dispatch<IntroEvent>
}

const IntroPhaseContext = createContext<ContextValue | null>(null)

// Lockscreen plays on every visit — no localStorage skip. Only `prefers-reduced-motion`
// short-circuits to `done` for accessibility.
function readInitialFlags(): { reducedMotion: boolean; alreadySeen: boolean } {
  if (typeof window === 'undefined') {
    return { reducedMotion: true, alreadySeen: false }
  }
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  return { reducedMotion, alreadySeen: false }
}

export function IntroPhaseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(introReducer, initialIntroState)

  // Run INIT exactly once on mount with current environment flags
  useEffect(() => {
    const { reducedMotion, alreadySeen } = readInitialFlags()
    dispatch({ type: 'INIT', reducedMotion, alreadySeen })
  }, [])

  return (
    <IntroPhaseContext.Provider value={{ state, dispatch }}>
      {children}
    </IntroPhaseContext.Provider>
  )
}

export function useIntroPhase() {
  const ctx = useContext(IntroPhaseContext)
  if (!ctx) {
    throw new Error('useIntroPhase must be used within IntroPhaseProvider')
  }
  return ctx
}

/**
 * Preload the three hero textures during 'waiting' so the dive transition
 * never reveals a half-loaded scene. Mounted unconditionally inside the
 * provider's children — uses drei's static preload method which doesn't
 * need an R3F context.
 */
export function PreloadHeroTextures() {
  useEffect(() => {
    // Touch devices render a static photo, not the WebGL depth scene — don't
    // waste their bandwidth preloading the depth/inpaint textures.
    if (window.matchMedia('(pointer: coarse)').matches) return
    useTexture.preload([
      '/photos/hero/main-lg.jpg',
      '/photos/hero/main-lg-no-people.jpg',
      '/photos/hero/main-lg-depth-soft.png',
    ])
  }, [])
  return null
}
