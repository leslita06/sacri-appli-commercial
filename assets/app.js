(function(){
"use strict";
var D=window.DATA,T=window.TERRAIN,ICO=window.ICO||{};
var MORE={
 "route":'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
 "mic":'<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
 "lightbulb":'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
 "layout":'<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
 "log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
 "sparkles":'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
 "reply":'<polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
 "thumbs-up":'<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
 "thumbs-down":'<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>',
 "navigation":'<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
 "flag":'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>'
};
for(var k in MORE)ICO[k]=MORE[k];
function ic(n){return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+(ICO[n]||"")+"</svg>";}
function paint(root){(root||document).querySelectorAll("i[data-i]").forEach(function(e){e.outerHTML=ic(e.getAttribute("data-i"));});}
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function hh(t){return t.replace(":"," h ");}
function fr(x,n){return x.toFixed(n).replace(".",",");}
function pct(x){return Math.round(x*100)+" %";}
function pl(n,w){return n+" "+w+(n>1?"s":"");}
var MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],JRS=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
function dt(s){return new Date(s+"T12:00:00");}
function longD(s){var d=dt(s);return JRS[d.getDay()]+" "+d.getDate()+" "+MOIS[d.getMonth()];}
function shortD(s){var d=dt(s);return JRS[d.getDay()].slice(0,3)+". "+d.getDate()+"/"+(d.getMonth()+1);}
function since(s){return s?Math.round((dt(T.jour)-dt(s))/864e5):null;}

var ME="Ange K.";
var SUJ={},ARG={};T.sujets.forEach(function(s){SUJ[s[0]]=s[1];});T.args.forEach(function(a){ARG[a[0]]=a[1];});
var PF={};T.portefeuille.forEach(function(p){PF[p.client]=p;});
var MY=T.visites.filter(function(v){return v.j===T.jour&&v.com===ME;}).sort(function(a,b){return a.h1<b.h1?-1:1;});
function devisOf(c){return D.devis.filter(function(d){return d.client===c;});}
function parcOf(c){return D.parc.filter(function(m){return m.client===c;});}

/* ---------- objectif et sujets de la direction, tirés des devis et du parc ---------- */
var OBJ={
 "Coopérative Agricole du Fromager":"Comprendre le besoin de débroussailleuses pour l'entretien des parcelles et proposer un essai.",
 "Forestière de la Lobo":"Faire avancer le devis D-26-116 et caler la révision de la débroussailleuse.",
 "Forêts et Chantiers du Centre":"Relancer le devis D-26-121 du chantier de reboisement et planifier la révision de la tarière."
};
function dirTopics(c){
  var out=[];
  devisOf(c).forEach(function(d){
    if(d.st==="Envoyé")out.push(["file-text","Relancer le devis "+d.n+" en attente ("+d.objet.charAt(0).toLowerCase()+d.objet.slice(1)+"), valable jusqu'au "+dt(d.valid).getDate()+" "+MOIS[dt(d.valid).getMonth()]]);
  });
  parcOf(c).forEach(function(m){
    var n=dt(m.next),late=n<dt(T.jour);
    if(m.due)out.push(["history",(late?"Révision en retard : ":"Révision à prévoir : ")+m.type.toLowerCase()+" "+m.marque+" "+m.modele+(late?", prévue le ":", le ")+n.getDate()+" "+MOIS[n.getMonth()]]);
  });
  if(!devisOf(c).length&&!parcOf(c).length)out.push(["sparkles","Nouveau client : présenter la gamme STIHL de débroussailleuses et la machine de démonstration"]);
  out.push(["package","Proposer les pièces et consommables d'origine de la saison"]);
  out.push(["users","Présenter les autres sociétés du groupe utiles à ce client"]);
  return out;
}

/* ---------- 1. Ma journée ---------- */
function vJournee(){
  var nOk=MY.filter(function(v){return v.pt==="ok";}).length;
  var h='<h2 class="h">Ma journée</h2><p class="lede">'+cap(longD(T.jour))+' : '+pl(MY.length,"visite")+" dans l'ordre de passage, avec ce que la direction veut voir abordé chez chaque client.</p>"+
  '<div class="sum"><div><b>'+MY.length+'</b><span>visites prévues</span></div><div><b>'+nOk+" sur "+MY.length+'</b><span>pointées chez le client</span></div><div><b>'+new Set(MY.map(function(v){return v.zone;})).size+'</b><span>villes : '+MY.map(function(v){return v.zone;}).join(", ")+"</span></div></div>";
  h+=MY.map(function(v,i){
    var p=PF[v.client];
    return '<div class="stop"><span class="nb">'+(i+1)+'</span><span class="ln"></span><div class="card"><div class="st-h"><div class="sp"><h3>'+esc(v.client)+'</h3><p class="st-s">'+esc(v.zone)+" · "+esc(p.seg)+" · "+esc(p.civ+" "+p.contact)+'</p></div><span class="pill n">'+hh(v.h1)+"</span></div>"+
    '<p class="obj"><b>Objectif :</b> '+esc(OBJ[v.client])+"</p>"+
    '<p class="lbl" style="margin:12px 0 6px">À aborder, demandé par la direction</p><ul class="todo">'+dirTopics(v.client).map(function(t){return "<li>"+ic(t[0])+"<span>"+esc(t[1])+"</span></li>";}).join("")+"</ul>"+
    '<div class="btns"><a class="btn sm" href="#pointage" data-go="'+v.id+'">'+ic("map-pin")+"Pointer</a>"+'<a class="btn sm" href="#debrief" data-go="'+v.id+'">'+ic("lightbulb")+"Débrief</a></div></div></div>";
  }).join("");
  return h;
}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}

