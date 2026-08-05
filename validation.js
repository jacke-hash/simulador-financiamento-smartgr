/* ── Validações ─────────────────────────────────── */
function val1(){
  const e={};
  if(!S.emailVend.trim()) e.emailVend='Informe seu e-mail para continuar';
  else if(!validEmail(S.emailVend)) e.emailVend='E-mail inválido';
  S.err=e; return !Object.keys(e).length;
}
function val2(){
  const e={};
  if(!S.prods.length) e.prods='Selecione ao menos 1 equipamento';
  S.prods.forEach((prod,i)=>{const s=S.sims[prod]||{};if(!s.vc||s.vc<=0) e['vc'+i]='Informe o valor da compra';});
  S.err=e; return !Object.keys(e).length;
}
function val3(){
  const e={};

  if(!S.analiseNoNome) e.analiseNoNome='Selecione em nome de quem será a análise';
  else{
    const dl=S.doc.replace(/\D/g,'');
    if(S.tipoDoc==='CPF'&&dl.length<11)  e.doc='CPF inválido';
    if(S.tipoDoc==='CNPJ'&&dl.length<14) e.doc='CNPJ inválido';
    if(!validTel(S.tel)) e.tel='Telefone inválido (DDD + 8 ou 9 dígitos)'; // ← FIX
    if(!S.nasc) e.nasc=S.tipoDoc==='CPF'?'Data de nascimento obrigatória':'Data de abertura obrigatória';
    if(S.cep.replace(/\D/g,'').length<8) e.cep='CEP inválido';
    if(!S.numero.trim()) e.numero='Obrigatório';
  }

  if(!S.vend.trim())   e.vend='Obrigatório';

  if(!S.profissao) e.profissao='Selecione uma opção';
  else{
    const p=findProfissao(S.profissao);
    if(p&&p.conselho&&p.conselho!=='opcional'){
      if(!S.registroConselho.trim()) e.registroConselho='Obrigatório';
      if(!S.ufRegiao)                e.ufRegiao='Obrigatório';
    }
  }

  if(!S.anexos.comprovanteRenda) e.comprovanteRenda='Envie o comprovante de renda';
  if(!S.anexos.declaracaoIR)     e.declaracaoIR='Envie a declaração de IR';

  S.err=e; return !Object.keys(e).length;
}
