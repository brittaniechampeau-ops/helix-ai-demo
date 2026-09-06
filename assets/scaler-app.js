'use strict';
const M=window.SCALER_MODEL;
const SUPA_URL='https://ilhljjkiijmjpwinovzj.supabase.co';
const SUPA_KEY='sb_publishable_YwJQklAqVmSlgPbVMWQmqA_26HaKJik';
const supa=supabase.createClient(SUPA_URL,SUPA_KEY);
const store=DRIVE.createStore(supa,'scaler');
const rawSources=new Map();
let state=M.emptyState(), user=null;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random();
const qPrompt=()=>M.DIMENSIONS.flatMap(d=>d.questions.map(q=>`${q.id.toUpperCase()}: ${q.text}${q.reverse?' [reverse-scored]':''}`)).join('\n');

function notice(msg,type=''){$('globalNotice').innerHTML=msg?`<div class="notice ${type}">${esc(msg)}</div>`:'';}
function persistedState(){return {...state,sources:state.sources.map(({id,name,type,size,status,addedAt,analyzedAt,fromDiscover})=>({id,name,type,size,status,addedAt,analyzedAt,fromDiscover}))};}

async function init(){
  const {data:{session}}=await supa.auth.getSession();
  if(!session){location.href='/hub.html';return;}
  user=session.user;store.init(session);
  const ctx=await store.resolveContext(session);
  $('orgName').textContent=ctx.organizationName||'No active engagement';
  if(!ctx.engagementId){notice('Open an engagement from Hub before starting SCALER.','error');return;}
  const saved=await store.load('org_scaler');
  state=M.mergeState(saved);
  state.sources=(state.sources||[]).map(s=>({...s,status:s.analyzedAt?'analyzed':'reload required'}));
  bind();render();
}

function bind(){
  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>show(b.dataset.panel));
  $('drop').onclick=()=>$('fileInput').click();
  $('fileInput').onchange=e=>addFiles([...e.target.files]);
  $('drop').ondragover=e=>e.preventDefault();
  $('drop').ondrop=e=>{e.preventDefault();addFiles([...e.dataTransfer.files]);};
  $('saveBtn').onclick=save;$('analyzeBtn').onclick=analyzeSources;$('synthesizeBtn').onclick=synthesize;
  $('diagnoseBtn').onclick=generateDiagnosis;
  $('importDiscover').onclick=importDiscover;$('evidenceFilter').onchange=renderEvidence;
  $('finalizeBtn').onclick=validateDiagnosis;$('exportBtn').onclick=()=>download('scaler-diagnostic.json',JSON.stringify(persistedState(),null,2),'application/json');$('exportMdBtn').onclick=exportMarkdown;
  ['failure','binding','primaryObject','affectedDimensions','symptomDimensions','contributors','causalChain','whyNotLowest','alternative','disproof','missingEvidence'].forEach(id=>$(id).oninput=syncDiagnosis);
  $('constraintConfidence').onchange=syncDiagnosis;
  $('evidenceStatus').onchange=syncDiagnosis;
  $('outcome').onchange=syncRouting;$('routeRationale').oninput=syncRouting;
}

function show(name){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.panel===name));document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('active',x.id==='panel-'+name));}

async function extract(file){
  const ext=file.name.split('.').pop().toLowerCase(),ab=()=>file.arrayBuffer();
  if(['txt','md','vtt','csv','json'].includes(ext))return file.text();
  if(ext==='pdf'){const pdf=await pdfjsLib.getDocument({data:await ab()}).promise;let out='';for(let i=1;i<=pdf.numPages;i++){const p=await pdf.getPage(i),c=await p.getTextContent();out+=`\n[Page ${i}]\n`+c.items.map(x=>x.str).join(' ');}return out;}
  if(['doc','docx'].includes(ext))return (await mammoth.extractRawText({arrayBuffer:await ab()})).value;
  if(['ppt','pptx'].includes(ext)){const z=await JSZip.loadAsync(await ab()),names=Object.keys(z.files).filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a,b)=>(+a.match(/\d+/)[0])-(+b.match(/\d+/)[0]));let out='';for(const n of names){const xml=await z.files[n].async('string');out+=`\n[${n}]\n`+[...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map(m=>m[1]).join(' ');}return out;}
  throw new Error('Unsupported file type');
}

