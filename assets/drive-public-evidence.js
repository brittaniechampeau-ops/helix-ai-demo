(function(global){
'use strict';
const QUERY_TYPES={
  position:'positioning offers target customers case studies',
  proof:'customer results awards reviews partnerships',
  market:'market category competitors buyer priorities',
  motion:'sales channels partners hiring expansion go-to-market',
  risk:'regulation operational risks implementation barriers'
};
const RELIABILITY={'company-owned':55,'partner-or-investor':70,'independent-third-party':80,'customer-evidence':85,'regulatory-or-primary':90};
function plan(context={},profile={}){const name=context.organizationName||context.clientName||'organization',industry=context.industry||'',d=profile.dimensions||{},market=global.DRIVE_OPERATING_PROFILE?.label('marketCondition',d.marketCondition)||'',motion=global.DRIVE_OPERATING_PROFILE?.label('revenueMotion',d.revenueMotion)||'';return Object.entries(QUERY_TYPES).map(([type,terms],index)=>({id:`${type}-${index+1}`,type,query:`${name} ${industry} ${terms} ${market} ${motion}`.replace(/\s+/g,' ').trim(),purpose:{position:'Test whether public positioning, buyer, and offers are coherent',proof:'Identify existing proof so DRIVE does not recommend recreating it',market:'Understand external category and buyer context',motion:'Find evidence of the active commercial motion and expansion priorities',risk:'Identify constraints that may change intervention sequencing'}[type]}))}
function normalize(raw={}){return{version:'1.0',status:raw.status||'proposed',id:raw.id||`public-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,claim:String(raw.claim||raw.observation||'').trim(),observation:String(raw.observation||raw.claim||'').trim(),sourceUrl:String(raw.sourceUrl||raw.url||'').trim(),sourceTitle:String(raw.sourceTitle||raw.title||'').trim(),publisher:String(raw.publisher||'').trim(),publishedAt:String(raw.publishedAt||'').trim(),retrievedAt:raw.retrievedAt||new Date().toISOString(),evidenceType:RELIABILITY[raw.evidenceType]?raw.evidenceType:'independent-third-party',reliability:RELIABILITY[raw.evidenceType]||65,relationship:['confirms','contradicts','contextualizes'].includes(raw.relationship)?raw.relationship:'contextualizes',effect:['supports','demonstrates','contradicts'].includes(raw.effect)?raw.effect:'supports',capabilities:Array.isArray(raw.capabilities)?raw.capabilities.filter(Boolean):[],query:raw.query||''}}
function accepted(research){return(research?.findings||[]).map(normalize).filter(x=>x.status==='accepted')}
function forCapability(research,capability){return accepted(research).filter(x=>x.capabilities.includes(capability))}
global.DRIVE_PUBLIC_EVIDENCE=Object.freeze({queryTypes:QUERY_TYPES,reliability:RELIABILITY,plan,normalize,accepted,forCapability});
})(window);
