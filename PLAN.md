# Wedding Site v2 — Living Plan

**Wedding:** Ильдар & Екатерина · 29 августа 2026 · Wolki & Lipki Country Club, Ижевск · ~70 гостей

**Deadline:** 2026-08-29 (4 месяца с момента старта)

**Repo:** `projects/wedding/site-v2/`

---

## Why v2 exists

V1 сайт (`projects/wedding/site/`) — рабочий vanilla HTML/CSS/JS с RSVP через Яндекс.Форму, palette emerald + Sora, базовые scroll эффекты, пасхалки (Konami, exit-intent, 404). V1 зафиксирован в git commit `2325798` как ship-ready fallback.

V2 — **cinematic 3D переизобретение** в стиле Noomo ValenTime / Awwwards SOTD: scroll-driven camera choreography, envelope opening intro, beach photo с depth parallax в hero, sectional cinematic moments между секциями. Цель — подняться с уровня «аккуратный лендинг» до «wait, это делают для luxury brands, не для свадеб».

---

## Stack — finalized

| Область | Выбор | Обоснование |
|---|---|---|
| Framework | **Vite 8 + React 19 + TypeScript** | Static export из коробки, проще Next.js для SPA, используется в Awwwards SOTM `adrianhajdin/award-winning-website` |
| Styling | **Tailwind CSS v3** | JIT классы, design tokens через config, активная поддержка |
| Motion | **GSAP + ScrollTrigger + @gsap/react** | Все плагины бесплатны с октября 2024 (Webflow acquisition). Индустриальный стандарт. |
| Smooth scroll | **Lenis** | 13k stars, от Darkroom Engineering, паттерн sync c GSAP ticker проверен |
| 3D | **Three.js + @react-three/fiber + @react-three/drei** | Индустриальный стек для 3D в React, проверено на десятках SOTD |
| Post-processing | **@react-three/postprocessing** | Bloom / Vignette / DOF / Noise / Chromatic aberration — всё wrapped над postprocessing npm |
| Scroll-synced 3D | **@14islands/r3f-scroll-rig** | DOM-synced 3D scenes, `useImageAsTexture` hook — идеально для hero beach photo |
| ML depth estimation | **@huggingface/transformers** (local Node) + Depth Anything v2 Small | Локальная inference, без watermark, без paywall, one-time model download ~100 MB |
| Image pipeline | **sharp** | Node CLI, генерирует AVIF/WebP/JPEG в 3 breakpoints |
| Hosting | **GitHub Pages или Cloudflare Pages** (TBD) | Static, бесплатно, deploy by push |
| RSVP | **Яндекс.Форма iframe** | Существующая форма ID `69de2cffe010dbfb988a5f11`, без backend |
| Fonts | **Sora** (Google Fonts, body/display) + **Gloria Script** (self-hosted, accents) | Оба с полным Cyrillic. Gloria Script — именно из ТЗ Кати, от Gophmann 2006. |

---

## Палитра — finalized

Извлечена из референсной фото Кати (sage/cream/olive wedding editorial).

```css
:root {
  /* Backgrounds */
  --bg:        #F4EDDF;  /* warm cream paper */
  --bg-soft:   #EBE1CD;  /* deeper linen */
  --bg-warm:   #F8F3E8;  /* lightest warm white */

  /* Text */
  --ink:        #2B2719;  /* primary dark warm brown-black */
  --ink-muted:  #6B6455;  /* secondary warm gray */

  /* Accents */
  --sage:   #8B9579;  /* soft sage green — main accent */
  --olive:  #5E6B4B;  /* deeper olive — emphasis */
  --taupe:  #A79177;  /* warm taupe — tertiary */
}
```

Tailwind config маппит их как `bg-bg`, `text-ink`, `text-sage` etc.

---

## Direction — finalized decisions log

### Visual style

- **Cinematic 3D minimal**, не rustic-paper
- **Invitation feel** сохраняем (envelope opening в intro)
- **Awwwards-level ceiling** — референс Noomo ValenTime, мы «inspired by», не клонируем
- **Photo-forward hero** (option B из 3 вариантов) — beach фото с depth parallax как главный элемент
- **Scope mode 2** — cinematic bookends (entry envelope + hero + sectional moments + finale) + обычный 2D scroll для content секций

