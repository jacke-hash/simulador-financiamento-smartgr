/* ── Update display produto ─────────────────────── */
function updProd(prod,i){
  const s=S.sims[prod]||{vc:0,en:0};
  const c=calc(prod);
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  const pct=s.vc>0?(s.en/s.vc*100).toFixed(1):0;
  set('rp'+i,fBRL(c.p)); set('rvp'+i,fBRL(c.vp)); set('rtot'+i,fBRL(c.tot)); set('rvc'+i,fBRL(s.vc));
  const h=document.getElementById('enhint'+i);
  if(h){if(s.vc>0&&s.en>0){h.textContent=`Entrada: ${fBRL(s.en)} (${pct}% do valor)`;h.style.display='block';}else h.style.display='none';}
}

function syncEntradaDOM(prod,i){
  const s=S.sims[prod]; if(!s) return;
  const el=document.getElementById('ien'+i); if(!el) return;
  const pct=s.vc>0?(s.en/s.vc*100):0;
  el.value=(s.enMode==='pct')?fPct(pct):fFmt(s.en);
}

/* ── HTML: card simulação produto ──────────────── */
function psHTML(prod,i){
  const s=S.sims[prod]||{vc:0,en:0,enMode:'brl',enPct:30};
  const c=calc(prod);
  const enMode=s.enMode||'brl';
  const pctReal=s.vc>0?(s.en/s.vc*100):0;
  const enVal=enMode==='brl'?fFmt(s.en):fPct(pctReal);
  const hintTxt=s.vc>0&&s.en>0?`Entrada: ${fBRL(s.en)} (${pctReal.toFixed(1)}% do valor)`:'';
  return`<div class="psim">
    <div class="psnm">${prod}</div>
    <div class="r2">
      <div class="fld">
        <label class="lbl">Valor da Compra (R$)</label>
        <input class="inp" id="ivc${i}" placeholder="Ex: 164.900,00" value="${fFmt(s.vc)}" inputmode="decimal">
        ${S.err['vc'+i]?`<div class="err">${S.err['vc'+i]}</div>`:''}
      </div>
      <div class="fld">
        <label class="lbl">Entrada (mín. 30%)</label>
        <div class="en-group">
          <select class="en-type" id="ienmode${i}">
            <option value="brl"${enMode==='brl'?' selected':''}>R$</option>
            <option value="pct"${enMode==='pct'?' selected':''}>%</option>
          </select>
          <input class="en-inp" id="ien${i}" placeholder="${enMode==='brl'?'0,00':'30,0'}" value="${enVal}" inputmode="decimal">
        </div>
        <div class="en-hint" id="enhint${i}" style="display:${hintTxt?'block':'none'}">${hintTxt}</div>
      </div>
    </div>
    <div class="pbig">
      <div class="pbl">Valor da Parcela</div>
      <div class="pbv" id="rp${i}">${fBRL(c.p)}</div>
      <div class="pbs">${S.prazo}x · TC 1,89% a.m. · Carência ${S.car} dias</div>
    </div>
    <div class="rg">
      <div class="rc"><div class="rcl">Valor Parcelado</div><div class="rcv" id="rvp${i}">${fBRL(c.vp)}</div></div>
      <div class="rc"><div class="rcl">Total Pago</div><div class="rcv" id="rtot${i}">${fBRL(c.tot)}</div></div>
      <div class="rc hi" style="grid-column:span 2"><div class="rcl">Total com Entrada</div><div class="rcv" id="rvc${i}">${fBRL(s.vc)}</div></div>
    </div>
  </div>`;
}

/* ── HTML: Step 1 ───────────────────────────────── */
function s1HTML(){
  const hasErr=!!S.err.emailVend;
  return`<div class="card">
    <div class="email-hero">
      <div class="email-icon">✉️</div>
      <div class="email-title">Identificação</div>
      <div class="email-sub">Informe seu e-mail para registrar<br>a simulação corretamente.</div>
    </div>
    <div class="fld">
      <label class="lbl">Seu E-mail</label>
      <input class="inp${hasErr?' invalid':''}" id="iemailVend"
        type="email" placeholder="vendedor@smartgr.com.br"
        value="${S.emailVend}" autocomplete="email" inputmode="email">
      ${hasErr?`<div class="err">${S.err.emailVend}</div>`:''}
    </div>
    <button class="btn" id="bnxt1">Iniciar Simulação →</button>
  </div>`;
}

