const RULES=[
['RefCom number',/(?:R[E3]F\s*[-.:/]?\s*C[O0]M|R[E3]FC[O0]M)\s*(?:NO\.?|NUMBER|#)?\s*[:#\-./]?\s*([A-Z0-9]{3,20}(?:[-/.][A-Z0-9]{1,12})*)/gi],
['Police ID number',/POLICE\s*(?:ID\s*)?(?:NO\.?|NUMBER)?\s*[:#\-]?\s*([A-Z0-9]{3,20}(?:[-/.][A-Z0-9]{1,12})*)/gi],
['Passport number',/(?:PASSPORT|TRAVEL\s*DOCUMENT)\s*(?:NO\.?|NUMBER)?\s*[:#\-]?\s*([A-Z0-9][A-Z0-9\s\-/.]{3,30})/gi],
['Document serial number',/SERIAL\s*NUMBER(?:,\s*IF\s*APPLICABLE)?\s*[:#\-]?\s*([A-Z0-9][A-Z0-9\s\-/.]{3,30})/gi],
['Visa number',/(?:INDICATE\s*)?VISA\s*(?:NO\.?|NUMBER)\s*[:#\-]?\s*([A-Z0-9\-/.]{4,24})/gi],
['Residence permit number',/RESIDENCE\s*PERMIT\s*(?:NO\.?|NUMBER)?\s*[:#\-]?\s*([A-Z0-9\-/.]{3,24})/gi],
['Application number',/APPLICATION\s*(?:NO\.?|NUMBER|REFERENCE)\s*[:#\-]?\s*([A-Z0-9\-/.]{3,28})/gi],
['Case number',/CASE\s*(?:NO\.?|NUMBER|REFERENCE)\s*[:#\-]?\s*([A-Z0-9\-/.]{3,28})/gi],
['Date of birth',/(?:DATE\s*OF\s*BIRTH|D\.?O\.?B\.?)\s*[:\-]?\s*((?:0?[1-9]|[12]\d|3[01])[/.\-](?:0?[1-9]|1[0-2])[/.\-](?:19|20)\d{2})/gi],
['Contact number',/(?:CONTACT|TELEPHONE|MOBILE)\s*(?:NO\.?|NUMBER)?\s*[:#\-]?\s*(\+?\d[\d\s().-]{6,18}\d)/gi],
['Email address',/\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/gi]
];
const clean=s=>s.replace(/\s+/g,' ').replace(/^[\s:;,.\-]+|[\s:;,.\-]+$/g,'').trim();
export function analyse(text,names=true,source='text'){const out=[];for(const[type,re]of RULES)for(const m of text.matchAll(re)){const value=clean(m[1]||m[0]);if(value)out.push({type,value,context:clean(text.slice(Math.max(0,m.index-55),m.index+m[0].length+75)),source})}if(names)for(const m of text.matchAll(/(?:SURNAME|FULL\s*NAME|FORENAME|FIRST\s*NAME|LAST\s*NAME|APPLICANT|HOLDER|MOTHER|FATHER|\bNAME)\s*[:\-]?\s*[\r\n ]+([A-ZÀ-ÖØ-Þ][A-ZÀ-ÖØ-Þ'’-]{1,28}(?: +[A-ZÀ-ÖØ-Þ][A-ZÀ-ÖØ-Þ'’-]{1,28}){0,3})/g))out.push({type:'Name',value:clean(m[1]),context:clean(m[0]),source});const seen=new Set();return out.filter(f=>{const key=f.type+'|'+f.value.toUpperCase();if(seen.has(key))return false;seen.add(key);return true})}
export const IPA_LABELS=[
{type:'RefCom number',labels:['REFCOM NO','REF COM NO','REFCOM NUMBER'],rows:1},
{type:'Police ID number',labels:['POLICE ID NO','POLICE NO'],rows:1},
{type:'Surname',labels:['SURNAME (IN CAPS)','SURNAME'],rows:1},
{type:'Name',labels:['FULL NAME','FORENAME','NAME'],rows:1},
{type:'Date of birth',labels:['DATE OF BIRTH','D.O.B.','DOB'],rows:1},
{type:'Address',labels:['ADDRESS'],rows:4},
{type:'Contact number',labels:['CONTACT NO','CONTACT NUMBER','MOBILE NO'],rows:1},
{type:'Passport number',labels:['PASSPORT NO','PASSPORT NUMBER'],rows:1},
{type:'Document serial number',labels:['SERIAL NUMBER, IF APPLICABLE','SERIAL NUMBER'],rows:1},
{type:'Visa number',labels:['INDICATE VISA NUMBER','VISA NUMBER'],rows:1},
{type:'Residence permit number',labels:['RESIDENCE PERMIT NUMBER','RESIDENCE PERMIT NO'],rows:1},
{type:'Application number',labels:['APPLICATION NUMBER','APPLICATION NO'],rows:1},
{type:'Case number',labels:['CASE NUMBER','CASE NO'],rows:1},
{type:'Signature',labels:['SIGNATURE OF APPLICANT/LEGAL GUARDIAN/REPRESENTATIVE','SIGNATURE OF APPLICANT','SIGNATURE OF INTERPRETER','SIGNATURE OF REGISTRATION OFFICER'],rows:2}
];
