# AI RevScriptSys Complete Guide

Fonte oficial usada como base:

https://github.com/otland/forgottenserver/wiki/Revscriptsys

Este guia nao copia a wiki oficial. Ele resume os mesmos blocos e adapta ao fork local.

## Ideia central

RevScriptSys registra scripts diretamente no Lua. Em vez de criar XML e apontar para script, voce cria a metatable, implementa callback e chama `:register()`.

Local recomendado:

`data/scripts/`

Monster scripts:

`data/monster/` ou subpastas equivalentes do fork.

## Estrutura basica

```lua
local action = Action()

function action.onUse(player, item, fromPosition, target, toPosition, isHotkey)
    return true
end

action:id(2550)
action:register()
```

## Metatables suportadas

| Metatable | Quando usar |
| --- | --- |
| `Action()` | Item usado pelo player. |
| `CreatureEvent("name")` | Evento de criatura/player. |
| `GlobalEvent("name")` | Rotina global ou tempo. |
| `MonsterType("name")` | Monstro criado/sobrescrito por Lua. |
| `MoveEvent()` | Step, equip, deequip, add/remove item. |
| `Spell("name")` ou `Spell("instant")` | Magias e runas. |
| `TalkAction("words")` | Comando de chat. |
| `Weapon(WEAPON_TYPE)` | Arma custom. |

## Action

Callback:

```lua
function action.onUse(player, item, fromPosition, target, toPosition, isHotkey)
```

Metodos:

- `id(ids)`
- `aid(ids)`
- `uid(ids)`
- `allowFarUse(bool)`
- `blockWalls(bool)`
- `checkFloor(bool)`

Exemplo seguro:

```lua
local chest = Action()
local STORAGE = 910001

function chest.onUse(player, item, fromPosition, target, toPosition, isHotkey)
    if player:getStorageValue(STORAGE) == 1 then
        player:sendCancelMessage("Voce ja recebeu.")
        return true
    end

    player:addItem(2160, 1)
    player:setStorageValue(STORAGE, 1)
    return true
end

chest:aid(45001)
chest:register()
```

## CreatureEvent

Callbacks principais:

- `onLogin(player)`
- `onLogout(player)`
- `onThink(creature, interval)`
- `onPrepareDeath(creature, killer)`
- `onDeath(creature, corpse, killer, mostDamageKiller, lastHitUnjustified, mostDamageUnjustified)`
- `onKill(creature, target)`
- `onAdvance(player, skill, oldLevel, newLevel)`
- `onModalWindow(player, modalWindowId, buttonId, choiceId)`
- `onTextEdit(player, item, text)`
- `onHealthChange(creature, attacker, primaryDamage, primaryType, secondaryDamage, secondaryType, origin)`
- `onManaChange(creature, attacker, primaryDamage, primaryType, secondaryDamage, secondaryType, origin)`
- `onExtendedOpCode(player, opcode, buffer)`

Padrao comum:

```lua
local login = CreatureEvent("AstraLogin")
local kill = CreatureEvent("AstraKill")

function login.onLogin(player)
    player:registerEvent("AstraKill")
    return true
end

function kill.onKill(player, target)
    if target and target:isMonster() then
        player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Kill registrada.")
    end
    return true
end

login:register()
kill:register()
```

## GlobalEvent

Callbacks:

- `onThink(interval)`
- `onTime(interval)`
- `onStartup()`
- `onShutdown()`
- `onRecord(current, old)`

Metodos:

- `interval(ms)`
- `time("HH:MM")`

Exemplo:

```lua
local event = GlobalEvent("AstraDaily")

function event.onTime(interval)
    Game.broadcastMessage("Evento diario iniciado.", MESSAGE_STATUS_DEFAULT)
    return true
end

event:time("08:00")
event:register()
```

## MonsterType

Use quando precisar criar monstro por Lua ou portar monstro moderno.

Campos comuns:

- `description`
- `experience`
- `outfit`
- `health`
- `maxHealth`
- `race`
- `corpse`
- `speed`
- `flags`
- `summons`
- `voices`
- `loot`
- `attacks`
- `defenses`
- `elements`
- `immunities`

Callbacks:

- `onThink`
- `onAppear`
- `onDisappear`
- `onMove`
- `onSay`

Regra: monstro grande precisa ser revisado com cuidado porque loot, dano e speed afetam economia e gameplay.

## MoveEvent

Callbacks:

- `onEquip(player, item, slot, isCheck)`
- `onDeEquip(player, item, slot, isCheck)`
- `onStepIn(creature, item, position, fromPosition)`
- `onStepOut(creature, item, position, fromPosition)`
- `onAddItem(moveitem, tileitem, position)`
- `onRemoveItem(moveitem, tileitem, position)`

Metodos:

- `level(lvl)`
- `magiclevel(lvl)`
- `slot(slot)`
- `id(ids)`
- `aid(ids)`
- `uid(ids)`
- `position(positions)`
- `premium(bool)`
- `vocation(vocName, showInDescription, lastVoc)`

Atencao: `onEquip` e `onDeEquip` podem rodar com `isCheck = true` antes de aplicar a troca. Retorne `true` para permitir.

## Spell

Callback:

```lua
function spell.onCastSpell(creature, var, isHotkey)
```

Metodos comuns:

- `name`
- `words`
- `group`
- `vocation`
- `id`
- `cooldown`
- `groupCooldown`
- `level`
- `mana`
- `isSelfTarget`
- `isPremium`
- `getManaCost(player)`
- `getSoulCost()`
- `isLearnable()`

Exemplo:

```lua
local combat = Combat()
combat:setParameter(COMBAT_PARAM_TYPE, COMBAT_FIREDAMAGE)
combat:setParameter(COMBAT_PARAM_EFFECT, CONST_ME_FIREAREA)

local spell = Spell("instant")

function spell.onCastSpell(creature, variant)
    return combat:execute(creature, variant)
end

spell:name("Astra Flame")
spell:words("exevo astra flam")
spell:level(20)
spell:mana(80)
spell:cooldown(2000)
spell:register()
```

## TalkAction

Callback:

```lua
function talkaction.onSay(player, words, param, type)
```

Metodo:

- `separator(sep)`

Exemplo:

```lua
local where = TalkAction("/where")

function where.onSay(player, words, param, type)
    local pos = player:getPosition()
    player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, string.format("%d %d %d", pos.x, pos.y, pos.z))
    return false
end

where:separator(" ")
where:register()
```

## Weapon

Callback:

```lua
function weapon.onUseWeapon(player, variant)
```

Exemplo:

```lua
local combat = Combat()
combat:setParameter(COMBAT_PARAM_TYPE, COMBAT_PHYSICALDAMAGE)

local weapon = Weapon(WEAPON_AMMO)

function weapon.onUseWeapon(player, variant)
    return combat:execute(player, variant)
end

weapon:register()
```

## Checklist antes de salvar

- O arquivo esta em `data/scripts/...`?
- A metatable bate com o evento?
- Existe `:register()`?
- O callback retorna `true` ou `false` correto?
- Player/target/item podem ser `nil`?
- Storage/cooldown/permissao foram validados?
- Se usa opcode, esta documentado em `AI_NETWORK_PROTOCOL_MAP.md`?
- Se usa banco, tem escape/migration?
