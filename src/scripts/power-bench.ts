import { chartPoint, modelPower, powerCurve, type CoolingProfile } from '../lib/power-model';

const consoleElement = document.querySelector<HTMLElement>('[data-power-console]');
const slider = document.querySelector<HTMLInputElement>('#power-limit');
let cooling: CoolingProfile = 'balanced';

function update() {
  if (!consoleElement || !slider) return;
  const result = modelPower(Number(slider.value), cooling);
  const point = chartPoint(result.power, result.throughput);
  const powerLabel = document.querySelector('#power-output');
  const throughput = consoleElement.querySelector('[data-throughput]');
  const sustained = consoleElement.querySelector('[data-sustained]');
  const verdict = consoleElement.querySelector('[data-power-verdict]');
  if (powerLabel) powerLabel.textContent = `${result.power} W`;
  if (throughput) {
    throughput.replaceChildren(document.createTextNode(String(result.throughput)), Object.assign(document.createElement('span'), { textContent: 'pt' }));
  }
  if (sustained) {
    sustained.replaceChildren(document.createTextNode(String(result.sustained)), Object.assign(document.createElement('span'), { textContent: 'W' }));
  }
  if (verdict) verdict.textContent = `${result.power} W requested, ${result.sustained} W sustained. ${result.limited ? 'Cooling-limited' : 'Within the ' + result.cooling + ' W cooling budget'}${result.limited ? ' at ' + result.cooling + ' W in this model.' : '.'}`;
  consoleElement.dataset.limited = String(result.limited);
  consoleElement.style.setProperty('--fan-duration', `${7 - result.sustained / 15}s`);
  consoleElement.querySelectorAll('[data-cooling]').forEach(button => button.setAttribute('aria-pressed', String(button.getAttribute('data-cooling') === cooling)));
  consoleElement.querySelector('[data-power-curve]')?.setAttribute('d', powerCurve(cooling));
  consoleElement.querySelector('[data-power-marker-line]')?.setAttribute('d', `M${point.x} ${point.y}V218`);
  const marker = consoleElement.querySelector('[data-power-marker]');
  marker?.setAttribute('cx', String(point.x));
  marker?.setAttribute('cy', String(point.y));
}

slider?.addEventListener('input', update);
consoleElement?.querySelectorAll<HTMLButtonElement>('[data-cooling]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.cooling;
  if (key !== 'quiet' && key !== 'balanced' && key !== 'max') return;
  cooling = key;
  update();
}));
document.querySelector('[data-reset-bench]')?.addEventListener('click', () => {
  if (!slider) return;
  slider.value = '45';
  cooling = 'balanced';
  update();
});
