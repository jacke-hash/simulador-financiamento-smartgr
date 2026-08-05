/* ── Estado global e constantes ─────────────────── */
const TC    = 0.0189;
const WH    = "https://script.google.com/macros/s/AKfycby1PYYPCI9mHfx-vV5Y6UmW-Ls6ueurCa7kyzK7Mzhf2xfVt1KeAV6AAl2HPk_rwWK1eA/exec";
const PRODS = [
  {
    nome: "Smart Maximus Lift 2 — RF Microagulhada + Ultrassom",
    imagem: "https://smartgr-atacado-526075146803-sa-east-1-an.s3.sa-east-1.amazonaws.com/imagens-equipamentos/Maximus_Lift.jpg"
  },
  {
    nome: "Smart Deep Laser 46W (980 + 1470nm) Endolaser",
    imagem: "https://smartgr-atacado-526075146803-sa-east-1-an.s3.sa-east-1.amazonaws.com/imagens-equipamentos/SmartDeepLaser15W1.jpg"
  },
  {
    nome: "Smart Maximus Plasma — Frio e Quente",
    imagem: "https://smartgr-atacado-526075146803-sa-east-1-an.s3.sa-east-1.amazonaws.com/imagens-equipamentos/img_plasma_ecom.png"
  },
  {
    nome: "Smart Deep Laser 15W — 1470nm (Endolaser)",
    imagem: "https://smartgr-atacado-526075146803-sa-east-1-an.s3.sa-east-1.amazonaws.com/imagens-equipamentos/SmartDeepLaser15W1_1e88c921-8ce2-447f-a43d-f825737f35fe.jpg"
  },
  {
    nome: "Smart Multi HIFU — Ultrassom Macro e Microfocado",
    imagem: "https://smartgr-atacado-526075146803-sa-east-1-an.s3.sa-east-1.amazonaws.com/imagens-equipamentos/SmartMultiHIFUUltrassomMacroeMicrofocadoIntermediario_SmartGR1.jpg"
  },
  {
    nome: "Smart Meso Pro — Mesoterapia por Eletroporação",
    imagem: "https://smartgr-atacado-526075146803-sa-east-1-an.s3.sa-east-1.amazonaws.com/imagens-equipamentos/smartmesopro_1.png"
  },
  {
    nome: "Fraxion — Laser de CO₂ Fracionado e Não Fracionado com Microcoring",
    imagem: "https://smartgr-atacado-526075146803-sa-east-1-an.s3.sa-east-1.amazonaws.com/imagens-equipamentos/1_a2310b98-cfa4-4d9d-b0df-440b3875dd81.png"
  }
];
const PZS = Array.from({length: 22}, (_, i) => i + 3); // [3,4,5,...,24]
const CRS = [30,60,90];

/* ── Profissão / Investidor ──────────────────────── */
const PROFISSOES = [
  { value: 'biomedico',       label: 'Biomédico(a)',                 conselho: 'CRBM',  jurisdicao: 'regional', regioes: 7 },
  { value: 'dentista',        label: 'Dentista',                     conselho: 'CRO',   jurisdicao: 'estadual' },
  { value: 'enfermeiro',      label: 'Enfermeiro(a)',                conselho: 'Coren', jurisdicao: 'estadual' },
  { value: 'esteticista',     label: 'Esteticista e Cosmetólogo(a)', conselho: null },
  { value: 'farmaceutico',    label: 'Farmacêutico(a)',              conselho: 'CRF',   jurisdicao: 'estadual' },
  { value: 'fisioterapeuta',  label: 'Fisioterapeuta',               conselho: 'CREFITO', jurisdicao: 'regional', regioes: 20 },
  { value: 'massoterapeuta',  label: 'Massoterapeuta',               conselho: null },
  { value: 'medico',          label: 'Médico(a)',                    conselho: 'CRM',   jurisdicao: 'estadual' },
  { value: 'tricologista',    label: 'Tricologista',                 conselho: null },
  { value: 'outras',          label: 'Outras formações',             conselho: 'opcional' },
  { value: 'investidor',      label: 'Investidor',                   conselho: null },
];

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

function findProfissao(value) {
  return PROFISSOES.find(p => p.value === value) ?? null;
}

async function carregarCidades(uf) {
  S.uf = uf; S.cidade = ''; S.cidadesDisponiveis = [];
  if (!uf) { render(); return; }
  S.carregandoCidades = true; render();
  try {
    const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    const data = await res.json();
    S.cidadesDisponiveis = data.map(m => m.nome).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  } catch (e) {
    S.cidadesDisponiveis = [];
    showToast('Erro ao carregar cidades. Tente novamente.', 'er');
  }
  S.carregandoCidades = false; render();
}
function regioes(n) {
  return Array.from({length: n}, (_, i) => String(i + 1));
}

let S = {
  scr: 1,
  emailVend: '',
  prods:[], sims:{}, prazo:21, car:30,
  tipoDoc:'CPF', doc:'', tel:'', nasc:'', cep:'', numero:'', vend:'',
  uf:'', cidade:'', cidadesDisponiveis:[], carregandoCidades:false,
  analiseNoNome: '', // '' | 'proprio' | 'fiador' — vazio força a seleção antes de mostrar os campos
  profissao:'', registroConselho:'', ufRegiao:'',
  anexos: { comprovanteRenda: null, declaracaoIR: null },
  uploadStatus: { comprovanteRenda: 'idle', declaracaoIR: 'idle' },
  err:{}, busy:false, toast:null
};
