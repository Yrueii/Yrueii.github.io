## Token format
```{type:key:extra}```

```
type   > resolver name (determines what is rendered)
key    > lookup key or value passed to the resolver
         key always uses the key on the same section
extra  > optional modifier (id, class, color, URL, etc.)
```

list of supported tokens:

```yaml
{br}                    > line break

{link:docs}             > link using key "docs".
{link:docs:https://...} > link with explicit URL
{link:docs:#...}        > link with hash link

{code:docs}             > plain <code> element
{code:docs:yel}         > <code> with yellow text coloring
{code:docs:key}         > <code> with 'key' class
                          visually makes the text looks like a key on 
                          a keyboard
{code:docs:contentname} > <code> with 'content-name' class
                          apply black background
                          Mindustry Font
                          light yellow coloring
                        
{b:docs}                > Bold

{hl:text:yel}           > highlight "text" in yellow
```