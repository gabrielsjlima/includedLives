/* API real: nenhum dado de conta, vaga ou candidatura é armazenado no navegador. */
window.ILives = {
 csrf: null,
 async request(path, method='GET', body) {
  const headers = {};
  if (body !== undefined) headers['Content-Type']='application/json';
  if (this.csrf && !['GET','HEAD'].includes(method)) headers['X-CSRF-Token']=this.csrf;
  const response=await fetch('/api'+path,{method,headers,credentials:'same-origin',body:body===undefined?undefined:JSON.stringify(body)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.erro || (response.status===401?'Faça login para continuar.':'Falha na operação ('+response.status+').'));
  return data;
 },
 async auth(tipo) {
  const me=await this.request('/me');this.csrf=me.csrf;
  if(tipo && me.tipo!==tipo) throw new Error('Acesso não autorizado para este perfil.');
  return me;
 },
 async logout(){await this.request('/logout','POST');location.href='/login/login.html';}
};
