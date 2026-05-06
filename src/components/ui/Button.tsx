import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'

type Variant = 'primary' | 'secondary'

type SharedProps = {
  variant?: Variant
  children: ReactNode
  icon?: ReactNode
  className?: string
}

type AnchorProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & {
    href: string
  }
type ButtonElProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    href?: undefined
  }

type ButtonProps = AnchorProps | ButtonElProps

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 min-h-[44px] font-sans text-xl md:text-2xl transition-transform duration-150 active:scale-95'
const STYLES: Record<Variant, string> = {
  primary: 'bg-olive text-bg hover:-translate-y-0.5 shadow-md',
  secondary: 'bg-bg-warm text-ink hover:bg-bg-soft border border-ink/10',
}

export function Button({
  variant = 'primary',
  children,
  icon,
  className = '',
  ...rest
}: ButtonProps) {
  const cls = `${BASE} ${STYLES[variant]} ${className}`
  const inner = (
    <>
      {icon && <span className="text-base leading-none">{icon}</span>}
      {children}
    </>
  )

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    )
  }
  return (
    <button
      type="button"
      className={cls}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {inner}
    </button>
  )
}
