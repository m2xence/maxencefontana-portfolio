import { mkdir, readFile, writeFile } from 'node:fs/promises';

const local = (path) => new URL(path, import.meta.url);
const c = JSON.parse(await readFile(local('content.json'), 'utf8'));
const css = await readFile(local('public/site.css'), 'utf8');
const script = await readFile(local('public/menu.js'), 'utf8');
const esc = (value) => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#39;");
const links = c.links.map(({ label, url }) => {
  const target = new URL(url);
  if (!['https:', 'mailto:'].includes(target.protocol)) throw new Error('Unsupported contact URL');
  return '<a href="' + esc(target.href) + '">' + esc(label) + '</a>';
}).join(' · ');
const nav = [['home','Home'],['featured','Featured'],['projects','Projects'],['experience','Experience'],['beyond','Beyond Work'],['contact','Contact']];
const image = (item, label, classes, eager = false) => {
  if (!item) return '<div class="placeholder '+ classes +'">'+esc(label)+'</div>';
  if (!/^(?:images\/)?[\w.-]+\.(webp|avif|jpg|jpeg|png)$/i.test(item.src)) throw new Error('Use a file from public/images/');
  if (!item.alt?.trim()) throw new Error('Add alt text for ' + item.src);
  return '<img class="'+ classes +'" src="'+esc(item.src)+'" alt="'+esc(item.alt)+'"'+(eager ? '' : ' loading="lazy"')+' decoding="async">';
};
const section = (id, title, body, extra = '') => '<section id="'+id+'" class="band '+extra+'"><div class="wrap sectional"><h2>'+title+'</h2><div>'+body+'</div></div></section>';
const entries = (items) => items.map(x => '<article class="entry"><h3>'+esc(x.title)+'</h3>'+(x.status ? '<p class="muted">'+esc(x.status)+'</p>' : '')+'<p>'+esc(x.description)+'</p></article>').join('');
const featured = c.featured.map(x => '<article class="feature">'+(x.photos?.length ? '<div class="feature-photos">'+x.photos.map(photo=>'<figure>'+image(photo,'Project image pending','thumbnail')+'<figcaption>'+esc(photo.caption)+'</figcaption></figure>').join('')+'</div>' : image(x.image,'Project image pending','thumbnail'))+'<div><h3>'+esc(x.title)+'</h3><p class="muted">'+esc(x.status)+'</p><p>'+esc(x.description)+'</p></div></article>').join('');
const experience = c.experience.map(x => '<li><article><h3>'+esc(x.title)+'</h3><p class="company">'+esc(x.org)+'</p><p class="muted">'+esc(x.date)+' · '+esc(x.place)+'</p>'+(x.details.length ? '<ul>'+x.details.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>' : '')+'</article></li>').join('');
const body = '<a class="skip" href="#main">Skip to content</a><header><div class="wrap toolbar"><button hidden id="menu" type="button" aria-controls="nav" aria-expanded="false">☰ <span class="sr">Menu</span></button><a class="brand" href="#home">'+esc(c.name)+'</a><nav id="nav" aria-label="Main navigation">'+nav.map(([id,title],i)=>'<a href="#'+id+'"'+(i===0?' aria-current="location"':'')+'>'+title+'</a>').join('')+'</nav><details class="theme"><summary aria-label="Display preferences">◐</summary><fieldset><legend class="sr">Color theme</legend>'+['Light','Dark','Automatic'].map(x=>'<label><input type="radio" name="theme" value="'+x.toLowerCase()+'"'+(x==='Light'?' checked':'')+'> '+x+'</label>').join('')+'</fieldset></details></div></header><main id="main"><section class="band" id="home"><div class="wrap biography"><aside class="profile">'+image(c.portrait,'Portrait pending','portrait',true)+'<p class="person">'+esc(c.name)+'</p><p class="position">'+esc(c.role)+'</p><p class="org">'+esc(c.organization)+'</p><p class="muted">'+esc(c.location)+'</p><p>'+links+'</p></aside><div><h1>About me</h1>'+c.bio.map(p=>'<p>'+esc(p)+'</p>').join('')+'<div class="bio-details"><div><h3>Interests</h3><ul>'+c.interests.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div><div><h3>Education</h3><p>'+esc(c.education)+'</p></div></div></div></div></section>'+section('featured','Featured',featured,'alt')+section('projects','Projects',entries(c.projects))+section('experience','Experience','<ol class="timeline">'+experience+'</ol>','alt')+section('beyond','Beyond Work',entries(c.beyond))+section('contact','Contact','<p>'+esc(c.location)+'</p><p>'+links+'</p>','alt')+'</main><footer>'+esc(c.name)+'</footer>';
const page = (selfContained) => '<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Maxence Fontana, mechanical engineer and aerospace trade advisor in Los Angeles. Selected projects and experience."><title>Maxence Fontana</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap">'+(selfContained?'<style>'+css+'</style>':'<link rel="stylesheet" href="site.css">')+'</head><body>'+body+(selfContained?'<script>'+script+'</script>':'<script src="menu.js" defer></script>')+'</body></html>\n';
await mkdir(local('public/'), { recursive: true });
await writeFile(local('public/index.html'), page(false));
if (process.argv.includes('--review')) await writeFile(local('../Portfolio-Review-Academic.html'), page(true));
