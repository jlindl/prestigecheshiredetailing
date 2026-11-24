import sharp from 'sharp';
const [out,...files]=process.argv.slice(2);
const W=300,H=650,C=files.length;
const comps=await Promise.all(files.map(async(f,i)=>({input:await sharp(f).resize(W,H).toBuffer(),left:i*W,top:0})));
await sharp({create:{width:W*C,height:H,channels:3,background:'#000'}}).composite(comps).jpeg({quality:75}).toFile(out);
