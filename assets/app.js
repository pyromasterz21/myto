(function(){
"use strict";
var lang=document.documentElement.lang,biz="r";
var S={ap:0,pk:{},tm:900,au:[2,0,1],ho:{},sent:false};
var rp=null;
var MIC='<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0M12 18v3"></path></svg> ';
var CHK='<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"></path></svg>';
function $(s){return document.querySelector(s);}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s));}

var I=window.MYTO_I18N;

function d(){return I[biz];}
function ui(){return I.ui;}
function hhmm(v){var m=(18*60+v)%1440,h=Math.floor(m/60),mm=m%60;return (h<10?"0":"")+h+":"+(mm<10?"0":"")+mm;}
function setOn(el,on){el.classList.toggle("on",on);el.setAttribute("aria-pressed",on?"true":"false");}

function applyBiz(){
  $$("[data-biz]").forEach(function(b){setOn(b,b.getAttribute("data-biz")===biz);});
}

function bub(c,h){return '<div class="b '+c+'">'+h+'</div>';}
function renderPhone(){
  var x=d().phone,u=ui(),h=bub("my",x.m1)+bub("my",x.m2);
  h+='<div class="ok"><p class="oklab">'+u.needs+'</p><p class="oktx">'+x.card+'</p>';
  if(S.ap===0){h+='<div class="okbt"><button type="button" class="yes" data-ap="1">'+u.approve+'</button><button type="button" data-ap="3">'+u.edit+'</button><button type="button" data-ap="2">'+u.later+'</button></div>';}
  else{h+='<p class="okres">'+(S.ap===1?CHK:"")+'<span>'+u.res[S.ap]+'</span><button type="button" class="undo" data-ap="0">'+u.undo+'</button></p>';}
  h+='</div>'+bub("ow",MIC+x.ask)+bub("my",x.m3);
  $("#chat").innerHTML=h;
}

function renderInterview(){
  var x=d().iv,n=12+3*Object.keys(S.pk).length;
  $("#ivq").textContent=x.q;
  $("#ivc").innerHTML=x.chips.map(function(c,i){var on=!!S.pk[i];return '<button type="button" class="chip'+(on?" on":"")+'" data-pk="'+i+'" aria-pressed="'+(on?"true":"false")+'">'+c+'</button>';}).join("");
  $("#ivbar").style.width=Math.round(n/2)+"%";
  $("#ivknow").textContent=ui().know.replace("{n}",n);
}

function buildFeed(){
  var n=d().night,u=ui();
  for(var i=0;i<3;i++){$("#l"+i).textContent=n.lab[i];}
  $("#feed").innerHTML=n.ev.map(function(e){
    var tm='<span class="tm mono">'+hhmm(e.at)+'</span>';
    if(e.rule){return '<li class="ev rule" data-at="'+e.at+'">'+tm+'<div><p class="a">'+e.rule+'</p></div></li>';}
    if(e.brief){return '<li class="ev brief" data-at="'+e.at+'">'+tm+'<div><p class="a">'+e.brief+'</p><span class="st phone">'+u.st.phone+'</span></div></li>';}
    return '<li class="ev" data-at="'+e.at+'">'+tm+'<div><p class="q">'+u.q[0]+e.q+u.q[1]+'</p><p class="a">'+e.a+'</p><span class="st '+e.st+'">'+u.st[e.st]+'</span></div></li>';
  }).join("");
  $("#riadnote").hidden=biz!=="h";
  $("#replay").textContent=rp?u.stop:u.replay;
  $("#clock").value=S.tm;
}
function updateNight(){
  var n=d().night,v=S.tm,ph=n.phase[0][1],c=n.cnt[0],tx=hhmm(v);
  n.phase.forEach(function(p){if(v>=p[0])ph=p[1];});
  n.cnt.forEach(function(x){if(v>=x[0])c=x;});
  $("#time").textContent=tx;
  $("#phase").textContent=ph;
  $("#clock").setAttribute("aria-valuetext",tx);
  for(var i=0;i<3;i++){$("#c"+i).textContent=c[i+1];}
  $$("#feed .ev").forEach(function(el){el.classList.toggle("later",+el.getAttribute("data-at")>v);});
}
function stopReplay(){
  if(!rp)return;
  if(rp.raf)cancelAnimationFrame(rp.raf);
  if(rp.iv)clearInterval(rp.iv);
  rp=null;$("#replay").textContent=ui().replay;
}
function replay(){
  stopReplay();
  var c=$("#clock"),red=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  rp={};$("#replay").textContent=ui().stop;
  S.tm=0;c.value=0;updateNight();
  if(red){
    var ts=d().night.ev.map(function(e){return e.at;}),i=0;
    rp.iv=setInterval(function(){if(i>=ts.length){stopReplay();return;}S.tm=ts[i++];c.value=S.tm;updateNight();},900);
    return;
  }
  var t0=null;
  function step(now){
    if(!rp)return;
    if(t0===null)t0=now;
    var v=Math.min(900,Math.round((now-t0)/1000*9)*10);
    S.tm=v;c.value=v;updateNight();
    if(v<900){rp.raf=requestAnimationFrame(step);}else{stopReplay();}
  }
  rp.raf=requestAnimationFrame(step);
}

