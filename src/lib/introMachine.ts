export type IntroPhase =
  | 'waiting'
  | 'dragging'
  | 'diving'
  | 'done'
  | 'skipped'

export type IntroState = {
  phase: IntroPhase
  progress: number
  // reserved — was used by removed RippleOverlay; kept to avoid event signature churn
  rippleOrigin: [number, number] | null
}

export type IntroEvent =
  | { type: 'INIT'; reducedMotion: boolean; alreadySeen: boolean }
  | { type: 'DRAG_START' }
  | { type: 'DRAG_PROGRESS'; value: number }
  | { type: 'DRAG_END'; value: number; origin: [number, number] }
  | { type: 'DIVE_COMPLETE' }
  | { type: 'RESET' }

export const DRAG_COMPLETE_THRESHOLD = 0.95

export const initialIntroState: IntroState = {
  phase: 'waiting',
  progress: 0,
  rippleOrigin: null,
}

export function introReducer(
  state: IntroState,
  event: IntroEvent
): IntroState {
  switch (event.type) {
    case 'INIT': {
      if (event.reducedMotion || event.alreadySeen) {
        return { ...initialIntroState, phase: 'skipped' }
      }
      return { ...initialIntroState, phase: 'waiting' }
    }

    case 'DRAG_START': {
      if (state.phase !== 'waiting') return state
      return { ...state, phase: 'dragging', progress: 0 }
    }

    case 'DRAG_PROGRESS': {
      if (state.phase !== 'dragging') return state
      return { ...state, progress: event.value }
    }

    case 'DRAG_END': {
      if (state.phase !== 'dragging') return state
      if (event.value >= DRAG_COMPLETE_THRESHOLD) {
        return { ...state, phase: 'diving', rippleOrigin: event.origin }
      }
      return { ...state, phase: 'waiting', progress: 0, rippleOrigin: null }
    }

    case 'DIVE_COMPLETE': {
      if (state.phase !== 'diving') return state
      return { ...state, phase: 'done' }
    }

    case 'RESET': {
      return { ...initialIntroState, phase: 'waiting' }
    }

    default:
      return state
  }
}
