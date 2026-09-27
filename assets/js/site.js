/* ---- Form delivery ------------------------------------------------------
   Every form posts to LVMS_ENDPOINT, a Cloudflare Pages Function in
   functions/api/submit.js that emails admin@lasvegasmusicschools.com.
   To use a form service instead (e.g. Formspree on GitHub Pages), set
   LVMS_ENDPOINT to its URL.                                                  */
var LVMS_ENDPOINT='/api/submit';
window.LVMS=window.LVMS||{};
LVMS.send=function(form,type,done,extra){
  var data={};try{new FormData(form).forEach(function(v,k){if(typeof v==='string'&&v.trim()!==''){data[k]=data[k]?data[k]+', '+v:v}})}catch(e){}
  var body={type:type,page:location.pathname,fields:data,extra:extra||{}};
  var btn=form.querySelector('[type=submit]'),lab=btn&&btn.innerHTML;if(btn){btn.disabled=true;btn.textContent='Sending…'}
  function fail(){if(btn){btn.disabled=false;btn.innerHTML=lab}
    var er=form.querySelector('.af-error,.sf-msg');if(er){er.hidden=false;er.textContent='Sorry, that didn’t send. Please call (702) 518-1081 or email admin@lasvegasmusicschools.com.'}}
  var ctl=('AbortController' in window)?new AbortController():null;var to=setTimeout(function(){if(ctl)ctl.abort()},15000);
  fetch(LVMS_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl?ctl.signal:undefined})
   .then(function(r){clearTimeout(to);return r.ok?r.json():Promise.reject(r.status)})
   .then(function(j){if(j&&j.ok){if(btn){btn.disabled=false;btn.innerHTML=lab}done()}else fail()})
   .catch(function(){clearTimeout(to);fail()});
};
try{(function(){
var m=document.getElementById('mast'),b=m.querySelector('.menu-btn');
b.addEventListener('click',function(){var o=m.classList.toggle('open');document.body.classList.toggle('menu-open',o);b.setAttribute('aria-expanded',o);b.textContent=o?'Close':'Menu';});
var pages=[].slice.call(document.querySelectorAll('.page'));
var LESSON=['piano','guitar','drums','woodwinds','brass','strings','lessons'];
function show(p){pages.forEach(function(x){x.hidden=x.dataset.page!==p});
 [].forEach.call(document.querySelectorAll('.lv-nav a[data-nav]'),function(a){var on=a.dataset.nav===p||(a.dataset.nav==='lessons'&&LESSON.indexOf(p)>-1)||(a.dataset.nav==='private'&&p==='adults')||(a.dataset.nav==='locations'&&p.indexOf('loc-')===0)||(a.dataset.nav==='blog'&&p.indexOf('blog')===0);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
 [].forEach.call(document.querySelectorAll('.lv-subnav a'),function(a){var h=a.dataset.to||'';(h===p)?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});}
function route(){show(LVMS.page);if(location.hash){var el=document.getElementById(location.hash.slice(1));if(el)setTimeout(function(){el.scrollIntoView()},60)}}
route();
var rv=document.getElementById('home-reviews'),pb=rv&&rv.querySelector('.lv-reviews-pause');
if(pb)pb.addEventListener('click',function(){var p=rv.classList.toggle('paused');pb.setAttribute('aria-pressed',p);pb.textContent=p?'Play':'Pause';});

})();

(function(){var t=[].slice.call(document.querySelectorAll('.lv-tile'));
if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){t.forEach(function(x){x.classList.add('in-color')});return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.intersectionRatio>=.6){var d=e.target.dataset.d||0;setTimeout(function(){e.target.classList.add('in-color')},d);io.unobserve(e.target);}});},{threshold:[0,.6]});
t.forEach(function(x,i){x.dataset.d=(i%3)*140;io.observe(x);});
window.addEventListener('hashchange',function(){t.forEach(function(x){if(!x.classList.contains('in-color'))io.observe(x);});});
})();

