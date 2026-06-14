# AI TFS full inventory

Este arquivo e o mapa de entrada para outra IA entender onde mexer no
`forge/forgottenserver-downgrade-1.8-8.60` sem sair alterando arquivo errado.
Ele complementa:

- `AI_TFS_CONTEXT.md`
- `AI_TFS_FILE_MAP.md`
- `AI_REVSCRIPTSYS_COMPLETE.md`
- `AI_LUA_API_AND_PATTERNS.md`
- `AI_NETWORK_PROTOCOL_MAP.md`
- `AI_CHANGE_PLAYBOOK.md`

Regra principal: UI e client pedem; servidor valida e decide. Recompensa,
storage, dinheiro, cooldown, permissao, quest, combat e item precisam ficar no
server.

## Numeros do TFS local

| Area | Quantidade aproximada | Observacao |
| --- | ---: | --- |
| `src/*.cpp` | 142 | motor C++, rede, jogo, Lua bridge, DB, eventos |
| `src/*.h` | 109 | contratos C++ e tipos compartilhados |
| `data/**/*.lua` | 4145 | scripts de jogo, spells, systems, libs e compat |
| `data/**/*.xml` | 17 | eventos, itens, monsters, raids e config legado |
| `data/**/*.sql` | 1 | schema/migrations base |

## Pastas raiz de `data`

| Pasta | Para que serve | IA deve olhar quando |
| --- | --- | --- |
| `data/chatchannels` | canais de chat e configuracao relacionada | alterar canal, permissao de fala ou chat do jogo |
| `data/events` | callbacks globais carregados por `events.xml` | mexer em login, logout, death, health change, modal, opcode legado |
| `data/items` | definicao de items, atributos e behaviors basicos | item tem peso, slot, flags, weapon type ou atributo errado |
| `data/lib` | bibliotecas Lua carregadas antes dos scripts | criar helper reutilizavel ou descobrir API wrapper |
| `data/logs` | saidas de log do servidor | diagnosticar runtime sem alterar codigo |
| `data/migrations` | migracoes de banco | alterar schema ou dados persistentes |
| `data/monsters` | monsters XML/Lua e stats | alterar monstro, loot, spell ou summon |
| `data/npc` | NPCs e scripts de NPC | alterar dialogo, trade ou missao com NPC |
| `data/raids` | raids e spawns temporizados | alterar evento de mundo ou boss agendado |
| `data/reports` | reports/logs administrativos | diagnostico e moderacao |
| `data/scripts` | RevScriptSys e sistemas modernos | criar regra nova, action, talkaction, spell, movement, network |
| `data/startup` | scripts de bootstrap | carregar estado global ou verificacao inicial |
| `data/store` | store/gamestore | monetizacao, ofertas e categorias |
| `data/world` | mapa, houses e spawn files | alterar mapa, house, spawn e world data |
| `data/XML` | XML legado de vocations, groups, mounts etc | alterar config antiga ainda lida pelo TFS |

## `data/scripts` por tipo

| Pasta | Lua files | Responsabilidade |
| --- | ---: | --- |
| `actions` | 74 | item use, alavanca, bau, ferramenta, quest item |
| `creaturescripts` | 15 | login, death, kill, advance e eventos registrados no player |
| `eventcallbacks` | 21 | callbacks modernos de creature/player/monster |
| `globalevents` | 13 | startup, shutdown, intervalos e horarios |
| `lib` | 14 | helpers especificos dos scripts |
| `magic-roulette-master` | 15 | sistema custom de roulette |
| `monster_level_system` | 1 | level scaling de monstros |
| `movements` | 24 | step in/out, equip/deequip, tile add/remove |
| `network` | 34 | packet/opcode custom e integracao AstraClient |
| `quests` | 6 | quest scripts agrupados |
| `resetsystem` | 7 | sistema de reset |
| `spells` | 824 | spells RevScriptSys, runes, instant, monster spells |
| `spy` | 1 | ferramenta/sistema de spy |
| `talkactions` | 104 | comandos por fala, debug, player/admin commands |
| `weapons` | 4 | armas custom e callbacks de weapon |

## `src` por responsabilidade

