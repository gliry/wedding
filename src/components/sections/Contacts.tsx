const TG_GROUP_URL = 'https://t.me/+prEyCpSRTlZiZTFi'
const VK_URL = 'https://vk.me/join/EedxHDogKl65daIynSuvtwJnf7IUbFZkpH4='
const TG_DARINA_URL = 'https://t.me/+79127474736' // Дарина, +7 912 747-47-36

type Contact = {
  title: string
  desc: string
  href: string
}

const CONTACTS: Contact[] = [
  {
    title: 'Telegram-группа свадьбы',
    desc: 'Для всех гостей — новости, вопросы, координация',
    href: TG_GROUP_URL,
  },
  {
    title: 'Беседа ВКонтакте',
    desc: 'Та же компания, если удобнее ВК',
    href: VK_URL,
  },
  {
    title: 'Дарина — координатор',
    desc: 'Все вопросы в день свадьбы — к ней, не к паре',
    href: TG_DARINA_URL,
  },
]

export function Contacts() {
  return (
    <section className="bg-bg py-16">
      <div className="px-6 max-w-3xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-10 text-center">
          Контакты
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONTACTS.map((c) => (
            <a
              key={c.title}
              href={c.href}
              target="_blank"
              rel="noopener"
              className="flex h-full min-h-[180px] flex-col items-center justify-center gap-3 bg-bg-warm rounded-lg border border-ink/10 p-6 text-center transition duration-200 hover:border-olive/40 hover:shadow-sm"
            >
              <span className="text-2xl md:text-3xl text-ink">{c.title}</span>
              <span className="text-xl md:text-2xl leading-relaxed text-ink-muted">
                {c.desc}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