(function(){var w=document.getElementById('locslides');if(!w)return;
var sl=[].slice.call(w.querySelectorAll('.loc-slide')),dt=[].slice.call(w.querySelectorAll('.loc-dot')),i=0,t=null,paused=false;
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var eg=[].slice.call(document.querySelectorAll('.eng-stack img'));function go(n){if(eg.length){eg[i%eg.length].classList.remove('on');}sl[i].classList.remove('on');sl[i].setAttribute('aria-hidden','true');dt[i].classList.remove('on');i=(n+sl.length)%sl.length;sl[i].classList.add('on');sl[i].setAttribute('aria-hidden','false');dt[i].classList.add('on');if(eg.length){eg[i%eg.length].classList.add('on');}}
function start(){stop();if(!paused&&!rm)t=setInterval(function(){go(i+1)},5000);}
function stop(){if(t){clearInterval(t);t=null;}}
dt.forEach(function(d,n){d.addEventListener('click',function(){go(n);start();});});

w.addEventListener('mouseenter',stop);w.addEventListener('mouseleave',start);w.addEventListener('focusin',stop);w.addEventListener('focusout',start);
start();})();

(function(){var f=document.getElementById('sfnews');if(!f)return;var e=document.getElementById('sfemail'),m=document.getElementById('sfmsg');
f.addEventListener('submit',function(ev){ev.preventDefault();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value.trim())){m.textContent='Please enter a valid email address.';e.focus();return;}
LVMS.send(f,'Newsletter sign-up',function(){m.textContent='Thank you, you\u2019re on the list.';e.value=''});});})();

