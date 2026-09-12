// ============================================================
// SUB PATROL — side-scrolling submarine arcade game
// Reward game for Treasure Cove. Unlocks after all 5 math
// decks are completed. Golden sub skin after all English decks.
// Tap = fire torpedo | drag up/down = steer
// ============================================================
(function(){
'use strict';
if(window.__SUBPATROL_LOADED)return;window.__SUBPATROL_LOADED=true;

// ---------- helpers ----------
function clamp(v,a,b){return v<a?a:(v>b?b:v)}
function rand(a,b){return a+Math.random()*(b-a)}
function dist2(ax,ay,bx,by){var dx=ax-bx,dy=ay-by;return dx*dx+dy*dy}

// ---------- tiny synth ----------
var AC=null;
function ac(){
  if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){AC=null}}
  if(AC&&AC.state==='suspended'){try{AC.resume()}catch(e){}}
  return AC;
}
function tone(freq,dur,type,vol,slide){
  var a=ac();if(!a)return;
  try{
    var o=a.createOscillator(),g=a.createGain();
    o.type=type||'sine';o.frequency.setValueAtTime(freq,a.currentTime);
    if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,slide),a.currentTime+dur);
    g.gain.setValueAtTime(vol||0.15,a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+dur);
    o.connect(g);g.connect(a.destination);
    o.start();o.stop(a.currentTime+dur);
  }catch(e){}
}
function noiseBoom(){
  var a=ac();if(!a)return;
  try{
    var len=Math.floor(a.sampleRate*0.35),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
    for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2);
    var s=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();
    f.type='lowpass';f.frequency.value=420;
    g.gain.value=0.3;
    s.buffer=buf;s.connect(f);f.connect(g);g.connect(a.destination);s.start();
  }catch(e){}
}
var SFX={
  fire:function(){tone(880,0.12,'square',0.08,320)},
  coin:function(){tone(1320,0.09,'sine',0.14);setTimeout(function(){tone(1760,0.12,'sine',0.12)},60)},
  pearl:function(){tone(1046,0.2,'sine',0.12,1568)},
  boom:function(){noiseBoom();tone(120,0.3,'sawtooth',0.12,50)},
  ouch:function(){tone(300,0.25,'sawtooth',0.16,90)},
  fanfare:function(){tone(523,0.12,'square',0.1);setTimeout(function(){tone(659,0.12,'square',0.1)},120);setTimeout(function(){tone(784,0.2,'square',0.12)},240)},
  click:function(){tone(600,0.05,'square',0.08)}
};

// ---------- config ----------
var PATROL_HS_KEY='se_patrol_v1';
function loadHS(){try{return(JSON.parse(localStorage.getItem(PATROL_HS_KEY)||'{}'))}catch(e){return{}}}
function saveHS(h){try{localStorage.setItem(PATROL_HS_KEY,JSON.stringify(h))}catch(e){}}
var MILESTONE_SHIPS=['Vasa','Mary Rose','HMS Britannia','RMS Lusitania','IJN Yamato','Costa Concordia'];
var MILESTONE_DIST=350;

// ---------- game state ----------
var G=null;

window.startSubPatrol=function(){
  SFX.click();
  if(typeof showScreen==='function')showScreen('patrol-game-screen');
  var over=document.getElementById('patrol-game-over');
  if(over)over.style.display='none';
  var startOv=document.getElementById('patrol-start');
  var hs=loadHS();
  var bestEl=document.getElementById('patrol-best');
  if(bestEl)bestEl.textContent=hs.depth?('Best dive: '+hs.depth+'m'):('No dives yet!');
  if(startOv)startOv.style.display='flex';
  var goldEl=document.getElementById('patrol-goldnote');
  if(goldEl){
    var eng=!!(window.academyEnglishComplete&&window.academyEnglishComplete());
    goldEl.style.display=eng?'block':'none';
  }
};

function beginRun(){
  var startOv=document.getElementById('patrol-start');
  if(startOv)startOv.style.display='none';
  var over=document.getElementById('patrol-game-over');
  if(over)over.style.display='none';
  ac();

  var canvas=document.getElementById('patrol-canvas');
  var ctx=canvas.getContext('2d');
  var dpr=Math.min(window.devicePixelRatio||1,2);
  var w=canvas.offsetWidth||window.innerWidth,h=canvas.offsetHeight||window.innerHeight;
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);

  G={
    canvas:canvas,ctx:ctx,dpr:dpr,W:w,H:h,
    sub:{x:w*0.2,y:h*0.5,vy:0,tilt:0,r:30,prop:0,inv:0,blink:false},
    goldSkin:!!(window.academyEnglishComplete&&window.academyEnglishComplete()),
    targetY:h*0.5,
    torps:[],mines:[],crates:[],pearls:[],flyCoins:[],parts:[],bubbles:[],fish:[],
    hearts:3,depth:0,coins:0,frame:0,time:0,over:false,
    speed:150,elapsed:0,shake:0,flash:0,
    mineT:1.2,crateT:2.0,pearlT:4.0,fishT:0.5,
    milestoneIdx:-1,
    worldX:0,last:performance.now()
  };
  for(var i=0;i<6;i++)G.fish.push(makeFish(true));
  for(var b=0;b<24;b++)G.bubbles.push(makeBubble(rand(0,w)));
  bindInput();
  updateHUDHearts();
  requestAnimationFrame(loop);
}

