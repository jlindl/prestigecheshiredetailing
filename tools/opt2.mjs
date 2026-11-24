import sharp from 'sharp';
const [dir,out,...ids]=process.argv.slice(2);
for(const id of ids){const f=`${dir}/pcd-${id}.jpg`;
  await sharp(f).rotate().resize({width:1400,withoutEnlargement:true}).webp({quality:76}).toFile(`${out}/pcd-${id}.webp`);
  await sharp(f).rotate().resize({width:800}).webp({quality:72}).toFile(`${out}/pcd-${id}-sm.webp`);}
