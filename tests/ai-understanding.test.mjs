import test from 'node:test';
import assert from 'node:assert/strict';
import {retrieve,validateGrade,validateTutor,schemaForTutor,gradeMessages,tutorMessages,quizMessages} from '../dist/local-ai/learning-engine.js';
const refs=retrieve('osmosis','membrane');
const q={prompt:'Explain why the cell shrinks.',answer:'Water leaves the cell by osmosis.',rubric:['Water moves out of the cell.','Net water movement is due to the solute difference.']};
test('student spelling is preserved as evidence while semantic credit and partial understanding are accepted',()=>{
 const answer='Watre moves out of teh cell.';
 const grade=validateGrade({needsReview:false,criteria:[{index:0,earned:true,evidence:answer,reason:'Clearly describes outward water movement despite spelling errors.'},{index:1,earned:false,evidence:'',reason:'The cause was not explained.'}],feedback:'Your direction is correct. Explain the solute difference next.',followUp:'Why does water move out?',sourceIds:[refs[0].id]},q,answer,refs);
 assert.equal(grade.earned,1);assert.equal(grade.total,2);assert.equal(grade.needsReview,false);
 const prompt=gradeMessages(q,answer,refs)[0].content;
 for(const term of ['spelling','paraphrases','ambiguous','alternative defensible answer','preserving their original spelling','not a required phrase'])assert.ok(prompt.includes(term));
});
test('general tutor answers need no fabricated citation while quiz citations remain mandatory',()=>{
 assert.equal(schemaForTutor(refs).properties.sourceIds.minItems,0);
 assert.equal(validateTutor({reply:'A general explanation.',basis:'general',sourceIds:[]},refs).basis,'general');
 assert.throws(()=>validateTutor({reply:'Claimed textbook explanation.',basis:'references',sourceIds:[]},refs));
 assert.throws(()=>validateTutor({reply:'Explanation.',basis:'mixed',sourceIds:['invented']},refs));
 assert.match(tutorMessages('A question outside this chapter',[],refs,'socratic')[0].content,/Students may ask any question/);
 assert.match(quizMessages(refs,3,'short','foundational')[0].content,/Work only from/);
});
