// TODO: replace with real Telegram URLs when available.
const TG_GROUP_URL = 'https://t.me/PLACEHOLDER-WEDDING-GROUP'
const TG_DARINA_URL = 'https://t.me/PLACEHOLDER-DARINA'

type Contact = {
  emoji: string
  title: string
  desc: string
  href?: string
}

const CONTACTS: Contact[] = [
  {
    emoji: '💬',
    title: 'Telegram-группа свадьбы',
    desc: 'Для всех гостей — новости, вопросы, координация',
    href: TG_GROUP_URL,
  },
  {
    emoji: '🎀',
    title: 'Дарина — координатор',
    desc: 'Все вопросы в день свадьбы — к ней, не к паре',
    href: TG_DARINA_URL,
  },
  {
    emoji: '💕',
    title: 'Ильдар & Екатерина',
    desc: 'Только для экстренных случаев',
  },
]

export function Contacts() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-10 text-center">
        Контакты
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CONTACTS.map((c) => {
          const inner = (
            <>
              <span className="text-3xl">{c.emoji}</span>
              <span className="font-ui text-xl md:text-2xl text-ink">{c.title}</span>
              <span className="font-ui text-base md:text-lg leading-relaxed text-ink-muted">
                {c.desc}
              </span>
            </>
          )
          const base =
            'flex h-full min-h-[200px] flex-col items-center justify-center gap-3 bg-bg-warm rounded-lg border border-ink/10 p-6 text-center'

          return c.href ? (
            <a
              key={c.title}
              href={c.href}
              target="_blank"
              rel="noopener"
              className={`${base} transition duration-200 hover:border-olive/40 hover:shadow-sm`}
            >
              {inner}
            </a>
          ) : (
            <div key={c.title} className={base}>
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
