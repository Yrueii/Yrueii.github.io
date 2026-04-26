// #################################################################################################################
// renderTextWithTokens takes a string with tokens in the form {type:name:extra} and renders it into the given element, replacing tokens with the output of their respective resolvers. It also includes detailed error handling and logging for debugging issues with token resolution.

function renderTextWithTokens(el, text, sectionData, _debugPath) {
  const frag = document.createDocumentFragment();
  const regex = /(?<!\\)\{(\w+)(?::([^:}]+)(?::([^}]+))?)?\}/g;
  const pureregex = /(?<!\\)\{pure:([^}]+)\}/g;

  let last = 0;
  let m;

  while ((m = regex.exec(text))) {
    frag.append(text.slice(last, m.index).replace(/\\([{}])/g, '$1'));
    let [fullMatch, type, name, extra] = m;
    if (type === 'pure') {
      const pureMatch = pureregex.exec(fullMatch);
      if (pureMatch) {
        fullMatch = pureMatch[0];
        name = pureMatch[1];
        type = 'pure';
      };
    }
    const tokenPos = m.index;

    // ── Resolve ────────────────────────────────────────────────────────────
    const resolver = tokenResolvers[type];
    if (!resolver) {
      console.error(
        `[i18n] Unknown token type "${type}"\n` +
        `  key   : ${_debugPath ?? '(unknown)'}\n` +
        `  token : ${fullMatch}\n` +
        `  offset: char ${tokenPos} in value\n` +
        `  value : ${text}`
      );
      frag.append(fullMatch); // render raw so page doesn't silently break
      last = regex.lastIndex;
      continue;
    }

    let resolved;
    try {
      resolved = resolver(
        ...(name  ? [name]        : []),
        ...(sectionData ? [sectionData] : []),
        ...(extra ? [extra]       : [])
      );
      if (resolved && resolved.delete) {
        const depth = resolved.depth || 0;
        let top = el;
        for (let i = 0; i < depth; i++) {
          top = top.parentElement;
        }
        if (resolved.sibling) {
          const split = resolved.sibling.split(' ');
          const dist = parseInt(split[0], 10) || 0;
          const mode = split[1] || '';
          let siblingEl = top;
          let siblingList = [];
          for (let i = 0; i < Math.abs(dist); i++) {
            siblingEl = dist > 0 ? siblingEl.nextElementSibling : siblingEl.previousElementSibling;
            if (!siblingEl){
              break;
            }
            siblingList.push(siblingEl);
          }
          if (siblingList.length > 0) {
            if (mode == 'cascade') {
              siblingList.forEach(sib => {
                sib.classList.add('hidden');
                console.info(`[i18n] Hidden sibling element at distance ${dist} from element at depth ${depth} for token "${fullMatch}" in key "${_debugPath ?? '(unknown)'}"`);
              });
            } else {
              siblingList[siblingList.length - 1].classList.add('hidden');
              console.info(`[i18n] Hidden sibling element at distance ${dist} from element at depth ${depth} for token "${fullMatch}" in key "${_debugPath ?? '(unknown)'}"`);
            }
          }
        }
        top.classList.add('hidden');
        console.info(`[i18n] Hidden element at depth ${depth} for token "${fullMatch}" in key "${_debugPath ?? '(unknown)'}"`);
        last = regex.lastIndex;
        continue;
      }
    } catch (err) {
      // Determine likely cause
      let hint = '';
      if (name && sectionData && !(name in sectionData)) {
        hint = `\n  hint  : key "${name}" not found in sectionData — available keys: [${Object.keys(sectionData).join(', ')}]`;
      } else if (!name && ['link','code','hl','b','span','p'].includes(type)) {
        hint = `\n  hint  : token type "${type}" requires a name argument`;
      } else if (!extra && ['link','img','video','span','p'].includes(type)) {
        hint = `\n  hint  : token type "${type}" requires an extra argument`;
      }

      console.error(
        `[i18n] Token resolver threw for type "${type}"\n` +
        `  key   : ${_debugPath ?? '(unknown)'}\n` +
        `  token : ${fullMatch}\n` +
        `  offset: char ${tokenPos} in value\n` +
        `  name  : ${name ?? '(none)'}\n` +
        `  extra : ${extra ?? '(none)'}\n` +
        `  error : ${err.message}` +
        hint
      );
      frag.append(fullMatch);
      last = regex.lastIndex;
      continue;
    }

    if (resolved instanceof Element && resolved.textContent) {
      const nested = resolved.textContent;
      const nestedRegex = /(?<!\\)\{(\w+)(?::([^:}]+)(?::([^}]+))?)?\}/;
      if (nestedRegex.test(nested)) {
        renderTextWithTokens(resolved, nested, sectionData, _debugPath);
      }
    }

    frag.append(resolved);
    last = regex.lastIndex;
  }
  frag.append(text.slice(last).replace(/\\([{}])/g, '$1'));
  el.replaceChildren(frag);
}

