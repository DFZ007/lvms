// Las Vegas Music School site scripts

(function(){
 var megas=document.querySelectorAll('.mega.reveal');
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);}});},{threshold:.25});megas.forEach(function(m){io.observe(m);});}
 else megas.forEach(function(m){m.classList.add('on')});
 // replay the hero when returning to Home
 
})();

(function(){
var t=document.querySelector('.tog'),n=document.getElementById('nav');
if(t){t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o);t.textContent=o?'Close':'Menu';});}
var d=document.getElementById('daytime'),grid=document.getElementById('faculty');
if(!grid)return;
var cards=[].slice.call(grid.querySelectorAll('.card')),fs=[].slice.call(document.querySelectorAll('.f[data-filter]')),cur='all',cnt=document.getElementById('count'),em=document.getElementById('empty');
function apply(){var s=0;cards.forEach(function(c){var ok=(cur==='all'||c.dataset.family===cur)&&(!d.checked||c.dataset.daytime==='yes');c.hidden=!ok;if(ok)s++;});em.hidden=s>0;cnt.textContent=s+(s===1?' instructor':' instructors');}
fs.forEach(function(f){f.addEventListener('click',function(){fs.forEach(function(x){x.setAttribute('aria-pressed','false')});f.setAttribute('aria-pressed','true');cur=f.dataset.filter;apply();});});
d.addEventListener('change',apply);if(location.hash==='#daytime')d.checked=true;apply();
})();

