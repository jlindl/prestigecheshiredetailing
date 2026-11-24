import { chromium } from 'playwright-core';
const exe=process.env.LOCALAPPDATA+'/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
const b=await chromium.launch({executablePath:exe});
for (const [u,n,w,h] of [['https://prestigecheshiredetailing.co.uk','current-site-desktop',1440,900],['https://prestigecheshiredetailing.co.uk','current-site-mobile',390,844]]){
const p=await b.newPage({viewport:{width:w,height:h}});await p.goto(u).catch(()=>{});await p.waitForTimeout(1000);await p.screenshot({path:`qa/evidence/${n}.png`});await p.close();}
await b.close();
