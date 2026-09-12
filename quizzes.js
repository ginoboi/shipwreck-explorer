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
function mc3Q(prompt,answer,w1,w2){return{q:prompt,a:answer,d:[w1,w2]}}

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
  ,
  {
    id:'e1', icon:'🔤', title:'The English Alphabet',
    subtitle:'Letters A to Z',
    questions:[
      mc3Q('What comes right after the letter <b>C</b>?','D','B','E'),
      mc3Q('What comes right after the letter <b>G</b>?','H','F','I'),
      mc3Q('What comes right before the letter <b>M</b>?','L','N','K'),
      mc3Q('What comes right before the letter <b>R</b>?','Q','S','P'),
      mc3Q('Which letter comes FIRST in the alphabet?','A','Z','M'),
      mc3Q('Which letter comes LAST in the alphabet?','Z','A','Y'),
      mc3Q('Which letter is missing?<br><span class="aq-word">A B C <span class="aq-blank">?</span> E</span>','D','C','F'),
      mc3Q('Which letter is missing?<br><span class="aq-word">F G <span class="aq-blank">?</span> I J</span>','H','G','I'),
      mc3Q('Which letter is missing?<br><span class="aq-word"><span class="aq-blank">?</span> B C D E</span>','A','F','Z'),
      mc3Q('Which word starts with the letter <b>B</b>?','Boat','Apple','Cat'),
      mc3Q('Which word starts with the letter <b>S</b>?','Ship','Dog','Fish'),
      mc3Q('Which word starts with the letter <b>T</b>?','Treasure','Boat','Wave'),
      mc3Q('Which word starts with the letter <b>A</b>?','Anchor','Boat','Ship'),
      numQ('How many letters are there in the English alphabet?',26)
    ]
  },
  {
    id:'e2', icon:'🔡', title:'Vowels and Consonants',
    subtitle:'a e i o u and the rest',
    questions:[
      mc3Q('Which of these is a <b>vowel</b>?','E','B','T'),
      mc3Q('Which of these is a <b>vowel</b>?','O','M','K'),
      mc3Q('Which of these is a <b>vowel</b>?','U','R','N'),
      mc3Q('Which of these is a <b>vowel</b>?','I','L','D'),
      mc3Q('Which of these is a <b>consonant</b>?','B','A','I'),
      mc3Q('Which of these is a <b>consonant</b>?','S','U','O'),
      mc3Q('Which of these is a <b>consonant</b>?','T','E','A'),
      mc3Q('Which of these is a <b>consonant</b>?','G','O','U'),
      numQ('How many vowels are there in the English alphabet? (a, e, i, o, u)',5),
      mc3Q('Which word starts with a <b>vowel</b> sound?','Ocean','Ship','Boat'),
      mc3Q('Which word starts with a <b>vowel</b> sound?','Anchor','Treasure','Wave'),
      mc3Q('Which word starts with a <b>consonant</b>?','Ship','Ocean','Anchor'),
      mc3Q('Which word starts with a <b>consonant</b>?','Boat','Island','Egg'),
      mc3Q('Which letter is NOT a vowel?','P','A','I')
    ]
  },
  {
    id:'e3', icon:'🔠', title:'Capitalization Rules',
    subtitle:'Big letters vs small letters',
    questions:[
      mc3Q('Which one is a BIG (capital) letter?','A','a','b'),
      mc3Q('Which one is a small (lowercase) letter?','b','B','D'),
      mcQ('Which sentence is written correctly?','The ship sank.','the ship sank.'),
      mcQ('Which sentence is written correctly?','Alec found a treasure.','alec found a treasure.'),
      mcQ('Which sentence is written correctly?','My name is Alec.','my name is alec.'),
      mc3Q('What is the CAPITAL form of the letter <b>m</b>?','M','N','W'),
      mc3Q('What is the CAPITAL form of the letter <b>s</b>?','S','Z','F'),
      mc3Q('What is the small (lowercase) form of the letter <b>T</b>?','t','f','l'),
      mc3Q('What is the small (lowercase) form of the letter <b>K</b>?','k','h','x'),
      mcQ('Every sentence should begin with a ___ letter.','capital','small'),
      mcQ('A person\'s name should always start with a ___ letter.','capital','small'),
      mc3Q('Which one is a capital letter?','Q','q','p')
    ]
  },
  {
    id:'e4', icon:'📚', title:'Alphabetical Order',
    subtitle:'Arrange words A to Z',
    questions:[
      mcQ('Which word comes FIRST in alphabetical order?','Anchor','Boat'),
      mcQ('Which word comes FIRST in alphabetical order?','Ocean','Ship'),
      mcQ('Which word comes FIRST in alphabetical order?','Island','Treasure'),
      mcQ('Which word comes FIRST in alphabetical order?','Boat','Wave'),
      mcQ('Which word comes LAST in alphabetical order?','Ship','Anchor'),
      mcQ('Which word comes LAST in alphabetical order?','Fish','Crab'),
      mcQ('Which word comes FIRST? (look at the 2nd letter)','Ship','Sun'),
      mcQ('Which word comes FIRST? (look at the 2nd letter)','Boat','Bump'),
      mcQ('Which word comes FIRST? (look at the 2nd letter)','Land','Lungs'),
      mcQ('Which word comes FIRST? (look at the letters closely)','Run','Rust'),
      mcQ('Which word comes FIRST alphabetically?','Man','Many'),
      mcQ('Which word comes FIRST alphabetically?','Pal','Pull'),
      mcQ('Which word comes FIRST alphabetically?','Sad','Sip'),
      mcQ('Which word comes FIRST alphabetically?','Full','Happy')
    ]
  },
  {
    id:'e5', icon:'🎵', title:'Count the Syllables',
    subtitle:'Clap out the word parts',
    questions:[
      numQ('How many syllables does the word <b>"ship"</b> have?',1),
      numQ('How many syllables does the word <b>"sun"</b> have?',1),
      numQ('How many syllables does the word <b>"ago"</b> have?',2),
      numQ('How many syllables does the word <b>"many"</b> have?',2),
      numQ('How many syllables does the word <b>"happy"</b> have?',2),
      numQ('How many syllables does the word <b>"notebook"</b> have?',2),
      numQ('How many syllables does the word <b>"pencil"</b> have?',2),
      numQ('How many syllables does the word <b>"teacher"</b> have?',2),
      numQ('How many syllables does the word <b>"anchor"</b> have?',2),
      numQ('How many syllables does the word <b>"ocean"</b> have?',2),
      numQ('How many syllables does the word <b>"island"</b> have?',2),
      numQ('How many syllables does the word <b>"treasure"</b> have?',2),
      numQ('How many syllables does the word <b>"diary"</b> have?',3),
      numQ('How many syllables does the word <b>"eraser"</b> have?',3)
    ]
  },
  {
    id:'e6', icon:'✏️', title:'Spelling List #1',
    subtitle:'Short a and short u sounds',
    questions:[
      mc3Q('Which letter completes the word?<br><span class="aq-word">a n <span class="aq-blank">?</span></span><br>(a small crawling insect)','t','p','d'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">f <span class="aq-blank">?</span> n</span><br>(something enjoyable)','u','a','i'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">s <span class="aq-blank">?</span> n</span><br>(it shines in the sky by day)','u','a','i'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">t <span class="aq-blank">?</span> p</span><br>(to knock lightly)','a','i','o'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">l <span class="aq-blank">?</span> n d</span><br>(solid ground, opposite of sea)','a','e','i'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">m <span class="aq-blank">?</span> n</span><br>(an adult male person)','a','e','o'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">h <span class="aq-blank">?</span> n d</span><br>(the part of your body with fingers)','a','e','o'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">p <span class="aq-blank">?</span> n t s</span><br>(clothing you wear on your legs)','a','e','o'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">r <span class="aq-blank">?</span> n</span><br>(to move fast using your legs)','u','a','i'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">r <span class="aq-blank">?</span> s t</span><br>(orange flaky stuff on old metal)','u','a','e'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">b <span class="aq-blank">?</span> m p</span><br>(a small hit or lump)','u','a','e'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">b <span class="aq-blank">?</span> n c h</span><br>(a group of things together)','u','a','e'),
      mc3Q('Which letter completes the word?<br><span class="aq-word"><span class="aq-blank">?</span> g o</span><br>(a while back in time)','a','e','o'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">s <span class="aq-blank">?</span> c k</span><br>(to drink through a straw)','u','a','i'),
      mc3Q('Which letter completes the word?<br><span class="aq-word">l <span class="aq-blank">?</span> n g s</span><br>(organs in your chest you breathe with)','u','a','o'),
      mc3Q('BONUS: Which letter completes the word?<br><span class="aq-word">n o t e b o <span class="aq-blank">?</span> k</span><br>(something you write in for school)','o','a','e'),
      mc3Q('BONUS: Which letter completes the word?<br><span class="aq-word">p <span class="aq-blank">?</span> n c i l</span><br>(a tool used for writing or drawing)','e','a','i'),
      mc3Q('BONUS: Which letter completes the word?<br><span class="aq-word">e r <span class="aq-blank">?</span> s e r</span><br>(used to remove pencil marks)','a','e','i'),
      mc3Q('BONUS: Which letter completes the word?<br><span class="aq-word">t e <span class="aq-blank">?</span> c h e r</span><br>(a person who teaches at school)','a','e','i'),
      mc3Q('BONUS: Which letter completes the word?<br><span class="aq-word">d i <span class="aq-blank">?</span> r y</span><br>(a book where you write about your day)','a','e','i')
    ]
  },
  {
    id:'e7', icon:'📖', title:'Vocabulary',
    subtitle:'Words and their meanings',
    questions:[
      mc3Q('What does <b>"pal"</b> mean?','a friend','a stranger','an enemy'),
      mc3Q('What does <b>"sip"</b> mean?','drink in small mouthfuls','eat quickly','throw away'),
      mc3Q('What does <b>"fix"</b> mean?','to repair','to break','to hide'),
      mc3Q('What does <b>"train"</b> mean?','a series of railroad cars','a type of boat','a kind of bird'),
      mc3Q('What does <b>"pull"</b> mean?','to hold and move toward yourself','to push away','to throw up'),
      mc3Q('What does <b>"full"</b> mean?','containing as much as possible','completely empty','very small'),
      mc3Q('What does <b>"many"</b> mean?','a large number of things','just one thing','nothing at all'),
      mc3Q('What does <b>"happy"</b> mean?','feeling glad','feeling angry','feeling sleepy'),
      mc3Q('What does <b>"sad"</b> mean?','feeling down or unhappy','feeling excited','feeling proud'),
      mc3Q('Which word means "a friend"?','Pal','Sip','Fix'),
      mc3Q('Which word means "to repair"?','Fix','Pull','Full'),
      mc3Q('Which word means "feeling glad"?','Happy','Sad','Many'),
      mc3Q('Which word means "feeling down or unhappy"?','Sad','Happy','Full'),
      mc3Q('Which word means "to hold and move toward yourself"?','Pull','Train','Sip')
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
'.academy-deck.locked{opacity:.55;border-color:#5a7a8a}'+
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
    var lock=deckLockState(deck);
    var scoreTxt=done?('&#11088; '+p.best+'/'+p.total):(lock.locked?'&#128274; Locked':'New!');
    html+='<div class="academy-deck'+(done?' done':'')+(lock.locked?' locked':'')+'"'+(lock.locked?'':' onclick="startAcademyDeck(\''+deck.id+'\')"')+'>';
    html+='<div class="academy-deck-icon">'+(lock.locked?'&#128274;':deck.icon)+'</div>';
    html+='<div><div class="academy-deck-name">'+deck.title+'</div><div class="academy-deck-info">'+(lock.locked?('Finish '+lock.needTitle+' to unlock'):deck.subtitle+' &#8226; '+deck.questions.length+' questions')+'</div></div>';
    html+='<div class="academy-deck-score">'+scoreTxt+'</div>';
    html+='</div>';
  });
  html+='</div>';
  html+='<div class="aq-feedback" id="academy-lock-hint" style="min-height:20px"></div>';
  html+='<div style="text-align:center;margin-top:10px"><button class="btn btn-blue" onclick="openParentReport()" style="opacity:.7;font-size:14px">📊 Parent Report</button></div>';
  html+='<button class="btn btn-blue" onclick="showTitle()" style="margin-top:8px">&#11067; Back</button>';
  inner.innerHTML=html;
  if(window.twemojiParse)twemojiParse();
}

// ---------- quiz run ----------
var RUN=null;
var firstTryOK=true;

// progressive unlock: English review decks unlock in order, each needs the previous one completed
var ENGLISH_ORDER=['e1','e2','e3','e4','e5','e6','e7'];
function deckLockState(deck){
  var idx=ENGLISH_ORDER.indexOf(deck.id);
  if(idx<=0)return{locked:false,needTitle:''};
  var prev=ENGLISH_ORDER[idx-1];
  var prevDeck=null;
  for(var i=0;i<DECKS.length;i++){if(DECKS[i].id===prev){prevDeck=DECKS[i];break}}
  return{locked:!getDeckProgress(prev).done,needTitle:prevDeck?prevDeck.title:''};
}

window.startAcademyDeck=function(deckId){
  Audio.click();
  var deck=null;
  for(var i=0;i<DECKS.length;i++){if(DECKS[i].id===deckId){deck=DECKS[i];break}}
  if(!deck)return;
  var lock=deckLockState(deck);
  if(lock.locked){
    Audio.wrong();
    var fb=document.getElementById('academy-lock-hint');
    if(fb){fb.textContent='\u{1F512} Finish '+lock.needTitle+' first!';setTimeout(function(){fb.textContent=''},1800)}
    return;
  }
  RUN={deck:deck,index:0,firstTryCorrect:0,answeredCorrect:0,wrongThisQ:[],loggedThisQ:false};
  firstTryOK=true;
  renderQuestion();
  showScreen('academy-quiz');
};

function renderQuestion(){
  var inner=document.getElementById('academy-quiz-inner');
  var deck=RUN.deck;
  var q=deck.questions[RUN.index];
  var total=deck.questions.length;
  RUN.wrongThisQ=[];
  RUN.loggedThisQ=false;

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
    maybeLogQuestion(q);
    setTimeout(function(){
      firstTryOK=true;
      RUN.index++;
      if(RUN.index>=RUN.deck.questions.length){finishDeck()}
      else{renderQuestion()}
    },1100);
  }else{
    btn.classList.add('bad');
    btn.disabled=true;
    if(RUN&&RUN.wrongThisQ){RUN.wrongThisQ.push(val)}
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
  if(RUN&&RUN.deck&&RUN.wrongThisQ&&RUN.wrongThisQ.length&&!RUN.loggedThisQ){
    maybeLogQuestion(RUN.deck.questions[RUN.index],true);
  }
  RUN=null;
  renderAcademyHome();
  showScreen('academy-home');
};


// ============================================================
// PARENT REPORT + MISS LOG
// Tracks every question Alec answers wrong or needs retries on.
// - Local log: always available offline on this device
// - Silent sync: sends events to the parent log endpoint when online
// - Parent Report: passcode-protected screen with CSV export
// ============================================================
var PARENT_PASSCODE='4466';
var LOG_ENDPOINT='https://solene-128e0632.base44.app/functions/warshipLog';
var LOG_TOKEN='WARSHIP-LOG-2026';
var LOG_KEY='se_academy_log_v1';
var OUTBOX_KEY='se_academy_outbox_v1';
var IDS_KEY='se_academy_ids_v1'; // survives progress resets (key -> server record id)

function loadJSON(k,fallback){try{var v=JSON.parse(localStorage.getItem(k)||'');return v||fallback}catch(e){return fallback}}
function saveJSON(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function stripTags(s){return String(s).replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim()}
function qKey(deckId,q){return deckId+'|'+stripTags(q).slice(0,90)}

function maybeLogQuestion(q,quitting){
  if(!RUN||!RUN.deck||RUN.loggedThisQ)return;
  RUN.loggedThisQ=true;
  var wrongs=RUN.wrongThisQ||[];
  if(!wrongs.length)return; // first-try correct: nothing to log
  var ev={
    key:qKey(RUN.deck.id,q.q),
    deck:RUN.deck.id,
    deckTitle:RUN.deck.title,
    deckIcon:RUN.deck.icon,
    question:stripTags(q.q),
    answer:q.a,
    wrongPicks:wrongs.slice(),
    tries:wrongs.length+1,
    answered:!quitting,
    ts:new Date().toISOString()
  };
  var log=loadJSON(LOG_KEY,[]);
  log.push(ev);
  if(log.length>600){log=log.slice(-600)}
  saveJSON(LOG_KEY,log);
  var out=loadJSON(OUTBOX_KEY,[]);
  out.push({key:ev.key,deck:ev.deck,question:ev.question,answer:ev.answer,wrongPicks:ev.wrongPicks,tries:ev.tries,ts:ev.ts});
  if(out.length>300){out=out.slice(-300)}
  saveJSON(OUTBOX_KEY,out);
  flushOutbox();
}

function flushOutbox(){
  try{
    if(!navigator.onLine)return;
    var out=loadJSON(OUTBOX_KEY,[]);
    if(!out.length)return;
    var ids=loadJSON(IDS_KEY,{});
    var batch=out.slice(0,20);
    batch.forEach(function(ev){if(ids[ev.key])ev.id=ids[ev.key]});
    fetch(LOG_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({token:LOG_TOKEN,events:batch})
    }).then(function(r){return r.json()}).then(function(res){
      if(res&&res.ok){
        if(res.ids){for(var k in res.ids){ids[k]=res.ids[k]};saveJSON(IDS_KEY,ids)}
        saveJSON(OUTBOX_KEY,out.slice(batch.length));
      }
    }).catch(function(){/* offline or endpoint down: keep in outbox */});
  }catch(e){}
}
if(window.addEventListener){window.addEventListener('online',function(){setTimeout(flushOutbox,2000)})}

// ---------- Parent Report UI ----------
window.openParentReport=function(){
  Audio.click();
  var modal=document.getElementById('pr-pass-modal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='pr-pass-modal';
    modal.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,20,40,.85);display:flex;align-items:center;justify-content:center';
    modal.innerHTML='<div style="background:#0d2b45;border:2px solid #4ecdc4;border-radius:16px;padding:24px;width:85%;max-width:320px;text-align:center">'
      +'<div style="font-size:28px;margin-bottom:6px">🔒</div>'
      +'<div style="color:#fff;font-weight:bold;margin-bottom:12px">Parent Access</div>'
      +'<input id="pr-pass-input" type="password" inputmode="numeric" maxlength="8" placeholder="Passcode" style="width:100%;padding:12px;border-radius:10px;border:2px solid #4ecdc4;background:rgba(255,255,255,.1);color:#fff;font-size:20px;text-align:center;letter-spacing:4px;margin-bottom:8px"/>'
      +'<div id="pr-pass-error" style="color:#ff6b6b;font-size:13px;min-height:18px;margin-bottom:8px"></div>'
      +'<button class="btn" onclick="prCheckPass()" style="width:100%">Enter</button>'
      +'<button class="btn btn-blue" onclick="prClosePass()" style="width:100%;margin-top:8px;margin-left:0">Cancel</button>'
      +'</div>';
    document.body.appendChild(modal);
    modal.addEventListener('keydown',function(e){if(e.key==='Enter'){prCheckPass()}});
  }
  modal.style.display='flex';
  document.getElementById('pr-pass-error').textContent='';
  var inp=document.getElementById('pr-pass-input');
  inp.value='';
  setTimeout(function(){inp.focus()},100);
};
window.prCheckPass=function(){
  var inp=document.getElementById('pr-pass-input');
  if(inp.value===PARENT_PASSCODE){
    Audio.correct();
    window.prClosePass();
    window.renderParentReport();
  }else{
    Audio.wrong();
    document.getElementById('pr-pass-error').textContent='Wrong passcode.';
    inp.value='';
    inp.focus();
  }
};
window.prClosePass=function(){
  var m=document.getElementById('pr-pass-modal');
  if(m)m.style.display='none';
};

