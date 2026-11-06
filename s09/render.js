const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const jobs = [['pl',['chrome','hook','outro','1','2','3','4','5','6','7']],['cs',['chrome','hook','outro','1','2','3','4','5','6','7','8']]];
  for (const [s, vs] of jobs) for (const v of vs) {
    await p.goto(`file://${__dirname}/ov2.html?s=${s}&v=${v}`); await p.waitForTimeout(200);
    await p.screenshot({ path: `${__dirname}/${s}-${v.padStart(2,'0')}.png`, omitBackground: true });
  }
  // preview
  const items=['pl-hook','pl-01','pl-05','pl-07','cs-hook','cs-01','cs-06','cs-outro'];
  require('fs').writeFileSync(__dirname+'/prev.html',`<html><body style="margin:0;display:grid;grid-template-columns:repeat(4,1080px)">${items.map(i=>`<div style="position:relative;width:1080px;height:1920px;background:linear-gradient(#3a2a55,#7a3a5a 50%,#2a5a5a)">${/-\d/.test(i)?'<div style="position:absolute;left:40px;top:560px;width:1000px;height:562px;background:#577"></div>':''}<img src="../dia2/ov-tint.png" style="position:absolute"><img src="${i.split('-')[0]}-chrome.png" style="position:absolute"><img src="${i}.png" style="position:absolute"></div>`).join('')}</body></html>`);
  await p.setViewportSize({width:4320,height:3840}); await p.goto('file://'+__dirname+'/prev.html'); await p.waitForTimeout(400);
  await p.screenshot({ path: __dirname + '/preview.png', scale:'css' });
  await b.close();
})();
