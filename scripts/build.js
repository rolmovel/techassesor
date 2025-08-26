const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const marked = require('marked');
const fm = require('front-matter');

const CONTENT_DIR = path.join(__dirname, '../content');
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const DIST_DIR = path.join(__dirname, '../dist');

// Limpiar el directorio de salida
fs.emptyDirSync(DIST_DIR);

// Copiar archivos estáticos (CSS, JS, imágenes, etc. desde un directorio 'public' o similar si existiera)
// Por simplicidad en este ejemplo, se asume que los archivos base ya están en 'dist' o se copian manualmente.
// En un proyecto real, se copiarían desde una carpeta 'public' o 'static'.
// fs.copySync(path.join(__dirname, '../public'), DIST_DIR);

// Generar páginas de artículos
const posts = [];
const files = glob.sync(`${CONTENT_DIR}/posts/**/*.md`);

files.forEach(file => {
    const markdownContent = fs.readFileSync(file, 'utf-8');
    const { attributes, body } = fm(markdownContent);
    const htmlContent = marked.parse(body);

    const postTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'post.html'), 'utf-8');
    
    // Crear una URL amigable (slug) a partir del nombre del archivo
    const slug = path.basename(file, '.md');
    const outputPath = path.join(DIST_DIR, `${slug}.html`);

    const finalHtml = postTemplate
        .replace('{{TITLE}}', attributes.title)
        .replace('{{CONTENT}}', htmlContent)
        .replace('{{IMAGE}}', attributes.image)
        .replace('{{SUMMARY}}', attributes.summary);
    
    fs.writeFileSync(outputPath, finalHtml);

    posts.push({ ...attributes, slug });
});

// Ordenar posts por fecha (más reciente primero)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generar la página del blog (listado)
const blogTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'blog.html'), 'utf-8');
const postLinksHtml = posts.map(post => `
    <div class="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg flex flex-col">
        <a href="${post.slug}.html" class="block">
            <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover">
        </a>
        <div class="p-6 flex flex-col flex-grow">
            <p class="text-sm text-blue-600 font-semibold mb-1">${post.date}</p>
            <h3 class="text-xl font-bold mb-3 text-slate-900">${post.title}</h3>
            <p class="text-slate-600 mb-4 flex-grow">${post.summary}</p>
            <a href="${post.slug}.html" class="font-semibold text-blue-600 hover:text-blue-800 mt-auto self-start">Leer más &rarr;</a>
        </div>
    </div>
`).join('');

const finalBlogHtml = blogTemplate.replace('{{POSTS_LIST}}', postLinksHtml);
fs.writeFileSync(path.join(DIST_DIR, 'blog.html'), finalBlogHtml);

console.log(`${posts.length} posts generados correctamente.`);
console.log('Sitio web construido en la carpeta /dist');

// NOTA: Para completar, los archivos `index.html`, `style.css` y `script.js` originales deberían copiarse a la carpeta `dist`.
// Una implementación robusta usaría una carpeta 'static' o 'public' para estos archivos y los copiaría al inicio del script.
fs.copySync(path.join(__dirname, '../static_files'), DIST_DIR, { overwrite: true });
