import { spawn } from 'node:child_process';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const port=8766, debugPort=9227, base='http://127.0.0.1:'+port;
fs.rmSync('/tmp/meshdent-chromium-final',{recursive:true,force:true});
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'ignore',env:{...process.env,PORT:String(port)}});
const chrome=spawn('/usr/bin/chromium',['--headless','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking','--no-first-run','--remote-debugging-port='+debugPort,'--user-data-dir=/tmp/meshdent-chromium-final','about:blank'],{stdio:'ignore'});
let socket;const report={layout:[],story:[],crm:[],errors:[],missing:[],screenshots:[]};
try{
 let tabs;
 for(let i=0;i<80;i++){try{tabs=await(await fetch('http://127.0.0.1:'+debugPort+'/json')).json();break;}catch{await wait(100);}}
 socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise(r=>socket.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map();let crmPosts=[], mode='success',googleRequests=0;
 const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});socket.send(JSON.stringify({id:key,method,params}));});
 socket.addEventListener('message',async event=>{
  const m=JSON.parse(event.data);
  if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p?.reject(m.error);else p?.resolve(m.result);return;}
  if(m.method==='Runtime.exceptionThrown')report.errors.push(m.params.exceptionDetails.text+' '+(m.params.exceptionDetails.exception?.description||''));
  if(m.method==='Network.responseReceived'&&m.params.response.status>=400&&m.params.response.url.startsWith(base))report.missing.push(m.params.response.url);
  if(m.method==='Fetch.requestPaused'){
   const {request,requestId}=m.params;
   if(request.url.startsWith(base)){await send('Fetch.continueRequest',{requestId});return;}
   let status=200,contentType='application/json',data={};
   if(request.url.includes('partnercrm.leadgensolution.hu')){
    if(request.method==='GET')data={token:'browser-token',ts:Math.floor(Date.now()/1000)};
    else if(request.method==='OPTIONS'){status=204;data=null;}
    else{
     const body=JSON.parse(request.postData);crmPosts.push(body);
     if(mode==='validation'){status=422;data={error:'Ellenőrzött teszt mezőhiba.'};}
     else if(mode==='failure'){status=503;data={error:'Tesztkiesés.'};}
     else if(body._partial){status=202;data={ok:true,partial:true,submission:'browser-submission',resume:'browser-resume'};}
     else{status=201;data={ok:true,message:'ok'};}
    }
   }else if(/googletagmanager|google-analytics/.test(request.url)){googleRequests++;contentType='text/javascript';data='';}
   else{status=404;data={};}
   await send('Fetch.fulfillRequest',{requestId,responseCode:status,responseHeaders:[{name:'Content-Type',value:contentType},{name:'Access-Control-Allow-Origin',value:base},{name:'Access-Control-Allow-Headers',value:'Content-Type'},{name:'Access-Control-Allow-Methods',value:'GET,POST,OPTIONS'}],body:Buffer.from(typeof data==='string'?data:data?JSON.stringify(data):'').toString('base64')});
  }
 });
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Fetch.enable',{patterns:[{urlPattern:'http*'}]});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
 const until=async expression=>{for(let i=0;i<120;i++){if(await evaluate(expression))return;await wait(100);}throw new Error('Timed out: '+expression);};
 const size=async width=>{await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});await wait(120);};
 const goto=async route=>{await send('Page.navigate',{url:base+route});await until('document.readyState === "complete"');await wait(500);};
 const shot=async(name)=>{const r=await send('Page.captureScreenshot',{format:'png'});const file='/tmp/meshdent-'+name+'.png';fs.writeFileSync(file,Buffer.from(r.data,'base64'));report.screenshots.push(file);};
 await size(1440);await goto('/');
 assert.equal(googleRequests,0,'no Google request before consent');
 await evaluate('document.querySelector("[data-consent=necessary]").click()');
 await shot('final-desktop');
 assert.equal(await evaluate('document.querySelectorAll(".p-story-grid").length'),1);
 for(const width of [320,390,640,768,1024,1440]){
  await size(width);
  const row=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelector("h1").textContent})');
  report.layout.push(row);assert(row.scroll<=row.width+1,'home overflow '+width);
 }
 await size(1440);
 for(let i=0;i<4;i++){
  await evaluate(`document.querySelector('[data-story-step="${i}"]').scrollIntoView({block:'center',behavior:'instant'})`);await wait(500);
  const actual=await evaluate('document.querySelector("[data-frame].is-active").dataset.frame');report.story.push(actual);assert.equal(actual,String(i));
 }
 await shot('final-story');
 await evaluate('document.querySelectorAll("[data-connection]")[2].click()');
 assert.equal(await evaluate('document.querySelectorAll("[data-connection-detail]")[2].hidden'),false);
 await evaluate('document.querySelector("[data-network-motion]").click()');assert.equal(await evaluate('document.querySelector(".final-home").classList.contains("is-paused")'),true);
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert.equal(await evaluate('getComputedStyle(document.querySelector(".c-flow")).animationName'),'none');
 await send('Emulation.setEmulatedMedia',{features:[]});
 await size(390);await evaluate('scrollTo({top:0,behavior:"instant"})');await shot('final-mobile');
 await evaluate('document.querySelector(".menu-button").click()');assert.equal(await evaluate('document.querySelector(".menu-button").getAttribute("aria-expanded")'),'true');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
 assert.equal(await evaluate('document.querySelector(".menu-button").getAttribute("aria-expanded")'),'false');
 await goto('/munkaink');await evaluate('document.querySelector("[data-filter=implant]").click()');
 assert.equal(await evaluate('[...document.querySelectorAll("[data-category]")].filter(x=>!x.hidden).length'),1);
 await evaluate('document.querySelector("[data-category=implant] [data-image]").click()');assert.equal(await evaluate('document.querySelector("#lightbox").open'),true);
 await evaluate('document.querySelector("#lightbox [data-close]").click()');
 await size(1440);await goto('/kapcsolat?tema=implantatum');await until('Boolean(document.querySelector("[data-contact-form]:not([hidden])"))');await shot('contact-desktop');
 assert.equal(await evaluate('document.querySelector("[name=topic]").value'),'implantatum');
 await evaluate(`(()=>{const f=document.querySelector('[data-contact-form]');for(const [k,v] of Object.entries({last_name:'Böngészős Teszt',email:'browser@example.test',phone:'+36701234567',company:'A teszt kérdés, nem valódi megkeresés.'}))f.elements[k].value=v;f.elements._consent.checked=true;f.requestSubmit();f.requestSubmit();})()`);
 await until('document.querySelector(".form-output").textContent.includes("Üzenetét rögzítettük")');
 assert.equal(crmPosts.length,2);assert.equal(crmPosts[1]._submission,'browser-submission');assert.equal(crmPosts[1].company.includes('A teszt kérdés'),true);
 assert.equal(await evaluate('window.dataLayer.filter(x=>x[0]==="event"&&x[1]==="generate_lead").length'),0,'no analytics without consent');report.crm.push('general success and duplicate click');
 await evaluate('document.querySelector("[data-cookie-open]").click();document.querySelector("[name=analytics]").checked=true;document.querySelector("[data-consent=selected]").click()');
 await until('Boolean(document.querySelector("script[src*=googletagmanager]"))');assert(googleRequests>0);
 mode='validation';await goto('/kapcsolat');await until('Boolean(document.querySelector("[data-contact-form]:not([hidden])"))');
 await evaluate(`(()=>{const f=document.querySelector('[data-contact-form]');for(const [k,v] of Object.entries({last_name:'Böngészős Teszt',email:'browser@example.test',phone:'+36701234567',company:'Validációs teszt üzenet.'}))f.elements[k].value=v;f.elements._consent.checked=true;f.requestSubmit();})()`);
 await until('document.querySelector(".form-output").dataset.error === "true"');assert.equal(await evaluate('window.dataLayer.filter(x=>x[0]==="event"&&x[1]==="generate_lead").length'),0);report.crm.push('validation has no success event');
 mode='success';await evaluate('document.querySelector("[data-contact-form]").requestSubmit()');
 await until('document.querySelector(".form-output").textContent.includes("Üzenetét rögzítettük")');
 assert.equal(await evaluate('window.dataLayer.filter(x=>x[0]==="event"&&x[1]==="generate_lead").length'),1);
 assert.equal(await evaluate('JSON.stringify(window.dataLayer).includes("browser@example.test")'),false);report.crm.push('verified lead event without PII');
 await goto('/FreedomaAir');await until('Boolean(document.querySelector(".lead-form input"))');await wait(800);await shot('freedom-desktop');
 assert.equal(await evaluate('document.querySelectorAll(".fa-hero-bleed").length'),1);
 for(const width of [320,390,768,1440]){await size(width);const row=await evaluate('({route:"FreedomaAir",width:innerWidth,scroll:document.documentElement.scrollWidth})');report.layout.push(row);assert(row.scroll<=row.width+1,'Freedom overflow '+width);}
 await size(390);await shot('freedom-mobile');
 // React form: use native setter so React receives synthetic input updates.
 const setField=async value=>{await evaluate(`(()=>{const el=document.querySelector('.lead-form input:not([type=checkbox])');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`);};
 for(const value of ['Teszt Fogorvos','freedom@example.test','+36701234567']){
  await setField(value);
  if(value.startsWith('+'))await evaluate('document.querySelector(".lead-form input[type=checkbox]").click()');
  await evaluate('document.querySelector(".lead-form__btn--primary").click()');await wait(value.startsWith('+')?4500:450);
 }
 await until('Boolean(document.querySelector(".lead-form input[placeholder]"))');
 // Finish text fields, then native option grids.
 await setField('Teszt Rendelő');await evaluate('document.querySelector(".lead-form__btn--primary").click()');await wait(400);
 await setField('12345');await evaluate('document.querySelector(".lead-form__btn--primary").click()');await wait(400);
 for(let i=0;i<2;i++){
  await evaluate('document.querySelector(".lead-form__option").click()');
  await evaluate('document.querySelector(".lead-form__btn--primary").click()');await wait(600);
 }
 await until('location.pathname === "/FreedomaAir/koszonjuk"');
 assert.equal(await evaluate('location.search'),'');report.crm.push('Freedom partial and final with local thank-you route');
 // All static content routes must stay in bounds and have their images present.
 for(const route of ['/rolunk','/same-day-cirkon-koronak-hidak','/leplezett-zirkon-korona','/esthetic-anatomikus-zirkon-fogpotlas','/lathatatlan-fogszabalyozas','/implantatumra-keszult','/partnereink','/extraoralis-scanner-fogpotlas','/adatkezeles','/sutik','/impresszum']){
  await goto(route);const row=await evaluate('({route:location.pathname,width:innerWidth,scroll:document.documentElement.scrollWidth})');report.layout.push(row);assert(row.scroll<=row.width+1,route+' overflow');
 }
 await goto('/');
 await evaluate('document.querySelector("[data-cookie-open]").click();document.querySelector("[data-consent=necessary]").click()');
 await wait(800);await until('document.readyState === "complete"');
 assert.equal(await evaluate('JSON.parse(localStorage.getItem("meshdent-consent-v1")).analytics'),false);
 assert.equal(await evaluate('document.querySelectorAll("script[src*=googletagmanager]").length'),0);
 report.consentWithdrawal=true;
 await goto('/');await send('Emulation.setScriptExecutionDisabled',{value:true});await goto('/');
 assert.equal(await evaluate('[...document.querySelectorAll(".p-mobile-image")].every(x=>getComputedStyle(x).display!=="none")'),true);
 await send('Emulation.setScriptExecutionDisabled',{value:false});
 assert.deepEqual(report.errors,[]);
 assert.deepEqual(report.missing,[]);
 fs.writeFileSync('/tmp/meshdent-browser-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
}finally{fs.writeFileSync('/tmp/meshdent-browser-report.json',JSON.stringify(report,null,2));socket?.close();chrome.kill();server.kill();}
