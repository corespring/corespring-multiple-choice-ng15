import legacyController from 'corespring-legacy-multiple-choice/src/server/index'

/** 
 * For the documentation of pie controllers see
 * https://pielabs.github.io/pie-docs/developing/controller.html
 */

let createOutcome = (question, session) => {
  return legacyController.createOutcome(question, session.value.answers, {
    showFeedback: true,
    highlightCorrectResponse: true,
    highlightUserResponse: true
  });
}

export function outcome(question, session, env) {
  const legacyOutcome = createOutcome(question, session)
  const raw = legacyOutcome.score;
  const min = 0;
  const max = 1;
  const scaled = (raw - min) / (max - min) + min;

  const id = question.id;
  const score = {
    scaled, raw, min, max
  };
  const completed = true;
  const duration = "PT1M"; //one minute, see https://en.wikipedia.org/wiki/ISO_8601#Durations
  const extensions = {}; //optional, see docs in the link above
  const outcome = {
    id, score, completed, duration, extensions
  };

  return Promise.resolve(outcome);
}

export function model(question, session, env) {
  let result = {
    question, env
  };

  if (env.mode === 'evaluate') {
    result.response = createOutcome(question, session);
  }
  return Promise.resolve(result);
}