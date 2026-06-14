# AI Change Playbook

Roteiro para outra IA mexer no projeto sem quebrar codigo do usuario.

## Antes de alterar

1. Rode `git status --short --branch`.
2. Identifique o repo certo.
3. Leia o arquivo vizinho que faz algo parecido.
4. Leia estes docs:
   - `AI_TFS_CONTEXT.md`
   - `AI_TFS_FILE_MAP.md`
   - documento especifico da camada.

## Escolha a camada certa

| Pedido | Camada certa |
| --- | --- |
| Criar comando | `data/scripts/talkactions` |
| Criar item usavel | `data/scripts/actions` |
| Criar tile/equip | `data/scripts/movements` |
| Criar magia | `data/scripts/spells` |
| Criar evento de login/kill/death | `data/scripts/creaturescripts` |
| Criar rotina global | `data/scripts/globalevents` |
| Criar feature client/server | `data/scripts/network` + AstraClient |
| Adicionar metodo Lua inexistente | `src/lua*.cpp` + header se necessario |
| Alterar protocolo nativo | `src/protocolgame.cpp/h` + client |
| Alterar banco | `schema.sql` + `data/migrations` |

## Padrao de patch pequeno

- Uma feature por commit.
- Nao misturar refactor grande com bugfix.
- Nao formatar arquivo inteiro sem necessidade.
- Nao reverter mudancas que ja estavam no worktree.
- Nao editar fork/server quando a tarefa e so docs.

## Checklist de seguranca

- Player existe?
- Target existe?
- Item esta correto?
- Storage/range/cooldown/permissao validados?
- Client exclusivo checado?
- Packet tem tamanho minimo?
- String tem maxLength?
- Banco escapado?
- Objeto de `addEvent` revalidado?

## Checks uteis

Site/docs:

```powershell
node --check assets/js/main.js
```

Busca:

```powershell
rg -n "PacketHandler|NetworkGuard|TalkAction|Action\\(" data src
```

Git:

```powershell
git diff --check
git status --short --branch
```

## Quando atualizar documentacao

Atualize `docs/ai` quando mexer em:

- opcode
- payload
- storage
- config key
- migration SQL
- fluxo de login/network
- nova API Lua
- padrao de seguranca

## Formato de commit sugerido

```text
Improve Astra Academy TFS documentation
```

ou, para codigo:

```text
Fix task board packet validation
```
