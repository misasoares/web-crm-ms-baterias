# Documentação do Cliente HTTP

A aplicação utiliza um cliente HTTP customizado baseado no Axios para garantir consistência, segurança de tipos e tratamento de erros centralizado.

## Localização

`src/kernel/http/axios-client.ts`

## Funcionalidades

- **URL Base**: Configurada automaticamente via `import.meta.env.REACT_APP_API_URL`.
- **Interceptor de Autenticação**: Anexa automaticamente o `ACCESS_TOKEN` do `localStorage` a cada requisição.
- **Resposta Padronizada**: Envolve as respostas em uma interface `ResponseAPI<T>`.
- **Tratamento de Erros**: Captura erros do Axios e retorna um objeto de erro padronizado, prevenindo rejeições de promessa não tratadas nos componentes.

## Uso

Importe o `httpClient` do kernel:

```typescript
import { httpClient } from "../../kernel/http/axios-client";
```

### Métodos

#### `doGet<T>(url: string)`

Realiza uma requisição GET.

```typescript
const response = await httpClient.doGet<User[]>("/users");
if (response.success) {
  const users = response.data;
}
```

#### `doPost<T>(url: string, body: any)`

Realiza uma requisição POST.

```typescript
const response = await httpClient.doPost("/auth/login", { email, password });
```

#### `doPut<T>(url: string, body: any)`

Realiza uma requisição PUT.

#### `doDelete<T>(url: string)`

Realiza uma requisição DELETE.

## Definições de Tipo

### ResponseAPI<T>

```typescript
interface ResponseAPI<T = any> {
  success: boolean;
  code?: number;
  message?: string;
  data?: T;
  invalidFields?: any[]; // Para erros de validação
}
```
