import { chromium } from 'playwright-core';
const exe=process.env.LOCALAPPDATA+'/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
const b=await chromium.launch({executablePath:exe});
for (const [w,h,rm] of [[1440,900,false],[390,844,false],[1440,900,true],[390,844,true]]){
  const p=await b.newPage({viewport:{width:w,height:h}});
  if(rm) await p.emulateMedia({reducedMotion:'reduce'});
  await p.addInitScript(()=>{window.__cls=0;window.__src=[];new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__cls+=e.value;if(e.value>0.01)window.__src.push([e.value.toFixed(3),(e.sources||[]).map(s=>s.node?.className||s.node?.nodeName).join('|')])}}).observe({type:'layout-shift',buffered:true});});
  await p.goto('http://localhost:3123/',{waitUntil:'networkidle'});await p.waitForTimeout(800);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<H;y+=300){await p.mouse.wheel(0,300);await p.waitForTimeout(60);}
  await p.waitForTimeout(1500);
  console.log(w,rm?'RM':'', 'H',H,'CLS',await p.evaluate(()=>window.__cls.toFixed(3)),JSON.stringify(await p.evaluate(()=>window.__src.slice(0,5))));
  if(rm){ for (const sel of ['#process','#work']){ await p.evaluate(s=>document.querySelector(s).scrollIntoView(),sel); await p.waitForTimeout(800); await p.screenshot({path:`qa/r5-rm-${w}-${sel.slice(1)}.jpg`,type:'jpeg',quality:60}); } }
  await p.close();
}
await b.close();
