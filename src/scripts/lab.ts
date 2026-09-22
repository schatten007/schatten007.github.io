type FixtureName = 'broken' | 'repaired' | 'unsupported';
const reference = { type: 'object', properties: { location: { $ref: '#/$defs/Location' } }, required: ['location'] };
const fixtures = {
  broken: { label: 'BROKEN ON PURPOSE', input: { name: 'get_weather', inputSchema: reference } },
  repaired: { label: 'FIXED VERSION', input: { name: 'get_weather', inputSchema: { ...reference, $defs: { Location: { type: 'string', minLength: 1 } } } } },
  unsupported: { label: 'OUT OF SCOPE', input: { name: 'get_weather', inputSchema: { type: 'object', properties: { location: { $ref: 'shared.json#/$defs/Location' } }, required: ['location'] } } },
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
  showResult('↳', 'Ready to inspect.', 'Run the check on the selected example.', 'READY TO INSPECT', 'The result applies to this one reference, not the full SchemaSentinel rule set.', 'ready');
}));

run?.addEventListener('click', () => {
  const schema = fixtures[current].input.inputSchema;
  const ref = schema.properties.location.$ref;
  // A one-reference teaching demo, not the full linter.
  if (!ref.startsWith('#/')) {
    showResult('?', 'No trustworthy verdict.', 'This reference points to shared.json. The demo only follows definitions inside the current schema.', 'EXIT 2 / UNSUPPORTED REFERENCE', 'Use a checker that supports external references, or supply the definition locally.', 'unknown');
  } else if (!('$defs' in schema)) {
    showResult('!', 'Missing definition found.', 'location points to #/$defs/Location, but that definition is absent. This is the expected result for the broken example.', 'EXIT 1 / SS-REF-001', 'Fix: restore the $defs block or inline the referenced schema. Select “Restore the definition” and run the check again.', 'error');
  } else {
    showResult('✓', 'The reference resolves.', 'Location is defined as a non-empty string. This example has no dangling-reference finding.', 'EXIT 0 / NO FINDINGS IN THIS EXAMPLE', 'The demo checked one local reference. This does not establish general MCP compliance.', 'success');
  }
});
