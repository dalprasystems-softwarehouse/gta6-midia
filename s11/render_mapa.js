const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const v of ['base','end']) { await p.goto(`file://${__dirname}/ov.html?s=mapa&v=${v}`); await p.waitForTimeout(200);
    await p.screenshot({ path: `${__dirname}/mapa-${v}.png`, omitBackground: true }); }
  await b.close();
})();
