// Booking flow for book.html
// To receive requests, set FORM_ENDPOINT to a form service URL (e.g. Formspree)
// or replace submit() with the scheduling system's booking API.
var FORM_ENDPOINT = "";

(function(){
var form=document.getElementById('bookform');if(!form)return;
document.documentElement.classList.add('js');
var L=window.LVMS,steps=[].slice.call(form.querySelectorAll('.step')),cur=0;
var back=document.getElementById('back'),next=document.getElementById('next'),msg=document.getElementById('stepmsg');
var nav=[].slice.call(document.querySelectorAll('#stepnav li'));
var WHO={adult:'Myself',teen:'My teen',child:'My child'};

// locations
var lo=document.getElementById('locopts');
lo.innerHTML=L.LOCS.map(function(n,i){return '<label class="opt"><input type="radio" name="location" value="'+i+'"'+(i===0?' required':'')+'><span class="row2"><span class="t">'+n+'</span></span><span class="s">'+L.ADDR[i]+'</span></label>';}).join('');

function val(n){var el=form.querySelector('[name="'+n+'"]:checked');return el?el.value:'';}
function slotById(id){for(var i=0;i<L.slots.length;i++)if(L.slots[i].id===id)return L.slots[i];return null;}

// preselect from openings.html?slot=
var q=new URLSearchParams(location.search),pre=q.get('slot')?slotById(q.get('slot')):null;
if(pre){var li=form.querySelector('input[name=location][value="'+pre.loc+'"]');if(li)li.checked=true;var ii=form.querySelector('input[name=instrument][value="'+pre.inst+'"]');if(ii)ii.checked=true;}

function renderTimes(){
 var loc=val('location'),inst=val('instrument'),day=document.getElementById('bdayonly').checked,sel=val('slot');
 var list=L.slots.filter(function(s){return (loc===''||String(s.loc)===loc)&&(!inst||inst==='Not sure yet'||s.inst===inst)&&(!day||s.daytime)&&!L.isPast(s);});
 var seen={};list=list.filter(function(s){var k=s.dd+'-'+s.hr+'-'+s.min;if(seen[k])return false;seen[k]=1;return true;});
 list.sort(function(a,b){return (a.dd*1440+a.hr*60+a.min)-(b.dd*1440+b.hr*60+b.min)});
 document.getElementById('timehint').textContent=(loc!==''?L.LOCS[+loc]:'All locations')+(inst&&inst!=='Not sure yet'?', '+inst:'')+'. Open times for the next two weeks.';
 document.getElementById('tcount').textContent=list.length+(list.length===1?' time':' times');
 var html='',lastD=-1;
 list.forEach(function(s){if(s.dd!==lastD){if(lastD!==-1)html+='</div>';html+='<div class="dayh">'+L.fmtD(s.date)+'</div><div class="opts cols3">';lastD=s.dd;}
  html+='<label class="opt'+(s.daytime?' dayslot':'')+'"><input type="radio" name="slot" value="'+s.id+'"'+(s.id===sel?' checked':'')+'><span class="t">'+L.fmtT(s.hr,s.min)+'</span><span class="s">'+(s.daytime?'Daytime':'&nbsp;')+'</span></label>';});
 if(lastD!==-1)html+='</div>';
 if(!list.length)html='<p class="small">No open times match. Turn off "Weekday daytime only", try another location, or choose "None of these work" and we will call you.</p>';
 document.getElementById('times').innerHTML=html;
}
document.getElementById('bdayonly').addEventListener('change',renderTimes);

function slotText(){var v=val('slot');if(!v)return '';if(v==='call')return 'We will call to schedule';var s=slotById(v);return s?L.fmtD(s.date)+', '+L.fmtT(s.hr,s.min):'';}
function summary(){
 var w=val('who'),n=document.getElementById('sname').value.trim();
 return {who:w?(WHO[w]+(n?' ('+n+')':'')):'',instrument:val('instrument'),location:val('location')!==''?L.LOCS[+val('location')]:'',time:slotText(),contact:document.getElementById('cname').value.trim()};
}
function paint(){
 var s=summary();
 nav.forEach(function(li,i){li.classList.toggle('cur',i===cur);li.classList.toggle('done',i<cur||!!s[li.querySelector('b').dataset.sum]);li.querySelector('b').textContent=s[li.querySelector('b').dataset.sum]||'';if(i===cur)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
 steps.forEach(function(st,i){st.classList.toggle('on',i===cur);});
 back.disabled=cur===0;next.querySelector('span').textContent=cur===steps.length-1?'Request my assessment':'Continue';
 if(cur===4){var who=val('who');document.getElementById('contacth').textContent=who==='adult'?'Your details.':'Parent or guardian details.';
  var rows=[['Student',s.who,0],['Level',val('level')==='New'?'Brand new':'Some experience',0],['Instrument',s.instrument,1],['Location',s.location,2],['Time',s.time,3]];
  document.getElementById('review').innerHTML=rows.map(function(r){return '<div><dt class="k">'+r[0]+'</dt><dd style="margin:0">'+r[1]+'</dd><button type="button" data-go="'+r[2]+'">Change</button></div>';}).join('');}
}
document.getElementById('review').addEventListener('click',function(e){var b=e.target.closest('button[data-go]');if(b)go(+b.dataset.go);});
function check(i){
 msg.textContent='';
 if(i===0){if(!val('who'))return 'Choose who the lessons are for.';if(!document.getElementById('sname').value.trim()){document.getElementById('sname').parentNode.classList.add('bad');document.getElementById('sname').focus();return 'Enter the student\u2019s first name.';}if(!val('level'))return 'Tell us whether they are new or have some experience.';}
 if(i===1&&!val('instrument'))return 'Choose an instrument, or "Not sure yet".';
 if(i===2&&val('location')==='')return 'Choose a location or online.';
 if(i===3&&!val('slot'))return 'Choose a time, or "None of these work".';
 if(i===4){var bad=null;[['cname',function(v){return v.length>1}],['cphone',function(v){return v.replace(/\D/g,'').length>=10}],['cemail',function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}]].forEach(function(f){var el=document.getElementById(f[0]);var ok=f[1](el.value.trim());el.parentNode.classList.toggle('bad',!ok);if(!ok&&!bad)bad=el;});if(bad){bad.focus();return 'Check the highlighted fields.';}}
 return '';
}
form.addEventListener('input',function(e){if(e.target.parentNode.classList.contains('bad'))e.target.parentNode.classList.remove('bad');paint();});
form.addEventListener('change',function(e){if(e.target.name==='location'||e.target.name==='instrument')renderTimes();paint();});
function go(i){cur=i;if(cur===3)renderTimes();paint();var top=document.getElementById('bk').getBoundingClientRect().top;if(top<0)document.getElementById('bk').scrollIntoView();var h=steps[cur].querySelector('h2');h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}
back.addEventListener('click',function(){if(cur>0)go(cur-1);});
next.addEventListener('click',function(){var e=check(cur);if(e){msg.textContent=e;return;}if(cur<steps.length-1)go(cur+1);else submit();});
function submit(){
 var s=summary(),data={student_for:WHO[val('who')],student_first_name:document.getElementById('sname').value.trim(),level:val('level'),instrument:s.instrument,location:s.location,time:s.time,slot_id:val('slot'),contact_name:s.contact,phone:document.getElementById('cphone').value.trim(),email:document.getElementById('cemail').value.trim(),notes:document.getElementById('cnotes').value.trim()};
 next.disabled=true;next.querySelector('span').textContent='Sending…';
 function done(demo){document.getElementById('bk').classList.add('sent');document.getElementById('demo').hidden=!demo;
  document.getElementById('donetext').textContent=(data.time==='We will call to schedule'?'We\u2019ll call you to find a time for ':'Your requested time is '+data.time+' for ')+data.student_first_name+'\u2019s '+data.instrument.toLowerCase().replace('not sure yet','')+' assessment'+(data.location?' at '+data.location:'')+'.';
  document.getElementById('donesum').innerHTML=[['Student',s.who],['Instrument',s.instrument],['Location',s.location],['Time',s.time],['Contact',data.contact_name+', '+data.phone]].map(function(r){return '<div style="grid-template-columns:140px 1fr"><dt class="k">'+r[0]+'</dt><dd style="margin:0">'+r[1]+'</dd></div>';}).join('');
  var d=document.getElementById('done');d.focus();d.scrollIntoView({block:'start'});}
 if(!FORM_ENDPOINT){done(true);return;}
 fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
  .then(function(r){if(!r.ok)throw 0;done(false);})
  .catch(function(){next.disabled=false;next.querySelector('span').textContent='Request my assessment';msg.textContent='Your request could not be sent. Call (702) 518-1081 and we will book you in.';});
}
cur=0;paint();
if(pre){var sl=form.querySelector('input[name=slot]');renderTimes();var target=form.querySelector('input[name=slot][value="'+pre.id+'"]');if(target)target.checked=true;paint();}
})();
