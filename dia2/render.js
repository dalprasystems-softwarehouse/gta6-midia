const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const list = ['chrome','tint','tabela','extra','hook','outro',...Array.from({length:10},(_,i)=>String(i+1))];
  for (const v of list) {
    await p.goto('file://' + __dirname + '/ov.html?v=' + v); await p.waitForTimeout(250);
    await p.screenshot({ path: __dirname + '/ov-' + v.padStart(2,'0') + '.png', omitBackground: true });
  }
  await p.setViewportSize({ width: 2400, height: 2400 });
  await p.goto('file://' + __dirname + '/ov.html?v=rays'); await p.waitForTimeout(250);
  await p.screenshot({ path: __dirname + '/ov-rays.png', omitBackground: true });
  await b.close();
})();
