(function (global) {
  'use strict';

  const DIMENSIONS = [
    { id:'system', letter:'S', label:'System', questions:[
      ['s1','A new hire can follow the documented revenue process without relying on tribal knowledge.'],
      ['s2','Sales, marketing, and customer data operate as a connected system.'],
      ['s3','Each AI tool used in revenue has a named owner and defined job.'],
      ['s4','Pipeline and account context survive the departure of a top performer.'],
      ['s5','Qualification is consistent regardless of who runs the deal.'],
    ]},
    { id:'credibility', letter:'C', label:'Credibility', questions:[
      ['c1','Proof can be sent immediately without recreating it for each prospect.'],
      ['c2','The organization uses consistent numbers and definitions when describing wins.'],
      ['c3','Results have received external validation in the last year.'],
      ['c4','Top offers have specific quantified results attached to them.'],
    ]},
    { id:'audience', letter:'A', label:'Audience', questions:[
      ['a1','The team shares a consistent definition of the ideal buyer.'],
      ['a2','The organization knows which objection most often kills deals.'],
      ['a3','External audiences find the positioning unclear.',true],
      ['a4','The company has a durable one-line explanation of what it does and for whom.'],
      ['a5','The company can differentiate itself from the alternatives it actually loses to.'],
      ['a6','The full buying group is identified and engaged.'],
      ['a7','Pricing and packaging let qualified prospects identify the appropriate offer.'],
    ]},
    { id:'learnings', letter:'L', label:'Learnings', questions:[
      ['l1','Recent campaigns produced measurable results.'],
      ['l2','Campaign performance is reviewed through a formal process.'],
      ['l3','Channels or campaign types continue without evidence they still work.',true],
      ['l4','Underperformance produces a specific documented explanation.'],
      ['l5','Closed-lost reasons are specific enough to guide action.'],
      ['l6','Pipeline health reflects buying-group engagement, not only lead volume.'],
    ]},
    { id:'execution', letter:'E', label:'Execution', questions:[
      ['e1','Formal structure reflects how work and decisions actually happen.'],
      ['e2','The organization can act promptly when it finds the fix.'],
      ['e3','Incentives reinforce the current selling model.'],
      ['e4','One person has authority to resolve cross-functional GTM disagreement.'],
      ['e5','Partner and channel involvement follows a defined operating model.'],
    ]},
  ].map(d => ({...d, questions:d.questions.map(q => ({id:q[0], text:q[1], reverse:!!q[2]}))}));

  const ROUTE = [
    {id:'r1',label:'Stage',options:['Founder-led','Growth-stage','Scaling','Enterprise']},
    {id:'r2',label:'Market condition',options:['Warm','Transitioning','Cold']},
    {id:'r3',label:'Primary growth motion',options:['Referral-led','Outbound-led','Content or inbound-led','Mixed, no clear primary']},
    {id:'r4',label:'GTM decision owner',options:['Founder or CEO alone','Shared across functions, informally','A named GTM leader with real authority','No clear owner']},
    {id:'r5',label:'Primary friction',options:["Can't get in the door","Can't close what we generate","Don't know what's working",'Growing but breaking']},
  ];

  const WORKSTREAMS = {
    S:['Revenue path','Qualification','Handoffs','Systems','Intake and delivery','Workflow ownership'],
    C:['Proof inventory','Claim validation','Case architecture','References','Sales enablement'],
    A:['ICP','Buying group','Positioning','Differentiation','Pricing and offers'],
    L:['Measurement','Attribution','Win-loss','Experimentation','Decision cadence'],
    E:['Decision rights','Roles','Incentives','Governance','Capacity','Change leadership'],
    R:['Primary motion','Channel','Market entry','Partner model','Enterprise progression'],
  };

  const QUESTION_MAP = Object.fromEntries(DIMENSIONS.flatMap(d => d.questions.map(q => [q.id,{...q,dimension:d.letter,dimensionLabel:d.label}])));

  function emptyState() {
    return {
      version:'scaler-evidence-v0.1', updatedAt:null, sources:[], evidence:[],
      assessments:Object.fromEntries(Object.keys(QUESTION_MAP).map(id => [id,{proposed:null,confidence:'low',rationale:'',missing:'',status:'unreviewed',final:null,note:''}])),
      route:Object.fromEntries(ROUTE.map(r => [r.id,{proposed:'',confidence:'low',evidenceIds:[],final:''}])),
      constraint:{failure:'',binding:'',primaryObject:'',contributors:[],affectedDimensions:[],symptomDimensions:[],candidates:[],causalChain:'',supportingEvidenceIds:[],counterEvidenceIds:[],alternative:'',whyNotLowest:'',disproof:'',missingEvidence:[],confidence:'low',evidenceStatus:'provisional',status:'draft'},
      routing:{outcome:'findings-only',dimensions:[],workstreams:[],rationale:''},
    };
  }

  function normalizeScore(value) {
    if (value === null || value === undefined || value === '' || value === 'unknown') return null;
    const n=Number(value); return Number.isInteger(n)&&n>=1&&n<=5?n:null;
  }

  function effectiveScore(id, record) {
    const q=QUESTION_MAP[id];
    const raw=normalizeScore(record?.final);
    if (!q || raw===null) return null;
    return q.reverse ? 6-raw : raw;
  }

  function dimensionSummary(state, letter) {
    const dim=DIMENSIONS.find(d=>d.letter===letter);
    const scores=dim.questions.map(q=>effectiveScore(q.id,state.assessments[q.id])).filter(v=>v!==null);
    return {letter,label:dim.label,known:scores.length,total:dim.questions.length,coverage:Math.round(scores.length/dim.questions.length*100),score:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/(scores.length*5)*100):null};
  }

  function summaries(state) { return DIMENSIONS.map(d=>dimensionSummary(state,d.letter)); }

  function validateEvidence(item) {
    return !!(item && QUESTION_MAP[item.questionId] && ['supports','contradicts'].includes(item.direction) && item.sourceId && item.excerpt && ['low','medium','high'].includes(item.confidence));
  }

  function validateForDiagnosis(state) {
    const errors=[];
    if (!state.constraint.failure.trim()) errors.push('Observed business failure is required.');
    if (!state.constraint.binding.trim()) errors.push('Binding constraint is required.');
    if (!state.constraint.primaryObject?.trim()) errors.push('The operating object that must change is required.');
    if (!state.constraint.causalChain.trim()) errors.push('Causal chain is required.');
    if (!state.constraint.disproof.trim()) errors.push('Disproof test is required.');
    if (!state.constraint.supportingEvidenceIds.length) errors.push('At least one supporting evidence citation is required.');
    if ((state.constraint.candidates||[]).length<2) errors.push('At least two causal candidates must be compared.');
    if (!state.constraint.whyNotLowest?.trim()) errors.push('Explain why the lowest dimension is cause or symptom.');
    if (['System','Credibility','Audience','Learnings','Execution','Route','S','C','A','L','E','R'].includes(state.constraint.binding.trim())) errors.push('A SCALER dimension alone cannot be the binding constraint.');
    return errors;
  }

  function diagnosisReadiness(state) {
    const errors=validateForDiagnosis(state);
    const cited=state.evidence.filter(e=>(state.constraint.supportingEvidenceIds||[]).includes(e.id));
    const sourceCount=new Set(cited.map(e=>e.sourceId)).size;
    const relevant=(state.constraint.affectedDimensions||[]).filter(l=>DIMENSIONS.some(d=>d.letter===l));
    const summariesByLetter=Object.fromEntries(summaries(state).map(s=>[s.letter,s]));
    const weakCoverage=relevant.filter(l=>(summariesByLetter[l]?.coverage||0)<60);
    const hypothesisReady=errors.length===0&&sourceCount>=1;
    const finalReady=hypothesisReady&&sourceCount>=2&&weakCoverage.length===0&&state.constraint.evidenceStatus==='validated'&&state.constraint.confidence==='high';
    return {hypothesisReady,finalReady,errors,sourceCount,weakCoverage,reason:finalReady?'Validated diagnosis':hypothesisReady?'Evidence-supported hypothesis; validation still required':'Not ready'};
  }

  function routeWorkstreams(dimensions) { return [...new Set((dimensions||[]).flatMap(d=>WORKSTREAMS[d]||[]))]; }

  function mergeState(saved) {
    const base=emptyState();
    if (!saved || typeof saved!=='object') return base;
    return {...base,...saved,assessments:{...base.assessments,...(saved.assessments||{})},route:{...base.route,...(saved.route||{})},constraint:{...base.constraint,...(saved.constraint||{})},routing:{...base.routing,...(saved.routing||{})}};
  }

  global.SCALER_MODEL=Object.freeze({DIMENSIONS,ROUTE,WORKSTREAMS,QUESTION_MAP,emptyState,mergeState,normalizeScore,effectiveScore,dimensionSummary,summaries,validateEvidence,validateForDiagnosis,diagnosisReadiness,routeWorkstreams});
})(window);