### Content & structure

- **Flat invitation**, без chapter-based storytelling «наша история»
- **Секции** (как в v1, флэт): hero → когда/где → программа дня → дресс-код → RSVP → FAQ → контакты
- **Countdown** сохранить (есть в v1, ценный элемент)
- **No music** — решено, никакого ambient, никакого splash-gate
- **No per-guest personalization** — одна страница для всех, один URL

### Assets & fonts

- **Gloria Script** (Anatole & Alexandra Gophmann 2006) — script accent для имён, даты. 74 KB, Regular weight 400, 76 cyrillic glyphs. Downloaded from uprock.ru mirror.
- **Sora** (Google Fonts) — body/display, уже был в v1
- **7 beach photos** от пары в `public/photos/gallery/` (Sony A7R III, Lightroom, ~13 MB each)
- **Main hero photo:** `IMG_2306.JPG` — horizontal landscape
- **Depth maps** генерируются локально через Depth Anything v2 Small

### Constraints

- **Нет дизайнера** — всё визуальное либо процедурно генерируется кодом, либо берётся из free libraries (SVG Repo, Unsplash), либо генерируется AI (Midjourney опционально), либо копируется из open-source reference repos (NYT three-story-controls, 14islands r3f-scroll-rig, Codrops tutorials)
- **Нет backend** — RSVP через Яндекс.Форму iframe
- **Бюджет:** $0-50 (домен + опциональные AI инструменты)
- **Performance floor:** iPhone 12+ / Android flagship 2022+ (не тестируем на Galaxy A52 и старее)

---

## Phase roadmap

### Phase 0 — Scaffold foundation ✅ DONE

- [x] Vite 8 + React 19 + TS в `projects/wedding/site-v2/`
- [x] Install cinematic stack (GSAP, Lenis, R3F, drei, postprocessing, r3f-scroll-rig, sharp, transformers)
- [x] Tailwind 3 с palette config
- [x] Sora (Google Fonts) + Gloria Script (self-hosted WOFF from uprock)
- [x] SmoothScroll provider (Lenis + GSAP ticker sync, паттерн из Satus)
- [x] Empty R3F Canvas с vignette + noise
- [x] Hero section placeholder + 6 Placeholder sections
- [x] Favicon 💍, title, meta
- [x] TypeScript passes, `npm run build` successful

### Phase 1 — Photo preparation ✅ DONE

- [x] User выбрал `IMG_2306.JPG` как main hero
- [x] `scripts/process-photos.mjs` — resize в 3 размера (2000/1440/800px) × 3 формата (AVIF/WebP/JPEG) = 9 файлов
- [x] `scripts/generate-depth.mjs` — depth estimation через `@huggingface/transformers` + Depth Anything v2 Small
- [x] Model downloaded (~100 MB → cached in `node_modules/.transformers-cache`)
- [x] 3 depth maps сгенерированы (lg/md/sm), grayscale 8-bit PNG, без watermark
- [x] Total `public/photos/hero/` = 12 файлов, ~624 KB суммарно (от 13.7 MB оригинала)

### Phase 2 — Hero beach scene with depth parallax ✅ DONE

**Goal:** первый wow-момент — открываешь страницу и видишь beach-фото с живым depth parallax и именами поверх.

**Journey (3 провальных подхода → правильное решение):**

1. ❌ **Naive UV offset parallax** — cutout artifact (силуэты «теряли себя»)
2. ❌ **Parallax Occlusion Mapping (POM)** — smearing/halo на границах
3. ❌ **Displacement mesh с vertex shader** — pixelated edges на депт-разрывах, «крутится карточка»
4. ✅ **2-layer parallax с inpainted background** — правильное решение

**Final architecture:**

- **Background plane** (z=-0.5, fixed): `main-lg-no-people.jpg` — AI-inpainted чистый beach без пары
- **Foreground plane** (z=0, mouse-follows): `main-lg.jpg` с alpha mask из `main-lg-depth-soft.png` (Gaussian-blurred depth map, sigma 8)
- Threshold `smoothstep(0.1, 0.2, blurred_depth)` — пара + песок + близкая вода visible, горизонт/небо прозрачны
- Movement: `meshPos.xy = lerp(mouse) × 0.08 × viewport`
- Никаких screen-space UV tricks, чистые 3D layers