async function addFiles(files){
  for(const f of files){
    const s={id:uid(),name:f.name,type:f.name.split('.').pop().toLowerCase(),size:f.size,status:'extracting',addedAt:new Date().toISOString()};
    state.sources.push(s);renderSources();
    try{const text=(await extract(f)).slice(0,60000);rawSources.set(s.id,text);s.status=text.trim()?'ready':'empty';}
    catch(e){s.status='error';s.error=e.message;}
  }
  renderSources();await save();
}

function importDiscover(){
  const key='discover_state_'+store.orgId,raw=localStorage.getItem(key);let count=0;
  try{const d=JSON.parse(raw||'{}');for(const x of d?.intake?.docs||[]){if(!x.text)continue;const existing=state.sources.find(s=>s.name===x.name);const id=existing?.id||uid();if(!existing)state.sources.push({id,name:x.name||'Discover material',type:x.type||'document',size:x.size||0,status:'ready',addedAt:new Date().toISOString(),fromDiscover:true});else existing.status='ready';rawSources.set(id,x.text.slice(0,60000));count++;}}
  catch(_){}
  renderSources();save();notice(count?`Loaded ${count} Discover source${count===1?'':'s'} into this browser session.`:'No extracted Discover materials are available in this browser session.',count?'ok':'');
}

function renderSources(){
  const ready=state.sources.filter(s=>rawSources.has(s.id)).length;
  $('sourceList').innerHTML=state.sources.length?state.sources.map(s=>`<div class="source"><div><div class="name">${esc(s.name)}</div><div class="small">${esc((s.type||'file').toUpperCase())} · ${rawSources.has(s.id)?Math.round(rawSources.get(s.id).length/1000)+'k characters in session':'raw text not retained'} ${s.error?'· '+esc(s.error):''}</div></div><div class="row"><span class="status">${esc(s.status)}</span><button class="btn danger" onclick="removeSource('${s.id}')">Remove</button></div></div>`).join(''):'<div class="small">No sources loaded.</div>';
  $('analyzeBtn').disabled=!ready;
}

function removeSource(id){rawSources.delete(id);state.sources=state.sources.filter(s=>s.id!==id);state.evidence=state.evidence.filter(e=>e.sourceId!==id);render();save();}

async function ai(system,userText,max=1800,model='claude-haiku-4-5-20251001'){
  let lastError;
  for(let attempt=0;attempt<2;attempt++){
    const strict=attempt?`Your entire response must be one valid JSON value beginning with { or [ and ending with } or ]. No prose or code fence.\n\n${system}`:system;
    const r=await fetch('/api/parse',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({model,max_tokens:max,system:strict,messages:[{role:'user',content:userText}]})});
    if(!r.ok){lastError=new Error(`AI request failed (${r.status})`);continue;}
    const d=await r.json();let t=d.content?.[0]?.text?.trim()||'';t=t.replace(/^```(?:json)?\s*/i,'').replace(/```/g,'').trim();
    const oa=t.indexOf('['),oo=t.indexOf('{'),array=oa>=0&&(oo<0||oa<oo),start=array?oa:oo,end=array?t.lastIndexOf(']'):t.lastIndexOf('}');
    if(start<0||end<start){lastError=new Error('AI response did not contain valid JSON');continue;}
    try{return JSON.parse(t.slice(start,end+1));}catch(e){lastError=e;}
  }
  throw lastError;
}

