# RestGest — Sistema de Gestão de Restaurantes

Aplicação fullstack para otimizar as operações de um restaurante: **pedidos**, **reservas de
mesas** e **controle de estoque** em um único painel, com tipagem ponta a ponta entre backend e
frontend.

## Stack

**Backend**

- [AdonisJS 7](https://adonisjs.com) (starter oficial React/Inertia)
- [Inertia.js](https://inertiajs.com) como ponte entre servidor e cliente
- [Lucid ORM](https://lucid.adonisjs.com) com geração automática de schema
- [Tedious](https://tediousjs.github.io/tedious/) para Microsoft SQL Server (SQLite para dev)
- [VineJS](https://vinejs.dev) para validação das requisições

**Frontend**

- [React 19](https://react.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (Radix UI + CVA)
- [Vite](https://vite.dev)
- [Zod](https://zod.dev) para validação no cliente

## Funcionalidades

| Módulo        | Rota            | Descrição                                                                   |
| ------------- | --------------- | --------------------------------------------------------------------------- |
| **Dashboard** | `/dashboard`    | Faturamento, pedidos ativos, reservas do dia, ocupação e alertas de estoque |
| **Mesas**     | `/tables`       | Cadastro de mesas, capacidade, área e situação (livre/ocupada/reservada)    |
| **Reservas**  | `/reservations` | Agenda de reservas com cliente, horário, mesa e status                      |
| **Pedidos**   | `/orders`       | Comandas com múltiplos itens, taxa de serviço e fluxo de status             |
| **Cardápio**  | `/menu`         | Pratos por categoria, preços e disponibilidade                              |
| **Estoque**   | `/inventory`    | Insumos, estoque mínimo, custo e movimentações rápidas de entrada/saída     |

Ao abrir um pedido vinculado a uma mesa, a mesa passa automaticamente para **ocupada** e volta a
ficar **disponível** quando o pedido é pago ou cancelado.

## Como executar

```bash
npm install
cp .env.example .env     # preencha APP_KEY com `node ace generate:key`
node ace migration:run   # aplica as migrations e regenera database/schema.ts
npm run dev              # http://localhost:3333
```

Crie uma conta em `/signup` e você será levado direto ao painel.

### Banco de dados

O projeto roda com **SQLite** por padrão para facilitar o desenvolvimento local. Para usar
**Microsoft SQL Server** via Tedious, ajuste o `.env`:

```dotenv
DB_CONNECTION=mssql
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=sua-senha
DB_DATABASE=restgest
```

Em `config/database.ts`, defina `options.encrypt: true` ao conectar no Azure SQL ou em qualquer
instância com certificado TLS válido.

## Scripts

| Comando             | Descrição                                  |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento com HMR        |
| `npm run build`     | Build de produção (Vite + TypeScript)      |
| `npm run typecheck` | Checagem de tipos do backend e do frontend |
| `npm run lint`      | ESLint                                     |
| `npm run format`    | Prettier                                   |
| `npm test`          | Suíte de testes Japa                       |

## Estrutura

```
app/
  controllers/   # Dashboard, mesas, reservas, cardápio, estoque e pedidos
  models/        # Modelos Lucid com relacionamentos
  validators/    # Schemas VineJS por módulo
database/
  migrations/    # Estrutura das tabelas
  schema.ts      # Gerado automaticamente por `node ace migration:run`
inertia/
  pages/         # Páginas React resolvidas pelo Inertia
  components/ui/ # Componentes shadcn/ui
  lib/           # Formatadores e schemas Zod
start/routes.ts  # Rotas nomeadas e tipadas
```

> `database/schema.ts` e a pasta `.adonisjs/` são gerados automaticamente — não edite manualmente.
> Após criar novas migrations, rode `node ace migration:run`; após criar controllers ou páginas,
> rode `node ace codegen`.