/* ---------- 2. Pointage ---------- */
var state={pv:MY[0].id,dv:MY[0].id,open:{},done:{}};
function offset(pt,dm,bdeg){var b=bdeg*Math.PI/180,la=pt[1];return [pt[0]+dm*Math.sin(b)/(111320*Math.cos(la*Math.PI/180)),pt[1]+dm*Math.cos(b)/111320];}
function coord(p){return fr(Math.abs(p[1]),4)+"° N, "+fr(Math.abs(p[0]),4)+"° O";}
function mapSvg(v){
  var W=340,H=170,cx=W/2,cy=H/2,dm=v.pt==="loin"?v.d*1000:(v.d||0),span=v.pt==="loin"?Math.max(dm*3.4,2000):700,k=W/span,r=200*k,s="";
  s+='<svg class="map" viewBox="0 0 '+W+" "+H+'" role="img" aria-label="Position du pointage par rapport à l\'adresse du client">';
  for(var x=0;x<=W;x+=34)s+='<line x1="'+x+'" y1="0" x2="'+x+'" y2="'+H+'" stroke="#F0F0EE"/>';
  for(var y=0;y<=H;y+=34)s+='<line x1="0" y1="'+y+'" x2="'+W+'" y2="'+y+'" stroke="#F0F0EE"/>';
  s+='<path d="M0 '+(cy+34)+" C 90 "+(cy+10)+", 200 "+(cy+70)+", "+W+" "+(cy+40)+'" stroke="#E4E4E0" stroke-width="7" fill="none"/>';
  s+='<path d="M'+(cx-120)+' 0 L '+(cx-60)+" "+H+'" stroke="#E4E4E0" stroke-width="5" fill="none"/>';
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+Math.max(r,7)+'" fill="rgba(24,121,78,.08)" stroke="#18794E" stroke-dasharray="3 3"/>';
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="5" fill="#111"/>';
  var lb=[],px=null,py=null;
  if(v.pt!=="non"){
    var b=(v.pt==="loin"?62:50)*Math.PI/180;px=cx+dm*k*Math.sin(b);py=cy-dm*k*Math.cos(b);
    if(v.pt==="loin"){px=cx-dm*k*Math.sin(b);py=cy-dm*k*Math.cos(b);}
    var col=v.pt==="ok"?"#18794E":"#E5A100";
    if(v.pt==="loin"){s+='<line x1="'+cx+'" y1="'+cy+'" x2="'+px+'" y2="'+py+'" stroke="#9A6100" stroke-dasharray="4 4"/><text x="'+((cx+px)/2+8)+'" y="'+((cy+py)/2-8)+'" font-size="11" font-weight="600" font-family="Inter" fill="#9A6100">'+fr(v.d,1)+" km</text>";}
    s+='<circle cx="'+px+'" cy="'+py+'" r="9" fill="'+col+'" fill-opacity=".18"/><circle cx="'+px+'" cy="'+py+'" r="5" fill="'+col+'" stroke="#fff" stroke-width="1.5"/>';
  }
  /* Étiquettes : client au-dessus à droite, position en dessous à gauche, 8 px d'écart, fond blanc */
  var G=8,LH=18,dots=[{x:cx,y:cy,r:5}];if(px!==null)dots.push({x:px,y:py,r:9});
  function clear(bx,by,bw,d){var nx=Math.max(bx,Math.min(d.x,bx+bw)),ny=Math.max(by,Math.min(d.y,by+LH));return Math.hypot(d.x-nx,d.y-ny)>=d.r+G;}
  function place(t,w,d,up,other){var bw=w+8,bx=up?d.x+d.r+G:d.x-d.r-G-bw,by=up?d.y-d.r-G-LH:d.y+d.r+G,by0=by;
    bx=Math.max(4,Math.min(W-4-bw,bx));
    var obst=dots.concat(lb.map(function(l){return {box:l};}));
    for(var i=0;i<80;i++){var ok=dots.every(function(o){return clear(bx,by,bw,o);})&&lb.every(function(l){return bx+bw+4<l.x||bx>l.x+l.w+4||by+LH+4<l.y||by>l.y+LH+4;});if(ok)break;by+=up?-1:1;}
    by=Math.max(2,Math.min(H-34-LH,by));
    var L={t:t,x:bx,y:by,w:bw,lead:Math.abs(by-by0)>4,d:d,up:up};lb.push(L);return L;}
  place("Adresse du client",91,dots[0],true);
  if(px!==null)place("Votre position",72,dots[1],false);
  lb.forEach(function(L){var d=L.d,col=L.t==="Votre position"?"#6B6B6B":"#111";
    if(L.lead){var ey=L.up?L.y+LH-4:L.y+4,ex=L.up?L.x:L.x+L.w;s+='<path d="M'+d.x+" "+(L.up?d.y-d.r-2:d.y+d.r+2)+" L "+d.x+" "+ey+" L "+ex+" "+ey+'" stroke="'+col+'" stroke-width="1" fill="none" opacity=".55"/>';}
    s+='<rect class="lbl" x="'+L.x+'" y="'+L.y+'" width="'+L.w+'" height="'+LH+'" rx="4" fill="#FFFFFF" fill-opacity=".85"/><text class="lbl-t" x="'+(L.x+4)+'" y="'+(L.y+13)+'" font-size="11" font-family="Inter" fill="#3D3D3D">'+L.t+"</text>";});
  var bar=v.pt==="loin"?1000:100;
  s+='<line x1="14" y1="'+(H-14)+'" x2="'+(14+bar*k)+'" y2="'+(H-14)+'" stroke="#6B6B6B" stroke-width="2"/><text x="14" y="'+(H-20)+'" font-size="10" font-family="Inter" fill="#6B6B6B">'+(v.pt==="loin"?"1 km":"100 m")+"</text></svg>";
  return s;
}
function chips(sel,attr){return '<div class="chips">'+MY.map(function(v,i){return '<button class="chip'+(v.id===sel?" on":"")+'" data-'+attr+'="'+v.id+'"><b>'+(i+1)+" · "+hh(v.h1)+"</b><span>"+esc(v.client)+"</span></button>";}).join("")+"</div>";}
function vPointage(){
  var v=MY.filter(function(x){return x.id===state.pv;})[0],p=PF[v.client];
  var pos=v.pt==="non"?null:(v.pt==="loin"?offset(p.pt,v.d*1000,-50):offset(p.pt,v.d,50));
  var h='<h2 class="h">Pointage</h2><p class="lede">En arrivant, le commercial appuie sur « Je suis chez le client ». Le téléphone relève sa position et la compare à l\'adresse du client : à moins de 200 m, la présence est confirmée.</p>'+chips(v.id,"pv");
  h+='<div class="card"><div class="row"><div class="sp"><b>'+esc(v.client)+'</b><p class="st-s">'+esc(v.zone)+" · "+esc(p.civ+" "+p.contact)+"</p></div>"+(v.pt==="ok"?'<span class="pill g"><span class="dot"></span>Chez le client</span>':v.pt==="loin"?'<span class="pill a"><span class="dot"></span>Hors zone</span>':'<span class="pill r"><span class="dot"></span>Non pointé</span>')+"</div>";
  h+='<div style="margin-top:10px">'+mapSvg(v)+"</div>";
  h+='<div class="pt-g"><div><small>Arrivée</small><b>'+(v.pt==="non"?"–":hh(v.h1))+'</b></div><div><small>Départ</small><b>'+(v.pt==="non"?"–":hh(v.h2))+"</b></div></div>";
  if(pos)h+='<p class="pt-pos">Position relevée : '+coord(pos)+" · à "+(v.pt==="loin"?fr(v.d,1)+" km":v.d+" m")+" de l'adresse du client</p>";
  if(v.pt==="ok")h+='<div class="hz g">'+ic("circle-check-big")+"<span>Présence confirmée : pointage à "+v.d+" m de l'adresse, dans le rayon de 200 m.</span></div>";
  if(v.pt==="loin")h+='<div class="hz a">'+ic("triangle-alert")+"<span><b>Hors zone.</b> Le pointage a été fait à "+fr(v.d,1)+" km de l'adresse du client"+(v.abs?" ; l'interlocuteur était absent":"")+". Le chef des ventes le voit dans sa vue.</span></div>";
  if(v.pt==="non")h+='<div class="hz r">'+ic("triangle-alert")+"<span><b>Pas de pointage</b> pour cette visite. Elle reste à vérifier par le chef des ventes.</span></div>";
  h+="</div>";
  h+='<button class="btn pri" data-act="in">'+ic("navigation")+"Je suis chez le client</button>"+'<div class="btns"><button class="btn sm" data-act="out">'+ic("log-out")+'Je quitte le client</button><a class="btn sm" href="#compte-rendu">'+ic("mic")+"Compte rendu</a></div>";
  return h;
}

