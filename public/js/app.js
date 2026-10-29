/* ============================================================
   ENGINE: renders slides from CONTENT (js/content.js) and handles
   navigation, timers, progress bars, swipe, hold-to-pause.
   Loaded after content.js, so NAME and S are available here.
   ============================================================ */
/* ===== ENGINE (no need to edit) ===== */
// Safe rendering: every content string is escaped. rich() then re-allows only <em>, </em> and <br>.
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const rich=v=>esc(v).replace(/&lt;(\/?em|br)&gt;/g,"<$1>");
// Links: only https:, mailto:, tel: or a path on this site; anything else becomes a dead link.
const safeUrl=u=>/^(https:|mailto:|tel:|\/(?!\/))/.test(u)?u:"#", url=u=>esc(safeUrl(u));
// data-s = stagger step; turned into the --i CSS variable after rendering (no inline style attributes, for the CSP).
const R={
 hero:s=>`<h1 class="big">${s.lines.map((l,i)=>`<span class="ln"><b data-s="${i}">${rich(l)}</b></span>`).join("")}</h1><p class="sub rise" data-s="5">${rich(s.sub)}</p><span class="pill rise" data-s="7">${rich(s.cta)}</span><a class="ghost rise" data-s="8" href="${url(META.cv)}" download="${esc(META.cvFileName)}" target="_blank" rel="noopener">Download CV</a>`,
 words:s=>s.items.map((o,i)=>`<div class="w" data-s="${i}">${rich(o.w)}</div><div class="wt rise" data-s="${i*3+1}">${rich(o.t)}</div>`).join(""),
 stats:s=>`<h2 class="hd rise">${rich(s.h)}</h2><div class="cards">${s.items.map((o,i)=>`<div class="c sc rise" data-s="${i+1}"><div class="num">${esc(o.pre)}<span data-n="${+o.n||0}" data-dec="${+o.dec||0}">0</span>${esc(o.suf)}</div><div class="sl">${rich(o.l)}${o.s?`<i>${rich(o.s)}</i>`:""}</div></div>`).join("")}</div>`,
 timeline:s=>`<h2 class="hd rise">${rich(s.h)}</h2><div class="tl">${s.items.map((o,i)=>`<div class="it rise" data-s="${i*3+2}"><div class="when">${rich(o.when)}</div><div class="nm">${rich(o.name)}</div><div class="tx">${rich(o.text)}</div></div>`).join("")}</div>`,
 cards:s=>`<h2 class="hd rise">${rich(s.h)}</h2><div class="cards">${s.items.map((o,i)=>`<div class="c rise" data-s="${i+1}"><div class="tag">${rich(o.tag)}</div><div class="ct">${rich(o.title)}</div>${o.text?`<div class="cx">${rich(o.text)}</div>`:""}${o.big?`<div class="cb">${rich(o.big)}</div>`:""}</div>`).join("")}</div>`,
 contact:s=>`<h2 class="hd rise">${rich(s.h)}</h2><p class="sub rise" data-s="1">${rich(s.sub)}</p><div>${CONTACTS.map((o,i)=>`<div class="row rise" data-s="${i+2}"><div class="tag">${esc(o.k)}</div><div class="rv"><a href="${url(o.href)}"${o.ext?' target="_blank" rel="noopener"':""}>${esc(o.v)}</a><button class="cp" data-copy="${esc(o.c)}" aria-label="Copy ${esc(o.k)}">Copy</button></div></div>`).join("")}</div><a class="pill cvb rise" data-s="7" href="${url(META.cv)}" download="${esc(META.cvFileName)}" target="_blank" rel="noopener">Download CV</a><p class="note rise" data-s="8">${rich(s.privacyNote)}</p>`
};
// Contact rows, all from META. mailto:/tel: open in place; web links in a new tab. c = what Copy copies.
const CONTACTS=[
 {k:"Email",v:META.email,href:"mailto:"+META.email,c:META.email},
 {k:"Phone",v:META.phoneDisplay,href:"tel:"+META.phone,c:META.phone},
 {k:"WhatsApp",v:META.phoneDisplay,href:"https://wa.me/"+META.whatsapp,c:META.phone,ext:1},
 {k:"LinkedIn",v:META.linkedin.replace(/^https:\/\/(www\.)?|\/$/g,""),href:META.linkedin,c:META.linkedin,ext:1}
];
const $=q=>document.querySelector(q), stage=$("#stage"), reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
// Theme must be t1..t7 and type a known renderer; anything else is a content error (guard.js shows the fallback).
$("#slides").innerHTML=S.map((s,i)=>{
 if(!R[s.type]||!/^t[1-7]$/.test(s.t))throw new Error(`Slide ${i+1}: unknown type or theme`);
 return `<section class="slide ${s.t}" role="group" aria-label="Slide ${i+1} of ${S.length}">${R[s.type](s)}<div class="brand">${esc(NAME)}</div></section>`;
}).join("");
document.querySelectorAll("[data-s]").forEach(e=>e.style.setProperty("--i",e.dataset.s));
const els=[...document.querySelectorAll(".slide")], LAST=S.length-1;
let cur=-1,timer,busy=false;
// URL hash = slide number (#1..#N). Returns a 0-based index, or -1 if missing/invalid.
function fromHash(){const m=/^#([1-9]\d*)$/.exec(location.hash),n=m?+m[1]:0;return n>=1&&n<=S.length?n-1:-1}
const start=fromHash();
// Autoplay runs until the first manual interaction, then stays off for the rest of the visit.
// A deep link (e.g. /#4) means the visitor wants that slide, so no autoplay.
let autoplay=!reduce&&start<0;
// Auto-advance timer for the current slide (only while autoplay is on; the last slide never advances).
// left = ms still to wait on this slide; t0 = when the running timer started.
let left=0,t0=0;
function arm(ms){clearTimeout(timer);timer=null;left=ms;if(autoplay&&cur<LAST&&!holds.size){t0=performance.now();timer=setTimeout(()=>step(1,true),ms)}}
// Pausing: several reasons can overlap ("hold", "space", "hidden", "rotate"); we resume only when all are gone.
// Animations (including the progress bar) freeze with the timer, so bar end and advance stay in sync.
const holds=new Set();
// Only touch running/paused animations: play() on a finished one would replay it from the start.
const freeze=()=>document.getAnimations().forEach(a=>{if(a.playState==="running")a.pause()});
const thaw=()=>document.getAnimations().forEach(a=>{if(a.playState==="paused")a.play()});
function pause(why){
 if(holds.has(why))return;
 if(!holds.size){if(timer){clearTimeout(timer);timer=null;left-=performance.now()-t0}freeze()}
 holds.add(why);
}
function resume(why){
 if(!holds.delete(why)||holds.size)return;
 thaw();arm(left);
}
// Scale the 1080×1920 stage to the window. Show desktop rails when each free side is ≥ 220px in landscape.
const landscape=matchMedia("(orientation: landscape)");
function fit(){
 const k=Math.min(innerWidth/1080,innerHeight/1920),side=(innerWidth-1080*k)/2;
 stage.style.transform=`translate(-50%,-50%) scale(${k})`;
 // Keep the mobile CV icon at least 46 CSS px on small phones (stage px shrink with the scale).
 stage.style.setProperty("--cvi",Math.max(124,46/k)+"px");
 document.body.style.setProperty("--side",side+"px");
 document.body.classList.toggle("rails",landscape.matches&&side>=220);
 rotateHint();
}
// Small touch screen held sideways → overlay with "Continue anyway" (dismissed for the visit).
// Slides pause while it is shown.
const coarse=matchMedia("(pointer: coarse)");let rotateOff=false;
function rotateHint(){
 const on=!rotateOff&&coarse.matches&&landscape.matches&&innerHeight<500,el=$("#rotate");
 if(on===!el.hidden)return;
 el.hidden=!on;stage.inert=on;
 if(on){pause("rotate");$("#rotateGo").focus()}else resume("rotate");
}
$("#rotateGo").onclick=()=>{rotateOff=true;rotateHint()};
// Re-fit on rotation and when iOS toolbars show/hide (visualViewport resize).
addEventListener("resize",fit);addEventListener("orientationchange",fit);window.visualViewport?.addEventListener("resize",fit);fit();
// CV and contact links outside the slides (rails + mobile icon), filled from META.
for(const a of [$("#rCv"),$("#cvIcon")]){a.href=safeUrl(META.cv);a.download=META.cvFileName;a.target="_blank";a.rel="noopener"}
$("#rMail").href=safeUrl("mailto:"+META.email);$("#rLi").href=safeUrl(META.linkedin);
// Copy text to the clipboard, with an old-browser fallback. The button says "Copied" for 2s.
async function copy(text,btn){
 try{await navigator.clipboard.writeText(text)}
 catch{const t=document.createElement("textarea");t.value=text;t.setAttribute("readonly","");t.className="sr";document.body.append(t);t.select();document.execCommand("copy");t.remove()}
 btn.dataset.label??=btn.textContent;btn.textContent="Copied";$("#live").textContent="Copied "+text;
 clearTimeout(btn.t);btn.t=setTimeout(()=>btn.textContent=btn.dataset.label,2000);
}
$("#rMailCopy").onclick=e=>copy(META.email,e.currentTarget);
$("#slides").addEventListener("click",e=>{const b=e.target.closest(".cp");if(b)copy(b.dataset.copy,b)});
$("#rPrev").onclick=()=>step(-1);$("#rNext").onclick=()=>step(1);
// Any click on the rails counts as a manual interaction (stops autoplay).
document.querySelectorAll(".rail").forEach(r=>r.addEventListener("click",manual));
function count(el){el.querySelectorAll("[data-n]").forEach(n=>{const to=+n.dataset.n,dec=+n.dataset.dec;if(reduce){n.textContent=to.toFixed(dec);return}
 const t0=performance.now()+400;(function f(t){const p=Math.min(Math.max((t-t0)/1500,0),1);n.textContent=(to*(1-Math.pow(1-p,3))).toFixed(dec);if(p<1)requestAnimationFrame(f)})(performance.now())})}
// Progress bars: past = filled, current = running (autoplay) or filled + highlighted ("still").
function bars(){
 const b=$("#bars");b.classList.toggle("light",!!S[cur].light);b.classList.toggle("still",!autoplay||cur===LAST);
 b.innerHTML=S.map((s,i)=>`<i class="${i<cur?"done":i===cur?"cur":""}" data-i="${i}"><b></b></i>`).join("");
 b.querySelectorAll("i").forEach((e,i)=>e.style.setProperty("--d",(+S[i].d||8)+"s"));
}
// First manual interaction: stop autoplay for good and freeze the bars.
function manual(){if(!autoplay)return;autoplay=false;clearTimeout(timer);timer=null;bars()}
function show(n){
 cur=n;
 // The visitor's own pauses (hold, Space) end on a new slide; system ones (hidden tab, rotate hint) stay.
 holds.delete("hold");holds.delete("space");
 els.forEach(e=>{e.classList.remove("on");e.inert=true});
 const e=els[n];e.inert=false;void e.offsetWidth;e.classList.add("on");count(e);
 $("#live").textContent=`Slide ${n+1} of ${S.length}`;
 // replaceState (not pushState): Back leaves the site instead of stepping through slides.
 history.replaceState(null,"",location.pathname+location.search+"#"+(n+1));
 stage.classList.toggle("last",n===LAST);stage.classList.toggle("light",!!S[n].light);
 $("#rCount").textContent=`${n+1} / ${S.length}`;$("#rPrev").disabled=n===0;$("#rNext").disabled=n===LAST;
 bars();arm(S[n].d*1000);
 holds.size?freeze():thaw();
}
// go(n): animated move to slide n. auto=true only when the autoplay timer calls it.
// A move requested during the transition is queued, so a quick double tap moves two slides.
let target=-1,queued=-1;
function go(n,auto){
 if(!auto)manual();
 n=Math.max(0,Math.min(LAST,n));
 if(busy){if(n!==target)queued=n;return}
 if(n===cur)return;busy=true;target=n;
 const w=$("#wipe");w.classList.remove("go");void w.offsetWidth;w.classList.add("go");
 setTimeout(()=>{show(n);busy=false;if(queued>=0){const q=queued;queued=-1;go(q,true)}},reduce?0:300);
}
// step(±1): relative move, counted from where we are heading (not where we are) during a transition.
function step(d,auto){go((busy?(queued>=0?queued:target):cur)+d,auto)}
let skip=false;
$("#next").onclick=()=>{if(!skip)step(1)};$("#prev").onclick=()=>{if(!skip)step(-1)};
$("#bars").onclick=e=>{const i=e.target.closest("i");if(i)go(+i.dataset.i)};
// Keyboard. Modifier combos (e.g. Ctrl+→) stay with the browser.
// Space/Enter on a focused link or button keep their native action.
const KEYS={ArrowRight:()=>step(1),PageDown:()=>step(1),ArrowLeft:()=>step(-1),PageUp:()=>step(-1),Home:()=>go(0),End:()=>go(LAST),
 // Space: while autoplay runs it toggles pause (not a "manual" action); otherwise it means next.
 " ":e=>{if(e.repeat)return;if(autoplay)holds.has("space")?resume("space"):pause("space");else step(1)}};
addEventListener("keydown",e=>{
 if(e.ctrlKey||e.metaKey||e.altKey||!KEYS[e.key])return;
 // Links ignore Space natively; CV links are styled as buttons, so make Space open them too.
 if(e.key===" "&&e.target.matches?.("a[download]")){e.preventDefault();e.target.click();return}
 if((e.key===" "||e.key==="Enter")&&e.target.closest?.("a,button,input,textarea,[contenteditable]"))return;
 e.preventDefault();KEYS[e.key](e);
});
// Hash edited by hand (counts as manual). Invalid → put the current slide back in the URL.
addEventListener("hashchange",()=>{const n=fromHash();if(n<0)history.replaceState(null,"",location.pathname+location.search+"#"+(cur+1));else go(n)});
// Background tab: pause; back in view: continue with the time that was left.
document.addEventListener("visibilitychange",()=>document.hidden?pause("hidden"):resume("hidden"));
/* hold to pause + swipe */
let hold,held=false,x0=null,y0=0;
// skip briefly blocks the tap-zone click that follows a hold or swipe.
function skipClick(){skip=true;setTimeout(()=>skip=false,60)}
stage.addEventListener("pointerdown",e=>{
 // Pressing a link or button (other than the tap zones) is never a hold or swipe.
 if(e.target.closest("a,button:not(.nav)")){x0=null;return}
 x0=e.clientX;y0=e.clientY;hold=setTimeout(()=>{held=true;pause("hold")},300)});
// A finger that moves is swiping, not holding.
stage.addEventListener("pointermove",e=>{if(x0!==null&&!held&&Math.hypot(e.clientX-x0,e.clientY-y0)>10)clearTimeout(hold)});
// Release ends a hold; only a plain release (not a hold) can be a swipe.
function release(e,canSwipe){
 clearTimeout(hold);
 if(held){held=false;skipClick();resume("hold")}
 else if(canSwipe&&x0!==null){const dx=e.clientX-x0,dy=e.clientY-y0;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){skipClick();step(dx<0?1:-1)}}
 x0=null;
}
stage.addEventListener("pointerup",e=>release(e,true));
// pointercancel (e.g. iOS system gesture) and lost capture end a hold without navigating.
stage.addEventListener("pointercancel",e=>release(e,false));
stage.addEventListener("lostpointercapture",e=>release(e,false));
show(Math.max(start,0));
window.engineReady=true; // tells guard.js the site started fine
