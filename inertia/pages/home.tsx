import { ArrowUpRight, ClipboardList, CookingPot, PackageSearch } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import MarketingLayout from '~/layouts/marketing'

const features = [
  {
    title: 'Pedidos',
    description: 'Comandas por mesa e acompanhamento do preparo',
    icon: CookingPot,
  },
  {
    title: 'Reservas',
    description: 'Agenda de mesas sem conflito de horários',
    icon: ClipboardList,
  },
  {
    title: 'Estoque',
    description: 'Níveis mínimos e alertas de reposição',
    icon: PackageSearch,
  },
]

export default function Home() {
  return (
    <div className="home">
      <article className="prose-card">
        <div className="pc-top">
          <span className="pc-status mono tag" style={{ color: 'var(--ok)' }}>
            <span className="dot" /> Sistema operacional
          </span>
          <span className="tag">RestGest</span>
        </div>

        <div className="pc-lead">Gestão completa do seu restaurante em um só lugar.</div>

        <p className="pc-para">
          Centralize pedidos, reservas de mesas e controle de estoque em uma operação enxuta. Menos
          retrabalho na cozinha, mais agilidade no salão e uma experiência melhor para o cliente.
        </p>

        <ul className="links">
          {features.map(({ title, description, icon: Icon }) => (
            <li key={title}>
              <div className="lrow">
                <span className="lrow__bullet" />
                <span className="lrow__title">{title}</span>
                <span className="lrow__desc">{description}</span>
                <span className="lrow__arrow">
                  <Icon size={16} />
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="stack">
          <Link route="session.create" className="btn btn--primary btn--sm">
            Entrar no painel
            <ArrowUpRight size={15} />
          </Link>
          <Link route="new_account.create" className="il">
            Criar uma conta
          </Link>
        </div>
      </article>
    </div>
  )
}

Home.layout = [MarketingLayout]
