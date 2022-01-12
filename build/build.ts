import fs = require('fs');
import plist = require('plist');

function writePlistFile(grammar: TmGrammar | TmTheme, fileName: string) {
    const text = plist.build(grammar);
    fs.writeFileSync(fileName, text);
}

function readJson(fileName: string) {
    const text = fs.readFileSync(fileName, "utf8");
    return JSON.parse(text);
}

function getLuaGrammar() {
    const luaGrammar = readJson('lua.tmLanguage.json') as TmGrammar;
    return luaGrammar;
}

function buildGrammar() {
    const luaGrammar = getLuaGrammar();

    // Write TypeScript.tmLanguage
    writePlistFile(luaGrammar, 'Syntaxes/Lua.plist');
}

buildGrammar();