/* ---------- 3. Compte rendu vocal ---------- */
var V28=MY[0];
var TRANS="Bon, je sors de la Coopérative Agricole du Fromager, à Gagnoa. J'ai vu monsieur Zadi. Ils ont besoin de dix débroussailleuses pour l'entretien des parcelles avant la saison. Je lui ai montré la FS 400 sur la fiche : ça l'intéresse, mais il veut l'essayer avant de décider, et je n'avais pas de machine de démonstration avec moi. Il faut que je revienne avec une débroussailleuse, et qu'on prépare le devis pour les dix machines.";
function vCR(){
  var h='<h2 class="h">Compte rendu en 30 secondes</h2><p class="lede">Juste après la visite, le commercial dicte une note vocale. Elle est transcrite puis rangée en compte rendu, sans rien taper.</p>';
  h+='<div class="card"><div class="rec"><span class="mic">'+ic("mic")+'</span><div class="sp"><b>Note vocale · '+esc(V28.client)+'</b><p class="st-s">'+esc(V28.zone)+" · "+cap(longD(T.jour))+", "+hh(V28.h2)+' · 29 secondes</p></div></div><audio controls preload="metadata" src="assets/note-vocale.mp3?v=20261124a"></audio><p class="lbl" style="margin:12px 0 6px">Transcription</p><p class="tx">'+esc(TRANS)+"</p></div>";
  h+='<p class="lbl">Compte rendu tiré de la note</p><div class="cr">'+
   '<div class="card c-g"><h4>'+ic("thumbs-up")+'Points positifs</h4><ul><li>Besoin clair : 10 débroussailleuses pour l\'entretien des parcelles avant la saison.</li><li>Intérêt pour la STIHL FS 400 présentée sur la fiche.</li></ul></div>'+
   '<div class="card c-r"><h4>'+ic("thumbs-down")+'Points négatifs</h4><ul><li>Pas de machine de démonstration sur place : la décision est reportée à l\'essai.</li><li>Pièces d\'origine, atelier et stock disponible non présentés.</li></ul></div>'+
   '<div class="card c-n"><h4>'+ic("flag")+'Prochaine étape</h4><ul><li>'+esc(V28.next)+", et fixer la date de l'essai avec M. Zadi.</li></ul></div>"+
   '<div class="card c-d"><h4>'+ic("file-text")+'Devis à faire</h4><ul><li>10 débroussailleuses STIHL FS 400 pour la Coopérative Agricole du Fromager, avec les équipements de protection en option.</li></ul></div></div>';
  h+='<div class="btns"><button class="btn sm" data-act="cr-chef">'+ic("send")+'Envoyer au chef</button><a class="btn sm" href="#debrief" data-go="'+V28.id+'">'+ic("lightbulb")+"Voir le débrief</a></div>";
  return h;
}