| Grupo | Arquivos principais | Quando mexer |
| --- | --- | --- |
| Boot/server | `main.cpp`, `otserv.cpp/h`, `server.cpp/h`, `signals.cpp/h`, `configmanager.cpp/h`, `definitions.h` | startup, config, lifecycle e shutdown |
| Rede base | `connection.cpp/h`, `protocol.cpp/h`, `outputmessage.cpp/h`, `networkmessage.cpp/h`, `xtea.cpp/h`, `rsa.cpp/h` | bytes, criptografia, fila de mensagens e socket |
| Protocolos | `protocolgame.cpp/h`, `protocollogin.cpp/h`, `protocolstatus.cpp/h`, `protocoladmin.cpp/h`, `protocolspectator.cpp/h` | login, game packet, status, admin e spectator |
| Jogo central | `game.cpp/h`, `player.cpp/h`, `creature.cpp/h`, `monster.cpp/h`, `npc.cpp/h` | regra do mundo, player, creature, monster e NPC |
| Mapa/tile/item | `map.cpp/h`, `tile.cpp/h`, `thing.cpp/h`, `item.cpp/h`, `items.cpp/h`, `container.cpp/h`, `cylinder.cpp/h` | movement, item, container, tile e world state |
| Combat | `combat.cpp/h`, `condition.cpp/h`, `spells.cpp/h`, `weapons.cpp/h`, `movement.cpp/h` | dano, heal, condition, spell, weapon e movement |
| Eventos | `baseevents.cpp/h`, `actions.cpp/h`, `talkaction.cpp/h`, `creatureevent.cpp/h`, `globalevent.cpp/h`, `events.cpp/h` | RevScriptSys, XML legado e callbacks |
| DB | `database.cpp/h`, `databasemanager.cpp/h`, `databasetasks.cpp/h`, `iologindata.cpp/h`, `iomapserialize.cpp/h` | persistencia, login data, saves, migrations |
| Mundo social | `guild.cpp/h`, `party.cpp/h`, `groups.cpp/h`, `vocation.cpp/h`, `town.h`, `house.cpp/h` | guild, party, group, vocation, town, house |
| Sistemas extras | `imbuement.cpp/h`, `rewardchest.cpp/h`, `storeinbox.cpp/h`, `inbox.cpp/h`, `mounts.cpp/h`, `familiar.cpp/h`, `weapon_proficiency.cpp/h` | features modernas ou custom |
| Scheduler | `scheduler.cpp/h`, `tasks.cpp/h`, `reactor.cpp/h`, `thread_pool.cpp/h`, `databasetasks.cpp/h` | timers, async work, DB tasks e concorrencia |
| Testes | `src/tests/*`, `src/benchs/*` | validar C++ ou criar regressao testavel |

## Lua bridge em `src/lua*.cpp`

| Arquivo | API exposta para Lua |
| --- | --- |
| `luascript.cpp/h` | registro central, stack, enums, metatables, load/execute |
| `luaactions.cpp` | `Action()` e metodos de action |
| `luatalkaction.cpp` | `TalkAction()` |
| `luaglobalevent.cpp` | `GlobalEvent()` |
| `luacreatureevent.cpp` | `CreatureEvent()` |
| `luamoveevent.cpp` | `MoveEvent()` |
| `luaspells.cpp` | `Spell()` |
| `luaweapons.cpp` | `Weapon()` |
| `luaplayer.cpp` | classe `Player`, storage, inventory, message, client flags |
| `luacreature.cpp` | classe `Creature`, health, speed, position, summons |
| `luamonster.cpp`, `luamonstertype.cpp`, `luamonsterspell.cpp` | monster, MonsterType, attacks, defenses, voices |
| `luanpc.cpp` | NPC API |
| `luagame.cpp` | `Game.*`, world state, create item/monster/npc, spectators |
| `luaitem.cpp`, `luaitemtype.cpp`, `luacontainer.cpp` | item, item type, container |
| `luatile.cpp`, `luaposition.cpp`, `luateleport.cpp`, `luazone.cpp` | tile, position, teleport, zone |
| `luacombat.cpp`, `luacondition.cpp` | combat, formulas, area, conditions |
| `luanetworkmessage.cpp` | `NetworkMessage`, leitura/escrita de bytes reais |
| `luamodalwindow.cpp` | modal windows |
| `luagroup.cpp`, `luaguild.cpp`, `luaparty.cpp`, `luavocation.cpp` | social/group/vocation APIs |
| `luaimbuements.cpp`, `lualoot.cpp`, `luaoutfit.cpp`, `luahouse.cpp`, `luatown.cpp` | sistemas auxiliares |
| `luaxml.cpp` | XML helpers/compat |

## `data/lib`

| Arquivo | Uso |
| --- | --- |
| `data/lib/lib.lua` | loader principal das libs |
| `data/lib/compat/compat.lua` | compatibilidade com scripts antigos |
| `data/lib/core/core.lua` | core bootstrap |
| `data/lib/core/constants.lua` | constantes Lua globais |
| `data/lib/core/player.lua` | helpers de Player |
| `data/lib/core/game.lua` | helpers de Game |
| `data/lib/core/item.lua`, `itemtype.lua`, `container.lua` | helpers de item/container |
| `data/lib/core/creature.lua` | helpers de Creature |
| `data/lib/core/combat.lua`, `spells.lua` | helpers de combat/spell |
| `data/lib/core/packet_handler.lua` | PacketHandler e NetworkGuard para bytes reais |
| `data/lib/core/task_board.lua` | helpers do Task Board |
| `data/lib/core/storages.lua` | storage ids e grupos |
| `data/lib/core/quests.lua` | helpers de quest |
| `data/lib/core/doors.lua` | portas e actions de door |
| `data/lib/core/imbuing.lua`, `workbench.lua` | imbuement e workbench |
| `data/lib/functions/*.lua` | funcoes soltas de sistemas custom |
| `data/lib/task_board/*.lua` | dados de delivery/shop do Task Board |
| `data/lib/debugging/*.lua` | dump e versao Lua |

