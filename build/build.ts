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

function transformGrammarRule(rule: any, propertyNames: string[], transformProperty: (ruleProperty: string) => string) {
    for (const propertyName of propertyNames) {
        const value = rule[propertyName];
        if (typeof value === 'string') {
            rule[propertyName] = transformProperty(value);
        }
    }

    for (var propertyName in rule) {
        const value = rule[propertyName];
        if (typeof value === 'object') {
            transformGrammarRule(value, propertyNames, transformProperty);
        }
    }
}

function transformGrammarRepository(grammar: TmGrammar, propertyNames: string[], transformProperty: (ruleProperty: string) => string) {
    const repository = grammar.repository;
    for (let key in repository) {
        transformGrammarRule(repository[key], propertyNames, transformProperty);
    }
}

function getLuaGrammar(getVariables: (luaGrammarVariables: MapLike<string>) => MapLike<string>) {
    const luaGrammarBeforeTransformation = readJson('lua.tmLanguage.json') as TmGrammar;
    return updateGrammarVariables(luaGrammarBeforeTransformation, getVariables(luaGrammarBeforeTransformation.variables as MapLike<string>));
}

function replacePatternVariables(pattern: string, variableReplacers: VariableReplacer[]) {
    let result = pattern;
    for (const [variableName, value] of variableReplacers) {
        result = result.replace(variableName, value);
    }
    return result;
}

type VariableReplacer = [RegExp, string];
function updateGrammarVariables(grammar: TmGrammar, variables: MapLike<string>) {
    delete grammar.variables;
    const variableReplacers: VariableReplacer[] = [];
    for (const variableName in variables) {
        // Replace the pattern with earlier variables
        const pattern = replacePatternVariables(variables[variableName], variableReplacers);
        variableReplacers.push([new RegExp(`{{${variableName}}}`, "gim"), pattern]);
    }
    transformGrammarRepository(
        grammar,
        ["begin", "end", "match"],
        pattern => replacePatternVariables(pattern, variableReplacers)
    );
    return grammar;
}

function buildGrammar() {
    const luaGrammar = getLuaGrammar(grammarVariables => grammarVariables);

    // Write TypeScript.tmLanguage
    writePlistFile(luaGrammar, 'Syntaxes/Lua.plist');
}

buildGrammar();
