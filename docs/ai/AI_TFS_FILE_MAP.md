# AI TFS File Map

Mapa pratico do TFS local para outra IA saber onde mexer.

Servidor alvo:

`C:/Users/Mateus/Desktop/tutorial/forge/forgottenserver-downgrade-1.8-8.60`

## Raiz do projeto

| Caminho | Para que serve | Quando mexer |
| --- | --- | --- |
| `CMakeLists.txt` | Define build CMake. | Adicionar/remover fonte C++ ou dependencia. |
| `vcpkg.json` | Dependencias C++ via vcpkg. | Nova lib externa. |
| `config.lua` | Config local ativa. | Testes locais, valores do servidor. |
| `config.lua.dist` | Config modelo. | Nova config que precisa ir para deploy. |
| `schema.sql` | Schema inicial do banco. | Nova tabela/coluna de base limpa. |
| `data/migrations/` | Migracoes incrementais. | Alteracao de banco em servidor existente. |
| `.github/` | CI. | Build/test automatico. |

## `src/` por dominio

| Arquivos | Dominio | Observacoes |
| --- | --- | --- |
| `protocolgame.cpp/h` | Protocolo do jogo. | Entrada e saida de packets. Muito sensivel. |
| `networkmessage.cpp/h`, `outputmessage.cpp/h` | Buffer de bytes. | Base para protocolo real. |
| `game.cpp/h` | Orquestrador central. | Evite colocar regra pequena demais aqui se Lua resolve. |
| `player.cpp/h` | Estado e operacoes do player. | Inventario, storage, client, premium, combat state. |
| `creature.cpp/h`, `monster.cpp/h`, `npc.cpp/h` | Criaturas. | Movimento, target, AI, NPC. |
| `item.cpp/h`, `container.cpp/h`, `tile.cpp/h`, `map.cpp/h` | Mundo e itens. | Map, stack, container, transform, decay. |
| `combat.cpp/h`, `condition.cpp/h` | Combate. | Dano, heal, conditions, formulas. |
| `spells.cpp/h`, `weapons.cpp/h` | Spells/weapons engine. | Quando RevScript nao basta. |
| `actions.cpp/h`, `movement.cpp/h`, `talkaction.cpp/h` | Eventos tradicionais/RevScript internals. | Registro e execucao de callbacks. |
| `creatureevent.cpp/h`, `globalevent.cpp/h`, `events.cpp/h` | Eventos de criatura/global/data/events. | Login, kill, death, callbacks centrais. |
| `luascript.cpp/h`, `lua*.cpp` | Ponte Lua. | Adicionar metodo Lua ou classe nova. |
| `database.cpp/h`, `iologindata.cpp/h`, `databasetasks.cpp/h` | Banco. | Load/save, account, player, tasks. |
| `scheduler.cpp/h`, `tasks.cpp/h`, `thread_pool.cpp/h` | Async/scheduler. | Eventos futuros, dispatcher, thread pool. |
| `configmanager.cpp/h` | Config keys. | Nova chave de `config.lua`. |
| `logger.cpp/h` | Logs. | Diagnostico e categorias. |
| `astraclient.h` | Identificacao/flags AstraClient. | Guardas de feature exclusiva. |

## `data/`

| Caminho | O que contem | Quando mexer |
| --- | --- | --- |
| `data/scripts/actions` | Actions RevScript. | Uso de item, quest, bau, ferramenta. |
| `data/scripts/talkactions` | Comandos de chat. | Player/GOD/debug commands. |
| `data/scripts/creaturescripts` | Eventos de criatura/player. | Login, kill, death, damage. |
| `data/scripts/globalevents` | Startup, shutdown, intervalos. | Rotina global. |
| `data/scripts/movements` | Step in/out, equip/deequip. | Tile, item equipavel. |
| `data/scripts/spells` | Spells de player e monster. | Magias, dano, heal. |
| `data/scripts/weapons` | Weapons custom. | Armas especiais. |
| `data/scripts/network` | Sistemas por opcode. | Feature com client/AstraClient. |
| `data/scripts/eventcallbacks` | Event callbacks novos. | Hooks de engine. |
| `data/lib/core` | Helpers centrais. | Funcoes reusaveis e extensoes de classe. |
| `data/lib/compat` | Compatibilidade antiga. | Scripts legados estilo TFS antigo. |
| `data/lib/functions` | Funcoes utilitarias. | Helpers de sistemas. |
| `data/lib/task_board` | Dados do Task Board. | Offers, delivery items. |
| `data/events/scripts/player.lua` | Callbacks centrais de Player. | `onNetworkMessage`, login, etc. |
| `data/items` | Items definitions. | Item novo/atributos. |
| `data/monsters` | Monstros. | Criatura, loot, attacks. |
| `data/npc` | NPCs. | Shop, bank, travel. |
| `data/world` | Mapa/world data. | Mundo, spawns, houses. |

## Sistemas em `data/scripts/network`

| Sistema | Arquivo/pasta | Observacao |
| --- | --- | --- |
| Task Board | `task_board/` | Melhor exemplo de bytes reais e `NetworkGuard`. |
| Market | `market/market.lua` | Payload grande e validacao critica. |
| Game Store | `gamestore/gamestore.lua` | Compra, historico, transferencia. |
| Forge | `forge/forge.lua` | Feature complexa com custo/chance/recurso. |
| Prey | `prey_system/` | Slots, reroll, lock, recursos. |
| Quick Loot | `quickloot.lua` | Sistema quente, cuidado com performance. |
| Supply Stash | `supply_stash/supplystash.lua` | Lista grande e storage. |
| Battle Pass | `battlepass/battlepass.lua` | Progressao e recompensas. |
| Wheel | `wheel/wheel.lua` | Arvore de pontos e ainda usa trecho JSON para skills. |
| Highscores | `highscores.lua` | Consulta/listagem. |
| Cyclopedia/Bosstiary | `cyclopedia/` | Dados de bestiary/cyclopedia. |

## O que nao fazer

- Nao mover regra segura para o client.
- Nao ler `NetworkMessage` sem checar tamanho.
- Nao usar `Game.getSpectators` em loop quente sem necessidade.
- Nao criar item temporario sem mover/remover.
- Nao editar `src/` para algo que RevScript resolve.
- Nao mexer no banco sem migration quando o servidor ja existe.
