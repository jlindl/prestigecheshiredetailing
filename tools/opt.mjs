import sharp from 'sharp';
const [dir,out,...ids]=process.argv.slice(2);
for(const id of ids){const f=`${dir}/pcd-${id}.jpg`;
  await sharp(f).rotate().resize({width:1400,height:1400,fit:'inside'}).webp({quality:78}).toFile(`${out}/pcd-${id}.webp`);
  await sharp(f).rotate().resize({width:640,height:640,fit:'inside'}).webp({quality:70}).toFile(`${out}/pcd-${id}-sm.webp`);}
