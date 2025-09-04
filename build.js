const fs = require('fs-extra');
const path = require('path');
const frontMatter = require('front-matter');
const { marked } = require('marked');

const PATHS = {
  ARTICLES: path.join(__dirname, 'articles'),
  PUBLIC: path.join(__dirname, 'public'),
  DIST: path.join(__dirname, 'dist'),
  DIST_ARTICLES: path.join(__dirname, 'dist', 'articles'),
  STYLES: path.join(__dirname, 'styles'),
};

const blogTemplate = `
<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-26DG1RSD11"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-26DG1RSD11');
</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Triveo</title>
    <meta name="description" content="Consejos, guías y noticias del mundo de la tecnología de la mano de expertos.">
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="/styles/main.css">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>">
    <style type="text/tailwindcss">
      .blog-card {
        @apply bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
      }
      .card-link {
        @apply block;
      }
      .card-image {
        @apply w-full h-48 object-cover;
      }
      .card-content {
        @apply p-6;
      }
      .card-category {
        @apply block text-sm font-semibold text-blue-600 uppercase tracking-wide;
      }
      .card-title {
        @apply mt-2 text-xl font-bold text-slate-900 leading-tight;
      }
      .card-summary {
        @apply mt-2 text-slate-600 text-base;
      }
      .card-footer {
        @apply mt-4 flex items-center justify-between text-sm text-slate-500;
      }
      .card-author {
        @apply font-medium;
      }
      .card-date {
        @apply text-right;
      }
    </style>
    <meta name="google-adsense-account" content="ca-pub-9359613935782989">
</head>
<body class="bg-slate-50 text-slate-800 font-sans">
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" class="inline-flex items-center" aria-label="Inicio"><img src="/images/triveo-logo-cropped.png" alt="Triveo" class="h-12 w-auto" /></a>
            <nav class="hidden md:flex items-center space-x-8">
                <a href="/" class="text-slate-600 hover:text-blue-600 transition-colors">Inicio</a>
                <a href="/blog.html" class="font-semibold text-blue-600">Blog</a>
            </nav>
            <a href="/#chat" class="hidden md:inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                Hablar con un experto
            </a>
            <button id="mobile-menu-button" class="md:hidden">
                <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
        </div>
    </header>
    <main class="container mx-auto px-6 py-16">
        <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-slate-900">Nuestro Blog</h1>
            <p class="text-lg text-slate-600 mt-2">Guías de compra, análisis y las últimas noticias del sector.</p>
        </div>
        <div class="lg:grid lg:grid-cols-4 lg:gap-12">
            <div class="lg:col-span-3">
                <div class="grid sm:grid-cols-2 gap-8">
                    <!-- ARTICLE_GRID_PLACEHOLDER -->
                </div>
            </div>
            <aside class="lg:col-span-1 mt-12 lg:mt-0">
                <!-- SIDEBAR_PLACEHOLDER -->
            </aside>
        </div>
    </main>
    <footer class="bg-white border-t border-slate-200 mt-16">
        <div class="container mx-auto px-6 py-8 text-center text-slate-500">
            &copy; ${new Date().getFullYear()} Triveo. Todos los derechos reservados.
        </div>
    </footer>
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
      });
    </script>
</body>
</html>
`;

const articleTemplate = `
<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-26DG1RSD11"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-26DG1RSD11');
</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} - Triveo</title>
    <meta name="description" content="{{SUMMARY}}">
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="/styles/main.css">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>">
    <style type="text/tailwindcss">
      .product-card {
        @apply my-8 flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50;
      }
      .product-image {
        @apply w-full md:w-48 h-48 object-contain p-4 bg-white;
      }
      .product-content {
        @apply p-6 flex-grow;
      }
      .product-title {
        @apply text-xl font-bold text-slate-800;
      }
      .product-button {
        @apply mt-4 inline-block bg-amber-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-600 transition-transform duration-200 ease-in-out transform hover:scale-105;
      }
    </style>
    <meta name="google-adsense-account" content="ca-pub-9359613935782989">
</head>
<body class="bg-white text-slate-800 font-sans">
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" class="inline-flex items-center" aria-label="Inicio">
                <img src="/images/triveo-logo-cropped.png" alt="Triveo" class="h-12 w-auto" />
            </a>
            <nav class="hidden md:flex items-center space-x-8">
                <a href="/" class="text-slate-600 hover:text-blue-600 transition-colors">Inicio</a>
                <a href="/blog.html" class="font-semibold text-blue-600">Blog</a>
            </nav>
            <button class="chat-trigger hidden md:inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                Hablar con un experto
            </button>
            <button id="mobile-menu-button" class="md:hidden">
                <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
        </div>
    </header>
    <main class="py-16">
        <article class="container mx-auto px-6 max-w-4xl">
            <header class="mb-12">
                <div class="text-center">
                    <p class="text-blue-600 font-semibold uppercase">{{CATEGORY}}</p>
                    <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mt-2">{{TITLE}}</h1>
                    <div class="mt-4 text-slate-500">
                        <span>Por {{AUTHOR}}</span> &bull; <time datetime="{{RAW_DATE}}">{{DATE}}</time>
                    </div>
                </div>
                <img src="{{FEATURED_IMAGE}}" alt="Imagen destacada para {{TITLE}}" class="mt-8 rounded-xl shadow-lg w-full h-auto aspect-video object-cover">
            </header>
            <div class="prose prose-slate lg:prose-xl max-w-none mx-auto">
                {{CONTENT}}
            </div>
        </article>
    </main>
    <footer class="bg-slate-50 border-t border-slate-200 mt-16">
        <div class="container mx-auto px-6 py-8 text-center text-slate-500">
            &copy; ${new Date().getFullYear()} Triveo. Todos los derechos reservados.
        </div>
    </footer>
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
      });
    </script>
</body>
</html>
`;