**Sub-steps:**

- [x] 2.1 — `components/canvas/HeroScene.tsx` — первая итерация с drei `useTexture`
- [x] 2.2 — Custom GLSL shaders (passthrough vertex + cover-fit)
- [x] 2.3 — Integrate в `Scene.tsx` через `<Suspense>`
- [x] 2.4 — Global `mousemove` listener (Canvas z:-10 не получает pointer events)
- [x] 2.5 — Text overlay, bottom gradient, транспортированный в нижнюю половину под пару
- [x] 2.6 — User предоставил `main-lg-no-people.jpg` (AI-inpainted background через cleanup.pictures/similar)
- [x] 2.7 — Pre-blurred depth map: `scripts/process-photos.mjs` + offline sharp blur sigma 8 → `main-lg-depth-soft.png`
- [x] 2.8 — 2-layer HeroScene rewrite: два `<mesh>` элемента, альфа-mask на foreground
- [x] 2.9 — Threshold tuning: начали 0.35/0.55 (слишком высокий — пара была прозрачной), → 0.18/0.3 (силуэты «худели» из-за blur'а) → **0.1/0.2** (финал, целые силуэты с плавными краями)
- [x] 2.10 — Scroll-based opacity fade на обоих layers через `uOpacity` uniform

**Preprocessing scripts added:**
- `scripts/process-photos.mjs` — ресайз + AVIF/WebP/JPEG (уже был)
- `scripts/generate-depth.mjs` — Depth Anything v2 Small (уже был)
- `scripts/generate-people-mask.mjs` — diff-based people mask (экспериментальный, пока не используется — дал artifacts)

**Dead ends (оставлены на диске для reference):**
- `main-lg-depth.png` — оригинальный без blur
- `main-lg-people-mask.png` — diff-based mask, артефакты вокруг силуэтов

### Phase 3 — Content sections migration ⏳ NEXT

**Goal:** перенести все content секции из v1 в React компоненты v2. В основном copy-paste HTML → JSX + адаптация под новую палитру.

**Sub-steps:**

- [ ] 3.1 — `WhenWhere.tsx` — адрес, карта Яндекс, кнопки Google Cal / Apple Cal / Маршрут
- [ ] 3.2 — `Schedule.tsx` — timeline программы дня (15:30 сбор → 23:00 afterparty)
- [ ] 3.3 — `DressCode.tsx` — headline + lead + (возможно без RGB picker — обсудить перед началом)
- [ ] 3.4 — `RSVP.tsx` — iframe Яндекс.Формы + `embed.js` + fallback link
- [ ] 3.5 — `FAQ.tsx` — accordion через `<details>` (те же 6 вопросов как в v1)
- [ ] 3.6 — `Contacts.tsx` — 3 карточки контактов (TG-группа, Дарина, пара)
- [ ] 3.7 — Хедер: «И & Е» brand + theme toggle? — обсудить нужность
- [ ] 3.8 — Copy content из `projects/wedding/site/index.html` в компоненты

**Open questions:**
- RGB picker в dress-code — сохраняем (fun element) или убираем (cinematic minimal)?
- Countdown — где живёт (hero как в v1 или отдельная секция)?
- Easter eggs v1 (Konami, exit-modal, 404, console.log) — переносим?
- Theme toggle 🌙 — остаётся или убираем?
- Footer с «До встречи 29 августа 💍»

**Time estimate:** ~4-6 часов

### Phase 4 — Intro lockscreen reveal ✅ DONE (2026-04-26)

**Goal:** cinematic entry sequence — slide-to-unlock жест над B&W размытым фото → grayscale→color bloom → hero.

**Decision (2026-04-26):** abandoned envelope metaphor in favor of slide-to-unlock lockscreen (option B+E from brainstorm). Rationale: tactile + cinematic, exploits depth-parallax stack, less clichéd for weddings. Then dropped camera dive in favor of grayscale→color reveal: photo стартует blurred B&W, blur уходит с drag, на release цвет «расцветает» с warm overshoot. No camera movement — фото статично, трансформация чисто saturation+brightness.

**Implementation:**

- [x] 4.1 — Brainstorm session с visual companion → spec + plan
- [x] 4.2 — Pure reducer state machine (`waiting/dragging/diving/done/skipped`) at `src/lib/introMachine.ts` with full Vitest coverage (11 tests)
- [x] 4.3 — `useIntroPhase` provider + `PreloadHeroTextures` helper at `src/lib/useIntroPhase.tsx`
- [x] 4.4 — `ThumbTrack` reusable controlled slider with Pointer Events + GSAP snap-back + keyboard a11y
- [x] 4.5 — `IntroLockscreen` DOM overlay: darken layer + names + thumb (no `<img>` — canvas is single image source)
- [x] 4.6 — `Scene.tsx` rewrite: CSS filter on canvas wrapper drives blur+grayscale+brightness across phases; GSAP timeline для color reveal with warm overshoot
- [x] 4.7 — `HeroScene` accepts `phase` prop, mouse parallax gated to `done`/`skipped` only
- [x] 4.8 — Removed: `EnvelopeScene.tsx`, `IntroHint.tsx`, `IntroContext.tsx`, `RippleOverlay.tsx`, ripple shaders
- [x] 4.9 — No localStorage skip — lockscreen plays on every visit. Только `prefers-reduced-motion: reduce` short-circuits to `done`
- [x] 4.10 — Removed all postprocessing (Bloom/Vignette/Noise) — добавляли «светлый фильтр» поверх фото

**Files:**
- Created: `src/components/intro/{IntroLockscreen,ThumbTrack}.tsx`, `src/lib/{introMachine.ts,introMachine.test.ts,useIntroPhase.tsx}`, `vitest.config.ts`
- Modified: `src/App.tsx`, `src/components/canvas/{Scene,HeroScene}.tsx`, `src/components/sections/Hero.tsx`

**Spec:** `projects/wedding/docs/superpowers/specs/2026-04-26-intro-lockscreen-reveal-design.md`
**Plan:** `projects/wedding/docs/superpowers/plans/2026-04-26-intro-lockscreen-reveal.md`
**Commit:** `8baac4f`

### Phase 5 — Sectional cinematic moments 📋 PLANNED

**Goal:** cinematic вайб по всему сайту — не только intro и hero.

**Sub-steps:**

- [ ] 5.1 — Brainstorm: которые секции получают cinematic moment, какой эффект для каждой
- [ ] 5.2 — Example: Schedule pinning + handwritten time reveals по DrawSVG
- [ ] 5.3 — Example: When/Where — параллакс карты + фон
- [ ] 5.4 — Transitions между секциями — fade / cross-blur / scale
- [ ] 5.5 — Finale bookend — камера уходит вверх, «До встречи 29 августа»

**Time estimate:** ~3-4 часа

### Phase 6 — Polish + deploy 📋 PLANNED

- [ ] 6.1 — Tune post-processing (bloom, vignette, DOF) по ощущению
- [ ] 6.2 — Mobile testing: iPhone SE-ish, iPhone 14, Android flagship
- [ ] 6.3 — Reduced motion fallbacks (`@media prefers-reduced-motion`)
- [ ] 6.4 — Performance: Lighthouse ≥90, code-splitting если bundle >1.5 MB
- [ ] 6.5 — SEO + OG meta для sharing preview (при копировании ссылки в мессенджер)
- [ ] 6.6 — Deploy на Cloudflare Pages или GitHub Pages
- [ ] 6.7 — Custom domain (опционально, ~$5-15)
- [ ] 6.8 — Тестовая отправка RSVP, проверить что Яндекс.Форма принимает

**Time estimate:** ~2-3 часа

---

## Decisions log (chronological)

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-13 | Start with vanilla HTML/CSS/JS v1 | Fast shipping, simple scope, ~10 sections |
| 2026-04-13 | V1 uses emerald + Sora | Initial aesthetic direction |
| 2026-04-14 | Екатерина дала ТЗ на rustic direction (sage/cream/olive, Florisel/Gloria Script) | New creative direction |
| 2026-04-14 | Ильдар хочет parallax + scroll-freeze + cinematic animations | Second vector layered on |
| 2026-04-14 | Deep research brief-3 (rustic + scroll) | Initial combined research |
| 2026-04-14 | Deep research brief-4 (frameworks) | Search for open-source foundation |
| 2026-04-14 | Analyzed Noomo ValenTime — React + Three.js WebGPU + TSL, not Nuxt | Via downloaded bundles + Awwwards case study |
| 2026-04-14 | Direction shift: cinematic minimal 3D, не rustic-paper | «Не совсем то что нужно. Минимализм, но 3д уместно.» |
| 2026-04-14 | Hero option (B) photo-forward | Из 3 предложенных вариантов композиции hero |
| 2026-04-14 | Scope option (2): cinematic entry + hero + sectional + finale | Balanced wow vs scope |
| 2026-04-14 | Stack: Vite + React + R3F + GSAP + Lenis (не Next/Satus) | Satus requires Vercel + Bun + bleeding-edge; Vite проще для SPA |
| 2026-04-14 | V2 в отдельной папке `site-v2/`, v1 остаётся как fallback | Git commit `2325798` как checkpoint |
| 2026-04-14 | Palette — sage/cream/olive из reference photo, не terracotta | User reference image |
| 2026-04-14 | Fonts: Sora body + Gloria Script accent (74 KB, Gophmann 2006) | User insisted Gloria/Florisel from TZ, found Cyrillic version от uprock |
| 2026-04-14 | Torus knot placeholder удалён, Canvas только ambient vignette+noise | User: «как какашки» |
| 2026-04-14 | Depth map generation — local via @huggingface/transformers | Leiapix/Immersity adds watermarks, HF Spaces нестабильны |
| 2026-04-14 | Main hero photo = `IMG_2306.JPG` | User choice |
| 2026-04-14 | No music | User decision («Music нет») |
| 2026-04-14 | No per-guest personalization URLs | User decision («кастомные URL наверное не нужно») |
| 2026-04-14 | Priority framing (C) balanced hybrid (implicit) | User proceeded without choosing, proceeded with (C) |
| 2026-04-26 | Abandoned envelope intro for slide-to-unlock lockscreen | Tactile + cinematic, leverages depth-parallax stack, less clichéd for weddings |
| 2026-04-26 | Camera dive removed entirely | "Zoom inward" felt off, produced visible blink at landing |
| 2026-04-26 | Reveal = grayscale → color bloom (warm overshoot), не camera move | Single static frame transformation, no double-image blink |
| 2026-04-26 | No localStorage skip — lockscreen plays on every visit | User decision: «пусть каждый раз срабатывает sliding» |
| 2026-04-26 | Removed all postprocessing (Bloom/Vignette/Noise) | User feedback: «главная фотография в светлом фильтре, убери» |
| 2026-04-26 | Storage key kept as `wedding:intro-seen`, `?replay` URL preserved (now no-op) | No churn on existing skip mechanism — just reduced to noop |

---

## Open questions (future phases)

These need resolution before they block:

### Для Phase 3 (content migration)

1. **RGB picker в dress-code** — сохраняем (fun element) или убираем (cinematic minimal design)?
2. **Countdown** — оставляем (как в v1 hero), перемещаем в отдельную секцию, или убираем?
3. **Easter eggs v1** — Konami + exit-modal + custom 404 + console.log переносим?
4. **Theme toggle 🌙** — нужен ли (v1 имел), или убираем (v2 cinematic только светлый)?
5. **Navbar brand «И & К»** — делаем или нет?

### Для Phase 4 (envelope intro)

6. **Envelope style** — 3D Three.js или CSS 3D transforms?
7. **Skip pattern UX** — localStorage flag достаточно, или «Посмотреть заново» кнопка в footer?
8. **Sound effect при открытии** — без звука или добавить тихий рустл бумаги (противоречит «no music» decision — нужно подтвердить)?

### Для Phase 5 (sectional moments)

9. **Которые секции** получают cinematic treatment (все, только ключевые, bookend only)?
10. **Transition pattern между секциями** — fade / cross-blur / camera push / scale?

### Для Phase 6 (polish + deploy)

11. **Hosting** — GitHub Pages or Cloudflare Pages?
12. **Custom domain** — покупаем `katya-ildar.ru` или оставляем free subdomain?
13. **OG preview image** — generate automatic или custom render?
14. **Analytics** — оставляем «нет» (было) или добавляем что-то приватное (Plausible, Umami)?

---

## Reference repos (cloned in `/tmp/wedding-refs/`)

| Repo | License | Purpose |
|---|---|---|
| [nytimes/three-story-controls](https://github.com/nytimes/three-story-controls) | Apache-2.0 | ScrollControls / StoryPointsControls / PathPointsControls for camera scrubbing |
| [14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig) | ISC | GlobalCanvas + ScrollScene + useImageAsTexture |
| [adrianhajdin/award-winning-website](https://github.com/adrianhajdin/award-winning-website) | MIT | Zentry-clone SOTM, Vite+React+GSAP patterns |

## Codrops tutorials (bookmark, not cloned)

1. [Cinematic 3D Scroll Experiences with GSAP](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/) (ноябрь 2025) — camera choreography + post-fx
2. [Scroll-Reactive 3D Gallery with Velocity](https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/) (март 2026) — depth layers + mood bg
3. [Seamless 3D Transitions](https://tympanus.net/codrops/2026/03/18/building-seamless-3d-transitions-with-webflow-gsap-and-three-js/) (март 2026) — section transitions

---

## Files structure (current)

```
projects/wedding/site-v2/
├── PLAN.md                 ← this file (living plan)
├── README.md               ← short status + dev instructions
├── package.json
├── vite.config.ts          ← static export config
├── tailwind.config.js      ← palette tokens
├── tsconfig.json
├── index.html              ← HTML entry with meta + favicon
├── scripts/
│   ├── process-photos.mjs  ← resize + AVIF/WebP/JPEG
│   └── generate-depth.mjs  ← local Depth Anything v2 inference
├── src/
│   ├── main.tsx            ← React entry
│   ├── App.tsx             ← root layout (SmoothScroll + Scene + sections)
│   ├── index.css           ← Tailwind + @font-face Gloria + Sora import
│   ├── components/
│   │   ├── providers/
│   │   │   └── SmoothScroll.tsx      ← Lenis + GSAP ticker
│   │   ├── canvas/
│   │   │   └── Scene.tsx             ← fixed R3F Canvas + vignette + noise
│   │   ├── sections/
│   │   │   ├── Hero.tsx              ← names + date + scroll hint
│   │   │   └── Placeholder.tsx       ← reusable placeholder for unbuilt sections
│   │   └── ui/                       ← (empty, for buttons etc)
│   ├── hooks/                        ← (empty)
│   ├── lib/                          ← (empty, shaders will go here)
│   └── styles/                       ← (empty)
└── public/
    ├── fonts/
    │   └── GloriaScript.ttf          ← 74 KB, Gophmann 2006, Cyrillic
    └── photos/
        ├── raw/                      ← (empty, for future originals)
        ├── gallery/                  ← 7 beach originals (13+ MB each)
        │   ├── IMG_2304.JPG
        │   ├── IMG_2306.JPG          ← main hero source
        │   ├── IMG_2307.JPG
        │   ├── IMG_2309.JPG
        │   ├── IMG_2314.JPG
        │   ├── IMG_2318.JPG
        │   └── IMG_2330.JPG
        └── hero/                     ← processed hero variants
            ├── main-lg.{avif,webp,jpg}     (2000×1334)
            ├── main-lg-depth.png           (87 KB grayscale)
            ├── main-md.{avif,webp,jpg}     (1440×960)
            ├── main-md-depth.png           (59 KB)
            ├── main-sm.{avif,webp,jpg}     (800×534)
            └── main-sm-depth.png           (27 KB)
```

---

## How this plan is maintained

**Я (Claude) обновляю этот файл при:**
- Завершении sub-step (чекбокс из `[ ]` в `[x]`)
- Принятии нового решения (добавляется в Decisions log)
- Возникновении open question (добавляется в Open questions)
- Выборе направления в phase (обновляется roadmap)

**Пользователь:** может править этот файл напрямую когда захочет, Claude перечитает перед следующим шагом.

**Git:** этот файл коммитится вместе с кодом — история плана tracked в git log.