// ---------- entities ----------
function makeBubble(x){return{x:x,y:rand(0,1),r:rand(2,6),w:rand(0,6.28),sp:rand(20,60)}}
function makeFish(initial){
  var cols=['#FF8A5C','#7EE8D4','#FFB84C','#A78BFA','#F472B6','#60A5FA'];
  return{
    x:initial?rand(-100,G.W+100):G.W+60,
    y:rand(60,Math.max(120,G.H-140)),
    vx:rand(40,110)*(Math.random()<0.7?-1:1),
    size:rand(10,20),
    col:cols[Math.floor(rand(0,cols.length))],
    wob:rand(0,6.28),
    deep:Math.random()<0.5
  };
}
function spawnMine(){G.mines.push({x:G.W+70,y:rand(80,Math.max(140,G.H-120)),r:26,bob:rand(0,6.28),bobAmp:rand(6,16),led:0})}
function spawnCrate(){G.crates.push({x:G.W+70,y:rand(90,Math.max(150,G.H-130)),s:46,bob:rand(0,6.28),glint:0,hp:2})}
function spawnPearl(){G.pearls.push({x:G.W+50,y:rand(70,Math.max(130,G.H-110)),r:14,bob:rand(0,6.28)})}
function burst(x,y,n,cols,spd,life){
  for(var i=0;i<n;i++){
    var a=rand(0,Math.PI*2),s=rand(spd*0.3,spd);
    G.parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:life||rand(0.4,0.9),max:1,r:rand(2,5),col:cols[Math.floor(rand(0,cols.length))]});
  }
}
function explosion(x,y){
  burst(x,y,16,['#FFD166','#FF6B35','#FF3D3D','#FFF1A8'],220,0.8);
  burst(x,y,8,['#ffffff','#9FE8FF'],120,0.5);
  G.flash=0.25;G.shake=Math.max(G.shake,10);
  SFX.boom();
}
function dropCoins(x,y,n){
  for(var i=0;i<n;i++){
    G.flyCoins.push({x:x,y:y,vx:rand(-90,-10),vy:rand(-220,-80),spin:rand(0,6.28),r:11});
  }
}

// ---------- input ----------
var ptr={down:false,x:0,y:0,t:0,moved:0};
function bindInput(){
  var c=G.canvas;
  function pos(e){
    var r=c.getBoundingClientRect();
    var t=(e.touches&&e.touches[0])||e;
    return{x:t.clientX-r.left,y:t.clientY-r.top};
  }
  function down(e){
    if(e.cancelable)e.preventDefault();
    var p=pos(e);ptr.down=true;ptr.x=p.x;ptr.y=p.y;ptr.t=performance.now();ptr.moved=0;
    G.targetY=p.y;
  }
  function move(e){
    if(!ptr.down)return;
    if(e.cancelable)e.preventDefault();
    var p=pos(e);ptr.moved+=Math.abs(p.y-ptr.y)+Math.abs(p.x-p.x);
    ptr.x=p.x;ptr.y=p.y;G.targetY=p.y;
  }
  function up(e){
    if(!ptr.down)return;
    ptr.down=false;
    var quick=(performance.now()-ptr.t)<260&&ptr.moved<24;
    if(quick)fireTorpedo();
  }
  c.ontouchstart=down;c.ontouchmove=move;c.ontouchend=up;
  c.ontouchcancel=function(){ptr.down=false};
  c.onmousedown=down;c.onmousemove=move;c.onmouseup=up;
}
function fireTorpedo(){
  if(!G||G.over)return;
  var s=G.sub;
  G.torps.push({x:s.x+38,y:s.y-2,vx:560,life:2.2});
  burst(s.x+40,s.y-2,4,['#BFE9FF','#7EC8E3'],90,0.35);
  SFX.fire();
}

