## Token Format
```{type:key:extra}```

```
type   > Resolver name (determines what is rendered)
key    > Lookup key or value passed to the resolver
         The key always uses the key from the same section
extra  > Optional modifier (id, class, color, URL, etc.)
```

### Examples:

```yaml
strings:
    title: Strings
    content: |
        A sequence of characters, 
        different from {link:variables:#variables}
    variables: Variables
```
In this example, `link` is the type of token,  
`variables` is a key from the same section (in this case `strings:`),  
and `#variables` is the extra argument, in this case (link type) the extra argument are used for href.  
So in HTML, it is parsed to:
```html
<a href="#variables">Variables</a>
```

### List of Supported Tokens:

```yaml
{br}                    > Line break
<br>

{link:docs}             > Link using key "docs".
{link:docs:https://...} > Link with explicit URL
{link:docs:#...}        > Link with hash link
<a href="{extra}">{docs Value}</a>

{code:docs}             > Plain <code> element
{code:docs:yel}         > <code> with yellow text coloring
{code:docs:key}         > <code> with 'key' class
-                         Visually makes the text look like a key on 
-                         a keyboard
{code:docs:contentname} > <code> with 'content-name' class
-                         Applies black background
-                         Mindustry Font
-                         Light yellow coloring
<code class="{extra}">{docs Value}</code>

{b:docs}                > Bold
<b>{docs Value}<b>

{hl:docs:yel}           > Highlight docs in yellow
<span style="color:yellow;">{docs Value}</span>
```