async function analyzeSources(){
  if(!$('consent').checked){notice('Confirm authorization for AI processing before analysis.','error');return;}
  const ready=state.sources.filter(s=>rawSources.has(s.id)&&!s.analyzedAt);
  if(!ready.length){notice('No unanalyzed in-session sources are available.','');return;}
  $('analyzeBtn').disabled=true;
  for(const s of ready){
    notice(`Analyzing ${s.name}…`);
    try{
      const text=rawSources.get(s.id);
      const chunks=[];for(let i=0;i<text.length;i+=12000)chunks.push(text.slice(i,i+12000));
      for(let i=0;i<chunks.length;i++){
        const arr=await ai(`You extract evidence for an internal GTM operating-model diagnostic of the organization named in SOURCE NAME. Return ONLY a JSON array. Include an item only when the source directly describes that organization's CURRENT internal GTM practice. Exclude descriptions of its customers' problems, target market, consulting methodology, research statistics, hypotheticals, and desired future state. Plans and goals are not proof of current practice. Do not infer absence. Preserve disagreement. Every excerpt must be a short exact quote. Return at most 12 strongest items. Shape: [{"questionId":"s1","direction":"supports|contradicts","excerpt":"exact quote","rationale":"why this is current evidence about the assessed organization itself","confidence":"low|medium|high","subject":"current_assessed_org"}].\n\nQUESTIONS\n${qPrompt()}`,`SOURCE NAME: ${s.name} · PART ${i+1} OF ${chunks.length}\n\n${chunks[i]}`,1800);
        for(const x of arr){x.questionId=String(x.questionId||'').toLowerCase();x.sourceId=s.id;x.id=uid();x.sourceName=s.name;if(x.subject==='current_assessed_org'&&M.validateEvidence(x)&&text.toLowerCase().includes(String(x.excerpt).toLowerCase())&&!state.evidence.some(e=>e.sourceId===s.id&&e.questionId===x.questionId&&e.excerpt===x.excerpt))state.evidence.push(x);}
      }
      s.analyzedAt=new Date().toISOString();s.status='analyzed';
    }catch(e){s.status='analysis error';s.error=e.message;}
    render();await save();
  }
  notice(`Evidence extraction complete. ${state.evidence.length} cited findings retained.`,'ok');$('analyzeBtn').disabled=false;
}

async function synthesize(){
  if(!state.evidence.length){notice('Extract evidence before proposing scores.','error');return;}
  $('synthesizeBtn').disabled=true;
  for(const d of M.DIMENSIONS){
    notice(`Proposing ${d.label} scores…`);
    const evidence=state.evidence.filter(e=>d.questions.some(q=>q.id===e.questionId)).map(e=>({id:e.id,questionId:e.questionId,direction:e.direction,excerpt:e.excerpt,rationale:e.rationale,confidence:e.confidence,source:e.sourceName}));
    try{
      const out=await ai('Propose evidence-based scores for one GTM SCALER dimension. Return ONLY JSON, one record per question. Scores describe the statement as written: 1 directly contradicted; 2 informal or fragile; 3 partial with meaningful gaps; 4 documented and consistently used; 5 institutionalized with outcome or resilience evidence; null when evidence is insufficient. Missing evidence is null, never 1. Preserve contradictions. Shape: [{"questionId":"s1","score":null,"confidence":"low|medium|high","rationale":"brief synthesis","missing":"what would resolve uncertainty"}].',JSON.stringify({questions:d.questions,evidence}),1800);
      for(const x of out){const id=String(x.questionId||'').toLowerCase();if(!M.QUESTION_MAP[id])continue;state.assessments[id]={...state.assessments[id],proposed:M.normalizeScore(x.score),confidence:['low','medium','high'].includes(x.confidence)?x.confidence:'low',rationale:x.rationale||'',missing:x.missing||'',status:'unreviewed'};}
    }catch(e){notice(`Could not synthesize ${d.label}: ${e.message}`,'error');break;}
  }
  try{
    const routeOut=await ai('Propose the unscored SCALER Route context from the evidence. Return ONLY one JSON object with keys r1 through r5. Each value must be {"answer":"one exact allowed option or empty string","confidence":"low|medium|high","evidenceIds":["ids"]}. Do not force an answer when evidence is insufficient.',JSON.stringify({route:M.ROUTE,evidence:state.evidence.map(e=>({id:e.id,questionId:e.questionId,direction:e.direction,excerpt:e.excerpt,source:e.sourceName}))}),1400);
    for(const r of M.ROUTE){const x=routeOut[r.id]||{},answer=r.options.includes(x.answer)?x.answer:'';state.route[r.id]={...state.route[r.id],proposed:answer,confidence:['low','medium','high'].includes(x.confidence)?x.confidence:'low',evidenceIds:Array.isArray(x.evidenceIds)?x.evidenceIds.filter(id=>state.evidence.some(e=>e.id===id)):[]};}
  }catch(_){}
  render();await save();$('synthesizeBtn').disabled=false;notice('Score proposals are ready for Britt review.','ok');
}