// ---------- damage / game over ----------
function hurtSub(){
  var s=G.sub;
  if(s.inv>0)return;
  G.hearts--;
  s.inv=1.6;
  explosion(s.x+10,s.y);
  SFX.ouch();
  updateHUDHearts();
  if(G.hearts<=0)gameOver();
}
function gameOver(){
  if(!G||G.over)return;
  G.over=true;
  var g=G;
  setTimeout(function(){renderGameOver(g)},350);
}
function renderGameOver(g){
  if(g.coins>0&&window.Progress&&typeof window.Progress.addCoins==='function'){
    try{window.Progress.addCoins(g.coins)}catch(e){}
  }
  var hs=loadHS();
  var newBest=g.depth>(hs.depth||0);
  if(newBest)saveHS({depth:g.depth,coins:g.coins});
  var over=document.getElementById('patrol-game-over');
  if(over){
    document.getElementById('patrol-result-emoji').textContent=newBest?'🏆':'🚢';
    document.getElementById('patrol-result-title').textContent=newBest?'New Best Dive!':'Dive Complete!';
    document.getElementById('patrol-result-score').textContent='Coins collected: '+g.coins+' 🪙';
    document.getElementById('patrol-result-depth').textContent='Depth reached: '+g.depth+'m';
    over.style.display='flex';
  }
  if(newBest)SFX.fanfare();
  unbind(g);
}
window.patrolRetry=function(){
  SFX.click();
  if(G){G.over=true;unbind(G)}
  setTimeout(beginRun,60);
};
window.patrolQuit=function(){
  SFX.click();
  if(G){
    if(!G.over&&G.coins>0&&window.Progress&&typeof window.Progress.addCoins==='function'){
      try{window.Progress.addCoins(G.coins)}catch(e){}
    }
    G.over=true;unbind(G);
  }
  G=null;
  if(typeof showArcade==='function')showArcade();
};
function unbind(g){
  if(!g)return;
  var c=g.canvas;
  c.ontouchstart=null;c.ontouchmove=null;c.ontouchend=null;c.ontouchcancel=null;
  c.onmousedown=null;c.onmousemove=null;c.onmouseup=null;
}
function updateHUDHearts(){
  var el=document.getElementById('patrol-hearts');
  if(el&&G)el.textContent='❤️'.repeat(Math.max(0,G.hearts))+'🖤'.repeat(Math.max(0,3-G.hearts));
}
function updateHUD(){
  if(!G)return;
  var d=document.getElementById('patrol-depth');
  if(d)d.textContent=G.depth+'m';
  var c=document.getElementById('patrol-coin');
  if(c)c.textContent=G.coins;
}

