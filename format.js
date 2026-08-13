/* ── Formatação ─────────────────────────────────── */
const fBRL = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const fFmt = v => v>0 ? v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}) : '';
const fPct = v => v>0 ? v.toFixed(1).replace('.',',') : '';

function parsePT(v){
  const c=v.replace(/[^\d,.]/g,''); if(!c) return 0;
  return c.includes(',') ? parseFloat(c.replace(/\./g,'').replace(',','.'))||0 : parseFloat(c.replace(/\./g,''))||0;
}

function validEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())}

function escHtml(v){
  return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── Máscaras ───────────────────────────────────── */
function mDoc(v,tipo){
  const d=v.replace(/\D/g,'');
  if(tipo==='CPF'){const s=d.slice(0,11);return s.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');}
  const s=d.slice(0,14);return s.replace(/(\d{2})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1/$2').replace(/(\d{4})(\d{1,2})$/,'$1-$2');
}

/* ── FIX TELEFONE: detecta fixo (8 dígitos) ou celular (9 dígitos) ── */
function mTel(v){
  const d=v.replace(/\D/g,'').slice(0,11);
  if(!d) return '';
  if(d.length<=2)  return `(${d}`;
  if(d.length<=6)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if(d.length<=10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;  // fixo: (XX) XXXX-XXXX
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;                    // celular: (XX) XXXXX-XXXX
}

/* ── FIX TELEFONE: valida fixo (10 dígitos) ou celular (11 dígitos) ── */
function validTel(v){
  const d=v.replace(/\D/g,'');
  return d.length===10 || d.length===11;
}

function mCEP(v){const d=v.replace(/\D/g,'').slice(0,8);return d.length>5?`${d.slice(0,5)}-${d.slice(5)}`:d}
