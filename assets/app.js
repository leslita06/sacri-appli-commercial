(function(){
"use strict";
var D=window.DATA,T=window.TERRAIN,ICO=window.ICO||{};
ICO["mic"]='<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>';
ICO["route"]='<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>';
ICO["navigation"]='<polygon points="3 11 22 2 13 21 11 13 3 11"/>';
ICO["log-out"]='<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>';
ICO["lightbulb"]='<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>';
function ic(n){return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+(ICO[n]||"")+"</svg>";}
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function hh(t){return t.replace(":"," h ");}
function fr(x,n){return x.toFixed(n).replace(".",",");}
function fm(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g," ");}
function pl(n,w){return n+" "+w+(n>1?"s":"");}
var MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],JRS=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
function dt(s){return new Date(s+"T12:00:00");}
function longD(s){var d=dt(s);return JRS[d.getDay()]+" "+d.getDate()+" "+MOIS[d.getMonth()];}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function since(s){return s?Math.round((dt(T.jour)-dt(s))/864e5):null;}

/* ---------- Données ---------- */
var ME="Ange K.",COMS=["Ange K.","Moussa D.","Carine B.","Rémi O."];
var COL={"Ange K.":"#E95B0F","Moussa D.":"#0EA5E9","Carine B.":"#8B5CF6","Rémi O.":"#10B981"};
function ini(c){return c.split(/\s+/).map(function(w){return w.charAt(0);}).join("").toUpperCase();}
function av(c,k){return '<span class="av'+(k?" "+k:"")+'" style="background:'+COL[c]+'">'+ini(c)+"</span>";}
var PF={};T.portefeuille.forEach(function(p){PF[p.client]=p;});
var WON={};D.devis.forEach(function(d){if(d.st==="Gagné")WON[d.client]=1;});D.parc.forEach(function(m){WON[m.client]=1;});
function isCli(p){return !!WON[p.client];}
var ABJ={};T.communes.forEach(function(c){ABJ[c.nom]=1;});
function reg(z){return ABJ[z]?"Abidjan":z;}
var SUJ={};T.sujets.forEach(function(s){SUJ[s[0]]=s[1];});
var SICO={devis:"file-text",revision:"wrench",pieces:"package",projet:"sprout",groupe:"building-2"};
var TODAY=T.visites.filter(function(v){return v.j===T.jour;});
var MY=TODAY.filter(function(v){return v.com===ME;}).sort(function(a,b){return a.h1<b.h1?-1:1;});
var EC=["Envoyé","Relancé","En négociation"];
function dues(c){return D.devis.filter(function(d){return EC.indexOf(d.st)>=0&&d.prev&&d.prev<=T.jour&&d.date<=T.jour&&(!c||d.com===c);}).sort(function(a,b){return a.prev<b.prev?-1:1;});}
function pointCoord(v){var p=PF[v.client],m=v.pt==="loin"?v.d*1000:(v.d||0),b=(v.pt==="loin"?-50:50)*Math.PI/180;
  return [p.pt[1]+m*Math.cos(b)/111320,p.pt[0]+m*Math.sin(b)/(111320*Math.cos(p.pt[1]*Math.PI/180))];}

