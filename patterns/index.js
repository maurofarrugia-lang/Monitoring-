const RULES=[
['RefCom number',/(?:R[E3]F\s*[-.:/]?\s*C[O0]M|R[E3]FC[O0]M)\s*(?:NO\.?|NUMBER|#)?\s*[:#\-./]?\s*([A-Z0-9]{3,20}(?:[-/.][A-Z0-9]{1,12})*)/gi],
['Police ID number',/POLICE\s*(?:ID\s*)?(?:NO\.?|NUMBER)?\s*[:#\-]?\s*([A-Z0-9]{3,20}(?:[-/.][A-Z0-9]{1,12})*)/gi],
['Passport number',/(?:PASSPORT\s*(?:NO\.?|NUMBER)|TRAVEL\s*DOCUMENT\s*(?:NO\.?|NUMBER))\s*[:#\-]?\s*([A-Z0-9][A-Z0-9\-/.]{3,24})/gi],
['Visa number',/VISA\s*(?:NO\.?|NUMBER)\s*[:#\-]?\s*([A-Z0-9\-/.]{4,24})/gi],
['Date of birth',/(?:DATE\s*OF\s*BIRTH|D\.?O\.?B\.?)\s*[:\-]?\s*((?:0?[1-9]|[12]\d|3[01])[/.\-](?:0?[1-9]|1[0-2])[/.\-](?:19|20)\d{2})/gi],
['Contact number',/(?:CONTACT|TELEPHONE|MOBILE)\s*(?:NO\.?|NUMBER)?\s*[:#\-]?\s*(\+?\d[\d\s().-]{6,18}\d)/gi],
['Email address',/\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/gi],
['Residence permit number',/RESIDENCE\s*PERMIT\s*(?:NO\.?|NUMBER)?\s*[:#\-]?\s*([A-Z0-9\-/.]{3,24})/gi]
];
const STOP=new Set(['N/A','YES','NO','MALE','FEMALE','MALTA','ZIMBABWE','UNKNOWN','SURNAME','NAME']);
const tidy=s=>s.replace(/\s+/g,' ').replace(/^[\s:;,.\-]+|[\s:;,.\-]+$/g,'').trim();
const context=(t,i,l)=>tidy(t.slice(Math.max(0,i-55),Math.min(t.length,i+l+75)));
export function analyseText(input,{names=true,source='text'}={}){const text=input.replace(/[‐‑‒–—]/g,'-').replace(/\u00a0/g,' '),out=[];for(const[type,re]of RULES)for(const m of text.matchAll(re)){const value=tidy(m[1]||m[0]);if(value&&!STOP.has(value.toUpperCase()))out.push({type,value,context:context(text,m.index,m[0].length),source})}if(names){for(const m of text.matchAll(/(?:SURNAME|FULL\s*NAME|FORENAME|APPLICANT|HOLDER|MOTHER|FATHER|\bNAME)\s*[:\-]?\s*[\r\n ]+([A-ZÀ-ÖØ-Þ][A-ZÀ-ÖØ-Þ'’-]{1,28}(?:[ ]+[A-ZÀ-ÖØ-Þ][A-ZÀ-ÖØ-Þ'’-]{1,28}){0,3})/g)){const value=tidy(m[1]);if(!STOP.has(value))out.push({type:'Name',value,context:context(text,m.index,m[0].length),source})}}const seen=new Set();return out.filter(x=>{const k=x.type+'|'+x.value.toUpperCase();if(seen.has(k))return false;seen.add(k);return true})}
export const IPA_LABELS=[
{type:'RefCom number',labels:['REFCOM NO','REF COM NO','REFCOM NUMBER'],lines:1},
{type:'Police ID number',labels:['POLICE ID NO','POLICE NO'],lines:1},
{type:'Surname',labels:['SURNAME (IN CAPS)','SURNAME'],lines:1},
{type:'Name',labels:['FULL NAME','FORENAME','NAME'],lines:1},
{type:'Date of birth',labels:['DATE OF BIRTH','D.O.B.','DOB'],lines:1},
{type:'Address',labels:['ADDRESS'],lines:4},
{type:'Contact number',labels:['CONTACT NO','CONTACT NUMBER','MOBILE NO'],lines:1},
{type:'Document serial number',labels:['SERIAL NUMBER, IF APPLICABLE','PASSPORT NO','PASSPORT NUMBER'],lines:1},
{type:'Visa number',labels:['INDICATE VISA NUMBER','VISA NUMBER'],lines:1},
{type:'Signature',labels:['SIGNATURE OF APPLICANT/LEGAL GUARDIAN/REPRESENTATIVE','SIGNATURE OF APPLICANT','SIGNATURE OF INTERPRETER','SIGNATURE OF REGISTRATION OFFICER'],lines:2}
];
