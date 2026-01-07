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
        different from {link:var:#variables}
    var: Variables
```
In this example, `link` is the type of token,  
`var` is a key from the same section (in this case `strings:`), will get the value of that key and insert it,  
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
{code:docs:yel}         > <code> with class of 'yel'
<code class="{extra}">{docs Value}</code>
list of common class
yel = Highlight the text in yellow
variable = apply mindustry font, black background, light blue text

{b:docs}                > Bold
<b>{docs Value}<b>

{hl:docs:yel}           > Highlight docs in yellow
<span style="color:yellow;">{docs Value}</span>

{img:link:class}        > Insert an image
                          Image token doesn't need a key
                          link will be directly taken from :link:
<img src="{link}" class={class}>

```