/* ── HTML: Step 2 ───────────────────────────────── */
function s2HTML(){
  return `
  <div class="card">
    <div class="ct">
      Equipamentos
      <span style="color:${S.prods.length ? 'var(--primary)' : 'var(--border2)'}">
        ${S.prods.length}/3 selecionados
      </span>
    </div>

    <div class="pgrid">
      ${PRODS.map(p => {

        const sl = S.prods.includes(p.nome);
        const ds = !sl && S.prods.length >= 3;

        return `
          <div
            class="pc${sl ? ' sl' : ''}${ds ? ' ds' : ''}"
            data-tp="${p.nome}"
          >

            <img
              src="${p.imagem}"
              alt="${p.nome}"
              class="pcimg"
            >

            <div class="pck">
              ${sl ? '✓' : ''}
            </div>

            <div class="pcn">
              ${p.nome}
            </div>

          </div>
        `;

      }).join('')}
    </div>

    <div class="phint">
      ${
        S.prods.length === 0
          ? 'Selecione até 3 equipamentos para simular'
          : S.prods.length < 3
            ? `${S.prods.map(p=>`<em>${p}</em>`).join(' + ')} — pode adicionar mais ${3 - S.prods.length}`
            : S.prods.map(p=>`<em>${p}</em>`).join(' + ')
      }
    </div>

    ${
      S.err.prods
        ? `<div class="err" style="margin-top:8px">${S.err.prods}</div>`
        : ''
    }
  </div>

  ${S.prods.length > 0 ? `
    <div class="simsh">
      <div class="ct">
        Condições do Financiamento
        <span class="tcpill">TC 1,89% a.m.</span>
      </div>

      <div class="r2">
        <div class="fld">
          <label class="lbl">Prazo</label>
          <select class="inp" id="iprazo">
            ${PZS.map(p => `
              <option value="${p}" ${S.prazo === p ? 'selected' : ''}>
                ${p}x
              </option>
            `).join('')}
          </select>
        </div>

        <div class="fld">
          <label class="lbl">Carência 1º Vcto</label>
          <select class="inp" id="icar">
            ${CRS.map(c => `
              <option value="${c}" ${S.car === c ? 'selected' : ''}>
                ${c} dias
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    </div>

    ${S.prods.map((p,i)=>psHTML(p,i)).join('')}
  ` : ''}

  <div class="brow">
    <button class="btnb" id="bbk2">← Voltar</button>
    <button class="btn" id="bnxt2">Continuar para Cadastro →</button>
  </div>
  `;
}
/* ── HTML: Profissão / Investidor (Feature 3) ────── */
function profissaoHTML(){
  const p=findProfissao(S.profissao);
  const showConselho=p&&p.conselho&&p.conselho!=='opcional';
  const showLivre=p&&p.conselho==='opcional';
  return`<div class="card">
    <div class="ct">Profissão / Perfil</div>
    <div class="fld">
      <label class="lbl">Profissão</label>
      <select class="inp" id="iprofissao">
        <option value=""${!S.profissao?' selected':''}>Selecione...</option>
        ${PROFISSOES.map(pr=>`<option value="${pr.value}"${S.profissao===pr.value?' selected':''}>${pr.label}</option>`).join('')}
      </select>
      ${S.err.profissao?`<div class="err">${S.err.profissao}</div>`:''}
    </div>
    ${showConselho?`
    <div class="r2">
      <div class="fld">
        <label class="lbl">Conselho</label>
        <input class="inp" value="${p.conselho}" readonly disabled>
      </div>
      <div class="fld">
        <label class="lbl">Registro</label>
        <input class="inp" id="iregistroConselho" placeholder="Número do registro" value="${S.registroConselho}">
        ${S.err.registroConselho?`<div class="err">${S.err.registroConselho}</div>`:''}
      </div>
    </div>
    <div class="fld">
      <label class="lbl">${p.jurisdicao==='estadual'?'UF':'Região'}</label>
      <select class="inp" id="iufRegiao">
        <option value=""${!S.ufRegiao?' selected':''}>Selecione...</option>
        ${(p.jurisdicao==='estadual'?UFS:regioes(p.regioes)).map(v=>{
          const label=p.jurisdicao==='estadual'?v:`Região ${v}`;
          return`<option value="${v}"${S.ufRegiao===v?' selected':''}>${label}</option>`;
        }).join('')}
      </select>
      ${S.err.ufRegiao?`<div class="err">${S.err.ufRegiao}</div>`:''}
    </div>`:''}
    ${showLivre?`
    <div class="fld">
      <label class="lbl">Conselho (opcional)</label>
      <input class="inp" id="iregistroConselhoLivre" placeholder="Ex: Sindicato / Associação" value="${S.registroConselho}">
    </div>`:''}
  </div>`;
}

/* ── HTML: Observações ───────────────────────────── */
function observacaoHTML(){
  return`<div class="card">
    <div class="ct">Observações</div>
    <div class="fld">
      <textarea class="inp" id="iobservacao" rows="3" placeholder="Ex: local do cliente, evento de origem, contato preferencial, orçamento...">${escHtml(S.observacao)}</textarea>
    </div>
  </div>`;
}

/* ── HTML: Anexos (Feature 4) ────────────────────── */
function anexosHTML(){
  const item=(campo,label)=>{
    const st=S.uploadStatus[campo];
    const anexo=S.anexos[campo];
    const isDone=st==='done'&&anexo;
    const statusTxt=st==='uploading'?'Enviando...':st==='error'?'Erro no envio, tente novamente':'';

    if(isDone){
      return`<div class="fld">
        <label class="lbl">${label}</label>
        <div class="anexo-done">
          <span class="anexo-check">✓</span>
          <span class="anexo-nome">${anexo.nomeArquivo||'Arquivo enviado'}</span>
          <button type="button" class="anexo-trocar" data-campo="${campo}">Trocar</button>
        </div>
        <input class="inp-hidden" type="file" id="ifile${campo}" accept=".pdf,.jpg,.jpeg,.png" style="display:none">
      </div>`;
    }

    return`<div class="fld">
      <label class="lbl">${label}</label>
      <input class="inp" type="file" id="ifile${campo}" accept=".pdf,.jpg,.jpeg,.png">
      ${statusTxt?`<div class="en-hint" style="color:${st==='error'?'#e03535':'var(--text3)'}">${statusTxt}</div>`:''}
      ${S.err[campo]?`<div class="err">${S.err[campo]}</div>`:''}
    </div>`;
  };
  return`<div class="card">
    <div class="ct">Documentos</div>
    ${item('comprovanteRenda','Comprovante de Renda (últimos 90 dias)')}
    ${item('declaracaoIR','Declaração de Imposto de Renda')}
  </div>`;
}

/* ── HTML: Step 3 ───────────────────────────────── */
function s3HTML(){
  const isCNPJ = S.tipoDoc === 'CNPJ';
  const dataLabel = isCNPJ ? 'Data de Abertura' : 'Data de Nascimento';
  const dataMax   = isCNPJ ? '' : `max="${new Date().toISOString().split('T')[0]}"`;

  const resumo=S.prods.map((prod,idx)=>{
    const c=calc(prod);
    const nm=prod.split('—')[0].trim();
    return`${idx>0?'<div class="resumo-div"></div>':''}<div class="resumo-item"><span>${nm}</span><strong>${fBRL(c.p)} · ${S.prazo}x</strong></div>`;
  }).join('');

  return`<div class="resumo-bar">${resumo}</div>
  <div class="vend-chip"><span>✉️</span>${S.emailVend}</div>
  <div class="card">
    <div class="ct">${S.analiseNoNome==='fiador'?'Dados do Fiador':'Dados do Cliente'}</div>
    <div class="fld">
      <label class="lbl">Em nome de quem será esta análise de crédito?</label>
      <select class="inp" id="ianaliseNoNome">
        <option value=""${!S.analiseNoNome?' selected':''}>Selecione...</option>
        <option value="proprio"${S.analiseNoNome==='proprio'?' selected':''}>Em nome do cliente</option>
        <option value="fiador"${S.analiseNoNome==='fiador'?' selected':''}>Em nome do fiador</option>
      </select>
      ${S.err.analiseNoNome?`<div class="err">${S.err.analiseNoNome}</div>`:''}
    </div>
    ${S.analiseNoNome?`<div style="animation:fi .22s ease">
    <div class="fld">
      <label class="lbl">${S.tipoDoc}</label>
      <div class="doc-row">
        <div class="doc-select-wrap">
          <select class="doc-select" id="itipoDoc">
            <option value="CPF"${S.tipoDoc==='CPF'?' selected':''}>CPF</option>
            <option value="CNPJ"${S.tipoDoc==='CNPJ'?' selected':''}>CNPJ</option>
          </select>
        </div>
        <input class="inp" id="idoc"
          placeholder="${S.tipoDoc==='CPF'?'000.000.000-00':'00.000.000/0000-00'}"
          value="${S.doc}" maxlength="${S.tipoDoc==='CPF'?14:18}" inputmode="numeric">
      </div>
      ${S.err.doc?`<div class="err">${S.err.doc}</div>`:''}
    </div>
    <div class="r2">
      <div class="fld">
        <label class="lbl">Telefone</label>
        <input class="inp" id="itel"
          placeholder="(00) 00000-0000"
          value="${S.tel}" maxlength="15" inputmode="numeric">
        ${S.err.tel?`<div class="err">${S.err.tel}</div>`:''}
      </div>
      <div class="fld">
        <label class="lbl">${dataLabel}</label>
        <input class="inp" id="inasc" type="date" value="${S.nasc}" ${dataMax}>
        ${S.err.nasc?`<div class="err">${S.err.nasc}</div>`:''}
      </div>
    </div>
    <div class="r2">
      <div class="fld"><label class="lbl">CEP</label>
        <input class="inp" id="icep" placeholder="00000-000" value="${S.cep}" maxlength="9">
        ${S.err.cep?`<div class="err">${S.err.cep}</div>`:''}
      </div>
      <div class="fld"><label class="lbl">Número da Residência</label>
        <input class="inp" id="inumero" placeholder="Ex: 123" value="${S.numero}">
        ${S.err.numero?`<div class="err">${S.err.numero}</div>`:''}
      </div>
    </div>
    <div class="r2">
      <div class="fld"><label class="lbl">UF</label>
        <select class="inp" id="iuf">
          <option value=""${!S.uf?' selected':''}>Selecione...</option>
          ${UFS.map(u=>`<option value="${u}"${S.uf===u?' selected':''}>${u}</option>`).join('')}
        </select>
        ${S.err.uf?`<div class="err">${S.err.uf}</div>`:''}
      </div>
      <div class="fld"><label class="lbl">Cidade</label>
        <select class="inp" id="icidade" ${(!S.uf||S.carregandoCidades)?'disabled':''}>
          <option value=""${!S.cidade?' selected':''}>${S.carregandoCidades?'Carregando...':'Selecione...'}</option>
          ${S.cidadesDisponiveis.map(c=>`<option value="${c}"${S.cidade===c?' selected':''}>${c}</option>`).join('')}
        </select>
        ${S.err.cidade?`<div class="err">${S.err.cidade}</div>`:''}
      </div>
    </div>
    </div>`:''}
    <div class="fld"><label class="lbl">Vendedor</label>
      <input class="inp" id="ivend" placeholder="Nome do vendedor" value="${S.vend}">
      ${S.err.vend?`<div class="err">${S.err.vend}</div>`:''}
    </div>
  </div>
  ${profissaoHTML()}
  ${observacaoHTML()}
  ${anexosHTML()}
  <div class="brow">
    <button class="btnb" id="bbk3">← Voltar</button>
    <button class="btn btn-accent" id="bsv" ${S.busy?'disabled':''}>
      ${S.busy?'Enviando análise...':`📋 Análise de Crédito${S.prods.length>1?' ('+S.prods.length+')':''}`}
    </button>
  </div>`;
}

/* ── HTML: Step 4 — Confirmação ──────────────────── */
function s4HTML(){
  return`<div class="card">
    <div class="email-hero">
      <div class="email-icon" style="background:rgba(22,163,74,.12);color:#16a34a">✓</div>
      <div class="email-title">Análise enviada com sucesso</div>
      <div class="email-sub">Aguarde o retorno da nossa equipe</div>
    </div>
    <button class="btn" id="bnova">Fazer nova simulação</button>
  </div>`;
}

/* ── Render ─────────────────────────────────────── */
function render(){
  const n=S.scr;
  document.getElementById('app').innerHTML=`
  <div class="hdr">
    <div class="hdr-logo">Smart GR<span>Simulador de Financiamento</span></div>
  </div>
  ${n<=3?`<div class="stps">
    <div class="stp${n===1?' on':' ok'}">① Acesso${n>1?' ✓':''}</div>
    <div class="stp${n===2?' on':n>2?' ok':''}">② Simulação${n>2?' ✓':''}</div>
    <div class="stp${n===3?' on':''}">③ Cadastro</div>
  </div>`:''}
  <div class="wrap">${n===1?s1HTML():n===2?s2HTML():n===3?s3HTML():s4HTML()}</div>
  ${S.toast?`<div class="toast ${S.toast.tipo}">${S.toast.msg}</div>`:''}`;
  if(n===1) bind1();
  else if(n===2) bind2();
  else if(n===3) bind3();
  else bind4();
}
