'use strict';
const slides=[ ...document.querySelectorAll('.slide')],TOTAL=slides.length;let cur=0,step=0,busy=false;
function steps(s){return[...s.querySelectorAll('[data-step]')].filter(e=>e.dataset.step!=='0').sort((a,b)=>+a.dataset.step- +b.dataset.step);}
function updateChrome(){document.getElementById('progressBar').style.width=((cur+1)/TOTAL*100)+'%';document.getElementById('currentNum').textContent=cur+1;document.getElementById('navPrev').classList.toggle('hidden',cur===0);document.getElementById('navNext').classList.toggle('hidden',cur===TOTAL-1);document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===cur));document.getElementById('keyHint').classList.toggle('hidden',cur>0||step>0);}
function reveal(el){el.classList.add('revealed');if(el.classList.contains('bg-img'))el.closest('.slide').querySelectorAll('.photo-dim').forEach(e=>e.classList.add('revealed'));if(el.classList.contains('photo-dim'))el.closest('.slide').querySelectorAll('.bg-img').forEach(e=>e.classList.add('revealed'));}
function unreveal(el){el.classList.remove('revealed');if(el.classList.contains('bg-img'))el.closest('.slide').querySelectorAll('.photo-dim').forEach(e=>e.classList.remove('revealed'));if(el.classList.contains('photo-dim'))el.closest('.slide').querySelectorAll('.bg-img').forEach(e=>e.classList.remove('revealed'));}
function resetSlide(s){steps(s).forEach(e=>e.classList.remove('revealed'));s.querySelectorAll('.bg-img,.photo-dim,.map-container').forEach(e=>e.classList.remove('revealed'));step=0;}
function fillSlide(s){steps(s).forEach(e=>reveal(e));step=steps(s).length;}
function goTo(i,d){if(busy)return;busy=true;document.getElementById('keyHint').classList.add('hidden');const p=slides[cur],n=slides[i];p.classList.add(d==='fwd'?'anim-out-l':'anim-out-r');n.classList.add('active',d==='fwd'?'anim-in-r':'anim-in-l');setTimeout(()=>{p.classList.remove('active','anim-out-l','anim-out-r');n.classList.remove('anim-in-r','anim-in-l');cur=i;busy=false;updateChrome();},520);}
function next(){if(busy)return;const ss=steps(slides[cur]);if(step<ss.length){reveal(ss[step++]);updateChrome();return;}if(cur<TOTAL-1){resetSlide(slides[cur+1]);goTo(cur+1,'fwd');}}
function prev(){if(busy)return;const ss=steps(slides[cur]);if(step>0){unreveal(ss[--step]);updateChrome();return;}if(cur>0){goTo(cur-1,'bwd');setTimeout(()=>{fillSlide(slides[cur]);updateChrome();},530);}}
function jumpTo(i){if(busy||i===cur)return;resetSlide(slides[i]);goTo(i,i>cur?'fwd':'bwd');}
document.addEventListener('keydown',e=>{switch(e.key){case 'ArrowRight':case 'ArrowDown':case ' ':case 'PageDown':e.preventDefault();next();break;case 'ArrowLeft':case 'ArrowUp':case 'PageUp':e.preventDefault();prev();break;case 'Home':e.preventDefault();jumpTo(0);break;case 'End':e.preventDefault();jumpTo(TOTAL-1);break;}});
document.getElementById('navNext').addEventListener('click',next);
document.getElementById('navPrev').addEventListener('click',prev);
const dotsEl=document.getElementById('slideDots');slides.forEach((_,i)=>{const d=document.createElement('button');d.className='dot';d.setAttribute('aria-label',`Slide ${i+1}`);d.addEventListener('click',()=>jumpTo(i));dotsEl.appendChild(d);});
let tx=0,ty=0,tt=0;
document.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;tt=Date.now();},{passive:true});
document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty,dt=Date.now()-tt,d=Math.sqrt(dx*dx+dy*dy);if(d<12&&dt<300){next();return;}if(dt<400&&Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){dx<0?next():prev();}},{passive:true});
slides[0].classList.add('active');updateChrome();