// ---------- update ----------
function update(dt){
  var s=G.sub;
  G.elapsed+=dt;G.frame++;G.time+=dt;
  G.speed=150+Math.min(170,G.elapsed*2.0);
  G.depth=Math.floor(G.elapsed*12);
  G.worldX+=G.speed*dt;

  var dy=G.targetY-s.y;
  s.vy=clamp(dy*4.2,-260,260);
  s.y=clamp(s.y+s.vy*dt,s.r+8,Math.max(s.r+8,G.H-s.r-40));
  s.tilt=clamp(s.vy/260,-1,1)*0.32;
  s.prop+=dt*(10+Math.abs(s.vy)*0.02);
  if(s.inv>0)s.inv-=dt;
  s.blink=(s.inv>0)?(Math.floor(G.time*12)%2===0):false;

  for(var i=G.bubbles.length-1;i>=0;i--){
    var b=G.bubbles[i];
    b.y-=(b.sp*dt)/G.H;b.w+=dt*2;
    if(b.y<=-0.02){G.bubbles[i]=makeBubble(rand(0,G.W));G.bubbles[i].y=1.02}
  }
  G.fishT-=dt;
  if(G.fishT<=0){G.fishT=rand(1.5,3.5);if(G.fish.length<9)G.fish.push(makeFish(false))}
  for(var f=G.fish.length-1;f>=0;f--){
    var fi=G.fish[f];
    fi.x+=fi.vx*dt;fi.wob+=dt*6;
    if(fi.x<-120||fi.x>G.W+120)G.fish.splice(f,1);
  }
  if(G.frame%4===0)G.parts.push({x:s.x-34,y:s.y+rand(-6,6),vx:-rand(30,80)-G.speed*0.3,vy:rand(-20,20),life:rand(0.4,0.8),max:1,r:rand(1.5,3.5),col:'#BFE9FF'});

  G.mineT-=dt;
  if(G.mineT<=0){G.mineT=Math.max(0.7,1.7-G.elapsed*0.008);spawnMine()}
  G.crateT-=dt;
  if(G.crateT<=0){G.crateT=rand(3.6,5.2);spawnCrate()}
  G.pearlT-=dt;
  if(G.pearlT<=0){G.pearlT=rand(5,8);spawnPearl()}

  for(var t=G.torps.length-1;t>=0;t--){
    var tp=G.torps[t];
    tp.x+=tp.vx*dt;tp.life-=dt;
    if(G.frame%3===0)G.parts.push({x:tp.x-14,y:tp.y,vx:-40,vy:rand(-12,12),life:0.3,max:1,r:2,col:'#BFE9FF'});
    if(tp.x>G.W+60||tp.life<=0){G.torps.splice(t,1);continue}
    var hit=false;
    for(var m=G.mines.length-1;m>=0;m--){
      var mi=G.mines[m];
      if(dist2(tp.x,tp.y,mi.x,mi.y)<(mi.r+10)*(mi.r+10)){
        explosion(mi.x,mi.y);G.torps.splice(t,1);
        G.mines.splice(m,1);
        if(Math.random()<0.25)dropCoins(mi.x,mi.y,2);
        hit=true;break;
      }
    }
    if(hit)continue;
    for(var cr=G.crates.length-1;cr>=0;cr--){
      var c2=G.crates[cr];
      if(Math.abs(tp.x-c2.x)<c2.s*0.6&&Math.abs(tp.y-c2.y)<c2.s*0.6){
        c2.hp--;
        burst(tp.x,tp.y,6,['#D9A066','#8a5a2b','#FFD166'],140,0.5);
        G.torps.splice(t,1);
        if(c2.hp<=0){
          burst(c2.x,c2.y,12,['#FFD700','#FFE27A','#D9A066'],190,0.7);
          dropCoins(c2.x,c2.y,Math.floor(rand(3,6)));
          SFX.coin();
          G.crates.splice(cr,1);
        }
        hit=true;break;
      }
    }
  }

  for(var m2=G.mines.length-1;m2>=0;m2--){
    var mn=G.mines[m2];
    mn.x-=G.speed*dt;mn.bob+=dt*2;mn.led+=dt*6;
    if(mn.x<-80){G.mines.splice(m2,1);continue}
    if(s.inv<=0&&dist2(s.x,s.y,mn.x,mn.y)<(s.r*0.8+mn.r*0.8)*(s.r*0.8+mn.r*0.8)){
      G.mines.splice(m2,1);hurtSub();
      if(G.over)return;
    }
  }
  for(var c3=G.crates.length-1;c3>=0;c3--){
    var cb=G.crates[c3];
    cb.x-=G.speed*dt;cb.bob+=dt*2;cb.glint+=dt*3;
    if(cb.x<-90){G.crates.splice(c3,1)}
  }
  for(var p2=G.pearls.length-1;p2>=0;p2--){
    var pl=G.pearls[p2];
    pl.x-=G.speed*dt;pl.bob+=dt*2.4;
    if(pl.x<-40){G.pearls.splice(p2,1);continue}
    if(dist2(s.x,s.y,pl.x,pl.y)<(s.r+pl.r)*(s.r+pl.r)){
      G.pearls.splice(p2,1);
      burst(pl.x,pl.y,10,['#ffffff','#FFD1E8','#BFE9FF'],160,0.6);
      G.coins+=2;SFX.pearl();updateHUD();
    }
  }
  for(var fc=G.flyCoins.length-1;fc>=0;fc--){
    var co=G.flyCoins[fc];
    var ddx=s.x-co.x,ddy=s.y-co.y,dd=Math.sqrt(ddx*ddx+ddy*ddy);
    if(dd<400&&dd>1){
      co.vx+=(ddx/dd)*1400*dt;co.vy+=(ddy/dd)*1400*dt;
    }
    co.x+=co.vx*dt;co.y+=co.vy*dt;co.vx*=(1-2.2*dt);co.spin+=dt*9;
    if(dd<26){
      G.flyCoins.splice(fc,1);G.coins++;SFX.coin();updateHUD();
      burst(s.x,s.y-10,3,['#FFD700','#FFE27A'],120,0.35);
    }else if(co.x<-30||co.y<-30||co.y>G.H+30){G.flyCoins.splice(fc,1)}
  }
  for(var pt=G.parts.length-1;pt>=0;pt--){
    var pp=G.parts[pt];
    pp.x+=pp.vx*dt;pp.y+=pp.vy*dt;pp.vy-=70*dt;
    pp.life-=dt;
    if(pp.life<=0)G.parts.splice(pt,1);
  }
  if(G.shake>0)G.shake=Math.max(0,G.shake-40*dt);
  if(G.flash>0)G.flash-=dt;

  var msIdx=Math.floor(G.depth/MILESTONE_DIST);
  if(msIdx>G.milestoneIdx){
    G.milestoneIdx=msIdx;
    var ship=MILESTONE_SHIPS[msIdx%MILESTONE_SHIPS.length];
    var bn=document.getElementById('patrol-banner');
    if(bn){
      bn.textContent='🚢 You passed the '+ship+'!';
      bn.classList.add('show');
      setTimeout(function(){bn.classList.remove('show')},2400);
    }
    SFX.fanfare();
  }
  updateHUD();
}

