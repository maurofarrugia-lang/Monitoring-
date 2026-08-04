import{analyse}from'../patterns/index.js';
const text='REFCOM NO.\n39125\nPOLICE ID NO.\n39125\nDATE OF BIRTH\n12/11/1997\nNAME\nVUYO\nRESIDENCE PERMIT NO. AB-1234';
const f=analyse(text,true,'test');
for(const [type,value] of [['RefCom number','39125'],['Police ID number','39125'],['Date of birth','12/11/1997'],['Name','VUYO'],['Residence permit number','AB-1234']])if(!f.some(x=>x.type===type&&x.value.includes(value)))throw Error(`${type} failed`);
console.log('Pattern tests passed');
