import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ANTHROPIC_API_KEY=Deno.env.get('ANTHROPIC_API_KEY')!
const corsHeaders={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Content-Type':'application/json'}
const CAPABILITIES=['authority','referrals','qualification','positioning','sales-process','demand','conversion','segmentation','outbound','ecosystem-positioning','partner-enablement','co-sell','activation','adoption','retention','enterprise-positioning','buying-committee','sales-handoffs','demand-capture','booking','capacity','market-localization','credibility','beachhead-pipeline','outcomes','expansion','constraint-diagnosis','handoffs','measurement','governance','operating-model','portfolio-measurement']
const capabilitySet=new Set(CAPABILITIES)

function authenticated(req:Request){
  try{const token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,''),segment=token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'),payload=JSON.parse(atob(segment.padEnd(Math.ceil(segment.length/4)*4,'=')));return payload.role==='authenticated'&&!!payload.sub}catch(_){return false}
}

serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders})
  try{
    if(!authenticated(req))return new Response(JSON.stringify({error:'Authenticated advisor access is required'}),{status:401,headers:corsHeaders})
    const {organizationName,website='',industry='',profile={},queries=[]}=await req.json()
    if(!organizationName||!Array.isArray(queries)||!queries.length)return new Response(JSON.stringify({error:'organizationName and queries are required'}),{status:400,headers:corsHeaders})
    const response=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},body:JSON.stringify({
      model:'claude-sonnet-4-6',max_tokens:5000,tools:[{type:'web_search_20250305',name:'web_search',max_uses:6}],
      system:`You are conducting bounded public-source due diligence for a GTM advisor. Search only for information relevant to the supplied research plan. Distinguish company-owned claims from independent evidence. Do not infer that an absent public claim means the capability does not exist. Do not collect personal contact details. Return one internally consistent JSON object and no markdown. Every finding must cite a real source URL returned by search. Never describe a claim as independently verified unless an independent source is cited.`,
      messages:[{role:'user',content:`Organization: ${organizationName}\nWebsite: ${website}\nIndustry: ${industry}\nOperating profile: ${JSON.stringify(profile)}\nResearch plan: ${JSON.stringify(queries)}\nAllowed DRIVE capabilities: ${CAPABILITIES.join(', ')}\n\nReturn exactly:\n{"summary":"","findings":[{"id":"","claim":"","observation":"","sourceUrl":"","sourceTitle":"","publisher":"","publishedAt":"","evidenceType":"company-owned|partner-or-investor|independent-third-party|customer-evidence|regulatory-or-primary","relationship":"confirms|contradicts|contextualizes","effect":"supports|demonstrates|contradicts","capabilities":[""],"query":""}],"limitations":[""]}\nUse only the allowed DRIVE capability strings. Omit a finding if it cannot be connected to one of them. Effect meanings: supports means the source increases confidence that an intervention is needed; demonstrates means credible evidence shows the capability already exists and should suppress redundant work; contradicts means the source conflicts with the internal narrative and requires advisor validation.`}]
    })})
    if(!response.ok)throw new Error(`Claude web research failed (${response.status}): ${await response.text()}`)
    const data=await response.json(),text=(data.content||[]).filter((x:any)=>x.type==='text').map((x:any)=>x.text).join('\n').trim(),stripped=text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim(),match=stripped.match(/\{[\s\S]*\}/)
    if(!match)throw new Error('No JSON research result returned')
    const result=JSON.parse(match[0]);result.findings=(result.findings||[]).map((x:any)=>({...x,capabilities:(Array.isArray(x.capabilities)?x.capabilities:[]).filter((cap:string)=>capabilitySet.has(cap)),status:'proposed',retrievedAt:new Date().toISOString()})).filter((x:any)=>x.sourceUrl&&x.capabilities.length);result.generatedAt=new Date().toISOString();result.organizationName=organizationName
    return new Response(JSON.stringify(result),{headers:corsHeaders})
  }catch(error){console.error(error);return new Response(JSON.stringify({error:String(error)}),{status:500,headers:corsHeaders})}
})