/* ---------- Petits graphes ---------- */
function ring(v,max,col,size,label){size=size||52;var r=size/2-5,c=2*Math.PI*r,f=max?v/max:0;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+" "+size+'" class="score"><circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="#F1F5F9" stroke-width="6"/><circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+(c*f)+" "+c+'" transform="rotate(-90 '+size/2+" "+size/2+')"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Inter" font-weight="700" font-size="'+(size/3.6)+'" fill="#0F172A">'+(label!=null?label:v)+"</text></svg>";}
function gauge(p){var W=150,H=86,r=62,cx=75,cy=78,a=Math.PI*(1-p),x=cx+r*Math.cos(a),y=cy-r*Math.sin(a);
  return '<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+" "+H+'"><path d="M13 78 A62 62 0 0 1 137 78" fill="none" stroke="#F1F5F9" stroke-width="12" stroke-linecap="round"/><path d="M13 78 A62 62 0 0 '+(p>0.5?1:1)+" "+x.toFixed(1)+" "+y.toFixed(1)+'" fill="none" stroke="#10B981" stroke-width="12" stroke-linecap="round"/><text x="75" y="70" text-anchor="middle" font-family="Inter" font-weight="700" font-size="28" fill="#0F172A">'+Math.round(p*100)+' %</text></svg>';}
function spark(vals,col){var W=60,H=22,mx=Math.max.apply(null,vals)||1,st=W/(vals.length-1);
  var pts=vals.map(function(v,i){return (i*st).toFixed(1)+","+(H-2-(v/mx)*(H-4)).toFixed(1);}).join(" ");
  return '<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+" "+H+'"><polyline points="'+pts+'" fill="none" stroke="'+col+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';}

/* ---------- Cartes ---------- */
var MAPS=[];
function killMaps(){MAPS.forEach(function(m){m.remove();});MAPS=[];}
function newMap(id){var m=L.map(id,{zoomControl:false,attributionControl:true,scrollWheelZoom:false});
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",{maxZoom:16,attribution:"Fond de carte © Esri"}).addTo(m);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",{maxZoom:16}).addTo(m);
  m.attributionControl.setPrefix(false);MAPS.push(m);return m;}
function pin(col,inner,cls){return L.divIcon({className:"",iconSize:[30,30],iconAnchor:[15,30],html:'<div class="mk '+(cls||"")+'" style="background:'+col+'">'+inner+"</div>"});}
function dotI(col,cls){return L.divIcon({className:"",iconSize:[16,16],iconAnchor:[8,8],html:'<div class="'+(cls||"pt")+'" style="background:'+col+'"></div>'});}

var state={cf:"tous",pv:MY[0].id,cc:"tous",pc:"tous",rec:false};

/* =========== APPLI DU COMMERCIAL =========== */
/* 1. Carte de ma zone */
function vCarte(){
  var mine=T.portefeuille.filter(function(p){return p.com===ME;}),onT={};MY.forEach(function(v){onT[v.client]=1;});
  var nC=mine.filter(isCli).length,nP=mine.length-nC;
  var F=[["tous","Tous",mine.length,"layers"],["clients","Clients",nC,"building-2"],["prospects","Prospects",nP,"sprout"],["jour","Aujourd'hui",MY.length,"route"]];
  var h='<h2 class="h">Ma zone</h2><p class="lede">Mes clients et prospects, la tournée du jour en noir.</p>';
  h+='<div class="kpis"><div class="kpi"><span class="kv">'+nC+'</span><span class="kl">'+ic("building-2")+'Clients</span></div><div class="kpi o"><span class="kv">'+nP+'</span><span class="kl">'+ic("sprout")+'Prospects</span></div><div class="kpi"><span class="kv">'+MY.length+'</span><span class="kl">'+ic("route")+"Visites</span></div></div>";
  h+='<div class="chips">'+F.map(function(f){return '<button class="chip np'+(state.cf===f[0]?" on":"")+'" data-cf="'+f[0]+'">'+ic(f[3])+f[1]+' <span class="c">'+f[2]+"</span></button>";}).join("")+"</div>";
  h+='<div id="m-carte" class="map tall"></div>';
  h+='<div class="legend"><span><i style="background:#10B981"></i>Client</span><span><i style="background:#E95B0F"></i>Prospect</span><span><i style="background:#0F172A"></i>Tournée</span><span><i style="background:#fff;box-shadow:0 0 0 2px #EF4444"></i>Devis à relancer</span></div>';
  var du={};dues(ME).forEach(function(d){du[d.client]=1;});
  var list=mine.filter(function(p){return state.cf==="tous"||(state.cf==="clients"&&isCli(p))||(state.cf==="prospects"&&!isCli(p))||(state.cf==="jour"&&onT[p.client]);});
  h+=list.length?list.map(function(p){var c=isCli(p);return '<div class="card row"><span class="ico-b '+(onT[p.client]?"":c?"g":"o")+'">'+ic(onT[p.client]?"route":c?"building-2":"sprout")+'</span><div class="sp"><p class="t">'+esc(p.client)+'</p><p class="s">'+ic("map-pin")+esc(p.zone)+"</p></div>"+(du[p.client]?'<span class="pill r">'+ic("bell-ring")+"Relance</span>":'<span class="pill '+(c?"g":"o")+'">'+(c?"Client":"Prospect")+"</span>")+"</div>";}).join(""):empty("map-pin","Rien ici","Aucun compte pour ce filtre.");
  return h;
}
function drawCarte(){
  var mine=T.portefeuille.filter(function(p){return p.com===ME;}),onT={},du={};MY.forEach(function(v,i){onT[v.client]=i+1;});dues(ME).forEach(function(d){du[d.client]=1;});
  var m=newMap("m-carte"),pts=[];
  mine.forEach(function(p){var c=isCli(p),t=onT[p.client];
    var show=state.cf==="tous"||(state.cf==="clients"&&c)||(state.cf==="prospects"&&!c)||(state.cf==="jour"&&t);if(!show)return;
    var ll=[p.pt[1],p.pt[0]];pts.push(ll);
    L.marker(ll,{icon:pin(t?"#0F172A":c?"#10B981":"#E95B0F",t?"<span>"+t+"</span>":ic(c?"building-2":"sprout"),du[p.client]?"ring":"")}).addTo(m).bindTooltip(esc(p.client),{direction:"top",offset:[0,-30]});});
  if(state.cf==="jour"||state.cf==="tous"){var tl=MY.map(function(v){var p=PF[v.client];return [p.pt[1],p.pt[0]];});L.polyline(tl,{color:"#0F172A",weight:3,opacity:.7,dashArray:"6 6"}).addTo(m);}
  if(pts.length)m.fitBounds(pts,{padding:[34,34],maxZoom:11});else m.setView([6.8,-5.5],7);
}

/* 2. Tournée du jour */
function vTournee(){
  var nOk=MY.filter(function(v){return v.pt==="ok";}).length;
  var h='<h2 class="h">Ma tournée</h2><p class="lede">'+cap(longD(T.jour))+", dans l'ordre de passage.</p>";
  h+='<div class="kpis"><div class="kpi"><span class="kv">'+MY.length+'</span><span class="kl">'+ic("route")+'Visites</span></div><div class="kpi"><span class="kv" style="color:#10B981">'+nOk+"/"+MY.length+'</span><span class="kl">'+ic("map-pin")+'Pointées</span></div><div class="kpi"><span class="kv">'+new Set(MY.map(function(v){return v.zone;})).size+'</span><span class="kl">'+ic("map")+"Villes</span></div></div>";
  h+=MY.map(function(v,i){var p=PF[v.client],d=D.devis.filter(function(x){return x.client===v.client&&EC.indexOf(x.st)>=0;})[0],rv=D.parc.filter(function(m){return m.client===v.client&&m.due;})[0];
    var tags=[];
    if(d)tags.push('<span class="pill o">'+ic("file-text")+esc(d.n)+"</span>");
    if(rv)tags.push('<span class="pill b">'+ic("wrench")+"Révision</span>");
    if(!isCli(p))tags.push('<span class="pill v">'+ic("sprout")+"Prospect</span>");
    tags.push('<span class="pill">'+ic("package")+"Pièces</span>");
    tags.push('<span class="pill">'+ic("building-2")+"Groupe</span>");
    return '<div class="stop"><span class="nb '+(v.pt==="ok"?"ok":v.pt==="loin"?"lo":"")+'">'+(i+1)+'</span><div class="card"><div class="row"><div class="sp"><p class="t">'+esc(v.client)+'</p><p class="s">'+ic("map-pin")+esc(v.zone)+" · "+esc(p.civ+" "+p.contact)+'</p></div><span class="pill">'+ic("clock")+hh(v.h1)+'</span></div><div class="tags">'+tags.join("")+'</div><div class="btns"><a class="btn sm" href="#pointage" data-pv="'+v.id+'">'+ic("map-pin")+'Pointer</a><a class="btn sm" href="#compte-rendu">'+ic("mic")+"Rapport</a></div></div></div>";}).join("");
  return h;
}

/* 3. Je suis chez le client */
function vPointage(){
  var v=MY.filter(function(x){return x.id===state.pv;})[0],p=PF[v.client];
  var h='<h2 class="h">Pointage</h2><p class="lede">À moins de 200 m du client, la présence est confirmée.</p>';
  h+='<div class="chips">'+MY.map(function(x,i){return '<button class="chip np'+(x.id===v.id?" on":"")+'" data-pv="'+x.id+'"><b>'+(i+1)+"</b> "+hh(x.h1)+"</button>";}).join("")+"</div>";
  h+='<div class="card row" style="margin-bottom:10px"><span class="ico-b o">'+ic("building-2")+'</span><div class="sp"><p class="t">'+esc(v.client)+'</p><p class="s">'+ic("map-pin")+esc(v.zone)+" · "+esc(p.civ+" "+p.contact)+"</p></div>"+
    (v.pt==="ok"?'<span class="pill g"><span class="dot"></span>'+v.d+" m</span>":v.pt==="loin"?'<span class="pill a"><span class="dot"></span>'+fr(v.d,1)+" km</span>":'<span class="pill r"><span class="dot"></span>Non pointé</span>')+"</div>";
  h+='<div id="m-pt" class="map sm"></div>';
  h+='<div class="legend"><span><i style="background:#E95B0F"></i>Adresse du client</span><span><i style="background:#0EA5E9"></i>Votre position</span><span><i style="background:rgba(16,185,129,.25);box-shadow:0 0 0 1px #10B981"></i>200 m</span></div>';
  h+='<div class="ptg"><div><small>Arrivée</small><b>'+(v.pt==="non"?"–":hh(v.h1))+'</b></div><div><small>Départ</small><b>'+(v.pt==="non"?"–":hh(v.h2))+'</b></div><div><small>Statut</small><b style="color:'+(v.pt==="ok"?"#10B981":v.pt==="loin"?"#D97706":"#EF4444")+'">'+(v.pt==="ok"?"Confirmé":v.pt==="loin"?"Hors zone":"Aucun")+"</b></div></div>";
  h+='<button class="btn pri pulse" data-act="in">'+ic("navigation")+'Je suis chez le client</button><div class="btns"><button class="btn sm" data-act="out">'+ic("log-out")+'Je pars</button><a class="btn sm" href="#compte-rendu">'+ic("mic")+"Compte rendu</a></div>";
  return h;
}
function drawPointage(){
  var v=MY.filter(function(x){return x.id===state.pv;})[0],p=PF[v.client],c=[p.pt[1],p.pt[0]],m=newMap("m-pt");
  L.circle(c,{radius:200,color:"#10B981",weight:1.5,fillColor:"#10B981",fillOpacity:.12,dashArray:"4 4"}).addTo(m);
  L.marker(c,{icon:pin("#E95B0F",ic("building-2"))}).addTo(m);
  if(v.pt!=="non"){var q=pointCoord(v);L.marker(q,{icon:dotI("#0EA5E9","me")}).addTo(m);
    if(v.pt==="loin")L.polyline([c,q],{color:"#D97706",weight:2,dashArray:"5 5"}).addTo(m);
    m.fitBounds([c,q,[c[0]+0.0019,c[1]+0.0019],[c[0]-0.0019,c[1]-0.0019]],{padding:[26,26],maxZoom:16});}
  else m.setView(c,16);
}

/* 4. Compte rendu au micro */
var V28=MY[0];
function vCR(){
  var ab=V28.ab.length,tot=V28.ab.length+V28.na.length;
  var h='<h2 class="h">Compte rendu</h2><p class="lede">Appuyez, parlez 30 secondes, c\'est rangé.</p>';
  h+='<div class="card"><div class="micw"><button class="micb'+(state.rec?" rec":"")+'" data-act="mic" aria-label="Dicter le compte rendu">'+ic(state.rec?"square":"mic")+'</button><div class="wave'+(state.rec?" on":"")+'" id="wave">'+[8,14,22,30,18,26,34,20,12,24,32,16,10,22,28,14,8].map(function(x,i){return '<i style="height:'+x+"px;animation-delay:"+(i*0.06).toFixed(2)+'s"></i>';}).join("")+'</div><span class="time" id="tm">'+(state.rec?"0:00":"0:29")+'</span></div><div class="row"><span class="ico-b">'+ic("building-2")+'</span><div class="sp"><p class="t">'+esc(V28.client)+'</p><p class="s">'+ic("clock")+hh(V28.h2)+" · "+esc(V28.zone)+"</p></div></div></div>";
  h+='<div class="res"><div class="card"><p class="k">'+ic("target")+'Besoin</p><p class="kv" style="font-size:26px;font-weight:700">10</p><p class="s">débroussailleuses</p></div><div class="card"><p class="k">'+ic("list-checks")+'Sujets</p><div class="ringw">'+ring(ab,tot,"#F59E0B",48,ab+"/"+tot)+'<p class="s" style="white-space:normal">abordés</p></div></div></div>';
  h+='<div class="card" style="margin-top:8px"><p class="k">'+ic("list-todo")+'À faire</p><div class="list-c"><div class="li sg">'+ic("navigation")+'Revenir avec une machine d\'essai</div><div class="li sg">'+ic("file-text")+'Devis 10 × STIHL FS 400</div></div><p class="k" style="margin-top:12px">'+ic("triangle-alert")+'Oublié</p><div class="list-c">'+V28.na.map(function(x){return '<div class="li no">'+ic(SICO[x])+esc(SUJ[x])+"</div>";}).join("")+"</div></div>";
  h+='<div class="btns"><button class="btn dk" data-act="cr-chef">'+ic("send")+"Envoyer au chef</button></div>";
  return h;
}

/* 5. Relances */
function vRelances(){
  var du=dues(ME),late=du.filter(function(d){return d.prev<T.jour;}).length,pros=T.portefeuille.filter(function(p){return p.com===ME&&!isCli(p);});
  var h='<h2 class="h">À relancer</h2><p class="lede">Les plus en retard en premier.</p>';
  h+='<div class="kpis"><div class="kpi"><span class="kv">'+du.length+'</span><span class="kl">'+ic("file-text")+'Devis</span></div><div class="kpi r"><span class="kv">'+late+'</span><span class="kl">'+ic("hourglass")+'En retard</span></div><div class="kpi o"><span class="kv">'+pros.length+'</span><span class="kl">'+ic("sprout")+"Prospects</span></div></div>";
  h+='<div class="sect">'+ic("file-text")+"Devis en attente</div>";
  h+=du.length?du.map(function(d){var k=since(d.prev),p=PF[d.client]||{};return '<div class="card"><div class="row"><div class="late" style="color:'+(k>0?"#EF4444":"#D97706")+'">'+(k>0?"+"+k:"0")+'<small>'+(k>0?"jours":"auj.")+'</small></div><div class="sp"><p class="t">'+esc(d.client)+'</p><p class="s">'+ic("file-text")+esc(d.n)+" · "+esc(d.ville)+'</p></div><a class="ico-b g" href="#relances" data-act="call" data-n="'+esc(d.client)+'" aria-label="Appeler">'+ic("phone")+'</a></div><div class="bar"><i style="width:'+Math.min(100,(k+1)*6)+"%;background:"+(k>0?"#EF4444":"#F59E0B")+'"></i></div></div>';}).join(""):empty("circle-check-big","Tout est à jour","Aucun devis à relancer aujourd'hui.");
  h+='<div class="sect">'+ic("sprout")+"Prospects</div>";
  h+=pros.map(function(p){var k=since(p.lv);return '<div class="card row"><span class="ico-b o">'+ic("sprout")+'</span><div class="sp"><p class="t">'+esc(p.client)+'</p><p class="s">'+ic("map-pin")+esc(p.zone)+" · "+esc(p.civ+" "+p.contact)+'</p></div><span class="pill '+(k===null||k>30?"r":"g")+'">'+(k===null?"Jamais vu":k===0?"Vu auj.":"Vu il y a "+k+" j")+"</span></div>";}).join("");
  return h;
}

/* =========== APPLI DU CHEF DES VENTES =========== */
function teamStrip(sel,attr){
  return '<div class="team">'+COMS.map(function(c){var vs=TODAY.filter(function(v){return v.com===c;});
    return '<button class="tm'+(sel!=="tous"&&sel!==c?" off":"")+'" data-'+attr+'="'+(sel===c?"tous":c)+'">'+av(c,"av-s")+"<span>"+esc(c)+'</span><span class="d">'+vs.map(function(v){return '<i style="background:'+(v.pt==="ok"?"#10B981":v.pt==="loin"?"#F59E0B":"#EF4444")+'"></i>';}).join("")+"</span></button>";}).join("")+"</div>";
}
/* 6. Carte de l'équipe */
function vChef(){
  var vs=TODAY.filter(function(v){return state.cc==="tous"||v.com===state.cc;}),ok=vs.filter(function(v){return v.pt==="ok";}).length;
  var h='<h2 class="h">L\'équipe aujourd\'hui</h2><p class="lede">'+cap(longD(T.jour))+", touchez un commercial pour filtrer.</p>";
  h+=teamStrip(state.cc,"cc");
  h+='<div id="m-chef" class="map"></div>';
  h+='<div class="legend"><span><i style="background:#10B981"></i>Pointée</span><span><i style="background:#fff;box-shadow:0 0 0 2px #F59E0B"></i>Hors zone</span><span><i style="background:#fff;box-shadow:0 0 0 2px #EF4444"></i>Non pointée</span></div>';
  h+='<div class="kpis"><div class="kpi"><span class="kv">'+vs.length+'</span><span class="kl">'+ic("route")+'Visites</span></div><div class="kpi"><span class="kv" style="color:#10B981">'+ok+'</span><span class="kl">'+ic("circle-check-big")+'Pointées</span></div><div class="kpi a"><span class="kv">'+(vs.length-ok)+'</span><span class="kl">'+ic("triangle-alert")+"À vérifier</span></div></div>";
  h+=vs.sort(function(a,b){return a.h1<b.h1?-1:1;}).map(function(v){return '<div class="card row">'+av(v.com,"av-s")+'<div class="sp"><p class="t">'+esc(v.client)+'</p><p class="s">'+ic("clock")+hh(v.h1)+" · "+esc(v.zone)+"</p></div>"+(v.pt==="ok"?'<span class="pill g">'+ic("map-pin")+v.d+" m</span>":v.pt==="loin"?'<span class="pill a">'+ic("map-pin")+fr(v.d,1)+" km</span>":'<span class="pill r">'+ic("x")+"Non pointé</span>")+"</div>";}).join("");
  return h;
}
function drawChef(){
  var m=newMap("m-chef"),items=[];
  COMS.forEach(function(c){if(state.cc!=="tous"&&state.cc!==c)return;
    TODAY.filter(function(v){return v.com===c;}).sort(function(a,b){return a.h1<b.h1?-1:1;}).forEach(function(v,i){var p=PF[v.client];items.push({c:c,v:v,i:i,ll:[p.pt[1],p.pt[0]]});});});
  if(!items.length)return;
  m.fitBounds(items.map(function(o){return o.ll;}),{padding:[38,38],maxZoom:11});
  /* Écarter les épingles trop proches à l'écran (34 px au moins) */
  var P=items.map(function(o){return m.latLngToContainerPoint(o.ll);});
  for(var it=0;it<60;it++){var mv=false;
    for(var a=0;a<P.length;a++)for(var b=a+1;b<P.length;b++){var dx=P[b].x-P[a].x,dy=P[b].y-P[a].y,d=Math.hypot(dx,dy);
      if(d<42){if(d<0.5){dx=1;dy=0.3;d=1;}var k=(42-d)/2;P[a].x-=dx/d*k;P[a].y-=dy/d*k;P[b].x+=dx/d*k;P[b].y+=dy/d*k;mv=true;}}
    if(!mv)break;}
  items.forEach(function(o,j){var q=m.containerPointToLatLng(P[j]);o.q=q;
    if(P[j].distanceTo(m.latLngToContainerPoint(o.ll))>3)L.polyline([o.ll,q],{color:"#64748B",weight:1,opacity:.7}).addTo(m);
    L.marker(q,{icon:pin(COL[o.c],"<span>"+(o.i+1)+"</span>",o.v.pt==="non"?"ring":o.v.pt==="loin"?"ring-a":"")}).addTo(m).bindTooltip(esc(o.c)+" · "+esc(o.v.client),{direction:"top",offset:[0,-30]});});
  COMS.forEach(function(c){var l=items.filter(function(o){return o.c===c;}).map(function(o){return o.q;});if(l.length>1)L.polyline(l,{color:COL[c],weight:3,opacity:.75,dashArray:"6 6"}).addTo(m);});
}
/* 7. Comptes rendus reçus */
function vRapports(){
  var vs=TODAY.filter(function(v){return state.cc==="tous"||v.com===state.cc;}).sort(function(a,b){return a.h2>b.h2?-1:1;});
  var ab=0,at=0;vs.forEach(function(v){if(!v.abs){ab+=v.ab.length;at+=v.ab.length+v.na.length;}});
  var h='<h2 class="h">Comptes rendus</h2><p class="lede">Reçus aujourd\'hui, le plus récent en haut.</p>';
  h+=teamStrip(state.cc,"cc");
  h+='<div class="card row"><div class="gauge">'+ring(ab,at,"#F59E0B",64,at?Math.round(ab/at*100)+"%":"–")+'</div><div class="sp"><p class="t">Sujets attendus abordés</p><p class="s">'+ab+" sur "+at+" · "+pl(vs.length,"compte rendu")+"</p></div></div>";
  h+=vs.length?vs.map(function(v){var col=v.sc==null?"#94A3B8":v.sc>=7?"#10B981":v.sc>=5?"#F59E0B":"#EF4444";
    return '<div class="card"><div class="row">'+av(v.com,"av-s")+'<div class="sp"><p class="t">'+esc(v.client)+'</p><p class="s">'+ic("clock")+hh(v.h2)+" · "+esc(v.zone)+"</p></div>"+ring(v.sc==null?0:v.sc,10,col,42,v.sc==null?"–":v.sc)+'</div><div class="tags">'+(v.abs?'<span class="pill r">'+ic("user-x")+"Absent</span>":"")+v.ab.map(function(x){return '<span class="pill g" title="'+esc(SUJ[x])+'">'+ic(SICO[x])+"</span>";}).join("")+v.na.map(function(x){return '<span class="pill r" title="'+esc(SUJ[x])+'">'+ic(SICO[x])+"</span>";}).join("")+'</div><p class="s" style="margin-top:8px;white-space:normal">'+ic("arrow-right")+esc(v.next)+"</p></div>";}).join(""):empty("message-square-text","Pas encore de compte rendu","Ils arrivent après chaque visite.");
  h+='<div class="legend" style="margin-top:4px"><span><i style="background:#10B981"></i>Abordé</span><span><i style="background:#EF4444"></i>Oublié</span>'+Object.keys(SICO).map(function(k){return "<span>"+ic(SICO[k])+esc(SUJ[k].split(" ")[0])+"</span>";}).join("")+"</div>";
  return h;
}
/* 8. Prospects par zone */
function vProspects(){
  var l=T.portefeuille.filter(function(p){return state.pc==="tous"||p.com===state.pc;}),Z={};
  l.forEach(function(p){var z=reg(p.zone);Z[z]=Z[z]||[0,0];Z[z][isCli(p)?0:1]++;});
  var rows=Object.keys(Z).sort(function(a,b){return (Z[b][1]-Z[a][1])||((Z[b][0]+Z[b][1])-(Z[a][0]+Z[a][1]));}),mx=Math.max.apply(null,rows.map(function(z){return Z[z][0]+Z[z][1];}).concat([1]));
  var nP=l.filter(function(p){return !isCli(p);}).length;
  var h='<h2 class="h">Prospects par zone</h2><p class="lede">Où se trouvent les comptes à conquérir.</p>';
  h+=teamStrip(state.pc,"pc");
  h+='<div class="kpis"><div class="kpi o"><span class="kv">'+nP+'</span><span class="kl">'+ic("sprout")+'Prospects</span></div><div class="kpi"><span class="kv" style="color:#10B981">'+(l.length-nP)+'</span><span class="kl">'+ic("building-2")+'Clients</span></div><div class="kpi"><span class="kv">'+rows.length+'</span><span class="kl">'+ic("map")+"Zones</span></div></div>";
  h+='<div id="m-pros" class="map sm"></div>';
  h+='<div class="card"><div class="hb">'+rows.map(function(z){var c=Z[z][0],p=Z[z][1];return '<div class="r"><span>'+esc(z)+'</span><span class="tr"><i style="width:'+(p/mx*100)+'%;background:#E95B0F"></i><i style="width:'+(c/mx*100)+'%;background:#10B981"></i></span><b>'+p+"</b></div>";}).join("")+'</div><div class="legend" style="margin:10px 0 0"><span><i style="background:#E95B0F"></i>Prospects</span><span><i style="background:#10B981"></i>Clients</span></div></div>';
  return h;
}
function drawProspects(){
  var m=newMap("m-pros"),pts=[];
  T.portefeuille.forEach(function(p){if(state.pc!=="tous"&&p.com!==state.pc)return;var c=isCli(p),ll=[p.pt[1],p.pt[0]];pts.push(ll);
    L.marker(ll,{icon:dotI(c?"#10B981":"#E95B0F"),zIndexOffset:c?0:500}).addTo(m).bindTooltip(esc(p.client),{direction:"top"});});
  if(pts.length)m.fitBounds(pts,{padding:[20,20],maxZoom:10});
}
/* 9. Alertes */
function vAlertesChef(){
  var nv=T.portefeuille.filter(function(p){var k=since(p.lv);return k===null||k>30;}).sort(function(a,b){var x=since(a.lv),y=since(b.lv);return (y===null?1e4:y)-(x===null?1e4:x);});
  var wk=T.visites,ok=wk.filter(function(v){return v.pt==="ok";}).length,bad=wk.filter(function(v){return v.pt!=="ok";}).sort(function(a,b){return a.j<b.j?1:-1;});
  var per=T.semaine.map(function(j){return T.visites.filter(function(v){return v.j===j;}).length;});
  var h='<h2 class="h">Alertes</h2><p class="lede">Cette semaine, ce qui demande votre œil.</p>';
  h+='<div class="card row"><div>'+gauge(ok/wk.length)+'</div><div class="sp"><p class="t">Visites pointées</p><p class="s">'+ok+" sur "+wk.length+' visites</p><p style="margin-top:6px">'+spark(per,"#0EA5E9")+"</p></div></div>";
  var du=dues(),lt=du.filter(function(d){return d.prev<T.jour;}).length;
  h+='<div class="kpis"><div class="kpi"><span class="kv">'+du.length+'</span><span class="kl">'+ic("file-text")+'Relances</span></div><div class="kpi r"><span class="kv">'+lt+'</span><span class="kl">'+ic("hourglass")+'En retard</span></div><div class="kpi r"><span class="kv">'+nv.length+'</span><span class="kl">'+ic("user-x")+'Non vus</span></div></div>';
  h+='<div class="sect">'+ic("user-x")+'Clients non vus<span class="pill r">'+nv.length+"</span></div>";
  h+='<div class="card">'+nv.map(function(p){var k=since(p.lv);return '<div class="al">'+av(p.com,"av-s")+'<div class="sp"><p class="t">'+esc(p.client)+'</p><p class="s">'+ic("map-pin")+esc(p.zone)+'</p></div><span class="pill r">'+(k===null?"Jamais":k+" j")+"</span></div>";}).join("")+"</div>";
  h+='<div class="sect">'+ic("map-pin")+'Visites à vérifier<span class="pill a">'+bad.length+"</span></div>";
  h+='<div class="card">'+bad.map(function(v){return '<div class="al">'+av(v.com,"av-s")+'<div class="sp"><p class="t">'+esc(v.client)+'</p><p class="s">'+ic("calendar")+cap(longD(v.j).split(" ").slice(0,2).join(" "))+" · "+hh(v.h1)+"</p></div>"+(v.pt==="loin"?'<span class="pill a">'+fr(v.d,1)+" km</span>":'<span class="pill r">Non pointé</span>')+"</div>";}).join("")+"</div>";
  return h;
}

function empty(i,t,s){return '<div class="card empty"><span class="ico-b g">'+ic(i)+"</span><b>"+t+"</b>"+s+"</div>";}

/* ---------- Navigation ---------- */
var APPS={com:[["carte","Ma zone","map",vCarte,drawCarte],["tournee","Tournée","route",vTournee],["pointage","Pointer","navigation",vPointage,drawPointage],["compte-rendu","Micro","mic",vCR],["relances","Relances","bell-ring",vRelances]],
          chef:[["chef","Équipe","users",vChef,drawChef],["chef-rapports","Rapports","message-square-text",vRapports],["chef-prospects","Prospects","sprout",vProspects,drawProspects],["chef-alertes","Alertes","triangle-alert",vAlertesChef]]};
var OLD={journee:"tournee",debrief:"compte-rendu",alertes:"relances"};
function all(){return APPS.com.concat(APPS.chef);}
function cur(){var h=(location.hash||"").slice(1);h=OLD[h]||h;return all().some(function(v){return v[0]===h;})?h:"carte";}
function appOf(c){return APPS.chef.some(function(v){return v[0]===c;})?"chef":"com";}
function render(){
  var c=cur(),a=appOf(c),V=all().filter(function(v){return v[0]===c;})[0];
  killMaps();
  $("scr").innerHTML='<section class="view on">'+V[3]()+"</section>";
  $("tabs").innerHTML=APPS[a].map(function(v){var b=v[0]==="relances"?dues(ME).length:v[0]==="chef-alertes"?T.portefeuille.filter(function(p){var k=since(p.lv);return k===null||k>30;}).length:0;
    return '<a href="#'+v[0]+'" class="'+(v[0]===c?"on":"")+'">'+ic(v[2])+"<span>"+v[1]+"</span><em>"+(b||"")+"</em></a>";}).join("");
  document.querySelectorAll("[data-app]").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-app")===a);});
  $("scr-l").innerHTML=APPS[a].map(function(v){return '<li><a href="#'+v[0]+'" class="'+(v[0]===c?"on":"")+'">'+ic(v[2])+v[1]+"</a></li>";}).join("");
  $("who").innerHTML=a==="chef"?"Chef des ventes":ME;
  $("top-av").outerHTML=a==="chef"?'<span class="av" id="top-av" style="background:#0F172A">'+ic("users")+"</span>":av(ME).replace('class="av"','class="av" id="top-av"');
  $("when").textContent=cap(longD(T.jour))+" 2026";
  if(V[4])setTimeout(function(){V[4]();},30);
  $("scr").scrollTop=0;
}
var tm;function toast(m,i){var t=$("toast");t.innerHTML=ic(i||"info")+"<span>"+m+"</span>";t.classList.add("on");clearTimeout(tm);tm=setTimeout(function(){t.classList.remove("on");},3200);}
var audio=null,tick=null;
function stopRec(){state.rec=false;if(audio){audio.pause();audio.currentTime=0;}clearInterval(tick);}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-cf],[data-pv],[data-cc],[data-pc],[data-act],[data-app]");if(!b)return;
  if(b.hasAttribute("data-app")){e.preventDefault();location.hash=b.getAttribute("data-app")==="chef"?"#chef":"#carte";return;}
  if(b.hasAttribute("data-cf")){state.cf=b.getAttribute("data-cf");render();return;}
  if(b.hasAttribute("data-cc")){state.cc=b.getAttribute("data-cc");render();return;}
  if(b.hasAttribute("data-pc")){state.pc=b.getAttribute("data-pc");render();return;}
  if(b.hasAttribute("data-pv")){state.pv=b.getAttribute("data-pv");if(b.tagName!=="A")render();return;}
  var a=b.getAttribute("data-act");
  if(a==="in"){var v=MY.filter(function(x){return x.id===state.pv;})[0];toast(v.pt==="ok"?"Présence confirmée à "+v.d+" m du client.":v.pt==="loin"?"Hors zone : "+fr(v.d,1)+" km du client.":"Position introuvable, réessayez chez le client.",v.pt==="ok"?"circle-check-big":"triangle-alert");}
  if(a==="out")toast("Départ enregistré.","log-out");
  if(a==="cr-chef")toast("Démonstration : rien n'est envoyé.","send");
  if(a==="call"){e.preventDefault();toast("Démonstration : appel non passé.","phone");}
  if(a==="mic"){
    if(state.rec){stopRec();render();return;}
    state.rec=true;render();
    try{audio=audio||new Audio("assets/note-vocale.mp3?v=20261125c");audio.currentTime=0;audio.play().catch(function(){});audio.onended=function(){stopRec();render();toast("Compte rendu rangé.","circle-check-big");};}catch(x){}
    var s=0;tick=setInterval(function(){s++;var t=$("tm");if(t)t.textContent="0:"+(s<10?"0":"")+s;if(s>=29){stopRec();render();toast("Compte rendu rangé.","circle-check-big");}},1000);
  }
});
window.addEventListener("hashchange",function(){stopRec();render();});
document.querySelectorAll("i[data-i]").forEach(function(e){e.outerHTML=ic(e.getAttribute("data-i"));});
render();
})();