// ####################################################################################################
// Token resolvers take arguments (name, sectionData, extra) depending on the token type, and return either a string or a DOM element to be rendered in place of the token. If a resolver throws an error, the raw token will be rendered and an error will be logged to the console with details for debugging.

const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');

const tokenResolvers = {
  link(name, sectionData, extra) {
    const el = document.createElement("a");
    el.href = `${extra}`;
    el.textContent = sectionData[name];
    // el.addEventListener('click', triggerGlow);
    return el;
  },
  hl(name, sectionData, extra) {
    const el = document.createElement("span");
    switch (extra) {
      case "yel":
        el.style.color = "yellow";
        break;
      case "red":
        el.style.color = "red";
        break;
      case "lig":
        el.style.color = "lightblue";
      case "aq":
        el.style.color = "aqua";
        break;
      case "bg-lg":
        el.style.backgroundColor = "lightgray";
        el.style.color = "black";
        break;
      case "bg-g":
        el.style.backgroundColor = "gray";
        el.style.color = "black";
        break;
      case "bg-g-yel":
        el.style.backgroundColor = "gray";
        el.style.color = "yellow";
        break;
      default:
        console.warn(`Unknown hl color "${extra}" for key "${name}"`);
    }
    el.textContent = sectionData[name];
    return el;
  },
  code(name, sectionData, extra) {
    const el = document.createElement("code");
    if (extra) {
      el.classList.add(...extra.split(' '))
    }
    el.textContent = sectionData[name];
    return el;
  },
  br() {
    return document.createElement("br");
  },
  b(name, sectionData) {
    const el = document.createElement("b");
    el.textContent = sectionData[name];
    return el;
  },
  img(name, sectionData, extra) {
    const el = document.createElement("img");
    el.src = name;
    el.classList.add(...extra.split(' '));
    el.addEventListener('click', function () {
      modal.style.display = 'flex';
      modalImg.src = this.src;
      modalVideo.style.display = 'none';
      modalImg.style.display = 'Block';
    });
    return el;
  },
  video(name, sectionData, extra) {
    const el = document.createElement("video");
    el.src = name;
    el.classList.add(...extra.split(' '));
    el.addEventListener('click', function () {
      if (this.id === 'modalVideo') return;
      modal.style.display = 'flex';
      modalVideo.src = this.src;
      modalImg.style.display = 'none';
      modalVideo.style.display = 'Block';
    });
    el.setAttribute('controls', '');
    el.setAttribute('autoplay', '');
    el.setAttribute('loop', '');
    el.setAttribute('muted', '');
    el.setAttribute('playsinline', '');
    return el;
  },
  p(name, sectionData, extra) {
    const el = document.createElement("p");
    el.textContent = sectionData[name];
    el.classList.add(...extra.split(' '));
    return el;
  },
  span(name, sectionData, extra) {
    const el = document.createElement("span");
    el.textContent = sectionData[name];
    el.classList.add(...extra.split(' '));
    return el;
  },
  raw(name) {
    const el = document.createElement("span");
    el.innerHTML = name;
    return el;
  },
  delete(name, sectionData, extra) {
    return {delete: true, depth: name ? parseInt(name) : 0, sibling: extra};
  }
};

function resolveKey(path, obj) {
  return path.split(".").reduce((o, k) => o?.[k], obj);
}