async function buildSite() {
  const BASE_URL = 'https://techassesor.vercel.app';
  const SITEMAP_BASE = 'https://triveo.es';

  const toAbsolute = (p) => {
    const assetPath = p.trim().replace(/^\/?public\//, '');
    return `${BASE_URL}/${assetPath.replace(/^\/?/, '')}`;
  };

  const finalizeAndWriteHtml = async (html, outputPath) => {
    const finalHtml = html.replace(/(src|href)="(\/?(?:public\/)?(?:images|styles|script)[^\"]*|script\.js)"/g, (match, attr, assetPath) => {
        return `${attr}="${toAbsolute(assetPath)}"`;
    });
    await fs.writeFile(outputPath, finalHtml);
  };

  console.log('🚀 Iniciando compilación del sitio estático...');

  try {
    console.log(`🧹 Limpiando el directorio de salida...`);
    await fs.ensureDir(PATHS.DIST);
    await fs.emptyDir(PATHS.DIST);



    console.log(`🎨 Copiando assets estáticos...`);
    if (await fs.pathExists(PATHS.PUBLIC)) {
        await fs.copy(PATHS.PUBLIC, PATHS.DIST);
    }
    if (await fs.pathExists(PATHS.STYLES)) {
        await fs.copy(PATHS.STYLES, path.join(PATHS.DIST, 'styles'));
    }

    console.log(`📝 Procesando artículos desde '${PATHS.ARTICLES}'...`);
    await fs.ensureDir(PATHS.DIST_ARTICLES);

    const articleFiles = await fs.readdir(PATHS.ARTICLES);
    const articlesData = [];

    for (const file of articleFiles) {
      if (path.extname(file) === '.md') {
        const slug = path.basename(file, '.md');
        const fileContent = await fs.readFile(path.join(PATHS.ARTICLES, file), 'utf-8');

        const { attributes, body } = frontMatter(fileContent);
        const contentHtml = marked.parse(body);
        
        const formattedDate = new Date(attributes.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

        const pageHtml = articleTemplate
          .replace(/{{TITLE}}/g, attributes.title)
          .replace(/{{SUMMARY}}/g, attributes.summary)
          .replace(/{{RAW_DATE}}/g, attributes.date)
          .replace(/{{DATE}}/g, formattedDate)
          .replace(/{{AUTHOR}}/g, attributes.author)
          .replace(/{{CATEGORY}}/g, attributes.category || 'Artículo')
          .replace(/{{FEATURED_IMAGE}}/g, attributes.featuredImage) // Use raw path, it will be replaced by finalizeAndWriteHtml
          .replace(/{{CONTENT}}/g, contentHtml);

        const outputPath = path.join(PATHS.DIST_ARTICLES, `${slug}.html`);
        // Apply the final path correction to the generated article HTML
        await finalizeAndWriteHtml(pageHtml, outputPath);

        articlesData.push({
          ...attributes,
          url: `/articles/${slug}.html`,
        });
        console.log(`  -> Artículo generado: ${slug}.html`);
      }
    }

    articlesData.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log(`📚 Generando la página principal del blog: blog.html...`);

    const articlesByDate = articlesData.reduce((acc, article) => {
      const date = new Date(article.date);
      const year = date.getFullYear();
      const monthName = date.toLocaleString('es-ES', { month: 'long' });
      const monthKey = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(article);
      return acc;
    }, {});

    let sidebarHtml = '<h3 class="text-lg font-bold text-slate-900 mb-4">Artículos por fecha</h3><div class="space-y-6">';
    for (const monthKey in articlesByDate) {
      sidebarHtml += `<div><h4 class="font-semibold text-slate-800 text-base mb-2">${monthKey}</h4><ul class="space-y-2">`;
      articlesByDate[monthKey].forEach(article => {
        sidebarHtml += `<li><a href="${article.url}" class="text-sm text-slate-600 hover:text-blue-600 hover:underline">${article.title}</a></li>`;
      });
      sidebarHtml += '</ul></div>';
    }
    sidebarHtml += '</div>';

    const articlesHtmlList = articlesData
      .map(article => `
        <article class="blog-card">
          <a href="${article.url}" class="card-link">
            <img src="${article.featuredImage}" alt="Imagen destacada para ${article.title}" class="card-image">
            <div class="card-content">
              <span class="card-category">${article.category}</span>
              <h2 class="card-title">${article.title}</h2>
              <p class="card-summary">${article.summary}</p>
              <div class="card-footer">
                <span class="card-author">${article.author}</span>
                <time datetime="${article.date}" class="card-date">
                  ${new Date(article.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>
            </div>
          </a>
        </article>
      `).join('');

    let blogIndexHtml = blogTemplate
      .replace('<!-- ARTICLE_GRID_PLACEHOLDER -->', articlesHtmlList)
      .replace('<!-- SIDEBAR_PLACEHOLDER -->', sidebarHtml);

    await finalizeAndWriteHtml(blogIndexHtml, path.join(PATHS.DIST, 'blog.html'));
    
    console.log(`🏠 Procesando la página de inicio: index.html...`);
    let indexHtml = await fs.readFile('index.html', 'utf-8');
    const latestThree = articlesData.slice(0, 3);

    if (latestThree.length > 0) {
      const slides = latestThree.map((a, i) => `
        <a href="${a.url}" class="carousel-slide min-w-full block bg-white rounded-lg shadow-md overflow-hidden md:flex group ring-1 ring-slate-200/50 hover:ring-blue-500/50 transition-all duration-300">
          <div class="md:w-1/3">
            <img class="h-36 w-full object-cover md:h-40" src="${a.featuredImage}" alt="Imagen para ${a.title}">
          </div>
          <div class="p-5 md:w-2/3 flex flex-col justify-center">
            <div class="uppercase tracking-wide text-xs text-blue-600 font-semibold">${a.category || 'Artículo'}</div>
            <h3 class="mt-1 text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">${a.title}</h3>
            <p class="mt-2 text-slate-600 text-sm">${a.summary}</p>
            <div class="mt-3 text-xs text-slate-500">
              <span>Por ${a.author}</span> &bull;
              <time datetime="${a.date}">${new Date(a.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
          </div>
        </a>
      `).join('');

      const indicators = latestThree.map((_, i) => `
        <button data-idx="${i}" class="w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-slate-300'}"></button>
      `).join('');

      const carouselHtml = `
      <div class="relative max-w-3xl mx-auto px-4 md:px-8 overflow-hidden" id="latest-carousel">
        <div id="carousel-track" class="flex transition-transform duration-300 ease-in-out" style="transform: translateX(0);">
          ${slides}
        </div>
        <button id="carousel-prev" aria-label="Anterior" class="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur border border-slate-200 rounded-full w-8 h-8 grid place-items-center shadow hover:shadow-md">
          <span class="sr-only">Anterior</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="carousel-next" aria-label="Siguiente" class="absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur border border-slate-200 rounded-full w-8 h-8 grid place-items-center shadow hover:shadow-md">
          <span class="sr-only">Siguiente</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <div id="carousel-indicators" class="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-1.5">
          ${indicators}
        </div>
      </div>
      <script>(function(){
        const container = document.getElementById('latest-carousel');
        const track = document.getElementById('carousel-track');
        const prev = document.getElementById('carousel-prev');
        const next = document.getElementById('carousel-next');
        const dotsWrap = document.getElementById('carousel-indicators');
        const dots = Array.from(dotsWrap.querySelectorAll('button'));
        const slides = track.children.length;
        let idx = 0;
        function update(){
          const items = Array.from(track.children);
          const target = items[idx];
          const padLeft = parseFloat(getComputedStyle(container).paddingLeft) || 0;
          const offset = target.offsetLeft - padLeft;
          track.style.transform = 'translateX(' + (-offset) + 'px)';
          // Hide non-active fully
          items.forEach((el, i) => {
            const active = i === idx;
            el.style.opacity = active ? '1' : '0';
            el.style.visibility = active ? 'visible' : 'hidden';
            el.style.pointerEvents = active ? 'auto' : 'none';
            el.style.transform = active ? 'scale(1)' : 'scale(0.98)';
          });
          dots.forEach((d,i)=>{ d.classList.toggle('bg-blue-600', i===idx); d.classList.toggle('bg-slate-300', i!==idx); });
        }
        prev.addEventListener('click', ()=>{ idx = (idx - 1 + slides) % slides; update(); });
        next.addEventListener('click', ()=>{ idx = (idx + 1) % slides; update(); });
        dots.forEach((d)=> d.addEventListener('click', ()=>{ idx = Number(d.dataset.idx)||0; update(); }));
        // Auto-advance every 7s
        setInterval(()=>{ idx = (idx + 1) % slides; update(); }, 7000);
        update();
      })();</script>`;

      indexHtml = indexHtml.replace(/<div id="latest-article-placeholder"><\/div>/g, carouselHtml);
    } else {
      indexHtml = indexHtml.replace(/<div id="latest-article-placeholder"><\/div>/g, '<p class="text-center text-slate-500">No hay artículos disponibles en este momento.</p>');
    }

    await finalizeAndWriteHtml(indexHtml, path.join(PATHS.DIST, 'index.html'));

    console.log('🔧 Inyectando variables de entorno en script.js...');
    const scriptPath = path.join(PATHS.DIST, 'script.js');
    let scriptContent = await fs.readFile(scriptPath, 'utf-8');

    // process.env.N8N_WEBHOOK_URL será proporcionado por Vercel
    const webhookUrl = process.env.N8N_WEBHOOK_URL || ''; 

    scriptContent = scriptContent.replace('%%N8N_WEBHOOK_URL%%', webhookUrl);
    await fs.writeFile(scriptPath, scriptContent);

    if (!webhookUrl) {
      console.warn('  -> ⚠️ Advertencia: La variable N8N_WEBHOOK_URL no fue encontrada. El chat no funcionará.');
    } else {
      console.log('  -> ✅ Variable N8N_WEBHOOK_URL inyectada correctamente.');
    }

    // Generar automáticamente sitemap.xml a partir de los HTML en dist
    console.log('🗺️ Generando sitemap.xml automáticamente...');
    async function listHtmlFiles(dir) {
      const entries = await fs.readdir(dir);
      const results = [];
      for (const entry of entries) {
        const full = path.join(dir, entry);
        const stat = await fs.stat(full);
        if (stat.isDirectory()) {
          results.push(...(await listHtmlFiles(full)));
        } else if (path.extname(entry) === '.html') {
          results.push(full);
        }
      }
      return results;
    }

    const htmlFiles = await listHtmlFiles(PATHS.DIST);
    const urlEntries = [];
    for (const filePath of htmlFiles) {
      const rel = path.relative(PATHS.DIST, filePath).replace(/\\/g, '/');
      let loc = '/' + rel;
      if (rel === 'index.html') {
        loc = '/';
      }
      const stat = await fs.stat(filePath);
      const lastmod = stat.mtime.toISOString().slice(0, 10);
      urlEntries.push({ loc: `${SITEMAP_BASE}${loc}`, lastmod });
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries
      .map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`)
      .join('\n')}\n</urlset>\n`;

    // Escribimos en dist y también actualizamos el de la raíz
    await fs.writeFile(path.join(PATHS.DIST, 'sitemap.xml'), sitemapXml);
    await fs.writeFile(path.join(__dirname, 'sitemap.xml'), sitemapXml);
    console.log('  -> sitemap.xml generado en dist/ y actualizado en la raíz.');

    // Copiar robots.txt desde la raíz a dist
    console.log('🤖 Copiando robots.txt...');
    const rootRobots = path.join(__dirname, 'robots.txt');
    if (await fs.pathExists(rootRobots)) {
      await fs.copy(rootRobots, path.join(PATHS.DIST, 'robots.txt'));
      console.log('  -> robots.txt copiado a dist/');
    } else {
      console.warn('  -> ⚠️ No se encontró robots.txt en la raíz.');
    }

    // Copiar BingSiteAuth.xml desde la raíz a dist
    console.log('🪟 Copiando BingSiteAuth.xml...');
    const rootBing = path.join(__dirname, 'BingSiteAuth.xml');
    if (await fs.pathExists(rootBing)) {
      await fs.copy(rootBing, path.join(PATHS.DIST, 'BingSiteAuth.xml'));
      console.log('  -> BingSiteAuth.xml copiado a dist/');
    } else {
      console.warn('  -> ⚠️ No se encontró BingSiteAuth.xml en la raíz.');
    }

    console.log(`✅ ¡Compilación completada! El sitio está listo en la carpeta '${PATHS.DIST}'.`);
  } catch (error) {
    console.error('❌ Error durante el proceso de compilación:', error);
    process.exit(1);
  }
}

buildSite();
