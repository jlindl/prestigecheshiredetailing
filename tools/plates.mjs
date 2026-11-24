import sharp from 'sharp';
import fs from 'fs';
const [src,dst]=process.argv.slice(2);
const R={ '02':[.28,.62,.68,.73],'03':[.90,.47,1,.58],'21':[.09,.57,.31,.70],'23':[.78,.53,.92,.66],'34':[0,.35,.15,.46],'35':[0,.48,.12,.64],
 '43':[.78,.54,1,.67],'48':[.31,.86,.66,.96],'66':[.02,.42,.24,.51],'73':[.93,.51,1,.63],'78':[.06,.43,.28,.53],'80':[.12,.48,.36,.59],'82':[.14,.39,.37,.50] };
for (const f of fs.readdirSync(src).filter(f=>/^pcd-\d\d\.jpg$/.test(f))) {
  const id=f.slice(4,6); const img=sharp(`${src}/${f}`).rotate(); const buf=await img.toBuffer(); const m=await sharp(buf).metadata();
  if(!R[id]){ fs.writeFileSync(`${dst}/${f}`,buf); continue; }
  const [a,b,c,d]=R[id]; const left=Math.round(a*m.width), top=Math.round(b*m.height), width=Math.round((c-a)*m.width), height=Math.round((d-b)*m.height);
  const small=await sharp(buf).extract({left,top,width,height}).resize(Math.max(3,Math.round(width/26)),Math.max(2,Math.round(height/26))).toBuffer();
  const patch=await sharp(small).resize(width,height,{kernel:'nearest'}).blur(3).toBuffer();
  await sharp(buf).composite([{input:patch,left,top}]).jpeg({quality:92}).toFile(`${dst}/${f}`);
}
