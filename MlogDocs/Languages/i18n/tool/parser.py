import re
import time
import pyperclip
import keyboard

patterns = {
    "<img": (
        re.compile(
            r'<img[^>]*src="([^"]+)"[^>]*'
            r'(?:style="[^"]*max-width:\s*([^;!"]+))?[^>]*'
            r'(?:height="(\d+))?'
        ),
        lambda m: (
            f'{{img:{m.group(1)}:mwidth{m.group(2)}}}'
            if m.group(2)
            else f'{{img:{m.group(1)}:height{m.group(3)}}}'
            if m.group(3)
            else f'{{img:{m.group(1)}}}'
        )
    ),
    "<code": (
        re.compile(r'<code(?:\s+class="([^"]+)")?>([^<]+)</code>'),
        lambda m: (
            f'{{code:{m.group(2)}:{m.group(1)}}}'
            if m.group(1)
            else f'{{code:{m.group(2)}}}'
        )
    ),
    "<span": (
        re.compile(r'<span[^>]*style="[^"]*color:\s*([^;"]+)[^"]*">([^<]+)</span>'),
        lambda m: f'{{hl:_{m.group(2)}:{m.group(1)[:3]}}}'
    ),
    "<a": (
        re.compile(r'<a\s+href="([^"]+)"\s*>([^<]+)</a>'),
        lambda m: f'{{link:{m.group(2)}:{m.group(1)}}}'
    ),
    "<b": (
        re.compile(r'<b>([^<]+)</b>'),
        lambda m: f'{{b:{m.group(1)}}}'
    ),
}

def transform(s):
    for prefix, (pattern, repl) in patterns.items():
        if s.lstrip().startswith(prefix):
            m = pattern.search(s)
            if m:
                return repl(m)
            break
    return s

def handler():
    keyboard.press_and_release("ctrl+c")
    time.sleep(0.05)

    s = pyperclip.paste()
    print(s)
    result = transform(s)

    pyperclip.copy(result)
    time.sleep(0.05)
    keyboard.press_and_release("ctrl+v")

keyboard.add_hotkey("ctrl+f1", handler)
keyboard.wait()