(function(){var els=[].slice.call(document.querySelectorAll('.lv-feature,.lv-portrait'));
if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(function(x){x.classList.add('in-color')});return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.intersectionRatio>=.4){e.target.classList.add('in-color');io.unobserve(e.target);}});},{threshold:[0,.4]});
els.forEach(function(x){io.observe(x);});})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){
function q(r,sel){return r.querySelector(sel)}
function qa(r,sel){return [].slice.call(r.querySelectorAll(sel))}
function val(f,n){var el=f.querySelector('[name="'+n+'"]:checked');return el?el.value:''}
function show(els,on){els.forEach(function(w){w.hidden=!on;qa(w,'input,select,textarea').forEach(function(x){x.disabled=!on})})}
function validate(f,errId){
 qa(f,'.af-invalid').forEach(function(x){x.classList.remove('af-invalid')});
 var bad=[];qa(f,'input,select,textarea').forEach(function(el){if(!el.disabled&&el.willValidate&&!el.checkValidity()){var w=el.closest('.af-field,.af-agree');if(w&&bad.indexOf(w)<0){w.classList.add('af-invalid');bad.push(w)}}});
 var err=document.getElementById(errId);
 if(bad.length){err.hidden=false;bad[0].scrollIntoView({block:'center'});var fi=q(bad[0],'input,select,textarea');if(fi)fi.focus({preventScroll:true});return false}
 err.hidden=true;return true}
function done(f,id){f.hidden=true;var d=document.getElementById(id);d.hidden=false;d.focus();d.scrollIntoView({block:'center'})}

var f=document.getElementById('apply-form');
if(f){
 var tz=document.getElementById('af-tz'),cur='America/Los_Angeles';try{cur=Intl.DateTimeFormat().resolvedOptions().timeZone||cur}catch(e){}
 var zones=['America/Los_Angeles','America/Denver','America/Phoenix','America/Chicago','America/New_York','America/Anchorage','Pacific/Honolulu'];
 try{if(Intl.supportedValuesOf)zones=Intl.supportedValuesOf('timeZone')}catch(e){}
 if(zones.indexOf(cur)<0)zones.unshift(cur);
 function lab(z){try{var p=new Intl.DateTimeFormat('en-US',{timeZone:z,timeZoneName:'short'}).formatToParts(new Date()).find(function(x){return x.type==='timeZoneName'});return z.replace(/_/g,' ')+(p?' ('+p.value+')':'')}catch(e){return z}}
 zones.forEach(function(z){var o=document.createElement('option');o.value=z;o.textContent=lab(z);if(z===cur)o.selected=true;tz.appendChild(o)});
 var box=document.getElementById('af-students'),tpl=q(box,'.af-student').cloneNode(true),add=document.getElementById('af-add');
 function renum(){var st=qa(box,'.af-student');st.forEach(function(x,i){q(x,'.af-sn').textContent=i+1;q(x,'.af-remove').hidden=st.length<2});add.hidden=st.length>=4}
 add.addEventListener('click',function(){var n=tpl.cloneNode(true);qa(n,'input,select,textarea').forEach(function(x){x.value=''});add.parentNode.parentNode.insertBefore(n,add.parentNode);renum();sync();q(n,'input').focus()});
 box.addEventListener('click',function(e){if(e.target.classList.contains('af-remove')){e.target.closest('.af-student').remove();renum();sync()}});
 function sync(){
  var mode=val(f,'mode');
  show(qa(f,'.af-if-online'),mode==='Online');
  show(qa(f,'.af-if-studio'),mode==='In studio');
  var st=f.querySelector('[name=studio]');if(st)st.required=mode==='In studio';
  var minor=qa(f,'.af-age').some(function(a){var v=parseInt(a.value,10);return !isNaN(v)&&v<18});
  var who=val(f,'who');
  show(qa(f,'.af-if-guardian'),who!=='Adult student (18+)');
  var rel=f.querySelector('[name=rel]');if(rel)rel.required=who==='Parent or guardian'||minor;
  var warn=who==='Adult student (18+)'&&minor;
  f.classList.toggle('af-minor-warn',warn);
  show(qa(f,'.af-if-needs'),val(f,'needs')==='Yes');
  var R=['I','II','III','IV','V','VI','VII'],n=0;qa(f,'.af-sec').forEach(function(x){if(!x.hidden)q(x,'.af-no').textContent=R[n++]});
 }
 f.addEventListener('change',sync);f.addEventListener('input',function(e){if(e.target.classList.contains('af-age'))sync()});
 renum();sync();
 f.addEventListener('submit',function(e){e.preventDefault();sync();
  if(f.classList.contains('af-minor-warn')){var w=q(f,'[name=who]').closest('.af-field');w.classList.add('af-invalid');document.getElementById('af-error').textContent='A parent or guardian must complete the application for students under 18.';document.getElementById('af-error').hidden=false;w.scrollIntoView({block:'center'});return}
  document.getElementById('af-error').textContent='Please complete the highlighted fields.';
  if(validate(f,'af-error')){try{var st=q(f,'[name=studio]'),md=val(f,'mode');sessionStorage.setItem('lvms_studio',md==='Online'?'online':(st&&st.value?st.value.toLowerCase().replace(/ /g,'-'):''));sessionStorage.setItem('lvms_book',JSON.stringify({n:q(f,'[name=name]').value,e:q(f,'[name=email]').value,p:q(f,'[name=phone]').value,i:q(f,'[name=instrument]').value}))}catch(x){}LVMS.send(f,'Application',function(){f.reset();location.href=LVMS.url('book')})}});
}
var c=document.getElementById('contact-form');
if(c){
 function csync(){var who=val(c,'c_who');show(qa(c,'.af-if-cguardian'),who==='A parent or guardian');q(c,'.af-teen').hidden=who!=='A teen student';var pr=val(c,'c_pref'),ph=q(c,'[name=c_phone]'),opt=q(c,'.af-opt');ph.required=(pr==='Phone'||pr==='Text');opt.textContent=ph.required?'':'(optional)';var l=ph.closest('.af-field').querySelector('.af-label');var st=l.querySelector('.af-req');if(ph.required&&!st){st=document.createElement('span');st.className='af-req';st.setAttribute('aria-hidden','true');st.textContent='*';l.appendChild(st)}else if(!ph.required&&st){st.remove()}}
 c.addEventListener('change',csync);csync();
 c.addEventListener('submit',function(e){e.preventDefault();if(validate(c,'cf-error')){try{sessionStorage.setItem('lvms_name',q(c,'[name=c_name]').value.trim().split(' ')[0])}catch(x){}LVMS.send(c,'Contact message',function(){c.reset();location.href=LVMS.url('thank-you-contact')})}});
}
})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){var h=document.querySelector('.hero-full');if(!h)return;function go(){h.classList.add('in-color');window.removeEventListener('scroll',on)}function on(){if(window.scrollY>30)go()}window.addEventListener('scroll',on,{passive:true});setTimeout(go,2600)})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){
var m=document.getElementById('mast');
function st(){m.classList.toggle('is-stuck',window.scrollY>40)}window.addEventListener('scroll',st,{passive:true});st();
var d=document.getElementById('dl-modal'),f=document.getElementById('dl-form');
function open(){f.hidden=false;f.parentNode.hidden=false;d.querySelector('.dl-done').hidden=true;f.reset();d.showModal();}
document.addEventListener('click',function(e){var a=e.target.closest('a[data-dl-modal]');if(a){e.preventDefault();e.stopPropagation();open()}},true);
d.querySelector('.dl-x').addEventListener('click',function(){d.close()});
d.addEventListener('click',function(e){if(e.target===d)d.close()});
d.addEventListener('click',function(e){if(e.target.closest('.dl-done a[href="#apply"]'))d.close()});
f.addEventListener('submit',function(e){e.preventDefault();var ok=f.d_name.value.trim()&&f.d_email.checkValidity()&&f.d_email.value;[f.d_name,f.d_email].forEach(function(x){x.closest('.af-field').classList.toggle('af-invalid',!x.value.trim()||!x.checkValidity())});document.getElementById('dl-error').hidden=!!ok;if(!ok)return;try{sessionStorage.setItem('lvms_name',f.d_name.value.trim())}catch(x){}LVMS.send(f,'Curriculum guide request',function(){d.close();location.href=LVMS.url('thank-you-guide')});});
})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){var m=document.querySelector('.motto');if(!m||!('IntersectionObserver' in window)){if(m)m.classList.add('playing');return}
var art=m.querySelector('.motto-art');
new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!m.classList.contains('playing')){art.style.animation='none';void art.offsetWidth;art.style.animation='';m.classList.add('playing')}}else{m.classList.remove('playing')}})},{threshold:.15}).observe(m);})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{[].forEach.call(document.querySelectorAll('.ar'),function(r){var sl=[].slice.call(r.querySelectorAll('.ar-slide')),d=[].slice.call(r.querySelectorAll('.ar-dots span')),i=0,t;
function go(n){sl[i].classList.remove('on');sl[i].setAttribute('aria-hidden','true');d[i].classList.remove('on');i=n;sl[i].classList.add('on');sl[i].setAttribute('aria-hidden','false');d[i].classList.add('on')}
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
function start(){stop();t=setInterval(function(){go((i+1)%sl.length)},5500)}function stop(){clearInterval(t)}
r.addEventListener('mouseenter',stop);r.addEventListener('mouseleave',start);start();});
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){[].forEach.call(document.querySelectorAll('.gform'),function(f){f.addEventListener('submit',function(e){e.preventDefault();var n=f.g_name,m=f.g_email,ok=n.value.trim()&&m.value&&m.checkValidity();[n,m].forEach(function(x){x.closest('.af-field').classList.toggle('af-invalid',!x.value.trim()||!x.checkValidity())});f.querySelector('.af-error').hidden=!!ok;if(!ok)return;try{sessionStorage.setItem('lvms_name',n.value.trim())}catch(x){}LVMS.send(f,'Curriculum guide request',function(){f.reset();location.href=LVMS.url('thank-you-guide')});});});})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){var K=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'],d={};
try{d=JSON.parse(sessionStorage.getItem('lvms_attr')||'{}')}catch(e){}
var q=new URLSearchParams(location.search),hit=false;K.forEach(function(k){var v=q.get(k);if(v){d[k]=v;hit=true}});
if(!d.landing_page){d.landing_page=location.href;d.referrer=document.referrer||'(direct)'}
try{sessionStorage.setItem('lvms_attr',JSON.stringify(d))}catch(e){}
[].forEach.call(document.querySelectorAll('.utm input'),function(i){if(d[i.name])i.value=d[i.name]});})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){function nm(){var n='';try{n=sessionStorage.getItem('lvms_name')||''}catch(e){}[].forEach.call(document.querySelectorAll('.ty-name'),function(x){x.textContent=n?', '+n:''})}
window.addEventListener('hashchange',nm);nm();
document.addEventListener('click',function(e){var a=e.target.closest('[data-demo-pdf]');if(a){e.preventDefault();var h=a.closest('.stack').querySelector('.ty-demo');if(h)h.hidden=false}});})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){var h=document.querySelector('.hero-masters');if(!h)return;var sl=[].slice.call(h.querySelectorAll('.ms-slide')),dt=[].slice.call(h.querySelectorAll('.ms-dot')),i=0,t;
function go(n){sl[i].classList.remove('on');sl[i].setAttribute('aria-hidden','true');dt[i].classList.remove('on');i=n;sl[i].classList.add('on');sl[i].setAttribute('aria-hidden','false');dt[i].classList.add('on')}
dt.forEach(function(d,n){d.addEventListener('click',function(){go(n);start()})});
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
function start(){clearInterval(t);t=setInterval(function(){go((i+1)%sl.length)},rm?9000:6500)}
document.addEventListener('visibilitychange',function(){document.hidden?clearInterval(t):start()});start();})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){var R=document.getElementById('bk');if(!R)return;
var q=function(x){return R.querySelector(x)},qa=function(x){return [].slice.call(R.querySelectorAll(x))};
var st={studio:null,name:'',addr:'',day:null,time:null},today=new Date();today.setHours(0,0,0,0);
var view=new Date(today);view.setDate(view.getDate()-((view.getDay()+6)%7));var view0=new Date(view);
var MN=['January','February','March','April','May','June','July','August','September','October','November','December'],DN=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
function hash(str){var h=2166136261;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)/4294967295}
function key(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function slots(d){var wd=d.getDay(),we=(wd===0||wd===6),start=we?9:7,end=we?20:22,out=[];
 for(var h=start;h<end;h++){for(var m=0;m<60;m+=30){var r=hash(st.studio+key(d)+h+':'+m),day=!we&&h<15,after=!we&&h>=15&&h<19;
  var p=day?.55:after?.08:.3;if(r<p)out.push({h:h,m:m,daytime:day})}}return out}
function fmt(h,m){var ap=h<12?'am':'pm',hh=h%12||12;return hh+(m?':'+('0'+m).slice(-2):'')+ap}
function set(id,v){document.getElementById(id).textContent=v}
function studioPick(b){qa('.bk-studio').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});
 st.studio=b.dataset.id;st.name=b.dataset.name;st.addr=b.dataset.addr;st.day=null;st.time=null;
 set('bk-v-studio',st.name);set('bk-v-day','Not chosen');set('bk-v-time','Not chosen');
 q('#bk-s2').classList.remove('bk-off');q('#bk-s3').classList.add('bk-off');q('.bk-slots').innerHTML='';
 q('.bk-tz').textContent=st.studio==='online'?'Las Vegas time (PT). We confirm in your time zone.':'Las Vegas time (PT)';cal();check()}
