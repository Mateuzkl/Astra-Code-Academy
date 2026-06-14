# AI Network Protocol Map

Este documento explica o protocolo custom do fork e como outra IA deve mexer em bytes reais.

## Regra central

Bytes reais sao preferidos para sistemas quentes, grandes ou frequentes. JSON/extended opcode e aceitavel para prototipo, config pequena ou compatibilidade.

## Fluxo server-side

| Etapa | Arquivo |
| --- | --- |
| Client envia primeiro byte | AstraClient ou OTClient |
| TFS le packet | `src/protocolgame.cpp` |
| Encaminha custom packet | `src/game.cpp` -> `Game::parsePlayerNetworkMessage` |
| Lua recebe | `data/events/scripts/player.lua` -> `Player:onNetworkMessage` |
| Handler roda | `data/lib/core/packet_handler.lua` -> `PacketHandlers[recvByte]` |
| Sistema processa | `data/scripts/network/...` |

## Arquivos-chave

| Arquivo | Papel |
| --- | --- |
| `data/lib/core/packet_handler.lua` | `PacketHandler` e `NetworkGuard`. |
| `data/events/scripts/player.lua` | Ponte `Player:onNetworkMessage`. |
| `src/protocolgame.cpp` | Parser principal de packets. |
| `src/game.cpp` | Chama evento Lua de network. |
| `src/luanetworkmessage.cpp` | `NetworkMessage` e guardas Astra-only/OTC-only. |
| `AstraClient/src/client/protocolgamesend.cpp` | Client envia bytes. |
| `AstraClient/modules/game_protocol/protocol.lua` | Client registra parsers. |

## NetworkGuard

Use sempre para payload recebido do client:

```lua
local action = NetworkGuard.readByte(msg)
local id = NetworkGuard.readU16(msg)
local text = NetworkGuard.readString(msg, 64)
if not action or not id or not text then
    return
end
```

Funcoes:

- `remaining(msg)`
- `canRead(msg, bytes)`
- `readByte(msg)`
- `readU16(msg)`
- `readU32(msg)`
- `readPosition(msg)`
- `readString(msg, maxLength)`
- `cooldown(player, key, milliseconds)`
- `clearPlayer(player)`

## Mapa de opcodes vistos em `data/scripts/network`

| Opcode | Sistema | Direcao principal |
| --- | --- | --- |
| `0x28/0x29` | Supply Stash | request/send |
| `0x2A` | Bosstiary tracker | client -> server |
| `0x2B/0x2E/0x2F` | Party/Unjustified analyzer | misto |
| `0x2C` | Boss cooldown | server -> client |
| `0x30/0x31` | Misc analyzer | server -> client |
| `0x37` | Battle Pass | request/send |
| `0x39/0x3A/0x3B/0x3E/0x3F` | Cyclopedia | misto |
| `0x53` | Task Board data | server -> client |
| `0x5A/0x5B/0x5C/0xC4` | Proficiency | server -> client |
| `0x5F` | Task Board action / Wheel window | misto, cuidado com colisao por contexto |
| `0x61/0x62/0x73` | Bosstiary/Wheel | misto |
| `0x8F/0x90/0x91/0xC0/0xCF` | Quick Loot | misto |
| `0xA0/0xA7` | Fight mode sync | client/server |
| `0xAE/0xAF/0xB0` | Bosstiary actions | client -> server |
| `0xB1` | Highscores | misto |
| `0xB2/0xD5/0xD6/0xD7` | Imbuements | client -> server |
| `0xB3` | Proficiency request | client -> server |
| `0xB4/0xB5/0xB6` | Daily reward | client -> server |
| `0xBA` | Soul Seals | server -> client |
| `0xC6/0xC7` | Item values/details | server -> client |
| `0xD1` | Hunt analyzer | server -> client |
| `0xD2/0xD3` | Hireling outfit | client -> server |
| `0xD4` | Toggle mount | client -> server |
| `0xD8/0xD9` | Prey toggles | client -> server |
| `0xDB` | Market send | server -> client |
| `0xE0/0xE1` | Market cancel/accept | client -> server |
| `0xE2/0xE3` | Forge request/send | misto |
| `0xE7` | Wheel gem action | client -> server |
| `0xE8/0xE9/0xEA/0xEB/0xEC/0xED` | Prey/Wheel/Imbuing | misto, revisar contexto |
| `0xEE` | Resource balance | server -> client |
| `0xF0/0xF1` | Quest log/line | misto |
| `0xF4/0xF5/0xF6/0xF7` | Market open/leave/browse/create | client -> server |
| `0xF8/0xFA/0xFB/0xFC/0xFD` | Game Store | misto |

## Task Board contrato principal

Client -> server:

```text
Opcode 0x5F
U8 option
option 2: U8 difficulty
option 5: U8 taskIndex
option 7: U8 pathIndex
option 8: U8 taskIndex
option 9: U8 difficulty
option 11: U8 offerIndex
option 12/13/14: U16 slot
option 15/16: U16 slot, U16 raceId
```

Server -> client:

- `0x53`: Task Board data
- `0xBA`: Soul Seals data
- `0xEE`: Resource balance

## Checklist para opcode novo

1. Confirmar opcode livre e conflito por contexto.
2. Documentar direcao: client -> server ou server -> client.
3. Escrever payload em ordem e tipo.
4. Implementar writer.
5. Implementar parser.
6. Validar client: `player:isUsingAstraClient()` quando exclusivo.
7. Usar `NetworkGuard` em payload do client.
8. Limitar strings.
9. Aplicar cooldown por player/acao.
10. Testar packet curto, extra bytes, valor fora de range e client sem suporte.
