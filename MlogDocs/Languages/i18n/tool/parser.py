import re
import pyperclip

patterns = {
    "<img": (
        re.compile(r'<img[^>]*src="([^"]+)"[^>]*style="[^"]*max-width:\s*([^;!"]+)'),
        lambda m: f'{{img:{m.group(1)}:mwidth{m.group(2)}}}'
    ),
    "<code": (
        re.compile(r'<code\s+class="([^"]+)">([^<]+)</code>'),
        lambda m: f'{{code:{m.group(2)}:{m.group(1)}}}'
    ),
    "<span": (
        re.compile(r'<span[^>]*style="[^"]*color:\s*([^;"]+)[^"]*">([^<]+)</span>'),
        lambda m: f'{{hl:_{m.group(2)}:{m.group(1)[:3]}}}'
    ),
    "<a": (
        re.compile(r'<a\s+href="([^"]+)"\s*>([^<]+)</a>'),
        lambda m: f'{{link:{m.group(2)}:{m.group(1)}}}'
    ),

}

while True:
    try:
        s = input().strip()
    except EOFError:
        break

    result = s

    for prefix, (pattern, repl) in patterns.items():
        if s.startswith(prefix):
            m = pattern.search(s)
            if m:
                result = repl(m)
            break

    print(result)
    pyperclip.copy(result)