qa('.bk-studio').forEach(function(b){b.addEventListener('click',function(){studioPick(b);q('#bk-s2').scrollIntoView({behavior:'smooth',block:'start'})})});qa('.bk-studio').forEach(function(b){b.addEventListener('bk-pick',function(){studioPick(b)})});
qa('.bk-arrow').forEach(function(a){a.addEventListener('click',function(){var n=new Date(view);n.setDate(n.getDate()+28*(+a.dataset.dir));if(n<view0||n>new Date(today.getTime()+60*864e5))return;view=n;cal()})});
function cal(){var endV=new Date(view);endV.setDate(endV.getDate()+27);var o={month:'short',day:'numeric'};q('.bk-mname').textContent=view.toLocaleDateString('en-US',o)+' – '+endV.toLocaleDateString('en-US',o);
 var c=q('.bk-cal');c.innerHTML=DN.map(function(d){return '<span class="bk-dow">'+d+'</span>'}).join('');var max=new Date(today);max.setDate(max.getDate()+60);
 for(var i=0;i<28;i++){var dt=new Date(view);dt.setDate(dt.getDate()+i);var ok=dt>today&&dt<=max&&st.studio,sl=ok?slots(dt):[],dayN=sl.filter(function(x){return x.daytime}).length;
  var b=document.createElement('button');b.type='button';b.className='bk-day'+(sl.length?' av':'')+(dayN>2?' dt':'')+(st.day&&key(st.day)===key(dt)?' on':'');b.disabled=!sl.length;
  b.innerHTML=(dt.getDate()===1||i===0?'<em>'+MN[dt.getMonth()].slice(0,3)+'</em>':'')+'<b>'+dt.getDate()+'</b>'+(sl.length?'<small>'+sl.length+' open</small>':'');b.setAttribute('aria-label',dt.toDateString()+(sl.length?', '+sl.length+' times':' unavailable'));
  (function(dt){b.addEventListener('click',function(){st.day=dt;st.time=null;set('bk-v-day',dt.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}));set('bk-v-time','Not chosen');cal();times();q('#bk-s3').scrollIntoView({behavior:'smooth',block:'start'})})})(dt);c.appendChild(b)}
 check()}