function renderEvidence(){const f=$('evidenceFilter').value||'all',items=state.evidence.filter(e=>f==='all'||e.direction===f);$('evidenceList').innerHTML=items.length?items.map(e=>`<div class="evidence ${e.direction}"><div><span class="qid">${esc(e.questionId.toUpperCase())}</span> · ${esc(e.direction)} · ${esc(e.confidence)} confidence</div><div class="quote">“${esc(e.excerpt)}”</div><div class="small">${esc(e.rationale)} · ${esc(e.sourceName)}</div></div>`).join(''):'<div class="card small">No evidence in this view.</div>';}

function renderReview(){
  const sums=M.summaries(state);
  $('scoreCards').innerHTML=sums.map(s=>`<div class="metric"><div class="score">${s.score===null?'—':s.score+'%'}</div><div class="label">${s.letter} · ${s.label}</div><div class="small">${s.known}/${s.total} reviewed · ${s.coverage}% coverage</div></div>`).join('');
  $('questions').innerHTML=M.DIMENSIONS.map(d=>`<h2>${d.letter} · ${d.label}</h2><div class="card">${d.questions.map(q=>{const a=state.assessments[q.id],ev=state.evidence.filter(e=>e.questionId===q.id);return `<div class="question"><div><b>${q.id.toUpperCase()}</b> ${esc(q.text)} ${q.reverse?'<span class="reverse">REVERSE SCORED</span>':''}<div class="small" style="margin-top:7px">AI: ${esc(a.rationale||'No proposal yet.')}</div>${a.missing?`<div class="citation">Missing: ${esc(a.missing)}</div>`:''}${ev.slice(0,3).map(e=>`<div class="citation">${e.direction==='supports'?'✓':'✕'} ${esc(e.sourceName)}: “${esc(e.excerpt)}”</div>`).join('')}</div><div><div class="small">AI proposal</div><b>${a.proposed??'Unknown'}</b><div class="small">${esc(a.confidence)}</div></div><div><div class="small">Britt final</div><select onchange="setFinal('${q.id}',this.value)"><option value="" ${a.final===null?'selected':''}>Unknown</option>${[1,2,3,4,5].map(n=>`<option value="${n}" ${a.final===n?'selected':''}>${n}</option>`).join('')}</select><select style="margin-top:6px" onchange="setStatus('${q.id}',this.value)">${['unreviewed','approved','revised','rejected'].map(v=>`<option ${a.status===v?'selected':''}>${v}</option>`).join('')}</select></div><textarea placeholder="Review note" onchange="setNote('${q.id}',this.value)">${esc(a.note||'')}</textarea></div>`;}).join('')}</div>`).join('');
  $('routeReview').innerHTML=M.ROUTE.map(r=>{const x=state.route[r.id];return `<div class="question"><div><b>${r.id.toUpperCase()}</b> ${esc(r.label)}<div class="small">AI proposal: ${esc(x.proposed||'Unknown')} · ${esc(x.confidence)}</div></div><div></div><select onchange="setRouteFinal('${r.id}',this.value)"><option value="">Unknown</option>${r.options.map(o=>`<option value="${esc(o)}" ${x.final===o?'selected':''}>${esc(o)}</option>`).join('')}</select><div class="small">Unscored. Used to contextualize the motion and intervention.</div></div>`;}).join('');
}

function setFinal(id,v){state.assessments[id].final=M.normalizeScore(v);state.assessments[id].status=state.assessments[id].final===state.assessments[id].proposed?'approved':'revised';renderReview();renderCoverage();save();}
function setStatus(id,v){state.assessments[id].status=v;save();}function setNote(id,v){state.assessments[id].note=v;save();}
function setRouteFinal(id,v){state.route[id].final=v;save();}
function renderCoverage(){$('coverage').innerHTML='<div class="small">Reviewed evidence profile</div>'+M.summaries(state).map(s=>`<div class="dim-mini"><b>${s.letter}</b><div class="track"><div class="fill" style="width:${s.coverage}%"></div></div><span>${s.score===null?'—':s.score+'%'}</span></div>`).join('');}

