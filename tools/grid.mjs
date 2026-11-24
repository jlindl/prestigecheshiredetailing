import sharp from 'sharp';
const [out,...files]=process.argv.slice(2);
const W=720,H=450,C=2;
const comps=await Promise.all(files.map(async(f,i)=>({input:await sharp(f).resize(W,H).toBuffer(),left:(i%C)*W,top:Math.floor(i/C)*H})));
await sharp({create:{width:W*C,height:H*Math.ceil(files.length/C),channels:3,background:'#000'}}).composite(comps).jpeg({quality:75}).toFile(out);
