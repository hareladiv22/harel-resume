/* ============================================================
   ENGINE: renders slides from CONTENT (js/content.js) and handles
   navigation, timers, progress bars, swipe, hold-to-pause.
   Loaded after content.js, so NAME and S are available here.
   ============================================================ */
/* ===== ENGINE (no need to edit) ===== */
const R={
 hero:s=>`<h1 class="big">${s.lines.map((l,i)=>`<span class="ln"><b style="--i:${i}">${l}</b></span>`).join("")}</h1><p class="sub rise" style="--i:5">${s.sub}</p><span class="pill rise" style="--i:7">${s.cta}</span>`,
 words:s=>s.items.map((o,i)=>`<div class="w" style="--i:${i}">${o.w}</div><div class="wt rise" style="--i:${i*3+1}">${o.t}</div>`).join(""),
 stats:s=>`<h2 class="hd rise">${s.h}</h2><div class="cards">${s.items.map((o,i)=>`<div class="c sc rise" style="--i:${i+1}"><div class="num">${o.pre}<span data-n="${o.n}" data-dec="${o.dec}">0</span>${o.suf}</div><div class="sl">${o.l}${o.s?`<i>${o.s}</i>`:""}</div></div>`).join("")}</div>`,
 timeline:s=>`<h2 class="hd rise">${s.h}</h2><div class="tl">${s.items.map((o,i)=>`<div class="it rise" style="--i:${i*3+2}"><div class="when">${o.when}</div><div class="nm">${o.name}</div><div class="tx">${o.text}</div></div>`).join("")}</div>`,
 cards:s=>`<h2 class="hd rise">${s.h}</h2><div class="cards">${s.items.map((o,i)=>`<div class="c rise" style="--i:${i+1}"><div class="tag">${o.tag}</div><div class="ct">${o.title}</div>${o.text?`<div class="cx">${o.text}</div>`:""}${o.big?`<div class="cb">${o.big}</div>`:""}</div>`).join("")}</div>`,
 contact:s=>`<h2 class="hd rise">${s.h}</h2><p class="sub rise" style="--i:1">${s.sub}</p><div>${s.items.map((o,i)=>`<div class="row rise" style="--i:${i+2}"><div class="tag">${o.k}</div><a href="${o.href}" target="_blank" rel="noopener">${o.v}</a></div>`).join("")}</div>`
};
const $=q=>document.querySelector(q), stage=$("#stage"), reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
$("#slides").innerHTML=S.map((s,i)=>`<section class="slide ${s.t}" role="group" aria-label="Slide ${i+1} of ${S.length}">${R[s.type](s)}<div class="brand">${NAME}</div></section>`).join("");
const els=[...document.querySelectorAll(".slide")], LAST=S.length-1;
let cur=-1,timer,busy=false;
// Autoplay runs until the first manual interaction, then stays off for the rest of the visit.
let autoplay=!reduce;
function fit(){stage.style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/1080,innerHeight/1920)})`}
addEventListener("resize",fit);fit();
function count(el){el.querySelectorAll("[data-n]").forEach(n=>{const to=+n.dataset.n,dec=+n.dataset.dec;if(reduce){n.textContent=to.toFixed(dec);return}
 const t0=performance.now()+400;(function f(t){const p=Math.min(Math.max((t-t0)/1500,0),1);n.textContent=(to*(1-Math.pow(1-p,3))).toFixed(dec);if(p<1)requestAnimationFrame(f)})(performance.now())})}
// Progress bars: past = filled, current = running (autoplay) or filled + highlighted ("still").
function bars(){
 const b=$("#bars");b.classList.toggle("light",!!S[cur].light);b.classList.toggle("still",!autoplay||cur===LAST);
 b.innerHTML=S.map((s,i)=>`<i class="${i<cur?"done":i===cur?"cur":""}" style="--d:${s.d}s" data-i="${i}"><b></b></i>`).join("");
}
// Auto-advance timer for the current slide (only while autoplay is on; the last slide never advances).
function arm(){clearTimeout(timer);if(autoplay&&cur<LAST)timer=setTimeout(()=>go(cur+1,true),S[cur].d*1000)}
// First manual interaction: stop autoplay for good and freeze the bars.
function manual(){if(!autoplay)return;autoplay=false;clearTimeout(timer);bars()}
function show(n){
 cur=n;
 els.forEach(e=>{e.classList.remove("on");e.inert=true});
 const e=els[n];e.inert=false;void e.offsetWidth;e.classList.add("on");count(e);
 $("#live").textContent=`Slide ${n+1} of ${S.length}`;
 stage.classList.toggle("last",n===LAST);
 bars();arm();
}
// go(n): animated move to slide n. auto=true only when the autoplay timer calls it.
function go(n,auto){
 if(!auto)manual();
 n=Math.max(0,Math.min(LAST,n));if(n===cur||busy)return;busy=true;
 const w=$("#wipe");w.classList.remove("go");void w.offsetWidth;w.classList.add("go");
 setTimeout(()=>{show(n);busy=false},reduce?0:300);
}
let skip=false;
$("#next").onclick=()=>{if(!skip)go(cur+1)};$("#prev").onclick=()=>{if(!skip)go(cur-1)};
$("#bars").onclick=e=>{const i=e.target.closest("i");if(i)go(+i.dataset.i)};
addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key===" ")go(cur+1);if(e.key==="ArrowLeft")go(cur-1)});
/* hold to pause + swipe */
let hold,paused=false,x0=null,y0=0;
stage.addEventListener("pointerdown",e=>{x0=e.clientX;y0=e.clientY;hold=setTimeout(()=>{paused=true;clearTimeout(timer);document.getAnimations().forEach(a=>a.pause())},300)});
stage.addEventListener("pointerup",e=>{
 clearTimeout(hold);
 if(paused){paused=false;skip=true;setTimeout(()=>skip=false,60);document.getAnimations().forEach(a=>a.play());
  if(autoplay&&cur<LAST)timer=setTimeout(()=>go(cur+1,true),3000)}
 else if(x0!==null){const dx=e.clientX-x0,dy=e.clientY-y0;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){skip=true;setTimeout(()=>skip=false,60);go(cur+(dx<0?1:-1))}}
 x0=null});
show(0);