// ############################################################################
// Fetch YAML file and parse it, with error handling and i18n-specific logging
async function fetchYaml(url) {
  let yamlText;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[i18n] Failed to fetch "${url}": HTTP ${response.status}`);
      return;
    }
    yamlText = await response.text();
  } catch (err) {
    console.error(`[i18n] Network error fetching "${url}": ${err.message}`);
    return;
  }

  let data;
  try {
    data = jsyaml.load(yamlText);
  } catch (err) {
    // js-yaml errors include mark.line (0-based) and mark.column
    const line = err.mark ? err.mark.line + 1 : '?';
    const col = err.mark ? err.mark.column + 1 : '?';
    console.error(
      `[i18n] YAML parse error in "${url}"\n` +
      `  line  : ${line}\n` +
      `  col   : ${col}\n` +
      `  reason: ${err.reason ?? err.message}`
    );
    return;
  }
  return data;
}

// ###########################################################################################################
// Mapping of li classes to hrefs for auto-generating table of contents

const liClassTolinksMap = {
  "sub-title": [
    "foreword",
    "introduction",
    "glossary",
    "basic-concept",
    "blocks",
    "instructions",
    "controlling-units",
    "simple-logic-examples",
    "advanced",
    "world-logic",
    "bleeding-edge",
    "extras",
    "self-promotion",
    "appendix",
    "Contributors"
  ],
  "indent1": [
    "integers",
    "float",
    "boolean",
    "strings",
    "building-reference",
    "contentname",
    "processors",
    "processors-ui",
    "how-processor-run-its-code",
    "links",
    "variables",
    "built-in-variables",
    "constants",
    "buffers",
    "message",
    "switch",
    "display",
    "cell",
    "read",
    "write",
    "draw",
    "draw-flush",
    "print",
    "print-flush",
    "get-link",
    "control",
    "radar",
    "sensor",
    "set",
    "operation",
    "lookup",
    "pack-color",
    "wait",
    "stop",
    "end",
    "jump",
    "unit-bind",
    "unit-control",
    "unit-radar",
    "unit-locate",
    "universal-switch",
    "shuttle-logic",
    "thorium-reactor-fail-safe",
    "counter-array",
    "writing-in-text-editor",
    "transpiler",
    "mods",
    "subframe",
    "how-to-get-world-processor",
    "get-block",
    "set-block",
    "spawn-unit",
    "apply-status",
    "spawn-wave",
    "set-rule",
    "flush-message",
    "cutscene",
    "effect",
    "explosion",
    "set-rate",
    "fetch",
    "sync",
    "get-flag",
    "set-flag",
    "set-prop",
    "make-marker",
    "set-marker",

    "mindustry-coordinate-system",
    "configure-turns-to-config",
    "you-cannot-spawn-scathe-missile",
    "modded-items-and-draw-image",
    "ai-chatbot-doenst-understand-mlog",
    "getting-unit-cap",
    "v6-unit-control-with-logic",
    "damage-calculation",
    "math",
    "self-linking-processor",
    "mloginvention",
    "built-in-variables1",
    "text-form-instruction",
    "lookup-ids",
    "dblockbehaviour"
  ],
  "indent2": [
    "global",
    "environment",
    "sensors",
    "blocks-and-items",
    "units",
    "normal-processor",
    "world-processor"
  ]
};

async function loadLang(version, lang) {
  document.querySelectorAll('.lang-item').forEach(el => el.classList.remove('lang-active'));
  document.getElementById(`${version}_${lang}`).classList.add("lang-active")
  // document.getElementById(`${version}_${lang}`).classList.add("lang_active")
  document.body.classList.add("skeleton");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = ""; // clear text to prevent showing wrong language during loading
  });
  document.getElementById('sidebar').querySelector('ul').replaceChildren(); // clear table of contents
  document.querySelectorAll(".hidden").forEach(el => el.classList.remove("hidden")); // unhide any elements hidden by delete tokens

  const url = `./Languages/${version}/${lang}.yaml`;
  const data = await fetchYaml(url);

  window.i18n = data;

  let tokenErrors = 0;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    
    const path = el.dataset.i18n;
    const sectionKey = path.split(".").slice(0, -1).reduce((o, k) => o?.[k], i18n);
    const value = resolveKey(path, i18n);

    if (value === undefined || value === null) {
      console.warn(`[i18n] Missing key "${path}" in "${lang}.yaml"`);
      // el.classList.add('hidden');
      tokenErrors++;
      return;
    }

    if (typeof value !== "string") {
      console.warn(
        `[i18n] Key "${path}" resolved to ${typeof value} instead of string — skipping`
      );
      return;
    }

    renderTextWithTokens(el, value, sectionKey, path);
  });

  if (tokenErrors > 0) {
    console.warn(`[i18n] ${tokenErrors} missing key(s) in "${lang}.yaml"`);
  }

  document.body.classList.remove("skeleton");

  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-link-btn';
  copyBtn.title = 'Copy link';
  img = `<img src="image/assets/link2.svg" alt="Copy link" style="width:16px;height:16px;">`
  img_check = `<img src="image/assets/check-mark.svg" alt="Link copied" style="width:16px;height:16px;">`
  copyBtn.innerHTML = img;
  copyBtn.style.marginLeft = '6px';
  copyBtn.style.cursor = 'pointer';

  const tableOfContents = document.getElementById('sidebar').querySelector('ul');
  const tableOfContentsObj = data['table_of_contents'];

  for (const [key, value] of Object.entries(tableOfContentsObj)) {
    const link = document.createElement('a');
    const li = document.createElement('li');
    link.href = `#${key}`;
    link.textContent = value;
    link.classList.add('sidebar-link');
    li.appendChild(link);
    li.appendChild(copyBtn.cloneNode(true));
    for (const [cls, list] of Object.entries(liClassTolinksMap)) {
      if (list.includes(key)) {
        li.classList.add(cls);
        break;
      }
    }
    tableOfContents.appendChild(li);
  }

  // For highlightCurrentSection()
  tocLinks = document.querySelectorAll('#sidebar a');

  mappingTable = {
    "environment-table": "environment",
    "block-table": "blocks",
    "item-table": "items",
    "liquid-table": "liquids",
    "unit-table": "units",
    "id-block-table": "blocks",
    "id-unit-table": "units",
    "id-item-table": "items",
    "id-liquid-table": "liquids",
  }

  for (const [tableId, name] of Object.entries(mappingTable)) {
    tableElement = document.getElementById(tableId);
    if (tableElement){
      tableElement.replaceChildren(); // clear existing content
      const url = `./Languages/${version}/static/${name}.yaml`;
      const data = await fetchYaml(url);
      let isId = false;
      if (tableId.split('-')[0] == 'id') {
        isId = true;
      }
      const envData = data[name];
      for (const [key, value] of Object.entries(envData)) {
        if (isId) {
          const keyCell = document.createElement('div');
          keyCell.textContent = `${key}`;
          tableElement.appendChild(keyCell);
        }
        const valueCell = document.createElement('div');
        valueCell.textContent = value;
        tableElement.appendChild(valueCell);
      }
    };
  }

}