function renderDiagnosis(){
  const c=state.constraint;$('failure').value=c.failure;$('binding').value=c.binding;$('primaryObject').value=c.primaryObject||'';$('affectedDimensions').value=(c.affectedDimensions||[]).join(', ');$('symptomDimensions').value=(c.symptomDimensions||[]).join(', ');$('contributors').value=(c.contributors||[]).join(', ');$('constraintConfidence').value=c.confidence||'low';$('evidenceStatus').value=c.evidenceStatus||'provisional';$('causalChain').value=c.causalChain;$('whyNotLowest').value=c.whyNotLowest||'';$('alternative').value=c.alternative;$('disproof').value=c.disproof;$('missingEvidence').value=(c.missingEvidence||[]).join('\n');
  $('candidateList').innerHTML=(c.candidates||[]).length?c.candidates.map((x,i)=>`<div class="evidence ${x.id===c.selectedCandidateId?'supports':''}"><div><b>${i+1}. ${esc(x.constraint)}</b> · ${esc(x.operatingObject||'')}</div><div class="quote">${esc(x.causalChain||'')}</div><div class="small">Leverage: ${esc(x.leverage||'')} · Precedence: ${esc(x.precedence||'')} · Against: ${esc(x.counterevidence||'None cited')}</div><button class="btn" style="margin-top:8px" onclick="selectCandidate('${esc(x.id)}')">Select candidate</button></div>`).join(''):'<div class="small">No causal candidates generated.</div>';
  $('supportChecks').innerHTML=state.evidence.map(e=>`<label class="check"><input type="checkbox" ${c.supportingEvidenceIds.includes(e.id)?'checked':''} onchange="toggleSupport('${e.id}',this.checked)"> ${esc(e.questionId.toUpperCase())} · ${esc(e.sourceName)}</label>`).join('')||'<span class="small">No evidence available.</span>';
  $('outcome').value=state.routing.outcome;$('routeRationale').value=state.routing.rationale;
  $('dimensionChecks').innerHTML=[...M.DIMENSIONS.map(d=>[d.letter,d.label]),['R','Route']].map(([l,n])=>`<label class="check"><input type="checkbox" ${state.routing.dimensions.includes(l)?'checked':''} onchange="toggleDimension('${l}',this.checked)"> ${l} · ${n}</label>`).join('');renderWorkstreams();
  const readiness=M.diagnosisReadiness(state);$('diagnosisReadiness').textContent=readiness.reason+(readiness.weakCoverage.length?` · weak coverage: ${readiness.weakCoverage.join(', ')}`:'');
}

