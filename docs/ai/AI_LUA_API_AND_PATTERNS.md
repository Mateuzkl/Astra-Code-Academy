# AI Lua API And Patterns

Este documento resume a API Lua do TFS local e padroes seguros para scripts.

## Onde estudar

| Arquivo | Conteudo |
| --- | --- |
| `src/luascript.cpp` | Registra enums, classes, metodos e funcoes globais. |
| `src/luaplayer.cpp` | Metodos de `Player`. |
| `src/luacreature.cpp` | Metodos de `Creature`. |
| `src/luagame.cpp` | Metodos de `Game`. |
| `src/luaitem.cpp` | Metodos de `Item`. |
| `src/luaitemtype.cpp` | Metodos de `ItemType`. |
| `src/luacontainer.cpp` | Metodos de `Container`. |
| `src/luanetworkmessage.cpp` | `NetworkMessage` e guardas Astra-only/OTC-only. |
| `data/lib/core/*.lua` | Helpers Lua e extensoes de classes. |
| `data/lib/compat/compat.lua` | Compatibilidade com scripts antigos. |

## Classes importantes

| Classe/API | Uso |
| --- | --- |
| `Player` | Inventario, storage, mensagens, premium, vocacao, party, depot, client flags. |
| `Creature` | Vida, posicao, damage, summon, condition, movement. |
| `Monster` | Monster state, target, summon, drops. |
| `Npc` | Interacao com NPC. |
| `Game` | Criar objetos, pegar players, world state, storages globais, raids. |
| `Item` | Atributos, transform, remove, actionid, uniqueid. |
| `ItemType` | Info estatica de item. |
| `Container` | Add/remove itens, slots, browse. |
| `Position` | Coordenadas, effects, distance. |
| `Tile` | Ground, creatures, items, flags. |
| `Combat` | Dano/heal/area/formula. |
| `Condition` | Poison, fire, haste, paralyze, etc. |
| `NetworkMessage` | Bytes reais server/client. |
| `ModalWindow` | Modal classico. |

## Padrao de validacao

```lua
local function requirePlayer(player)
    if not player or not player:isPlayer() then
        return false
    end
    return true
end
```

## Padrao com storage

```lua
local STORAGE = 910100

local function getCount(player)
    return math.max(0, player:getStorageValue(STORAGE))
end

local function addCount(player, amount)
    player:setStorageValue(STORAGE, getCount(player) + amount)
end
```

## Padrao com item temporario

```lua
local item = Game.createItem(2160, 1)
if not item then
    return false
end

local result = player:addItemEx(item)
if result ~= RETURNVALUE_NOERROR then
    item:remove()
    player:sendCancelMessage(Game.getReturnMessage(result))
    return false
end
```

## Padrao com addEvent

Evite guardar userdata por muito tempo. Guarde id e reabra objeto.

```lua
local playerId = player:getId()
addEvent(function()
    local delayedPlayer = Player(playerId)
    if not delayedPlayer then
        return
    end
    delayedPlayer:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Evento atrasado.")
end, 1000)
```

## Padrao para NetworkMessage recebido

```lua
local handler = PacketHandler(0xA2)

function handler.onReceive(player, msg)
    if not player or not player:isUsingAstraClient() then
        return
    end

    local action = NetworkGuard.readByte(msg)
    local value = NetworkGuard.readU16(msg)
    if not action or not value then
        return
    end
end

handler:register()
```

## APIs que pedem cuidado

| API | Risco | Como usar |
| --- | --- | --- |
| `Game.getSpectators` | Custo alto em loop quente. | Limitar range, cachear estado, usar eventos. |
| `Game.createItem` | Item temporario pode ficar sem dono. | Mover para container/tile ou remover. |
| `db.query` | SQL injection ou query pesada. | Escape/validar entrada, transacao quando necessario. |
| `addEvent` | Userdata pode sumir antes do callback. | Guardar id e revalidar objeto. |
| `NetworkMessage:get*` | Leitura fora do buffer. | Usar `NetworkGuard`. |
| `player:addItem` | Pode falhar por cap/slot. | Checar retorno quando usar `addItemEx`. |

## Onde procurar exemplos reais

| Tipo | Caminho |
| --- | --- |
| Action | `data/scripts/actions` |
| TalkAction | `data/scripts/talkactions` |
| CreatureEvent | `data/scripts/creaturescripts` |
| GlobalEvent | `data/scripts/globalevents` |
| MoveEvent | `data/scripts/movements` |
| Spell | `data/scripts/spells` |
| Network | `data/scripts/network` |
| Lib core | `data/lib/core` |

## Regra para outra IA

Antes de inventar API, rode uma busca:

```powershell
rg -n "nomeDaFuncao|NomeDaClasse|PacketHandler|NetworkGuard" src data
```

Se existe script vizinho que faz algo parecido, siga o padrao local.