// ---------- render ----------
function hexA(hex,a){
  var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return 'rgba('+r+','+g+','+b+','+a+')';
}
function drawWreckSil(ctx,x,baseY,scale,alpha){
  ctx.save();ctx.translate(x,baseY);ctx.scale(scale,scale);ctx.globalAlpha=alpha;
  ctx.fillStyle='#052940';
  ctx.beginPath();
  ctx.moveTo(-120,0);
  ctx.quadraticCurveTo(-140,-40,-90,-52);
  ctx.lineTo(90,-56);
  ctx.quadraticCurveTo(150,-40,130,0);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='#052940';ctx.lineWidth=7;
  ctx.beginPath();ctx.moveTo(-30,-52);ctx.lineTo(-48,-130);ctx.stroke();
  ctx.beginPath();ctx.moveTo(40,-54);ctx.lineTo(26,-110);ctx.stroke();
  ctx.fillStyle=hexA('#7EE8D4',0.35);
  for(var i=-2;i<=2;i++){ctx.beginPath();ctx.arc(i*30,-24,5,0,6.28);ctx.fill()}
  ctx.restore();
}
function drawSeaweed(ctx,x,baseY,h,t,tint){
  ctx.strokeStyle=tint;ctx.lineWidth=5;ctx.lineCap='round';
  for(var i=0;i<3;i++){
    var sway=Math.sin(t*1.4+i*1.7)*10;
    ctx.beginPath();ctx.moveTo(x+i*10,baseY);
    ctx.quadraticCurveTo(x+i*10+sway*0.4,baseY-h*0.55,x+i*10+sway,baseY-h*(0.8+i*0.1));
    ctx.stroke();
  }
}
function drawCoral(ctx,x,baseY){
  var cols=['#FF7B9C','#FF9F68','#B583F0'];
  var c=cols[Math.abs(Math.floor(x/97)+7)%3];
  ctx.fillStyle=hexA(c,0.85);
  for(var i=0;i<5;i++){
    ctx.beginPath();
    ctx.arc(x+Math.cos(i*1.3)*14,baseY-Math.abs(Math.sin(i*2.1))*16,9+i%3,0,6.28);
    ctx.fill();
  }
  ctx.fillStyle=hexA('#FFD166',0.5);
  ctx.beginPath();ctx.arc(x-18,baseY-4,7,0,6.28);ctx.fill();
  ctx.beginPath();ctx.arc(x+20,baseY-2,5,0,6.28);ctx.fill();
}
function drawStarfish(ctx,x,baseY,t){
  ctx.save();ctx.translate(x,baseY);ctx.rotate(Math.sin(t*0.4)*0.2);
  ctx.fillStyle=hexA('#FF9F68',0.9);
  ctx.beginPath();
  for(var i=0;i<5;i++){
    var a=i*(Math.PI*2/5)-Math.PI/2;
    ctx.lineTo(Math.cos(a)*12,Math.sin(a)*12);
    var a2=a+Math.PI/5;
    ctx.lineTo(Math.cos(a2)*5,Math.sin(a2)*5);
  }
  ctx.closePath();ctx.fill();ctx.restore();
}

