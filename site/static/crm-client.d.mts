export type CrmResult = { ok: true; submission?: string } | { ok: false; kind: string; error: string };
export type CrmSession = {
  prepare(): Promise<unknown>;
  savePartial(fields: Record<string,string>, attribution?: Record<string,string>): Promise<CrmResult>;
  submitFinal(fields: Record<string,string>, attribution?: Record<string,string>): Promise<CrmResult>;
};
export function createCrmSession(config: {key:string;honeypot:string}): CrmSession;
