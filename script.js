const $=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms)),line=$('#line'),ghost=$('#ghost');
let A,drone;const say=(t,big)=>{line.textContent=t;line.className=big?'big':'';};
// ---- Web Audio ----
const noise=(d,f,g=.5,type='lowpass')=>{const b=A.createBuffer(1,A.sampleRate*d,A.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=(Math.random()*2-1)*(1-i/x.length);const s=A.createBufferSource(),fl=A.createBiquadFilter(),gn=A.createGain();s.buffer=b;fl.type=type;fl.frequency.value=f;gn.gain.value=g;s.connect(fl).connect(gn).connect(A.destination);s.start()};
const tone=(f,d,type='sine',g=.2,at=0)=>{const o=A.createOscillator(),gn=A.createGain(),t=A.currentTime+at;o.type=type;o.frequency.value=f;gn.gain.setValueAtTime(g,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(gn).connect(A.destination);o.start(t);o.stop(t+d)};
const thunder=()=>{noise(3,200,.9);setTimeout(()=>noise(2,120,.6),500)};
const whisper=()=>noise(1.5,2500,.15,'bandpass');
const scare=()=>{noise(1.2,6000,.8,'highpass');[880,932,1760].forEach(f=>tone(f,1,'sawtooth',.3))};
const startDrone=()=>{drone=[55,58.3].map(f=>{const o=A.createOscillator(),g=A.createGain();o.type='sawtooth';o.frequency.value=f;g.gain.value=.05;o.connect(g).connect(A.destination);o.start();return o})};
const stopDrone=()=>drone&&drone.forEach(o=>o.stop());
const bday=()=>{const n=[262,262,294,262,349,330,262,262,294,262,392,349,262,262,523,440,349,330,294,466,466,440,349,392,349];n.forEach((f,i)=>{tone(f,.35,'triangle',.25,i*.38);tone(f/2,.35,'sine',.1,i*.38)})};
const pop=()=>{noise(.4,3000,.4);tone(200+Math.random()*400,.3,'square',.08)};
// ---- Particles ----
const cv=$('#fx'),c=cv.getContext('2d');let P=[];const rs=()=>{cv.width=innerWidth;cv.height=innerHeight};rs();onresize=rs;
const emit=(n,o)=>{for(let i=0;i<n;i++)P.push({x:o.x??Math.random()*cv.width,y:o.y??-10,vx:(Math.random()-.5)*(o.sp||2),vy:o.vy??Math.random()*3+1,g:o.g??.03,ch:o.ch?o.ch[Math.floor(Math.random()*o.ch.length)]:null,col:`hsl(${Math.random()*360} 90% 60%)`,s:o.s||14,l:o.l||300})};
const burst=()=>{const x=Math.random()*cv.width,y=cv.height*.1+Math.random()*cv.height*.4;pop();for(let i=0;i<60;i++){const a=Math.random()*6.28,v=Math.random()*5;P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:.06,col:`hsl(${40+Math.random()*30} 100% 65%)`,s:3,l:70})}};
(function loop(){c.clearRect(0,0,cv.width,cv.height);P=P.filter(p=>(p.l--)>0&&p.y<cv.height+20);for(const p of P){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;if(p.ch){c.font=p.s+'px serif';c.fillText(p.ch,p.x,p.y)}else{c.fillStyle=p.col;c.fillRect(p.x,p.y,p.s,p.s*.6)}}requestAnimationFrame(loop)})();
// ---- Story ----
const caps=["Our Queen, always.","The Woman Who Makes Everything Possible.","Every Smile Is Our Sunshine.","Where You Are, Home Is.","Grace in every frame.","Love that fills a room.","A mother's arms, the safest place.","Our Forever Love.","Strength with a gentle heart.","The view is beautiful, but you are better.","Together is our favourite place."];
$('#enter').onclick=async()=>{A=new(window.AudioContext||window.webkitAudioContext)();$('#enter').remove();document.body.classList.add('dark');startDrone();thunder();
 for(const t of["TONIGHT... SOMETHING UNEXPECTED IS ABOUT TO HAPPEN...","Do you hear that...?","Something is watching from the shadows..."]){say(t);whisper();await sleep(3200)}
 thunder();await sleep(1500);ghost.textContent='👻';ghost.className='scare';scare();await sleep(1400);ghost.className='fun';
 say("WAIT!!! DON'T RUN AWAY!",1);await sleep(2600);say("Even ghosts are scared of ONE WOMAN...");await sleep(3000);say("THE QUEEN OF THIS HOUSE!",1);tone(300,.4,'square',.2);await sleep(2800);
 for(const t of["She can control the entire house with just ONE LOOK!","Even Google cannot find an answer when Mummy asks WHERE ARE YOU?","45 YEARS OF EXPERIENCE IN LOVE, CARE AND SCARING EVERYONE!"]){say(t);tone(180,.2,'square',.15);await sleep(3800)}
 say("Boo! ...Mummy is coming. RUN!");ghost.className='run';noise(1,800,.4);await sleep(2200);
 stopDrone();document.body.className='joy';ghost.remove();say("WAIT... THIS WAS NEVER A HORROR STORY!");bday();emit(200,{ch:['🎈','❤️','✨','🎉'],s:26,l:400,vy:1.5,g:0});emit(300,{});for(let i=0;i<8;i++)setTimeout(burst,i*500);
 await sleep(4000);say("IT'S THE BIRTHDAY OF THE MOST SPECIAL PERSON IN OUR WORLD!");await sleep(4500);say("HAPPY 45TH BIRTHDAY, MUMMA! ❤️",1);for(let i=0;i<6;i++)setTimeout(burst,i*400);await sleep(5000);
 $('#stage').remove();$('#gallery').hidden=false;playMusic();
 caps.forEach((t,i)=>{const d=document.createElement('div');d.className='pol';d.style.cssText=`--r:${(Math.random()*8-4).toFixed(1)}deg;--d:${(Math.random()*3).toFixed(1)}s`;d.innerHTML=`<img src="assets/p${i+1}.jpg" alt="${t}"><p>${t}</p>`;d.onclick=()=>slide(i);$('#grid').append(d)});
 setInterval(()=>emit(2,{ch:['❤️','✨'],s:20,l:500,vy:1,g:0}),600);
 slide(0,true)};
