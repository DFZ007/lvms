// Sample opening times shared by openings.html and book.html.
// REPLACE with live open slots from the scheduling system before launch.
(function(){
var LOCS=["Downtown Summerlin", "Tivoli Village", "Green Valley Ranch", "Arroyo Crossing", "The Gramercy", "Online"], INST=["Piano","Violin","Viola","Cello","Guitar","Bass","Drums","Voice","Saxophone","Flute","Trumpet","Ukulele"];
var NAMES=["Maria K.","David R.","Elena S.","James T.","Ana P.","Chris L.","Nadia F.","Sam W.","Lena V.","Omar B.","Grace H.","Tom D."];
var BANDS=[{k:"morning",n:"Morning",t:"9am–12pm",h:[9,10,11]},{k:"midday",n:"Midday",t:"12–3pm",h:[12,13,14]},{k:"after",n:"After school",t:"3–6pm",h:[15,16,17]},{k:"evening",n:"Evening",t:"6–9pm",h:[18,19,20]}];
var DAYN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function rnd(seed){var x=Math.sin(seed)*10000;return x-Math.floor(x);}
function monday(d){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate());var w=(x.getDay()+6)%7;x.setDate(x.getDate()-w);return x;}
var today=new Date();today.setHours(0,0,0,0);var base=monday(today);
// sample slots for 2 weeks
var slots=[];
for(var dd=0;dd<14;dd++){var date=new Date(base);date.setDate(base.getDate()+dd);var dow=date.getDay();var wkend=dow===0||dow===6;
 LOCS.forEach(function(loc,li){for(var hr=9;hr<=20;hr++){if(wkend&&(hr<9||hr>18))continue;
  var daytime=!wkend&&hr<15;var p=daytime?0.62:(hr<18?(wkend?0.22:0.07):0.18);if(li===5)p=p*0.8+0.05;
  for(var half=0;half<2;half++){var r=rnd(dd*977+li*131+hr*17+half*7+1);if(r<p){var ii=Math.floor(rnd(r*999+dd+li)*INST.length);
   slots.push({id:dd+'-'+hr+'-'+(half*30)+'-'+li,date:date,dd:dd,dow:dow,hr:hr,min:half*30,loc:li,inst:INST[ii],who:NAMES[(ii+li+hr)%NAMES.length],daytime:daytime});}}}});}

var DAYN_=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function fmtT(h,m){var ap=h<12?'am':'pm';var hh=h%12||12;return hh+(m?':'+String(m).padStart(2,'0'):'')+ap;}
function fmtD(d){return DAYN_[d.getDay()]+' '+d.toLocaleDateString('en-US',{month:'short',day:'numeric'});}
function isPast(s){var t=new Date(s.date);t.setHours(s.hr,s.min);return t<new Date();}
window.LVMS={LOCS:LOCS,INST:INST,slots:slots,base:base,today:today,fmtT:fmtT,fmtD:fmtD,isPast:isPast,
 ADDR:["1980 Festival Plaza Dr","[Address]","170 S Green Valley Pkwy, Henderson","7455 Arroyo Crossing Pkwy","[Address]","Live video lesson, from home"]};
})();