function drawSub(ctx,s,t,gold){
  ctx.save();
  ctx.translate(s.x,s.y);
  ctx.rotate(s.tilt);
  if(s.blink)ctx.globalAlpha=0.35;

  var grad=ctx.createRadialGradient(58,-2,4,58,-2,110);
  grad.addColorStop(0,hexA('#FFF3B0',0.35));
  grad.addColorStop(1,'rgba(255,243,176,0)');
  ctx.fillStyle=grad;
  ctx.beginPath();ctx.arc(58,-2,110,0,6.28);ctx.fill();

  ctx.save();ctx.translate(-42,0);
  ctx.fillStyle='#1d3a4d';
  ctx.beginPath();ctx.arc(0,0,9,0,6.28);ctx.fill();
  ctx.fillStyle=hexA('#9FE8FF',0.9);
  for(var i=0;i<3;i++){
    ctx.save();ctx.rotate(s.prop+i*(Math.PI*2/3));
    ctx.beginPath();ctx.ellipse(0,-13,4.5,13,0,0,6.28);ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  ctx.fillStyle=gold?'#B8860B':'#C77800';
  ctx.beginPath();
  ctx.moveTo(-6,-22);ctx.quadraticCurveTo(2,-46,18,-44);ctx.quadraticCurveTo(16,-26,20,-22);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle=gold?'#8B6508':'#8a5a2b';ctx.lineWidth=5;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-14,-22);ctx.lineTo(-14,-38);ctx.lineTo(-4,-38);ctx.stroke();

  var hg=ctx.createLinearGradient(0,-30,0,30);
  if(gold){hg.addColorStop(0,'#FFF3B0');hg.addColorStop(0.5,'#FFD700');hg.addColorStop(1,'#C99700')}
  else{hg.addColorStop(0,'#FFE27A');hg.addColorStop(0.5,'#FFC93C');hg.addColorStop(1,'#E8A400')}
  ctx.fillStyle=hg;
  ctx.beginPath();ctx.ellipse(0,0,46,26,0,0,6.28);ctx.fill();
  ctx.fillStyle=hexA('#FFFFFF',0.35);
  ctx.beginPath();ctx.ellipse(2,10,36,12,0,0,6.28);ctx.fill();
  ctx.fillStyle=gold?'#8B6508':'#B8860B';
  ctx.fillRect(-46,6,92,5);
  ctx.fillStyle=gold?'#8B6508':'#B8860B';
  for(var r=-3;r<=3;r++){ctx.beginPath();ctx.arc(r*12,-14,1.8,0,6.28);ctx.fill()}

  var dg=ctx.createRadialGradient(20,-14,2,20,-14,14);
  dg.addColorStop(0,'#DFF9FF');dg.addColorStop(0.6,'#7EE8D4');dg.addColorStop(1,'#1d6e63');
  ctx.fillStyle=dg;
  ctx.beginPath();ctx.arc(20,-14,13,0,6.28);ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.75)';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(20,-14,13,-2.3,-1.3);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.8)';
  ctx.beginPath();ctx.ellipse(16,-19,4,2.4,-0.6,0,6.28);ctx.fill();

  ctx.fillStyle=gold?'#B8860B':'#E8940A';
  ctx.beginPath();ctx.ellipse(44,0,5,16,0,0,6.28);ctx.fill();
  ctx.fillStyle='#FFF3B0';
  ctx.beginPath();ctx.arc(46,-2,4,0,6.28);ctx.fill();
  ctx.restore();

  if(gold&&Math.random()<0.3){
    ctx.fillStyle='rgba(255,255,255,0.9)';
    ctx.beginPath();ctx.arc(s.x+rand(-30,30),s.y+rand(-20,20),1.5,0,6.28);ctx.fill();
  }
}

function drawMine(ctx,m){
  var y=m.y+Math.sin(m.bob)*m.bobAmp*0.3;
  ctx.save();ctx.translate(m.x,y);
  ctx.strokeStyle='rgba(60,90,110,0.6)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,m.r);ctx.lineTo(6,m.r+18);ctx.stroke();
  ctx.fillStyle='#22384a';
  for(var i=0;i<8;i++){
    var a=i*(Math.PI*2/8);
    ctx.save();ctx.rotate(a);
    ctx.beginPath();ctx.moveTo(-6,-m.r+3);ctx.lineTo(0,-m.r-10);ctx.lineTo(6,-m.r+3);ctx.closePath();ctx.fill();
    ctx.restore();
  }
  var g=ctx.createRadialGradient(-8,-8,4,0,0,m.r);
  g.addColorStop(0,'#4a6a82');g.addColorStop(0.6,'#2b4258');g.addColorStop(1,'#16283a');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(0,0,m.r,0,6.28);ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,0.35)';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(0,0,m.r*0.62,0,6.28);ctx.stroke();
  var led=0.35+0.65*Math.abs(Math.sin(m.led));
  ctx.fillStyle=hexA('#FF3D3D',led);
  ctx.beginPath();ctx.arc(0,-6,4.5,0,6.28);ctx.fill();
  ctx.fillStyle=hexA('#FF3D3D',led*0.3);
  ctx.beginPath();ctx.arc(0,-6,10,0,6.28);ctx.fill();
  ctx.restore();
}
function drawCrate(ctx,c){
  var y=c.y+Math.sin(c.bob)*5;
  ctx.save();ctx.translate(c.x,y);
  ctx.rotate(Math.sin(c.bob*0.7)*0.08);
  var s=c.s;
  var g=ctx.createLinearGradient(0,-s/2,0,s/2);
  g.addColorStop(0,'#A06A32');g.addColorStop(1,'#6B421C');
  ctx.fillStyle=g;
  ctx.fillRect(-s/2,-s/2,s,s);
  ctx.strokeStyle='#4a2f14';ctx.lineWidth=4;
  ctx.strokeRect(-s/2,-s/2,s,s);
  ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(-s/2,-s/6);ctx.lineTo(s/2,-s/6);ctx.moveTo(-s/2,s/6);ctx.lineTo(s/2,s/6);ctx.stroke();
  ctx.fillStyle='#FFD700';
  ctx.beginPath();ctx.arc(0,0,6,0,6.28);ctx.fill();
  ctx.fillStyle='#8B6508';ctx.fillRect(-1.5,-3,3,6);
  var gl=Math.abs(Math.sin(c.glint));
  if(gl>0.85){
    ctx.fillStyle='rgba(255,255,255,'+((gl-0.85)*4).toFixed(2)+')';
    ctx.save();ctx.translate(s/2-10,-s/2+10);
    ctx.beginPath();
    ctx.moveTo(0,-7);ctx.lineTo(2,-2);ctx.lineTo(7,0);ctx.lineTo(2,2);ctx.lineTo(0,7);ctx.lineTo(-2,2);ctx.lineTo(-7,0);ctx.lineTo(-2,-2);
    ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
}
function drawPearl(ctx,p,t){
  var y=p.y+Math.sin(p.bob)*7;
  ctx.save();ctx.translate(p.x,y);
  var glow=0.5+0.5*Math.sin(t*3+p.bob);
  ctx.fillStyle=hexA('#FFD1E8',0.25+glow*0.2);
  ctx.beginPath();ctx.arc(0,0,p.r+7,0,6.28);ctx.fill();
  var g=ctx.createRadialGradient(-3,-3,1,0,0,p.r);
  g.addColorStop(0,'#ffffff');g.addColorStop(0.7,'#F0F4FF');g.addColorStop(1,'#B8C4E0');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(0,0,p.r,0,6.28);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.95)';
  ctx.beginPath();ctx.ellipse(-4,-4,3.4,2,-0.6,0,6.28);ctx.fill();
  ctx.restore();
}
function drawCoin(ctx,c){
  ctx.save();ctx.translate(c.x,c.y);
  var sq=Math.abs(Math.cos(c.spin));
  ctx.scale(clamp(sq,0.18,1),1);
  var g=ctx.createRadialGradient(-2,-3,1,0,0,c.r);
  g.addColorStop(0,'#FFF3B0');g.addColorStop(0.6,'#FFD700');g.addColorStop(1,'#C99700');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(0,0,c.r,0,6.28);ctx.fill();
  ctx.strokeStyle='#8B6508';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(0,0,c.r,0,6.28);ctx.stroke();
  ctx.restore();
}
function drawFish(ctx,f,t){
  ctx.save();ctx.translate(f.x,f.y+Math.sin(f.wob)*4);
  var dir=f.vx>0?1:-1;
  ctx.scale(dir*(f.deep?0.7:1),f.deep?0.7:1);
  ctx.globalAlpha=f.deep?0.5:0.95;
  ctx.fillStyle=f.col;
  ctx.beginPath();ctx.ellipse(0,0,f.size,f.size*0.55,0,0,6.28);ctx.fill();
  var tl=Math.sin(t*10+f.wob)*0.4;
  ctx.save();ctx.rotate(tl);
  ctx.beginPath();ctx.moveTo(-f.size,0);ctx.lineTo(-f.size-9,-6);ctx.lineTo(-f.size-9,6);ctx.closePath();ctx.fill();
  ctx.restore();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(f.size*0.4,-2,3,0,6.28);ctx.fill();
  ctx.fillStyle='#123';ctx.beginPath();ctx.arc(f.size*0.45,-2,1.5,0,6.28);ctx.fill();
  ctx.restore();
}

