# AstraClient

O AstraClient no workspace usa modules modernos e integra com o fork do servidor por bytes reais em sistemas como task board e soulseal. Os arquivos centrais sao `modules/game_protocol/protocol.lua` e `src/client/protocolgamesend.cpp`.

No servidor, opcodes Astra-only sao protegidos para nao serem enviados a clients que nao sabem interpreta-los.
