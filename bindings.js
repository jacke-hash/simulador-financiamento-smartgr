/* ── Bind Step 1 ────────────────────────────────── */
function bind1(){
  const el=document.getElementById('iemailVend');
  if(el){
    el.oninput=e=>{S.emailVend=e.target.value;};
    el.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(val1()){S.scr=2;S.err={};render();}}};
  }
  document.getElementById('bnxt1').onclick=()=>{if(val1()){S.scr=2;S.err={};render();}else render();};
}

/* ── Bind Step 2 ────────────────────────────────── */
function bind2(){
  document.querySelectorAll('.pc[data-tp]').forEach(el=>el.onclick=()=>togP(el.dataset.tp));
  const prazoEl=document.getElementById('iprazo');
  const carEl  =document.getElementById('icar');
  if(prazoEl) prazoEl.onchange=e=>{S.prazo=parseInt(e.target.value);render()};
  if(carEl)   carEl.onchange  =e=>{S.car  =parseInt(e.target.value);render()};

  S.prods.forEach((prod,i)=>{
    if(!S.sims[prod]) S.sims[prod]={vc:0,en:0,enMode:'brl',enPct:20};
    const s=S.sims[prod];
    const vcEl  =document.getElementById('ivc'+i);
    const enEl  =document.getElementById('ien'+i);
    const modeEl=document.getElementById('ienmode'+i);

    if(vcEl){
      vcEl.oninput=e=>{
        s.vc=parsePT(e.target.value);
        if(s.enMode==='pct'){
          s.enPct=Math.max(20,Math.min(100,s.enPct||20));
          s.en=s.vc*(s.enPct/100);
          syncEntradaDOM(prod,i);
        } else if(s.en===0&&s.vc>0){
          s.en=s.vc*0.20; s.enPct=20; syncEntradaDOM(prod,i);
        }
        updProd(prod,i);
      };
      vcEl.onblur=()=>{aplicarEntradaMinima(prod);syncEntradaDOM(prod,i);updProd(prod,i);};
    }

    if(modeEl){
      modeEl.onchange=e=>{
        s.enMode=e.target.value;
        if(s.enMode==='pct'){
          s.enPct=s.vc>0?(s.en/s.vc*100):20;
          s.enPct=Math.max(20,Math.min(100,s.enPct));
          s.en=s.vc*(s.enPct/100);
        } else {
          if(s.enPct<20) s.enPct=20;
          s.en=s.vc*(s.enPct/100);
        }
        syncEntradaDOM(prod,i);updProd(prod,i);
      };
    }

    if(enEl){
      enEl.oninput=e=>{
        const raw=parsePT(e.target.value);
        if(s.enMode==='pct'){
          const clamped=Math.max(0,Math.min(100,raw));
          s.enPct=clamped;
          s.en=s.vc*(clamped/100);
        } else {
          const maxAllowed=s.vc>0?s.vc:Infinity;
          s.en=Math.min(raw,maxAllowed);
          s.enPct=s.vc>0?(s.en/s.vc*100):0;
        }
        updProd(prod,i);
      };
      enEl.onblur=()=>{
        aplicarEntradaMinima(prod);
        syncEntradaDOM(prod,i);
        updProd(prod,i);
      };
    }
  });

  document.getElementById('bbk2').onclick=()=>{S.scr=1;S.err={};render()};
  document.getElementById('bnxt2').onclick=()=>{if(val2()){S.scr=3;S.err={};render();}else render();};
}

/* ── Bind Step 3 ────────────────────────────────── */
function bind3(){
  /* ── Em nome de quem (Feature 2) ────────────────── */
  document.getElementById('ianaliseNoNome').onchange=e=>{S.analiseNoNome=e.target.value;S.err={};render()};

  /* campos abaixo só existem no DOM depois de analiseNoNome escolhido */
  const tipoDocEl=document.getElementById('itipoDoc');
  const docEl    =document.getElementById('idoc');
  const telEl    =document.getElementById('itel');
  const cepEl    =document.getElementById('icep');
  const nascEl   =document.getElementById('inasc');
  const numeroEl =document.getElementById('inumero');
  const ufEl2    =document.getElementById('iuf');
  const cidadeEl =document.getElementById('icidade');
  if(tipoDocEl) tipoDocEl.onchange=e=>{S.tipoDoc=e.target.value;S.doc='';S.nasc='';S.err.doc='';S.err.nasc='';render()};
  if(docEl)     docEl.oninput    =e=>{S.doc=mDoc(e.target.value,S.tipoDoc);e.target.value=S.doc};
  if(telEl)     telEl.oninput    =e=>{S.tel=mTel(e.target.value);e.target.value=S.tel}; // ← usa nova mTel
  if(cepEl)     cepEl.oninput    =e=>{S.cep=mCEP(e.target.value);e.target.value=S.cep};
  if(nascEl)    nascEl.onchange  =e=>{S.nasc=e.target.value};
  if(numeroEl)  numeroEl.oninput =e=>{S.numero=e.target.value};
  if(ufEl2)     ufEl2.onchange   =e=>{carregarCidades(e.target.value)};
  if(cidadeEl)  cidadeEl.onchange=e=>{S.cidade=e.target.value};

  document.getElementById('ivend').oninput   =e=>{S.vend=e.target.value};

  /* ── Observações (opcional) ─────────────────────── */
  const obsEl=document.getElementById('iobservacao');
  if(obsEl) obsEl.oninput=e=>{S.observacao=e.target.value};

  /* ── Profissão / Investidor (Feature 3) ────────── */
  document.getElementById('iprofissao').onchange=e=>{
    S.profissao=e.target.value;
    S.registroConselho='';S.ufRegiao='';
    S.err.profissao='';S.err.registroConselho='';S.err.ufRegiao='';
    render();
  };
  const regEl =document.getElementById('iregistroConselho');
  const regLivreEl=document.getElementById('iregistroConselhoLivre');
  const ufEl  =document.getElementById('iufRegiao');
  if(regEl)      regEl.oninput      =e=>{S.registroConselho=e.target.value};
  if(regLivreEl) regLivreEl.oninput =e=>{S.registroConselho=e.target.value};
  if(ufEl)       ufEl.onchange      =e=>{S.ufRegiao=e.target.value};

  /* ── Anexos (Feature 4) ─────────────────────────── */
  ['comprovanteRenda','declaracaoIR'].forEach(campo=>{
    const el=document.getElementById('ifile'+campo);
    if(el) el.onchange=e=>{
      const file=e.target.files[0];
      if(!file) return;
      const cpf=S.doc.replace(/\D/g,'')||'pendente';
      uploadAnexo(cpf,campo,file);
    };
  });
  document.querySelectorAll('.anexo-trocar').forEach(btn=>{
    btn.onclick=()=>{
      const campo=btn.dataset.campo;
      S.uploadStatus[campo]='idle';
      S.anexos[campo]=null;
      render();
    };
  });

  document.getElementById('bbk3').onclick    =()=>{S.scr=2;S.err={};render()};
  document.getElementById('bsv').onclick     =()=>{if(val3()) save(); else render();};
}
