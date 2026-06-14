# Astra Code Academy

Site publico: https://mateuzkl.github.io/Astra-Code-Academy/index.html

Repositorio de documentacao estatica para estudar Open Tibia com foco em TFS, OTClient, AstraClient, Revscriptsys, arquitetura de servidor, modulos de client e protocolo em bytes reais.

Idiomas neste README:

- [PT-BR](#pt-br)
- [English](#english)
- [Espanol](#espanol)

---

## PT-BR

### O que e

Astra Code Academy e uma wiki estatica para transformar o material do workspace em estudo organizado. A ideia nao e ser apenas um tutorial basico. O site junta fundamentos, exemplos praticos e leitura de codigo real do `forge`, especialmente:

- `forge/forgottenserver-downgrade-1.8-8.60`
- `forge/AstraClient`
- `forge/canary`
- `forge/crystalserver-main`
- `forge/mehah`
- `forge/otclientv8 otacademy`
- `Ultralight_-_OTClient`

O conteudo tambem considera a wiki oficial do Revscriptsys:

- https://github.com/otland/forgottenserver/wiki/Revscriptsys

### O que foi documentado

- Fundamentos de logica, algoritmos, Lua e C++.
- Estrutura do TFS e pastas importantes.
- Revscriptsys com `Action`, `CreatureEvent`, `GlobalEvent`, `MoveEvent`, `Spell`, `TalkAction`, `Weapon` e `MonsterType`.
- OTClient/AstraClient com `.otmod`, `.otui`, Lua, widgets, sidebar, signals e cleanup.
- Comunicacao client/server.
- Protocolo em bytes reais em vez de JSON/extended opcode pesado.
- Mapa do `forge`.
- Sistemas reais em `data/scripts/network`.
- Arquitetura TFS avancada.
- Protocolo OTClient avancado.
- Mapa de opcodes.
- Migracao JSON -> bytes.
- Seguranca do servidor e anti exploit.
- Build, run, debug, logs e Git.

### Bytes reais vs JSON/extended opcode

O projeto tem uma direcao clara: usar bytes reais para sistemas quentes, frequentes ou grandes.

Arquivos importantes analisados:

- `data/lib/core/packet_handler.lua`
- `data/events/scripts/player.lua`
- `data/scripts/network/task_board/init.lua`
- `data/scripts/network/task_board/protocol.lua`
- `src/protocolgame.cpp`
- `src/game.cpp`
- `src/luanetworkmessage.cpp`
- `AstraClient/modules/game_protocol/protocol.lua`
- `AstraClient/src/client/protocolgamesend.cpp`

Resumo do fluxo:

1. Client envia opcode nativo, por exemplo `0x5F`.
2. `ProtocolGame::parsePacket` le o primeiro byte.
3. O servidor encaminha para `Game::parsePlayerNetworkMessage`.
4. `Player:onNetworkMessage` procura `PacketHandlers[recvByte]`.
5. O handler Lua le o payload com `NetworkGuard`.
6. O servidor valida player, client, tamanho, cooldown, range e regra.
7. O servidor responde com `NetworkMessage`.

Opcoes vistas no Task Board:

| Opcode | Direcao | Uso |
| --- | --- | --- |
| `0x5F` | Client -> server | Acoes do Task Board |
| `0x53` | Server -> client | Dados de bounty, weekly e hunt shop |
| `0xBA` | Server -> client | Soul Seals |
| `0xEE` | Server -> client | Resource balance |
| `0x32` | Ambos | Extended opcode/compatibilidade |

Regra central: o client nunca e confiavel. O client pode clicar, renderizar e pedir. O servidor valida e decide.

### Estrutura do repositorio

```text
Astra-Code-Academy/
  index.html
  README.md
  assets/
    css/style.css
    js/main.js
    img/
  components/
  docs/
  tutorials/
```

### Como rodar local

```powershell
cd C:\Users\Mateus\Desktop\tutorial\Astra-Code-Academy
python -m http.server 8765 --bind 127.0.0.1
```

Depois abra:

```text
http://127.0.0.1:8765/index.html
```

### Como publicar

O GitHub Pages usa o `index.html` da raiz:

```text
https://mateuzkl.github.io/Astra-Code-Academy/index.html
```

Para atualizar:

```powershell
git status --short --branch
git add .
git commit -m "Improve Astra Academy documentation"
git push
```

### Regra de manutencao

- Documentar caminho real do arquivo.
- Separar server, client e contrato de protocolo.
- Quando houver opcode novo, escrever direcao, payload, tipos e guardas.
- Nao confiar em dados do client.
- Nao reverter alteracoes existentes em repos do `forge`.
- Testar em desktop e mobile antes de publicar.

---

## English

### What this is

Astra Code Academy is a static Open Tibia documentation site built from the local workspace. It is not just a beginner guide. It combines foundations, practical examples, and real code reading from the `forge` folder.

Primary focus:

- TFS server architecture.
- RevScriptSys usage and patterns.
- OTClient/AstraClient modules.
- Client/server communication.
- Real byte protocol instead of heavy JSON extended opcodes.
- Security, debugging, build workflow, and Git workflow.

Main source repositories inspected:

- `forge/forgottenserver-downgrade-1.8-8.60`
- `forge/AstraClient`
- `forge/canary`
- `forge/crystalserver-main`
- `forge/mehah`
- `forge/otclientv8 otacademy`

Official RevScriptSys reference:

- https://github.com/otland/forgottenserver/wiki/Revscriptsys

### Real bytes protocol

For frequent gameplay systems, real typed bytes are preferred over JSON strings because they reduce payload size, avoid JSON encode/decode overhead, and make the wire contract explicit.

Important files:

- `data/lib/core/packet_handler.lua`
- `data/events/scripts/player.lua`
- `data/scripts/network/task_board/init.lua`
- `data/scripts/network/task_board/protocol.lua`
- `src/protocolgame.cpp`
- `src/game.cpp`
- `src/luanetworkmessage.cpp`
- `AstraClient/modules/game_protocol/protocol.lua`
- `AstraClient/src/client/protocolgamesend.cpp`

Core rule: the client is never trusted. The client may render and request actions, but the server validates and decides.

### Local run

```powershell
cd C:\Users\Mateus\Desktop\tutorial\Astra-Code-Academy
python -m http.server 8765 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8765/index.html
```

### Public site

```text
https://mateuzkl.github.io/Astra-Code-Academy/index.html
```

### Maintenance checklist

- Keep `index.html` at repository root for GitHub Pages.
- Keep tutorials as real files inside `tutorials/`.
- Document server path, client path, and protocol contract together.
- For every new opcode, document direction, payload order, field type, validation and fallback.
- Test desktop and mobile before pushing.

---

## Espanol

### Que es

Astra Code Academy es una wiki estatica para estudiar Open Tibia usando el workspace local como base. No es solamente una introduccion. Organiza fundamentos, ejemplos practicos y lectura de codigo real del `forge`.

Temas principales:

- Arquitectura del servidor TFS.
- Uso de RevScriptSys.
- Modulos OTClient/AstraClient.
- Comunicacion cliente/servidor.
- Protocolo con bytes reales en vez de JSON/extended opcode pesado.
- Seguridad, debug, build, logs y Git.

Repos principales revisados:

- `forge/forgottenserver-downgrade-1.8-8.60`
- `forge/AstraClient`
- `forge/canary`
- `forge/crystalserver-main`
- `forge/mehah`
- `forge/otclientv8 otacademy`

Referencia oficial de RevScriptSys:

- https://github.com/otland/forgottenserver/wiki/Revscriptsys

### Bytes reales

Para sistemas frecuentes o grandes, los bytes tipados son mejores que JSON porque reducen tamano, evitan parseo de JSON y dejan claro el contrato del protocolo.

Regla principal: el cliente nunca es confiable. El cliente puede mostrar interfaz y pedir acciones. El servidor valida y decide.

### Ejecutar localmente

```powershell
cd C:\Users\Mateus\Desktop\tutorial\Astra-Code-Academy
python -m http.server 8765 --bind 127.0.0.1
```

Abrir:

```text
http://127.0.0.1:8765/index.html
```

### Sitio publico

```text
https://mateuzkl.github.io/Astra-Code-Academy/index.html
```

### Checklist de mantenimiento

- Mantener `index.html` en la raiz para GitHub Pages.
- Mantener cada tutorial como archivo real dentro de `tutorials/`.
- Documentar servidor, cliente y contrato de protocolo juntos.
- En cada opcode nuevo, documentar direccion, payload, tipos, validacion y fallback.
- Probar desktop y mobile antes de publicar.
