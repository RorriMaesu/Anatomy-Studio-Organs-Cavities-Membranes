import { escapeHtml as e } from "./core.js";
import {
  modules,
  corpus,
  retrieve,
  schemaForTutor,
  schemaForQuiz,
  schemaForGrade,
  validateTutor,
  validateQuiz,
  gradeChoice,
  validateGrade,
  tutorMessages,
  quizMessages,
  gradeMessages,
  readSaved,
  validateBackup,
} from "./learning-engine.js";
import { diagrams } from "../chapter3/diagrams.js";
let saved = readSaved(localStorage),
  topic = "membrane",
  conversation = null,
  quiz = null,
  index = 0,
  draft = "",
  tutorDraft = "",
  mode = "socratic",
  diagramIndex = 0;
if(typeof location!=='undefined'){const params=new URLSearchParams(location.search); const requested=params.get('topic');const selected=modules.find(m=>m.id===requested)||modules.find(m=>m.section===params.get('section'))||modules.find(m=>m.chapter===Number(params.get('chapter')));if(selected)topic=selected.id;}
let context = null;
const generator = {
  "quiz-count": "3",
  "quiz-kind": "mixed",
  difficulty: "foundational",
  "quiz-focus": "",
};
function persist() {
  try {
    localStorage.setItem("soma-local-ai-v1", JSON.stringify(saved));
  } catch {
    context.message(
      "Storage is full or unavailable. Export your work before closing.",
      true,
    );
  }
}
function upsert(key, item) {
  const i = saved[key].findIndex((x) => x.id === item.id);
  if (i < 0) saved[key].unshift(item);
  else saved[key][i] = item;
  persist();
}
function starter(){return starters[topic]||modules.find(m=>m.id===topic).starter;}
function topicSection(){return modules.find(m=>m.id===topic).section;}
function topicSelect() {
 const chapter=Number(topicSection().split(".")[0]);
  return `<label for="ai-chapter">Chapter</label><select id="ai-chapter" ${context.busy?"disabled":""}>${[...new Set(modules.map(m=>m.chapter))].map(n=>`<option value="${n}" ${n===chapter?"selected":""}>Chapter ${n}</option>`).join("")}</select><label for="topic">Textbook section</label><select id="topic" ${context.busy ? "disabled" : ""}>${modules.filter(m=>m.chapter===chapter).map((m) => `<option value="${m.id}" ${m.id === topic ? "selected" : ""}>${m.section} · ${e(m.title)}</option>`).join("")}</select>`;
}
function modelSelect() {
  return `<label for="learning-model">Tutor model</label><select id="learning-model" ${context.busy || !context.installed.length ? "disabled" : ""}><option value="">Choose a model in AI settings</option>${context.installed.map((m) => `<option ${m.name === context.chosen ? "selected" : ""} value="${e(m.name)}">${e(m.name)}</option>`).join("")}</select>${!context.ready ? '<p class="muted">Your tutor needs a quick setup before it can answer.</p><button data-tab="setup" class="primary">Set up my tutor</button>' : ""}`;
}
function textbook(module = topic) {
  const m = modules.find((m) => m.id === module);
  const ref = corpus.find((r) => r.module === module);
  return ref
    ? `<div class="textbook-card"><p class="eyebrow">YOUR TEXTBOOK · OPENSTAX</p><a href="${e(ref.url)}" target="_blank" rel="noopener">Read section ${e(m.section)} · ${e(m.title)} ↗</a><p class="muted">Read the original explanation, then return here to practice. Opens online in your browser.</p></div>`
    : "";
}
function links(ids) {
  const refs = (ids || [])
    .map((id) => corpus.find((r) => r.id === id))
    .filter(Boolean);
  const unique = [...new Map(refs.map((r) => [r.url, r])).values()];
  return unique
    .map(
      (r) =>
        `<a class="source" href="${e(r.url)}" target="_blank" rel="noopener">Read this in the textbook · OpenStax ${e(r.section)} ↗</a>`,
    )
    .join("");
}
const starters = {
  membrane: "Why does a cell shrink in a hypertonic solution?",
  organelles: "How do the rough ER and Golgi apparatus work together?",
  nucleus: "Why must DNA be copied before a cell divides?",
  protein: "How does a DNA instruction become a protein?",
  division: "How are mitosis and cytokinesis different?",
  differentiation: "How can cells with the same DNA have different jobs?",
};
function diagram() {
  const d = diagrams[topic]?.[diagramIndex] || diagrams[topic]?.[0];
  if(!d)return `<a class="source" href="${e(modules.find(m=>m.id===topic).studioUrl)}">Explore this section’s lessons and diagrams →</a>`;
  return `<details><summary>Study diagram · ${e(d.title)}</summary><label for="diagram-choice">Diagram</label><select id="diagram-choice">${diagrams[topic].map((f, i) => `<option value="${i}" ${i === diagramIndex ? "selected" : ""}>${e(f.title)}</option>`).join("")}</select><div class="ai-diagram">${d.svg}</div><label for="diagram-target">Highlight a verified structure</label><select id="diagram-target"><option value="">Choose a structure</option>${d.targets.map((t) => `<option value="${e(t.id)}">${e(t.name)}</option>`).join("")}</select><p id="target-info" class="muted"></p><small>Original studio schematic. Select a structure to locate it and ask the tutor about it.</small></details>`;
}
function tutor() {
  const messages = conversation?.messages || [];
  return `<div class="grid"><article class="card"><p class="eyebrow">THINK OUT LOUD</p><h2>Let’s follow your reasoning.</h2><div class="chatlog" role="log" aria-label="Tutor conversation">${messages.length ? messages.map((m) => `<div class="bubble ${m.role === "user" ? "user" : ""}"><strong>${m.role === "user" ? "You" : "Soma · " + e(m.model || conversation.model)}</strong>${e(m.content)}${links(m.sourceIds)}</div>`).join("") : `<p class="muted">We’ll work through one idea at a time. Start with your own question or try this:</p><button id="starter-question" ${context.busy ? "disabled" : ""}>${e(starter())}</button><p class="muted">Ask your tutor guides your reasoning. Give me a hint offers a small nudge. Explain directly gives you the explanation.</p>`}</div><label for="tutor-input">Your question or explanation</label><textarea id="tutor-input" maxlength="3000" placeholder="Tell me what you understand so far…" ${context.busy ? "disabled" : ""}>${e(tutorDraft)}</textarea><div class="row"><button id="send-tutor" class="primary" ${!canAsk() ? "disabled" : ""}>Ask the tutor</button><button id="hint-tutor" ${!canAsk() ? "disabled" : ""}>Give me a hint</button><button id="explain-tutor" ${!canAsk() ? "disabled" : ""}>Explain directly</button>${context.busy ? '<button id="cancel">Cancel</button>' : ""}</div></article><aside class="card">${topicSelect()}${textbook()}${!context.ready ? '<p class="muted">Set up your tutor to start asking questions.</p><button data-tab="setup" class="primary">Set up my tutor</button>' : ""}<details><summary>Tutor settings</summary>${modelSelect()}</details><div class="row"><button id="new-chat" ${context.busy ? "disabled" : ""}>New conversation</button></div><p class="muted">The tutor uses the selected section’s studio references. Chapters 1–2 cover focused essentials, not every textbook detail. Check important explanations against the textbook; AI can make mistakes.</p>${diagram()}</aside></div>`;
}
function canAsk() {
  return context.ready && context.chosen && !context.busy;
}
function quizView() {
  if (!quiz)
    return `<div class="grid"><article class="card"><p class="eyebrow">FRESH QUESTIONS. USEFUL FEEDBACK.</p><h2>Build your next challenge.</h2>${topicSelect()}<details class="quiz-options"><summary>Customize this practice</summary><label for="quiz-focus">Optional focus</label><input id="quiz-focus" maxlength="200" placeholder="For example: osmosis and tonicity"><label for="quiz-count">Questions</label><select id="quiz-count"><option value="3">3 · Quick check</option><option value="5">5 · Focused practice</option></select><label for="quiz-kind">Question format</label><select id="quiz-kind"><option value="mixed">Multiple choice & explanations</option><option value="choice">Multiple choice</option><option value="short">Written explanations</option></select><label for="difficulty">Depth</label><select id="difficulty"><option value="foundational">Foundational understanding</option><option value="application">Apply and predict</option></select></details><p class="muted">Default: 3 questions, a mix of multiple choice and short explanations.</p><div class="row"><button id="generate-quiz" class="primary" ${!canAsk() ? "disabled" : ""}>Generate my quiz</button>${context.busy ? '<button id="cancel">Cancel</button>' : ""}</div></article><aside class="card">${textbook()}${modelSelect()}<h3>A short practice session</h3><p class="muted">Choose a topic and start with three questions. After each answer, see what you understood, what to revisit, and where to read more. Your progress saves automatically.</p><p class="muted">AI-generated practice is separate from the reviewed chapter question bank. You can inspect the answer and rubric after submitting.</p></aside></div>`;
  const q = quiz.questions[index],
    attempt = quiz.attempts[index];
  const all = quiz.attempts.filter(Boolean);
  const scored = all.filter((a) => !a.grade.needsReview);
  const earned = scored.reduce((s, a) => s + a.grade.earned, 0),
    total = scored.reduce((s, a) => s + a.grade.total, 0);
  return `<div class="grid"><article class="card"><p class="eyebrow">GENERATED PRACTICE · ${index + 1} / ${quiz.questions.length}</p><h2>${e(q.prompt)}</h2>${attempt ? `<p class="answer-summary"><b>Your answer:</b> ${e(q.kind === "choice" ? q.options[Number(attempt.answer)] : attempt.answer)}</p>` : q.kind === "choice" ? `<div class="choices">${q.options.map((o, i) => `<label><input type="radio" name="answer" value="${i}" ${String(attempt?.answer ?? draft) === String(i) ? "checked" : ""} ${attempt || context.busy ? "disabled" : ""}>${e(o)}</label>`).join("")}</div>` : `<label for="quiz-answer">Explain in your own words</label><textarea id="quiz-answer" maxlength="5000" ${attempt || context.busy ? "disabled" : ""}>${e(attempt?.answer ?? draft)}</textarea>`}<div class="row"><button id="grade-answer" class="primary" ${attempt || (!canAsk() && q.kind === "short") || context.busy ? "disabled" : ""}>Check my answer</button>${context.busy ? '<button id="cancel">Cancel</button>' : ""}</div>${attempt ? `<div class="feedback">${q.kind==="short"?"<p>AI rubric feedback · provisional assessment</p>":""}<b>${attempt.grade.needsReview ? "Needs review · provisional " + attempt.grade.earned + "/" + attempt.grade.total : attempt.grade.earned + " / " + attempt.grade.total + " points"}</b><p>${e(attempt.grade.feedback)}</p>${(attempt.grade.criteria || []).map((c) => `<p><b>${c.earned ? "✓" : "○"} ${e(q.rubric[c.index])}</b><br>${e(c.reason)}${c.evidence ? "<br>From your answer: “" + e(c.evidence) + "”" : ""}</p>`).join("")}<p><b>Think next:</b> ${e(attempt.grade.followUp)}</p>${links([...q.sourceIds, ...(attempt.grade.sourceIds || [])])}${attempt.previous?.length ? `<details><summary>Previous assessments (${attempt.previous.length})</summary>${attempt.previous.map((p) => `<p>${e(p.model)} · ${e(p.time)}<br>${p.grade.earned}/${p.grade.total} · ${e(p.grade.feedback)}</p>`).join("")}</details>` : ""}<details><summary>Answer, explanation & original rubric</summary><p>${e(q.answer)}</p><p>${e(q.explanation)}</p><ol>${q.rubric.map((r) => `<li>${e(r)}</li>`).join("")}</ol></details><div class="row"><button id="flag-grade" ${attempt.grade.needsReview ? "disabled" : ""}>Flag for review</button>${q.kind === "short" ? `<button id="regrade" ${!canAsk() ? "disabled" : ""}>Reassess original answer</button>` : ""}</div></div>` : ""}</article><aside class="card"><h3>${e(quiz.title)}</h3>${textbook(quiz.topic)}<div class="row"><button id="prev-question" ${index === 0 || context.busy ? "disabled" : ""}>← Previous</button><button id="next-question" ${index === quiz.questions.length - 1 || context.busy ? "disabled" : ""}>Next →</button></div><p class="muted">${all.length} of ${quiz.questions.length} answered.</p><div class="metric"><b>${earned} / ${total}</b>points on assessed answers</div><p class="muted">${all.filter((a) => a.grade.needsReview).length} answers need review and are excluded from the total. Unanswered questions are not scored.</p><small>Generated with ${e(quiz.model)}.</small><details><summary>Model version</summary><code class="path">${e(quiz.modelDigest || "Not recorded")}</code></details>${modelSelect()}<div class="row"><button id="new-quiz" ${context.busy ? "disabled" : ""}>Save & create another</button></div><p class="muted">Your progress saves on this device. Export a backup from Saved work.</p></aside></div>`;
}
function history() {
  return `<article class="card"><p class="eyebrow">STAYS ON THIS DEVICE</p><h2>Your learning notebook.</h2><div class="row"><button id="export-work">Export backup</button><label class="button" for="import-work">Import backup</label><input id="import-work" type="file" accept="application/json" hidden></div><p class="muted">Backups include conversations, generated answer keys, attempts and model details. Browser and desktop storage are separate. Keep a backup before reinstalling.</p><h3>Quizzes</h3>${saved.quizzes.length ? saved.quizzes.map((q) => `<div class="saved"><span>${e(q.title)}<br><small>${new Date(q.created).toLocaleString()} · ${q.attempts.filter(Boolean).length}/${q.questions.length} answered</small></span><button data-open-quiz="${e(q.id)}">Resume / review</button></div>`).join("") : '<p class="muted">No saved quizzes yet.</p>'}<h3>Conversations</h3>${saved.conversations.length ? saved.conversations.map((c) => `<div class="saved"><span>${e(c.messages.find((m) => m.role === "user")?.content.slice(0, 90) || "Conversation")}<br><small>${new Date(c.created).toLocaleString()}</small></span><button data-open-chat="${e(c.id)}">Open</button></div>`).join("") : '<p class="muted">No saved conversations yet.</p>'}</article>`;
}
export function renderLearning(ctx) {
  context = ctx;
  ctx.panel.innerHTML =
    ctx.tab === "tutor" ? tutor() : ctx.tab === "quiz" ? quizView() : history();
  for (const [id, value] of Object.entries(generator)) {
    const field = ctx.panel.querySelector("#" + id);
    if (field) {
      field.value = value;
      field.disabled = ctx.busy;
    }
  }
  const log = ctx.panel.querySelector(".chatlog");
  if (log) log.scrollTop = log.scrollHeight;
}
async function askValidated(messages, format, validate) {
  const first = await ask(messages, format);
  try {
    return validate(first);
  } catch (err) {
    context.message(
      "Checking the response format and requesting one correction…",
    );
    const repaired = await ask(
      [
        ...messages,
        { role: "assistant", content: JSON.stringify(first) },
        {
          role: "user",
          content:
            "Correct the structure of your previous response. Validation error: " +
            err.message +
            ". Preserve the source constraints and return the complete JSON object.",
        },
      ],
      format,
    );
    return validate(repaired);
  }
}
async function ask(messages, format) {
  const res = await context.invoke("chat", {
    model: context.chosen,
    messages,
    format,
  });
  const content = res.message?.content;
  if (!content)
    throw Error("The model returned no answer. Try another local model.");
  try {
    return JSON.parse(content);
  } catch {
    throw Error(
      "The model did not return valid structured output. Retry or select another model.",
    );
  }
}
async function tutorAction(action) {
  context.message(
    "Thinking with your local model… The first response may take longer while it loads.",
  );
  const user =
    tutorDraft.trim() ||
    (action === "hint-tutor"
      ? "Give me a small hint about the last question."
      : action === "explain-tutor"
        ? "Explain the last idea directly."
        : "");
  if (!user) throw Error("Enter a question or explanation first.");
  if (!conversation)
    conversation = {
      id: crypto.randomUUID(),
      created: new Date().toISOString(),
      topic,
      model: context.chosen,
      messages: [],
    };
  const refs = retrieve(
    user +
      " " +
      conversation.messages
        .slice(-2)
        .map((m) => m.content)
        .join(" "),
    topic,
  );
  mode =
    action === "explain-tutor"
      ? "explain"
      : action === "hint-tutor"
        ? "hint"
        : "socratic";
  const result = await askValidated(
    tutorMessages(user, conversation.messages, refs, mode),
    schemaForTutor(refs),
    (v) => validateTutor(v, refs),
  );
  conversation.messages.push(
    { role: "user", content: user },
    {
      role: "assistant",
      content: result.reply,
      sourceIds: result.sourceIds,
      model: context.chosen,
    },
  );
  tutorDraft = "";
  upsert("conversations", conversation);
  context.message("Response saved locally.");
}
async function grade(reassess = false) {
  context.message("Checking your answer against the saved rubric…");
  const q = quiz.questions[index];
  const answer = reassess ? quiz.attempts[index].answer : draft;
  if (answer === "" || answer === null || answer === undefined)
    throw Error("Answer the question first.");
  const refs = corpus.filter((r) => q.sourceIds.includes(r.id));
  const grade =
    q.kind === "choice"
      ? gradeChoice(q, Number(answer))
      : await askValidated(
          gradeMessages(q, String(answer), refs),
          schemaForGrade(refs, q),
          (v) => validateGrade(v, q, String(answer), refs),
        );
  const previous = quiz.attempts[index];
  quiz.attempts[index] = {
    answer,
    grade,
    model: context.chosen,
    time: new Date().toISOString(),
    previous: previous
      ? [
          ...(previous.previous || []),
          { grade: previous.grade, model: previous.model, time: previous.time },
        ]
      : [],
  };
  upsert("quizzes", quiz);
  context.message(
    grade.needsReview
      ? "Saved with a review flag. This score is excluded from the total."
      : "Answer and feedback saved.",
  );
}
export async function learningClick(b) {
  const id = b.id;
  if (id === "starter-question") {
    tutorDraft = starter();
    context.render();
    context.panel.querySelector("#tutor-input")?.focus?.();
    return true;
  }
  if (b.dataset.openQuiz) {
    quiz = saved.quizzes.find((q) => q.id === b.dataset.openQuiz);
    topic = quiz.topic;
    index = 0;
    draft = quiz.drafts?.[0] || "";
    context.setTab("quiz");
    return true;
  }
  if (b.dataset.openChat) {
    conversation = saved.conversations.find((c) => c.id === b.dataset.openChat);
    topic = conversation.topic;
    context.setTab("tutor");
    return true;
  }
  if (["send-tutor", "hint-tutor", "explain-tutor"].includes(id)) {
    await context.work(() => tutorAction(id));
    return true;
  }
  if (id === "new-chat") {
    conversation = null;
    tutorDraft = "";
    context.render();
    return true;
  }
  if (id === "generate-quiz") {
    const count = Number(document.querySelector("#quiz-count").value),
      kind = document.querySelector("#quiz-kind").value,
      difficulty = document.querySelector("#difficulty").value,
      focus = document.querySelector("#quiz-focus").value.trim();
    await context.work(async () => {
      context.message("Creating questions and their answer keys…");
      const refs = focus
        ? retrieve(focus, topic, 7)
        : corpus
            .filter((r) => r.module === topic)
            .map((r) => ({ r, order: Math.random() }))
            .sort((a, b) => a.order - b.order)
            .slice(0, 7)
            .map((x) => x.r);
      const batches =
        kind === "mixed"
          ? [
              { kind: "choice", count: Math.ceil(count / 2) },
              { kind: "short", count: Math.floor(count / 2) },
            ]
          : [{ kind, count }];
      const parts = [];
      for (const batch of batches) {
        context.message(
          `Creating ${batch.count} ${batch.kind === "short" ? "written-answer" : "multiple-choice"} questions and their rubrics…`,
        );
        parts.push(
          await askValidated(
            quizMessages(refs, batch.count, batch.kind, difficulty),
            schemaForQuiz(refs, batch.count, batch.kind),
            (v) => validateQuiz(v, refs, batch.count, batch.kind),
          ),
        );
      }
      const result = validateQuiz(
        { title: parts[0].title, questions: parts.flatMap((p) => p.questions) },
        refs,
        count,
        kind,
      );
      quiz = {
        ...result,
        id: crypto.randomUUID(),
        created: new Date().toISOString(),
        topic,
        model: context.chosen,
        modelDigest:
          context.installed.find((m) => m.name === context.chosen)?.digest ||
          "",
        attempts: [],
        schemaVersion: 1,
      };
      index = 0;
      draft = "";
      upsert("quizzes", quiz);
      context.message(
        "Quiz saved. The answer key is now fixed for this attempt.",
      );
    });
    return true;
  }
  if (id === "grade-answer" || id === "regrade") {
    await context.work(() => grade(id === "regrade"));
    return true;
  }
  if (id === "flag-grade") {
    quiz.attempts[index].grade.needsReview = true;
    upsert("quizzes", quiz);
    context.render();
    return true;
  }
  if (id === "prev-question" || id === "next-question") {
    index += id === "next-question" ? 1 : -1;
    draft = quiz.drafts?.[index] || "";
    context.render();
    return true;
  }
  if (id === "new-quiz") {
    quiz = null;
    draft = "";
    context.render();
    return true;
  }
  if (id === "export-work") {
    const blob = new Blob(
      [
        JSON.stringify(
          { format: "soma-local-ai", version: 1, ...saved },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "soma-local-learning-backup.json";
    a.click();
    context.message("Backup download requested. Check your Downloads folder.");
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    return true;
  }
  return false;
}
export async function learningChange(ev) {
  const t = ev.target;
  if (Object.hasOwn(generator, t.id)) generator[t.id] = t.value;
  if(t.id === "ai-chapter"){topic=modules.find(m=>m.chapter===Number(t.value)).id;conversation=null;diagramIndex=0;tutorDraft="";context.render();}
  if (t.id === "topic") {
    topic = t.value;
    conversation = null;
    diagramIndex = 0;
    tutorDraft = "";
    context.render();
  }
  if (t.id === "tutor-input") tutorDraft = t.value;
  if (t.id === "quiz-answer" || t.name === "answer") {
    draft = t.value;
    if (quiz) {
      quiz.drafts ??= {};
      quiz.drafts[index] = draft;
      upsert("quizzes", quiz);
    }
  }
  if (t.id === "diagram-choice") {
    diagramIndex = Number(t.value);
    context.render();
    context.panel.querySelector("details").open = true;
  }
  if (t.id === "diagram-target") {
    const d = diagrams[topic][diagramIndex];
    const target = d.targets.find((x) => x.id === t.value);
    const holder = context.panel.querySelector(".ai-diagram");
    holder.innerHTML = d.svg;
    if (target) {
      holder
        .querySelector("svg")
        .insertAdjacentHTML(
          "beforeend",
          `<circle cx="${target.x * 8}" cy="${target.y * 5.2}" r="18" fill="none" stroke="#ffffff" stroke-width="4"/>`,
        );
      context.panel.querySelector("#target-info").textContent =
        target.name + ": " + target.description;
      tutorDraft =
        "Help me understand " +
        target.name +
        " and how its structure relates to its function.";
      const input = context.panel.querySelector("#tutor-input");
      if (input) input.value = tutorDraft;
    }
  }
  if (t.id === "import-work") {
    try {
      const file = t.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024)
        throw Error("Choose a backup smaller than 10 MB.");
      const v = JSON.parse(await file.text());
      validateBackup(v);
      for (const key of ["conversations", "quizzes"])
        for (const item of v[key]) {
          if (!saved[key].some((x) => x.id === item.id)) saved[key].push(item);
        }
      persist();
      context.message("Backup imported; existing records kept.");
      context.render();
    } catch (err) {
      context.message(err.message, true);
    }
  }
}

export const getLearningTopic=()=>topic;