/* ---------- 4. Débrief ---------- */
var AUTRES={"SACRI":["Trans-Roulements pour les roulements et les flexibles","SAFIR pour l'affûtage et les outils de coupe","PST-CI pour l'hydraulique et la réparation"]};
function phrase(v,key,kind){
  var p=PF[v.client],dv=devisOf(v.client).filter(function(d){return d.st==="Envoyé";})[0],m=parcOf(v.client).filter(function(x){return x.due;})[0];
  if(kind==="om")return {
    origine:"« Chez nous, toutes les pièces sont d'origine STIHL : vos machines gardent leur garantie et tiennent plus longtemps sur le terrain. »",
    atelier:"« Notre atelier assure l'entretien et les réparations, et nous vous prévenons avant chaque révision pour ne jamais arrêter un chantier. »",
    stock:"« Le matériel est en stock à Abidjan : vous n'attendez pas une importation pour démarrer la saison. »",
    demo:"« Je peux vous apporter une machine de démonstration pour un essai chez vous, avec vos équipes. »"}[key];
  return {
    devis:dv?"« Où en est votre décision sur le devis "+dv.n+" ? Dites-moi ce qui bloque, je peux l'adapter. »":"« Voulez-vous que je vous prépare un devis sur ce besoin ? »",
    revision:m?"« Votre "+m.type.toLowerCase()+" "+m.modele+" doit passer en révision : on fixe ensemble le passage à l'atelier ? »":"« Quand vos machines ont-elles été révisées pour la dernière fois ? »",
    pieces:"« Pour la saison, avez-vous ce qu'il faut en chaînes, filtres et consommables ? »",
    projet:"« Quels sont vos prochains chantiers ou vos prochains achats dans les mois qui viennent ? »",
    groupe:"« Le groupe peut aussi vous servir avec "+(AUTRES[v.soc]||AUTRES.SACRI).slice(0,2).join(" et ")+". »"}[key];
}
function trois(v){
  var a=[],om=v.om.slice(),na=v.na.slice();
  while(a.length<3&&(om.length||na.length)){if(na.length)a.push(phrase(v,na.shift(),"na"));if(a.length<3&&om.length)a.push(phrase(v,om.shift(),"om"));}
  return a;
}
function ring(sc){
  var R=31,C=2*Math.PI*R,f=sc==null?0:sc/10,col=sc==null?"#D4D4D0":sc>=7?"#18794E":sc>=5?"#E5A100":"#C8352B";
  return '<svg class="ring" viewBox="0 0 74 74"><circle cx="37" cy="37" r="'+R+'" fill="none" stroke="#F1F1EF" stroke-width="7"/><circle cx="37" cy="37" r="'+R+'" fill="none" stroke="'+col+'" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+(C*f)+" "+C+'" transform="rotate(-90 37 37)"/><text x="37" y="42" text-anchor="middle" font-family="Inter" font-size="'+(sc==null?14:18)+'" font-weight="650" fill="#111">'+(sc==null?"–":sc)+'</text><text x="37" y="55" text-anchor="middle" font-family="Inter" font-size="9" fill="#6B6B6B">'+(sc==null?"":"sur 10")+"</text></svg>";
}
function vDebrief(){
  var v=MY.filter(function(x){return x.id===state.dv;})[0];
  var h='<h2 class="h">Débrief du rendez-vous</h2><p class="lede">Juste après la visite, le commercial demande ce qu\'il aurait pu dire de mieux. La réponse s\'appuie sur son compte rendu et sur les sujets attendus par la direction.</p>'+chips(v.id,"dv");
  h+='<div class="ask">'+ic("message-circle")+"<span>« Qu'est-ce que j'aurais pu dire de mieux chez "+esc(v.client)+" ? »</span></div>";
  if(v.abs){
    h+='<div class="card sc">'+ring(null)+"<p><b>Pas de note pour cet échange.</b> L'interlocuteur était absent : le catalogue a été laissé au magasinier.</p></div>";
    h+='<p class="lbl">Sujets de la direction à reprendre</p><div class="tags">'+v.na.map(function(k){return '<span class="pill a">'+esc(SUJ[k])+"</span>";}).join("")+"</div>";
    h+='<p class="lbl">Pour l\'appel de lundi, vous pourriez dire</p><div class="card"><ol class="say">'+[phrase(v,"devis","na"),phrase(v,"revision","na"),phrase(v,"stock","om")].map(function(s){return "<li><span>"+esc(s)+"</span></li>";}).join("")+"</ol></div>";
    return h;
  }
  var mot=v.sc>=7?"Bon échange : l'essentiel a été couvert.":v.sc>=5?"Échange correct, avec des sujets et des arguments laissés de côté.":"Échange trop court sur l'essentiel : plusieurs sujets attendus et arguments n'ont pas été abordés.";
  h+='<div class="card sc">'+ring(v.sc)+"<p><b>"+mot+"</b><br>"+v.ab.length+" sujet"+(v.ab.length>1?"s":"")+" attendu"+(v.ab.length>1?"s":"")+" abordé"+(v.ab.length>1?"s":"")+" sur "+(v.ab.length+v.na.length)+", "+v.arg.length+" argument"+(v.arg.length>1?"s":"")+" utilisé"+(v.arg.length>1?"s":"")+" sur "+(v.arg.length+v.om.length)+".</p></div>";
  h+='<p class="lbl">Sujets de la direction non abordés</p><div class="tags">'+(v.na.length?v.na.map(function(k){return '<span class="pill a">'+esc(SUJ[k])+"</span>";}).join(""):'<span class="pill g">Tous abordés</span>')+"</div>";
  h+='<p class="lbl">Arguments omis</p><div class="tags">'+(v.om.length?v.om.map(function(k){return '<span class="pill r">'+esc(ARG[k])+"</span>";}).join(""):'<span class="pill g">Aucun</span>')+"</div>";
  var t=trois(v);
  h+='<p class="lbl">Ce que vous auriez pu dire</p><div class="card"><ol class="say">'+(t.length?t:["« Merci pour cet échange : je reviens vers vous à la date convenue. »"]).map(function(s){return "<li><span>"+esc(s)+"</span></li>";}).join("")+"</ol></div>";
  h+='<p class="lbl">Prochaine étape</p><div class="card"><p style="font-size:13.5px">'+esc(v.next)+"</p></div>";
  return h;
}