function parseTranspilerDataJSON() {
  fetch('./TranspilerData/transpiler-datas.json')
  .then(res => res.json())
  .then(datas => {
    const sorted = datas.repos
      .map(d => ({
        html_url: d.html_url,
        name: d.short_name,
        description: d.description,
        owner: d.owner,
        updated_at: d.updated_at,
        stars: d.stargazers_count,
      }))
      .sort((a, b) => b.stars - a.stars);

    const html = sorted.map(d => `
        <li style="font-size: larger;"><a href="${d.html_url}"><b class="link">${d.name}</b></a> :</li>
        ${d.description}
        <ul>
            <li>Repo Owner : ${d.owner}</li>
            <li>Last Updated : ${d.updated_at.replace('T', ' ').replace(/Z$/, '')}</li>
            <li>Stars : ${d.stars}</li>
        </ul>
        <br>`
    ).join('\n');

    const date = new Date(datas.date_updated + ' UTC');
    const formatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('transpilers-data-update-date').innerHTML = `List of compiler: (Last updated: ${formatted})`;
    document.getElementById('transpilers-data').innerHTML = html;
  })
  .catch(err => console.error('fetch error:', err));
}

// document.getElementById('hamburger-menu').addEventListener('click', function() {
//     var sidebar = document.getElementById('sidebar');
//     var content = document.querySelector('.main-content');
    
