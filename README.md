# Origin

This project is essentially a copy of the default `Lua` grammar for `VSCode`. This is forked from https://github.com/sumneko/lua.tmbundle. The main file that has been kept and minorly modified is Syntaxes/lua.tmLanguage.json, now converted to Syntaxes/mad.tmLanguage.json. Most other files have been deleted or heavily modified, see this [commit](https://github.com/jgray-19/madng-language/commit/dfd270e83154f82ebb9ad50719c6499d73db9473).  

The language configuration for MAD-NG has been directly copied from https://github.com/microsoft/vscode/blob/main/extensions/lua/language-configuration.json at this [commit](https://github.com/microsoft/vscode/commit/e9bb8b306c94be2d66ec64f2da186e58399a08fd)

# Changes for MAD-NG

- Adds `!` as a comment
- Allows 1..2 and 1.0..2.0 to be highlighted as integers and floats respectively
- Adds a tab indentation after the syntax \a, b, c => 
