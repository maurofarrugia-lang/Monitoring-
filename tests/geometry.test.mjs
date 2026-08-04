import{ipaLabelBoxes}from'../js/geometry.js';
const items=[{text:'REFCOM',x:10,y:10,w:60,h:10},{text:'NO.',x:75,y:10,w:20,h:10},{text:'39125',x:110,y:10,w:40,h:10},{text:'ADDRESS',x:10,y:40,w:60,h:10},{text:'41',x:10,y:60,w:14,h:10},{text:'COURT',x:28,y:60,w:45,h:10}];
const b=ipaLabelBoxes(items,500,700);if(!b.some(x=>x.type==='RefCom number'&&x.box.x>95))throw Error('same-line RefCom box failed');if(!b.some(x=>x.type==='Address'&&x.box.y>45))throw Error('below-label address box failed');console.log('Geometry tests passed');