/* ---------- 5. Alertes ---------- */
var ALERTS=[
 {id:"a1",kind:"Demande de devis",ico:"file-text",c:"o",client:"Grumes de l'Indénié",when:"Aujourd'hui, 08 h 42",from:"Mme Ahoua, Grumes de l'Indénié (Abengourou)",
  mail:"Bonjour, pouvez-vous compléter votre devis D-26-124 avec six chaînes de rechange pour les MS 382 ? Nous voulons tout recevoir avant le démarrage du nouveau lot de coupe.",
  draft:"Bonjour Madame Ahoua,\n\nMerci pour votre message. Je fais compléter le devis D-26-124 avec six chaînes de rechange pour vos MS 382 et je vous l'envoie dès qu'il est prêt.\n\nJe vous appelle aujourd'hui pour confirmer le modèle de chaîne et la date de démarrage de votre lot de coupe.\n\nBien cordialement,\nAnge K., SACRI",
  why:"Arrivée sur la boîte commerciale ; Ange K. suit ce client."},
 {id:"a2",kind:"Réclamation",ico:"triangle-alert",c:"r",client:"Coopérative Hévéicole de Divo",when:"Aujourd'hui, 11 h 05",from:"M. Brou, Coopérative Hévéicole de Divo",
  mail:"Bonjour, nous avions rendez-vous pour la révision de notre atomiseur SR 450 et personne n'est venu. La campagne de traitement commence bientôt, nous ne pouvons pas attendre.",
  draft:"Bonjour Monsieur Brou,\n\nJe vous présente nos excuses pour ce rendez-vous manqué. Je vois avec l'atelier dès ce matin pour fixer une nouvelle date de révision de votre atomiseur SR 450, avant le début de votre campagne.\n\nJe vous rappelle dans la journée pour vous la confirmer.\n\nBien cordialement,\nAnge K., SACRI",
  why:"Réclamation : le chef des ventes est mis en copie."},
 {id:"a3",kind:"Commande",ico:"package",c:"g",client:"Palmeraies de l'Agnéby",when:"Hier, 18 h 10",from:"Mme Assi, Palmeraies de l'Agnéby (Agboville)",
  mail:"Bonsoir, suite à notre échange, nous souhaitons commander deux atomiseurs SR 450 de plus, aux mêmes conditions que la dernière fois. Merci de nous confirmer.",
  draft:"Bonjour Madame Assi,\n\nMerci pour votre commande de deux atomiseurs SR 450 supplémentaires. Je la transmets aujourd'hui pour préparation et je reviens vers vous avec la confirmation et la date de livraison.\n\nBien cordialement,\nAnge K., SACRI",
  why:"Arrivée hier soir par e-mail : sans l'appli, elle aurait attendu le retour au bureau."}
];
function vAlertes(){
  var n=ALERTS.filter(function(a){return !state.done[a.id];}).length;
  var h='<h2 class="h">Alertes en direct</h2><p class="lede">Une demande de devis, une réclamation ou une commande arrivée par e-mail pour un de vos clients arrive aussitôt sur votre téléphone, avec un brouillon de réponse. Rien ne part sans vous.</p>';
  h+='<div class="sum"><div><b>'+n+'</b><span>à traiter</span></div><div><b>'+ALERTS.length+'</b><span>reçues depuis hier soir</span></div><div><b>0</b><span>envoyée sans vous</span></div></div>';
  h+=ALERTS.map(function(a){
    var op=state.open[a.id],dn=state.done[a.id];
    return '<div class="al-i'+(op?" open":"")+(dn?" done":"")+'"><button class="al-h" data-al="'+a.id+'"><span class="al-ic '+a.c+'">'+ic(a.ico)+'</span><span><h3>'+esc(a.kind)+" · "+esc(a.client)+"</h3><p>"+esc(a.mail.slice(0,72))+'…</p></span><span><span class="tm">'+esc(a.when)+"</span>"+(dn?"":'<span class="new"></span>')+"</span></button>"+
    '<div class="al-b"><div class="mail"><p class="from">'+ic("mail")+" "+esc(a.from)+"</p>"+esc(a.mail)+'</div><p class="lbl" style="margin:12px 0 6px">Brouillon de réponse</p><div class="draft">'+esc(a.draft)+'</div><p class="why">'+esc(a.why)+'</p><div class="btns"><button class="btn sm" data-act="copy" data-id="'+a.id+'">'+ic("copy")+'Copier</button><button class="btn sm pri" data-act="done" data-id="'+a.id+'">'+ic("check")+(dn?"Traitée":"Marquer traitée")+"</button></div></div></div>";
  }).join("");
  return h;
}

