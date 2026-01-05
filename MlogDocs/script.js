function renderTextWithTokens(el, text, tokenResolvers) {
  const frag = document.createDocumentFragment();

  const regex = /\{(\w+):(\w+)\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      frag.append(text.slice(lastIndex, match.index));
    }

    const [, type, name] = match;
    const resolver = tokenResolvers[type];

    if (resolver) {
      frag.append(resolver(name));
    } else {
      frag.append(match[0]); // fallback: literal
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    frag.append(text.slice(lastIndex));
  }

  el.textContent = "";
  el.append(frag);
}

const tokenResolvers = {
  link(name) {
    const a = document.createElement("a");
    a.href = `#${name}`;
    a.textContent = i18n[name];
    return a;
  }
};

async function loadLang(lang) {
  fetch(`/MlogDocs/Languages/i18n/${lang}.json`)
    .then(r => r.json())
    .then(data => {
      window.i18n = data;

      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        const text = key.split(".").reduce((o, k) => o[k], data);

        if (typeof text === "string") {
          renderTextWithTokens(el, text, tokenResolvers);
        }
      });
    });

  document.body.classList.remove("skeleton");
}

loadLang("en");

document.getElementById('hamburger-menu').addEventListener('click', function() {
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

document.getElementById('hamburger-menu-right').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar-right');
  var hamburgermenu = document.getElementById('hamburger-menu-right')
  if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      hamburgermenu.classList.remove('open');
  } else {
      sidebar.classList.add('open');
      hamburgermenu.classList.add('open');
  }
  
}); 


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



document.addEventListener('DOMContentLoaded', function() {
    const tocLinks = document.querySelectorAll('#sidebar a');
  
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
  
    window.addEventListener('scroll', highlightCurrentSection);
  
    highlightCurrentSection();

    all_sidebar_links = document.querySelectorAll('.sidebar-link')
    all_sidebar_links.forEach(link => {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-link-btn';
      copyBtn.title = 'Copy link';
      img = `<img src="image/assets/link2.svg" alt="Copy link" style="width:16px;height:16px;">`
      img_check = `<img src="image/assets/check-mark.svg" alt="Link copied" style="width:16px;height:16px;">`
      copyBtn.innerHTML = img;
      copyBtn.style.marginLeft = '6px';
      copyBtn.style.cursor = 'pointer';

      copyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const url = window.location.origin + window.location.pathname + link.getAttribute('href');
        navigator.clipboard.writeText(url).then(() => {
          copyBtn.innerHTML = img_check;
          setTimeout(() => copyBtn.innerHTML = img, 1200);
        });
      });

      if (!link.nextSibling || !link.nextSibling.classList || !link.nextSibling.classList.contains('copy-link-btn')) {
        link.parentNode.insertBefore(copyBtn, link.nextSibling);
      }
    })

  fetch('/MlogDocs/Languages/i18n/index.json')
    .then(r => r.json())
    .then(list => {
      const ul = document.querySelector('#lang-list');
      for (const { lang_code, language } of list) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" onclick="loadLang('${lang_code}')">${language}</a>`;
        ul.appendChild(li);
      }
    });

});


// Add event listener 'onclick' to every a[href = (with #)]
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', triggerGlow);
});
  
function triggerGlow(event) {

  event.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    const targetTop = target.getBoundingClientRect().top + window.scrollY;

    let scrollToPosition;
    if (target.offsetHeight > window.innerHeight){
      scrollToPosition = targetTop
    } else {
      scrollToPosition = targetTop - (window.innerHeight / 2) + (target.offsetHeight / 2);
    }
      
    window.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth'
    });

  // Get the href attribute and extract the target ID
  const targetId = event.target.getAttribute('href').substring(1);
  const targetElement = document.getElementById(targetId);


  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerGlow1(targetElement);
        observer.disconnect();
      }
    });
  });

  observer.observe(targetElement);
}

function triggerGlow1(section) {
  section.classList.remove('glow-section');
  void section.offsetWidth;
  section.classList.add('glow-section');
}

// Get the modal
const modal = document.getElementById('imageModal');

// Get the image and insert it inside the modal
const modalImg = document.getElementById('modalImage');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];

// Add click event to all images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('click', function() {
    modal.style.display = 'flex';
    modalImg.src = this.src;
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

modal.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

document.querySelectorAll('.toadd').forEach((toadd, index) => {
  toadd.append(index+1)
})