function prAgg(){
  var log=loadJSON(LOG_KEY,[]);
  var map={};
  log.forEach(function(ev){
    var a=map[ev.key];
    if(!a){a=map[ev.key]={key:ev.key,deck:ev.deck,deckTitle:ev.deckTitle||'',deckIcon:ev.deckIcon||'',question:ev.question,answer:ev.answer,wrongPicks:{},wrongCount:0,times:0,lastTs:''}}
    ev.wrongPicks.forEach(function(w){a.wrongPicks[w]=(a.wrongPicks[w]||0)+1});
    a.wrongCount+=ev.wrongPicks.length;
    a.times++;
    if(ev.ts>a.lastTs)a.lastTs=ev.ts;
  });
  var arr=[];
  for(var k in map){arr.push(map[k])}
  arr.sort(function(x,y){return y.wrongCount-x.wrongCount|| (x.lastTs<y.lastTs?1:-1)});
  return {list:arr,raw:log};
}

function prFmtDate(iso){
  try{
    var d=new Date(iso);
    return d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  }catch(e){return iso}
}

window.renderParentReport=function(){
  ensureScreens();
  var agg=prAgg();
  var list=agg.list;
  var html='<div class="academy-title" style="font-size:clamp(20px,6vw,30px)">📊 Parent Report</div>';
  html+='<div class="academy-sub" style="margin-bottom:10px">Questions Alec answered wrong or needed retries on.</div>';
  if(!list.length){
    html+='<div class="aq-card" style="margin:20px 0;text-align:center">No wrong answers logged yet. Great sailing! 🎉</div>';
  }else{
    var outN=loadJSON(OUTBOX_KEY,[]).length;
    html+='<div style="text-align:center;color:#a8dadc;font-size:12px;margin-bottom:10px">'+list.length+' question(s) &#8226; '+agg.raw.length+' logged event(s)'+(outN?' &#8226; '+outN+' waiting to sync':'')+'</div>';
    list.forEach(function(a){
      var picks=[];
      for(var w in a.wrongPicks){picks.push('"'+w+'" x'+a.wrongPicks[w])}
      html+='<div class="aq-card" style="margin-bottom:8px;padding:10px 14px;text-align:left">'
        +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'
        +'<span style="font-size:14px;color:#ffd166">'+a.deckIcon+' '+a.deckTitle+'</span>'
        +'<span style="color:#ff6b6b;font-weight:bold">❌ '+a.wrongCount+'</span></div>'
        +'<div style="color:#fff;font-size:14px;line-height:1.35;margin-bottom:4px">'+a.question.slice(0,140)+'</div>'
        +'<div style="color:#a8dadc;font-size:12px">Correct: <b style="color:#4ecdc4">'+a.answer+'</b> &#8226; picked wrong: '+(picks.join(', ')||'-')+' &#8226; seen '+a.times+'x &#8226; last: '+prFmtDate(a.lastTs)+'</div>'
        +'</div>';
    });
  }
  html+='<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px">';
  if(list.length){
    html+='<button class="btn" onclick="prExportCSV()">&#11015;&#65039; Export CSV</button>';
    html+='<button class="btn btn-blue" onclick="prCopyReport()">&#128203; Copy</button>';
    html+='<button class="btn btn-blue" onclick="prClearLog()">&#128465;&#65039; Clear Log</button>';
  }
  html+='<button class="btn btn-blue" onclick="showAcademy()">&#11067; Back</button>';
  html+='</div>';
  var rep=document.getElementById('academy-report');
  if(!rep){
    rep=document.createElement('div');
    rep.className='screen deepwater';
    rep.id='academy-report';
    rep.innerHTML='<div class="academy-wrap" id="academy-report-inner" style="overflow-y:auto;max-height:100vh;padding-bottom:40px"></div>';
    document.body.appendChild(rep);
  }
  document.getElementById('academy-report-inner').innerHTML=html;
  showScreen('academy-report');
};

