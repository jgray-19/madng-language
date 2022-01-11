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
function transformGrammarRule(rule, propertyNames, transformProperty) {
    for (var _i = 0, propertyNames_1 = propertyNames; _i < propertyNames_1.length; _i++) {
        var propertyName_1 = propertyNames_1[_i];
        var value = rule[propertyName_1];
        if (typeof value === 'string') {
            rule[propertyName_1] = transformProperty(value);
        }
    }
    for (var propertyName in rule) {
        var value = rule[propertyName];
        if (typeof value === 'object') {
            transformGrammarRule(value, propertyNames, transformProperty);
        }
    }
}
function transformGrammarRepository(grammar, propertyNames, transformProperty) {
    var repository = grammar.repository;
    for (var key in repository) {
        transformGrammarRule(repository[key], propertyNames, transformProperty);
    }
}
function getLuaGrammar(getVariables) {
    var luaGrammarBeforeTransformation = readJson('lua.tmLanguage.json');
    return updateGrammarVariables(luaGrammarBeforeTransformation, getVariables(luaGrammarBeforeTransformation.variables));
}
function replacePatternVariables(pattern, variableReplacers) {
    var result = pattern;
    for (var _i = 0, variableReplacers_1 = variableReplacers; _i < variableReplacers_1.length; _i++) {
        var _a = variableReplacers_1[_i], variableName = _a[0], value = _a[1];
        result = result.replace(variableName, value);
    }
    return result;
}
function updateGrammarVariables(grammar, variables) {
    delete grammar.variables;
    var variableReplacers = [];
    for (var variableName in variables) {
        // Replace the pattern with earlier variables
        var pattern = replacePatternVariables(variables[variableName], variableReplacers);
        variableReplacers.push([new RegExp("{{" + variableName + "}}", "gim"), pattern]);
    }
    transformGrammarRepository(grammar, ["begin", "end", "match"], function (pattern) { return replacePatternVariables(pattern, variableReplacers); });
    return grammar;
}
function buildGrammar() {
    var luaGrammar = getLuaGrammar(function (grammarVariables) { return grammarVariables; });
    // Write TypeScript.tmLanguage
    writePlistFile(luaGrammar, 'Syntaxes/Lua.plist');
}
buildGrammar();
