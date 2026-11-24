import sharp from 'sharp';
const [dir, out] = process.argv.slice(2);
const W=240,H=320,C=6;
for (let p=0;p<Math.ceil(87/24);p++){
  const comps=[];
  for(let i=0;i<24;i++){const n=p*24+i+1; if(n>87)break;
    const f=`${dir}/pcd-${String(n).padStart(2,'0')}.jpg`;
    const buf=await sharp(f).resize(W,H,{fit:'cover'}).toBuffer();
    const label=Buffer.from(`<svg width="${W}" height="30"><rect width="60" height="30" fill="red"/><text x="8" y="22" font-size="20" fill="white" font-family="Arial">${n}</text></svg>`);
    comps.push({input:buf,left:(i%C)*W,top:Math.floor(i/C)*H},{input:label,left:(i%C)*W,top:Math.floor(i/C)*H});
  }
  await sharp({create:{width:W*C,height:H*4,channels:3,background:'#000'}}).composite(comps).jpeg({quality:70}).toFile(`${out}/sheet-${p+1}.jpg`);
}
