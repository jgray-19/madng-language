"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var plist = require("plist");
function writePlistFile(grammar, fileName) {
    var text = plist.build(grammar);
    fs.writeFileSync(fileName, text);
}
function readJson(fileName) {
    var text = fs.readFileSync(fileName, "utf8");
    return JSON.parse(text);
}
function getLuaGrammar() {
    var luaGrammar = readJson('lua.tmLanguage.json');
    return luaGrammar;
}
function buildGrammar() {
    var luaGrammar = getLuaGrammar();
    // Write TypeScript.tmLanguage
    writePlistFile(luaGrammar, 'Syntaxes/Lua.plist');
}
buildGrammar();
