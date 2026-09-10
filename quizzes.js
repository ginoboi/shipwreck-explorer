// ============================================================
// WARSHIP ACADEMY — quiz module for Shipwreck Explorer
// Self-contained: all data, UI and logic live in this file.
// To add a new quiz deck, just add an entry to DECKS below.
// ============================================================
(function(){

// ---------- helpers to build questions ----------
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function numDistractors(answer){
  var cands=[answer-2,answer-1,answer+1,answer+2,answer+3];
  var out=[];
  for(var i=0;i<cands.length&&out.length<3;i++){
    var c=cands[i];
    if(c>=0&&c!==answer&&out.indexOf(c)===-1){out.push(c)}
  }
  while(out.length<3){out.push(answer+out.length+4)}
  return out.map(String);
}
function numQ(prompt,answer){return{q:prompt,a:String(answer),d:numDistractors(answer)}}
function mcQ(prompt,answer,wrong){return{q:prompt,a:answer,d:[wrong]}}

// ---------- deck data (worksheet content as-is) ----------
// Quiz 1.2 sequences: [full sequence, [indexes of blanks]]
var SEQ=[
  [[10,9,8,7,6,5],[0,2,3]],
  [[1,2,3,4,5,6],[2,4,5]],
  [[7,6,5,4,3,2],[1,2,5]],
  [[7,8,9,10,11,12],[1,2,3]],
  [[5,4,3,2,1,0],[2,4,5]],
  [[6,7,8,9,10,11],[1,4]],
  [[10,9,8,7,6,5],[1,4,5]],
  [[0,1,2,3,4,5],[2,3,4]]
];
var seqQuestions=[];
SEQ.forEach(function(item){
  item[1].forEach(function(blankIdx){
    var shown=item[0].map(function(n,i){return i===blankIdx?'<span class="aq-blank">?</span>':n});
    seqQuestions.push(numQ('Count on or count backwards.<br><span class="aq-seq">'+shown.join(', ')+'</span><br>Which number is missing?',item[0][blankIdx]));
  });
});

var DECKS=[
  {
    id:'q11', icon:'1️⃣', title:'Count and Compare',
    subtitle:'Numbers within 10',
    questions:[
      {q:'Supply the missing letter to complete the number word for 7.<br><span class="aq-word">s e v <span class="aq-blank">?</span> n</span>',a:'e',d:['a','o']},
      {q:'Supply the missing letter to complete the number word for 1.<br><span class="aq-word">o n <span class="aq-blank">?</span></span>',a:'e',d:['a','o']},
      {q:'Supply the missing letter to complete the number word for 2.<br><span class="aq-word">t w <span class="aq-blank">?</span></span>',a:'o',d:['a','e']},
      {q:'Supply the missing letter to complete the number word for 6.<br><span class="aq-word">s i <span class="aq-blank">?</span></span>',a:'x',d:['e','s']},
      {q:'Supply the missing letter to complete the number word for 10.<br><span class="aq-word">t e <span class="aq-blank">?</span></span>',a:'n',d:['m','a']},
      {q:'Supply the missing letter to complete the number word for 3.<br><span class="aq-word">t h <span class="aq-blank">?</span> e e</span>',a:'r',d:['e','a']},
      numQ('Count the objects. How many are there?<br><span class="aq-emoji">🚢🚢🚢🚢🚢</span>',5),
      numQ('Count the objects. How many are there?<br><span class="aq-emoji">🐠🐠🐠🐠🐠🐠</span>',6),
      numQ('Count the objects. How many are there?<br><span class="aq-emoji">⭐⭐⭐⭐</span>',4),
      numQ('Count the objects. How many are there?<br><span class="aq-emoji">🐚🐚🐚🐚🐚🐚🐚</span>',7),
      mcQ('Compare the two groups.<br><span class="aq-emoji">⚡⚡⚡⚡</span> = Group A<br><span class="aq-emoji">☁️☁️☁️☁️</span> = Group B<br>Group A and Group B <b>___</b> number.','have the same','do not have the same'),
      mcQ('Compare the two groups.<br><span class="aq-emoji">🍩🍩🍩</span> = Group C<br><span class="aq-emoji">⛔⛔</span> = Group D<br>Group C and Group D <b>___</b> number.','do not have the same','have the same'),
      mcQ('Count and compare the two groups.<br><span class="aq-emoji">🐠🐠🐠🐠🐠</span> = Group H<br><span class="aq-emoji">🐠🐠</span> = Group I<br>Group H has <b>___</b> than Group I.','more','less'),
      mcQ('Count and compare the two groups.<br><span class="aq-emoji">⭐⭐</span> = Group H<br><span class="aq-emoji">⭐⭐⭐⭐</span> = Group I<br>Group I has <b>___</b> than Group H.','more','less'),
      mcQ('Josh has 9 coins. Sam has 6 coins.<br>Who has more coins?','Josh','Sam'),
      mcQ('A pencil costs 10 pesos. An eraser costs 8 pesos.<br>Which one costs less?','The eraser','The pencil')
    ]
  },
  {
    id:'q12', icon:'2️⃣', title:'Count On and Backwards',
    subtitle:'Missing numbers',
    questions: seqQuestions.concat([
      numQ('A frog is on lily pad number 8. It jumps back 4 lily pads.<br>Which lily pad is the frog on now?',4),
      numQ('A squirrel is on tree stump number 2. It jumps forward 6 stumps.<br>Which tree stump is the squirrel on now?',8),
      numQ('A puppy is standing on tile number 4. It walks forward 5 tiles.<br>Which tile is the puppy standing on now?',9),
      numQ('A ladybug is on flower number 7. It crawls back 2 flowers.<br>Which flower is the ladybug on now?',5)
    ])
  },
  {
    id:'q13', icon:'3️⃣', title:'Make Number Bonds',
    subtitle:'Number bonds to 10',
    questions:[
      numQ('Match the numbers that make 5.<br>3 and <span class="aq-blank">?</span> make 5',2),
      numQ('Match the numbers that make 5.<br>1 and <span class="aq-blank">?</span> make 5',4),
      numQ('Match the numbers that make 5.<br>5 and <span class="aq-blank">?</span> make 5',0),
      numQ('Match the numbers that make 6.<br>4 and <span class="aq-blank">?</span> make 6',2),
      numQ('Match the numbers that make 6.<br>3 and <span class="aq-blank">?</span> make 6',3),
      numQ('Match the numbers that make 6.<br>5 and <span class="aq-blank">?</span> make 6',1),
      numQ('Complete the number bond for 8.<br>8 = 6 + <span class="aq-blank">?</span>',2),
      numQ('Complete the number bond for 8.<br>8 = 5 + <span class="aq-blank">?</span>',3),
      numQ('Complete the number bond for 8.<br>8 = 4 + <span class="aq-blank">?</span>',4),
      numQ('Complete the number bond for 8.<br>8 = 7 + <span class="aq-blank">?</span>',1),
      numQ('Complete the number bond for 7.<br>7 = 3 + <span class="aq-blank">?</span>',4),
      numQ('Complete the number bond for 7.<br>7 = 5 + <span class="aq-blank">?</span>',2),
      numQ('Complete the number bond for 7.<br>7 = 6 + <span class="aq-blank">?</span>',1),
      numQ('Complete the number bond for 9.<br>9 = 4 + <span class="aq-blank">?</span>',5),
      numQ('Complete the number bond for 9.<br>9 = 8 + <span class="aq-blank">?</span>',1),
      numQ('Complete the number bond for 9.<br>9 = 6 + <span class="aq-blank">?</span>',3),
      numQ('Complete the number bond for 10.<br>10 = 7 + <span class="aq-blank">?</span>',3),
      numQ('Complete the number bond for 10.<br>10 = 9 + <span class="aq-blank">?</span>',1),
      numQ('Complete the number bond for 10.<br>10 = 5 + <span class="aq-blank">?</span>',5),
      numQ('There are 9 girls. 5 are wearing glasses.<br>How many are NOT wearing glasses?',4),
      numQ('There are 10 students. 7 are girls.<br>How many are boys?',3)
    ]
  },
  {
    id:'q14', icon:'4️⃣', title:'Write Addition Sentences',
    subtitle:'Adding within 10',
    questions:[
      numQ('Jed has 6 coins. He receives 4 more coins.<br>How many coins does Jed have now?',10),
      numQ('Mr. Vidad did 3 laps around the field in the morning. In the afternoon, he did 6 laps.<br>How many laps did he do in all?',9),
      numQ('Jack has 5 marbles. Ram gives him 5 more marbles.<br>How many marbles does Jack have now?',10),
      numQ('Pete has 8 pencils. Josh has 2 markers.<br>How many pencils does Pete have?',8),
      numQ('Look at the picture groups.<br><span class="aq-emoji">⭐⭐⭐⭐⭐ + ⭐⭐⭐⭐</span><br>5 + 4 = ?',9),
      numQ('Complete the addition sentence.<br><span class="aq-blank">?</span> + 6 = 10',4),
      numQ('Count and add.<br><span class="aq-emoji">⭐⭐⭐ + ⭐⭐</span><br>How many stars in all?',5),
      numQ('Count and add.<br><span class="aq-emoji">🐠🐠🐠 + 🐠</span><br>How many fish in all?',4),
      numQ('Add.<br>4 + 2 = ?',6),
      numQ('Add.<br>2 + 5 = ?',7),
      numQ('Add.<br>3 + 3 = ?',6),
      numQ('Add.<br>9 + 1 = ?',10),
      numQ('Add.<br>5 + 3 = ?',8),
      numQ('Add.<br>4 + 4 = ?',8),
      numQ('Fill in the missing number to complete the number bond.<br>6 + <span class="aq-blank">?</span> = 10',4),
      numQ('Fill in the missing number to complete the number bond.<br>3 + <span class="aq-blank">?</span> = 9',6),
      numQ('Fill in the missing number to complete the number bond.<br>7 + <span class="aq-blank">?</span> = 9',2),
      numQ('Fill in the missing number to complete the number bond.<br>5 + <span class="aq-blank">?</span> = 10',5),
      numQ('There are 2 packs of chocolates on the table. Jom adds 7 more packs.<br>How many packs of chocolates are there in all?',9),
      numQ('4 boys entered the classroom at 7:20 a.m. Another 4 boys entered at 7:25 a.m.<br>How many boys entered the classroom?',8),
      numQ('John puts 9 fish in the tank. Andy does not put any fish in the tank.<br>How many fish are in the tank?',9)
    ]
  },
  {
    id:'q15', icon:'5️⃣', title:'Make Subtraction Sentences',
    subtitle:'Subtracting within 10',
    questions:[
      numQ('Fill in the missing number.<br>10 - <span class="aq-blank">?</span> = 6',4),
      numQ('Fill in the missing number.<br><span class="aq-blank">?</span> - 4 = 5',9),
      numQ('Fill in the missing number.<br>7 - <span class="aq-blank">?</span> = 7',0),
      numQ('Fill in the missing number.<br>8 - <span class="aq-blank">?</span> = 5',3),
      numQ('Fill in the missing number.<br><span class="aq-blank">?</span> - 2 = 8',10),
      numQ('Fill in the missing number.<br>9 - <span class="aq-blank">?</span> = 0',9),
      numQ('10 birds sit on a branch. 3 birds fly away.<br>How many birds are left on the branch?',7),
      numQ('Ben had 9 toy cars. He lost 6 toy cars.<br>How many toy cars does Ben have left?',3),
      numQ('There are 8 dogs. 3 dogs are white.<br>How many dogs are NOT white?',5),
      numQ('Subtract.<br>10 - 2 = ?',8),
      numQ('Subtract.<br>8 - 0 = ?',8),
      numQ('Subtract.<br>9 - 9 = ?',0),
      numQ('Subtract.<br>10 - 4 = ?',6),
      numQ('Subtract.<br>7 - 2 = ?',5),
      numQ('Subtract.<br>9 - 1 = ?',8),
      numQ('James had 10 pencils. He gave 2 pencils to Ben.<br>How many pencils does James have left?',8),
      numQ('There are 9 eggs in the fridge. Mom cooked one egg each for Jim, Jam, and Jack.<br>How many eggs are left in the fridge?',6),
      numQ('Jake had 8 red marbles. He lost 2 red marbles.<br>How many red marbles are left?',6)
    ]
  }
];

// ---------- storage ----------
var STORE_KEY='se_academy_v1';
function loadProgress(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch(e){return{}}}
function saveProgress(p){try{localStorage.setItem(STORE_KEY,JSON.stringify(p))}catch(e){}}
function getDeckProgress(id){var p=loadProgress();return p[id]||{best:0,total:0,done:false}}

// ---------- UI ----------
var CSS='<style>'+
'.academy-wrap{width:100%;max-width:520px;max-height:100%;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:8px 4px;-webkit-overflow-scrolling:touch}'+
'.academy-title{font-size:clamp(24px,7vw,36px);color:#ffd700;font-weight:bold;text-align:center;text-shadow:0 2px 6px rgba(0,0,0,0.5)}'+
'.academy-sub{font-size:clamp(13px,3.5vw,16px);color:#4ecdc4;text-align:center;margin-bottom:6px}'+
'.academy-cards{display:flex;flex-direction:column;gap:10px}'+
'.academy-deck{background:rgba(0,26,51,0.85);border:2px solid #4ecdc4;border-radius:14px;padding:12px 14px;cursor:pointer;transition:transform .12s;display:flex;align-items:center;gap:12px;text-align:left}'+
'.academy-deck:active{transform:scale(0.97)}'+
'.academy-deck.done{border-color:#ffd700}'+
'.academy-deck-icon{font-size:34px}'+
'.academy-deck-name{font-size:clamp(15px,4vw,19px);color:#fff;font-weight:bold}'+
'.academy-deck-info{font-size:clamp(11px,3vw,13px);color:#4ecdc4;margin-top:2px}'+
'.academy-deck-score{margin-left:auto;text-align:right;font-size:clamp(11px,3vw,13px);color:#ffd700;font-weight:bold;white-space:nowrap}'+
'.aq-topbar{display:flex;align-items:center;justify-content:space-between;gap:8px}'+
'.aq-back{background:rgba(0,26,51,0.85);border:2px solid #4ecdc4;border-radius:10px;color:#4ecdc4;font-size:18px;padding:6px 14px;cursor:pointer;font-weight:bold}'+
'.aq-count{color:#fff;font-size:clamp(13px,3.5vw,16px);font-weight:bold;background:rgba(0,26,51,0.85);border-radius:10px;padding:6px 12px}'+
'.aq-coins{color:#ffd700;font-size:clamp(13px,3.5vw,16px);font-weight:bold;background:rgba(0,26,51,0.85);border-radius:10px;padding:6px 12px}'+
'.aq-dots{display:flex;gap:5px;justify-content:center;flex-wrap:wrap}'+
'.aq-dot{width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,0.25);transition:background .2s}'+
'.aq-dot.cur{background:#4ecdc4;transform:scale(1.25)}'+
'.aq-dot.ok{background:#ffd700}'+
'.aq-card{background:rgba(0,26,51,0.85);border:2px solid #4ecdc4;border-radius:16px;padding:18px 16px;text-align:center}'+
'.aq-prompt{color:#fff;font-size:clamp(16px,4.5vw,21px);line-height:1.6}'+
'.aq-word{color:#ffd700;font-size:clamp(22px,6vw,30px);letter-spacing:6px;font-weight:bold}'+
'.aq-seq{color:#ffd700;font-size:clamp(22px,6vw,30px);font-weight:bold}'+
'.aq-emoji{font-size:clamp(26px,7vw,34px);letter-spacing:4px}'+
'.aq-blank{color:#FF6B35;font-weight:bold}'+
'.aq-choices{display:grid;grid-template-columns:1fr 1fr;gap:10px}'+
'.aq-choices.wide{grid-template-columns:1fr}'+
'.aq-choice{background:linear-gradient(180deg,#004e7d,#003459);border:3px solid #4ecdc4;border-radius:14px;color:#fff;font-size:clamp(20px,6vw,28px);font-weight:bold;padding:16px 8px;cursor:pointer;min-height:64px;transition:transform .1s}'+
'.aq-choice:active{transform:scale(0.96)}'+
'.aq-choice.good{background:linear-gradient(180deg,#2d8659,#1d5c3c);border-color:#7ef29b;animation:aqPop .35s}'+
'.aq-choice.bad{background:linear-gradient(180deg,#8a2f2f,#5c1d1d);border-color:#ff8f8f;animation:aqShake .4s}'+
'.aq-choice.dim{opacity:0.45}'+
'.aq-feedback{text-align:center;min-height:28px;color:#ffd700;font-size:clamp(14px,4vw,18px);font-weight:bold}'+
'.aq-result-emoji{font-size:clamp(48px,14vw,72px);text-align:center;animation:aqPop .5s}'+
'.aq-result-score{color:#fff;font-size:clamp(20px,6vw,28px);font-weight:bold;text-align:center}'+
'.aq-result-coins{color:#ffd700;font-size:clamp(16px,5vw,22px);font-weight:bold;text-align:center}'+
'.aq-result-msg{color:#4ecdc4;font-size:clamp(14px,4vw,17px);text-align:center}'+
'.aq-confetti{position:absolute;top:-30px;font-size:24px;pointer-events:none;animation:aqFall 1s linear forwards}'+
'@keyframes aqPop{0%{transform:scale(1)}40%{transform:scale(1.12)}100%{transform:scale(1)}}'+
'@keyframes aqShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}'+
'@keyframes aqFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}'+
'</style>';

var PRAISE=['Outstanding work, Captain!','Brilliant sailing, Captain!','You are a math hero!','Superb navigation, Captain!','The fleet salutes you!'];

function ensureScreens(){
  if(document.getElementById('academy-home'))return;
  var st=document.createElement('div');st.innerHTML=CSS;document.head.appendChild(st);
  var home=document.createElement('div');
  home.className='screen underwater';home.id='academy-home';
  home.innerHTML='<div class="academy-wrap" id="academy-home-inner"></div>';
  var quiz=document.createElement('div');
  quiz.className='screen deepwater';quiz.id='academy-quiz';
  quiz.style.overflow='hidden';
  quiz.innerHTML='<div class="academy-wrap" id="academy-quiz-inner"></div>';
  document.body.appendChild(home);
  document.body.appendChild(quiz);
}

window.showAcademy=function(){
  ensureScreens();
  if(typeof audioStarted!=='undefined'&&!audioStarted){Audio.init()}
  if(!Audio.musicPlaying){Audio.startMusic()}
  Audio.click();
  var hud=document.getElementById('hud');if(hud)hud.classList.add('hidden');
  renderAcademyHome();
  showScreen('academy-home');
};

function renderAcademyHome(){
  var inner=document.getElementById('academy-home-inner');
  var html='<div class="academy-title">⚓ Warship Academy</div>';
  html+='<div class="academy-sub">Captain Alec&#39;s training decks. Finish a deck to earn coins!</div>';
  html+='<div class="academy-cards">';
  DECKS.forEach(function(deck){
    var p=getDeckProgress(deck.id);
    var done=p.done;
    var scoreTxt=done?('&#11088; '+p.best+'/'+p.total):('New!');
    html+='<div class="academy-deck'+(done?' done':'')+'" onclick="startAcademyDeck(\''+deck.id+'\')">';
    html+='<div class="academy-deck-icon">'+deck.icon+'</div>';
    html+='<div><div class="academy-deck-name">'+deck.title+'</div><div class="academy-deck-info">'+deck.subtitle+' &#8226; '+deck.questions.length+' questions</div></div>';
    html+='<div class="academy-deck-score">'+scoreTxt+'</div>';
    html+='</div>';
  });
  html+='</div>';
  html+='<button class="btn btn-blue" onclick="showTitle()" style="margin-top:8px">&#11067; Back</button>';
  inner.innerHTML=html;
  if(window.twemojiParse)twemojiParse();
}

// ---------- quiz run ----------
var RUN=null;
var firstTryOK=true;

window.startAcademyDeck=function(deckId){
  Audio.click();
  var deck=null;
  for(var i=0;i<DECKS.length;i++){if(DECKS[i].id===deckId){deck=DECKS[i];break}}
  if(!deck)return;
  RUN={deck:deck,index:0,firstTryCorrect:0,answeredCorrect:0};
  firstTryOK=true;
  renderQuestion();
  showScreen('academy-quiz');
};

function renderQuestion(){
  var inner=document.getElementById('academy-quiz-inner');
  var deck=RUN.deck;
  var q=deck.questions[RUN.index];
  var total=deck.questions.length;

  var choices=shuffle([q.a].concat(q.d.slice()));
  var wide=choices.length===2?' wide':'';

  var html='<div class="aq-topbar">';
  html+='<button class="aq-back" onclick="academyQuitQuiz()">&#11067;</button>';
  html+='<div class="aq-count">Q '+(RUN.index+1)+' / '+total+'</div>';
  html+='<div class="aq-coins">&#129689; '+(typeof Progress!=='undefined'?Progress.coins:0)+'</div>';
  html+='</div>';

  html+='<div class="aq-dots">';
  for(var i=0;i<total;i++){
    if(i<RUN.index){html+='<span class="aq-dot ok"></span>'}
    else if(i===RUN.index){html+='<span class="aq-dot cur"></span>'}
    else{html+='<span class="aq-dot"></span>'}
  }
  html+='</div>';

  html+='<div class="aq-card"><div class="aq-prompt">'+q.q+'</div></div>';
  html+='<div class="aq-choices'+wide+'">';
  choices.forEach(function(c){
    var safe=c.replace(/"/g,'&quot;');
    html+='<button class="aq-choice" data-v="'+safe+'">'+c+'</button>';
  });
  html+='</div>';
  html+='<div class="aq-feedback" id="aq-feedback"></div>';

  inner.innerHTML=html;

  var buttons=inner.querySelectorAll('.aq-choice');
  buttons.forEach(function(btn){
    btn.addEventListener('click',function(){answerPick(btn,q)});
  });
}

function answerPick(btn,q){
  var val=btn.getAttribute('data-v');
  if(val===q.a){
    btn.classList.add('good');
    btn.classList.remove('bad');
    var others=document.querySelectorAll('.aq-choice');
    others.forEach(function(b){if(b!==btn){b.classList.add('dim')}});
    Audio.correct();
    confettiBurst();
    if(firstTryOK){RUN.firstTryCorrect++}
    RUN.answeredCorrect++;
    var fb=document.getElementById('aq-feedback');
    if(fb){fb.textContent=['Correct!','Great job!','Well done!','Awesome!'][Math.floor(Math.random()*4)]}
    disableChoices();
    setTimeout(function(){
      firstTryOK=true;
      RUN.index++;
      if(RUN.index>=RUN.deck.questions.length){finishDeck()}
      else{renderQuestion()}
    },1100);
  }else{
    btn.classList.add('bad');
    btn.disabled=true;
    firstTryOK=false;
    Audio.wrong();
    var fb=document.getElementById('aq-feedback');
    if(fb){fb.textContent='Try again, Captain!'}
  }
}

function disableChoices(){
  document.querySelectorAll('.aq-choice').forEach(function(b){b.disabled=true});
}

function confettiBurst(){
  var screenEl=document.getElementById('academy-quiz');
  if(!screenEl)return;
  var emo=['🎉','⭐','✨','🎊'];
  for(var i=0;i<10;i++){
    var s=document.createElement('span');
    s.className='aq-confetti';
    s.textContent=emo[Math.floor(Math.random()*emo.length)];
    s.style.left=(Math.random()*95)+'%';
    s.style.animationDelay=(Math.random()*0.25)+'s';
    screenEl.appendChild(s);
    (function(el){setTimeout(function(){el.remove()},1400)})(s);
  }
}

function finishDeck(){
  var deck=RUN.deck;
  var total=deck.questions.length;
  var score=RUN.firstTryCorrect;
  var pct=Math.round(score/total*100);

  var p=loadProgress();
  var prev=p[deck.id]||{best:0,total:total,done:false};
  var firstTime=!prev.done;
  prev.best=Math.max(prev.best,score);
  prev.total=total;
  prev.done=true;
  p[deck.id]=prev;
  saveProgress(p);

  var coinsEarned=score+(firstTime?5:0);
  if(typeof Progress!=='undefined'&&coinsEarned>0){Progress.addCoins(coinsEarned)}

  var bigEmoji=pct>=90?'🏆':(pct>=70?'🎉':'👍');
  var msg=pct>=90?PRAISE[Math.floor(Math.random()*PRAISE.length)]:(pct>=70?'Nice sailing, Captain!':'Good effort! Practice makes perfect!');

  var inner=document.getElementById('academy-quiz-inner');
  var html='<div class="aq-result-emoji">'+bigEmoji+'</div>';
  html+='<div class="aq-result-score">'+deck.icon+' '+deck.title+'</div>';
  html+='<div class="aq-result-score">Score: '+score+' / '+total+' first try</div>';
  html+='<div class="aq-result-coins">+'+coinsEarned+' &#129689;'+(firstTime?' (includes +5 first completion bonus!)':'')+'</div>';
  html+='<div class="aq-result-msg">'+msg+'</div>';
  html+='<button class="btn" onclick="startAcademyDeck(\''+deck.id+'\')" style="margin-top:12px">🔁 Try Again</button>';
  html+='<button class="btn btn-blue" onclick="showAcademy()" style="margin-top:8px">⚓ Back to Academy</button>';
  inner.innerHTML=html;
  Audio.reward();
}

window.academyQuitQuiz=function(){
  Audio.click();
  RUN=null;
  renderAcademyHome();
  showScreen('academy-home');
};

})();
