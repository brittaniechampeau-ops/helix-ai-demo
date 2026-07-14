(function(global){
'use strict';

const FIELDS={
  businessModel:{label:'Business model',options:{'expert-services':'Expert or advisory services','productized-services':'Productized professional services','software-product':'Software or technology product','physical-product':'Physical product','field-services':'Field services','marketplace':'Marketplace or platform','hybrid':'Hybrid product and services'}},
  growthStage:{label:'Growth stage',options:{'founder-led':'Founder-led','early-traction':'Early traction','repeatability':'Building repeatability','scaling':'Scaling','enterprise':'Enterprise or multi-function'}},
  revenueMotion:{label:'Primary revenue motion',options:{'referral':'Referral and relationships','founder-led-sales':'Founder-led sales','inbound':'Inbound demand','outbound':'Outbound sales','partner-ecosystem':'Partner or ecosystem-led','product-led':'Product-led growth','enterprise-sales':'Enterprise sales','local-demand':'Local demand generation','market-entry':'New-market entry'}},
  deliveryModel:{label:'Delivery model',options:{'advisory':'Advisory','project':'Project delivery','implementation':'Implementation','managed-service':'Managed service','subscription':'Subscription product','transactional':'Transactional product or service','field-delivery':'Field delivery','hybrid':'Hybrid delivery'}},
  marketCondition:{label:'Current GTM condition',options:{'validate':'Validate a new motion','systematize':'Systematize existing traction','repair':'Repair an underperforming motion','new-market':'Enter a new market','launch':'Launch a product or offer','expand-accounts':'Expand existing accounts','transform':'Transform a complex operating model'}}
};

const PRESETS={
  'expert-practice':{businessModel:'expert-services',growthStage:'founder-led',revenueMotion:'referral',deliveryModel:'advisory',marketCondition:'systematize'},
  'productized-services':{businessModel:'productized-services',growthStage:'repeatability',revenueMotion:'founder-led-sales',deliveryModel:'implementation',marketCondition:'systematize'},
  'field-services':{businessModel:'field-services',growthStage:'scaling',revenueMotion:'local-demand',deliveryModel:'field-delivery',marketCondition:'repair'},
  'b2b-saas':{businessModel:'software-product',growthStage:'repeatability',revenueMotion:'enterprise-sales',deliveryModel:'subscription',marketCondition:'systematize'},
  'enterprise':{businessModel:'hybrid',growthStage:'enterprise',revenueMotion:'enterprise-sales',deliveryModel:'hybrid',marketCondition:'transform'}
};

const CAPABILITY_MAP={
  referral:['authority','referrals','qualification'],
  'founder-led-sales':['positioning','qualification','sales-process'],
  inbound:['positioning','demand','conversion'],
  outbound:['segmentation','outbound','sales-process'],
  'partner-ecosystem':['ecosystem-positioning','partner-enablement','co-sell'],
  'product-led':['activation','adoption','retention'],
  'enterprise-sales':['enterprise-positioning','buying-committee','sales-handoffs'],
  'local-demand':['demand-capture','booking','capacity'],
  'market-entry':['market-localization','credibility','beachhead-pipeline']
};

function valid(field,value){return !!FIELDS[field]?.options[value]}
function legacyArchetype(profile={}){
  const d=profile.dimensions||profile;
  if(d.growthStage==='enterprise'||d.marketCondition==='transform')return'enterprise';
  if(d.businessModel==='field-services'||d.deliveryModel==='field-delivery')return'field-services';
  if(d.businessModel==='software-product'&&d.deliveryModel==='subscription')return'b2b-saas';
  if(d.businessModel==='productized-services'||['implementation','managed-service'].includes(d.deliveryModel))return'productized-services';
  return'expert-practice';
}
function build(input={}){
  const sourceProfile=input.operatingProfile||input.operating_profile||null;
  const supplied=sourceProfile?.dimensions||input.dimensions||{};
  const presetKey=sourceProfile?(sourceProfile.archetypePreset||''):(input.archetypePreset||input.archetype||input.org_archetype||'');
  const preset=PRESETS[presetKey]||{};
  const dimensions={};
  Object.keys(FIELDS).forEach(field=>{const value=supplied[field]||input[field]||preset[field]||'';dimensions[field]=valid(field,value)?value:''});
  const capabilities=[...(CAPABILITY_MAP[dimensions.revenueMotion]||[])];
  if(dimensions.marketCondition==='new-market')capabilities.push('market-localization','credibility','beachhead-pipeline');
  if(dimensions.marketCondition==='expand-accounts')capabilities.push('adoption','outcomes','expansion');
  if(dimensions.marketCondition==='repair')capabilities.push('constraint-diagnosis','handoffs','measurement');
  if(dimensions.marketCondition==='transform')capabilities.push('governance','operating-model','portfolio-measurement');
  return{version:'1.0',archetypePreset:PRESETS[presetKey]?presetKey:'',dimensions,capabilityPriorities:[...new Set(capabilities)],legacyArchetype:legacyArchetype(dimensions)};
}
function completeness(profile){const d=profile?.dimensions||{};return Math.round(Object.keys(FIELDS).filter(k=>valid(k,d[k])).length/Object.keys(FIELDS).length*100)}
function label(field,value){return FIELDS[field]?.options[value]||''}
function summary(profile){const d=profile?.dimensions||{};return Object.keys(FIELDS).map(k=>label(k,d[k])).filter(Boolean).join(' · ')}
function capabilityLabel(value){return(value||'operating capability').split('-').map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(' ')}
function execution(profile,track='A'){
  const normalized=build({operatingProfile:profile}),caps=normalized.capabilityPriorities.slice(0,3);
  while(caps.length<3)caps.push(['positioning','handoffs','measurement'][caps.length]);
  const verbs={
    A:{Foundation:'Baseline and standardize',Activation:'Run the standard workflow for',Optimization:'Review performance and improve'},
    B:{Foundation:'Define the first workable model for',Activation:'Run a bounded market test of',Optimization:'Continue, revise, or stop'},
    C:{Foundation:'Quantify the failure and assign ownership for',Activation:'Pilot a corrected workflow for',Optimization:'Measure the result and address the next constraint in'}
  }[track]||null;
  if(!verbs)return null;
  const roles={ 'founder-led':'Founder or operating lead','early-traction':'Founder or functional lead',repeatability:'Functional owner',scaling:'Executive owner',enterprise:'Cross-functional executive owner'};
  const rows=[];
  ['Foundation','Activation','Optimization'].forEach(phase=>caps.forEach((cap,index)=>rows.push({
    id:`profile-${track}-${phase.toLowerCase()}-${cap}`,
    phase,focus:capabilityLabel(cap),action:`${verbs[phase]} ${capabilityLabel(cap).toLowerCase()} using the recorded client baseline and evidence`,
    measure:`${capabilityLabel(cap)} performance`,ownerRole:roles[normalized.dimensions.growthStage]||'Accountable operating owner',
    cadence:phase==='Foundation'?'Weekly':phase==='Activation'?'Biweekly':'Monthly',
    definitionOfDone:`The ${capabilityLabel(cap).toLowerCase()} decision has a named owner, baseline, target, attached evidence, and a recorded continue, revise, or stop decision.`,order:rows.length+index
  })));
  return rows;
}

global.DRIVE_OPERATING_PROFILE=Object.freeze({fields:FIELDS,presets:PRESETS,build,legacyArchetype,completeness,label,summary,execution});
})(window);
