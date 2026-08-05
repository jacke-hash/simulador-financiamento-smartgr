/* ── Cálculo ────────────────────────────────────── */
function calc(prod){
  const s=S.sims[prod]||{vc:0,en:0};
  const vp=Math.max(0,s.vc-s.en);
  const p=vp>0?vp*TC/(1-Math.pow(1+TC,-S.prazo)):0;
  return{vp, p, tot:p*S.prazo+s.en};
}

/* ── Entrada mínima 20% + máximo 100% ─────────── */
function aplicarEntradaMinima(prod){
  const s=S.sims[prod]; if(!s||s.vc<=0) return;
  const min=s.vc*0.20;
  const max=s.vc;
  if(s.en<min){ s.en=min; s.enPct=20; }
  if(s.en>max){ s.en=max; s.enPct=100; }
}

/* ── Toggle produto ─────────────────────────────── */
function togP(name){
  const i=S.prods.indexOf(name);
  if(i>=0){S.prods.splice(i,1);}
  else if(S.prods.length<3){S.prods.push(name);if(!S.sims[name])S.sims[name]={vc:0,en:0,enMode:'brl',enPct:20};}
  render();
}
