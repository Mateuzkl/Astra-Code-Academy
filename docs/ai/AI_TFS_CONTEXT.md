# AI TFS Context

Este documento e para uma IA abrir antes de mexer no servidor local:

`C:/Users/Mateus/Desktop/tutorial/forge/forgottenserver-downgrade-1.8-8.60`

## Regra principal

O servidor e dono da verdade. O client pode desenhar UI e pedir acoes, mas regra, recompensa, dinheiro, item, storage, cooldown, permissao e validacao de packet ficam no servidor.

## Tamanho da base analisada

Resumo do inventario local:

| Tipo | Quantidade aproximada |
| --- | ---: |
| `.cpp` | 142 |
| `.h` | 109 |
| `.lua` | 4145 |
| `.xml` | 17 |
| `.sql` | 1 |

Scripts em `data/scripts`:

| Pasta | Quantidade aproximada |
| --- | ---: |
| `spells` | 824 |
| `talkactions` | 104 |
| `actions` | 74 |
| `network` | 34 |
| `movements` | 24 |
| `eventcallbacks` | 21 |
| `creaturescripts` | 15 |
| `globalevents` | 13 |

## Repos relacionados

| Caminho | Papel |
| --- | --- |
| `forge/forgottenserver-downgrade-1.8-8.60` | Servidor principal TFS 1.8 downgrade 8.60. |
| `forge/AstraClient` | Client principal com modules, opcodes e protocolo Astra. |
| `forge/canary` | Referencia moderna de servidor. |
| `forge/crystalserver-main` | Referencia moderna para sistemas/protocolo. |
| `forge/mehah` | Referencia de client/OTClient/Mehah. |
| `forge/otclientv8 otacademy` | Referencia OTCv8 e JSON extended opcode. |

## Como o TFS local e organizado

| Pasta/arquivo | Responsabilidade |
| --- | --- |
| `src/` | Motor C++: rede, jogo, mapa, entidades, Lua bridge, banco, scheduler. |
| `data/` | Conteudo do jogo: scripts, monsters, NPC, items, world, migrations. |
| `data/scripts/` | RevScriptSys e sistemas modernos. |
| `data/scripts/network/` | Sistemas por opcode/bytes reais. |
| `data/lib/` | Bibliotecas Lua carregadas antes dos scripts. |
| `data/events/` | Callbacks centrais como `Player:onNetworkMessage`. |
| `schema.sql` | Estrutura do banco. |
| `config.lua` | Config local do servidor. |
| `CMakeLists.txt` | Build CMake do servidor. |
| `.github/` | CI/GitHub Actions. |

## Camadas C++ principais

| Camada | Arquivos | O que faz |
| --- | --- | --- |
| Entrada de rede | `connection.cpp`, `protocol.cpp`, `protocolgame.cpp`, `protocollogin.cpp` | Recebe bytes do socket, descriptografa/valida e chama parser correto. |
| Protocolo de jogo | `protocolgame.cpp`, `protocolgame.h` | Le packets do client, chama `Game`, escreve mensagens para client. |
| Mundo/regras | `game.cpp`, `game.h` | Coordena login, movement, combat, trade, map, events e sistemas centrais. |
| Entidades | `player.cpp`, `creature.cpp`, `monster.cpp`, `npc.cpp`, `item.cpp`, `tile.cpp` | Estado vivo do mundo. |
| Combate/spells | `combat.cpp`, `condition.cpp`, `spells.cpp`, `weapons.cpp` | Dano, heal, conditions, formulas, cooldowns. |
| Eventos XML/legacy | `actions.cpp`, `movement.cpp`, `talkaction.cpp`, `creatureevent.cpp`, `globalevent.cpp` | Sistemas de eventos e compatibilidade. |
| Lua bridge | `luascript.cpp`, `lua*.cpp` | Expoe classes, metodos, enums e metatables para Lua. |
| Banco | `database.cpp`, `databasemanager.cpp`, `iologindata.cpp`, `databasetasks.cpp` | Queries, load/save player, account, itens persistentes. |
| Scheduler/threads | `scheduler.cpp`, `tasks.cpp`, `thread_pool.cpp`, `save_manager.cpp` | Trabalho async, eventos futuros, saves e dispatcher. |
| Config/logs | `configmanager.cpp`, `logger.cpp` | Configuracoes e logs. |

## Fluxo de login simplificado

1. Client conecta no login protocol.
2. Servidor valida versao, account e character.
3. `ProtocolGame::login` prepara player.
4. `IOLoginData` carrega dados do banco.
5. `Game` coloca criatura no mundo.
6. `Player:onLogin` e creature events rodam.
7. Client recebe estado inicial, features e mapa.
8. `acceptPackets` passa a aceitar acoes do jogador.

## Fluxo de um packet custom

1. Client envia primeiro byte do opcode.
2. `ProtocolGame::parsePacket` le o opcode.
3. Se for custom, o fork chama `Game::parsePlayerNetworkMessage`.
4. `data/events/scripts/player.lua` executa `Player:onNetworkMessage(recvByte, msg)`.
5. `Player:onNetworkMessage` procura `PacketHandlers[recvByte]`.
6. O handler registrado em `data/scripts/network/...` le o payload.
7. Use `NetworkGuard` para nao ler fora do buffer.
8. Servidor valida regra e responde via `NetworkMessage`.

## Ordem certa para uma IA mexer

1. Identificar se a mudanca e server, client, protocolo, banco ou docs.
2. Ler o arquivo vizinho mais parecido.
3. Procurar constants/opcodes/storages existentes.
4. Fazer patch pequeno.
5. Validar com `node --check` quando mexer no site ou compilar quando mexer em C++.
6. Nunca reverter mudancas ja existentes no `forge`.
7. Atualizar docs quando mexer em opcode, storage, config ou fluxo.

## Arquivos que uma IA deve abrir primeiro

| Caso | Abrir |
| --- | --- |
| Novo RevScript | `docs/ai/AI_REVSCRIPTSYS_COMPLETE.md` |
| Nova API Lua | `docs/ai/AI_LUA_API_AND_PATTERNS.md` |
| Packet/opcode | `docs/ai/AI_NETWORK_PROTOCOL_MAP.md` |
| Alteracao grande no servidor | `docs/ai/AI_TFS_FILE_MAP.md` |
| Antes de commitar | `docs/ai/AI_CHANGE_PLAYBOOK.md` |
