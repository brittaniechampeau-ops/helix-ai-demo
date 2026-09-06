import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context={window:{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../assets/scaler-model.js',import.meta.url),'utf8'),context);
const M=context.window.SCALER_MODEL;

assert.equal(M.DIMENSIONS.length,5);
assert.equal(Object.keys(M.QUESTION_MAP).length,27);
assert.equal(M.ROUTE.length,5);

const empty=M.emptyState();
for(const summary of M.summaries(empty)){
  assert.equal(summary.score,null,'Unknowns must not become low scores');
  assert.equal(summary.coverage,0);
}

empty.assessments.s1.final=5;
empty.assessments.s2.final=1;
assert.equal(M.dimensionSummary(empty,'S').score,60);
assert.equal(M.dimensionSummary(empty,'S').known,2);

empty.assessments.a3.final=1;
assert.equal(M.effectiveScore('a3',empty.assessments.a3),5,'reverse-scored evidence must invert only at calculation');

assert.deepEqual(Array.from(M.routeWorkstreams(['A']).slice(0,3)),['ICP','Buying group','Positioning']);
assert.ok(M.routeWorkstreams(['S','A']).includes('Revenue path'));
assert.ok(M.routeWorkstreams(['S','A']).includes('Pricing and offers'));

assert.equal(M.validateEvidence({questionId:'s1',direction:'supports',sourceId:'x',excerpt:'quote',confidence:'high'}),true);
assert.equal(M.validateEvidence({questionId:'s1',direction:'supports',sourceId:'x',excerpt:'',confidence:'high'}),false);

const diagnosis=M.emptyState();
assert.ok(M.validateForDiagnosis(diagnosis).length>=4);
diagnosis.constraint.failure='Deals stall after proposals.';
diagnosis.constraint.binding='Proof is not reusable.';
diagnosis.constraint.primaryObject='Proof system';
diagnosis.constraint.causalChain='Every deal must recreate trust live.';
diagnosis.constraint.disproof='Recent deals advance without founder explanation.';
diagnosis.constraint.supportingEvidenceIds=['e1'];
diagnosis.evidence=[{id:'e1',sourceId:'source-1'}];
diagnosis.constraint.candidates=[{id:'c1'},{id:'c2'}];
diagnosis.constraint.whyNotLowest='The lowest score is a downstream symptom of missing reusable proof.';
assert.equal(M.validateForDiagnosis(diagnosis).length,0);
assert.equal(M.diagnosisReadiness(diagnosis).hypothesisReady,true);
assert.equal(M.diagnosisReadiness(diagnosis).finalReady,false);

const app=fs.readFileSync(new URL('../assets/scaler-app.js',import.meta.url),'utf8');
assert.ok(app.includes('const rawSources=new Map()'));
assert.ok(app.includes('function persistedState()'));
assert.ok(!/persistedState\(\)[\s\S]{0,200}rawSources/.test(app),'raw source text must not be added to persisted state');

console.log('SCALER model tests passed');
