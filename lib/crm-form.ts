import { createCrmSession as createSession } from '@/site/static/crm-client.mjs';
export type { CrmResult, CrmSession } from '@/site/static/crm-client.mjs';
export type CrmFields = { last_name:string; email:string; phone:string; company:string; fogorvosi_pecsetszam:string; milyen_szerepben:string; milyen_munkak_a_meghatarozoak_nalatok:string };
export function createCrmSession() { return createSession({ key:'b3725c8d4d3837fccbae3a3e00873109', honeypot:'website_8b61473d' }); }