function times(){var sl=slots(st.day),g={Morning:[],Midday:[],Afternoon:[],Evening:[]};
 sl.forEach(function(x){(x.h<11?g.Morning:x.h<14?g.Midday:x.h<17?g.Afternoon:g.Evening).push(x)});
 var html='';for(var k in g){if(!g[k].length)continue;html+='<div class="bk-grp"><h3>'+k+'</h3><div class="bk-times">'+g[k].map(function(x){return '<button type="button" class="bk-t'+(x.daytime?' dt':'')+'" data-t="'+x.h+':'+x.m+'">'+fmt(x.h,x.m)+'</button>'}).join('')+'</div></div>'}
 var s3=q('#bk-s3');s3.classList.remove('bk-off');q('.bk-slots').innerHTML=html;
 qa('.bk-t').forEach(function(b){b.addEventListener('click',function(){qa('.bk-t').forEach(function(x){x.classList.toggle('on',x===b)});var t=b.dataset.t.split(':');st.time={h:+t[0],m:+t[1]};set('bk-v-time',fmt(st.time.h,st.time.m)+' – '+fmt(st.time.h+(st.time.m?1:0),(st.time.m+30)%60));check();if(innerWidth<900)q('.bk-card').scrollIntoView({behavior:'smooth',block:'start'})})});check()}
