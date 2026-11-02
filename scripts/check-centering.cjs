// Kontrola: je číslo/znak v krúžku opticky v strede? Meria sa z pixelov
// screenshotu (telefón aj počítač). Spustenie: npm run build && npm run check:center
// Návratový kód 1 = niečo je mimo stredu (> 3,5 %) alebo primalé (< 30 % výšky).
const { chromium } = require('playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const sharp=require('sharp');
const dist=path.join(__dirname,'..','dist'), OUT=process.argv[2]||require('os').tmpdir();
let failed=0;
const mime=f=>f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':f.endsWith('.woff2')?'font/woff2':'application/octet-stream';
const srv=http.createServer((q,r)=>{const f=path.join(dist,decodeURIComponent(new URL(q.url,'http://x').pathname));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();}else{r.writeHead(200,{'Content-Type':mime(f)});r.end(d);}});}).listen(0, async()=>{
  const base=`http://localhost:${srv.address().port}/`;
  const b=await chromium.launch();
  const CASES=process.env.CASES?JSON.parse(process.env.CASES):[
    ['cesta.html','.path-node.is-done .path-node__btn'],['cesta.html','.path-node.is-current .path-node__btn'],
    ['pocuvaj.html?level=t1_01','.miner__num'],['pocuvaj.html?level=t1_01','.arena__q'],
    ['urovne.html','.tier-card__number'],
    ['index.html','.menu-button.primary','rect'],
    ['index.html','.menu-button.show-rules','rect'],
    ['urovne.html','.bj-badge'],
    ['album.html','.album-pack-btn .bj-badge'],
    ['profil.html','.age-btn'],
  ];
  for (const vp of JSON.parse(process.argv[3]||'[{"n":"phone","w":892,"h":412,"touch":true,"dsf":2.25},{"n":"desk","w":1920,"h":1080,"touch":false,"dsf":1}]')) {
  const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h},deviceScaleFactor:vp.dsf,hasTouch:vp.touch,isMobile:vp.touch});
  await ctx.addInitScript(()=>{ if(localStorage.getItem('bj.profiles'))return;
    localStorage.setItem('bj.profiles',JSON.stringify({version:2,activeId:'p',profiles:{p:{id:'p',name:'Ema',age:5,ageGroup:'5-6',avatar:'green_miner',progressKey:'x',settings:{sound:false,voiceInstructions:false},collection:{cards:{rubin:1},sparkles:0,packs:[{id:'k',set:'drahokamy',size:3}]}}}}));
    localStorage.setItem('bj.tiers.p',JSON.stringify({levels:{t1_01:{stars:3},t1_02:{stars:1}}})); });
  const p=await ctx.newPage(); let cur='';
  for (const [url,sel,mode] of CASES) {
    if(url!==cur){ await p.goto(base+url); await p.waitForTimeout(1800); cur=url;
      if(url.startsWith('profil')) { await p.evaluate(()=>{const b=[...document.querySelectorAll('.profile-tile__edit')][0]; b&&b.click();}); await p.waitForTimeout(500);} 
      await p.addStyleTag({content:'*{animation:none!important;transition:none!important}'}); await p.waitForTimeout(200);}
    const els=await p.$$(sel); if(!els.length){console.log(vp.n,sel,'NENÁJDENÉ');continue;}
    const el=els[0];
    const buf=await el.screenshot({}); if(process.env.SAVE) require('fs').writeFileSync(OUT+'/cc-'+vp.n+'-'+sel.replace(/[^a-z]/gi,'')+'.png',buf);
    const {data,info}=await sharp(buf).raw().toBuffer({resolveWithObject:true});
    const W=info.width,H=info.height,C=info.channels; const cx=W/2,cy=H/2;
    const bw=await el.evaluate(e=>parseFloat(getComputedStyle(e).borderTopWidth)||0);
    const scale=W/(await el.evaluate(e=>e.offsetWidth));
    const rIn=Math.min(W,H)/2 - bw*scale - 4;
    let x0=1e9,x1=-1,y0=1e9,y1=-1; const rows=new Array(H).fill(0);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){ if(process.env.RECT||mode==='rect'){ const m=bw*scale+6, r=H/2; if(x<r||y<m||x>W-r||y>H-m)continue; } /* zaoblené konce vynechať – presvitá pozadie */ else if((x-cx)**2+(y-cy)**2>rIn*rIn)continue; const i=(y*W+x)*C, r=data[i],g=data[i+1],bb=data[i+2];
      const white=r>215&&g>215&&bb>215, yellow=r>215&&g>175&&bb<130;
      if(white||yellow){rows[y]++; x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);} }
    if(x1<0){console.log(vp.n,sel,'bez textu');continue;}
    // v tlačidlách s textom: zvislá poloha podľa tela písmen (bez diakritiky) –
    // riadky s aspoň 25 % maxima pixelov textu
    if(mode==='rect'){ const mx=Math.max(...rows); y0=rows.findIndex(n=>n>=mx*0.25); y1=H-1-[...rows].reverse().findIndex(n=>n>=mx*0.25); }
    const dx=((x0+x1)/2-cx)/W*100, dy=((y0+y1)/2-cy)/H*100;
    // tolerancia: 3,5 % alebo 1,5 px obrazovky (malé krúžky sa vykresľujú po celých pixeloch)
    const tx=Math.max(4,150/W), ty=Math.max(3.5,150/H);
    const hp=(y1-y0)/H*100; console.log(vp.n.padEnd(6), sel.padEnd(42), `posun x ${dx.toFixed(1)}%  y ${dy.toFixed(1)}%  výška textu ${hp.toFixed(0)}%`, hp<30?'  <-- PRIMALÉ':'', Math.abs(dx)>tx||Math.abs(dy)>ty?'  <-- MIMO STRED':''); if(Math.abs(dx)>tx||Math.abs(dy)>ty||hp<30) failed++;
  }
  await ctx.close(); }
  await b.close(); srv.close();
  console.log(failed ? `\n${failed} problém(ov)` : '\nVšetko v strede.'); process.exit(failed ? 1 : 0);
});
