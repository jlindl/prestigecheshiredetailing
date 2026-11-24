import sharp from 'sharp';
const [dir,out,...ids]=process.argv.slice(2);
const W=480,H=640;
const comps=[];
for(const [i,id] of ids.entries()){
  const buf=await sharp(`${dir}/pcd-${id}.jpg`).rotate().resize(W,H,{fit:'fill'}).toBuffer();
  let g='';for(let k=1;k<10;k++){g+=`<line x1="${k*W/10}" y1="0" x2="${k*W/10}" y2="${H}" stroke="yellow" stroke-width="1" opacity=".6"/><line x1="0" y1="${k*H/10}" x2="${W}" y2="${k*H/10}" stroke="yellow" stroke-width="1" opacity=".6"/><text x="${k*W/10+2}" y="12" font-size="11" fill="yellow">${k}</text><text x="2" y="${k*H/10-2}" font-size="11" fill="yellow">${k}</text>`;}
  const svg=Buffer.from(`<svg width="${W}" height="${H}">${g}<rect width="70" height="26" fill="red"/><text x="6" y="20" font-size="20" fill="white">${id}</text></svg>`);
  comps.push({input:buf,left:(i%3)*W,top:Math.floor(i/3)*H},{input:svg,left:(i%3)*W,top:Math.floor(i/3)*H});
}
await sharp({create:{width:W*3,height:H*Math.ceil(ids.length/3),channels:3,background:'#000'}}).composite(comps).jpeg({quality:72}).toFile(out);