function render(){
  var ctx=G.ctx,W=G.W,H=G.H,t=G.time;
  ctx.save();
  if(G.shake>0){
    ctx.translate(rand(-G.shake,G.shake)*0.4,rand(-G.shake,G.shake)*0.4);
  }

  var bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#0E5C7A');
  bg.addColorStop(0.45,'#0A4460');
  bg.addColorStop(1,'#031B2E');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.globalCompositeOperation='lighter';
  for(var r=0;r<4;r++){
    var rx=((r*W/3.2)+(G.worldX*0.05)%(W*1.4))-W*0.2;
    ctx.save();
    ctx.translate(rx,-10);
    ctx.rotate(0.22+Math.sin(t*0.5+r*2)*0.06);
    var rg=ctx.createLinearGradient(0,0,0,H*0.85);
    rg.addColorStop(0,hexA('#BFF4FF',0.10));
    rg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=rg;
    ctx.beginPath();
    ctx.moveTo(-30,0);ctx.lineTo(30,0);ctx.lineTo(120,H*0.85);ctx.lineTo(20,H*0.85);
    ctx.closePath();ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  var fx1=-((G.worldX*0.12)%(W+560));
  drawWreckSil(ctx,fx1+180,H*0.78,1.1,0.35);
  drawWreckSil(ctx,fx1+180+W*0.55+280,H*0.82,0.8,0.25);

  for(var fb=0;fb<G.fish.length;fb++){
    if(G.fish[fb].deep)drawFish(ctx,G.fish[fb],t);
  }

  var floorY=H*0.86;
  ctx.fillStyle='#0A3148';
  ctx.beginPath();ctx.moveTo(0,H);
  for(var sx=0;sx<=W;sx+=24){
    ctx.lineTo(sx,floorY+Math.sin((sx+G.worldX*0.35)*0.008)*18);
  }
  ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  var floorY2=H*0.93;
  ctx.fillStyle='#07293E';
  ctx.beginPath();ctx.moveTo(0,H);
  for(var sx2=0;sx2<=W;sx2+=24){
    ctx.lineTo(sx2,floorY2+Math.sin((sx2+G.worldX*0.6)*0.011+2)*14);
  }
  ctx.lineTo(W,H);ctx.closePath();ctx.fill();

  var seg=Math.floor((G.worldX*0.35)/160);
  var decorCount=Math.ceil(W/160)+2;
  for(var d=0;d<decorCount;d++){
    var wx=d*160-((G.worldX*0.35)%160);
    var seed=(seg+d)*7919;
    var kind=Math.abs(seed*31)%4;
    var baseY=floorY+Math.sin((wx+G.worldX*0.35)*0.008)*18+4;
    if(kind===0)drawSeaweed(ctx,wx+30,baseY,52,t*0.7,'rgba(20,120,90,0.7)');
    else if(kind===1)drawCoral(ctx,wx+40,baseY-4);
    else if(kind===2)drawStarfish(ctx,wx+50,baseY+6,t);
    else drawSeaweed(ctx,wx+60,baseY,34,t*0.9,'rgba(40,160,120,0.5)');
  }

  for(var p=0;p<G.pearls.length;p++)drawPearl(ctx,G.pearls[p],t);
  for(var c=0;c<G.crates.length;c++)drawCrate(ctx,G.crates[c]);
  for(var m=0;m<G.mines.length;m++)drawMine(ctx,G.mines[m]);

  for(var ff=0;ff<G.fish.length;ff++){
    if(!G.fish[ff].deep)drawFish(ctx,G.fish[ff],t);
  }

  for(var tp=0;tp<G.torps.length;tp++){
    var T=G.torps[tp];
    ctx.save();ctx.translate(T.x,T.y);
    var tg=ctx.createLinearGradient(0,-6,0,6);
    tg.addColorStop(0,'#E8F4FF');tg.addColorStop(1,'#9FC5E8');
    ctx.fillStyle=tg;
    ctx.beginPath();ctx.ellipse(0,0,18,7,0,0,6.28);ctx.fill();
    ctx.fillStyle='#FF6B35';
    ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(24,-7);ctx.lineTo(24,7);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(-14,-4);ctx.lineTo(-20,-10);ctx.lineTo(-16,0);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(-14,4);ctx.lineTo(-20,10);ctx.lineTo(-16,0);ctx.closePath();ctx.fill();
    ctx.restore();
  }

  for(var co=0;co<G.flyCoins.length;co++)drawCoin(ctx,G.flyCoins[co]);

  drawSub(ctx,G.sub,t,G.goldSkin);

  for(var pa=0;pa<G.parts.length;pa++){
    var P=G.parts[pa];
    ctx.globalAlpha=clamp(P.life/P.max,0,1)*0.9;
    ctx.fillStyle=P.col;
    ctx.beginPath();ctx.arc(P.x,P.y,P.r,0,6.28);ctx.fill();
  }
  ctx.globalAlpha=1;

  ctx.strokeStyle='rgba(200,240,255,0.35)';
  ctx.lineWidth=1.4;
  for(var bb=0;bb<G.bubbles.length;bb++){
    var B=G.bubbles[bb];
    var bx=B.x+Math.sin(B.w+B.y*8)*8;
    var by=B.y*H;
    ctx.beginPath();ctx.arc(bx,by,B.r,0,6.28);ctx.stroke();
    ctx.beginPath();ctx.arc(bx-B.r*0.3,by-B.r*0.3,B.r*0.25,0,6.28);ctx.stroke();
  }

  var vg=ctx.createRadialGradient(W/2,H/2,H*0.35,W/2,H/2,H*0.85);
  vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(1,10,20,0.42)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);

  if(G.flash>0){
    ctx.fillStyle=hexA('#FF6B35',clamp(G.flash*1.6,0,0.5));
    ctx.fillRect(0,0,W,H);
  }

  ctx.restore();
}

// ---------- loop ----------
function loop(now){
  if(!G||G.over)return;
  var dt=clamp((now-G.last)/1000,0,0.033)||0.016;
  G.last=now;
  update(dt);
  if(!G||G.over)return;
  render();
  requestAnimationFrame(loop);
}

window.addEventListener('resize',function(){
  if(!G||G.over)return;
  var c=G.canvas;
  var w=c.offsetWidth||window.innerWidth,h=c.offsetHeight||window.innerHeight;
  c.width=Math.round(w*G.dpr);c.height=Math.round(h*G.dpr);
  G.ctx.setTransform(G.dpr,0,0,G.dpr,0,0);
  G.W=w;G.H=h;
  G.targetY=clamp(G.targetY,0,h);
  G.sub.y=clamp(G.sub.y,40,Math.max(40,h-70));
});

window.patrolStartRun=beginRun;
})();