function renderBoss(){
  var u=ui();
  $$("[data-row]").forEach(function(b){setOn(b,S.au[+b.getAttribute("data-row")]===+b.getAttribute("data-val"));});
  $("#say").textContent=u.autoT.replace("{a}",u.auto[0][S.au[0]]).replace("{b}",u.auto[1][S.au[1]]).replace("{c}",u.auto[2][S.au[2]]);
}

function renderPilot(){
  var u=ui();
  $$("[data-ho]").forEach(function(b){setOn(b,!!S.ho[b.getAttribute("data-ho")]);});
  $("#form").hidden=S.sent;$("#done").hidden=!S.sent;
  if(S.sent){
    var picks=$$("[data-ho]").filter(function(b){return !!S.ho[b.getAttribute("data-ho")];}).map(function(b){var s=b.textContent.trim();return /^Google/.test(s)?s:s.charAt(0).toLowerCase()+s.slice(1);});
    var tb=$("[data-biz].on"),vals={
      name:$("#f-name").value.trim(),biz:$("#f-biz").value.trim(),type:tb?tb.textContent.trim():"",
      city:$("#f-city").value.trim(),tel:$("#f-tel").value.trim(),picks:picks.length?picks.join(", "):u.noPicks};
    var msg=u.msg.filter(function(l){return l.indexOf("{city}")<0||vals.city;}).map(function(l){return l.replace(/\{(\w+)\}/g,function(m,k){return Object.prototype.hasOwnProperty.call(vals,k)?vals[k]:m;});}).join("\n");
    var wa=(window.MYTO_CFG&&window.MYTO_CFG.wa)||"",link=$("#wa-link");
    $("#msg").textContent=msg;
    if(wa){link.href="https://wa.me/"+wa+"?text="+encodeURIComponent(msg);link.hidden=false;$("#not-connected").hidden=true;}
    else{link.removeAttribute("href");link.hidden=true;$("#not-connected").hidden=false;}
  }
  [["name","errName"],["biz","errBiz"],["tel","errTel"]].forEach(function(p){var e=$("#e-"+p[0]);if(!e.hidden)e.textContent=u[p[1]];});
}
function showErr(id,key){var e=$("#e-"+id);e.textContent=ui()[key];e.hidden=false;}

function renderAll(){renderPhone();renderInterview();buildFeed();updateNight();renderBoss();renderPilot();}

document.addEventListener("click",function(e){
  var b=e.target.closest("button");
  if(!b)return;
  var k;
  if(b.hasAttribute("data-biz")){biz=b.getAttribute("data-biz");S.ap=0;S.pk={};stopReplay();S.tm=900;applyBiz();renderAll();return;}
  if(b.hasAttribute("data-ap")){S.ap=+b.getAttribute("data-ap");renderPhone();return;}
  if(b.hasAttribute("data-pk")){k=b.getAttribute("data-pk");if(S.pk[k])delete S.pk[k];else S.pk[k]=1;renderInterview();return;}
  if(b.hasAttribute("data-row")){S.au[+b.getAttribute("data-row")]=+b.getAttribute("data-val");renderBoss();return;}
  if(b.hasAttribute("data-ho")){k=b.getAttribute("data-ho");if(S.ho[k])delete S.ho[k];else S.ho[k]=1;renderPilot();return;}
  if(b.id==="replay"){if(rp)stopReplay();else replay();return;}
  if(b.id==="again"){S.sent=false;renderPilot();$("#f-name").focus();return;}
});
$("#clock").addEventListener("input",function(){stopReplay();S.tm=+this.value;updateNight();});
$("#form").addEventListener("input",function(e){var m={"f-name":"name","f-biz":"biz","f-tel":"tel"}[e.target.id];if(m)$("#e-"+m).hidden=true;});
$("#form").addEventListener("submit",function(e){
  e.preventDefault();
  var ok=true,first=null;
  function need(id,key,bad){if(bad){showErr(id,key);ok=false;if(!first)first=$("#f-"+id);}else{$("#e-"+id).hidden=true;}}
  need("name","errName",!$("#f-name").value.trim());
  need("biz","errBiz",!$("#f-biz").value.trim());
  need("tel","errTel",$("#f-tel").value.replace(/\D/g,"").length<8);
  if(!ok){first.focus();return;}
  S.sent=true;renderPilot();$("#done-h").focus();
});

applyBiz();renderAll();
$("#form button[type=submit]").disabled=false;
})();
