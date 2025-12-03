# Arquitetura do Frontend

Este documento fornece uma visão geral da arquitetura do frontend do CRM App.

## Stack Tecnológica

- **Framework**: React 18
- **Ferramenta de Build**: Vite
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes de UI**: Material UI (@mui/material) + Headless UI
- **Roteamento**: React Router DOM (v6)
- **Cliente HTTP**: Axios (Wrapper customizado)

## Estrutura do Projeto

O projeto segue uma estrutura modular organizada por domínio e responsabilidade técnica:

```
src/
├── app/                # Configuração do App
│   └── router.tsx      # Definições de rotas
├── assets/             # Ativos estáticos (imagens, fontes)
├── kernel/             # Infraestrutura central e utilitários
│   ├── http/           # Implementação do cliente HTTP
│   └── types/          # Tipos globais
├── pages/              # Componentes de Página (Views)
│   ├── auth/           # Páginas de autenticação (Login)
│   └── orders/         # Páginas de gestão de pedidos
├── shared/             # Recursos compartilhados
│   ├── components/     # Componentes de UI reutilizáveis (AuthGuard)
│   └── layouts/        # Layouts de página (MainLayout)
└── main.tsx            # Ponto de entrada
```

## Conceitos Chave

### Roteamento e Navegação

- As rotas são definidas em `src/app/router.tsx`.
- Usamos um **Padrão de Layout** onde `MainLayout` envolve rotas autenticadas.
- **Proteção de Rota** é tratada pelo componente `AuthGuard`, que verifica tokens na API.

### Comunicação HTTP

- Todas as requisições à API devem passar pelo wrapper `httpClient` localizado em `src/kernel/http/axios-client.ts`.
- Este wrapper lida com:
  - Configuração da URL base.
  - Injeção automática de token (cabeçalho `Authorization`).
  - Tratamento de erros padronizado.
  - Tipagem de resposta.

### Módulos de Funcionalidade

Módulos de funcionalidade (como `orders`) são independentes em `src/pages/[feature]`. Eles tipicamente seguem esta estrutura:

```
src/pages/orders/
├── config/             # Definições de rota e constantes
├── create-order/       # Componentes de Criação/Edição
├── list-order/         # Componentes de Listagem/Busca
└── types/              # Tipos específicos da funcionalidade
```

### Autenticação

- Autenticação baseada em token (JWT).
- Token armazenado no `localStorage`.
- Veja [Documentação de Autenticação](./authentication.md) para detalhes.

### Estilização

- **Tailwind CSS** é o motor de estilização primário para layout e designs customizados.
- **Material UI** é usado para componentes interativos complexos (inputs, ícones) quando apropriado, frequentemente estilizados para combinar com o tema Tailwind.
