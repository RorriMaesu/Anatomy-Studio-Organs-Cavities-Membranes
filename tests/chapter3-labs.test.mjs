import test from 'node:test';
import assert from 'node:assert/strict';
import {complementaryDNA,transcribeTemplate,translateExample,tonicityEffect,divisionStages,secretionRoute,potencyModels,lineageAllowed,renderLab,bindLab} from '../dist/chapter3/labs.js';

test('osmosis responds to nonpenetrating-solute gradient, including dynamic equilibrium',()=>{
  assert.equal(tonicityEffect(150).direction,'in');
  assert.equal(tonicityEffect(150).change,'swells');
  assert.equal(tonicityEffect(600).direction,'out');
  assert.equal(tonicityEffect(600).change,'shrinks');
  assert.equal(tonicityEffect(300).direction,'balanced');
  assert.match(tonicityEffect(300).explanation,/still crosses in both directions/);
  assert.throws(()=>tonicityEffect(0));
});
test('DNA complements and transcription preserve explicit antiparallel strand convention',()=>{
  assert.equal(complementaryDNA('ATGCCA'),'TACGGT');
  assert.equal(complementaryDNA(complementaryDNA('ATGCCA')),'ATGCCA');
  assert.equal(transcribeTemplate('TACGGACTTATT'),'AUGCCUGAAUAA');
  assert.throws(()=>complementaryDNA('AUCG'));
  assert.throws(()=>transcribeTemplate('<script>'));
});
test('worked translation releases at a stop codon without adding a stop amino acid',()=>{
  assert.deepEqual(translateExample('AUGCCUGAAUAA'),['Met','Pro','Glu']);
  assert.deepEqual(translateExample('AUGUAACCU'),['Met']);
  assert.throws(()=>translateExample('AUGC'));
});
test('chromosome count remains stable through replication; sisters count independently after separation',()=>{
  const stage=id=>divisionStages.find(v=>v.id===id);
  assert.equal(stage('g1').chromosomes,stage('s').chromosomes);
  assert.equal(stage('s').dna,stage('g1').dna*2);
  assert.equal(stage('metaphase').chromosomes,4);
  assert.equal(stage('anaphase').chromosomes,8);
  assert.equal(stage('anaphase').dna,stage('metaphase').dna);
  assert.equal(stage('cytokinesis').chromosomes,stage('g1').chromosomes);
  assert.match(stage('telophase').count,/per nucleus/);
  assert.match(stage('cytokinesis').count,/per daughter cell/);
});
test('secretion sequence separates message, synthesis, processing and export in the correct order',()=>{
  assert.deepEqual(secretionRoute,['nucleus','ribosome','er','transport','golgi','secretory','membrane']);
});
test('potency examples distinguish extraembryonic tissue, blood lineages and self-restricted fate',()=>{
  assert.equal(lineageAllowed('totipotent','placental'),true);
  assert.equal(lineageAllowed('pluripotent','placental'),false);
  assert.equal(lineageAllowed('pluripotent','neuron'),true);
  assert.equal(lineageAllowed('multipotent','red'),true);
  assert.equal(lineageAllowed('multipotent','neuron'),false);
  assert.equal(lineageAllowed('oligopotent','red'),false);
  assert.equal(lineageAllowed('oligopotent','b'),true);
  assert.deepEqual(potencyModels.unipotent.allowed,['muscle']);
});
test('all six process labs provide interactive button controls and safe fallback markup',()=>{
  for(const id of ['membrane','organelles','nucleus','protein','division','differentiation']){
    const html=renderLab(id);
    assert.match(html,/data-lab-action=/);
    assert.match(html,/role="status"/);
    assert.doesNotMatch(html,/<script/i);
  }
  assert.doesNotMatch(renderLab('<img src=x onerror=alert(1)>'),/<img/);
});

// Minimal event boundary: validates the same actions used by keyboard-accessible
// HTML buttons without requiring a browser or exposing internal app state.
function labHarness(id) {
  let handler;
  const root={innerHTML:renderLab(id),matches:()=>true,contains:()=>true,querySelectorAll:()=>[],querySelector:()=>null,
    addEventListener:(_,fn)=>handler=fn,removeEventListener:(_,fn)=>{if(handler===fn)handler=undefined;}};
  const cleanup=bindLab(root,id);
  return {root,cleanup,click(action,value='') {
    const control={dataset:{labAction:action,labValue:String(value)},disabled:false};
    handler?.({target:{closest:()=>control}});
  }};
}
test('DNA bench rejects mismatches, finishes the complementary strand, and detaches on cleanup',()=>{
  const lab=labHarness('nucleus');
  lab.click('dna-add','A');
  assert.match(lab.root.innerHTML,/Try another base/);
  assert.match(lab.root.innerHTML,/0 \/ 6/);
  for(const base of 'TACGGT')lab.click('dna-add',base);
  assert.match(lab.root.innerHTML,/6 \/ 6/);
  assert.match(lab.root.innerHTML,/One daughter DNA molecule is complete/);
  lab.cleanup();
  const before=lab.root.innerHTML;
  lab.click('reset');
  assert.equal(lab.root.innerHTML,before);
});
test('protein bench transitions from transcription to translation and ends without a stop residue',()=>{
  const lab=labHarness('protein');
  lab.click('transcribe','CCU');
  assert.match(lab.root.innerHTML,/Check the base pairs/);
  for(const codon of ['AUG','CCU','GAA','UAA'])lab.click('transcribe',codon);
  assert.match(lab.root.innerHTML,/Translation ·/);
  for(const amino of ['Met','Pro','Glu','Stop'])lab.click('translate',amino);
  assert.match(lab.root.innerHTML,/Protein released: Met–Pro–Glu/);
  assert.doesNotMatch(lab.root.innerHTML,/<span>Stop<\/span>/);
  assert.match(lab.root.innerHTML,/✓ Released/);
});