//     if (sidebar.classList.contains('open')) {
//         sidebar.classList.remove('open');
//         content.classList.remove('open');
//     } else {
//         sidebar.classList.add('open');
//         content.classList.add('open');
//     }
    
// }); 

// document.getElementById('hamburger-menu-right').addEventListener('click', function() {
//   var sidebar = document.getElementById('sidebar-right');
//   var hamburgermenu = document.getElementById('hamburger-menu-right')
//   if (sidebar.classList.contains('open')) {
//       sidebar.classList.remove('open');
//       hamburgermenu.classList.remove('open');
//   } else {
//       sidebar.classList.add('open');
//       hamburgermenu.classList.add('open');
//   }
  
// }); 


document.querySelectorAll('.sidebar-link').forEach(function(link) {
    link.addEventListener('click', function() {
        var sidebar = document.getElementById('sidebar');
        var content = document.querySelector('.main-content');
        
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            content.classList.remove('open');
        }
    });
});

document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';

        let errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Image loading error, try reloading the page, if persist contact me';
        
        this.parentNode.insertBefore(errorMessage, this.nextSibling);
        errorMessage.style.display = 'block';
    });
});


let tocLinks = document.querySelectorAll('#sidebar a');

document.addEventListener('DOMContentLoaded', function() {
    parseTranspilerDataJSON();

    function highlightCurrentSection() {
      const centerX = window.innerWidth / 1.5;
      let centerY = window.innerHeight / 2;
      let elementAtCenter = document.elementFromPoint(centerX, centerY);

      let currentSection = elementAtCenter.closest('section');
      let parentSections = [];
  
      while (currentSection) {
        parentSections.push(currentSection);
        currentSection = currentSection.parentElement.closest('section');
      }

      let section = elementAtCenter.closest('section'); // Find the closest section to the element at the center
      const maxHeight = window.innerHeight - 30;
      while (section == parentSections[0] && centerY < maxHeight || !section && centerY < maxHeight) {
        centerY += 10;
        elementAtCenter = document.elementFromPoint(centerX, centerY);
        section = elementAtCenter.closest('section');
      }
      if (section != null)
        parentSections.push(section);
      

  
      tocLinks.forEach(link => link.parentElement.classList.remove('highlight'));
  
      parentSections.forEach(section => {
        const activeLink = document.querySelector(`#sidebar a[href="#${section.id}"]`);
        if (activeLink) {
          activeLink.parentElement.classList.add('highlight');
        }
      });

    }

    // Language selection dropdown
    langButton = document.querySelector('.language-selection-button');
    langButton.addEventListener('click', function(e) {
      if (e.target.classList.contains('lang-item') || e.target.classList.contains('language-selection-button')) {
        const langSelection = document.querySelector('.language-selection');
        if (langSelection.style.display === 'block') {
          langSelection.style.display = 'none';
        } else {
          langSelection.style.display = 'block';
        }
      }
    });
  
    window.addEventListener('scroll', highlightCurrentSection);
    highlightCurrentSection();

    const tableOfContent = document.getElementById('sidebar').querySelector('ul');

    tableOfContent.addEventListener('click', e => {
      const btn = e.target.closest('.copy-link-btn');

      if (btn) {
        e.stopPropagation();
        e.preventDefault();

        const link = btn.closest('li').querySelector('a');
        const url = location.origin + location.pathname + link.getAttribute('href');

        navigator.clipboard.writeText(url).then(() => {
          btn.innerHTML = img_check;
          setTimeout(() => btn.innerHTML = img, 1200);
        });

        return;
      }

      const link = e.target.closest('a[href^="#"]');
      if (link) {
        triggerGlow.call(link, e);
        const swidth = window.innerWidth;
        console.log(swidth)
        if (swidth <= 1670) {
          var sidebar = document.getElementById('sidebar-right');
          if (sidebar.classList.contains('open')) {
              sidebar.classList.remove('open');
          }
          sidebar = document.getElementById('sidebar');
          if (sidebar.classList.contains('open')) {
              sidebar.classList.remove('open');
          }
        }
      }
    });

  // Load available languages and populate the language selection dropdown
  fetch('/MlogDocs/Languages/index.json')
    .then(r => r.json())
    .then(list => {
      const langList = document.querySelector('#lang-list');
      for (const [version, langs] of Object.entries(list)) {
        const versionLi = document.createElement('div');
        versionLi.textContent = version;
        langList.appendChild(versionLi);
        for (const { lang_code, language } of langs) {
          const div = document.createElement('div');
          div.classList.add('lang-list-container')
          div.innerHTML = `<a href="#" class="indent1 lang-item" id="${version}_${lang_code}" onclick="loadLang('${version}', '${lang_code}')">${language}</a>`;
          versionLi.appendChild(div);
        }
      }
      // const div = document.createElement('div');
      // div.innerHTML = `<a href="https://github.com/Yrueii/Yrueii.github.io">Contribute a translation!</a>`;
      // langList.appendChild(div);

      // Load default language (v7 English)
      loadLang("v7", "en").then(() => {
      // loadLang("v8", "en").then(() => {
        // Optional operations needed to be done after loading
        let img = document.querySelector('img[src="image/ui1.png"]');
        let elementsToWrap = []
        for (let i = 0; i < 48; i++) {
          img = img.nextSibling;
          elementsToWrap.push(img);
        }
    
        section = document.createElement('section');
        section.id = 'vars-tab'
        elementsToWrap[0].parentNode.insertBefore(section, elementsToWrap[0]);
        elementsToWrap.forEach(el => section.appendChild(el));
      });
    });

  document.querySelector('#sidebar-pull-tab-left').addEventListener('click', function() {
      var sidebar = document.getElementById('sidebar');
      var content = document.querySelector('.main-content');
      
      if (sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          content.classList.remove('open');
      } else {
          sidebar.classList.add('open');
          content.classList.add('open');
      }
      
  }); 

document.querySelector('#sidebar-pull-tab-right').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar-right');
  // var hamburgermenu = document.getElementById('hamburger-menu-right')
  if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      // hamburgermenu.classList.remove('open');
  } else {
      sidebar.classList.add('open');
      // hamburgermenu.classList.add('open');
  }
  
}); 


});
  
