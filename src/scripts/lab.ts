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
  showResult('↳', 'New file. Run it again.', 'Press “Run the check” on this version and read what comes back.', 'READY TO INSPECT', 'Each result is only about the file on the left. Nothing here runs the full SchemaSentinel CLI.', 'ready');
}));

run?.addEventListener('click', () => {
  const schema = fixtures[current].input.inputSchema;
  const ref = schema.properties.location.$ref;
  // A one-reference teaching demo, not the full linter.
  if (!ref.startsWith('#/')) {
    showResult('?', 'No trustworthy verdict.', 'This points to shared.json, a different file. This demo only follows references inside the file, so it cannot say if that one is good or bad.', 'EXIT 2 / UNSUPPORTED REFERENCE', 'Next step: open the other file with a tool that supports external references, or copy the definition into this schema.', 'unknown');
  } else if (!('$defs' in schema)) {
    showResult('!', 'Yes — broken, as advertised.', 'location points to #/$defs/Location, but there is no $defs block in this file. The checker stops here.', 'EXIT 1 / SS-REF-001', 'Fix: restore the $defs block or inline the referenced schema. Try fixture 02 next — the same file with the definition put back.', 'error');
  } else {
    showResult('✓', 'This one passes the narrow check.', 'Same file, but Location is now defined as a non-empty string. The reference resolves, so there is nothing to report.', 'EXIT 0 / NO FINDINGS IN THIS EXAMPLE', 'Narrow means narrow: this only checks the one local reference. It says nothing about MCP compliance in general.', 'success');
  }
});
