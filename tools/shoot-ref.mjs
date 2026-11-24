import { chromium } from 'playwright-core';
const [url,out,w,h,steps]=process.argv.slice(2);
const exe=process.env.LOCALAPPDATA+'/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
const b=await chromium.launch({executablePath:exe});
const p=await b.newPage({viewport:{width:+w,height:+h}});
const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push(String(e)));
await p.goto(url,{waitUntil:'networkidle',timeout:60000}).catch(e=>console.log('goto',e.message));
await p.waitForTimeout(2500);
const H=await p.evaluate(()=>document.documentElement.scrollHeight);
const n=+steps;
for(let i=0;i<n;i++){const y=Math.round((H-+h)*i/(n-1));
  for(let k=0;k<12;k++){await p.mouse.wheel(0,(y-await p.evaluate(()=>scrollY))/6);await p.waitForTimeout(60);}
  await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(1300);
  await p.screenshot({path:`${out}-${String(i).padStart(2,'0')}.jpg`,quality:60,type:'jpeg'});}
console.log('height',H,'errors',JSON.stringify(errs.slice(0,8)));
await b.close();
