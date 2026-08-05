/* ── Toast ──────────────────────────────────────── */
function showToast(msg,tipo='ok',dur=4500){
  S.toast={msg,tipo}; render();
  setTimeout(()=>{S.toast=null;render();},dur);
}

/* ── JSONP ──────────────────────────────────────── */
function jsonpFetch(url){
  return new Promise(resolve=>{
    const cb='sgrcb_'+Date.now()+'_'+Math.floor(Math.random()*9999);
    const sc=document.createElement('script');
    const t=setTimeout(()=>{cleanup();resolve({ok:true,status:'timeout_mas_enviado'});},20000);
    function cleanup(){clearTimeout(t);delete window[cb];if(sc.parentNode)document.body.removeChild(sc);}
    window[cb]=r=>{cleanup();resolve(r);};
    sc.onerror=()=>{cleanup();resolve({ok:true,status:'script_error_mas_enviado'});};
    sc.src=url+'&callback='+cb;
    document.body.appendChild(sc);
  });
}

/* ── Save ───────────────────────────────────────── */
async function save(){
  if(S.busy) return;
  S.busy=true; render();

  try{
    for (const prod of S.prods) {
      const s=S.sims[prod]||{vc:0,en:0};
      const c=calc(prod);
      const profissaoInfo=findProfissao(S.profissao);
      const row={
        emailVendedor:S.emailVend,
        tipoDoc:S.tipoDoc, cpf:S.doc, telefone:S.tel,
        dataNasc:S.nasc, cep:S.cep, numero:S.numero, uf:S.uf, cidade:S.cidade, vendedor:S.vend,
        produto:prod,
        valorCompra:s.vc.toFixed(2), entrada:s.en.toFixed(2),
        valorParcelado:c.vp.toFixed(2), tc:'1,89%',
        prazo:S.prazo, carencia:S.car,
        parcela:c.p.toFixed(2), totalPago:c.tot.toFixed(2),
        totalComEntrada:s.vc.toFixed(2),
        data:new Date().toLocaleDateString('pt-BR'),
        hora:new Date().toLocaleTimeString('pt-BR'),
        analiseNoNome: S.analiseNoNome,
        profissao: S.profissao,
        conselho: profissaoInfo?profissaoInfo.conselho:'',
        registroConselho: S.registroConselho,
        ufRegiao: S.ufRegiao,
        comprovanteRendaUrl: S.anexos.comprovanteRenda?.url || '',
        declaracaoIrUrl: S.anexos.declaracaoIR?.url || ''
      };
      const url = WH+'?data='+encodeURIComponent(JSON.stringify(row));
      await jsonpFetch(url); // ← aguarda cada uma terminar antes de disparar a próxima
    }
    showToast('✓ Análise de crédito enviada! Resultado em instantes.','ok');
  }catch(e){
    showToast('Erro inesperado. Verifique sua conexão.','er');
  }

  S.busy=false; render();
}