let st;const slide=(i,auto)=>{clearTimeout(st);const s=$('#show');s.hidden=false;const b=$('#big');b.style.animation='none';b.offsetWidth;b.style.animation='';b.src=`assets/p${i+1}.jpg`;$('#cap').textContent=caps[i];
 if(auto&&i<caps.length-1)st=setTimeout(()=>slide(i+1,true),3800);else if(auto)st=setTimeout(finale,3800)};
$('#show').onclick=()=>{clearTimeout(st);$('#show').hidden=true};

// ---- Music: put your own file at assets/meri-maa.mp3; otherwise a soft built-in melody plays ----
let mus,sm;
function softMusic(){const ch=[[262,330,392],[220,262,330],[175,220,262],[196,247,294]];let k=0;const go=()=>{const c=ch[k++%4];c.forEach((f,j)=>tone(f,2.8,'sine',.08,j*.4));tone(c[0]/2,2.8,'triangle',.1)};go();sm=setInterval(go,2800)}
function playMusic(){const a=new Audio('assets/meri-maa.mp3');a.volume=.85;a.play().then(()=>mus=a).catch(softMusic)}
function stopMusic(){clearInterval(sm);if(mus){let v=setInterval(()=>{mus.volume=Math.max(0,mus.volume-.05);if(mus.volume<=0){mus.pause();clearInterval(v)}},200)}}
// ---- Grand ending ----
async function finale(){$('#show').hidden=true;$('#fin').hidden=false;$('#gallery').hidden=true;
 const L=["Mumma,","every smile we have began with yours.","Thank you for every meal, every prayer and every night you stayed awake for us.","You are our home, our strength and our whole world.","Happy 45th Birthday. We love you, always. ❤️"],m=$('#msg');
 for(let i=0;i<L.length;i++){const p=document.createElement('p');p.className='ln'+(i==L.length-1?' last':'');p.textContent=L[i];m.append(p);if(i==L.length-1)stopMusic();if(i%2==0)burst();emit(40,{ch:['❤️','✨','🌸'],s:24,l:450,vy:1.2,g:0});await sleep(3400)}
 for(let i=0;i<10;i++)setTimeout(burst,i*450);setInterval(()=>emit(2,{ch:['❤️','✨'],s:22,l:500,vy:1,g:0}),500)}
$('#again').onclick=()=>location.reload();