function syncDiagnosis(){state.constraint.failure=$('failure').value;state.constraint.binding=$('binding').value;state.constraint.primaryObject=$('primaryObject').value;state.constraint.affectedDimensions=$('affectedDimensions').value.split(',').map(x=>x.trim().toUpperCase()).filter(x=>M.WORKSTREAMS[x]);state.constraint.symptomDimensions=$('symptomDimensions').value.split(',').map(x=>x.trim().toUpperCase()).filter(x=>M.WORKSTREAMS[x]);state.constraint.contributors=$('contributors').value.split(',').map(x=>x.trim()).filter(Boolean).slice(0,2);state.constraint.confidence=$('constraintConfidence').value;state.constraint.evidenceStatus=$('evidenceStatus').value;state.constraint.causalChain=$('causalChain').value;state.constraint.whyNotLowest=$('whyNotLowest').value;state.constraint.alternative=$('alternative').value;state.constraint.disproof=$('disproof').value;state.constraint.missingEvidence=$('missingEvidence').value.split('\n').map(x=>x.trim()).filter(Boolean);save();}
function toggleSupport(id,on){const a=state.constraint.supportingEvidenceIds;state.constraint.supportingEvidenceIds=on?[...new Set([...a,id])]:a.filter(x=>x!==id);save();}
function toggleDimension(l,on){const a=state.routing.dimensions;state.routing.dimensions=on?[...new Set([...a,l])]:a.filter(x=>x!==l);state.routing.workstreams=M.routeWorkstreams(state.routing.dimensions);renderWorkstreams();save();}
function renderWorkstreams(){const opts=M.routeWorkstreams(state.routing.dimensions);$('workstreamChecks').innerHTML=opts.map(w=>`<label class="check"><input type="checkbox" ${state.routing.workstreams.includes(w)?'checked':''} onchange="toggleWorkstream('${esc(w)}',this.checked)"> ${esc(w)}</label>`).join('')||'<span class="small">Select a diagnosed dimension to see candidate workstreams.</span>';}
function toggleWorkstream(w,on){const a=state.routing.workstreams;state.routing.workstreams=on?[...new Set([...a,w])]:a.filter(x=>x!==w);save();}
function syncRouting(){state.routing.outcome=$('outcome').value;state.routing.rationale=$('routeRationale').value;save();}
async function generateDiagnosis(){
  if(!state.evidence.length){notice('Evidence is required before generating causal candidates.','error');return;}
  $('diagnoseBtn').disabled=true;notice('Comparing causal candidates…');
  const scores=M.DIMENSIONS.map(dim=>{const vals=dim.questions.map(q=>{const a=state.assessments[q.id],raw=a.final??a.proposed;return raw===null?null:(q.reverse?6-raw:raw);}).filter(v=>v!==null);return {letter:dim.letter,label:dim.label,score:vals.length?Math.round(vals.reduce((x,y)=>x+y,0)/(vals.length*5)*100):null,coverage:`${vals.length}/${dim.questions.length}`};});
  let diagnosticEvidence=[];for(const q of Object.keys(M.QUESTION_MAP))for(const direction of ['supports','contradicts']){const match=state.evidence.find(e=>e.questionId===q&&e.direction===direction);if(match)diagnosticEvidence.push({id:match.id,questionId:match.questionId,direction:match.direction,excerpt:match.excerpt.slice(0,240),rationale:match.rationale.slice(0,180),source:match.sourceName});}
  try{
    const subjectAudit=await ai(`Audit whether each exact quote directly describes the assessed organization's own CURRENT GTM operations. Exclude quotes about customers, target buyers, examples, consulting methodology, hypothetical situations, desired future state, or proposed work. Ambiguous pronouns are invalid unless the quote itself clearly identifies the assessed organization. Return ONLY JSON: {"validIds":["ids"]}.`,JSON.stringify({evidence:diagnosticEvidence.map(({id,excerpt,source})=>({id,excerpt,source}))}),1400,'claude-sonnet-4-5-20250929');
    const subjectValid=new Set(subjectAudit.validIds||[]);diagnosticEvidence=diagnosticEvidence.filter(e=>subjectValid.has(e.id));
    const candidateResult=await ai(`Generate exactly 3 compact causal candidates for a GTM constraint diagnosis. A constraint is the earliest evidence-supported operating condition that must change, not a SCALER dimension, a missing artifact, or one possible remedy. First identify the recurring observed commercial failure. Then name the parent operating object whose ambiguity or absence plausibly produces that failure across multiple dimensions. Prefer the parent object over a child component: for example, undefined offer architecture can cause weak outcomes, pricing, proof, qualification, and delegation; a guarantee is only one optional component and must never be assumed necessary without direct evidence. Do not convert an aspiration, workshop task, or consultant suggestion into a current failure. Return ONLY JSON: {"failure":"recurring evidence-based commercial failure","candidates":[{"id":"c1","constraint":"specific current condition","operatingObject":"parent thing to change","affectedDimensions":["letters"],"symptomDimensions":["letters"],"causalChain":"condition -> mechanism -> observed failure","leverage":"repair result","precedence":"what must wait","confidence":"low|medium|high"}]}.`,JSON.stringify({scores,route:state.route,evidence:diagnosticEvidence}),1150,'claude-sonnet-4-5-20250929');
    const selection=await ai(`Compare the candidates by causality, leverage, precedence, and scope. Do not select by lowest score. Reject a candidate if it is merely a child component of a broader evidence-supported candidate, if fixing it alone would not plausibly change the observed failure, or if its causal chain depends on an unproven requirement. Prefer the narrowest parent operating object that explains several downstream symptoms without swallowing unrelated problems. Return ONLY JSON: {"selectedCandidateId":"c1 or empty","whySelected":"explicit comparison including parent-child test","whyLowestIsCauseOrSymptom":"explanation","alternative":"strongest alternative","disproof":"observable evidence that would show the selected candidate is NOT causal","evidenceStatus":"provisional|validated","outcome":"findings-only|self-implement|scoped-build|fractional","routingDimensions":["letters"],"routingRationale":"scope logic"}. Strategy-session evidence without proposals, pipeline, win-loss, pricing behavior, delivery evidence, or validating interviews is provisional.`,JSON.stringify({failure:candidateResult.failure,candidates:candidateResult.candidates,scores}),1050,'claude-sonnet-4-5-20250929');
    const selectedForEvidence=(candidateResult.candidates||[]).find(x=>x.id===selection.selectedCandidateId);
    const evidenceResult=selectedForEvidence?await ai(`Test the selected causal candidate against the evidence. An item supports the candidate only when its exact excerpt directly demonstrates the named current condition, its causal mechanism, or the observed failure at the assessed organization. Topic overlap is not support. Customer examples, aspirations, possible markets, and proposed remedies are not support. Return ONLY JSON: {"supportingEvidenceIds":["ids"],"counterEvidenceIds":["ids"],"counterevidence":"best case against","missingEvidence":["items"]}. Cite only supplied IDs. It is valid to return no supporting IDs and leave the diagnosis unselected in practice.`,JSON.stringify({candidate:selectedForEvidence,evidence:diagnosticEvidence}),750,'claude-sonnet-4-5-20250929'):{supportingEvidenceIds:[],counterEvidenceIds:[],counterevidence:'',missingEvidence:['Evidence did not support selecting a candidate.']};
    if(selectedForEvidence){
      const cited=diagnosticEvidence.filter(e=>(evidenceResult.supportingEvidenceIds||[]).includes(e.id));
      const entailment=cited.length?await ai(`Act as a strict evidence auditor. Test the WHOLE compound constraint as written, not merely its general topic. For each quote, direct is true only if its words demonstrate a named current condition, causal mechanism, or observed commercial failure at the assessed organization. Similar subject matter, customer examples, aspirations, possible markets, and proposed remedies are false. Then state whether the complete constraint is directly supported. If not, provide a narrower supportedConstraint that removes every unsupported subclaim without adding new claims. Do not use rationale fields to fill gaps. Return ONLY JSON: {"overallDirect":false,"supportedConstraint":"narrower evidence-supported hypothesis or empty","unsupportedClaims":["claims"],"checks":[{"id":"evidence id","direct":true,"reason":"brief"}]}.`,JSON.stringify({candidate:selectedForEvidence,evidence:cited}),850,'claude-sonnet-4-5-20250929'):{overallDirect:false,supportedConstraint:'',unsupportedClaims:[],checks:[]};
      const directIds=new Set((entailment.checks||[]).filter(x=>x.direct===true).map(x=>x.id));
      evidenceResult.supportingEvidenceIds=(evidenceResult.supportingEvidenceIds||[]).filter(id=>directIds.has(id));
      Object.assign(selectedForEvidence,evidenceResult);
      const directSources=new Set(diagnosticEvidence.filter(e=>directIds.has(e.id)).map(e=>e.source));
      if(entailment.overallDirect!==true&&entailment.supportedConstraint)selectedForEvidence.constraint=entailment.supportedConstraint;
      if((entailment.unsupportedClaims||[]).length)selectedForEvidence.missingEvidence=[...new Set([...(selectedForEvidence.missingEvidence||[]),...entailment.unsupportedClaims.map(x=>`Direct support for: ${x}`)])];
      selectedForEvidence.confidence=entailment.overallDirect===true&&directIds.size>=3&&directSources.size>=2?'high':directIds.size>=2&&directSources.size>=2?'medium':'low';
    }
    const result={...candidateResult,...selection};
    const validIds=new Set(state.evidence.map(e=>e.id));
    state.constraint.failure=result.failure||'';
    state.constraint.candidates=(result.candidates||[]).map((x,i)=>({...x,id:x.id||`c${i+1}`,affectedDimensions:(x.affectedDimensions||[]).filter(l=>M.WORKSTREAMS[l]),symptomDimensions:(x.symptomDimensions||[]).filter(l=>M.WORKSTREAMS[l]),supportingEvidenceIds:(x.supportingEvidenceIds||[]).filter(id=>validIds.has(id)),counterEvidenceIds:(x.counterEvidenceIds||[]).filter(id=>validIds.has(id))}));
    state.constraint.selectedCandidateId=result.selectedCandidateId||'';
    state.constraint.whyNotLowest=result.whyLowestIsCauseOrSymptom||'';
    state.constraint.alternative=result.alternative||'';state.constraint.disproof=result.disproof||'';
    state.constraint.evidenceStatus=result.evidenceStatus==='validated'?'validated':'provisional';
    const chosen=state.constraint.candidates.find(x=>x.id===state.constraint.selectedCandidateId);
    if(chosen)applyCandidate(chosen);
    state.routing.outcome=['findings-only','self-implement','scoped-build','fractional'].includes(result.outcome)?result.outcome:'findings-only';
    state.routing.dimensions=(result.routingDimensions||chosen?.affectedDimensions||[]).filter(l=>M.WORKSTREAMS[l]);state.routing.workstreams=M.routeWorkstreams(state.routing.dimensions);state.routing.rationale=result.routingRationale||'';
    const routeSupportSources=new Set(state.evidence.filter(e=>(chosen?.supportingEvidenceIds||[]).includes(e.id)).map(e=>e.sourceId));
    if(chosen?.confidence==='low'||routeSupportSources.size<2){state.routing.outcome='findings-only';state.routing.dimensions=[];state.routing.workstreams=[];state.routing.rationale='The leading constraint remains a low-confidence hypothesis. Gather direct evidence from at least two independent sources before recommending implementation scope.';}
    render();await save();notice(chosen?'Causal candidates generated. The selected result remains a hypothesis until the evidence gate is satisfied.':'Candidates generated, but the evidence did not support selecting one.','ok');
  }catch(e){notice(`Constraint synthesis failed: ${e.message}`,'error');}
  $('diagnoseBtn').disabled=false;
}
function applyCandidate(x){state.constraint.binding=x.constraint||'';state.constraint.primaryObject=x.operatingObject||'';state.constraint.affectedDimensions=x.affectedDimensions||[];state.constraint.symptomDimensions=x.symptomDimensions||[];state.constraint.causalChain=x.causalChain||'';state.constraint.supportingEvidenceIds=x.supportingEvidenceIds||[];state.constraint.counterEvidenceIds=x.counterEvidenceIds||[];state.constraint.missingEvidence=x.missingEvidence||[];state.constraint.confidence=x.confidence||'low';state.constraint.status='draft';}
function selectCandidate(id){const x=(state.constraint.candidates||[]).find(c=>c.id===id);if(!x)return;state.constraint.selectedCandidateId=id;applyCandidate(x);renderDiagnosis();save();}
function validateDiagnosis(){syncDiagnosis();syncRouting();const readiness=M.diagnosisReadiness(state);if(readiness.errors.length){notice(readiness.errors.join(' '),'error');return;}state.constraint.status=readiness.finalReady?'validated':'hypothesis';save();notice(readiness.finalReady?'Diagnosis passes the validation gate.':'Saved as an evidence-supported hypothesis. Required evidence or confidence is not sufficient for a final diagnosis.',readiness.finalReady?'ok':'');}