function check(){q('.bk-go').disabled=!(st.studio&&st.day&&st.time)}
var f=document.getElementById('bk-form');
f.addEventListener('submit',function(e){e.preventDefault();var ok=st.time;[].forEach.call(f.querySelectorAll('input[required]'),function(x){var bad=!x.value.trim()||!x.checkValidity();x.closest('.af-field').classList.toggle('af-invalid',bad);if(bad)ok=false});document.getElementById('bk-err').hidden=!!ok;if(!ok)return;
 var d=st.day,s=new Date(d);s.setHours(st.time.h,st.time.m);var e2=new Date(s.getTime()+30*60000),z=function(x){return x.getFullYear()+('0'+(x.getMonth()+1)).slice(-2)+('0'+x.getDate()).slice(-2)+'T'+('0'+x.getHours()).slice(-2)+('0'+x.getMinutes()).slice(-2)+'00'};
 var where=st.studio==='online'?'Online (link to follow)':'Las Vegas Music School, '+st.name+', '+st.addr;
 R.querySelector('.bk-gcal')||0;var done=document.getElementById('bk-done');done.querySelector('.bk-gcal').href='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent('Initial Assessment, Las Vegas Music School')+'&dates='+z(s)+'/'+z(e2)+'&ctz=America/Los_Angeles&location='+encodeURIComponent(where);
 done.querySelector('.bk-dn').textContent=f.b_name.value.trim()?', '+f.b_name.value.trim().split(' ')[0]:'';
 done.querySelector('.bk-done-line').textContent=d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})+' at '+fmt(st.time.h,st.time.m)+', '+(st.studio==='online'?'online on Zoom or Google Meet. We will email your link.':st.name+', '+st.addr+'.')+' A confirmation is on its way to '+f.b_email.value+'.';
 try{var fn=f.b_name.value.trim().split(' ')[0];sessionStorage.setItem('lvms_req',JSON.stringify({n:fn,w:d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})+' at '+fmt(st.time.h,st.time.m)+' (requested)',p:st.studio==='online'?'Online, on Zoom or Google Meet':st.name+', '+st.addr,i:(f.b_instr&&f.b_instr.value)||'',c:[f.b_phone&&f.b_phone.value.trim(),f.b_email.value.trim()].filter(Boolean).join(' · '),g:done.querySelector('.bk-gcal').href.replace(encodeURIComponent('Initial Assessment, Las Vegas Music School'),encodeURIComponent('Initial Assessment (requested), Las Vegas Music School'))}))}catch(x){}try{window.dataLayer=window.dataLayer||[];dataLayer.push({event:'generate_lead',lead_type:'assessment_request',studio:st.studio})}catch(x){}var X={};try{var RQ=JSON.parse(sessionStorage.getItem('lvms_req')||'{}');X={'Requested time':RQ.w,'Studio':RQ.p}}catch(x){}LVMS.send(f,'Assessment request',function(){f.reset();location.href=LVMS.url('thank-you-assessment')},X)});