(function(){
if(!document.getElementById('cal'))return;
var L=window.LVMS,LOCS=L.LOCS,INST=L.INST,slots=L.slots,base=L.base,today=L.today;
var BANDS=[{k:"morning",n:"Morning",t:"9am–12pm",h:[9,10,11]},{k:"midday",n:"Midday",t:"12–3pm",h:[12,13,14]},{k:"after",n:"After school",t:"3–6pm",h:[15,16,17]},{k:"evening",n:"Evening",t:"6–9pm",h:[18,19,20]}];
var DAYN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var state={wk:0,loc:"all",inst:"",dayonly:false,sel:null};
var sel=document.getElementById('inst');INST.slice().sort().forEach(function(i){var o=document.createElement('option');o.value=i;o.textContent=i;sel.appendChild(o);});
function fmtT(h,m){var ap=h<12?'am':'pm';var hh=h%12||12;return hh+(m?':'+String(m).padStart(2,'0'):'')+ap;}
function fmtD(d){return DAYN[d.getDay()]+' '+d.toLocaleDateString('en-US',{month:'short',day:'numeric'});}
function isPast(s){var t=new Date(s.date);t.setHours(s.hr,s.min);return t<new Date();}
function match(s,ignoreLoc){return (ignoreLoc||state.loc==="all"||s.loc==state.loc)&&(!state.inst||s.inst===state.inst)&&(!state.dayonly||s.daytime)&&!isPast(s);}
function bandOf(h){for(var i=0;i<BANDS.length;i++)if(BANDS[i].h.indexOf(h)>-1)return i;return -1;}
var cal=document.getElementById('cal');
function render(){
 var start=state.wk*7;var wkStart=new Date(base);wkStart.setDate(base.getDate()+start);var wkEnd=new Date(wkStart);wkEnd.setDate(wkStart.getDate()+6);
 document.getElementById('wklabel').textContent=(state.wk===0?'This week':'Next week')+', '+wkStart.toLocaleDateString('en-US',{month:'short',day:'numeric'})+'–'+wkEnd.toLocaleDateString('en-US',{month:'short',day:'numeric'});
 document.getElementById('prevw').disabled=state.wk===0;document.getElementById('nextw').disabled=state.wk===1;
 var h='<div class="hd" role="columnheader"></div>';
 for(var i=0;i<7;i++){var d=new Date(wkStart);d.setDate(wkStart.getDate()+i);h+='<div class="hd'+(d.getTime()===today.getTime()?' today':'')+'" role="columnheader">'+DAYN[d.getDay()]+'<b>'+d.getDate()+'</b></div>';}
 BANDS.forEach(function(b,bi){h+='<div class="bnd" role="rowheader">'+b.n+'<span>'+b.t+'</span></div>';
  for(var i=0;i<7;i++){var dd=start+i;var d=new Date(wkStart);d.setDate(wkStart.getDate()+i);var dow=d.getDay();var wkend=dow===0||dow===6;
   var inBand=slots.filter(function(s){return s.dd===dd&&bandOf(s.hr)===bi&&match(s)});
   var end=new Date(d);end.setHours(b.h[b.h.length-1]+1);var past=end<new Date();
   var closed=wkend&&bi===3;
   var cls='cell',c,l;
   if(past){cls+=' past';c='–';l='Past';}
   else if(closed){cls+=' full';c='Closed';l='';}
   else if(!inBand.length){cls+=' full';c='Full';l='';}
   else{cls+=(!wkend&&bi<2)?' day':' some';c=inBand.length;l=inBand.length===1?'opening':'openings';}
   var key=dd+'-'+bi;if(state.sel===key)cls+=' sel';
   var lab=DAYN[dow]+' '+b.n+': '+(typeof c==='number'?c+' '+l:c);
   h+='<button type="button" role="gridcell" class="'+cls+'" data-key="'+key+'" aria-label="'+lab+'"'+((past||closed||!inBand.length)?' disabled':'')+'><span class="c">'+c+'</span><span class="l">'+l+'</span></button>';}});
 cal.innerHTML=h;
 renderSlots();renderSum();
}
function renderSlots(){var hd=document.getElementById('slotsh'),ls=document.getElementById('slotl');
 if(!state.sel){hd.textContent='Choose a time block to see open lessons.';ls.innerHTML='';return;}
 var p=state.sel.split('-'),dd=+p[0],bi=+p[1];
 var list=slots.filter(function(s){return s.dd===dd&&bandOf(s.hr)===bi&&match(s)}).sort(function(a,b){return a.hr*60+a.min-(b.hr*60+b.min)||a.loc-b.loc});
 if(!list.length){state.sel=null;return renderSlots();}
 hd.textContent=fmtD(list[0].date)+', '+BANDS[bi].n.toLowerCase()+' ('+list.length+' open)';
 ls.innerHTML=list.map(function(s){return '<div class="slot"><span class="tm">'+fmtT(s.hr,s.min)+'</span><span>'+s.inst+'</span><span class="hs">'+s.who+'</span><span class="hs">'+LOCS[s.loc]+'</span><a href="book.html?slot='+s.id+'">Book</a></div>';}).join('');
}
function renderSum(){var start=state.wk*7;var rows=LOCS.map(function(n,li){var list=slots.filter(function(s){return s.loc===li&&s.dd>=start&&s.dd<start+7&&match(s,true)});
  var day=list.filter(function(s){return s.daytime}).length;list.sort(function(a,b){return (a.dd*1440+a.hr*60+a.min)-(b.dd*1440+b.hr*60+b.min)});
  var nx=list[0]?fmtD(list[0].date)+', '+fmtT(list[0].hr,list[0].min):'None';
  return '<tr><td><button type="button" data-l="'+li+'">'+n+'</button></td><td><b>'+list.length+'</b></td><td class="hide-s">'+day+'</td><td>'+nx+'</td></tr>';});
 document.getElementById('locsum').innerHTML=rows.join('');
}
cal.addEventListener('click',function(e){var b=e.target.closest('.cell');if(!b||b.disabled)return;state.sel=b.dataset.key;render();document.getElementById('slots').scrollIntoView({block:'nearest'});});
var lf=[].slice.call(document.querySelectorAll('#locf .f'));
function setLoc(v){state.loc=v;lf.forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.loc===String(v)))});render();}
lf.forEach(function(f){f.addEventListener('click',function(){setLoc(f.dataset.loc)})});
document.getElementById('locsum').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;setLoc(b.dataset.l);document.getElementById('locf').scrollIntoView({block:'center'});});
sel.addEventListener('change',function(){state.inst=sel.value;render();});
document.getElementById('dayonly').addEventListener('change',function(e){state.dayonly=e.target.checked;render();});
document.getElementById('prevw').addEventListener('click',function(){state.wk=0;state.sel=null;render();});
document.getElementById('nextw').addEventListener('click',function(){state.wk=1;state.sel=null;render();});
if(location.hash==='#daytime'){document.getElementById('dayonly').checked=true;state.dayonly=true;}
render();
})();