window.prExportCSV=function(){
  var log=loadJSON(LOG_KEY,[]);
  if(!log.length)return;
  function esc(s){return '"'+String(s).replace(/"/g,'""')+'"'}
  var lines=['Date,Deck,Question,Correct Answer,Wrong Picks,Tries,Answered'];
  log.forEach(function(ev){
    lines.push([prFmtDate(ev.ts),esc(ev.deckTitle||ev.deck),esc(ev.question),esc(ev.answer),esc(ev.wrongPicks.join(' | ')),ev.tries,ev.answered?'yes':'quit'].join(','));
  });
  var csv=lines.join('\n');
  try{
    var blob=new Blob([csv],{type:'text/csv'});
    var a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    var d=new Date();
    var pad=function(n){return (n<10?'0':'')+n};
    a.download='warship-academy-log-'+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);
  }catch(e){
    prompt('Copy your CSV:',csv);
  }
  Audio.correct();
};

window.prCopyReport=function(){
  var agg=prAgg();
  var txt='WARSHIP ACADEMY - PARENT REPORT\nGenerated: '+prFmtDate(new Date().toISOString())+'\n\n';
  agg.list.forEach(function(a,i){
    var pk=[];for(var w in a.wrongPicks){pk.push(w+' x'+a.wrongPicks[w])}
    txt+=(i+1)+'. ['+a.deckIcon+' '+a.deckTitle+'] '+a.question+'\n   Correct: '+a.answer+' | wrong picks: '+(pk.join(', ')||'-')+' | wrong x'+a.wrongCount+' | last seen: '+prFmtDate(a.lastTs)+'\n';
  });
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(function(){Audio.correct()}).catch(function(){prompt('Copy report:',txt)});
  }else{
    prompt('Copy report:',txt);
  }
};

window.prClearLog=function(){
  if(confirm('Clear the miss log? This deletes the local history on this device.')){
    localStorage.removeItem(LOG_KEY);
    localStorage.removeItem(OUTBOX_KEY);
    window.renderParentReport();
  }
};

// flush any pending events when the academy opens
var _origShowAcademy=window.showAcademy;
window.showAcademy=function(){_origShowAcademy();setTimeout(flushOutbox,500)};

})();