function triggerGlow(event) {
  event.preventDefault();

  const href = this.getAttribute("href"); // "#section"
  const target = document.querySelector(href);
  if (!target) return;

  // create history entry
  history.pushState(null, "", href);

  const targetTop = target.getBoundingClientRect().top + window.scrollY;

  const scrollToPosition =
    target.offsetHeight > window.innerHeight
      ? targetTop
      : targetTop - window.innerHeight / 2 + target.offsetHeight / 2;

  window.scrollTo({
    top: scrollToPosition,
    behavior: "smooth",
  });

  const targetId = href.slice(1);
  const observer = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      triggerGlow1(target);
      observer.disconnect();
    }
  });

  observer.observe(target);
}


function triggerGlow1(section) {
  section.classList.remove('glow-section');
  void section.offsetWidth;
  section.classList.add('glow-section');
}

// Get the modal
// const modal = document.getElementById('imageModal');

// Get the image and insert it inside the modal

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];

// Add click event to all images
document.querySelectorAll('img').forEach(img => {
  if (!img.dataset.listenerExclude) {
    img.addEventListener('click', function() {
      modal.style.display = 'flex';
      modalImg.src = this.src;
      modalVideo.style.display = 'none';
      modalImg.style.display = 'Block';
    });
  }
});

// Add click event to all videos
document.querySelectorAll('video').forEach(video => {
  video.addEventListener('click', function() {
    if (this.id === 'modalVideo') return; // Prevent re-opening the modal when clicking on the modal video itself
    modal.style.display = 'flex';
    modalVideo.src = this.src;
    modalImg.style.display = 'none';
    modalVideo.style.display = 'Block';
  });
});

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = 'none';
}

// Add zoom functionality
modalImg.addEventListener('click', function() {
  this.classList.toggle('zoom');
});

// modalVideo.addEventListener('click', function() {
//   this.classList.toggle('zoom');
// });

modal.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

document.querySelectorAll('.toadd').forEach((toadd, index) => {
  toadd.append(index+1)
})