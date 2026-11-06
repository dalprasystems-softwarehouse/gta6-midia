const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080*4, height: 1920*2 }, deviceScaleFactor: 0.25 });
  const items=['01','02','07','09','tabela','extra','hook','outro'];
  const cell=v=>`<div style="position:relative;width:1080px;height:1920px;background:linear-gradient(#3a2a55,#7a3a5a 50%,#2a5a5a);overflow:hidden">
   ${/^\d/.test(v)?'<div style="position:absolute;left:40px;top:560px;width:1000px;height:562px;background:linear-gradient(135deg,#b88,#557)"></div>':''}
   <img src="ov-rays.png" style="position:absolute;left:-660px;top:-240px;width:2400px;opacity:.5">
   <img src="ov-tint.png" style="position:absolute;left:0;top:0"><img src="ov-chrome.png" style="position:absolute;left:0;top:0">
   <img src="ov-${v}.png" style="position:absolute;left:0;top:0">
   <div style="position:absolute;left:0;right:0;top:1440px;text-align:center;font:900 74px Inter;color:#fff;-webkit-text-stroke:9px #000;paint-order:stroke fill">O <span style="background:#FFD23F;color:#1B1430;padding:0 10px;border-radius:10px;-webkit-text-stroke:0">GROTTI</span> CHEETAH,</div></div>`;
  require('fs').writeFileSync(__dirname+'/prev.html',`<html><body style="margin:0;display:grid;grid-template-columns:repeat(4,1080px)">${items.map(cell).join('')}</body></html>`); await p.goto('file://'+__dirname+'/prev.html');
  await p.waitForTimeout(500);
  await p.screenshot({ path: __dirname + '/preview.png' });
  await b.close();
})();
