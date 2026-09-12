import React, { useEffect, useRef } from 'react';

interface KeraleeyaPanchakarmaPlayerProps {
  lectureNumber?: 1 | 2;
  lessonTitle?: string;
  courseTitle?: string;
  moduleTitle?: string;
  onComplete?: () => void;
}

export const KeraleeyaPanchakarmaPlayer: React.FC<KeraleeyaPanchakarmaPlayerProps> = ({
  lectureNumber = 1,
  lessonTitle,
  courseTitle = "Masterclass in Classical Keraleeya Panchakarma Protocols",
  moduleTitle = "MODULE 1 · FOUNDATION",
  onComplete
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'LECTURE_COMPLETED') {
        if (onComplete) {
          onComplete();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  // LECTURE 1 HTML APP
  const getLecture1HTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${lessonTitle || "Orientation and Learning Outcomes"} — ${courseTitle}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap');

:root{
  --bg:#0A2118;
  --panel:#0F281F;
  --panel-2:#132E23;
  --gold:#C89B3C;
  --gold-soft:#E6CB86;
  --ochre:#B5502F;
  --cream:#F5EFDF;
  --muted:#8FAE9C;
  --line:rgba(230,203,134,0.20);
  --sky1:#0d3a2c;
  --sky2:#0a2419;
}

*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{
  background:
    radial-gradient(ellipse at 15% -10%, rgba(230,203,134,0.07), transparent 45%),
    radial-gradient(ellipse at 85% 110%, rgba(181,80,47,0.09), transparent 45%),
    var(--bg);
  color:var(--cream);
  font-family:'Manrope',sans-serif;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:12px;
}

.frame{
  width:100%;
  max-width:1080px;
  border:1px solid var(--line);
  border-radius:6px;
  background:var(--panel);
  position:relative;
  overflow:hidden;
  box-shadow:0 30px 80px -30px rgba(0,0,0,0.6);
}
.frame:fullscreen{max-width:none; width:100vw; height:100vh; display:flex; flex-direction:column;}
.frame:fullscreen .stage-wrap{flex:1; min-height:0;}
.frame:fullscreen .visual-panel svg, .frame:fullscreen .visual-panel .fg-icon{max-height:none;}

.mural-border{
  height:9px; width:100%;
  background:repeating-linear-gradient(90deg,
    var(--gold) 0px, var(--gold) 3px, transparent 3px, transparent 8px,
    var(--ochre) 8px, var(--ochre) 11px, transparent 11px, transparent 16px);
  opacity:0.5; flex-shrink:0;
}

.cover{
  position:absolute; inset:0; z-index:30;
  display:flex; align-items:center; justify-content:center;
  background:
    radial-gradient(circle at 50% 38%, rgba(200,155,60,0.10), transparent 55%),
    linear-gradient(180deg, var(--sky1), var(--sky2));
  transition:opacity .5s ease, visibility .5s ease;
}
.cover.hidden{opacity:0; visibility:hidden; pointer-events:none;}
.cover-inner{text-align:center; padding:20px; max-width:520px;}
.cover-kicker{font-size:12px; letter-spacing:0.04em; color:var(--gold-soft); font-weight:600; margin-bottom:14px;}
.cover-inner h1{font-family:'Fraunces',serif; font-size:clamp(26px,4vw,38px); font-weight:600; margin:0 0 10px; line-height:1.18;}
.cover-inner p{color:var(--muted); font-size:14.5px; margin:0 0 28px;}
#beginBtn{
  font-family:'Manrope',sans-serif; font-weight:700; font-size:14.5px;
  background:var(--ochre); border:1px solid var(--ochre); color:var(--cream);
  padding:13px 30px; border-radius:2px; cursor:pointer; letter-spacing:0.01em;
  transition:background .15s ease, transform .15s ease;
}
#beginBtn:hover{background:#c65a37; transform:translateY(-1px);}
.cover-meta{margin-top:16px; font-size:11.5px; color:var(--muted); letter-spacing:0.02em;}

.head{
  padding:22px 32px 12px;
  display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;
  border-bottom:1px solid var(--line); flex-shrink:0;
}
.kicker{font-size:12px; letter-spacing:0.03em; color:var(--gold-soft); font-weight:600;}
.course-name{font-family:'Fraunces',serif; font-size:14.5px; color:var(--muted); font-weight:500;}

.scrub-wrap{padding:12px 32px 0; flex-shrink:0;}
.scrub-track{position:relative; height:20px; display:flex; align-items:center;}
.scrub-line{position:absolute; left:0; right:0; top:50%; height:2px; background:rgba(255,255,255,0.08); transform:translateY(-50%); border-radius:2px; overflow:hidden;}
.scrub-fill{height:100%; width:0%; background:linear-gradient(90deg,var(--ochre),var(--gold)); transition:width .4s ease;}
.scrub-dots{position:relative; display:flex; justify-content:space-between; width:100%; z-index:2;}
.scrub-dot{
  width:9px; height:9px; border-radius:50%; background:var(--panel);
  border:1.5px solid var(--muted); cursor:pointer; transition:border-color .15s ease, background .15s ease, transform .15s ease;
  flex-shrink:0;
}
.scrub-dot:hover{transform:scale(1.25);}
.scrub-dot.done{background:var(--gold); border-color:var(--gold);}
.scrub-dot.active{background:var(--ochre); border-color:var(--gold-soft); transform:scale(1.35);}

.stage-wrap{
  display:grid; grid-template-columns:1.05fr 1fr; gap:0; min-height:380px;
  transition:opacity .26s ease, transform .26s ease;
}
.stage-wrap.fading{opacity:0; transform:translateY(6px);}
@media (max-width:760px){.stage-wrap{grid-template-columns:1fr;}}

.visual-panel{
  position:relative; overflow:hidden;
  background:linear-gradient(180deg, rgba(0,0,0,0.10), transparent 30%), var(--panel-2);
  border-right:1px solid var(--line);
  min-height:280px; display:flex; align-items:center; justify-content:center;
}
@media (max-width:760px){.visual-panel{border-right:none; border-bottom:1px solid var(--line);}}
.bg-scene{position:absolute; inset:0; width:100%; height:100%; opacity:0.55;}
.fg-icon{position:relative; width:100%; padding:24px; z-index:2;}
.fg-icon svg{width:100%; height:auto; max-height:300px; display:block; margin:0 auto;}

.text-panel{padding:24px 28px 18px; display:flex; flex-direction:column;}
.slide-eyebrow{font-size:11px; letter-spacing:0.04em; color:var(--muted); font-weight:600; margin-bottom:8px;}
.slide-title{font-family:'Fraunces',serif; font-size:24px; font-weight:600; line-height:1.16; color:var(--cream); margin:0 0 12px;}
.narration{font-size:14.5px; line-height:1.68; color:#D9D2BF; margin:0; flex:1; overflow-y:auto; max-height:220px; padding-right:6px;}
.narration::-webkit-scrollbar{width:5px;}
.narration::-webkit-scrollbar-thumb{background:var(--line); border-radius:3px;}
.narration .w{transition:color .15s ease, opacity .15s ease;}
.narration .w.active{color:var(--gold-soft); font-weight:600;}
.narration .w.said{opacity:0.82;}

.controls{
  border-top:1px solid var(--line); padding:12px 28px; flex-shrink:0;
  display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:space-between;
}
.control-left, .control-right{display:flex; align-items:center; gap:8px; flex-wrap:wrap;}
button, select{
  font-family:'Manrope',sans-serif; font-weight:600; font-size:13px;
  border:1px solid var(--line); background:transparent; color:var(--cream);
  padding:8px 14px; border-radius:2px; cursor:pointer; transition:background .15s ease, border-color .15s ease;
}
select{padding:7px 10px; font-weight:500;}
select option{background:var(--panel); color:var(--cream);}
button:hover, select:hover{border-color:var(--gold-soft); background:rgba(230,203,134,0.06);}
button:disabled{opacity:0.35; cursor:default;}
button:focus-visible, select:focus-visible{outline:2px solid var(--gold-soft); outline-offset:2px;}
.play-btn{background:var(--ochre); border-color:var(--ochre); min-width:92px;}
.play-btn:hover{background:#c65a37; border-color:#c65a37;}
.icon-btn{padding:8px 11px;}
.counter{font-size:12px; color:var(--muted); min-width:48px; text-align:center;}

.foot-note{padding:0 28px 14px; font-size:11px; color:var(--muted); line-height:1.5; flex-shrink:0;}

@keyframes drawPath{from{stroke-dashoffset:1;}to{stroke-dashoffset:0;}}
@keyframes fadeUp{from{opacity:0; transform:translateY(10px);}to{opacity:1; transform:translateY(0);}}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
@keyframes flicker{0%,100%{opacity:1; transform:scaleY(1);}50%{opacity:0.72; transform:scaleY(0.88);}}
@keyframes pulseRing{0%{transform:scale(0.85); opacity:0.9;}75%{transform:scale(1.5); opacity:0;}100%{opacity:0;}}
@keyframes popIn{from{opacity:0; transform:scale(0.55);}to{opacity:1; transform:scale(1);}}
@keyframes driftDrop{0%{transform:translateY(-4px); opacity:0;}15%{opacity:1;}100%{transform:translateY(10px); opacity:0.15;}}
@keyframes waveDrift{from{transform:translateX(0);}to{transform:translateX(-200px);}}
@keyframes sway{0%,100%{transform:rotate(-2deg);}50%{transform:rotate(2deg);}}
@keyframes glowPulse{0%,100%{opacity:0.35;}50%{opacity:0.6;}}

.draw{stroke-dasharray:1; stroke-dashoffset:1; animation:drawPath 1.1s ease forwards;}
.fade-up{opacity:0; animation:fadeUp 0.7s ease forwards;}
.float{animation:floatY 3.2s ease-in-out infinite;}
.flicker{animation:flicker 1.6s ease-in-out infinite; transform-origin:bottom center;}
.pulse-ring{animation:pulseRing 2.4s ease-out infinite;}
.pop-in{opacity:0; animation:popIn 0.55s cubic-bezier(.2,.8,.3,1.2) forwards;}
.drift{animation:driftDrop 2.4s ease-in infinite;}
.wave-grp{animation:waveDrift 9s linear infinite;}
.palm-sway{animation:sway 5.5s ease-in-out infinite; transform-origin:bottom center;}
.glow{animation:glowPulse 4s ease-in-out infinite;}

@media (prefers-reduced-motion:reduce){
  .draw,.fade-up,.float,.flicker,.pulse-ring,.pop-in,.drift,.wave-grp,.palm-sway,.glow{animation:none !important; opacity:1 !important; stroke-dashoffset:0 !important;}
}
</style>
</head>
<body>

<div class="frame" id="frame">
  <div class="mural-border"></div>

  <div class="cover" id="cover">
    <div class="cover-inner">
      <div class="cover-kicker">${moduleTitle} · LECTURE 1</div>
      <h1>${lessonTitle || "Orientation and Learning Outcomes"}</h1>
      <p>${courseTitle}</p>
      <button id="beginBtn">▶ Begin Lecture</button>
      <div class="cover-meta">10 scenes · narrated · ~12 min</div>
    </div>
  </div>

  <div class="head">
    <div class="kicker" id="moduleLabel">${moduleTitle}</div>
    <div class="course-name">${courseTitle}</div>
  </div>

  <div class="scrub-wrap">
    <div class="scrub-track">
      <div class="scrub-line"><div class="scrub-fill" id="scrubFill"></div></div>
      <div class="scrub-dots" id="scrubDots"></div>
    </div>
  </div>

  <div class="stage-wrap" id="stageWrap">
    <div class="visual-panel" id="visualPanel">
      <svg class="bg-scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0F3327"/>
            <stop offset="100%" stop-color="#0A2419"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="400" height="300" fill="url(#skyGrad)"/>
        <circle class="glow" cx="200" cy="90" r="120" fill="var(--gold)" opacity="0.06"/>
        <g class="palm-sway" transform="translate(38,205)">
          <path d="M0,0 C-2,-30 4,-55 2,-78" stroke="#0d2c20" stroke-width="4" fill="none"/>
          <path d="M2,-78 C-16,-86 -30,-80 -38,-70" stroke="#0d2c20" stroke-width="3" fill="none"/>
          <path d="M2,-78 C18,-88 30,-82 40,-72" stroke="#0d2c20" stroke-width="3" fill="none"/>
          <path d="M2,-78 C-8,-96 -6,-108 -14,-116" stroke="#0d2c20" stroke-width="3" fill="none"/>
          <path d="M2,-78 C12,-98 10,-110 18,-118" stroke="#0d2c20" stroke-width="3" fill="none"/>
        </g>
        <g class="palm-sway" style="animation-delay:-2s" transform="translate(368,215) scale(-1,1)">
          <path d="M0,0 C-2,-26 4,-48 2,-68" stroke="#0d2c20" stroke-width="3.5" fill="none"/>
          <path d="M2,-68 C-14,-75 -26,-70 -33,-61" stroke="#0d2c20" stroke-width="2.5" fill="none"/>
          <path d="M2,-68 C15,-77 26,-72 34,-63" stroke="#0d2c20" stroke-width="2.5" fill="none"/>
          <path d="M2,-68 C-6,-84 -4,-94 -12,-101" stroke="#0d2c20" stroke-width="2.5" fill="none"/>
        </g>
        <g transform="translate(0,236)">
          <g class="wave-grp">
            <path d="M0,10 Q25,0 50,10 T100,10 T150,10 T200,10 T250,10 T300,10 T350,10 T400,10 T450,10 T500,10 T550,10 T600,10"
              stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.18"/>
          </g>
          <g class="wave-grp" style="animation-delay:-4s">
            <path d="M0,22 Q25,14 50,22 T100,22 T150,22 T200,22 T250,22 T300,22 T350,22 T400,22 T450,22 T500,22 T550,22 T600,22"
              stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.1"/>
          </g>
          <rect x="0" y="30" width="400" height="34" fill="#0c2a20"/>
        </g>
      </svg>
      <div class="fg-icon" id="fgIcon"></div>
    </div>
    <div class="text-panel">
      <div class="slide-eyebrow" id="slideEyebrow"></div>
      <h1 class="slide-title" id="slideTitle"></h1>
      <p class="narration" id="caption"></p>
    </div>
  </div>

  <div class="controls">
    <div class="control-left">
      <button class="play-btn" id="playBtn">▶ Play</button>
      <button class="icon-btn" id="prevBtn" title="Previous">◂</button>
      <button class="icon-btn" id="nextBtn" title="Next">▸</button>
      <button class="icon-btn" id="restartBtn" title="Restart">↺</button>
      <span class="counter" id="counter">1 / 10</span>
    </div>
    <div class="control-right">
      <select id="speedSelect" title="Narration speed">
        <option value="0.85">0.85×</option>
        <option value="1" selected>1×</option>
        <option value="1.15">1.15×</option>
        <option value="1.3">1.3×</option>
      </select>
      <select id="voiceSelect" title="Narration voice"><option>Loading voices…</option></select>
      <button class="icon-btn" id="fullscreenBtn" title="Fullscreen">⛶</button>
    </div>
  </div>
  <div class="foot-note">Narrated with your browser's built-in speech voice — Chrome or Edge with sound on gives the fullest experience. Space = play/pause · ← → = navigate · F = fullscreen.</div>
</div>

<script>
const svgOpen = (extra) => \`<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" \${extra||''}>\`;

function lotusMandala(cx, cy, r, delayBase){
  let petals = '';
  for(let i=0;i<8;i++){
    const angle = (i * 45) * Math.PI/180;
    const x1 = cx + Math.cos(angle)*r*0.25, y1 = cy + Math.sin(angle)*r*0.25;
    const x2 = cx + Math.cos(angle)*r, y2 = cy + Math.sin(angle)*r;
    petals += \`<ellipse cx="\${(x1+x2)/2}" cy="\${(y1+y2)/2}" rx="\${r*0.16}" ry="\${r*0.42}"
      transform="rotate(\${i*45} \${(x1+x2)/2} \${(y1+y2)/2})"
      stroke="var(--gold)" stroke-width="1.4" class="pop-in" style="animation-delay:\${delayBase + i*0.07}s"/>\`;
  }
  return \`<g>\${petals}
    <circle cx="\${cx}" cy="\${cy}" r="\${r*0.22}" stroke="var(--gold-soft)" stroke-width="1.6" pathLength="1" class="draw" style="animation-delay:\${delayBase}s"/>
    <circle cx="\${cx}" cy="\${cy}" r="\${r*0.1}" fill="var(--ochre)" class="pop-in" style="animation-delay:\${delayBase+0.5}s"/>
  </g>\`;
}
function flame(cx, cy, scale, delay){
  return \`<g transform="translate(\${cx} \${cy}) scale(\${scale})" class="flicker" style="animation-delay:\${delay||0}s">
    <path d="M0,-26 C10,-14 12,-2 4,6 C10,4 15,-4 12,-12 C18,-4 16,10 6,16 C-6,22 -16,10 -12,-2 C-14,6 -8,-10 0,-26 Z" fill="var(--gold)"/>
    <path d="M0,10 C-4,4 4,4 0,10Z" fill="var(--ochre)"/>
  </g>\`;
}

const v1 = svgOpen() + \`\${lotusMandala(200,150,88,0.1)} \${flame(200,150,0.9,1.0)}
  <text x="200" y="270" text-anchor="middle" fill="var(--muted)" font-size="12" font-family="Manrope" class="fade-up" style="animation-delay:1.6s">Orientation · Lecture 1</text>\` + \`</svg>\`;

const v2 = svgOpen() + \`
  <g class="fade-up" style="animation-delay:0.1s"><circle cx="80" cy="150" r="34" stroke="var(--gold)" stroke-width="1.6" pathLength="1" class="draw"/><text x="80" y="155" text-anchor="middle" fill="var(--cream)" font-size="12" font-family="Manrope">Prepare</text></g>
  <path d="M118 150 L172 150" stroke="var(--gold-soft)" stroke-width="1.4" pathLength="1" class="draw" style="animation-delay:0.5s"/>
  <path d="M164 144 L172 150 L164 156" stroke="var(--gold-soft)" stroke-width="1.4" fill="none" class="fade-up" style="animation-delay:0.9s"/>
  <g class="fade-up" style="animation-delay:0.7s"><circle cx="200" cy="150" r="34" stroke="var(--ochre)" stroke-width="1.6" pathLength="1" class="draw" style="animation-delay:0.7s"/><text x="200" y="155" text-anchor="middle" fill="var(--cream)" font-size="12" font-family="Manrope">Eliminate</text></g>
  <path d="M238 150 L292 150" stroke="var(--gold-soft)" stroke-width="1.4" pathLength="1" class="draw" style="animation-delay:1.2s"/>
  <path d="M284 144 L292 150 L284 156" stroke="var(--gold-soft)" stroke-width="1.4" fill="none" class="fade-up" style="animation-delay:1.5s"/>
  <g class="fade-up" style="animation-delay:1.3s"><circle cx="320" cy="150" r="34" stroke="var(--gold)" stroke-width="1.6" pathLength="1" class="draw" style="animation-delay:1.3s"/><text x="320" y="155" text-anchor="middle" fill="var(--cream)" font-size="11.5" font-family="Manrope">Restore</text></g>
  <text x="200" y="230" text-anchor="middle" fill="var(--muted)" font-size="12" font-family="Manrope" class="fade-up" style="animation-delay:1.8s">Vata · Pitta · Kapha — the three dosha</text>\` + \`</svg>\`;

const v3 = svgOpen() + \`
  <path d="M120 40 C90 80 95 140 80 180 C65 220 90 250 130 260 C160 268 150 220 170 190 C190 160 175 100 150 70 C140 55 130 45 120 40 Z" stroke="var(--gold)" stroke-width="1.5" pathLength="1" class="draw" style="animation-delay:0.1s"/>
  <circle cx="128" cy="160" r="4" fill="var(--ochre)" class="pop-in" style="animation-delay:0.9s"/>
  <text x="128" y="145" text-anchor="middle" fill="var(--gold-soft)" font-size="10" font-family="Manrope" class="fade-up" style="animation-delay:1.1s">Kerala</text>
  <g class="fade-up" style="animation-delay:1.2s">
    <text x="240" y="60" fill="var(--cream)" font-size="12" font-family="Manrope">Abhyanga</text>
    <text x="240" y="95" fill="var(--cream)" font-size="12" font-family="Manrope">Pizhichil</text>
    <text x="240" y="130" fill="var(--cream)" font-size="12" font-family="Manrope">Njavarakizhi</text>
    <text x="240" y="165" fill="var(--cream)" font-size="12" font-family="Manrope">Sirodhara</text>
    <text x="240" y="200" fill="var(--cream)" font-size="12" font-family="Manrope">Shirovasti</text>
  </g>
  <g stroke="var(--gold-soft)" stroke-width="1.3">
    <line x1="220" y1="56" x2="205" y2="80" pathLength="1" class="draw" style="animation-delay:1.3s"/>
    <line x1="220" y1="91" x2="205" y2="100" pathLength="1" class="draw" style="animation-delay:1.4s"/>
    <line x1="220" y1="126" x2="205" y2="120" pathLength="1" class="draw" style="animation-delay:1.5s"/>
    <line x1="220" y1="161" x2="205" y2="150" pathLength="1" class="draw" style="animation-delay:1.6s"/>
    <line x1="220" y1="196" x2="205" y2="175" pathLength="1" class="draw" style="animation-delay:1.7s"/>
  </g>\` + \`</svg>\`;

function lotusFive(){
  const labels = ["Vamana","Virechana","Basti","Nasya","Raktamokshana"];
  let g = '';
  for(let i=0;i<5;i++){
    const angle = (i*72 - 90) * Math.PI/180, r = 92;
    const x = 200 + Math.cos(angle)*r, y = 150 + Math.sin(angle)*r;
    const lx = 200 + Math.cos(angle)*(r+34), ly = 150 + Math.sin(angle)*(r+34);
    g += \`<ellipse cx="\${x}" cy="\${y}" rx="20" ry="46" transform="rotate(\${i*72} \${x} \${y})" stroke="var(--gold)" stroke-width="1.5" pathLength="1" class="draw" style="animation-delay:\${0.15*i}s"/>\`;
    g += \`<text x="\${lx}" y="\${ly}" text-anchor="middle" fill="var(--cream)" font-size="11" font-family="Manrope" class="fade-up" style="animation-delay:\${0.15*i+0.5}s">\${labels[i]}</text>\`;
  }
  return g + \`<circle cx="200" cy="150" r="20" stroke="var(--gold-soft)" stroke-width="1.6" pathLength="1" class="draw" style="animation-delay:0.8s"/>
  <text x="200" y="154" text-anchor="middle" fill="var(--gold-soft)" font-size="10" font-family="Manrope" class="fade-up" style="animation-delay:1.3s">5 Karma</text>\`;
}
const v4 = svgOpen() + lotusFive() + \`</svg>\`;

const v5 = svgOpen() + \`
  <g class="fade-up" style="animation-delay:0.1s">
    <path d="M90 90 C90 130 60 140 60 175 C60 198 80 212 100 200 C118 190 118 165 100 150 C88 140 90 115 90 90Z" fill="var(--gold)" opacity="0.9" class="drift"/>
    <text x="90" y="230" text-anchor="middle" fill="var(--cream)" font-size="12" font-family="Manrope">Snehana</text>
    <text x="90" y="248" text-anchor="middle" fill="var(--muted)" font-size="10.5" font-family="Manrope">oleation</text>
  </g>
  <path d="M140 160 L190 160" stroke="var(--gold-soft)" stroke-width="1.4" pathLength="1" class="draw" style="animation-delay:0.6s"/>
  <g class="fade-up" style="animation-delay:0.8s">
    <path d="M220 190 C226 170 216 160 222 140" stroke="var(--ochre)" stroke-width="2" fill="none" class="float"/>
    <path d="M240 195 C246 175 236 165 242 145" stroke="var(--ochre)" stroke-width="2" fill="none" class="float" style="animation-delay:0.3s"/>
    <path d="M260 190 C266 170 256 160 262 140" stroke="var(--ochre)" stroke-width="2" fill="none" class="float" style="animation-delay:0.6s"/>
    <text x="240" y="230" text-anchor="middle" fill="var(--cream)" font-size="12" font-family="Manrope">Swedana</text>
    <text x="240" y="248" text-anchor="middle" fill="var(--muted)" font-size="10.5" font-family="Manrope">sudation</text>
  </g>
  <path d="M290 160 L340 160" stroke="var(--gold-soft)" stroke-width="1.4" pathLength="1" class="draw" style="animation-delay:1.3s"/>
  <g class="fade-up" style="animation-delay:1.6s"><circle cx="360" cy="160" r="24" stroke="var(--gold)" stroke-width="1.6"/><text x="360" y="164" text-anchor="middle" fill="var(--gold-soft)" font-size="10" font-family="Manrope">Karma</text></g>\` + \`</svg>\`;

const v6 = svgOpen() + \`
  <g class="fade-up" style="animation-delay:0.1s"><circle cx="80" cy="90" r="20" stroke="var(--gold)" stroke-width="1.5"/><text x="80" y="94" text-anchor="middle" fill="var(--cream)" font-size="9.5" font-family="Manrope">Coconut</text></g>
  <g class="fade-up" style="animation-delay:0.3s"><circle cx="80" cy="160" r="20" stroke="var(--gold)" stroke-width="1.5"/><text x="80" y="164" text-anchor="middle" fill="var(--cream)" font-size="9.5" font-family="Manrope">Sesame</text></g>
  <g class="fade-up" style="animation-delay:0.5s"><circle cx="80" cy="230" r="20" stroke="var(--gold)" stroke-width="1.5"/><text x="80" y="234" text-anchor="middle" fill="var(--cream)" font-size="9" font-family="Manrope">Herbs</text></g>
  <g stroke="var(--gold-soft)" stroke-width="1.3">
    <line x1="100" y1="90" x2="190" y2="150" pathLength="1" class="draw" style="animation-delay:0.7s"/>
    <line x1="100" y1="160" x2="190" y2="155" pathLength="1" class="draw" style="animation-delay:0.9s"/>
    <line x1="100" y1="230" x2="190" y2="165" pathLength="1" class="draw" style="animation-delay:1.1s"/>
  </g>
  <g class="fade-up" style="animation-delay:1.3s">
    <rect x="200" y="110" width="90" height="90" rx="2" stroke="var(--ochre)" stroke-width="1.6" fill="none"/>
    <path d="M200 140 L245 108 L290 140" stroke="var(--ochre)" stroke-width="1.6" fill="none"/>
    <text x="245" y="230" text-anchor="middle" fill="var(--cream)" font-size="11" font-family="Manrope">Ashtavaidya</text>
    <text x="245" y="246" text-anchor="middle" fill="var(--muted)" font-size="10" font-family="Manrope">lineage households</text>
  </g>
  <g class="fade-up" style="animation-delay:1.6s"><text x="345" y="150" fill="var(--gold-soft)" font-size="11" font-family="Manrope">Karkidakam</text><text x="345" y="167" fill="var(--muted)" font-size="9.5" font-family="Manrope">monsoon</text><text x="345" y="182" fill="var(--muted)" font-size="9.5" font-family="Manrope">chikitsa</text></g>\` + \`</svg>\`;

const v7 = svgOpen() + \`
  <line x1="40" y1="150" x2="360" y2="150" stroke="var(--line)" stroke-width="1.5"/>
  <g class="fade-up" style="animation-delay:0.1s"><rect x="30" y="60" width="150" height="24" rx="2" stroke="var(--gold-soft)" stroke-width="1" fill="none"/><text x="105" y="76" text-anchor="middle" fill="var(--gold-soft)" font-size="10" font-family="Manrope">MODULE 1 · FOUNDATION</text></g>
  <g class="fade-up" style="animation-delay:0.2s"><rect x="210" y="60" width="160" height="24" rx="2" stroke="var(--muted)" stroke-width="1" fill="none"/><text x="290" y="76" text-anchor="middle" fill="var(--muted)" font-size="10" font-family="Manrope">MODULE 2 · APPLIED PRACTICE</text></g>
  <g class="pop-in" style="animation-delay:0.5s"><circle cx="80" cy="150" r="22" fill="var(--ochre)"/><circle cx="80" cy="150" r="30" stroke="var(--ochre)" stroke-width="1.4" class="pulse-ring"/><text x="80" y="154" text-anchor="middle" fill="var(--cream)" font-size="10" font-family="Manrope">You</text><text x="80" y="200" text-anchor="middle" fill="var(--cream)" font-size="10.5" font-family="Manrope">Lecture 1</text></g>
  <g class="fade-up" style="animation-delay:0.9s"><circle cx="180" cy="150" r="16" stroke="var(--gold)" stroke-width="1.5"/><text x="180" y="200" text-anchor="middle" fill="var(--muted)" font-size="10.5" font-family="Manrope">Lecture 2</text></g>
  <g class="fade-up" style="animation-delay:1.1s"><circle cx="270" cy="150" r="16" stroke="var(--gold)" stroke-width="1.5"/><text x="270" y="200" text-anchor="middle" fill="var(--muted)" font-size="10.5" font-family="Manrope">Lecture 3</text></g>
  <g class="fade-up" style="animation-delay:1.3s"><circle cx="350" cy="150" r="16" stroke="var(--gold)" stroke-width="1.5"/><text x="350" y="200" text-anchor="middle" fill="var(--muted)" font-size="10.5" font-family="Manrope">Lecture 4</text></g>\` + \`</svg>\`;

function outcomeGrid(){
  const items = ["Terminology & scope","Prep · Procedure · Recovery","Safety & documentation","Protocol & case review"];
  let g = ''; const pos = [[100,90],[300,90],[100,210],[300,210]];
  items.forEach((t,i)=>{ const [x,y] = pos[i];
    g += \`<g class="pop-in" style="animation-delay:\${0.15*i}s">
      <circle cx="\${x}" cy="\${y}" r="26" stroke="var(--gold)" stroke-width="1.6" fill="none"/>
      <path d="M\${x-9},\${y} l6,7 l13,-15" stroke="var(--gold-soft)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" class="draw" style="animation-delay:\${0.15*i+0.4}s"/>
      <text x="\${x}" y="\${y+46}" text-anchor="middle" fill="var(--cream)" font-size="11" font-family="Manrope">\${t}</text>
    </g>\`;
  });
  return g;
}
const v8 = svgOpen() + outcomeGrid() + \`</svg>\`;

const v9 = svgOpen() + \`
  <circle cx="160" cy="140" r="60" stroke="var(--gold)" stroke-width="1.4" opacity="0.85" class="pop-in" style="animation-delay:0.1s"/>
  <circle cx="220" cy="140" r="60" stroke="var(--ochre)" stroke-width="1.4" opacity="0.85" class="pop-in" style="animation-delay:0.3s"/>
  <circle cx="190" cy="190" r="60" stroke="var(--gold-soft)" stroke-width="1.4" opacity="0.85" class="pop-in" style="animation-delay:0.5s"/>
  <text x="130" y="110" fill="var(--cream)" font-size="11" font-family="Manrope" class="fade-up" style="animation-delay:0.8s">Practitioners</text>
  <text x="235" y="110" fill="var(--cream)" font-size="11" font-family="Manrope" class="fade-up" style="animation-delay:0.95s">Students</text>
  <text x="165" y="235" fill="var(--cream)" font-size="11" font-family="Manrope" class="fade-up" style="animation-delay:1.1s">Serious learners</text>
  <text x="190" y="150" text-anchor="middle" fill="var(--gold-soft)" font-size="9.5" font-family="Manrope" class="fade-up" style="animation-delay:1.4s">Ayurvedic</text>
  <text x="190" y="162" text-anchor="middle" fill="var(--gold-soft)" font-size="9.5" font-family="Manrope" class="fade-up" style="animation-delay:1.5s">grounding</text>
  <text x="190" y="270" text-anchor="middle" fill="var(--muted)" font-size="10.5" font-family="Manrope" class="fade-up" style="animation-delay:1.8s">Not a substitute for supervised clinical training</text>\` + \`</svg>\`;

const v10 = svgOpen() + \`\${lotusMandala(150,150,70,0.1)} \${flame(150,150,0.75,1.0)}
  <path d="M235 150 L330 150" stroke="var(--gold-soft)" stroke-width="1.5" pathLength="1" class="draw" style="animation-delay:1.4s"/>
  <path d="M320 143 L330 150 L320 157" stroke="var(--gold-soft)" stroke-width="1.5" fill="none" class="fade-up" style="animation-delay:1.9s"/>
  <text x="330" y="130" text-anchor="end" fill="var(--gold-soft)" font-size="12" font-family="Manrope" class="fade-up" style="animation-delay:2.0s">Next</text>
  <text x="330" y="145" text-anchor="end" fill="var(--cream)" font-size="12" font-family="Manrope" class="fade-up" style="animation-delay:2.1s">Lecture 2</text>
  <text x="330" y="160" text-anchor="end" fill="var(--muted)" font-size="10.5" font-family="Manrope" class="fade-up" style="animation-delay:2.2s">Standards &amp; Safe Practice</text>\` + \`</svg>\`;

const slides = [
  {module:"${moduleTitle}", eyebrow:"Scene 1 of 10", title:"Welcome to the Masterclass", visual:v1,
   narration:"Welcome to the Masterclass in Classical Keraleeya Panchakarma Protocols. My name doesn't matter as much as the sampradaya, the living tradition, we're about to enter together. Over four lectures across two modules, you'll move from foundational concepts to hands-on case review, building the kind of grounded understanding that generations of Kerala's physician families have passed down. This first lecture is your orientation. Before we touch a single protocol, we need shared language, shared expectations, and a clear map of where this course is going. Think of the next several minutes as setting the compass. By the end, you'll know exactly what Panchakarma means in the Keraleeya context, why Kerala's approach looks different from other regional traditions, what each of the remaining lectures covers, and what you personally will be able to do once you complete this masterclass. Let's begin."},
  {module:"${moduleTitle}", eyebrow:"Scene 2 of 10", title:"What Is Panchakarma?", visual:v2,
   narration:"Panchakarma comes from two Sanskrit words: panch, meaning five, and karma, meaning action or procedure. Classical Ayurvedic texts, particularly Charaka Samhita and Sushruta Samhita, describe it as a structured system for clearing accumulated dosha, the three biological forces of vata, pitta, and kapha, from the body through its natural channels of elimination. It isn't one treatment. It's a sequence: preparatory therapies that mobilize toxins, five principal eliminative procedures that remove them, and post-procedure care that rebuilds strength. Classical Panchakarma names five main actions: Vamana or therapeutic emesis, Virechana or purgation, Basti or medicated enema, Nasya or nasal administration, and Raktamokshana or bloodletting. Each targets specific tissues, specific doshas, and specific conditions. What makes this system remarkable isn't any single procedure, it's the logic connecting them: prepare the body, remove what doesn't belong, then restore what does. That logic is exactly what we're going to build on, lecture by lecture, throughout this masterclass."},
  {module:"${moduleTitle}", eyebrow:"Scene 3 of 10", title:"The Keraleeya Tradition", visual:v3,
   narration:"Now, why 'Keraleeya' Panchakarma specifically? Kerala developed a distinct regional expression of these classical principles, shaped by its climate, its oils, and centuries of continuous clinical practice within families of physicians known as the Ashtavaidyas. Where classical Panchakarma, as taught across India, emphasizes the five internal eliminative procedures, the Kerala tradition places heavy emphasis on external oil-based therapies used alongside them: Abhyanga, structured full-body oil massage, Pizhichil, a rhythmic pouring of warm medicated oil over the body, Njavarakizhi, a sudation therapy using boluses of medicinal rice, Sirodhara, the continuous stream of oil across the forehead, and Shirovasti, oil retained over the scalp using a leather or cloth chamber. Kerala's humid monsoon climate also gave rise to a seasonal practice: treatments concentrated during Karkidakam, the monsoon month, when the environment is considered most receptive to deep therapy. This regional lineage is what 'Keraleeya' signals in our course title, and it's the specific tradition every protocol in this masterclass will draw from."},
  {module:"${moduleTitle}", eyebrow:"Scene 4 of 10", title:"The Five Classical Karmas", visual:v4,
   narration:"Let's put faces to these five classical actions, because you'll hear all five terms repeatedly across this course. Vamana induces controlled therapeutic vomiting to clear excess kapha, most often from the upper respiratory and digestive channels. Virechana induces controlled purgation to clear excess pitta, typically from the small intestine and liver-related channels. Basti introduces medicated decoctions or oils through the rectum, and is considered the single most powerful tool for balancing vata, the dosha classical texts treat as the root of most disorders. Nasya administers medicated oils or powders through the nostrils to clear excess dosha from the head and neck region. And Raktamokshana, bloodletting, clears impurities carried in the blood tissue itself, used far more selectively than the other four. In Kerala's applied practice, these five internal procedures are often supported and amplified by the external oil therapies we just named. You'll study each in far more operational detail in Module Two, once we've covered safety and documentation in the next lecture."},
  {module:"${moduleTitle}", eyebrow:"Scene 5 of 10", title:"Purvakarma: Preparing the Body", visual:v5,
   narration:"None of those five procedures happen in isolation. Classical texts insist on preparation first, called Purvakarma, built on two pillars. Snehana is oleation: internal or external administration of medicated oils and ghee that loosen deep-seated toxins and make them mobile. Swedana is sudation: therapeutic sweating, usually through herbal steam or heated boluses, that further liquefies and moves those toxins toward the body's elimination channels. Only after adequate Snehana and Swedana does a practitioner move to the eliminative procedure itself. Skip this stage, or rush it, and the eliminative procedure becomes far less effective and considerably riskier. This preparatory logic, prepare thoroughly before you eliminate, is one of the most important mental models you'll carry through this entire masterclass. Every protocol we examine in Module Two will trace back to this same sequence: prepare, eliminate, restore."},
  {module:"${moduleTitle}", eyebrow:"Scene 6 of 10", title:"Why Kerala Developed Its Own Path", visual:v6,
   narration:"It's worth pausing on why this regional variation exists at all, because it isn't arbitrary. Kerala's geography gave it abundant coconut, sesame, and medicinal herb cultivation, ideal raw material for oil-based formulations used in daily practice. Its humid, consistently warm climate suits prolonged external oil therapies in a way drier regions don't. And its Ashtavaidya families maintained oral and written clinical lineages, refining and documenting these external therapies alongside classical procedures over many generations, producing detailed protocols still followed today. Understanding this context matters practically, not just historically. It explains why certain therapies you'll study are emphasized here more than in Panchakarma taught elsewhere, and it will help you recognize which parts of a protocol come from the shared classical foundation, and which parts are specifically Kerala's regional contribution."},
  {module:"${moduleTitle}", eyebrow:"Scene 7 of 10", title:"Inside This Masterclass: The Module Map", visual:v7,
   narration:"Let's map the course itself, so you know exactly where each lecture sits. Module One, Foundation, covers concepts, safety, and scope. You're in Lecture One right now: orientation and learning outcomes. Lecture Two follows immediately after, covering standards, documentation, and safe practice, essential material before you touch any protocol in a clinical or teaching setting. Module Two, Applied Practice and Case Review, moves from theory into application. Lecture Three is a guided protocol walkthrough, taking specific Keraleeya therapies step by step. Lecture Four closes the masterclass with case study review, reflection, and preparation for assessment. Four lectures, two modules, one continuous arc from concept to competent application. Everything you learn in this first module becomes the foundation the second module builds directly on top of."},
  {module:"${moduleTitle}", eyebrow:"Scene 8 of 10", title:"Learning Outcomes", visual:v8,
   narration:"By the time you complete this masterclass, you should be able to do four concrete things. First, define and correctly use the terminology of both classical Panchakarma and Keraleeya regional therapies, distinguishing the five eliminative karmas from Kerala's signature external procedures. Second, explain the Purvakarma, Pradhankarma, Paschatkarma sequence, that's preparation, principal procedure, and post-procedure care, and why each stage matters. Third, apply documentation and safety standards appropriate to a Panchakarma setting, which we cover in depth next lecture. And fourth, walk through at least one full protocol from preparation to closure, and critically evaluate a case study using what you've learned. These four outcomes aren't abstract. Each maps directly onto one of the remaining three lectures, so by the end of Lecture Four, you'll have covered all of them in practice."},
  {module:"${moduleTitle}", eyebrow:"Scene 9 of 10", title:"Who This Is For, and Scope", visual:v9,
   narration:"A quick note on scope, so expectations are aligned from the start. This masterclass is built for practitioners, students, and serious learners who already have some grounding in Ayurvedic fundamentals, dosha theory, basic anatomy and physiology, and ideally some exposure to clinical or wellness practice. It is not a substitute for supervised clinical training, and it does not replace regulatory or institutional certification requirements wherever you practice. What it will give you is a structured, classically grounded understanding of Keraleeya Panchakarma specifically, the terminology, the reasoning, the safety framework, and the applied case logic, organized in a way that's genuinely useful whether you're preparing for further clinical training, supporting a wellness practice, or simply deepening your own scholarship in this tradition."},
  {module:"${moduleTitle}", eyebrow:"Scene 10 of 10", title:"How to Use This Course", visual:v10,
   narration:"A few practical notes before we close this orientation. Watch the two Module One lectures in order. Safety and documentation in Lecture Two depend on the vocabulary we've just built here. When you reach Module Two, keep notes as you go. The case study in Lecture Four will ask you to apply concepts from every earlier lecture, so a running set of notes will save you real time later. And don't rush the foundation. Every experienced Ayurvedic practitioner will tell you the same thing: the depth of your results in applied practice traces directly back to how solid your conceptual foundation is. That's exactly what this module is building. In our next lecture, we move into standards, documentation, and safe practice, the essential groundwork before any protocol touches a patient. I'll see you there."}
];

let current = 0, playing = false, fallbackHandle = null;
let voices = [], chosenVoice = null;
let wordSpans = [];

function loadVoices(){
  voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  const sel = document.getElementById('voiceSelect');
  if(voices.length){
    sel.innerHTML = voices.filter(v=>/^en/i.test(v.lang)).map((v,i)=>\`<option value="\${v.name}">\${v.name} (\${v.lang})</option>\`).join('') || voices.map(v=>\`<option value="\${v.name}">\${v.name} (\${v.lang})</option>\`).join('');
    const preferred = voices.find(v => /en-IN/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)) || voices[0];
    chosenVoice = preferred;
    if(preferred) sel.value = preferred.name;
  }
}
if('speechSynthesis' in window){ speechSynthesis.onvoiceschanged = loadVoices; loadVoices(); }

const fgIcon = document.getElementById('fgIcon');
const titleEl = document.getElementById('slideTitle');
const eyebrowEl = document.getElementById('slideEyebrow');
const captionEl = document.getElementById('caption');
const moduleEl = document.getElementById('moduleLabel');
const counterEl = document.getElementById('counter');
const scrubFill = document.getElementById('scrubFill');
const scrubDots = document.getElementById('scrubDots');
const stageWrap = document.getElementById('stageWrap');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const speedSelect = document.getElementById('speedSelect');
const voiceSelect = document.getElementById('voiceSelect');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const cover = document.getElementById('cover');
const beginBtn = document.getElementById('beginBtn');

slides.forEach((s,i)=>{
  const dot = document.createElement('div');
  dot.className = 'scrub-dot';
  dot.title = s.title;
  dot.addEventListener('click', () => {
    stopSpeech();
    renderSlide(i);
    if(playing) speakCurrent();
  });
  scrubDots.appendChild(dot);
});

function buildCaption(text){
  const words = text.split(/(\\s+)/);
  let charIdx = 0;
  const html = words.map(w => {
    const startAt = charIdx;
    charIdx += w.length;
    if(/^\\s+$/.test(w)) return w;
    return \`<span class="w" data-start="\${startAt}">\${w}</span>\`;
  }).join('');
  captionEl.innerHTML = html;
  wordSpans = Array.from(captionEl.querySelectorAll('.w'));
}

function paintSlide(i){
  current = i;
  const s = slides[i];
  fgIcon.innerHTML = s.visual;
  titleEl.textContent = s.title;
  eyebrowEl.textContent = s.eyebrow;
  moduleEl.textContent = s.module;
  buildCaption(s.narration);
  counterEl.textContent = \`\${i+1} / \${slides.length}\`;
  scrubFill.style.width = \`\${(i/(slides.length-1))*100}%\`;
  Array.from(scrubDots.children).forEach((d,idx)=>{
    d.classList.toggle('active', idx===i);
    d.classList.toggle('done', idx<i);
  });
  prevBtn.disabled = (i===0);
  nextBtn.disabled = (i===slides.length-1);
}

function renderSlide(i, instant){
  if(instant){ paintSlide(i); return; }
  stageWrap.classList.add('fading');
  setTimeout(()=>{ paintSlide(i); stageWrap.classList.remove('fading'); }, 220);
}

function highlightWord(charIndex){
  let activeIdx = -1;
  for(let k=0;k<wordSpans.length;k++){
    const start = parseInt(wordSpans[k].dataset.start,10);
    if(start <= charIndex) activeIdx = k; else break;
  }
  wordSpans.forEach((el,idx)=>{
    el.classList.toggle('active', idx===activeIdx);
    el.classList.toggle('said', idx<activeIdx);
  });
  if(activeIdx>=0 && wordSpans[activeIdx].scrollIntoView){
    wordSpans[activeIdx].scrollIntoView({block:'nearest', behavior:'smooth'});
  }
}

function speakCurrent(){
  const rate = parseFloat(speedSelect.value) || 1;
  if(!('speechSynthesis' in window)){
    const words = slides[current].narration.split(/\\s+/).length;
    const ms = (words/(150*rate))*60000;
    clearTimeout(fallbackHandle);
    fallbackHandle = setTimeout(()=>{ if(playing) advance(); }, ms);
    return;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(slides[current].narration);
  const wanted = voices.find(v => v.name === voiceSelect.value);
  if(wanted) u.voice = wanted; else if(chosenVoice) u.voice = chosenVoice;
  u.rate = rate; u.pitch = 1;
  u.onboundary = (e) => { if(e.name === 'word' || e.charIndex !== undefined) highlightWord(e.charIndex); };
  u.onend = () => { if(playing) advance(); };
  speechSynthesis.speak(u);
}
function stopSpeech(){
  if('speechSynthesis' in window) speechSynthesis.cancel();
  clearTimeout(fallbackHandle);
}
function advance(){
  if(current < slides.length - 1){
    renderSlide(current + 1);
    setTimeout(speakCurrent, 230);
  } else {
    playing = false;
    playBtn.textContent = '▶ Play';
    try {
      window.parent.postMessage({ type: 'LECTURE_COMPLETED' }, '*');
    } catch(e){}
  }
}
function play(){ playing = true; playBtn.textContent = '⏸ Pause'; speakCurrent(); }
function pause(){ playing = false; playBtn.textContent = '▶ Play'; stopSpeech(); wordSpans.forEach(el=>el.classList.remove('active')); }

playBtn.addEventListener('click', () => { playing ? pause() : play(); });
nextBtn.addEventListener('click', () => { stopSpeech(); if(current < slides.length-1){ renderSlide(current+1); if(playing) setTimeout(speakCurrent,230); } });
prevBtn.addEventListener('click', () => { stopSpeech(); if(current > 0){ renderSlide(current-1); if(playing) setTimeout(speakCurrent,230); } });
restartBtn.addEventListener('click', () => { stopSpeech(); renderSlide(0); if(playing) setTimeout(speakCurrent,230); });
speedSelect.addEventListener('change', () => { if(playing) speakCurrent(); });
voiceSelect.addEventListener('change', () => { chosenVoice = voices.find(v=>v.name===voiceSelect.value) || chosenVoice; if(playing) speakCurrent(); });
fullscreenBtn.addEventListener('click', () => {
  const frame = document.getElementById('frame');
  if(!document.fullscreenElement){ frame.requestFullscreen?.(); }
  else { document.exitFullscreen?.(); }
});
document.addEventListener('keydown', (e) => {
  if(!cover.classList.contains('hidden')) return;
  if(e.code === 'Space'){ e.preventDefault(); playing ? pause() : play(); }
  else if(e.code === 'ArrowRight'){ nextBtn.click(); }
  else if(e.code === 'ArrowLeft'){ prevBtn.click(); }
  else if(e.code === 'KeyF'){ fullscreenBtn.click(); }
});
beginBtn.addEventListener('click', () => {
  cover.classList.add('hidden');
  play();
});

renderSlide(0, true);
</script>
</body>
</html>`;

  // LECTURE 2 HTML APP
  const getLecture2HTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${lessonTitle || "Standards, Documentation and Safe Practice"} — ${courseTitle}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap');

:root{
  --bg:#0A2118;
  --panel:#0F281F;
  --panel-2:#132E23;
  --gold:#C89B3C;
  --gold-soft:#E6CB86;
  --ochre:#B5502F;
  --cream:#F5EFDF;
  --muted:#8FAE9C;
  --line:rgba(230,203,134,0.20);
  --sky1:#0d3a2c;
  --sky2:#0a2419;
}

*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{
  background:
    radial-gradient(ellipse at 15% -10%, rgba(230,203,134,0.07), transparent 45%),
    radial-gradient(ellipse at 85% 110%, rgba(181,80,47,0.09), transparent 45%),
    var(--bg);
  color:var(--cream);
  font-family:'Manrope',sans-serif;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:12px;
}

.frame{
  width:100%;
  max-width:1080px;
  border:1px solid var(--line);
  border-radius:6px;
  background:var(--panel);
  position:relative;
  overflow:hidden;
  box-shadow:0 30px 80px -30px rgba(0,0,0,0.6);
}
.frame:fullscreen{max-width:none; width:100vw; height:100vh; display:flex; flex-direction:column;}
.frame:fullscreen .stage-wrap{flex:1; min-height:0;}
.frame:fullscreen .visual-panel svg, .frame:fullscreen .visual-panel .fg-icon{max-height:none;}

.mural-border{
  height:9px; width:100%;
  background:repeating-linear-gradient(90deg,
    var(--gold) 0px, var(--gold) 3px, transparent 3px, transparent 8px,
    var(--ochre) 8px, var(--ochre) 11px, transparent 11px, transparent 16px);
  opacity:0.5; flex-shrink:0;
}

.cover{
  position:absolute; inset:0; z-index:30;
  display:flex; align-items:center; justify-content:center;
  background:
    radial-gradient(circle at 50% 38%, rgba(200,155,60,0.10), transparent 55%),
    linear-gradient(180deg, var(--sky1), var(--sky2));
  transition:opacity .5s ease, visibility .5s ease;
}
.cover.hidden{opacity:0; visibility:hidden; pointer-events:none;}
.cover-inner{text-align:center; padding:20px; max-width:540px;}
.cover-kicker{font-size:12px; letter-spacing:0.04em; color:var(--gold-soft); font-weight:600; margin-bottom:14px;}
.cover-inner h1{font-family:'Fraunces',serif; font-size:clamp(24px,4vw,36px); font-weight:600; margin:0 0 10px; line-height:1.18;}
.cover-inner p{color:var(--muted); font-size:14.5px; margin:0 0 28px;}
#beginBtn{
  font-family:'Manrope',sans-serif; font-weight:700; font-size:14.5px;
  background:var(--ochre); border:1px solid var(--ochre); color:var(--cream);
  padding:13px 30px; border-radius:2px; cursor:pointer; letter-spacing:0.01em;
  transition:background .15s ease, transform .15s ease;
}
#beginBtn:hover{background:#c65a37; transform:translateY(-1px);}
.cover-meta{margin-top:16px; font-size:11.5px; color:var(--muted); letter-spacing:0.02em;}

.head{
  padding:22px 32px 12px;
  display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;
  border-bottom:1px solid var(--line); flex-shrink:0;
}
.kicker{font-size:12px; letter-spacing:0.03em; color:var(--gold-soft); font-weight:600;}
.course-name{font-family:'Fraunces',serif; font-size:14.5px; color:var(--muted); font-weight:500;}

.scrub-wrap{padding:12px 32px 0; flex-shrink:0;}
.scrub-track{position:relative; height:20px; display:flex; align-items:center;}
.scrub-line{position:absolute; left:0; right:0; top:50%; height:2px; background:rgba(255,255,255,0.08); transform:translateY(-50%); border-radius:2px; overflow:hidden;}
.scrub-fill{height:100%; width:0%; background:linear-gradient(90deg,var(--ochre),var(--gold)); transition:width .4s ease;}
.scrub-dots{position:relative; display:flex; justify-content:space-between; width:100%; z-index:2;}
.scrub-dot{
  width:9px; height:9px; border-radius:50%; background:var(--panel);
  border:1.5px solid var(--muted); cursor:pointer; transition:border-color .15s ease, background .15s ease, transform .15s ease;
  flex-shrink:0;
}
.scrub-dot:hover{transform:scale(1.25);}
.scrub-dot.done{background:var(--gold); border-color:var(--gold);}
.scrub-dot.active{background:var(--ochre); border-color:var(--gold-soft); transform:scale(1.35);}

.stage-wrap{
  display:grid; grid-template-columns:1.05fr 1fr; gap:0; min-height:380px;
  transition:opacity .26s ease, transform .26s ease;
}
.stage-wrap.fading{opacity:0; transform:translateY(6px);}
@media (max-width:760px){.stage-wrap{grid-template-columns:1fr;}}

.visual-panel{
  position:relative; overflow:hidden;
  background:linear-gradient(180deg, rgba(0,0,0,0.10), transparent 30%), var(--panel-2);
  border-right:1px solid var(--line);
  min-height:280px; display:flex; align-items:center; justify-content:center;
}
@media (max-width:760px){.visual-panel{border-right:none; border-bottom:1px solid var(--line);}}
.bg-scene{position:absolute; inset:0; width:100%; height:100%; opacity:0.55;}
.fg-icon{position:relative; width:100%; padding:24px; z-index:2;}
.fg-icon svg{width:100%; height:auto; max-height:300px; display:block; margin:0 auto;}

.text-panel{padding:24px 28px 18px; display:flex; flex-direction:column;}
.slide-eyebrow{font-size:11px; letter-spacing:0.04em; color:var(--muted); font-weight:600; margin-bottom:8px;}
.slide-title{font-family:'Fraunces',serif; font-size:24px; font-weight:600; line-height:1.16; color:var(--cream); margin:0 0 12px;}
.narration{font-size:14.5px; line-height:1.68; color:#D9D2BF; margin:0; flex:1; overflow-y:auto; max-height:220px; padding-right:6px;}
.narration::-webkit-scrollbar{width:5px;}
.narration::-webkit-scrollbar-thumb{background:var(--line); border-radius:3px;}
.narration .w{transition:color .15s ease, opacity .15s ease;}
.narration .w.active{color:var(--gold-soft); font-weight:600;}
.narration .w.said{opacity:0.82;}

.controls{
  border-top:1px solid var(--line); padding:12px 28px; flex-shrink:0;
  display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:space-between;
}
.control-left, .control-right{display:flex; align-items:center; gap:8px; flex-wrap:wrap;}
button, select{
  font-family:'Manrope',sans-serif; font-weight:600; font-size:13px;
  border:1px solid var(--line); background:transparent; color:var(--cream);
  padding:8px 14px; border-radius:2px; cursor:pointer; transition:background .15s ease, border-color .15s ease;
}
select{padding:7px 10px; font-weight:500;}
select option{background:var(--panel); color:var(--cream);}
button:hover, select:hover{border-color:var(--gold-soft); background:rgba(230,203,134,0.06);}
button:disabled{opacity:0.35; cursor:default;}
button:focus-visible, select:focus-visible{outline:2px solid var(--gold-soft); outline-offset:2px;}
.play-btn{background:var(--ochre); border-color:var(--ochre); min-width:92px;}
.play-btn:hover{background:#c65a37; border-color:#c65a37;}
.icon-btn{padding:8px 11px;}
.counter{font-size:12px; color:var(--muted); min-width:48px; text-align:center;}

.foot-note{padding:0 28px 14px; font-size:11px; color:var(--muted); line-height:1.5; flex-shrink:0;}

@keyframes drawPath{from{stroke-dashoffset:1;}to{stroke-dashoffset:0;}}
@keyframes fadeUp{from{opacity:0; transform:translateY(10px);}to{opacity:1; transform:translateY(0);}}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
@keyframes flicker{0%,100%{opacity:1; transform:scaleY(1);}50%{opacity:0.72; transform:scaleY(0.88);}}
@keyframes pulseRing{0%{transform:scale(0.85); opacity:0.9;}75%{transform:scale(1.5); opacity:0;}100%{opacity:0;}}
@keyframes popIn{from{opacity:0; transform:scale(0.55);}to{opacity:1; transform:scale(1);}}
@keyframes driftDrop{0%{transform:translateY(-4px); opacity:0;}15%{opacity:1;}100%{transform:translateY(10px); opacity:0.15;}}
@keyframes waveDrift{from{transform:translateX(0);}to{transform:translateX(-200px);}}
@keyframes sway{0%,100%{transform:rotate(-2deg);}50%{transform:rotate(2deg);}}
@keyframes glowPulse{0%,100%{opacity:0.35;}50%{opacity:0.6;}}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
@keyframes fillRise{from{transform:scaleY(0);}to{transform:scaleY(1);}}

.draw{stroke-dasharray:1; stroke-dashoffset:1; animation:drawPath 1.1s ease forwards;}
.fade-up{opacity:0; animation:fadeUp 0.7s ease forwards;}
.float{animation:floatY 3.2s ease-in-out infinite;}
.flicker{animation:flicker 1.6s ease-in-out infinite; transform-origin:bottom center;}
.pulse-ring{animation:pulseRing 2.4s ease-out infinite;}
.pop-in{opacity:0; animation:popIn 0.55s cubic-bezier(.2,.8,.3,1.2) forwards;}
.drift{animation:driftDrop 2.4s ease-in infinite;}
.wave-grp{animation:waveDrift 9s linear infinite;}
.palm-sway{animation:sway 5.5s ease-in-out infinite; transform-origin:bottom center;}
.glow{animation:glowPulse 4s ease-in-out infinite;}
.blink{animation:blink 1.3s ease-in-out infinite;}
.fill-rise{transform-origin:bottom; animation:fillRise 0.6s ease forwards;}

@media (prefers-reduced-motion:reduce){
  .draw,.fade-up,.float,.flicker,.pulse-ring,.pop-in,.drift,.wave-grp,.palm-sway,.glow,.blink,.fill-rise{animation:none !important; opacity:1 !important; stroke-dashoffset:0 !important; transform:none !important;}
}
</style>
</head>
<body>

<div class="frame" id="frame">
  <div class="mural-border"></div>

  <div class="cover" id="cover">
    <div class="cover-inner">
      <div class="cover-kicker">${moduleTitle} · LECTURE 2</div>
      <h1>${lessonTitle || "Standards, Documentation and Safe Practice"}</h1>
      <p>${courseTitle}</p>
      <button id="beginBtn">▶ Begin Lecture</button>
      <div class="cover-meta">10 scenes · narrated · ~18 min</div>
    </div>
  </div>

  <div class="head">
    <div class="kicker" id="moduleLabel">${moduleTitle}</div>
    <div class="course-name">${courseTitle}</div>
  </div>

  <div class="scrub-wrap">
    <div class="scrub-track">
      <div class="scrub-line"><div class="scrub-fill" id="scrubFill"></div></div>
      <div class="scrub-dots" id="scrubDots"></div>
    </div>
  </div>

  <div class="stage-wrap" id="stageWrap">
    <div class="visual-panel" id="visualPanel">
      <svg class="bg-scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0F3327"/>
            <stop offset="100%" stop-color="#0A2419"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="400" height="300" fill="url(#skyGrad)"/>
        <circle class="glow" cx="200" cy="90" r="120" fill="var(--gold)" opacity="0.06"/>
        <g class="palm-sway" transform="translate(38,205)">
          <path d="M0,0 C-2,-30 4,-55 2,-78" stroke="#0d2c20" stroke-width="4" fill="none"/>
          <path d="M2,-78 C-16,-86 -30,-80 -38,-70" stroke="#0d2c20" stroke-width="3" fill="none"/>
          <path d="M2,-78 C18,-88 30,-82 40,-72" stroke="#0d2c20" stroke-width="3" fill="none"/>
          <path d="M2,-78 C-8,-96 -6,-108 -14,-116" stroke="#0d2c20" stroke-width="3" fill="none"/>
          <path d="M2,-78 C12,-98 10,-110 18,-118" stroke="#0d2c20" stroke-width="3" fill="none"/>
        </g>
        <g class="palm-sway" style="animation-delay:-2s" transform="translate(368,215) scale(-1,1)">
          <path d="M0,0 C-2,-26 4,-48 2,-68" stroke="#0d2c20" stroke-width="3.5" fill="none"/>
          <path d="M2,-68 C-14,-75 -26,-70 -33,-61" stroke="#0d2c20" stroke-width="2.5" fill="none"/>
          <path d="M2,-68 C15,-77 26,-72 34,-63" stroke="#0d2c20" stroke-width="2.5" fill="none"/>
          <path d="M2,-68 C-6,-84 -4,-94 -12,-101" stroke="#0d2c20" stroke-width="2.5" fill="none"/>
        </g>
        <g transform="translate(0,236)">
          <g class="wave-grp">
            <path d="M0,10 Q25,0 50,10 T100,10 T150,10 T200,10 T250,10 T300,10 T350,10 T400,10 T450,10 T500,10 T550,10 T600,10"
              stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.18"/>
          </g>
          <g class="wave-grp" style="animation-delay:-4s">
            <path d="M0,22 Q25,14 50,22 T100,22 T150,22 T200,22 T250,22 T300,22 T350,22 T400,22 T450,22 T500,22 T550,22 T600,22"
              stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.1"/>
          </g>
          <rect x="0" y="30" width="400" height="34" fill="#0c2a20"/>
        </g>
      </svg>
      <div class="fg-icon" id="fgIcon"></div>
    </div>
    <div class="text-panel">
      <div class="slide-eyebrow" id="slideEyebrow"></div>
      <h1 class="slide-title" id="slideTitle"></h1>
      <p class="narration" id="caption"></p>
    </div>
  </div>

  <div class="controls">
    <div class="control-left">
      <button class="play-btn" id="playBtn">▶ Play</button>
      <button class="icon-btn" id="prevBtn" title="Previous">◂</button>
      <button class="icon-btn" id="nextBtn" title="Next">▸</button>
      <button class="icon-btn" id="restartBtn" title="Restart">↺</button>
      <span class="counter" id="counter">1 / 10</span>
    </div>
    <div class="control-right">
      <select id="speedSelect" title="Narration speed">
        <option value="0.85">0.85×</option>
        <option value="1" selected>1×</option>
        <option value="1.15">1.15×</option>
        <option value="1.3">1.3×</option>
      </select>
      <select id="voiceSelect" title="Narration voice"><option>Loading voices…</option></select>
      <button class="icon-btn" id="fullscreenBtn" title="Fullscreen">⛶</button>
    </div>
  </div>
  <div class="foot-note">Narrated with your browser's built-in speech voice — Chrome or Edge with sound on gives the fullest experience. Space = play/pause · ← → = navigate · F = fullscreen.</div>
</div>

<script>
const svgOpen = (extra) => \`<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" \${extra||''}>\`;

function lotusMandala(cx, cy, r, delayBase){
  let petals = '';
  for(let i=0;i<8;i++){
    const angle = (i * 45) * Math.PI/180;
    const x1 = cx + Math.cos(angle)*r*0.25, y1 = cy + Math.sin(angle)*r*0.25;
    const x2 = cx + Math.cos(angle)*r, y2 = cy + Math.sin(angle)*r;
    petals += \`<ellipse cx="\${(x1+x2)/2}" cy="\${(y1+y2)/2}" rx="\${r*0.16}" ry="\${r*0.42}"
      transform="rotate(\${i*45} \${(x1+x2)/2} \${(y1+y2)/2})"
      stroke="var(--gold)" stroke-width="1.4" class="pop-in" style="animation-delay:\${delayBase + i*0.07}s"/>\`;
  }
  return \`<g>\${petals}
    <circle cx="\${cx}" cy="\${cy}" r="\${r*0.22}" stroke="var(--gold-soft)" stroke-width="1.6" pathLength="1" class="draw" style="animation-delay:\${delayBase}s"/>
    <circle cx="\${cx}" cy="\${cy}" r="\${r*0.1}" fill="var(--ochre)" class="pop-in" style="animation-delay:\${delayBase+0.5}s"/>
  </g>\`;
}
function flame(cx, cy, scale, delay){
  return \`<g transform="translate(\${cx} \${cy}) scale(\${scale})" class="flicker" style="animation-delay:\${delay||0}s">
    <path d="M0,-26 C10,-14 12,-2 4,6 C10,4 15,-4 12,-12 C18,-4 16,10 6,16 C-6,22 -16,10 -12,-2 C-14,6 -8,-10 0,-26 Z" fill="var(--gold)"/>
    <path d="M0,10 C-4,4 4,4 0,10Z" fill="var(--ochre)"/>
  </g>\`;
}

// ---- Scene 1: Title ----
const v1 = svgOpen() + \`\${lotusMandala(200,150,80,0.1)} \${flame(200,150,0.8,1.0)}
  <text x="200" y="255" text-anchor="middle" fill="var(--gold-soft)" font-size="12" font-family="Manrope" class="fade-up" style="animation-delay:1.5s">Standards · Documentation · Safe Practice</text>
  <text x="200" y="275" text-anchor="middle" fill="var(--muted)" font-size="11" font-family="Manrope" class="fade-up" style="animation-delay:1.7s">Lecture 2 of 4</text\` + \`</svg>\`;

// ---- Scene 2: Shield — why standards matter ----
const v2 = svgOpen() + \`
  <path d="M200 44 L262 68 L262 142 C262 194 232 228 200 248 C168 228 138 194 138 142 L138 68 Z"
    stroke="var(--gold)" stroke-width="1.6" pathLength="1" class="draw" style="animation-delay:0.1s"/>
  <circle cx="200" cy="140" r="26" stroke="var(--gold-soft)" stroke-width="1.5" pathLength="1" class="draw" style="animation-delay:0.7s"/>
  <circle cx="200" cy="140" r="9" fill="var(--ochre)" class="pop-in" style="animation-delay:1.1s"/>
  <text x="200" y="270" text-anchor="middle" fill="var(--cream)" font-size="12" font-family="Manrope" class="fade-up" style="animation-delay:1.3s">Protecting Agni &amp; Ojas</text>\` + \`</svg>\`;

// ---- Scene 3: Scope of practice ----
const v3 = svgOpen() + \`
  <g class="fade-up" style="animation-delay:0.1s">
    <circle cx="110" cy="110" r="24" stroke="var(--gold)" stroke-width="1.6"/>
    <path d="M78 210 C78 168 142 168 142 210" stroke="var(--gold)" stroke-width="1.6" fill="none"/>
  </g>
  <g class="pop-in" style="animation-delay:0.5s">
    <circle cx="150" cy="80" r="18" stroke="var(--gold-soft)" stroke-width="1.5" fill="none"/>
    <path d="M143,80 l5,6 l11,-13" stroke="var(--gold-soft)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" class="draw" style="animation-delay:0.9s"/>
  </g>
  <g class="fade-up" style="animation-delay:0.9s">
    <rect x="230" y="70" width="130" height="30" rx="2" stroke="var(--gold)" stroke-width="1.2" fill="none"/>
    <text x="295" y="90" text-anchor="middle" fill="var(--cream)" font-size="11" font-family="Manrope">Trained &amp; qualified</text>
  </g>
  <g class="fade-up" style="animation-delay:1.15s">
    <rect x="230" y="112" width="130" height="30" rx="2" stroke="var(--gold)" stroke-width="1.2" fill="none"/>
    <text x="295" y="132" text-anchor="middle" fill="var(--cream)" font-size="11" font-family="Manrope">Supervised</text>
  </g>
  <g class="fade-up" style="animation-delay:1.4s">
    <rect x="230" y="154" width="130" height="30" rx="2" stroke="var(--ochre)" stroke-width="1.2" fill="none"/>
    <text x="295" y="174" text-anchor="middle" fill="var(--cream)" font-size="11" font-family="Manrope">Refer onward</text>
  </g>
  <text x="200" y="250" text-anchor="middle" fill="var(--muted)" font-size="11.5" font-family="Manrope" class="fade-up" style="animation-delay:1.7s">Know exactly where your scope ends</text>\` + \`</svg>\`;

// ---- Scene 4: Purva Pariksha (assessment) ----
const v4 = svgOpen() + \`
  <g class="fade-up" style="animation-delay:0.1s">
    <rect x="130" y="46" width="120" height="164" rx="4" stroke="var(--gold)" stroke-width="1.6" fill="none"/>
    <rect x="164" y="36" width="52" height="18" rx="3" stroke="var(--gold-soft)" stroke-width="1.4" fill="var(--panel-2)"/>
  </g>
  \${[0,1,2,3,4].map((i)=>\`<line x1="146" y1="\${80+i*24}" x2="234" y2="\${80+i*24}" stroke="var(--gold-soft)" stroke-width="1.3" pathLength="1" class="draw" style="animation-delay:\${0.5+i*0.15}s"/>\`).join('')}
  <g class="fade-up" style="animation-delay:1.4s">
    <circle cx="280" cy="190" r="26" stroke="var(--ochre)" stroke-width="2" fill="none"/>
    <line x1="298" y1="208" x2="320" y2="230" stroke="var(--ochre)" stroke-width="3" stroke-linecap="round"/>
  </g>
  <text x="200" y="260" text-anchor="middle" fill="var(--muted)" font-size="11.5" font-family="Manrope" class="fade-up" style="animation-delay:1.7s">Case history · agni · ojas · baseline</text>\` + \`</svg>\`;

// ---- Scene 5: Contraindications & red flags ----
const v5 = svgOpen() + \`
  <path d="M200 50 L280 220 L120 220 Z" stroke="var(--ochre)" stroke-width="1.8" pathLength="1" class="draw" style="animation-delay:0.1s"/>
  <line x1="200" y1="105" x2="200" y2="165" stroke="var(--ochre)" stroke-width="4" stroke-linecap="round" class="blink" style="animation-delay:0.8s"/>
  <circle cx="200" cy="188" r="4" fill="var(--ochre)" class="blink" style="animation-delay:0.8s"/>
  <g class="fade-up" style="animation-delay:1.0s">
    <text x="60" y="80" fill="var(--cream)" font-size="10.5" font-family="Manrope">Pregnancy</text>
    <text x="60" y="105" fill="var(--cream)" font-size="10.5" font-family="Manrope">Acute illness</text>
  </g>
  <g class="fade-up" style="animation-delay:1.25s">
    <text x="300" y="80" fill="var(--cream)" font-size="10.5" font-family="Manrope">Cardiac / organ</text>
    <text x="300" y="105" fill="var(--cream)" font-size="10.5" font-family="Manrope">Low ojas</text>
  </g>
  <text x="200" y="260" text-anchor="middle" fill="var(--muted)" font-size="11.5" font-family="Manrope" class="fade-up" style="animation-delay:1.5s">When flagged: pause, escalate, document</text>\` + \`</svg>\`;

// ---- Scene 6: Informed consent & documentation ----
const v6 = svgOpen() + \`
  <path d="M130 40 L230 40 L262 72 L262 250 L130 250 Z" stroke="var(--gold)" stroke-width="1.6" pathLength="1" class="draw" style="animation-delay:0.1s"/>
  <path d="M230 40 L230 72 L262 72" stroke="var(--gold)" stroke-width="1.4" fill="none" class="fade-up" style="animation-delay:0.6s"/>
  \${[0,1,2,3].map(i=>\`<line x1="150" y1="\${100+i*24}" x2="240" y2="\${100+i*24}" stroke="var(--gold-soft)" stroke-width="1.2" pathLength="1" class="draw" style="animation-delay:\${0.8+i*0.15}s"/>\`).join('')}
  <path d="M150 214 C165 206 175 222 190 210 C200 202 208 216 220 208" stroke="var(--ochre)" stroke-width="1.8" fill="none" pathLength="1" class="draw" style="animation-delay:1.6s"/>
  <g class="pop-in" style="animation-delay:2.0s">
    <circle cx="290" cy="95" r="22" fill="var(--ochre)"/>
    <path d="M280,95 l7,7 l14,-16" stroke="var(--cream)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="200" y="272" text-anchor="middle" fill="var(--muted)" font-size="11" font-family="Manrope" class="fade-up" style="animation-delay:2.2s">Signed consent, then a running record</text>\` + \`</svg>\`;

// ---- Scene 7: Hygiene, environment & equipment ----
const v7 = svgOpen() + \`
  <g class="fade-up" style="animation-delay:0.1s">
    <path d="M120 60 C120 90 96 100 96 128 C96 148 112 160 130 150 C146 142 146 122 130 108 C122 100 120 78 120 60Z"
      fill="var(--gold)" opacity="0.9" class="float"/>
  </g>
  <g class="pop-in" style="animation-delay:0.5s"><path d="M170 70 l4 10 l10 4 l-10 4 l-4 10 l-4-10 l-10-4 l10-4Z" fill="var(--gold-soft)"/></g>
  <g class="pop-in" style="animation-delay:0.7s"><path d="M205 55 l3 7 l7 3 l-7 3 l-3 7 l-3-7 l-7-3 l7-3Z" fill="var(--gold-soft)"/></g>
  <g class="fade-up" style="animation-delay:1.0s">
    <rect x="90" y="190" width="220" height="26" rx="6" stroke="var(--ochre)" stroke-width="1.6" fill="none"/>
    <line x1="110" y1="216" x2="110" y2="236" stroke="var(--ochre)" stroke-width="3" stroke-linecap="round"/>
    <line x1="290" y1="216" x2="290" y2="236" stroke="var(--ochre)" stroke-width="3" stroke-linecap="round"/>
    <text x="200" y="207" text-anchor="middle" fill="var(--cream)" font-size="10" font-family="Manrope">Droni table</text>
  </g>
  <text x="200" y="266" text-anchor="middle" fill="var(--muted)" font-size="11" font-family="Manrope" class="fade-up" style="animation-delay:1.4s">Clean linens · sterilized equipment · stable warmth</text>\` + \`</svg>\`;

// ---- Scene 8: In-session monitoring ----
const v8 = svgOpen() + \`
  <path d="M40 160 L120 160 L140 110 L165 200 L190 130 L210 160 L360 160"
    stroke="var(--gold)" stroke-width="1.8" fill="none" pathLength="1" class="draw" style="animation-delay:0.2s"/>
  <circle cx="140" cy="110" r="4" fill="var(--gold-soft)" class="pop-in" style="animation-delay:0.9s"/>
  <circle cx="165" cy="200" r="4" fill="var(--gold-soft)" class="pop-in" style="animation-delay:1.05s"/>
  <circle cx="190" cy="130" r="4" fill="var(--gold-soft)" class="pop-in" style="animation-delay:1.2s"/>
  <g class="pop-in" style="animation-delay:1.5s">
    <circle cx="300" cy="120" r="10" fill="var(--ochre)"/>
    <circle cx="300" cy="120" r="18" stroke="var(--ochre)" stroke-width="1.4" class="pulse-ring"/>
  </g>
  <text x="200" y="245" text-anchor="middle" fill="var(--cream)" font-size="12" font-family="Manrope" class="fade-up" style="animation-delay:1.7s">Watch signs. If something is wrong, stop.</text>\` + \`</svg>\`;

// ---- Scene 9: Samsarjana krama (staged diet) ----
function bowl(x, fillH, delay, label){
  return \`<g class="fade-up" style="animation-delay:\${delay}s">
    <path d="M\${x-26} 150 C\${x-26} 172 \${x+26} 172 \${x+26} 150 L\${x+22} 150 C\${x+22} 164 \${x-22} 164 \${x-22} 150 Z" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
    <rect x="\${x-20}" y="\${150-fillH}" width="40" height="\${fillH}" fill="var(--gold)" opacity="0.75" class="fill-rise" style="animation-delay:\${delay+0.3}s"/>
    <text x="\${x}" y="188" text-anchor="middle" fill="var(--cream)" font-size="10.5" font-family="Manrope">\${label}</text>
  </g>\`;
}
const v9 = svgOpen() + \`
  \${bowl(90, 8, 0.1, "Liquid")}
  <path d="M130 150 L170 150" stroke="var(--gold-soft)" stroke-width="1.3" pathLength="1" class="draw" style="animation-delay:0.6s"/>
  \${bowl(200, 16, 0.8, "Soft")}
  <path d="M240 150 L280 150" stroke="var(--gold-soft)" stroke-width="1.3" pathLength="1" class="draw" style="animation-delay:1.3s"/>
  \${bowl(310, 24, 1.5, "Solid")}
  <text x="200" y="230" text-anchor="middle" fill="var(--muted)" font-size="11.5" font-family="Manrope" class="fade-up" style="animation-delay:2.0s">Samsarjana Krama — the staged return to food</text>\` + \`</svg>\`;

// ---- Scene 10: Emergency preparedness & closing ----
const v10 = svgOpen() + \`
  <g class="fade-up" style="animation-delay:0.1s">
    <rect x="70" y="90" width="70" height="120" rx="10" stroke="var(--gold)" stroke-width="1.6" fill="none"/>
    <circle cx="105" cy="192" r="4" fill="var(--gold)"/>
    <path d="M85 130 C85 150 125 150 125 130" stroke="var(--gold-soft)" stroke-width="1.4" fill="none"/>
  </g>
  <path d="M150 150 L200 150" stroke="var(--gold-soft)" stroke-width="1.4" pathLength="1" class="draw" style="animation-delay:0.6s"/>
  \${lotusMandala(255,150,55,0.9)} \${flame(255,150,0.55,1.5)}
  <text x="335" y="120" text-anchor="end" fill="var(--gold-soft)" font-size="12" font-family="Manrope" class="fade-up" style="animation-delay:2.0s">Next</text>
  <text x="335" y="138" text-anchor="end" fill="var(--cream)" font-size="12" font-family="Manrope" class="fade-up" style="animation-delay:2.1s">Lecture 3</text>
  <text x="335" y="154" text-anchor="end" fill="var(--muted)" font-size="10.5" font-family="Manrope" class="fade-up" style="animation-delay:2.2s">Guided Protocol Walkthrough</text>
  <text x="200" y="255" text-anchor="middle" fill="var(--muted)" font-size="11" font-family="Manrope" class="fade-up" style="animation-delay:1.7s">Know your emergency contacts before you need them</text>\` + \`</svg>\`;

const slides = [
  {module:"${moduleTitle}", eyebrow:"Scene 1 of 10", title:"Welcome to Lecture 2", visual:v1,
   narration:"Welcome back. This is Lecture Two of Module One: Standards, Documentation, and Safe Practice. In our first lecture we built the conceptual foundation, what Panchakarma is, what makes the Keraleeya tradition distinct, and where this masterclass is headed. Concepts alone don't make anyone a safe practitioner though. This lecture is the bridge between knowing what a protocol is and knowing how to run one responsibly. We're going to cover scope of practice, pre-procedure assessment, contraindications and red flags, informed consent and documentation, hygiene and environment standards, in-session monitoring, post-procedure documentation, and emergency preparedness. It's a longer lecture than the last one, and deliberately so. Everything here is what separates a well-run Panchakarma practice from a risky one, and it's essential groundwork before Module Two, where we walk through actual protocols step by step. Let's get into it."},
  {module:"${moduleTitle}", eyebrow:"Scene 2 of 10", title:"Why Standards Matter", visual:v2,
   narration:"Panchakarma is a genuinely powerful system, and that power cuts both ways. Purvakarma therapies mobilize deep-seated toxins, and the five karmas actively eliminate them through the body's channels. Done well, following sound classical sequencing, this produces real, lasting benefit. Done carelessly, without proper assessment, documentation, or monitoring, the very same mobilization can overwhelm a person's system, worsen an existing condition, or produce complications with agni, the digestive fire, and ojas, the body's core vitality. Classical texts themselves are explicit about this: they don't just describe procedures, they describe qualification, sequencing, and contraindication in the same breath. That's the mindset this lecture asks you to carry forward. Standards aren't bureaucratic overhead bolted onto an ancient practice, they're inseparable from the practice itself, and they're exactly what an Ashtavaidya-trained physician would have quietly built into every single case, long before anyone called it 'documentation.' We're simply making that implicit rigor explicit and structured."},
  {module:"${moduleTitle}", eyebrow:"Scene 3 of 10", title:"Scope of Practice", visual:v3,
   narration:"Let's start with scope of practice, because every other standard in this lecture depends on it. Keraleeya Panchakarma therapies range enormously in complexity and risk. Abhyanga, general oil massage, sits at one end. Strong eliminative procedures like Vamana or Virechana sit at the other, and classical texts reserve those specifically for trained, qualified physicians working with full clinical oversight. A safe practice, whatever country or setting you work in, means knowing precisely where your own training, credentials, and local regulatory permissions end. That boundary should be written down, not assumed. It should cover which therapies you're qualified to administer independently, which require supervision, and which fall entirely outside your scope and must be referred elsewhere. We'll return to referral later in the lecture. For now, the principle to hold onto is simple: rigorous practice starts with an honest, documented answer to the question, what am I actually qualified to do here?"},
  {module:"${moduleTitle}", eyebrow:"Scene 4 of 10", title:"Purva Pariksha: Assessment First", visual:v4,
   narration:"Before any protocol begins, classical practice calls for Purva Pariksha, thorough pre-procedure assessment. In modern terms, this means a structured intake: a full case history, current health status, medications, prior surgeries or procedures, known allergies, and an honest look at digestive strength, or agni, and overall vitality, or ojas, since these determine how much preparatory and eliminative work a person can safely tolerate. This assessment isn't a formality to get through quickly. It's the single biggest predictor of whether a protocol goes well. A rushed or incomplete intake is how contraindications get missed. Practically, this means building, and using, a standard intake form every single time, for every single client or patient, no exceptions for people you already know. Memory is not documentation. What you assess here also sets the baseline you'll compare against throughout the protocol, so record findings specifically and legibly, not as vague impressions you'll try to recall later."},
  {module:"${moduleTitle}", eyebrow:"Scene 5 of 10", title:"Contraindications & Red Flags", visual:v5,
   narration:"Assessment exists to surface contraindications, and every practitioner needs a working knowledge of the major categories, even though specific clinical decisions always belong with qualified, supervising physicians. Broadly, eliminative procedures are approached with extreme caution, or avoided entirely, during pregnancy, in acute illness or infection, in significant cardiac or organ compromise, in severe debility or very low ojas, and in certain psychiatric or emotionally unstable presentations. Age at the extremes, very young or very elderly, also changes what's appropriate. None of this is a list to memorize once and forget, it's a checklist you actively run through during assessment, and document that you ran through, for every case. If anything in an intake raises a flag, the correct response is never to proceed and hope for the best. It's to pause, escalate to a qualified supervising practitioner or physician, and document exactly what was flagged and what decision was made as a result."},
  {module:"${moduleTitle}", eyebrow:"Scene 6 of 10", title:"Informed Consent & Documentation", visual:v6,
   narration:"Once assessment clears a path forward, documentation continues, starting with informed consent. A person receiving Panchakarma therapy should understand, in plain language, what the protocol involves, roughly how long it runs, what sensations or reactions are normal along the way, what would count as a reason to stop, and what's expected of them outside sessions, particularly around diet and rest. That conversation should be documented, ideally with a signed consent record, not just spoken and assumed understood. From there, documentation becomes a running practice, not a one-time event. Each session gets a dated entry: what was administered, how the person responded, any notable observations. This running record does three things. It protects the person receiving care. It protects you as a practitioner. And, just as importantly, it's what lets you or a colleague make sound decisions mid-protocol, because you're working from accurate history rather than memory."},
  {module:"${moduleTitle}", eyebrow:"Scene 7 of 10", title:"Hygiene, Environment & Equipment", visual:v7,
   narration:"Physical standards matter just as much as clinical ones. A Keraleeya Panchakarma setting depends heavily on external oil therapies, which means equipment, linens, and treatment tables in sustained, repeated contact with the body. That calls for strict hygiene protocols: single-use or properly sterilized linens for each client, dedicated or thoroughly cleaned equipment such as droni tables and dhara vessels, correctly stored and labeled oils, and a treatment space kept at an appropriate, consistent temperature, since many of these therapies involve extended periods of a person lying still, often partially oiled and vulnerable to chill. None of this is incidental to safety, it is safety. A therapeutically sound protocol delivered in an unhygienic or poorly maintained environment isn't a safe protocol, whatever the classical accuracy of the technique. Build a simple, written cleaning and setup checklist for your space, and treat it with the same seriousness as the clinical documentation we just covered."},
  {module:"${moduleTitle}", eyebrow:"Scene 8 of 10", title:"In-Session Monitoring", visual:v8,
   narration:"Safety doesn't stop once a procedure begins, it continues actively throughout. During any Panchakarma therapy, a practitioner should be watching for specific signs: changes in skin color or temperature, unusual sweating patterns, dizziness, nausea, marked fatigue, or emotional distress. Classical texts describe expected signs of adequate Snehana and Swedana, the signs that preparation has done its job, and equally describe warning signs of excess, of pushing a therapy too far. Knowing that difference, and watching for it in real time, is a core practitioner skill. In-session monitoring should also be documented, briefly but consistently, noting how someone responded partway through and at the end of a session, not only at intake. And every practitioner needs a clear personal rule: if something looks genuinely wrong, you stop the session. You don't push through to finish a protocol as planned. No classical text, and no responsible modern standard, ever ranks completing a session above the safety of the person in front of you."},
  {module:"${moduleTitle}", eyebrow:"Scene 9 of 10", title:"Post-Procedure & Samsarjana Krama", visual:v9,
   narration:"The end of a therapy session, or of a full Panchakarma course, isn't the end of the protocol. Classical practice places enormous importance on Paschatkarma, post-procedure care, and specifically on Samsarjana Krama, a carefully staged return to normal diet after eliminative procedures. This staged approach, moving gradually from thin liquids, to thicker liquids, to soft solids, and only then to normal food, protects a digestive system that eliminative therapy has deliberately, temporarily weakened. Skipping or rushing this stage undermines much of the benefit of the procedure that came before it, and can itself cause complications. This means your documentation needs to extend past the final treatment session: what dietary stage someone is on, how they're tolerating it, and clear guidance for what comes next. A protocol that stops documenting the moment the last oil therapy ends has stopped documenting too early. Recovery is part of the treatment, not an afterthought to it."},
  {module:"${moduleTitle}", eyebrow:"Scene 10 of 10", title:"Emergency Preparedness & Closing", visual:v10,
   narration:"Last, every practice needs a plan for when something goes wrong, because good standards reduce risk, they don't eliminate it. That means knowing, in advance and in writing, what constitutes an emergency in your setting, who your referral contacts are, a supervising physician, a nearby clinic or hospital, and exactly what you'll do in the first few minutes if a client has a serious adverse reaction. Practicing this mentally before you ever need it is what makes it usable under pressure. Put together, everything in this lecture, scope of practice, assessment, contraindication screening, consent, documentation, hygiene, in-session monitoring, post-procedure care, and emergency preparedness, forms the safety architecture that makes the therapies you're about to study in Module Two something you can deliver responsibly. In our next lecture, we move from standards into practice itself: a guided walkthrough of an actual Keraleeya protocol, start to finish. I'll see you there."}
];

let current = 0, playing = false, fallbackHandle = null;
let voices = [], chosenVoice = null;
let wordSpans = [];

function loadVoices(){
  voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  const sel = document.getElementById('voiceSelect');
  if(voices.length){
    sel.innerHTML = voices.filter(v=>/^en/i.test(v.lang)).map((v)=>\`<option value="\${v.name}">\${v.name} (\${v.lang})</option>\`).join('') || voices.map(v=>\`<option value="\${v.name}">\${v.name} (\${v.lang})</option>\`).join('');
    const preferred = voices.find(v => /en-IN/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)) || voices[0];
    chosenVoice = preferred;
    if(preferred) sel.value = preferred.name;
  }
}
if('speechSynthesis' in window){ speechSynthesis.onvoiceschanged = loadVoices; loadVoices(); }

const fgIcon = document.getElementById('fgIcon');
const titleEl = document.getElementById('slideTitle');
const eyebrowEl = document.getElementById('slideEyebrow');
const captionEl = document.getElementById('caption');
const moduleEl = document.getElementById('moduleLabel');
const counterEl = document.getElementById('counter');
const scrubFill = document.getElementById('scrubFill');
const scrubDots = document.getElementById('scrubDots');
const stageWrap = document.getElementById('stageWrap');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const speedSelect = document.getElementById('speedSelect');
const voiceSelect = document.getElementById('voiceSelect');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const cover = document.getElementById('cover');
const beginBtn = document.getElementById('beginBtn');

slides.forEach((s,i)=>{
  const dot = document.createElement('div');
  dot.className = 'scrub-dot';
  dot.title = s.title;
  dot.addEventListener('click', () => {
    stopSpeech();
    renderSlide(i);
    if(playing) speakCurrent();
  });
  scrubDots.appendChild(dot);
});

function buildCaption(text){
  const words = text.split(/(\\s+)/);
  let charIdx = 0;
  const html = words.map(w => {
    const startAt = charIdx;
    charIdx += w.length;
    if(/^\\s+$/.test(w)) return w;
    return \`<span class="w" data-start="\${startAt}">\${w}</span>\`;
  }).join('');
  captionEl.innerHTML = html;
  wordSpans = Array.from(captionEl.querySelectorAll('.w'));
}

function paintSlide(i){
  current = i;
  const s = slides[i];
  fgIcon.innerHTML = s.visual;
  titleEl.textContent = s.title;
  eyebrowEl.textContent = s.eyebrow;
  moduleEl.textContent = s.module;
  buildCaption(s.narration);
  counterEl.textContent = \`\${i+1} / \${slides.length}\`;
  scrubFill.style.width = \`\${(i/(slides.length-1))*100}%\`;
  Array.from(scrubDots.children).forEach((d,idx)=>{
    d.classList.toggle('active', idx===i);
    d.classList.toggle('done', idx<i);
  });
  prevBtn.disabled = (i===0);
  nextBtn.disabled = (i===slides.length-1);
}

function renderSlide(i, instant){
  if(instant){ paintSlide(i); return; }
  stageWrap.classList.add('fading');
  setTimeout(()=>{ paintSlide(i); stageWrap.classList.remove('fading'); }, 220);
}

function highlightWord(charIndex){
  let activeIdx = -1;
  for(let k=0;k<wordSpans.length;k++){
    const start = parseInt(wordSpans[k].dataset.start,10);
    if(start <= charIndex) activeIdx = k; else break;
  }
  wordSpans.forEach((el,idx)=>{
    el.classList.toggle('active', idx===activeIdx);
    el.classList.toggle('said', idx<activeIdx);
  });
  if(activeIdx>=0 && wordSpans[activeIdx].scrollIntoView){
    wordSpans[activeIdx].scrollIntoView({block:'nearest', behavior:'smooth'});
  }
}

function speakCurrent(){
  const rate = parseFloat(speedSelect.value) || 1;
  if(!('speechSynthesis' in window)){
    const words = slides[current].narration.split(/\\s+/).length;
    const ms = (words/(150*rate))*60000;
    clearTimeout(fallbackHandle);
    fallbackHandle = setTimeout(()=>{ if(playing) advance(); }, ms);
    return;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(slides[current].narration);
  const wanted = voices.find(v => v.name === voiceSelect.value);
  if(wanted) u.voice = wanted; else if(chosenVoice) u.voice = chosenVoice;
  u.rate = rate; u.pitch = 1;
  u.onboundary = (e) => { if(e.name === 'word' || e.charIndex !== undefined) highlightWord(e.charIndex); };
  u.onend = () => { if(playing) advance(); };
  speechSynthesis.speak(u);
}
function stopSpeech(){
  if('speechSynthesis' in window) speechSynthesis.cancel();
  clearTimeout(fallbackHandle);
}
function advance(){
  if(current < slides.length - 1){
    renderSlide(current + 1);
    setTimeout(speakCurrent, 230);
  } else {
    playing = false;
    playBtn.textContent = '▶ Play';
    try {
      window.parent.postMessage({ type: 'LECTURE_COMPLETED' }, '*');
    } catch(e){}
  }
}
function play(){ playing = true; playBtn.textContent = '⏸ Pause'; speakCurrent(); }
function pause(){ playing = false; playBtn.textContent = '▶ Play'; stopSpeech(); wordSpans.forEach(el=>el.classList.remove('active')); }

playBtn.addEventListener('click', () => { playing ? pause() : play(); });
nextBtn.addEventListener('click', () => { stopSpeech(); if(current < slides.length-1){ renderSlide(current+1); if(playing) setTimeout(speakCurrent,230); } });
prevBtn.addEventListener('click', () => { stopSpeech(); if(current > 0){ renderSlide(current-1); if(playing) setTimeout(speakCurrent,230); } });
restartBtn.addEventListener('click', () => { stopSpeech(); renderSlide(0); if(playing) setTimeout(speakCurrent,230); });
speedSelect.addEventListener('change', () => { if(playing) speakCurrent(); });
voiceSelect.addEventListener('change', () => { chosenVoice = voices.find(v=>v.name===voiceSelect.value) || chosenVoice; if(playing) speakCurrent(); });
fullscreenBtn.addEventListener('click', () => {
  const frame = document.getElementById('frame');
  if(!document.fullscreenElement){ frame.requestFullscreen?.(); }
  else { document.exitFullscreen?.(); }
});
document.addEventListener('keydown', (e) => {
  if(!cover.classList.contains('hidden')) return;
  if(e.code === 'Space'){ e.preventDefault(); playing ? pause() : play(); }
  else if(e.code === 'ArrowRight'){ nextBtn.click(); }
  else if(e.code === 'ArrowLeft'){ prevBtn.click(); }
  else if(e.code === 'KeyF'){ fullscreenBtn.click(); }
});
beginBtn.addEventListener('click', () => {
  cover.classList.add('hidden');
  play();
});

renderSlide(0, true);
</script>
</body>
</html>`;

  const htmlContent = lectureNumber === 2 ? getLecture2HTML() : getLecture1HTML();

  return (
    <div className="w-full bg-[#0A2118] rounded-xl overflow-hidden shadow-2xl border border-[#E6CB86]/20">
      <iframe
        ref={iframeRef}
        title={`Keraleeya Panchakarma Masterclass Lecture ${lectureNumber}`}
        srcDoc={htmlContent}
        className="w-full h-[640px] border-0"
        allow="fullscreen; autoplay"
      />
    </div>
  );
};
