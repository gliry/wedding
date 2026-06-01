import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// Register all plugins once. Import this module once from App.tsx for the
// side effect; consumers import the plugins directly from 'gsap/*' as needed.
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin, SplitText, useGSAP)

export {} // keep this a module
