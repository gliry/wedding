import { describe, it, expect } from 'vitest'
import { introReducer, initialIntroState, type IntroState } from './introMachine'

function makeState(overrides: Partial<IntroState> = {}): IntroState {
  return { ...initialIntroState, ...overrides }
}

describe('introReducer', () => {
  it('initializes to waiting on first visit', () => {
    const next = introReducer(initialIntroState, {
      type: 'INIT',
      reducedMotion: false,
      alreadySeen: false,
    })
    expect(next.phase).toBe('waiting')
  })

  it('initializes to skipped on returning visit', () => {
    const next = introReducer(initialIntroState, {
      type: 'INIT',
      reducedMotion: false,
      alreadySeen: true,
    })
    expect(next.phase).toBe('skipped')
  })

  it('initializes to skipped when reduced motion is preferred', () => {
    const next = introReducer(initialIntroState, {
      type: 'INIT',
      reducedMotion: true,
      alreadySeen: false,
    })
    expect(next.phase).toBe('skipped')
  })

  it('transitions waiting → dragging on DRAG_START', () => {
    const next = introReducer(makeState({ phase: 'waiting' }), { type: 'DRAG_START' })
    expect(next.phase).toBe('dragging')
  })

  it('updates progress on DRAG_PROGRESS without phase change', () => {
    const next = introReducer(makeState({ phase: 'dragging' }), {
      type: 'DRAG_PROGRESS',
      value: 0.42,
    })
    expect(next.phase).toBe('dragging')
    expect(next.progress).toBeCloseTo(0.42)
  })

  it('transitions dragging → diving when DRAG_END value >= 0.95', () => {
    const next = introReducer(makeState({ phase: 'dragging' }), {
      type: 'DRAG_END',
      value: 0.96,
      origin: [800, 500],
    })
    expect(next.phase).toBe('diving')
    expect(next.rippleOrigin).toEqual([800, 500])
  })

  it('snaps back to waiting when DRAG_END value < 0.95', () => {
    const next = introReducer(makeState({ phase: 'dragging', progress: 0.6 }), {
      type: 'DRAG_END',
      value: 0.6,
      origin: [400, 500],
    })
    expect(next.phase).toBe('waiting')
    expect(next.progress).toBe(0)
    expect(next.rippleOrigin).toBeNull()
  })

  it('transitions diving → done on DIVE_COMPLETE', () => {
    const next = introReducer(makeState({ phase: 'diving' }), { type: 'DIVE_COMPLETE' })
    expect(next.phase).toBe('done')
  })

  it('ignores stray DRAG_* events from done', () => {
    const next = introReducer(makeState({ phase: 'done' }), { type: 'DRAG_START' })
    expect(next.phase).toBe('done')
  })

  it('ignores stray DRAG_* events from diving', () => {
    const next = introReducer(makeState({ phase: 'diving' }), {
      type: 'DRAG_PROGRESS',
      value: 0.5,
    })
    expect(next.phase).toBe('diving')
  })

  it('resets to waiting on RESET event', () => {
    const next = introReducer(makeState({ phase: 'done' }), { type: 'RESET' })
    expect(next.phase).toBe('waiting')
    expect(next.progress).toBe(0)
    expect(next.rippleOrigin).toBeNull()
  })
})
