const NAV_GROUPS = [
  {
    title: "Fundamentos",
    items: [
      ["00", "logica-programacao", "Logica de programacao"],
      ["01", "algoritmos-basicos", "Algoritmos basicos"],
      ["02", "lua-iniciante", "Lua iniciante"],
      ["03", "cpp-iniciante", "C++ iniciante"],
      ["04", "como-usar-ia", "Como usar IA"]
    ]
  },
  {
    title: "TFS",
    items: [
      ["05", "tfs-introducao", "Introducao ao TFS"],
      ["06", "tfs-estrutura-pastas", "Estrutura de pastas"],
      ["07", "tfs-revscriptsys", "Revscriptsys"],
      ["08", "tfs-actions", "Actions"],
      ["09", "tfs-talkactions", "Talkactions"],
      ["10", "tfs-creaturescripts", "Creaturescripts"],
      ["11", "tfs-globalevents", "Globalevents"],
      ["12", "tfs-movements", "Movements"],
      ["13", "tfs-spells", "Spells"],
      ["14", "tfs-database", "Database"],
      ["15", "tfs-debug", "Debug e logs"]
    ]
  },
  {
    title: "OTClient e AstraClient",
    items: [
      ["16", "otclient-introducao", "Introducao ao OTClient"],
      ["17", "otclient-estrutura-pastas", "Estrutura do client"],
      ["18", "otclient-modules", "Modules"],
      ["19", "otclient-otmod", ".otmod"],
      ["20", "otclient-otui", ".otui"],
      ["21", "otclient-lua", "Lua no client"],
      ["22", "otclient-criar-janela", "Criar janela"],
      ["23", "otclient-criar-botao", "Criar botao"],
      ["24", "otclient-sidebar", "Sidebar"],
      ["25", "otclient-comunicacao-server", "Comunicacao server"],
      ["26", "astra-client", "AstraClient"]
    ]
  },
  {
    title: "Arquitetura moderna",
    items: [
      ["27", "network-bytes-reais", "Network bytes reais"],
      ["28", "comparacao-tfs-canary-crystal", "TFS, Canary e Crystal"],
      ["29", "boas-praticas", "Boas praticas"],
      ["30", "relatorio-github", "Relatorio e logs"]
    ]
  }
];

const SNIPPETS = {
  revHello: [
    'local hello = TalkAction("/hello")',
    '',
    'function hello.onSay(player, words, param)',
    '    player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Ola, bem-vindo a Astra Academy")',
    '    return false',
    'end',
    '',
    'hello:separator(" ")',
    'hello:register()'
  ].join("\n"),
  action: [
    'local ropeAction = Action()',
    '',
    'function ropeAction.onUse(player, item, fromPosition, target, toPosition, isHotkey)',
    '    player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Voce usou uma action RevScript.")',
    '    return true',
    'end',
    '',
    'ropeAction:id(3003)',
    'ropeAction:register()'
  ].join("\n"),
  moduleOtmod: [
    'Module',
    '  name: astra_hello',
    '  description: Janela simples da Astra Academy',
    '  author: Astra Academy',
    '  sandboxed: true',
    '  scripts: [ astra_hello.lua ]',
    '  @onLoad: init()',
    '  @onUnload: terminate()'
  ].join("\n"),
  moduleLua: [
    'helloWindow = nil',
    '',
    'function init()',
    '  connect(g_game, { onGameEnd = destroy })',
    '  helloWindow = g_ui.displayUI("astra_hello.otui")',
    '  helloWindow:hide()',
    'end',
    '',
    'function terminate()',
    '  disconnect(g_game, { onGameEnd = destroy })',
    '  destroy()',
    'end',
    '',
    'function toggle()',
    '  if not helloWindow then return end',
    '  helloWindow:setVisible(not helloWindow:isVisible())',
    'end',
    '',
    'function printHello()',
    '  print("Ola, Astra Academy")',
    'end',
    '',
    'function destroy()',
    '  if helloWindow then',
    '    helloWindow:destroy()',
    '    helloWindow = nil',
    '  end',
    'end'
  ].join("\n"),
  moduleOtui: [
    'MainWindow',
    '  id: astraHelloWindow',
    '  !text: tr("Astra Hello")',
    '  size: 280 150',
    '  @onEscape: modules.astra_hello.toggle()',
    '',
    '  Label',
    '    id: helloLabel',
    '    !text: tr("Ola, Astra Academy")',
    '    anchors.top: parent.top',
    '    anchors.left: parent.left',
    '    margin-top: 16',
    '    margin-left: 16',
    '',
    '  Button',
    '    id: consoleButton',
    '    !text: tr("Enviar para console")',
    '    anchors.left: parent.left',
    '    anchors.bottom: parent.bottom',
    '    margin-left: 16',
    '    margin-bottom: 16',
    '    @onClick: modules.astra_hello.printHello()'
  ].join("\n"),
  byteHandler: [
    'local ASTRA_HELLO_OPCODE = 0xA2',
    '',
    'local handler = PacketHandler(ASTRA_HELLO_OPCODE)',
    '',
    'function handler.onReceive(player, msg)',
    '    if not player.isUsingAstraClient or not player:isUsingAstraClient() then',
    '        return',
    '    end',
    '',
    '    local action = NetworkGuard.readByte(msg)',
    '    local text = NetworkGuard.readString(msg, 64)',
    '    if not action or not text then',
    '        return',
    '    end',
    '',
    '    if action == 1 then',
    '        player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Client disse: " .. text)',
    '    end',
    'end',
    '',
    'handler:register()'
  ].join("\n"),
  byteSend: [
    'local out = NetworkMessage(player)',
    'out:addByte(0xA3)',
    'out:addByte(1)',
    'out:addU16(player:getLevel())',
    'out:addString(player:getName())',
    'out:sendToPlayer(player)'
  ].join("\n"),
  clientBytesCpp: [
    'void ProtocolGame::sendAstraHello(uint8_t action, const std::string& text)',
    '{',
    '    auto msg = std::make_shared<OutputMessage>();',
    '    msg->addU8(0xA2);',
    '    msg->addU8(action);',
    '    msg->addString(text);',
    '    send(msg);',
    '}'
  ].join("\n"),
  oldJson: [
    'protocolGame:sendExtendedOpcode(50, json.encode({',
    '  action = "open",',
    '  page = 1,',
    '  filter = "all"',
    '}))'
  ].join("\n"),
  packetContract: [
    'Opcode 0x5F client -> server',
    '',
    'U8 option',
    'if option == 2 then U8 difficulty end',
    'if option == 5 then U8 taskIndex end',
    'if option == 7 then U8 pathIndex end',
    'if option == 8 then U8 taskIndex end',
    'if option == 9 then U8 difficulty end',
    'if option == 11 then U8 offerIndex end',
    'if option in {12,13,14} then U16 slot end',
    'if option in {15,16} then U16 slot; U16 raceId end'
  ].join("\n"),
  clientParseLua: [
    'registerOpcode(ServerPackets.TaskBoard, function(protocol, msg)',
    '  local subType = msg:getU8()',
    '  if subType == 0 then',
    '    local state = msg:getU8()',
    '    local difficulty = msg:getU8()',
    '    -- continue lendo exatamente na ordem enviada pelo servidor',
    '  end',
    'end)'
  ].join("\n"),
  migrationTemplate: [
    '1. Escreva o contrato do payload em texto.',
    '2. Reserve opcode e direcao.',
    '3. Implemente writer server->client ou client->server.',
    '4. Implemente parser do outro lado na mesma ordem.',
    '5. Adicione NetworkGuard/cooldown/range check.',
    '6. Teste packet curto, packet grande e client sem suporte.',
    '7. Remova JSON antigo so depois de validar fallback.'
  ].join("\n"),
  prompt: [
    'Analise este script TFS linha por linha.',
    'Explique onde ele deve ficar, quais eventos registra,',
    'quais dados vindos do client precisam ser validados no servidor,',
    'e aponte risco de crash, leak, exploit ou erro de protocolo.',
    'No final, sugira um patch pequeno e testavel.'
  ].join("\n")
};

function page(title, lead, tags, sections) {
  return { title, lead, tags, sections };
}

function pathRows(rows) {
  return `<div class="path-list">${rows.map(([path, text]) => `
    <div class="path-row"><code>${path}</code><span>${text}</span></div>
  `).join("")}</div>`;
}