/* ---------- 6. Vue du chef des ventes ---------- */
function vChef(){
  var vs=T.visites,td=vs.filter(function(v){return v.j===T.jour;}),pok=vs.filter(function(v){return v.pt==="ok";});
  var tdr=td.filter(function(v){return !v.abs;}),ab=0,at=0;tdr.forEach(function(v){ab+=v.ab.length;at+=v.ab.length+v.na.length;});
  var nv=T.portefeuille.filter(function(p){var k=since(p.lv);return k===null||k>30;}).sort(function(a,b){var x=since(a.lv),y=since(b.lv);return (y===null?1e4:y)-(x===null?1e4:x);});
  var bad=vs.filter(function(v){return v.pt!=="ok";});
  var h='<h2 class="h">Vue du chef des ventes</h2><p class="lede">Toute l\'équipe, '+longD(T.jour)+" : comptes rendus du jour, pointages de la semaine et clients à reprendre.</p>";
  h+='<div class="kp"><div><b>'+vs.length+'</b><span>visites cette semaine, du lundi au jeudi</span></div><div><b>'+pct(pok.length/vs.length)+'</b><span>présence pointée chez le client ('+pok.length+" sur "+vs.length+')</span></div><div><b>'+pct(ab/at)+'</b><span>sujets attendus abordés aujourd\'hui ('+ab+" sur "+at+')</span></div><div><b>'+nv.length+'</b><span>clients non vus depuis 30 jours</span></div></div>';
  h+='<p class="lbl">Comptes rendus du jour</p>';
  D.commerciaux.forEach(function(c){
    var l=td.filter(function(v){return v.com===c;}),sc=l.filter(function(v){return v.sc!=null;}),m=sc.length?sc.reduce(function(s,v){return s+v.sc;},0)/sc.length:null;
    h+='<div class="card"><div class="row"><b class="sp">'+esc(c)+'</b><span class="pill n">'+pl(l.length,"visite")+"</span>"+(m!=null?'<span class="pill '+(m>=7?"g":m>=5?"a":"r")+'">'+fr(m,1)+" / 10</span>":"")+"</div>";
    h+=l.map(function(v){return '<div class="tm-r" style="margin-top:8px"><h4>'+esc(v.client)+'</h4><span>'+(v.pt==="ok"?'<span class="pill g"><span class="dot"></span>Pointé</span>':v.pt==="loin"?'<span class="pill a"><span class="dot"></span>'+fr(v.d,1)+" km</span>":'<span class="pill r"><span class="dot"></span>Non pointé</span>')+"</span><p><small>"+esc(v.zone)+" · "+hh(v.h1)+" · </small>"+esc(v.next)+"</p></div>";}).join("")+"</div>";
  });
  h+='<p class="lbl">Pointages à vérifier cette semaine</p><div class="card"><ul class="vq">'+bad.map(function(v){var y=v.pt==="loin";return '<li><span class="d '+(y?"y":"r")+'"></span><span><b>'+esc(v.com)+"</b><small>"+esc(v.client)+'</small></span><span class="e">'+(y?"à "+fr(v.d,1)+" km":"non pointé")+"<small> · "+shortD(v.j)+"</small></span></li>";}).join("")+'</ul><div class="lgd"><span><i style="background:var(--yel)"></i>pointé loin de l\'adresse</span><span><i style="background:var(--red)"></i>non pointé</span></div></div>';
  h+='<p class="lbl">Clients non visités depuis 30 jours</p><div class="card"><ul class="vq">'+nv.map(function(p){var k=since(p.lv);return '<li><span class="d" style="background:var(--mut2)"></span><span><b>'+esc(p.client)+"</b><small>"+esc(p.com)+" · "+esc(p.zone)+'</small></span><span class="e">'+(k===null?"jamais visité":"il y a "+k+" jours")+"<small>"+esc(p.ct)+" le "+dt(p.cd).getDate()+"/"+(dt(p.cd).getMonth()+1)+"</small></span></li>";}).join("")+"</ul></div>";
  h+='<a class="btn" href="https://leslita06.github.io/sacri-tableau-commercial/#terrain" target="_blank" rel="noopener">'+ic("map")+"Ouvrir la vue « Terrain » du tableau commercial"+ic("arrow-up-right")+"</a>";
  return h;
}

