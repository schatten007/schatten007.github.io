const loadouts = {
  code: {
    label: 'EQUIPPED / PYTHON + TYPESCRIPT',
    description: 'AI application tools, schema checks, and data pipelines. The projects below are the working examples.',
  },
  hardware: {
    label: 'SIDE QUEST / HARDWARE TUNING',
    description: 'Laptops, desktops, performance tuning, and overclocking. There’s a power-budget model in the lab to play with.',
  },
  'off-duty': {
    label: 'OFF-DUTY / GAMES + ANIME',
    description: 'Anime, RPGs, Doom, and other old-school shooters. This site borrows a little from the menus and machines in those worlds.',
  },
};

const panel = document.querySelector<HTMLElement>('[data-loadout-panel]');
panel?.querySelectorAll<HTMLButtonElement>('[data-loadout]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.loadout as keyof typeof loadouts;
    if (!(key in loadouts)) return;
    panel.dataset.loadoutPanel = key;
    panel.querySelectorAll('[data-loadout]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    const label = panel.querySelector('[data-loadout-label]');
    const description = panel.querySelector('[data-loadout-description]');
    if (label) label.textContent = loadouts[key].label;
    if (description) description.textContent = loadouts[key].description;
  });
});