function tableRows(headers, rows) {
  return `<div class="table-wrap"><table class="data-table">
    <thead><tr>${headers.map(header => `<th>${header}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

function cardGrid(cards) {
  return `<div class="card-grid">${cards.map(([title, body]) => `
    <article class="mini-card"><h3>${title}</h3><p>${body}</p></article>
  `).join("")}</div>`;
}

const LANGS = ["pt", "en", "es"];

const UI = {
  pt: {
    home: "Inicio",
    tfs: "TFS",
    otclient: "OTClient",
    bytes: "Bytes reais",
    ai: "IA",
    menu: "Menu",
    search: "Buscar tutorial...",
    tutorial: "Tutorial",
    previous: "Anterior",
    next: "Proximo",
    copy: "Copiar",
    copied: "Copiado",
    select: "Selecione",
    languageTitle: "Idiomas",
    languageLead: "A base tecnica principal esta em PT-BR e cada pagina tem orientacao rapida em ingles e espanhol para leitura internacional.",
    footer: "Documentacao estatica criada a partir do workspace local em C:/Users/Mateus/Desktop/tutorial, do forge, da wiki oficial do Revscriptsys e dos repos GitHub do projeto.",
    markdown: "Docs Markdown"
  },
  en: {
    home: "Home",
    tfs: "TFS",
    otclient: "OTClient",
    bytes: "Real bytes",
    ai: "AI",
    menu: "Menu",
    search: "Search tutorial...",
    tutorial: "Tutorial",
    previous: "Previous",
    next: "Next",
    copy: "Copy",
    copied: "Copied",
    select: "Select",
    languageTitle: "Languages",
    languageLead: "The main technical body is PT-BR, with quick English and Spanish guidance on every page for international readers.",
    footer: "Static documentation generated from the local workspace at C:/Users/Mateus/Desktop/tutorial, the forge folder, the official Revscriptsys wiki, and the project GitHub repositories.",
    markdown: "Markdown docs"
  },
  es: {
    home: "Inicio",
    tfs: "TFS",
    otclient: "OTClient",
    bytes: "Bytes reales",
    ai: "IA",
    menu: "Menu",
    search: "Buscar tutorial...",
    tutorial: "Tutorial",
    previous: "Anterior",
    next: "Siguiente",
    copy: "Copiar",
    copied: "Copiado",
    select: "Seleccione",
    languageTitle: "Idiomas",
    languageLead: "La base tecnica principal esta en PT-BR, con orientacion rapida en ingles y espanol en cada pagina para lectores internacionales.",
    footer: "Documentacion estatica creada desde el workspace local C:/Users/Mateus/Desktop/tutorial, la carpeta forge, la wiki oficial de Revscriptsys y los repositorios GitHub del proyecto.",
    markdown: "Docs Markdown"
  }
};

const NAV_LABELS = {
  en: {
    "logica-programacao": "Programming logic",
    "algoritmos-basicos": "Basic algorithms",
    "lua-iniciante": "Lua beginner",
    "cpp-iniciante": "C++ beginner",
    "como-usar-ia": "Using AI",
    "tfs-introducao": "TFS introduction",
    "tfs-estrutura-pastas": "Folder structure",
    "tfs-revscriptsys": "Revscriptsys",
    "tfs-actions": "Actions",
    "tfs-talkactions": "Talkactions",
    "tfs-creaturescripts": "Creaturescripts",
    "tfs-globalevents": "Globalevents",
    "tfs-movements": "Movements",
    "tfs-spells": "Spells",
    "tfs-database": "Database",
    "tfs-debug": "Debug and logs",
    "otclient-introducao": "OTClient introduction",
    "otclient-estrutura-pastas": "Client structure",
    "otclient-modules": "Modules",
    "otclient-otmod": ".otmod",
    "otclient-otui": ".otui",
    "otclient-lua": "Lua in the client",
    "otclient-criar-janela": "Create a window",
    "otclient-criar-botao": "Create a button",
    "otclient-sidebar": "Sidebar",
    "otclient-comunicacao-server": "Client/server communication",
    "astra-client": "AstraClient",
    "network-bytes-reais": "Real-byte network",
    "comparacao-tfs-canary-crystal": "TFS, Canary and Crystal",
    "boas-praticas": "Best practices",
    "relatorio-github": "Reports and logs",
    "forge-mapa": "Forge map",
    "sistemas-forge": "Forge systems",
    "tfs-arquitetura-avancada": "Advanced TFS architecture",
    "otclient-protocolo-avancado": "Advanced OTClient protocol",
    "network-opcodes-mapa": "Opcode map",
    "network-migracao-json-bytes": "JSON to bytes migration",
    "seguranca-servidor": "Server security",
    "build-run-debug": "Build, run and debug"
  },
  es: {
    "logica-programacao": "Logica de programacion",
    "algoritmos-basicos": "Algoritmos basicos",
    "lua-iniciante": "Lua inicial",
    "cpp-iniciante": "C++ inicial",
    "como-usar-ia": "Usar IA",
    "tfs-introducao": "Introduccion a TFS",
    "tfs-estrutura-pastas": "Estructura de carpetas",
    "tfs-revscriptsys": "Revscriptsys",
    "tfs-actions": "Actions",
    "tfs-talkactions": "Talkactions",
    "tfs-creaturescripts": "Creaturescripts",
    "tfs-globalevents": "Globalevents",
    "tfs-movements": "Movements",
    "tfs-spells": "Spells",
    "tfs-database": "Base de datos",
    "tfs-debug": "Debug y logs",
    "otclient-introducao": "Introduccion a OTClient",
    "otclient-estrutura-pastas": "Estructura del cliente",
    "otclient-modules": "Modulos",
    "otclient-otmod": ".otmod",
    "otclient-otui": ".otui",
    "otclient-lua": "Lua en el cliente",
    "otclient-criar-janela": "Crear ventana",
    "otclient-criar-botao": "Crear boton",
    "otclient-sidebar": "Sidebar",
    "otclient-comunicacao-server": "Comunicacion cliente/servidor",
    "astra-client": "AstraClient",
    "network-bytes-reais": "Red con bytes reales",
    "comparacao-tfs-canary-crystal": "TFS, Canary y Crystal",
    "boas-praticas": "Buenas practicas",
    "relatorio-github": "Reportes y logs",
    "forge-mapa": "Mapa del forge",
    "sistemas-forge": "Sistemas del forge",
    "tfs-arquitetura-avancada": "Arquitectura avanzada TFS",
    "otclient-protocolo-avancado": "Protocolo avanzado OTClient",
    "network-opcodes-mapa": "Mapa de opcodes",
    "network-migracao-json-bytes": "Migracion JSON a bytes",
    "seguranca-servidor": "Seguridad del servidor",
    "build-run-debug": "Build, ejecutar y debug"
  }
};

const GROUP_LABELS = {
  en: {
    "Fundamentos": "Foundations",
    "TFS": "TFS",
    "OTClient e AstraClient": "OTClient and AstraClient",
    "Arquitetura moderna": "Modern architecture",
    "Forge avancado": "Advanced forge"
  },
  es: {
    "Fundamentos": "Fundamentos",
    "TFS": "TFS",
    "OTClient e AstraClient": "OTClient y AstraClient",
    "Arquitetura moderna": "Arquitectura moderna",
    "Forge avancado": "Forge avanzado"
  }
};

function getLang() {
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get("lang");
  const stored = localStorage.getItem("astra-academy-lang");
  const lang = LANGS.includes(queryLang) ? queryLang : stored;
  return LANGS.includes(lang) ? lang : "pt";
}

function t(key) {
  const lang = getLang();
  return (UI[lang] && UI[lang][key]) || UI.pt[key] || key;
}

function navLabel(slug, fallback) {
  const lang = getLang();
  return (NAV_LABELS[lang] && NAV_LABELS[lang][slug]) || fallback;
}

function groupLabel(title) {
  const lang = getLang();
  return (GROUP_LABELS[lang] && GROUP_LABELS[lang][title]) || title;
}

function withLang(url) {
  const lang = getLang();
  return lang === "pt" ? url : `${url}?lang=${lang}`;
}

const PAGES = {
  "logica-programacao": page(
    "Logica de programacao",
    "Programar e dizer ao computador uma sequencia clara de decisoes. Em Open Tibia isso aparece em scripts de item, fala, login, combate, UI e protocolo.",
    ["Iniciante", "Base", "TFS"],
    [
      ["Para que serve", "<p>Antes de criar uma spell ou um module, voce precisa pensar em entrada, processamento e saida. Entrada pode ser um item usado, uma fala do player ou um byte recebido. Processamento e a regra. Saida e mensagem, efeito, item, packet ou mudanca de estado.</p>"],
      ["Exemplo real", pathRows([["data/scripts/talkactions/", "entrada por comando de chat"], ["data/scripts/network/", "entrada por packet/byte"], ["modules/game_*", "entrada por clique, hotkey ou evento do client"]])],
      ["Exercicio", "<p>Escreva em portugues a regra de um comando <code>/hello</code>: quando o player falar, o servidor responde uma mensagem e nao executa fala publica. Depois transforme cada frase em uma linha Lua.</p>"]
    ]
  ),
  "algoritmos-basicos": page(
    "Algoritmos basicos",
    "Um algoritmo e uma receita. No TFS, quase todo sistema e uma receita com validacao, busca de dados, alteracao e retorno.",
    ["Iniciante", "Algoritmos"],
    [
      ["Receita segura", "<ol><li>Validar quem chamou.</li><li>Validar dados recebidos.</li><li>Buscar estado atual.</li><li>Aplicar a regra.</li><li>Salvar ou responder.</li><li>Logar erro quando algo falhar.</li></ol>"],
      ["Exemplo", "<p>No quick loot, o servidor valida se o player existe, se tem container, se o item pode ser movido, se ha capacidade e so entao move o item. O client pode pedir, mas o servidor decide.</p>"],
      ["Erro comum", "<p>Comecar pela recompensa antes da validacao. Em servidor de jogo, isso abre exploit.</p>"]
    ]
  ),
  "lua-iniciante": page(
    "Lua iniciante para Open Tibia",
    "Lua no TFS serve para regras de jogo. Lua no OTClient serve para UI, eventos do client e cola entre botao, janela e protocolo.",
    ["Lua", "TFS", "OTClient"],
    [
      ["O basico", "<p><code>local</code> cria variavel local, <code>function</code> cria funcao, <code>return true</code> normalmente confirma que o evento foi tratado. Tabelas sao usadas como listas e mapas.</p>"],
      ["Onde aparece", pathRows([["data/scripts/", "scripts RevScriptSys do servidor"], ["data/lib/", "bibliotecas compartilhadas do servidor"], ["modules/*/*.lua", "logica dos modulos do client"], ["modules/corelib/", "funcoes base do client"]])],
      ["Boa pratica", "<p>Prefira variaveis locais, valide <code>nil</code>, retorne cedo quando a entrada for invalida e nao confie em dados vindos do client.</p>"]
    ]
  ),
  "cpp-iniciante": page(
    "C++ iniciante usado no TFS e OTClient",
    "C++ e a camada de motor: rede, mapa, entidades, render, Lua bindings e performance. Lua chama muita coisa que nasceu em C++.",
    ["C++", "Engine"],
    [
      ["Conceitos", "<p>Classe organiza dados e funcoes. Ponteiro aponta para objeto. Referencia evita copia. <code>shared_ptr</code> ajuda a controlar dono de objeto. Thread exige cuidado com acesso simultaneo.</p>"],
      ["Arquivos reais", pathRows([["src/protocolgame.cpp", "recebe e envia packets do jogo"], ["src/game.cpp", "coordena regras e chamadas principais"], ["src/luascript.cpp", "expoe funcoes C++ para Lua"], ["src/networkmessage.h", "representa leitura/escrita de bytes"]])],
      ["Erro comum", "<p>Guardar ponteiro cru sem saber quem e dono. Em TFS, objeto removido pode virar crash se outro sistema ainda usar referencia antiga.</p>"]
    ]
  ),
  "tfs-introducao": page(
    "Introducao ao TFS",
    "The Forgotten Server e o processo que mantem o mundo online: recebe conexoes, atualiza criaturas, executa scripts, salva banco e conversa com o client por protocolo.",
    ["TFS", "Servidor", "Iniciante"],
    [
      ["Mapa mental", "<p><strong>Game server</strong> e o programa que manda na verdade do jogo. O client desenha e pede acoes; o servidor valida e decide. O loop principal processa eventos, criaturas, combate, decay, save, rede e chamadas agendadas.</p>"],
      ["Pecas principais", pathRows([["Player", "jogador conectado ou carregado do banco"], ["Creature", "base para player, monster e NPC"], ["Monster", "criatura controlada pelo servidor"], ["Item", "objeto do mapa, inventario, container ou depot"], ["Tile/Map", "posicoes e coisas do mundo"], ["Game", "fachada central para regras do servidor"], ["ProtocolGame", "camada que transforma bytes em acoes e acoes em bytes"], ["LuaScriptInterface", "ponte entre C++ e scripts Lua"], ["Scheduler/Dispatcher", "fila trabalhos para rodar depois ou na thread certa"], ["Database", "persistencia de contas, players, storage, houses e itens"]])],
      ["Fluxo de login", "<p>O client conecta, envia dados de protocolo, o servidor valida versao/cliente, carrega account e player, registra eventos de login, envia estado inicial e comeca a aceitar packets. No seu fork ha guardas para OTClient/AstraClient e envio de features em <code>ProtocolGame::sendFeatures()</code>.</p>"],
      ["Onde estudar no repo", pathRows([["C:/Users/Mateus/Desktop/tutorial/forge/forgottenserver-downgrade-1.8-8.60/src/protocolgame.cpp", "entrada e saida do protocolo"], ["C:/Users/Mateus/Desktop/tutorial/forge/forgottenserver-downgrade-1.8-8.60/data/scripts/", "scripts RevScriptSys"], ["C:/Users/Mateus/Desktop/tutorial/forge/forgottenserver-downgrade-1.8-8.60/schema.sql", "modelo do banco"], ["C:/Users/Mateus/Desktop/tutorial/forge/forgottenserver-downgrade-1.8-8.60/config.lua", "configuracoes do servidor"]])],
      ["Debug", "<p>Leia o console no primeiro erro Lua. A linha do erro geralmente diz o arquivo e a funcao. Se for rede, confirme opcode, quantidade de bytes e se o client que recebeu e realmente AstraClient/OTClient.</p>"]
    ]
  ),
  "tfs-estrutura-pastas": page(
    "Estrutura de pastas do TFS",
    "A pasta do servidor separa motor C++, dados do jogo, scripts, banco, build e ferramentas.",
    ["TFS", "Estrutura"],
    [
      ["Pastas principais", pathRows([["src/", "codigo C++ do motor"], ["data/", "conteudo do jogo"], ["data/scripts/", "RevScriptSys e sistemas modernos"], ["data/actions/", "actions antigas registradas por XML"], ["data/creaturescripts/", "scripts de criatura/player antigos"], ["data/globalevents/", "eventos globais antigos"], ["data/movements/", "pisos, teleportes e movimentacao"], ["data/talkactions/", "comandos de fala antigos"], ["data/spells/", "magias"], ["data/events/", "callbacks centrais como Player:onNetworkMessage"], ["data/lib/", "bibliotecas Lua compartilhadas"], ["data/monster/", "monstros"], ["data/npc/", "NPCs"], ["data/items/", "items.xml e definicoes"], ["schema.sql", "estrutura do banco"], ["CMakeLists.txt", "entrada do build CMake"]])],
      ["Como escolher onde colocar", "<p>Sistema novo e autocontido: prefira <code>data/scripts/</code>. Bibliotecas reusaveis: <code>data/lib/</code>. Alteracao profunda de protocolo: precisa combinar <code>src/</code>, script de rede e client.</p>"],
      ["Exercicio", "<p>Crie uma lista com o caminho de cada arquivo que um sistema novo precisaria: config, script, lib, client module, protocolo e migration SQL se houver banco.</p>"]
    ]
  ),
  "tfs-revscriptsys": page(
    "Revscriptsys",
    "Revscriptsys registra scripts pelo proprio Lua. Voce coloca o arquivo em data/scripts e cria objetos como TalkAction, Action, CreatureEvent, GlobalEvent, MoveEvent, Spell ou Weapon.",
    ["TFS", "Lua", "Revscriptsys"],
    [
      ["O que e", "<p>A ideia oficial e evitar XML para scripts novos: o arquivo Lua contem o cabecalho, a funcao do evento e o <code>:register()</code>. Isso permite misturar actions, movements e globalevents no mesmo arquivo quando o sistema precisa.</p>"],
      ["Onde salvar", pathRows([["data/scripts/astra_hello.lua", "script novo e simples"], ["data/scripts/talkactions/", "quando quiser organizar comandos"], ["data/scripts/network/", "quando o evento vem do protocolo"], ["data/monster/", "monstros continuam em caminho proprio"]])],
      ["Exemplo completo", codeBlock("lua", "data/scripts/astra_hello.lua", SNIPPETS.revHello)],
      ["Linha por linha", "<p><code>TalkAction(\"/hello\")</code> cria o registrador. <code>onSay</code> e chamado quando o player usa a fala. <code>sendTextMessage</code> responde no console. <code>return false</code> evita que a fala apareca como texto normal. <code>:register()</code> liga o script no servidor.</p>"],
      ["Como testar", "<ol><li>Salve em <code>data/scripts/astra_hello.lua</code>.</li><li>Reinicie o servidor ou recarregue scripts se seu ambiente suportar.</li><li>Entre com um player e fale <code>/hello</code>.</li><li>Se falhar, leia o console procurando o caminho do arquivo e a linha.</li></ol>"],
      ["Antigo XML vs RevScript", "<p>No estilo antigo, voce adicionava uma linha em XML e apontava para um Lua. No RevScript, o proprio Lua registra palavra, itemid, actionid, intervalo ou evento. Menos arquivo espalhado, menos chance de esquecer XML.</p>"]
    ]
  ),
  "tfs-actions": page(
    "Actions",
    "Action roda quando o player usa um item. E ideal para alavanca, bau, scroll, porta, rune especial ou item de quest.",
    ["TFS", "Lua", "Action"],
    [
      ["Estrutura", codeBlock("lua", "data/scripts/actions/astra_action.lua", SNIPPETS.action)],
      ["Validacoes", "<p>Confira item correto, distancia, floor, storage do player, cooldown e se o target existe. O client pode mandar use errado; o servidor precisa negar sem crash.</p>"],
      ["Debug", "<p>Use mensagens temporarias para o player e logs no console. Remova prints barulhentos depois que estabilizar.</p>"]
    ]
  ),
  "tfs-talkactions": page(
    "Talkactions",
    "Talkaction e comando por fala. Serve para comandos de jogador, admin, teste e ferramentas de debug.",
    ["TFS", "Lua", "TalkAction"],
    [
      ["Exemplo", codeBlock("lua", "data/scripts/astra_hello.lua", SNIPPETS.revHello)],
      ["Cuidados", "<p>Comando de admin precisa checar group/access. Comando que recebe parametro precisa limpar espacos, validar numero e limitar tamanho.</p>"],
      ["Exercicio", "<p>Crie <code>/pos</code> que mostra x, y, z do player. Depois adicione uma checagem de access para transformar em comando de debug.</p>"]
    ]
  ),
  "tfs-creaturescripts": page(
    "Creaturescripts",
    "Creaturescripts escutam eventos de player ou criatura: login, logout, kill, death, health change, modal e extended opcode.",
    ["TFS", "Lua", "CreatureEvent"],
    [
      ["Uso comum", "<p>Registrar evento no login significa avisar ao servidor que aquela criatura deve chamar uma funcao quando algo acontecer. Exemplo: registrar evento de kill para contar task.</p>"],
      ["No seu fork", "<p><code>data/scripts/creaturescripts/others/extendedopcode.lua</code> registra <code>ExtendedOpcode</code> no login e marca cliente Mehah por storage quando recebe o opcode esperado.</p>"],
      ["Erro comum", "<p>Criar CreatureEvent mas esquecer de registrar no login quando o evento depende de player.</p>"]
    ]
  ),
  "tfs-globalevents": page(
    "Globalevents",
    "GlobalEvent roda em startup, shutdown, horario ou intervalo. Serve para rotinas do servidor e eventos globais.",
    ["TFS", "Lua", "GlobalEvent"],
    [
      ["Quando usar", "<p>Use para checar boss global, reset diario, broadcast, limpeza de cache ou rotinas que nao pertencem a um player especifico.</p>"],
      ["Cuidados", "<p>Nunca faca loop pesado a cada segundo sem necessidade. Prefira cache, tabelas e intervalos maiores.</p>"],
      ["Exercicio", "<p>Crie um GlobalEvent de startup que imprime uma mensagem dizendo que a Astra Academy carregou.</p>"]
    ]
  ),
  "tfs-movements": page(
    "Movements",
    "Movement roda quando criatura pisa, sai, equipa ou desequipa algo.",
    ["TFS", "Lua", "Movement"],
    [
      ["Exemplos", "<p>Teleport ao pisar em tile, area de protection, requisito de level, item que da bonus quando equipado.</p>"],
      ["Validacao", "<p>Confira se a criatura e player antes de chamar metodo de Player. Nem toda Creature tem tudo que Player tem.</p>"],
      ["Erro comum", "<p>Teleportar dentro do proprio evento sem validar destino livre pode prender player ou causar comportamento estranho.</p>"]
    ]
  ),
  "tfs-spells": page(
    "Spells",
    "Spell junta custo, palavras, vocacao, cooldown e efeito de combate.",
    ["TFS", "Lua", "Spell"],
    [
      ["Onde fica", pathRows([["data/scripts/spells/", "spells RevScriptSys"], ["data/spells/", "estrutura antiga e XML em forks que ainda usam"], ["src/spells.cpp", "motor C++ das spells"]])],
      ["Cuidados", "<p>Valide vocation, mana, level, premium e cooldown. Evite areas enormes com muitos efeitos em loop curto.</p>"],
      ["Debug", "<p>Teste com um player comum e com GOD. GOD pode ignorar restricoes e mascarar erro de configuracao.</p>"]
    ]
  ),
  "tfs-database": page(
    "Database no TFS",
    "Banco guarda contas, players, items persistentes, storage, houses, market e historicos.",
    ["TFS", "SQL", "Database"],
    [
      ["Arquivos", pathRows([["schema.sql", "estrutura inicial do banco"], ["src/database.cpp", "conexao e queries"], ["src/iologindata.cpp", "load/save do player"], ["data/scripts/talkactions/stress/stress_db.lua", "testes de stress DB no seu fork"]])],
      ["Boas praticas", "<p>Use escape para string, evite concatenar entrada do player em SQL, prefira transacao quando varios writes precisam acontecer juntos.</p>"],
      ["Relatorio local", "<p>O arquivo <code>forge/stress-test-results.html</code> mostra stress DB 11/11 e batch insert muito mais rapido que inserts individuais. Isso vira uma licao: medir antes de otimizar.</p>"]
    ]
  ),
  "tfs-debug": page(
    "Debug e logs do servidor",
    "Debug bom e ler o erro real antes de mexer. Console, logs, git diff e teste pequeno economizam horas.",
    ["TFS", "Debug", "Logs"],
    [
      ["Checklist rapido", "<ol><li>Veja o caminho e linha do erro.</li><li>Confirme se o arquivo carregou.</li><li>Confirme se a funcao existe nesse fork.</li><li>Teste com um comando minimo.</li><li>Rode <code>git status</code> antes de commitar.</li></ol>"],
      ["Relatorios locais", pathRows([["forge/codebase-audit-report.html", "auditoria com 47 achados"], ["forge/stress-test-results.html", "dupe, DB e NetworkMessage 31/31 pass"], ["AstraClient/otclientv8.log", "log local do client"], ["AstraClient/packet.log", "log de packets do client"]])],
      ["Erro comum", "<p>Ignorar warning porque o jogo ainda abriu. Warning de protocolo ou nil em widget costuma virar crash quando outro player faz um caminho diferente.</p>"]
    ]
  ),
  "otclient-introducao": page(
    "Introducao ao OTClient",
    "OTClient e o programa do jogador: desenha mapa e UI, recebe packets do servidor e envia acoes do usuario.",
    ["OTClient", "AstraClient", "Iniciante"],
    [
      ["Conceitos", pathRows([["module", "pasta com .otmod, .lua e as vezes .otui"], [".otmod", "manifesto que carrega scripts e define init/terminate"], [".otui", "layout de widgets"], ["g_ui", "cria e busca widgets"], ["g_game", "estado do jogo e protocolo"], ["g_map", "mapa local"], ["g_keyboard", "hotkeys"], ["ProtocolGame", "recebe/envia bytes do jogo"]])],
      ["Eventos importantes", "<p><code>onGameStart</code> roda quando o jogo inicia. <code>onGameEnd</code> limpa UI ao deslogar. <code>connect</code> registra callbacks e <code>disconnect</code> remove, evitando leak.</p>"],
      ["Repos analisados", pathRows([["forge/AstraClient/modules/", "modules modernos do AstraClient"], ["forge/mehah/modules/", "base Mehah com game_features e UI ampla"], ["forge/otclientv8 otacademy/modules/", "OTCv8 com extended JSON opcode"], ["forge/Otcv8--Classic-8.6/", "client classico 8.6"]])]
    ]
  ),
  "otclient-estrutura-pastas": page(
    "Estrutura de pastas do OTClient/AstraClient",
    "O client separa modules Lua/OTUI, assets, estilos, coisas do Tibia e codigo C++.",
    ["OTClient", "Estrutura"],
    [
      ["Pastas", pathRows([["modules/", "features carregadas no client"], ["modules/game_*", "features dentro do jogo"], ["modules/client_*", "features do client fora do jogo"], ["modules/corelib/", "biblioteca base Lua"], ["modules/gamelib/", "classes e protocolo em Lua"], ["data/images/", "imagens"], ["data/styles/", "styles compartilhados"], ["data/things/", "dat/spr/otfi"], ["init.lua", "bootstrap"], ["src/client/", "game, protocol, map, thing"], ["src/framework/", "janela, render, lua, plataforma"], ["src/protocol/", "camada de rede em alguns forks"]])],
      ["Arquivos de module", "<p><code>.otmod</code> registra. <code>.lua</code> executa. <code>.otui</code> desenha. <code>.otml</code> salva configuracao ou dados estruturados.</p>"],
      ["Exercicio", "<p>Abra um module pequeno em <code>modules/game_unjustifiedpoints</code> e identifique manifesto, init, terminate e registro de opcode.</p>"]
    ]
  ),
  "otclient-modules": page(
    "Modules do OTClient",
    "Module e uma feature isolada. Pense nele como uma mini aplicacao dentro do client.",
    ["OTClient", "Module", "Lua"],
    [
      ["Estrutura astra_hello", pathRows([["modules/astra_hello/astra_hello.otmod", "manifesto"], ["modules/astra_hello/astra_hello.lua", "logica"], ["modules/astra_hello/astra_hello.otui", "interface"]])],
      ["Manifesto", codeBlock("otmod", "astra_hello.otmod", SNIPPETS.moduleOtmod)],
      ["Logica", codeBlock("lua", "astra_hello.lua", SNIPPETS.moduleLua)],
      ["Interface", codeBlock("otui", "astra_hello.otui", SNIPPETS.moduleOtui)],
      ["Evitar leak", "<p>Toda janela criada com <code>g_ui.displayUI</code> deve ser destruida em <code>terminate()</code> ou no encerramento do jogo. Todo <code>connect</code> deve ter <code>disconnect</code> simetrico.</p>"]
    ]
  ),
  "otclient-otmod": page(
    ".otmod",
    "O .otmod diz ao client como carregar um module: nome, scripts, dependencias e callbacks de load/unload.",
    ["OTClient", ".otmod"],
    [
      ["Exemplo", codeBlock("otmod", "modules/astra_hello/astra_hello.otmod", SNIPPETS.moduleOtmod)],
      ["Campos", "<p><code>sandboxed: true</code> isola variaveis no ambiente do module. <code>scripts</code> lista Lua. <code>@onLoad</code> chama <code>init()</code>. <code>@onUnload</code> chama <code>terminate()</code>.</p>"],
      ["Erro comum", "<p>Nome do script no .otmod diferente do arquivo real. Em Windows pode passar despercebido em alguns casos, mas em deploy vira erro.</p>"]
    ]
  ),
  "otclient-otui": page(
    ".otui",
    ".otui descreve widgets. Ele parece CSS/OTML, mas cria hierarquia de UI do OTClient.",
    ["OTClient", ".otui", "UI"],
    [
      ["Exemplo", codeBlock("otui", "astra_hello.otui", SNIPPETS.moduleOtui)],
      ["Termos", "<p><code>MainWindow</code> e janela. <code>Label</code> mostra texto. <code>Button</code> executa clique. <code>anchors</code> prendem o widget em outro ponto. <code>margin</code> ajusta distancia.</p>"],
      ["Debug", "<p>Se a UI nao aparece, confira o id, o nome do arquivo no <code>displayUI</code> e se o module carregou sem erro no terminal do client.</p>"]
    ]
  ),
  "otclient-lua": page(
    "Lua no client",
    "Lua no client coordena UI, eventos e chamadas para o protocolo. Ele nao deve ser dono da regra segura do servidor.",
    ["OTClient", "Lua"],
    [
      ["APIs comuns", pathRows([["g_ui", "carrega e manipula widgets"], ["g_game", "estado do jogo e funcoes de protocolo"], ["g_keyboard", "hotkeys"], ["g_settings", "configuracoes locais"], ["ProtocolGame.registerOpcode", "handler para packet byte do servidor"], ["ProtocolGame.registerExtendedOpcode", "handler para extended opcode"]])],
      ["Boa pratica", "<p>Use client para experiencia visual. Use server para validar regra, recompensa, item, dinheiro, storage e cooldown.</p>"],
      ["Erro comum", "<p>Confiar que botao desabilitado impede exploit. O jogador pode modificar client ou mandar packet manual.</p>"]
    ]
  ),
  "otclient-criar-janela": page(
    "Criar janela no OTClient",
    "Uma janela simples precisa de .otui para desenho, Lua para carregar/destruir e .otmod para registrar.",
    ["OTClient", "UI", "Tutorial"],
    [
      ["Passo 1", "<p>Crie a pasta <code>modules/astra_hello/</code> no client.</p>"],
      ["Passo 2", codeBlock("otmod", "astra_hello.otmod", SNIPPETS.moduleOtmod)],
      ["Passo 3", codeBlock("otui", "astra_hello.otui", SNIPPETS.moduleOtui)],
      ["Passo 4", codeBlock("lua", "astra_hello.lua", SNIPPETS.moduleLua)],
      ["Teste", "<p>Abra o Module Manager e recarregue o module. Se editar <code>@onClick</code> ou anchors e ficar estranho, reinicie o client para eliminar cache de reload.</p>"]
    ]
  ),
  "otclient-criar-botao": page(
    "Criar botao",
    "Botao em OTUI chama uma funcao Lua. A funcao deve existir no ambiente do module.",
    ["OTClient", "UI"],
    [
      ["Exemplo", "<p>No <code>astra_hello.otui</code>, o botao usa <code>@onClick: modules.astra_hello.printHello()</code>. A funcao esta no <code>astra_hello.lua</code>.</p>"],
      ["Cuidados", "<p>Se o module for sandboxed, chame pelo nome do module quando usar evento no OTUI. Se for funcao local, conecte o clique pelo Lua depois de carregar a janela.</p>"],
      ["Exercicio", "<p>Adicione um segundo botao para esconder a janela chamando <code>modules.astra_hello.toggle()</code>.</p>"]
    ]
  ),
  "otclient-sidebar": page(
    "Icone na sidebar/topbar",
    "Muitos clients adicionam botoes pelo topmenu, sidebuttons ou mainpanel. O nome exato muda por fork.",
    ["OTClient", "UI"],
    [
      ["Onde olhar", pathRows([["modules/client_topmenu/", "top menu classico"], ["modules/game_sidebuttons/", "botoes laterais em AstraClient"], ["modules/game_mainpanel/", "painel principal"], ["modules/game_buttons/", "botoes de jogo"]])],
      ["Padrao", "<p>Crie o botao no init, conecte clique para toggle, destrua no terminate. Nao deixe botao duplicado apos reload.</p>"],
      ["Verificar no codigo", "<p>Como cada fork muda a API de top button, copie o padrao de um module vizinho do mesmo client antes de criar um helper novo.</p>"]
    ]
  ),
  "otclient-comunicacao-server": page(
    "Comunicacao client/server",
    "Client e server conversam por bytes do protocolo, extended opcode ou APIs nativas. Para sistema serio, prefira bytes reais quando o protocolo ja suporta.",
    ["OTClient", "TFS", "Protocolo"],
    [
      ["Tres caminhos", pathRows([["Packets nativos", "mais performatico e tipado, exige opcode e parser"], ["Extended opcode", "bom para prototipo e mensagens pequenas"], ["Extended JSON opcode", "facil, mas maior e mais caro para parsear"]])],
      ["Regra de seguranca", "<p>Client nao e confiavel. Mesmo que o client valide formulario, o servidor precisa validar tamanho, range, cooldown, permissao e estado atual.</p>"],
      ["Proximo passo", "<p>Leia a pagina Network bytes reais para ver o caminho <code>PacketHandler + NetworkGuard + NetworkMessage</code> do seu fork.</p>"]
    ]
  ),
  "astra-client": page(
    "AstraClient",
    "AstraClient e o OTClient do projeto, com modules modernos, protocolo binario para sistemas novos e guardas do lado servidor.",
    ["AstraClient", "OTClient", "Protocolo"],
    [
      ["Sinais encontrados", pathRows([["forge/AstraClient/modules/game_protocol/protocol.lua", "registra opcodes e le bytes do servidor"], ["forge/AstraClient/src/client/protocolgamesend.cpp", "envia opcodes como TaskBoardAction 0x5F"], ["forge/AstraClient/modules/game_things/things.lua", "carrega assets 8.60 e ativa features modernas quando necessario"], ["forge/forgottenserver-downgrade-1.8-8.60/src/astraclient.h", "identificacao/guardas Astra no servidor"]])],
      ["Astra vs OTC generico", "<p>No fork do servidor, opcodes Astra-only como task board, soulseal e item values so sao enviados para AstraClient. Isso evita quebrar clients que nao sabem ler esses bytes.</p>"],
      ["Boa pratica", "<p>Quando criar feature nova, documente opcode, direcao, payload, ranges e fallback para clients que nao suportam.</p>"]
    ]
  ),
  "network-bytes-reais": page(
    "Network: bytes reais em vez de JSON/opcode pesado",
    "Bytes reais reduzem overhead, evitam encode/decode JSON em gameplay quente e deixam contrato de protocolo mais claro. Eles exigem mais disciplina: tamanho, ordem e tipo precisam bater dos dois lados.",
    ["Network", "Bytes", "AstraClient", "TFS"],
    [
      ["O caminho real no seu fork", "<p>O fluxo local e: client envia opcode, <code>ProtocolGame::parsePacket</code> le o primeiro byte, chama <code>Game::parsePlayerNetworkMessage</code>, que dispara <code>Player:onNetworkMessage</code>. Esse callback procura <code>PacketHandlers[recvByte]</code>. O handler Lua le o restante com <code>NetworkGuard</code>.</p>"],
      ["Arquivos analisados", pathRows([["data/lib/core/packet_handler.lua", "PacketHandler e NetworkGuard"], ["data/events/scripts/player.lua", "Player:onNetworkMessage"], ["data/scripts/network/task_board/protocol.lua", "serializacao binaria do task board"], ["data/scripts/network/task_board/init.lua", "handler 0x5F"], ["src/luanetworkmessage.cpp", "NetworkMessage para Lua e guardas Astra-only"], ["src/protocolgame.cpp", "parsePacket, sendFeatures, extended opcode"], ["AstraClient/src/client/protocolgamesend.cpp", "sendTaskBoardAction usando OutputMessage"]])],
      ["Exemplo de handler servidor", codeBlock("lua", "data/scripts/network/astra_hello.lua", SNIPPETS.byteHandler)],
      ["Exemplo servidor para enviar bytes", codeBlock("lua", "NetworkMessage server -> client", SNIPPETS.byteSend)],
      ["Exemplo client em C++", codeBlock("cpp", "ProtocolGame::sendAstraHello", SNIPPETS.clientBytesCpp)],
      ["Comparacao com JSON", codeBlock("lua", "extended opcode com JSON", SNIPPETS.oldJson)],
      ["Quando usar JSON", "<p>JSON ainda e aceitavel para configuracao local, arquivo de settings, prototipo rapido e payload raro. Para gameplay frequente, lista grande, tracker, market, task board, quick loot e analyzer, bytes reais costumam ser melhores.</p>"],
      ["Checklist de seguranca", "<ol><li>Escolha opcode livre e documente direcao.</li><li>Leia sempre com <code>NetworkGuard.canRead/read*</code>.</li><li>Limite string com tamanho maximo.</li><li>Aplique cooldown por player/acao.</li><li>Valide <code>player:isUsingAstraClient()</code> quando o packet for Astra-only.</li><li>Nunca confie em itemId, raceId, slot, amount ou position vindos do client.</li></ol>"]
    ]
  ),
  "comparacao-tfs-canary-crystal": page(
    "Comparacao entre TFS, Canary e Crystal",
    "A melhor forma de portar ideia e entender o contrato, nao copiar arquivo inteiro.",
    ["TFS", "Canary", "Crystal"],
    [
      ["TFS classico", "<p>Base mais simples, muito conteudo antigo em XML e scripts separados. Bom para aprender fundamentos e compatibilidade.</p>"],
      ["TFS 1.8 downgrade 8.60", "<p>Seu fork mistura motor atualizado com protocolo/asset 8.60, RevScriptSys, scripts modernos em <code>data/scripts/network</code>, guardas AstraClient e relatorios de stress.</p>"],
      ["Canary", "<p>Estrutura moderna com <code>data-canary</code>, <code>data-otservbr-global</code>, metrics, tests e foco em protocolo atual. Bom para estudar organizacao e sistemas recentes.</p>"],
      ["Crystal Server", "<p>Estrutura proxima do Canary, com <code>data-crystal</code> e <code>data-global</code>. No seu fork ha comentarios de codigo portado do Crystal, como SoulPit sem JSON/extended opcode.</p>"],
      ["Port seguro", "<ol><li>Mapeie a feature e dependencias.</li><li>Compare enums/opcodes/storage/schema.</li><li>Adapte nomes reais do fork.</li><li>Crie teste minimo.</li><li>Nao copie sistema grande sem entender save, cooldown e protocolo.</li></ol>"]
    ]
  ),
  "boas-praticas": page(
    "Boas praticas",
    "Codigo bom em Open Tibia e o que voce entende, testa, consegue debugar e nao quebra o servidor quando o client mente.",
    ["Boas praticas", "Seguranca"],
    [
      ["Regras", "<ul><li>Nunca copie codigo sem entender.</li><li>Teste em branch separada.</li><li>Use <code>git status</code> antes de commitar.</li><li>Faca commits pequenos.</li><li>Leia logs e warnings.</li><li>Separe client e server.</li><li>Nao misture UI com regra do servidor.</li><li>Valide tudo no servidor.</li><li>Nao confie em opcode nem packet vindo do client.</li><li>Evite memory leak em C++ e widget leak no OTClient.</li><li>Use smart pointer quando fizer sentido.</li><li>Evite raw pointer sem dono claro.</li><li>Nao salve dado sensivel sem necessidade.</li></ul>"],
      ["Performance", "<p>Evite <code>getSpectators</code> em loop quente sem necessidade. Quando um sistema roda sempre, prefira tabelas mantidas por eventos ou cache invalidado corretamente.</p>"],
      ["Protocolo", "<p>Documente cada byte. Um payload sem documentacao vira armadilha para o proximo dev.</p>"]
    ]
  ),
  "como-usar-ia": page(
    "Como usar IA para estudar e corrigir codigo",
    "IA ajuda muito, mas nao substitui compilacao, teste no jogo, leitura de logs e revisao do diff.",
    ["IA", "Estudo", "Debug"],
    [
      ["Como pedir", "<p>Peca explicacao linha por linha, riscos de crash/leak, caminho correto do arquivo, patch pequeno, plano de teste e lista de funcoes que precisam existir no fork.</p>"],
      ["Prompt base", codeBlock("text", "prompt para revisar script TFS", SNIPPETS.prompt)],
      ["Prompts uteis", "<ol><li>Explique este Lua linha por linha e diga onde salvar.</li><li>Explique este erro C++ e a causa mais provavel.</li><li>Crie um module OTClient com init/terminate seguros.</li><li>Revise este script TFS contra exploit de client.</li><li>Procure memory leak ou ponteiro sem dono.</li><li>Corrija UI quebrada sem alterar regra do servidor.</li><li>Documente este sistema para iniciante.</li></ol>"],
      ["Regra de ouro", "<p>Depois de aplicar qualquer sugestao: compile, rode, teste no jogo, leia logs e revise o diff.</p>"]
    ]
  ),
  "relatorio-github": page(
    "Relatorio, logs e estado dos repos",
    "Esta pagina resume o que foi encontrado no workspace e no historico local dos repos.",
    ["Git", "Relatorio", "Logs"],
    [
      ["Servidor", "<p><code>forgottenserver-downgrade-1.8-8.60</code> esta na branch <code>feature/atc-modern-systems</code>. O ultimo commit local visto foi <code>ed97bfad Fix task board and soulseal binary protocol guards (#100)</code>. Ha arquivos modificados no source do servidor, entao a documentacao nao altera esse repo.</p>"],
      ["AstraClient", "<p><code>AstraClient</code> tambem esta em <code>feature/atc-modern-systems</code>. O historico recente inclui <code>07eade4 feat: migrate task board & soulseal from JSON extended opcodes to binary protocol (#45)</code> e <code>274c4b6 Fix Task Hunt store and Soul Seal integration (#46)</code>. Isso confirma a direcao de migrar sistemas quentes para bytes reais.</p>"],
      ["Relatorios locais", pathRows([["forge/codebase-audit-report.html", "auditoria completa com 47 findings"], ["forge/stress-test-results.html", "31/31 testes passando: dupe, DB e NetworkMessage"], ["AstraClient/packet.log", "log de packets do client"], ["AstraClient/otclientv8.log", "log runtime do client"]])],
      ["Resumo tecnico", "<p>O relatorio de stress local mostra NetworkMessage 11/11, com teste de 1M mensagens e delta de memoria pequeno. Isso nao prova que todo handler novo sera seguro, mas mostra que a base de NetworkMessage foi exercitada e e um caminho adequado quando usado com guardas.</p>"]
    ]
  )
};

PAGES["otclient-comunicacao-server"].sections.push(["Exemplo recomendado", codeBlock("lua", "handler byte real", SNIPPETS.byteHandler)]);

function simplePage(slug, title, lead, tags, where, files, example, debug, next) {
  PAGES[slug] = page(title, lead, tags, [
    ["Para que serve", `<p>${lead}</p>`],
    ["Onde fica", pathRows(where)],
    ["Arquivos envolvidos", pathRows(files)],
    ["Exemplo real", `<p>${example}</p>`],
    ["Erros comuns", `<p>O erro mais comum e usar o caminho certo com a API errada do fork. Antes de copiar, procure um arquivo vizinho que faca algo parecido.</p>`],
    ["Como debugar", `<p>${debug}</p>`],
    ["Exercicio pratico", `<p>Crie uma versao minima, teste, leia o log e so depois adicione regra extra.</p>`],
    ["Proximo passo", `<p>${next}</p>`]
  ]);
}

simplePage(
  "otclient-sidebar",
  "Sidebar e botoes do client",
  "Botoes de sidebar/topbar servem para abrir e fechar modules sem comandos.",
  ["OTClient", "UI"],
  [["modules/game_sidebuttons/", "padrao AstraClient"], ["modules/client_topmenu/", "padrao classico"], ["modules/game_mainpanel/", "painel do jogo"]],
  [[".lua", "cria botao e callback"], [".otui", "define visual quando existir"], [".otmod", "carrega module"]],
  "No AstraClient, procure modules que ja adicionam botoes laterais e replique o padrao de create/destroy.",
  "Se duplicar botao a cada reload, faltou destruir no terminate.",
  "Volte para Modules e aplique o mesmo ciclo de init/terminate."
);

NAV_GROUPS.push({
  title: "Forge avancado",
  items: [
    ["31", "forge-mapa", "Mapa do forge"],
    ["32", "sistemas-forge", "Sistemas do forge"],
    ["33", "tfs-arquitetura-avancada", "Arquitetura TFS avancada"],
    ["34", "otclient-protocolo-avancado", "Protocolo OTClient avancado"],
    ["35", "network-opcodes-mapa", "Mapa de opcodes"],
    ["36", "network-migracao-json-bytes", "Migrar JSON para bytes"],
    ["37", "seguranca-servidor", "Seguranca do servidor"],
    ["38", "build-run-debug", "Build, run e debug"]
  ]
});

PAGES["tfs-revscriptsys"].sections.push(
  ["Referencia oficial resumida", tableRows(
    ["Metatable", "Quando usar", "Callbacks/metodos importantes"],
    [
      ["<code>Action()</code>", "Item usado pelo player.", "<code>onUse</code>, <code>id</code>, <code>aid</code>, <code>uid</code>, <code>allowFarUse</code>, <code>blockWalls</code>, <code>checkFloor</code>"],
      ["<code>CreatureEvent(\"name\")</code>", "Login, logout, kill, death, modal, text edit e extended opcode.", "<code>onLogin</code>, <code>onKill</code>, <code>onDeath</code>, <code>onModalWindow</code>, <code>onExtendedOpCode</code>"],
      ["<code>GlobalEvent(\"name\")</code>", "Startup, shutdown, horario e intervalos globais.", "<code>onStartup</code>, <code>onShutdown</code>, <code>onTime</code>, <code>onThink</code>, <code>interval</code>, <code>time</code>"],
      ["<code>MoveEvent()</code>", "Pisar, sair, equipar e remover item.", "<code>onStepIn</code>, <code>onStepOut</code>, <code>onEquip</code>, <code>onDeEquip</code>"],
      ["<code>Spell(\"name\")</code>", "Magias instantaneas e runas.", "<code>onCastSpell</code>, words, vocation, mana, cooldown, level"],
      ["<code>TalkAction(\"words\")</code>", "Comandos por fala.", "<code>onSay</code>, <code>separator</code>, access/group checks"],
      ["<code>Weapon(WEAPON_TYPE)</code>", "Armas customizadas.", "Tipo de arma, callbacks de ataque e regras de combate"],
      ["<code>MonsterType(\"name\")</code>", "Monstro criado por Lua.", "Atributos, loot, attacks, defenses, voices e eventos de monstro"]
    ]
  )],
  ["Padrao de arquivo completo", "<p>Um script RevScriptSys bom tem configuracao no topo, variaveis locais, callbacks pequenos, funcoes auxiliares privadas e <code>:register()</code> no final. Se o sistema precisa de Action + MoveEvent + GlobalEvent, manter no mesmo arquivo pode ser melhor do que espalhar em XML antigo.</p>"],
  ["Erros que quebram server", "<ul><li>Usar <code>player</code> sem confirmar que existe.</li><li>Retornar <code>false</code> em movement quando queria permitir passagem.</li><li>Criar item temporario com <code>Game.createItem</code> e nao mover nem remover.</li><li>Registrar mesmo item/actionid em dois scripts diferentes.</li><li>Copiar callback de outra versao do TFS com assinatura diferente.</li></ul>"]
);

PAGES["network-bytes-reais"].sections.push(
  ["Contrato real do Task Board 0x5F", codeBlock("text", "contrato client -> server", SNIPPETS.packetContract)],
  ["Mapa dos opcodes Astra vistos", tableRows(
    ["Opcode", "Direcao", "Uso", "Arquivo de referencia"],
    [
      ["<code>0x5F</code>", "Client -> server", "Task board action: abrir bounty, weekly, shop, soulseal, trocar dificuldade, comprar oferta.", "<code>data/scripts/network/task_board/init.lua</code> e <code>AstraClient/src/client/protocolgamesend.cpp</code>"],
      ["<code>0x53</code>", "Server -> client", "Task board data com subtipo bounty, weekly ou hunt shop.", "<code>data/scripts/network/task_board/protocol.lua</code>"],
      ["<code>0xBA</code>", "Server -> client", "Soul seals: saldo, criaturas, custo, estrelas e mastery.", "<code>data/scripts/network/task_board/protocol.lua</code>"],
      ["<code>0xEE</code>", "Server -> client", "Resource balance para task hunting, bounty points e soulseals.", "<code>TaskBoard.sendResourceBalance</code>"],
      ["Extended opcode", "Ambos", "Bom para compatibilidade e prototipo, mas mais pesado quando vira JSON frequente.", "<code>ProtocolGame::parseExtendedOpcode</code>"]
    ]
  )],
  ["Regra de ouro do parser", "<p>Quem escreve bytes define a ordem. Quem le precisa consumir a mesma ordem, mesmo tipo e mesmo tamanho. Se o servidor envia <code>U8, U16, string</code> e o client le <code>U16, U8, string</code>, todo o resto do packet fica deslocado.</p>"]
);

PAGES["boas-praticas"].sections.push(
  ["Checklist antes de merge", "<ol><li><code>git status</code> limpo ou entendido.</li><li>Diff revisado arquivo por arquivo.</li><li>Servidor compila quando houve C++.</li><li>Client abre sem erro no log.</li><li>Packet novo testado com payload minimo, maximo e invalido.</li><li>Feature testada com player comum, nao so GOD.</li><li>Documentacao atualizada com opcode, storage, config e caminhos.</li></ol>"],
  ["Performance no mundo real", "<p>Evite varrer mapa sem necessidade. <code>Game.getSpectators</code> e util, mas em loop quente pode virar custo alto. Para arenas, dungeons, trackers e zonas persistentes, mantenha tabelas atualizadas por eventos de entrada/saida e so recorra a scan quando for inicializar ou reparar estado.</p>"]
);

PAGES["forge-mapa"] = page(
  "Mapa do forge",
  "O forge e o laboratorio: servidores, clients, referencias, relatorios, logs e provas de como a arquitetura real do projeto esta andando.",
  ["Forge", "Repos", "Auditoria"],
  [
    ["Repos principais", tableRows(
      ["Caminho", "Papel", "O que estudar"],
      [
        ["<code>forge/forgottenserver-downgrade-1.8-8.60</code>", "Servidor principal TFS 1.8 downgrade 8.60.", "<code>src/protocolgame.cpp</code>, <code>src/game.cpp</code>, <code>data/scripts/network</code>, <code>data/lib/core</code>"],
        ["<code>forge/AstraClient</code>", "Client principal do projeto.", "<code>modules/game_protocol/protocol.lua</code>, <code>src/client/protocolgamesend.cpp</code>, <code>src/client/protocolgameparse.cpp</code>"],
        ["<code>forge/canary</code>", "Referencia moderna de servidor.", "Organizacao, eventos, sistemas recentes e padroes de CMake/testes"],
        ["<code>forge/crystalserver-main</code>", "Referencia moderna semelhante ao Canary.", "Sistemas modernos e contratos de protocolo"],
        ["<code>forge/mehah</code>", "Referencia OTClient/Mehah.", "InputMessage, OutputMessage, features e extended opcode"],
        ["<code>forge/otclientv8 otacademy</code>", "Referencia OTCv8.", "Extended JSON opcode, modules e comportamento de client"],
        ["<code>Ultralight_-_OTClient</code>", "Referencia visual/site local.", "UI estatica, layout e organizacao de assets"]
      ]
    )],
    ["Relatorios locais", pathRows([["forge/codebase-audit-report.html", "auditoria com 47 findings para guiar risco e prioridade"], ["forge/stress-test-results.html", "stress com 31/31 passando, incluindo NetworkMessage 11/11"], ["forge/AstraClient/otclientv8.log", "log runtime do client"], ["forge/AstraClient/packet.log", "log de packets quando presente"]])],
    ["Como usar esse mapa", "<p>Quando uma feature falhar, comece pelo repo dono da verdade. Regra de jogo mora no servidor. UI e clique moram no client. Contrato mora nos dois. Documento bom mostra os tres caminhos, nao so um print de tela.</p>"]
  ]
);

PAGES["sistemas-forge"] = page(
  "Sistemas do forge",
  "Os scripts em data/scripts/network mostram como sistemas grandes foram organizados no servidor: entrada por packet, validacao, modulo de dominio e envio de resposta.",
  ["Forge", "TFS", "Network"],
  [
    ["Inventario de sistemas", tableRows(
      ["Sistema", "Arquivo/pasta", "Tipo de aprendizado"],
      [
        ["Battle Pass", "<code>data/scripts/network/battlepass/battlepass.lua</code>", "Sistema grande com estado, premios e comunicacao com client."],
        ["Market", "<code>data/scripts/network/market/market.lua</code>", "Payload grande, filtros, compra/venda e risco de validacao."],
        ["Prey", "<code>data/scripts/network/prey_system/</code>", "Slots, reroll, custo, monstros e estado persistente."],
        ["Forge", "<code>data/scripts/network/forge/forge.lua</code>", "Feature complexa, custo, item, chance e resposta visual."],
        ["Wheel", "<code>data/scripts/network/wheel/wheel.lua</code>", "Arvore de pontos, estado e UI sincronizada."],
        ["Quick Loot", "<code>data/scripts/network/quickloot.lua</code>", "Sistema quente, bom para estudar performance e flags."],
        ["Task Board", "<code>data/scripts/network/task_board/</code>", "Exemplo mais claro de bytes reais sem JSON pesado."]
      ]
    )],
    ["Padrao de arquitetura", cardGrid([
      ["Entrada", "Um opcode ou evento chega no servidor. O servidor valida player, client, cooldown e tamanho."],
      ["Dominio", "O modulo de regra decide custo, recompensa, storage, banco e estado atual."],
      ["Resposta", "O servidor envia bytes, mensagem ou efeito. O client apenas renderiza o que recebeu."],
      ["Auditoria", "Toda feature quente precisa logavel, testavel e documentada por contrato."]
    ])],
    ["Como portar um sistema", "<ol><li>Leia config e storages.</li><li>Mapeie opcodes e payloads.</li><li>Procure dependencias em <code>data/lib</code>.</li><li>Compare enum/const no C++.</li><li>Teste a feature sem client modificado quando houver fallback.</li><li>So depois ajuste UI.</li></ol>"]
  ]
);

PAGES["tfs-arquitetura-avancada"] = page(
  "Arquitetura TFS avancada",
  "Para mexer em TFS com seguranca, pense em camadas: protocolo, dispatcher, Game, objetos de dominio, Lua bindings, banco e scripts.",
  ["TFS", "C++", "Arquitetura"],
  [
    ["Camadas", tableRows(
      ["Camada", "Responsabilidade", "Arquivos para ler"],
      [
        ["ProtocolGame", "Transforma bytes do client em chamadas de jogo e escreve respostas.", "<code>src/protocolgame.cpp</code>, <code>src/protocolgame.h</code>"],
        ["Game", "Orquestra regras centrais e agenda eventos de gameplay.", "<code>src/game.cpp</code>, <code>src/game.h</code>"],
        ["Player/Creature/Item", "Estado vivo do mundo.", "<code>src/player.cpp</code>, <code>src/creature.cpp</code>, <code>src/item.cpp</code>"],
        ["Lua bridge", "Expoe C++ para scripts.", "<code>src/luascript.cpp</code>, <code>src/luanetworkmessage.cpp</code>"],
        ["Scheduler/Dispatcher", "Executa trabalho no tempo ou thread correta.", "<code>src/scheduler.cpp</code>, <code>src/tasks.cpp</code>"],
        ["Database", "Carrega e persiste dados.", "<code>src/database.cpp</code>, <code>src/iologindata.cpp</code>"]
      ]
    )],
    ["Fluxo de um packet custom", "<p><code>ProtocolGame::parsePacket</code> le o primeiro byte. Se for um packet que o C++ nao trata diretamente, o fork encaminha para <code>Game::parsePlayerNetworkMessage</code>. O evento Lua <code>Player:onNetworkMessage</code> procura <code>PacketHandlers[recvByte]</code> e chama o handler registrado em <code>data/scripts/network</code>.</p>"],
    ["Thread e seguranca", "<p>Evite fazer regra pesada no lugar errado. Banco, save e operacoes longas precisam respeitar os padroes do projeto. Se o codigo atual usa dispatcher ou thread pool para uma area, siga o mesmo padrao.</p>"],
    ["Checklist C++", "<ul><li>Assinatura no header e implementacao batem.</li><li>Include minimo e sem dependencia circular.</li><li>Objeto acessado ainda esta vivo.</li><li>NetworkMessage nao le fora do buffer.</li><li>Lua binding valida stack e tipo.</li><li>Erro retorna sem derrubar processo.</li></ul>"]
  ]
);

PAGES["otclient-protocolo-avancado"] = page(
  "Protocolo OTClient avancado",
  "No client, protocolo bom separa envio, parse, signal e UI. O parser le bytes, emite evento, e o module decide como renderizar.",
  ["OTClient", "AstraClient", "Protocolo"],
  [
    ["Arquivos chave", pathRows([["AstraClient/modules/game_protocol/protocol.lua", "registro de opcodes e parsers Lua"], ["AstraClient/src/client/protocolgamesend.cpp", "envio C++ client -> server"], ["AstraClient/src/client/protocolgameparse.cpp", "parse C++ server -> client"], ["AstraClient/src/client/protocolcodes.h", "constantes de opcodes"], ["modules/gamelib/protocolgame.lua", "referencias OTC/Mehah de extended opcode e features"]])],
    ["Padrao de parse", codeBlock("lua", "registerOpcode no client", SNIPPETS.clientParseLua)],
    ["Separacao correta", cardGrid([
      ["Protocol", "Le bytes, monta tabelas simples e dispara signal."],
      ["Module", "Escuta signal, atualiza janela e controla botoes."],
      ["UI", "Define estrutura visual, ids e estilos."],
      ["State", "Cache pequeno, limpo em onGameEnd/terminate."]
    ])],
    ["Erros comuns", "<ul><li>Parser chamar widget diretamente e quebrar quando module nao carregou.</li><li>Registrar opcode duas vezes sem unregister.</li><li>Esquecer de desconectar signal no <code>terminate</code>.</li><li>Client ler <code>U16</code> onde o servidor enviou <code>U8</code>.</li><li>Usar JSON antigo em feature que roda toda hora.</li></ul>"]
  ]
);

PAGES["network-opcodes-mapa"] = page(
  "Mapa de opcodes",
  "Mapa vivo para documentar cada byte novo. Sem esse mapa, o protocolo vira tentativa e erro.",
  ["Network", "Opcode", "Documentacao"],
  [
    ["Tabela principal", tableRows(
      ["Opcode", "Nome", "Direcao", "Payload", "Guarda"],
      [
        ["<code>0x5F</code>", "TaskBoardAction", "Client -> server", "<code>U8 option</code> + campos opcionais por option.", "<code>player:isUsingAstraClient()</code> + <code>NetworkGuard</code>"],
        ["<code>0x53</code>", "TaskBoardData", "Server -> client", "<code>U8 subType</code> + bounty/weekly/shop.", "Apenas AstraClient"],
        ["<code>0xBA</code>", "SoulSeals", "Server -> client", "<code>U32 balance</code>, <code>U16 count</code>, entries.", "Apenas AstraClient"],
        ["<code>0xEE</code>", "ResourceBalance", "Server -> client", "resource type + amount.", "Apenas AstraClient"],
        ["<code>0x32</code>", "ExtendedOpcode", "Ambos", "Opcode interno + string buffer.", "OTC/Mehah/compat"]
      ]
    )],
    ["Como adicionar um opcode", "<ol><li>Escolha um valor livre e escreva nome constante.</li><li>Declare direcao e dono.</li><li>Documente payload em ordem.</li><li>Implemente writer.</li><li>Implemente parser.</li><li>Coloque guardas por client e tamanho.</li><li>Teste mismatch de versao.</li></ol>"],
    ["Formato de documento", codeBlock("text", "template de contrato", SNIPPETS.packetContract)]
  ]
);

PAGES["network-migracao-json-bytes"] = page(
  "Migrar JSON/extended opcode para bytes reais",
  "A migracao correta nao e trocar encode por addByte. E transformar uma mensagem flexivel em contrato tipado, validado e versionavel.",
  ["Network", "JSON", "Bytes"],
  [
    ["Quando migrar", tableRows(
      ["Sinal", "Por que importa", "Acao"],
      [
        ["Payload frequente", "JSON gera string maior e parse caro.", "Migrar para bytes."],
        ["Lista grande", "Market, task, wheel e trackers crescem rapido.", "Usar count + campos tipados."],
        ["Gameplay quente", "Atraso aparece para player.", "Evitar JSON e alocacao desnecessaria."],
        ["Prototipo raro", "Custo baixo e flexibilidade ajuda.", "JSON ainda pode ficar."],
        ["Compat legado", "Clients antigos talvez so entendam extended opcode.", "Manter fallback temporario."]
      ]
    )],
    ["Plano de migracao", codeBlock("text", "passos", SNIPPETS.migrationTemplate)],
    ["Antes e depois", tableRows(
      ["JSON", "Bytes reais"],
      [
        ["<code>{ action: \"buy\", offer: 4 }</code>", "<code>U8 option=11; U8 offerIndex=4</code>"],
        ["<code>{ difficulty: \"hard\" }</code>", "<code>U8 option=2; U8 difficulty=2</code>"],
        ["<code>{ slot: 3, raceId: 42 }</code>", "<code>U8 option=15; U16 slot=3; U16 raceId=42</code>"]
      ]
    )],
    ["Teste minimo", "<p>Teste payload vazio, payload curto, payload com bytes extras, valor fora do range, player sem AstraClient, reload de scripts e client desatualizado. O sucesso e o servidor ignorar com seguranca, nao crashar.</p>"]
  ]
);

PAGES["seguranca-servidor"] = page(
  "Seguranca do servidor",
  "O servidor e a autoridade. Todo dado de client deve ser tratado como sugestao, nunca como verdade.",
  ["Seguranca", "Anti exploit", "TFS"],
  [
    ["Ameacas comuns", tableRows(
      ["Entrada", "Risco", "Defesa"],
      [
        ["Opcode custom", "Packet curto, tipo errado, spam, valor impossivel.", "<code>NetworkGuard</code>, cooldown, ranges e client guard."],
        ["Item action", "Usar item fora de contexto, alvo invalido, hotkey indevida.", "Validar item, target, posicao, floor, storage e cooldown."],
        ["Shop/market", "Comprar sem saldo, quantidade negativa, race/item falso.", "Servidor calcula preco e disponibilidade."],
        ["Database", "SQL injection e save parcial.", "Escape, prepared style quando existir, transacao e rollback."],
        ["OTClient UI", "Botao escondido nao e permissao.", "Permissao sempre no servidor."]
      ]
    )],
    ["Padrao defensivo", "<ol><li>Retorne cedo quando <code>player</code> for invalido.</li><li>Verifique client/fork quando opcode for exclusivo.</li><li>Limite tamanho antes de ler string.</li><li>Converta numero e aplique min/max.</li><li>Cheque estado atual no servidor.</li><li>Logue erro suspeito sem vazar dado sensivel.</li></ol>"],
    ["Exemplo seguro", codeBlock("lua", "PacketHandler com NetworkGuard", SNIPPETS.byteHandler)]
  ]
);

PAGES["build-run-debug"] = page(
  "Build, run e debug",
  "Nao existe documentacao completa sem ciclo de validacao: compilar, rodar, abrir client, testar feature, ler log e revisar diff.",
  ["Build", "Debug", "Git"],
  [
    ["Fluxo recomendado", "<ol><li><code>git status --short --branch</code> antes de mexer.</li><li>Identificar repo certo: server, client ou docs.</li><li>Fazer patch pequeno.</li><li>Compilar quando tocar C++.</li><li>Rodar servidor e client.</li><li>Reproduzir a feature.</li><li>Ler console/log.</li><li>Commitar com mensagem clara.</li></ol>"],
    ["Logs para olhar", pathRows([["Servidor console", "erros Lua, warnings de script, crash e mensagens de startup"], ["AstraClient/otclientv8.log", "erro de module, OTUI, signal e widget"], ["AstraClient/packet.log", "ordem e conteudo dos packets quando habilitado"], ["forge/stress-test-results.html", "base de comparacao para stress DB/NetworkMessage"], ["GitHub Actions", "build limpo fora da maquina local"]])],
    ["Git limpo", "<p>O repo <code>Astra-Code-Academy</code> deve manter somente documentacao. Alteracoes em <code>forge/forgottenserver...</code> e <code>forge/AstraClient</code> ja existentes nao devem ser revertidas pela documentacao.</p>"],
    ["Quando pedir ajuda da IA", "<p>Inclua erro completo, caminho do arquivo, diff atual, versao do fork, packet/opcode quando houver e o comportamento esperado. Pedido bom economiza horas.</p>"]
  ]
);

function codeBlock(lang, title, code) {
  const escaped = escapeHtml(code);
  return `<div class="code-block"><div class="code-title"><span>${title}</span><button class="copy-btn" type="button">${t("copy")}</button></div><pre><code data-lang="${lang}">${escaped}</code></pre></div>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function prefix() {
  return document.body.dataset.depth === "tutorial" ? "../" : "";
}

function flattenNav() {
  return NAV_GROUPS.flatMap(group => group.items.map(item => ({ group: group.title, num: item[0], slug: item[1], label: item[2] })));
}

function pageHref(slug) {
  return withLang(`${prefix()}tutorials/${slug}.html`);
}

function homeHref() {
  return withLang(`${prefix()}index.html`);
}

function languageHref(lang) {
  const current = window.location.pathname.split("/").pop() || "index.html";
  return lang === "pt" ? current : `${current}?lang=${lang}`;
}

function renderLanguageSwitch() {
  const current = getLang();
  return `<div class="language-switch" aria-label="Language">
    ${LANGS.map(lang => `<a class="lang-link ${current === lang ? "active" : ""}" href="${languageHref(lang)}" data-lang="${lang}">${lang.toUpperCase()}</a>`).join("")}
  </div>`;
}

function renderLanguagePanel(slug, data) {
  const title = navLabel(slug, data.title);
  return `<section class="language-panel">
    <h2>${t("languageTitle")}</h2>
    <p>${t("languageLead")}</p>
    <div class="summary-grid">
      <article><strong>PT</strong><p>${data.lead}</p></article>
      <article><strong>EN</strong><p>${title}: practical Open Tibia notes about ${data.tags.join(", ")}. Read paths, packet contracts, validation rules, and debug checklists before changing code.</p></article>
      <article><strong>ES</strong><p>${title}: notas practicas de Open Tibia sobre ${data.tags.join(", ")}. Lee rutas, contratos de packet, validaciones y checklists de debug antes de cambiar codigo.</p></article>
    </div>
  </section>`;
}

function renderTopbar(active) {
  return `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="${homeHref()}">
          <span class="brand-mark">A</span>
          <span><span class="brand-title">Astra Academy</span><span class="brand-subtitle">Open Tibia docs</span></span>
        </a>
        <nav class="topnav">
          <a href="${homeHref()}" class="${active === "home" ? "active" : ""}">${t("home")}</a>
          <a href="${pageHref("tfs-introducao")}" class="${active && active.startsWith("tfs") ? "active" : ""}">${t("tfs")}</a>
          <a href="${pageHref("otclient-introducao")}" class="${active && active.startsWith("otclient") ? "active" : ""}">${t("otclient")}</a>
          <a href="${pageHref("network-bytes-reais")}" class="${active === "network-bytes-reais" ? "active" : ""}">${t("bytes")}</a>
          <a href="${pageHref("como-usar-ia")}" class="${active === "como-usar-ia" ? "active" : ""}">${t("ai")}</a>
        </nav>
        ${renderLanguageSwitch()}
        <button class="menu-toggle" type="button" aria-label="${t("menu")}">${t("menu")}</button>
      </div>
    </header>
  `;
}

function renderSidebar(active) {
  return `
    <aside class="sidebar">
      <input class="sidebar-search" type="search" placeholder="${t("search")}" aria-label="${t("search")}">
      ${NAV_GROUPS.map(group => `
        <div class="sidebar-group">
          <p class="sidebar-title">${groupLabel(group.title)}</p>
          ${group.items.map(([num, slug, label]) => `
            <a class="sidebar-link ${active === slug ? "active" : ""}" href="${pageHref(slug)}" data-search="${(label + " " + navLabel(slug, label) + " " + group.title + " " + slug).toLowerCase()}">
              <span class="nav-num">${num}</span><span>${navLabel(slug, label)}</span>
            </a>
          `).join("")}
        </div>
      `).join("")}
    </aside>
  `;
}

function renderFooter() {
  const p = prefix();
  return `
    <footer class="footer">
      <div class="footer-inner">
        <strong>Astra Academy</strong>
        <p>${t("footer")}</p>
        <p><a href="${p}docs/00-introducao.md">${t("markdown")}</a> | <a href="https://github.com/otland/forgottenserver/wiki/Revscriptsys">Revscriptsys oficial</a> | <a href="https://github.com/Mateuzkl/forgottenserver-downgrade-1.8-8.60">Fork TFS 1.8 8.60</a></p>
      </div>
    </footer>
  `;
}

function renderArticle(slug) {
  const data = PAGES[slug];
  const article = document.getElementById("article");
  if (!article || !data) return;

  const displayTitle = navLabel(slug, data.title);
  document.title = `${displayTitle} - Astra Academy`;
  article.innerHTML = `
    <div class="content-header">
      <span class="eyebrow">${t("tutorial")}</span>
      <h1>${displayTitle}</h1>
      <p>${data.lead}</p>
      <div class="tag-row">${data.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
    </div>
    ${renderLanguagePanel(slug, data)}
    ${data.sections.map(([title, html], index) => `
      <section>
        <h2 id="sec-${index + 1}">${title}</h2>
        ${html}
      </section>
    `).join("")}
    ${renderPagination(slug)}
  `;
}

function renderPagination(slug) {
  const flat = flattenNav();
  const index = flat.findIndex(item => item.slug === slug);
  const prev = flat[index - 1];
  const next = flat[index + 1];
  return `
    <div class="pagination">
      ${prev ? `<a class="page-link" href="${pageHref(prev.slug)}"><span>${t("previous")}</span><strong>${navLabel(prev.slug, prev.label)}</strong></a>` : "<div></div>"}
      ${next ? `<a class="page-link next" href="${pageHref(next.slug)}"><span>${t("next")}</span><strong>${navLabel(next.slug, next.label)}</strong></a>` : "<div></div>"}
    </div>
  `;
}

function highlight() {
  document.querySelectorAll("pre code[data-lang]").forEach(code => {
    code.innerHTML = escapeHtml(code.textContent);
  });
}

function initCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const block = button.closest(".code-block");
      const text = block ? block.querySelector("code").textContent : "";
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = t("copied");
        setTimeout(() => { button.textContent = t("copy"); }, 1200);
      } catch {
        button.textContent = t("select");
      }
    });
  });
}

function initSearch() {
  const input = document.querySelector(".sidebar-search");
  if (!input) return;
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    document.querySelectorAll(".sidebar-link").forEach(link => {
      link.classList.toggle("hidden", query && !link.dataset.search.includes(query));
    });
  });
}

function initMenu() {
  const button = document.querySelector(".menu-toggle");
  if (!button) return;
  button.addEventListener("click", () => document.body.classList.toggle("sidebar-open"));
  document.querySelectorAll(".sidebar-link").forEach(link => {
    link.addEventListener("click", () => document.body.classList.remove("sidebar-open"));
  });
}

function mount() {
  const active = document.body.dataset.page || "home";
  const lang = getLang();
  localStorage.setItem("astra-academy-lang", lang);
  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  document.getElementById("topbar-slot").innerHTML = renderTopbar(active);
  document.getElementById("sidebar-slot").innerHTML = renderSidebar(active);
  const footer = document.getElementById("footer-slot");
  if (footer) footer.innerHTML = renderFooter();
  renderArticle(active);
  highlight();
  initCopyButtons();
  initSearch();
  initMenu();
}

document.addEventListener("DOMContentLoaded", mount);
