import test from 'node:test';
import assert from 'node:assert/strict';
import { createCrmSession } from '../site/static/crm-client.mjs';
const config = { key: '26ff2dd524be7123e4dd8604c91801d7', honeypot: 'website_fb81d63d' };
const fields = { last_name:'Teszt', email:'test@example.test', phone:'+36701234567', company:'Szakmai érdeklődés' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
function harness(override) {
  let time = 10000; const calls = [];
  const request = async (url, options) => {
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ url, options, body });
    if (override) { const custom = await override(body, calls); if (custom) return custom; }
    if (!body) return json({ token:'render-token', ts:10 });
    if (body._partial) return json({ok:true,submission:'record-1',resume:'signed-resume'},202);
    return json({ok:true},201);
  };
  return {calls,session:createCrmSession(config,{request,now:()=>time,delay:async ms=>{time+=ms;}})};
}
test('partial and final preserve field mapping and update the same record', async () => {
  const {calls,session}=harness(); const result=await session.submitFinal(fields);
  assert.deepEqual(result,{ok:true,submission:'record-1'});
  assert.equal(calls.length,3);
  assert.equal(calls[1].body.company,'Szakmai érdeklődés');
  assert.equal(calls[1].body._partial,'1');
  assert.equal(calls[1].body.website_fb81d63d,'');
  assert.equal(calls[2].body._submission,'record-1');
  assert.equal(calls[2].body._resume,'signed-resume');
  assert.equal(calls[2].body._consent,'true');
});
test('double submit and completed retry do not send duplicate requests',async()=>{
  const {calls,session}=harness();
  await Promise.all([session.submitFinal(fields),session.submitFinal(fields)]);
  await session.submitFinal(fields); assert.equal(calls.length,3);
});
test('partial validation failure stops final submission and allows correction',async()=>{
  let fail=true;
  const {calls,session}=harness(body=>body && fail?json({error:'E-mail hiba'},422):null);
  assert.equal((await session.submitFinal(fields)).kind,'validation');
  assert.equal(calls.filter(x=>x.body&&!x.body._partial).length,0);
  fail=false;assert.equal((await session.submitFinal(fields)).ok,true);
});
test('expired token refreshes once and never loops',async()=>{
  const {calls,session}=harness(body=>body?json({error:'token'},403):null);
  assert.equal((await session.submitFinal(fields)).ok,false);
  assert.equal(calls.filter(x=>x.body).length,2);
});
test('missing signed partial receipt cannot be reported as a captured lead',async()=>{
  const {calls,session}=harness(body=>body?json({ok:true},200):null);
  assert.equal((await session.submitFinal(fields)).kind,'uncertain');
  assert.equal(calls.length,2);
});
test('ambiguous network failure never blindly resubmits',async()=>{
  const {calls,session}=harness(body=>{if(body)throw new Error('timeout');return null;});
  assert.equal((await session.submitFinal(fields)).kind,'uncertain');
  await session.submitFinal(fields);assert.equal(calls.length,2);
});
test('final server failure retains the signed record and does not create a new lead',async()=>{
  const {calls,session}=harness(body=>body && !body._partial?json({error:'down'},503):null);
  assert.equal((await session.submitFinal(fields)).kind,'uncertain');
  await session.submitFinal(fields);
  assert.equal(calls.filter(x=>x.body?._partial).length,1);
});
test('untrusted attributes cannot override form fields or consent',async()=>{
  const {calls,session}=harness();await session.submitFinal(fields,{email:'wrong@example.test',_consent:'false',page_url:'https://example.test/kapcsolat'});
  assert.equal(calls[1].body.email,fields.email);assert.equal(calls[1].body._consent,'true');assert.equal(calls[1].body.page_url,'https://example.test/kapcsolat');
});
