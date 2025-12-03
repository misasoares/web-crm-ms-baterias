# Documentação de Autenticação do Frontend

Este documento descreve o fluxo de autenticação implementado no Frontend React.

## Visão Geral

A aplicação utiliza **JWT (JSON Web Token)** para autenticação.

1.  **Login**: As credenciais do usuário são enviadas para a API. Se válidas, a API retorna um JWT.
2.  **Armazenamento**: O frontend armazena esse token no `localStorage` sob a chave `ACCESS_TOKEN`.
3.  **Proteção**: Endpoints protegidos da API requerem este token no cabeçalho `Authorization: Bearer <token>`.
4.  **Verificação**: O frontend verifica a validade do token em cada mudança de rota usando um endpoint dedicado da API.

## Componentes

### AuthGuard (`src/shared/components/AuthGuard.tsx`)

Um componente wrapper que protege as rotas.

- **Props**: `isPrivate` (boolean).
- **Lógica**:
  - **Rotas Privadas (`isPrivate={true}`)**: Verifica se existe `ACCESS_TOKEN`. Se presente, chama `/auth/verify-access-token`. Se válido, renderiza os filhos. Se inválido ou ausente, redireciona para `/login`.
  - **Rotas Públicas (`isPrivate={false}`)**: Verifica se existe `ACCESS_TOKEN`. Se presente e válido, redireciona para `/orders` (impede que usuários autenticados vejam a página de login). Se inválido ou ausente, renderiza a página de login.

### Router (`src/app/router.tsx`)

As rotas são configuradas para usar o `AuthGuard`:

```tsx
// Rota Pública (Login)
{
  path: '/login',
  element: (
    <AuthGuard isPrivate={false}>
      <Login />
    </AuthGuard>
  ),
}

// Rotas Protegidas (App Principal)
{
  path: '/',
  element: (
    <AuthGuard isPrivate={true}>
      <MainLayout />
    </AuthGuard>
  ),
  // ... rotas filhas
}
```

### Cliente HTTP (`src/kernel/http/axios-client.ts`)

O cliente Axios customizado anexa automaticamente o token a cada requisição:

```typescript
const token = localStorage.getItem("ACCESS_TOKEN");
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```
