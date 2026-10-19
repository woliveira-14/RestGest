import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="auth">
        <div className="auth__form-col">
          <Logo size={28} />
          <div className="auth__form-wrap">{children}</div>
          <div style={{ height: 20 }} />
        </div>

        <aside className="auth__aside">
          <div className="auth__aside-top">
            <ThemeToggle />
          </div>

          <p className="auth__quote">Pedidos, reservas e estoque sincronizados em tempo real.</p>

          <div>
            <div className="pitch__t">Operação sob controle</div>
            <p className="pitch__p">
              O RestGest conecta salão, cozinha e almoxarifado em um único painel, reduzindo
              desperdício e acelerando o atendimento ao cliente.
            </p>
          </div>
        </aside>
      </div>
      <FlashToasts />
    </>
  )
}