## `data/events`

| Arquivo | Uso |
| --- | --- |
| `data/events/events.xml` | habilita/desabilita callbacks |
| `data/events/scripts/player.lua` | login/logout, think, death, modal, extended/network messages |
| `data/events/scripts/creature.lua` | callbacks de creature |
| `data/events/scripts/monster.lua` | callbacks de monster |
| `data/events/scripts/party.lua` | callbacks de party |

## `data/scripts/network` inventario exato

| Arquivo | Sistema |
| --- | --- |
| `network/battlepass/battlepass.lua` | battle pass |
| `network/boss_cooldown/bosscooldown.lua` | boss cooldown |
| `network/cyclopedia/bosstiary.lua` | Bosstiary |
| `network/cyclopedia/ciclopedia.lua` | Cyclopedia |
| `network/daily_reward.lua` | recompensa diaria |
| `network/forge/forge.lua` | Forge/exaltation |
| `network/gamestore/gamestore.lua` | Game Store |
| `network/highscores.lua` | highscores |
| `network/hirelings/hireling_outfit.lua` | hireling outfit |
| `network/hunt_analyzer/huntanalyzer.lua` | hunt analyzer |
| `network/imbuements/imbuing.lua` | imbuements |
| `network/item_values.lua` | valores de items |
| `network/market/market.lua` | market |
| `network/misc_analyzer/miscanalyzer.lua` | misc analyzer |
| `network/mounts/toggle_mount.lua` | toggle mount |
| `network/party_analyzer/partytracker.lua` | party analyzer |
| `network/player/player_fight_mode.lua` | fight mode |
| `network/prey_system/prey_monsters.lua` | prey monster list |
| `network/prey_system/prey_system.lua` | prey system |
| `network/proficiency/proficiency.lua` | proficiency |
| `network/proficiency/weapon_catalog.lua` | weapon catalog |
| `network/quests/quests.lua` | quest log/protocol |
| `network/quickloot.lua` | quickloot |
| `network/supply_stash/supplystash.lua` | supply stash |
| `network/supply_tracker/supplytracker.lua` | supply tracker |
| `network/task_board/bounty_tasks.lua` | bounty tasks |
| `network/task_board/creature_events.lua` | creature events do Task Board |
| `network/task_board/hunting_shop.lua` | hunt shop |
| `network/task_board/init.lua` | bootstrap/registro do Task Board |
| `network/task_board/protocol.lua` | contrato de bytes do Task Board |
| `network/task_board/soulseal_handler.lua` | soul seals |
| `network/task_board/weekly_tasks.lua` | weekly tasks |
| `network/unjustified_points/unjustifiedpoints.lua` | unjustified points |
| `network/wheel/wheel.lua` | wheel |

## Onde mexer por tipo de tarefa

| Tarefa | Comece por | Depois confira |
| --- | --- | --- |
| Criar action/item use | `data/scripts/actions` | `src/luaactions.cpp`, `AI_REVSCRIPTSYS_COMPLETE.md` |
| Criar comando | `data/scripts/talkactions` | permissao, group, `src/luatalkaction.cpp` |
| Criar spell | `data/scripts/spells` | `src/luaspells.cpp`, combat/condition |
| Criar equip/step | `data/scripts/movements` | slot, level, vocacao, `src/luamoveevent.cpp` |
| Criar evento de login/kill | `data/scripts/creaturescripts` | registro no `onLogin`, `src/luacreatureevent.cpp` |
| Criar packet custom | `data/scripts/network`, `data/lib/core/packet_handler.lua` | `src/protocolgame.cpp`, `src/game.cpp`, AstraClient parser |
| Adicionar API Lua nova | `src/lua*.cpp`, `src/luascript.cpp/h` | chamada real em `data/scripts`, build C++ |
| Alterar protocolo base | `src/protocolgame.cpp/h`, `src/networkmessage.cpp/h` | compatibilidade com client e opcode map |
| Alterar persistencia | `src/database*`, `src/iologindata*`, `data/migrations` | migration e rollback |

## Checklist para outra IA

1. Abra `AI_TFS_CONTEXT.md`.
2. Identifique se a mudanca e script, API Lua, protocolo, DB, client ou docs.
3. Leia um arquivo vizinho do mesmo tipo antes de criar novo padrao.
4. Se for RevScriptSys, use `AI_REVSCRIPTSYS_COMPLETE.md`.
5. Se for bytes/opcode, use `AI_NETWORK_PROTOCOL_MAP.md`.
6. Se tocar C++, procurar a Lua bridge e o ponto de chamada real.
7. Validar sempre no servidor: client nunca e confiavel.
8. Atualizar docs quando mudar opcode, storage, config, flow ou caminho importante.
