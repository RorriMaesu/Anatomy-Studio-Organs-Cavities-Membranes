# AI learning review — September 29, 2026

1. Entry: each published chapter passes its section to the shared tutor. Generated quizzes stay within that section's authored references.
2. Questions: students may ask any question. Tutor retrieval now searches all published chapters. General knowledge is allowed and explicitly labeled; no live web search or invented textbook citations. References are not proof that the model's interpretation is correct.
3. Teaching: identify the student's reasoning, offer useful explanations and hints, and ask a focused next question. Do not force unrelated questions back to a chapter.
4. Assessment: multiple choice uses its saved key. Written answers are assessed against independent concept criteria, not exact model-answer wording. Accept clear typos, synonyms, equivalent examples and paraphrases. Important scientific distinctions must not be silently corrected.
5. Feedback: explain correct ideas, missing details and misconceptions. Ambiguous answers and flawed rubrics need review. Uncertain scores are excluded from the total. Students can flag, reassess or discuss an answer with the tutor without losing the original attempt.
6. Evidence: earned credit quotes original student wording. If the model silently corrects spelling in its quote, the assessment is flagged with an explicit explanation that the flag concerns the model's quotation, not the student's understanding.

## Actual local-model checks

Tested with installed qwen3.5:4b-q4_K_M through the same browser transport module, invoked from Node against localhost. This is not proof of successful GitHub Pages browser permissions: the in-app browser connection timed out.

- Misspelled correct explanation: 2/2. One run preserved quotes; another corrected a quote and was conservatively flagged for review.
- Correct paraphrase: 2/2. Initial output omitted a follow-up; tightened schema then produced one.
- Missing volume-change explanation: 1/2, with a specific explanation of the missing concept.
- Reversed movement and volume: 0/2, with correction.
- Ambiguous pronouns/direction: final run flagged for clarification and excluded from scored total. Initial run failed to flag its own stated ambiguity; an additional conservative check now catches such inconsistencies.
- Study-schedule question: answered as general knowledge without fabricated source IDs.

90 automated tests pass, including semantic-credit data handling, source separation, existing scoring, transport and studio behavior. These are small qualitative checks, not a measured accuracy guarantee. Local models remain fallible, particularly small models. Broader repeated evaluations with instructor-reviewed answers remain valuable.
