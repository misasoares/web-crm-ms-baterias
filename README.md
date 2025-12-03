# CRM Web

CRM simples para gestão de clientes e pedidos para envio automatico de mensagem.

## Scripts Disponíveis

### Desenvolvimento

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run preview`: Visualiza a build de produção localmente.

### Qualidade de Código

- `npm run lint`: Executa o ESLint para verificar problemas no código.
- `npm run format`: Formata o código usando Prettier.
- `npm run pr-check`: Executa uma verificação completa (format, lint e build) antes de abrir um PR.

### Build

- `npm run build`: Compila a aplicação para produção.

## Tratamento de Mensagens (Snackbar Global)

O frontend possui um sistema de **Snackbar Global** para exibir mensagens de sucesso e erro retornadas pela API.

- **Responsabilidade**: A API é a fonte da verdade para as mensagens. O frontend apenas as exibe.
- **Funcionamento**:
  - O `axios-client` intercepta todas as respostas.
  - Se a resposta contiver uma mensagem (seja de sucesso ou erro), ela é disparada para o `SnackbarContext`.
  - O Snackbar exibe a mensagem automaticamente (Verde para sucesso, Vermelho para erro).
  - Se a API não retornar uma mensagem específica, uma mensagem genérica é exibida.