async function save(){
  if(!store.orgId)return;state.updatedAt=new Date().toISOString();$('saveState').textContent='Saving…';
  const {error}=await store.save('org_scaler',persistedState());
  if(error){localStorage.setItem('scaler_state_'+store.orgId,JSON.stringify(persistedState()));$('saveState').textContent='Saved locally · database migration required';}
  else $('saveState').textContent='Saved '+new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
}

function render(){renderSources();renderEvidence();renderReview();renderCoverage();renderDiagnosis();}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
function exportMarkdown(){const sums=M.summaries(state),c=state.constraint,r=state.routing;const md=`# SCALER evidence diagnostic\n\n## Evidence profile\n\n| Dimension | Score | Coverage |\n|---|---:|---:|\n${sums.map(s=>`| ${s.letter} · ${s.label} | ${s.score===null?'Unknown':s.score+'%'} | ${s.known}/${s.total} |`).join('\n')}\n\n## Constraint\n\n**Observed failure:** ${c.failure}\n\n**Binding constraint:** ${c.binding}\n\n**Causal chain:** ${c.causalChain}\n\n**Alternative or counterevidence:** ${c.alternative}\n\n**Disproof test:** ${c.disproof}\n\n## Decision\n\n**Outcome:** ${r.outcome}\n\n**Activated workstreams:** ${r.workstreams.join(', ')||'None'}\n\n${r.rationale}\n`;download('scaler-readout.md',md,'text/markdown');}

init();
