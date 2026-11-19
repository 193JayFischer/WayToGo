// Builds the "Work that fits your day" ad in three sizes. Run: node build5.js
const fs = require('fs'), path = require('path');
const tpl = fs.readFileSync(path.join(__dirname, 'week5.html'), 'utf8');
const logo = 'file://' + path.resolve(__dirname, '../../img/logo.png');
const top = (tag) => `<div class="top"><img class="logo" src="${logo}"><div class="tag">${tag}</div></div>`;
const h1 = `<h1>Work that<br><mark>fits your day.</mark></h1>`;
const forr = `<div class="for"><span class="l">Great for</span><span class="chip">Parents</span><span class="chip">Retirees</span><span class="chip">Second careers</span></div>`;
const facts = `<div class="facts"><div class="fact"><i>$</i>$25–$28 per hour</div><div class="fact"><i>✓</i>Free CDL training</div><div class="fact"><i>✓</i>Min. hours guaranteed</div><div class="fact"><i>✓</i>Full-time or part-time</div></div>`;
const deco = `<div class="sun"></div><div class="arc"></div>`;
const H = {
  square: `<div class="ad square">${deco}<div class="in">${top('Now hiring')}${h1}<div class="sub">School Bus Drivers · Toms River &amp; Lakewood, NJ</div>${forr}${facts}<div class="cta"><b>Apply in 5 minutes</b><div class="url">waytogonj<span>.com</span></div><div class="ph">Call or text 732-608-1939</div></div></div></div>`,
  wide: `<div class="ad wide">${deco}<div class="in">${top('Now hiring · Toms River &amp; Lakewood, NJ')}<div class="body"><div>${h1}<div class="sub">School bus drivers wanted</div></div><div>${forr}${facts}</div></div><div class="cta"><div><b>Apply in 5 minutes</b><div class="ph">Call or text 732-608-1939</div></div><div class="url">waytogonj<span>.com</span></div></div></div></div>`,
  story: `<div class="ad story">${deco}<div class="in">${top('Now hiring')}${h1}<div class="sub">School Bus Drivers<br>Toms River &amp; Lakewood, NJ</div>${forr}${facts}<div class="cta"><b>Apply in 5 minutes</b><div class="url">waytogonj<span>.com</span></div><div class="ph">Call, text or WhatsApp 732-608-1939</div></div></div></div>`,
};
(async () => {
  const { chromium } = require('playwright'); const b = await chromium.launch();
  const sizes = { square: [1080, 1080], wide: [1200, 628], story: [1080, 1920] };
  const out = process.argv[2] || path.join(__dirname, '..');
  for (const k of Object.keys(sizes)) {
    const f = path.join(require('os').tmpdir(), `w5-${k}.html`); fs.writeFileSync(f, tpl.replace('<!--BODY-->', H[k]));
    const pg = await b.newPage({ viewport: { width: sizes[k][0], height: sizes[k][1] }, deviceScaleFactor: 2 });
    await pg.goto('file://' + f); await pg.waitForTimeout(300);
    const ov = await pg.evaluate(() => { const a = document.querySelector('.in'); return a.scrollHeight - a.clientHeight; }); if (ov > 0) console.log(k, 'OVERFLOW', ov);
    await pg.screenshot({ path: path.join(out, `week5-${k}.png`), clip: { x: 0, y: 0, width: sizes[k][0], height: sizes[k][1] } }); await pg.close();
  }
  await b.close(); console.log('done');
})();
