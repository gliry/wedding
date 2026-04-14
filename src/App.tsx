import { SmoothScroll } from './components/providers/SmoothScroll'
import { Scene } from './components/canvas/Scene'
import { Hero } from './components/sections/Hero'
import { Placeholder } from './components/sections/Placeholder'

function App() {
  return (
    <>
      <SmoothScroll />
      <Scene />

      <main className="relative z-10">
        <Hero />
        <Placeholder
          title="Когда и где"
          description="Wolki & Lipki Country Club — ул. А. Невского, 2а, Ижевск"
        />
        <Placeholder
          title="Программа дня"
          description="15:30 — сбор гостей • выездная церемония • банкет • afterparty"
        />
        <Placeholder
          title="Дресс-код"
          description="Приходите в том, в чём вам комфортно. Без красного и белого."
        />
        <Placeholder
          title="Ваш ответ"
          description="RSVP через Яндекс.Форму"
        />
        <Placeholder
          title="Частые вопросы"
          description="FAQ про дождь, парковку, жильё, детей"
        />
        <Placeholder
          title="Контакты"
          description="Telegram-группа, Дарина-координатор"
        />
      </main>
    </>
  )
}

export default App
