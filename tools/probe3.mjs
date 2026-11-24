import { chromium } from 'playwright-core';
const exe=process.env.LOCALAPPDATA+'/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
const b=await chromium.launch({executablePath:exe});
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:3123/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
const y=await p.evaluate(()=>document.querySelector('#process').getBoundingClientRect().top+scrollY);
for (const [f,name] of [[0.25,'a'],[0.6,'b']]) {
  await p.evaluate(([y,f])=>scrollTo(0,y+innerHeight*2.6*f),[y,f]);await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>{const b=document.querySelector('.polish-stage').getBoundingClientRect();return {x:b.x+b.width*0.45,y:b.y+b.height*0.4}});
  await p.mouse.move(r.x,r.y);await p.waitForTimeout(300);
  await p.screenshot({path:`qa/r3-torch-${name}.jpg`,type:'jpeg',quality:70});
}
const y2=await p.evaluate(()=>document.querySelector('.services').getBoundingClientRect().top+scrollY+500);
await p.evaluate(y=>scrollTo(0,y),y2);await p.waitForTimeout(1500);await p.screenshot({path:'qa/r3-svc.jpg',type:'jpeg',quality:60});
const y3=await p.evaluate(()=>document.querySelector('.proof').getBoundingClientRect().top+scrollY-100);
await p.evaluate(y=>scrollTo(0,y),y3);await p.waitForTimeout(2800);await p.screenshot({path:'qa/r3-proof.jpg',type:'jpeg',quality:60});
await b.close();
