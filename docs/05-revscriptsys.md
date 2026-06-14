# Revscriptsys

Revscriptsys permite registrar scripts pelo Lua em vez de XML. Um arquivo em `data/scripts/astra_hello.lua` pode criar uma `TalkAction("/hello")`, implementar `onSay` e chamar `:register()`.

Metatables comuns: `Action`, `CreatureEvent`, `GlobalEvent`, `MoveEvent`, `Spell`, `TalkAction` e `Weapon`.
