import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const redirects=JSON.parse(fs.readFileSync('vercel.json')).redirects;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.mp4':'video/mp4','.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain'};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');const redirect=redirects.find(r=>r.source===url.pathname);
 if(redirect){res.writeHead(redirect.permanent?308:307,{Location:redirect.destination+url.search});res.end();return;}
 let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
 let file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 if(!path.extname(file)) file+='.html';
 let code=200;
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){file=path.join(root,'404.html');code=404;}
 res.writeHead(code,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
 fs.createReadStream(file).pipe(res);
}).listen(Number(process.env.PORT||8766),'127.0.0.1',()=>console.log('MeshDent local server ready'));