/* ---------- navigation ---------- */
var VIEWS=[["journee","Ma journée","Tournée, objectifs et sujets de la direction",vJournee],["pointage","Pointage","Je suis chez le client, carte, hors zone",vPointage],["compte-rendu","Compte rendu","Note vocale transformée en compte rendu",vCR],["debrief","Débrief","Score, omissions, ce que j'aurais pu dire",vDebrief],["alertes","Alertes","Demandes de clients poussées sur le téléphone",vAlertes],["chef","Vue du chef","Toute l'équipe, pointages, clients non vus",vChef]];
function cur(){var h=(location.hash||"").slice(1);return VIEWS.some(function(v){return v[0]===h;})?h:"journee";}
function render(){
  var c=cur();
  VIEWS.forEach(function(v){var el=$("v-"+v[0]);if(v[0]===c){el.innerHTML=v[3]();el.classList.add("on");}else{el.classList.remove("on");el.innerHTML="";}});
  document.querySelectorAll(".tabs a,.ar-l a").forEach(function(a){a.classList.toggle("on",a.getAttribute("data-v")===c);});
  var n=ALERTS.filter(function(a){return !state.done[a.id];}).length;$("b-al").textContent=n||"";
  $("who").textContent=c==="chef"?"Chef des ventes":ME+" · SACRI";
  $("when").textContent=cap(longD(T.jour))+" 2026";
}
function go(){render();var s=$("scr");if(s)s.scrollTop=0;window.scrollTo(0,0);}
var tm;function toast(m){var t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(tm);tm=setTimeout(function(){t.classList.remove("on");},3800);}
document.addEventListener("click",function(e){
  var a=e.target.closest("[data-go]");if(a){state.pv=state.dv=a.getAttribute("data-go");}
  var b=e.target.closest("[data-pv]");if(b){state.pv=b.getAttribute("data-pv");render();return;}
  b=e.target.closest("[data-dv]");if(b){state.dv=b.getAttribute("data-dv");render();return;}
  b=e.target.closest("[data-al]");if(b){var id=b.getAttribute("data-al");state.open[id]=!state.open[id];render();return;}
  b=e.target.closest("[data-act]");if(!b)return;
  var act=b.getAttribute("data-act"),v=MY.filter(function(x){return x.id===state.pv;})[0];
  if(act==="in")toast(v.pt==="ok"?"Arrivée enregistrée à "+hh(v.h1)+" : vous êtes à "+v.d+" m de l'adresse du client.":v.pt==="loin"?"Arrivée enregistrée à "+hh(v.h1)+" : hors zone, à "+fr(v.d,1)+" km de l'adresse du client.":"Position introuvable : la visite reste à vérifier.");
  if(act==="out")toast(v.pt==="non"?"Départ non enregistré : pas de pointage d'arrivée.":"Départ enregistré à "+hh(v.h2)+".");
  if(act==="cr-chef")toast("Démonstration : le compte rendu serait envoyé au chef des ventes. Rien n'est envoyé ici.");
  if(act==="copy"){var al=ALERTS.filter(function(x){return x.id===b.getAttribute("data-id");})[0];try{navigator.clipboard.writeText(al.draft);}catch(err){}toast("Brouillon copié : relisez-le avant de l'envoyer.");}
  if(act==="done"){state.done[b.getAttribute("data-id")]=true;render();toast("Alerte marquée traitée.");}
});
window.addEventListener("hashchange",go);
$("ar-l").innerHTML=VIEWS.map(function(v,i){return '<li><a href="#'+v[0]+'" data-v="'+v[0]+'"><span class="n">'+(i+1)+"</span><span><b>"+v[1]+"</b><small>"+v[2]+"</small></span></a></li>";}).join("");
paint();render();
})();
