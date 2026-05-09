# Integração com a API — SetupHub

Antes de começar, certifique-se de que o **back-end (Spring Boot) está rodando** na porta `8080`. Sem isso, todas as chamadas à API irão falhar.

---

## O que é o Axios?

[Axios](https://axios-http.com/) é uma biblioteca HTTP para JavaScript/TypeScript que facilita o consumo de APIs REST. Ele cuida de coisas como:

- Serializar o corpo das requisições em JSON automaticamente
- Interpretar a resposta da API
- Lidar com erros HTTP (status 4xx, 5xx)
- Configurar uma `baseURL` centralizada para não repetir o endereço da API em todo lugar

### Instalação

O Axios já está instalado neste projeto. Se precisar instalar em um projeto novo:

```bash
npm install axios
```

---

## Configuração central — `src/lib/axios.ts`

Esse arquivo cria uma instância do Axios já configurada com a URL base da API:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});
```

Ao importar `api` nos seus serviços, você não precisa repetir o endereço base em cada chamada. Basta usar `/setups`, `/gear-items`, etc.

A variável de ambiente `VITE_API_URL` pode ser configurada em um arquivo `.env` na pasta `client/`:

```env
VITE_API_URL=http://localhost:8080
```

---

## A camada de serviço — `src/services/setup-service.ts`

Esse arquivo centraliza todas as chamadas à API em funções reutilizáveis. Cada função corresponde a um endpoint do back-end:

| Função                                 | Método HTTP | Endpoint               |
| -------------------------------------- | ----------- | ---------------------- |
| `setupService.list()`                  | GET         | `/setups`              |
| `setupService.getById(id)`             | GET         | `/setups/:id`          |
| `setupService.create(payload)`         | POST        | `/setups`              |
| `setupService.update(id, payload)`     | PUT         | `/setups/:id`          |
| `setupService.remove(id)`              | DELETE      | `/setups/:id`          |
| `gearItemService.listBySetup(setupId)` | GET         | `/gear-items?setupId=` |
| `gearItemService.create(payload)`      | POST        | `/gear-items`          |
| `gearItemService.update(id, payload)`  | PUT         | `/gear-items/:id`      |
| `gearItemService.remove(id)`           | DELETE      | `/gear-items/:id`      |

Cada função usa a instância `api` do Axios e valida os dados recebidos com **Zod** (veja `src/schemas/setup-schemas.ts`).

---

## O que está implementado

O CRUD completo — tanto de **setup** quanto de **gear items** — está totalmente integrado com a API. Use os arquivos abaixo como referência para entender o padrão adotado:

| Operação              | Arquivo                                | Função/Local                                        |
| --------------------- | -------------------------------------- | --------------------------------------------------- |
| Listar setups         | `src/pages/HomePage/index.tsx`         | `useEffect` → `setupService.list()`                 |
| Criar setup           | `src/pages/NewSetupPage/index.tsx`     | `handleCreate` → `setupService.create()`            |
| Carregar setup + gear | `src/pages/SetupDetailsPage/index.tsx` | `useEffect` → `Promise.all([getById, listBySetup])` |
| Editar setup          | `src/pages/EditSetupPage/index.tsx`    | `handleUpdate` → `setupService.update()`            |
| Deletar setup         | `src/pages/SetupDetailsPage/index.tsx` | `handleDeleteSetup` → `setupService.remove()`       |
| Cadastrar gear item   | `src/pages/SetupDetailsPage/index.tsx` | `handleGearSubmit` → `gearItemService.create()`     |
| Editar gear item      | `src/pages/SetupDetailsPage/index.tsx` | `handleGearSubmit` → `gearItemService.update()`     |
| Excluir gear item     | `src/pages/SetupDetailsPage/index.tsx` | `handleGearRemove` → `gearItemService.remove()`     |

---

## Como integrar — passo a passo

Abra `src/pages/SetupDetailsPage/index.tsx`. Você vai encontrar três comentários `// TODO`. Leia a explicação de cada passo, entenda o que o código faz e substitua o comentário pelo bloco correspondente.

---

### Passo 1 — Carregar setup e gear items juntos

Atualmente o `useEffect` não busca nada. Precisamos fazer duas requisições ao mesmo tempo: uma para buscar os dados do setup e outra para buscar os gear items que pertencem a ele. Usar `Promise.all` garante que as duas chamadas acontecem em paralelo, sem esperar uma terminar para começar a outra. O resultado é guardado no estado com `setSetup` e `setGearItems`.

```tsx
const [setupData, gearData] = await Promise.all([
  setupService.getById(id),
  gearItemService.listBySetup(id),
]);

if (!isMounted) return;

setSetup(setupData);
setGearItems(gearData);
```

---

### Passo 2 — Cadastrar e editar gear item

A função `handleGearSubmit` é chamada tanto ao criar quanto ao editar um gear item. O parâmetro `_gearId` é o diferenciador: se ele vier preenchido, é uma edição; se for `undefined`, é um cadastro novo. Após a operação, atualizamos `gearItems` no estado local para a tela refletir a mudança sem precisar recarregar a página.

```tsx
if (!setup) return;

if (_gearId) {
  const updated = await gearItemService.update(_gearId, _payload);
  setGearItems(
    gearItems.map((item) => (item.id === updated.id ? updated : item)),
  );
  toast.success("Item atualizado com sucesso.");
  return;
}

const created = await gearItemService.create(_payload);
setGearItems([...gearItems, created]);
toast.success("Item adicionado com sucesso.");
```

---

### Passo 3 — Excluir gear item

A função `handleGearRemove` recebe o `_gearId` do item a ser removido. Primeiro fazemos a chamada à API para deletar o registro no banco. Depois, sem precisar buscar a lista novamente, filtramos o estado local removendo apenas aquele item — a tela atualiza instantaneamente.

```tsx
await gearItemService.remove(_gearId);
setGearItems(gearItems.filter((item) => item.id !== _gearId));
toast.success("Item removido com sucesso.");
```

---

## Fluxo completo de uma requisição

```
Componente React
   └── chama handleCreate / handleUpdate / etc.
       └── chama setupService.create(payload)  ← setup-service.ts
           └── chama api.post('/setups', data)  ← axios.ts (instância configurada)
               └── HTTP POST → http://localhost:8080/setups
                   └── Spring Boot processa e retorna JSON
               └── Axios recebe a resposta
           └── Zod valida o formato do JSON recebido
       └── retorna os dados validados ao componente
   └── atualiza o estado (useState) e re-renderiza a UI
```

---

## Referência rápida de métodos HTTP

| Método   | Uso                                    |
| -------- | -------------------------------------- |
| `GET`    | Buscar dados (listar ou buscar por ID) |
| `POST`   | Criar um novo recurso                  |
| `PUT`    | Atualizar um recurso existente inteiro |
| `DELETE` | Remover um recurso                     |

---

## Tratamento de erros

O projeto usa a função `getErrorMessage` em `src/lib/error-handler.ts` para extrair mensagens de erro legíveis. Combine com `toast.error()` do Sonner para mostrar feedback ao usuário:

```tsx
try {
  await setupService.remove(id);
  toast.success("Setup removido com sucesso.");
} catch (error) {
  toast.error(getErrorMessage(error));
}
```
