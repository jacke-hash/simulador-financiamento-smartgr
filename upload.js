/* ── Upload de Anexos (Feature 4) ────────────────── */
/* TODO: apontar para o domínio real do Worker após o deploy (custom domain ou *.workers.dev) */
const UPLOAD_URL = "https://smartgr-upload-anexos-financiamento.SEU_SUBDOMINIO.workers.dev/upload";

function uploadAnexo(cpf,campo,file){
  const tipoWorker = campo==='comprovanteRenda' ? 'comprovante-renda' : 'declaracao-ir';
  S.uploadStatus[campo]='uploading'; render();

  const fd=new FormData();
  fd.append('cpf',cpf);
  fd.append('tipo',tipoWorker);
  fd.append('arquivo',file);

  fetch(UPLOAD_URL,{method:'POST',body:fd})
    .then(r=>r.json())
    .then(res=>{
      if(res.ok){
        S.anexos[campo]={url:res.url,nomeArquivo:file.name};
        S.uploadStatus[campo]='done';
      }else{
        S.anexos[campo]=null;
        S.uploadStatus[campo]='error';
      }
      render();
    })
    .catch(()=>{
      S.anexos[campo]=null;
      S.uploadStatus[campo]='error';
      render();
    });
}
