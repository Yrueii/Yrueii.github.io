# Mindustry Logic documentation

## Translation Contribution
To contribute a translation:

1. Create a new JSON file in the `Languages/i18n/` directory named after the language code (e.g., `fr.json` for French)
2. Copy the structure from the English translation file (`en.json`)
3. Update `index.json` to include an entry with:
    - `lang_code`: the file name without extension
    - `language`: the display name of the language
4. Translate the JSON values only—do not modify the keys
5. Avoid using hyphens in keys; use underscores or camelCase instead if keys modifications are needed

Example entry in `index.json`:
```json
{ "lang_code": "fr", "language": "Français" }
```

Translation text data often uses inline formatting, in the form of tokens `{type:key:extra}`, example:
```yaml
strings:
    title: Strings
    content: "a sequence of characters, different from {link:variables:#variables}."
    variables: Variables
```
if possible do not change the value inside of these, you can move them if needed, if modifying is necessary please read [Formatting & Tokens](Docs/TranslationDocs.md)