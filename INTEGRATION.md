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

## O que está implementado e o que vamos integrar

A base do projeto já está montada. O CRUD completo de **setup** (criar, listar, carregar, editar e deletar) está **totalmente integrado** com a API e funcionando. Use esses arquivos como referência — eles mostram exatamente o padrão que você vai replicar para os gear items:

| Operação       | Arquivo                                | Função/Local                                  |
| -------------- | -------------------------------------- | --------------------------------------------- |
| Listar setups  | `src/pages/HomePage/index.tsx`         | `useEffect` → `setupService.list()`           |
| Criar setup    | `src/pages/NewSetupPage/index.tsx`     | `handleCreate` → `setupService.create()`      |
| Carregar setup | `src/pages/SetupDetailsPage/index.tsx` | `useEffect` → `setupService.getById(id)`      |
| Editar setup   | `src/pages/EditSetupPage/index.tsx`    | `handleUpdate` → `setupService.update()`      |
| Deletar setup  | `src/pages/SetupDetailsPage/index.tsx` | `handleDeleteSetup` → `setupService.remove()` |

---

## O que vamos implementar juntos — CRUD de Gear Items

Todos os métodos de gear items em `src/pages/SetupDetailsPage/index.tsx` estão com comentários `// TODO`. Esses são os quatro pontos que vamos integrar, em ordem:

---

### 1. Listar gear items do setup — `useEffect`

Ao carregar a página de detalhes, além do setup já buscado, precisamos buscar os itens do gear deste setup. O `id` vem do `useParams()` — é o ID do setup na URL.

```tsx
// Dentro do useEffect, após setSetup(setupData):
const gearData = await gearItemService.listBySetup(id);
setGearItems(gearData);
```

---

### 2. Cadastrar gear item — `handleGearSubmit` (sem `_gearId`)

Quando `_gearId` não é fornecido, estamos criando um novo item:

```tsx
const created = await gearItemService.create(_payload);
setGearItems([...gearItems, created]);
toast.success("Item adicionado com sucesso.");
```

---

### 3. Editar gear item — `handleGearSubmit` (com `_gearId`)

Quando `_gearId` é fornecido, estamos atualizando um item existente:

```tsx
const updated = await gearItemService.update(_gearId, _payload);
setGearItems(
  gearItems.map((item) => (item.id === updated.id ? updated : item)),
);
toast.success("Item atualizado com sucesso.");
```

---

### 4. Excluir gear item — `handleGearRemove`

Remove o item da API e atualiza o estado local filtrando a lista:

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
