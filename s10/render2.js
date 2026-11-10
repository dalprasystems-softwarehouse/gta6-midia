const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const s of ['tuningS','rachaS']) for (const v of ['base','q1','q2']) {
    await p.goto(`file://${__dirname}/ov.html?s=${s}&v=${v}`); await p.waitForTimeout(150);
    await p.screenshot({ path: `${__dirname}/${s}-${v}.png`, omitBackground: true });
  }
  const items=['tuningS-q1','tuningS-q2','rachaS-q1','rachaS-q2'];
  require('fs').writeFileSync(__dirname+'/prev.html',`<html><body style="margin:0;display:grid;grid-template-columns:repeat(4,1080px)">${items.map(i=>`<div style="position:relative;width:1080px;height:1920px;background:#5a7a6a"><img src="${i.split('-')[0]}-base.png" style="position:absolute"><img src="${i}.png" style="position:absolute"></div>`).join('')}</body></html>`);
  await p.setViewportSize({width:4320,height:1920}); await p.goto('file://'+__dirname+'/prev.html'); await p.waitForTimeout(300);
  await p.screenshot({ path: __dirname + '/preview.png' });
  await b.close();
})();