function pre(){var id='';try{id=sessionStorage.getItem('lvms_studio')||'';var b=JSON.parse(sessionStorage.getItem('lvms_book')||'null');if(b){if(b.n)f.b_name.value=b.n;if(b.e)f.b_email.value=b.e;if(b.p)f.b_phone.value=b.p;if(b.i)f.b_instr.value=b.i;sessionStorage.removeItem('lvms_book')}sessionStorage.removeItem('lvms_studio')}catch(x){}
 if(id){var b2=q('.bk-studio[data-id="'+id+'"]');if(b2)studioPick(b2)}}
document.addEventListener('click',function(e){var a=e.target.closest('a[data-studio]');if(a){try{sessionStorage.setItem('lvms_studio',a.dataset.studio)}catch(x){}}},true);
window.addEventListener('hashchange',function(){if(LVMS.page==='book'){R.hidden=false;document.querySelector('.bk-intro').hidden=false;document.getElementById('bk-done').hidden=true;pre()}});
if(LVMS.page==='book')pre();cal();
})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){var g=document.getElementById('schedule');if(!g)return;var HIDE=['thank-you-guide','thank-you-contact','sitemap'];
function f(){var h=LVMS.page;var pg=document.querySelector('.page:not([hidden])');var id=pg?pg.dataset.page:'home';g.hidden=HIDE.indexOf(id)>-1;if(id.indexOf('loc-')===0){var b=document.querySelector('.bk-studio[data-id="'+id.slice(4)+'"]');if(b&&!b.classList.contains('on'))b.dispatchEvent(new CustomEvent('bk-pick'))}if(h==='book'){setTimeout(function(){g.scrollIntoView({block:'start'})},30)}}
window.addEventListener('hashchange',function(){setTimeout(f,0)});f();
document.addEventListener('click',function(e){var a=e.target.closest('a[href="#schedule"]');if(a){e.preventDefault();g.scrollIntoView({behavior:'smooth',block:'start'})}});})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){var f=document.getElementById('gc-form');if(!f)return;var pg=f.closest('.page');
var OPT={m30:{a:200,l:'A month of weekly half-hour lessons'},m60:{a:400,l:'A month of weekly one-hour lessons'},q30:{a:600,l:'Three months of weekly half-hour lessons'},custom:{a:0,l:'Toward private lessons'}};
function q(x){return pg.querySelector(x)}function set(x,v){q(x).textContent=v}
function opt(){var x=f.querySelector('[name=gc_opt]:checked');return x?x.value:'m30'}
function amt(){var o=opt();return o==='custom'?Math.round(+f.gc_amt.value||0):OPT[o].a}
function money(n){return '$'+n.toLocaleString('en-US')}
var code='LVMS · '+Math.random().toString(36).slice(2,6).toUpperCase()+' · '+Math.random().toString(36).slice(2,6).toUpperCase();
function upd(){var o=opt(),a=amt();q('.gc-custom').hidden=o!=='custom';
 set('.gcv-amt',a?money(a):'$—');set('.gcv-line',OPT[o].l);set('.gc-sum',a?money(a):'$—');
 set('.gcv-to',f.gc_to.value.trim()||'someone special');var fr=f.gc_from.value.trim();set('.gcv-from',fr);var ex=new Date();ex.setFullYear(ex.getFullYear()+5);var mm=('0'+(ex.getMonth()+1)).slice(-2),yy=String(ex.getFullYear()).slice(-2);set('.x1',mm[0]);set('.x2',mm[1]);set('.x3',yy[0]);set('.x4',yy[1]);
 var n=f.gc_note.value.trim();set('.gcv-note',n?'“'+n+'”':'');set('.gc-count',f.gc_note.value.length);set('.gcv-code','Gift code '+code);
 var them=(f.querySelector('[name=gc_del]:checked')||{}).value!=='me';[].forEach.call(pg.querySelectorAll('.gc-if-them'),function(x){x.hidden=!them});f.gc_toemail.required=them}
f.addEventListener('input',upd);f.addEventListener('change',upd);upd();
f.addEventListener('submit',function(e){e.preventDefault();var ok=true;
 [].forEach.call(f.querySelectorAll('.af-field'),function(x){x.classList.remove('af-invalid')});
 [].forEach.call(f.querySelectorAll('input[required]'),function(x){if(x.closest('[hidden]'))return;var bad=!x.value.trim()||!x.checkValidity();if(bad){x.closest('.af-field').classList.add('af-invalid');ok=false}});
 if(opt()==='custom'){var a=amt();if(a<50||a>1000){q('.gc-custom').classList.add('af-invalid');ok=false}}
 q('#gc-err').hidden=ok;if(!ok)return;
 var to=f.gc_to.value.trim(),them=(f.querySelector('[name=gc_del]:checked')||{}).value!=='me',d=f.gc_date.value;
 set('.gc-dn','Thank you, '+f.gc_from.value.trim().split(' ')[0]);
 set('.gc-done-line',money(amt())+' for '+to+'. '+(them?(d?'Once paid, it will arrive in '+to+'’s inbox on '+new Date(d+'T12:00').toLocaleDateString('en-US',{month:'long',day:'numeric'})+', ':'Once paid, it goes to '+f.gc_toemail.value.trim()+', ')+'with your note and a copy to you.':'Once paid, it comes to your inbox, ready to print or forward.')+' We\u2019ll email a secure payment link to '+f.gc_fromemail.value.trim()+'. The card is sent once payment is complete.');
 var X={Amount:money(amt()),Option:(OPT[opt()]||{}).l||''};LVMS.send(f,'Gift card order',function(){q('#gc-main').hidden=true;var dn=q('#gc-done');dn.hidden=false;dn.focus({preventScroll:true});window.scrollTo({top:dn.getBoundingClientRect().top+window.scrollY-140,behavior:'smooth'})},X)});
q('.gc-again').addEventListener('click',function(){f.reset();code='LVMS · '+Math.random().toString(36).slice(2,6).toUpperCase()+' · '+Math.random().toString(36).slice(2,6).toUpperCase();upd();q('#gc-done').hidden=true;q('#gc-main').hidden=false;q('.gc-hero').scrollIntoView({behavior:'smooth'})});
})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){function h(){var t=0;var n=document.querySelector(".note");var hd=document.querySelector("header");if(n)t+=n.offsetHeight;if(hd)t+=hd.offsetHeight;document.documentElement.style.setProperty("--hdr-h",t+"px")}addEventListener("resize",h);addEventListener("load",h);h()})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){function h(){var g=document.querySelector(".bk-global");if(g)g.hidden=/^thank-you/.test(LVMS.page)}addEventListener("hashchange",h);h()})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){var h=document.querySelector('.hero-masters');if(!h)return;var x0=null,y0=null;
h.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
h.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;if(Math.abs(dx)<40||Math.abs(dx)<Math.abs(dy))return;
var d=[].slice.call(h.querySelectorAll('.ms-dot')),i=d.findIndex(function(b){return b.classList.contains('on')});if(i<0)return;var n=(i+(dx<0?1:-1)+d.length)%d.length;d[n].click()},{passive:true});})();
}catch(e){if(window.console)console.warn("LVMS",e)}
try{(function(){if(LVMS.page!=='thank-you-assessment')return;var r=null;try{r=JSON.parse(sessionStorage.getItem('lvms_req')||'null')}catch(x){}if(!r)return;
var q=function(c){return document.querySelector(c)};if(r.n)q('.tya-name').textContent=' · '+r.n;q('.tya-when').textContent=r.w;q('.tya-where').textContent=r.p;if(r.i)q('.tya-instr').textContent=r.i;if(r.c)q('.tya-contact').textContent=r.c;if(r.g)q('.tya-gcal').href=r.g;})()}catch(e){}

try{(function(){var m=document.getElementById('mast');if(!m)return;var b=m.querySelector('.menu-btn');function close(){if(!m.classList.contains('open'))return;m.classList.remove('open');document.body.classList.remove('menu-open');b.setAttribute('aria-expanded','false');b.textContent='Menu'}m.addEventListener('click',function(e){if(e.target.closest('.lv-nav a'))close()});document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});addEventListener('resize',function(){if(innerWidth>900)close()})})();}catch(e){}
