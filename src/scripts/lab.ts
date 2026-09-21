type FixtureName = 'broken' | 'repaired' | 'unsupported';
const reference = { type: 'object', properties: { location: { $ref: '#/$defs/Location' } }, required: ['location'] };
const fixtures = {
  broken: { label: 'DANGLING REFERENCE', input: { name: 'get_weather', inputSchema: reference } },
  repaired: { label: 'LOCAL DEFINITION RESTORED', input: { name: 'get_weather', inputSchema: { ...reference, $defs: { Location: { type: 'string', minLength: 1 } } } } },
  unsupported: { label: 'EXTERNAL REFERENCE', input: { name: 'get_weather', inputSchema: { type: 'object', properties: { location: { $ref: 'shared.json#/$defs/Location' } }, required: ['location'] } } },
};
let current: FixtureName = 'broken';
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-fixture]');
const code = document.querySelector<HTMLElement>('[data-fixture-code]');
const label = document.querySelector<HTMLElement>('[data-fixture-label]');
const result = document.querySelector<HTMLElement>('[data-lab-result]');
const run = document.querySelector<HTMLButtonElement>('[data-run-fixture]');

function showResult(symbol: string, title: string, description: string, status: string, detail: string, state: string) {
  if (!result) return;
  result.replaceChildren();
  result.dataset.state = state;
  const icon = document.createElement('span');
  icon.className = 'result-symbol';
  icon.textContent = symbol;
  icon.setAttribute('aria-hidden', 'true');
  const heading = document.createElement('h3');
  heading.textContent = title;
  const paragraph = document.createElement('p');
  paragraph.textContent = description;
  const outcome = document.createElement('span');
  outcome.className = 'result-code mono';
  outcome.textContent = status;
  const explanation = document.createElement('p');
  explanation.className = 'result-detail';
  explanation.textContent = detail;
  result.append(icon, heading, paragraph, outcome, explanation);
}

buttons.forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.fixture;
  if (!key || !(key in fixtures)) return;
  current = key as FixtureName;
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  if (code) code.textContent = JSON.stringify(fixtures[current].input, null, 2);
  if (label) label.textContent = fixtures[current].label;
  showResult('↳', 'New input. New question.', 'Inspect this fixture to see whether its reference can be followed.', 'READY TO INSPECT', 'Each result applies only to the selected teaching example.', 'ready');
}));

run?.addEventListener('click', () => {
  const schema = fixtures[current].input.inputSchema;
  const ref = schema.properties.location.$ref;
  // Intentionally a one-reference explainer, not a replacement for the full linter.
  if (!ref.startsWith('#/')) {
    showResult('?', 'No trustworthy verdict.', 'This reference points outside the current document. A local-only check cannot follow it.', 'EXIT 2 / UNSUPPORTED REFERENCE', 'Next step: inspect the external definition with a tool that supports it, or supply a self-contained local schema.', 'unknown');
  } else if (!('$defs' in schema)) {
    showResult('!', 'The contract is broken.', 'The location field points to #/$defs/Location, but that definition is absent.', 'EXIT 1 / SS-REF-001', 'Fix: restore the $defs block or inline the referenced schema. Try “Restore the definition” to inspect the repaired fixture.', 'error');
  } else {
    showResult('✓', 'This reference holds up.', 'Location resolves to a local definition: a non-empty string. The dangling-reference check has no finding.', 'EXIT 0 / NO FINDINGS IN THIS EXAMPLE', 'A narrow pass: this teaching check followed one local reference. It does not establish general MCP compliance.', 'success');
  }
});
