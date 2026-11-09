'use strict';

const boot = document.querySelector('#boot');
const desktop = document.querySelector('#desktop');
const skipIntro = document.querySelector('#skip-intro');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let bootTimer;
let introFinished = false;

function finishIntro() {
  if (introFinished) return;
  introFinished = true;
  window.clearTimeout(bootTimer);
  desktop.inert = false;
  const wasFocused = boot.contains(document.activeElement);
  boot.classList.add('leaving');
  if (wasFocused) document.querySelector('[data-app]').focus();
  window.setTimeout(() => { boot.hidden = true; }, reducedMotion.matches ? 0 : 300);
}

// The overlay is hidden in HTML: content remains accessible if JavaScript fails.
if (!reducedMotion.matches) {
  boot.hidden = false;
  desktop.inert = true;
  bootTimer = window.setTimeout(finishIntro, 2000);
} else {
  introFinished = true;
}
skipIntro.addEventListener('click', finishIntro);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !introFinished) finishIntro();
});
reducedMotion.addEventListener('change', (event) => {
  if (event.matches) finishIntro();
});

const appNames = {
  about: 'About Me',
  projects: 'Project Explorer',
  skills: 'Tech Stack',
  education: 'Education',
  contact: 'Contact',
};
const windowLayer = document.querySelector('#window-layer');
const taskbarApps = document.querySelector('#taskbar-apps');
const smallScreen = window.matchMedia('(max-width: 700px)');
const appWindows = new Map();
// Bottom-to-top order stays bounded to the five apps, rather than increasing z-index forever.
let windowOrder = [];
let activeApp = null;
let drag = null;

// Project facts are supplied by the owner; no proficiency levels or results are inferred.
const projects = [
  {
    title: 'Vision-Guided Autonomous Robotic Vehicle',
    image: './assets/images/robotic-vehicle.webp',
    category: 'Robotics & Control',
    overview: 'A four-wheel autonomous robotic system developed using Raspberry Pi and Arduino, integrating computer vision, multi-sensor perception and closed-loop motion control.',
    contributions: [
      'Integrated camera, infrared, ultrasonic, and wireless sensing/communication hardware.',
      'Implemented OpenCV-based line detection, colour recognition, perspective transformation and image processing.',
      'Developed and tuned incremental PID and Bang-Bang control strategies for autonomous navigation.',
    ],
    outcome: 'Demonstrated visual line following, obstacle-distance control, and vision-based recognition functions on an integrated robotic platform.',
    technologies: ['Python', 'C/C++', 'OpenCV', 'Raspberry Pi', 'Arduino', 'PID Control', 'Sensor Fusion'],
  },
  {
    title: 'X-Band Doppler Radar Speed Detection System',
    image: './assets/images/doppler-radar.webp',
    category: 'Radar & Signal Processing',
    overview: 'Development of a Doppler speed detection system combining an HB100 X-band microwave sensor with an STM32 microcontroller.',
    contributions: [
      'Designed signal conditioning circuits to amplify and filter weak radar intermediate-frequency signals.',
      'Explored comparator-based zero-crossing detection and ADC-based FFT frequency estimation.',
      'Used LTspice simulation and laboratory testing to verify filtering and signal-processing performance.',
    ],
    outcome: 'Produced conditioned output suitable for digital frequency counting and ADC/FFT processing.',
    technologies: ['STM32', 'HB100', 'FFT', 'Analogue Filters', 'LTspice', 'Signal Conditioning'],
  },
  {
    title: 'Closed-Loop Two-Switch Forward Converter',
    image: './assets/images/forward-converter.webp',
    category: 'Power Electronics',
    overview: 'Design and development of a 10 V / 50 W two-switch forward DC-DC converter integrating feedback compensation, PCB design and thermal evaluation.',
    contributions: [
      'Developed non-ideal converter simulations in PLECS.',
      'Designed Type I and Type III feedback compensation networks.',
      'Contributed to component selection, high-frequency PCB layout in KiCad, and hardware testing.',
      'Analysed thermal behaviour and output ripple.',
    ],
    outcome: 'Demonstrated closed-loop output regulation and investigated circuit efficiency, ripple suppression and thermal performance.',
    technologies: ['PLECS', 'KiCad', 'DC-DC Conversion', 'PCB Design', 'Feedback Compensation', 'Thermal Analysis'],
  },
  {
    title: 'Find-Nomi — Smart Tracking & Visualisation',
    image: './assets/images/find-nomi.webp',
    category: 'Research & Software',
    period: 'Research period: June–August 2026',
    overview: 'A research project integrating thermal sensing, backend data processing, cross-platform visualisation, and spatial tracking algorithms.',
    contributions: [
      'Connected front-end sensing devices to a Python FastAPI backend for real-time data transfer.',
      'Implemented a Flutter interface for telemetry visualisation.',
      'Developed timestamp-based multi-source data synchronisation using SQLite.',
      'Implemented a polygon-aware geofencing mechanism to address coordinate drift.',
    ],
    outcome: 'Developed and integrated real-time sensing, data fusion, visualisation and geofencing components.',
    technologies: ['Python', 'FastAPI', 'Flutter', 'Dart', 'SQLite', 'Data Fusion', 'Geofencing', 'Git/GitHub'],
  },
  {
    title: 'MediSentinel — Pharmaceutical Shipment Monitoring',
    image: './assets/images/medisentinel.webp',
    category: 'IoT & Embedded Systems',
    overview: 'An IoT coursework project for monitoring temperature, humidity and vibration events during pharmaceutical transportation.',
    contributionsLabel: 'MY CONTRIBUTIONS / SYSTEM DESIGN',
    contributions: [
      'Integrated a Wio Terminal with an SHT4x temperature/humidity sensor and a piezoelectric vibration sensor.',
      'Designed product-specific monitoring profiles and shipment identification.',
      'Used microSD local data logging for offline backup.',
      'Ongoing implementation / planning: Wi-Fi/MQTT data transfer to a remote broker and a Python subscriber, with a Streamlit dashboard and shipment condition reporting workflow. End-to-end completion remains to be verified.',
    ],
    outcome: 'Coursework project in development, focusing on environmental event monitoring, shipment traceability and quality review support.',
    technologies: ['Wio Terminal', 'SHT4x', 'Piezo Sensor', 'microSD', 'MQTT', 'Python', 'Streamlit'],
  },
];

// Display labels follow the owner-supplied skills list; project links stay evidence-based.
const skillGroups = [
  ['Programming', ['C / C++', 'Python', 'Dart', 'MATLAB']],
  ['Embedded & Hardware', ['Raspberry Pi 3', 'Arduino Nano', 'STM32', 'Wio Terminal', 'HB100 X-Band Radar Sensor', 'SHT4x Sensor', 'I2C', 'UART', 'ADC', 'Bluetooth / RF Communication']],
  ['Engineering Software', ['PLECS', 'KiCad', 'LTspice', 'Logisim', 'VS Code', 'Arduino IDE', 'Linux / Raspberry Pi OS', 'VNC Viewer', 'Figma']],
  ['Computer Vision & Control', ['OpenCV', 'Computer Vision', 'Image Processing', 'Line Detection', 'Colour Recognition', 'Perspective Transformation', 'PID Control', 'Bang-Bang Control', 'PWM', 'Sensor Fusion', 'FFT', 'Zero-Crossing Detection', 'Butterworth Filtering', 'Signal Conditioning']],
  ['Software Development', ['FastAPI', 'Flutter', 'SQLite', 'Git / GitHub', 'MQTT', 'Streamlit', 'Data Fusion', 'Timestamp Synchronisation', 'Geofencing', 'Cross-Platform Integration']],
];

function relatedProjectIndexes(skill) {
  const aliases = {
    'C / C++': 'C/C++',
    'Raspberry Pi 3': 'Raspberry Pi',
    'Arduino Nano': 'Arduino',
    'HB100 X-Band Radar Sensor': 'HB100',
    'SHT4x Sensor': 'SHT4x',
    'Git / GitHub': 'Git/GitHub',
  };
  // These associations come from the existing case-file contributions, not inferred proficiency.
  const contributionLinks = {
    'Computer Vision': [0], 'Image Processing': [0], 'Line Detection': [0],
    'Colour Recognition': [0], 'Perspective Transformation': [0], 'Bang-Bang Control': [0],
    'ADC': [1], 'Zero-Crossing Detection': [1],
    'Timestamp Synchronisation': [3], 'Cross-Platform Integration': [3],
  };
  return contributionLinks[skill] ?? projects.reduce((matches, project, index) => {
    if (project.technologies.includes(aliases[skill] || skill)) matches.push(index);
    return matches;
  }, []);
}

function fillList(element, items) {
  element.replaceChildren(...items.map((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
}

function renderProjectDirectory(windowBody) {
  const directory = windowBody.querySelector('.project-directory');
  directory.querySelector('.section-label').textContent = `PROJECT DIRECTORY / ${String(projects.length).padStart(2, '0')}`;
  const buttons = projects.map((project, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.project = String(index);
    button.setAttribute('aria-controls', 'project-detail');
    button.textContent = project.title;
    return button;
  });
  directory.append(...buttons);
}

function selectProject(button) {
  const windowBody = button.closest('.window-body');
  const project = projects[Number(button.dataset.project)];
  if (!project) return;
  windowBody.querySelectorAll('[data-project]').forEach((entry) => {
    entry.setAttribute('aria-pressed', String(entry === button));
  });
  const fields = {
    '#project-name': project.title,
    '#project-category': project.category,
    '#project-overview': project.overview,
    '#contributions-label': project.contributionsLabel || 'MY CONTRIBUTIONS',
    '#project-outcome': project.outcome,
    '#project-period': project.period || '',
  };
  Object.entries(fields).forEach(([selector, value]) => {
    windowBody.querySelector(selector).textContent = value;
  });
  const image = windowBody.querySelector('#project-image');
  const imageFallback = windowBody.querySelector('#project-image-fallback');
  if (!image.dataset.fallbackHandling) {
    image.addEventListener('load', () => {
      if (image.getAttribute('src') !== image.dataset.expectedSrc) return;
      image.hidden = false;
      imageFallback.hidden = true;
    });
    image.addEventListener('error', () => {
      if (image.getAttribute('src') !== image.dataset.expectedSrc) return;
      image.hidden = true;
      imageFallback.textContent = `The concept image for ${image.alt.replace(' — concept illustration', '')} could not be loaded.`;
      imageFallback.hidden = false;
    });
    image.dataset.fallbackHandling = 'true';
  }
  image.alt = `${project.title} — concept illustration`;
  imageFallback.hidden = true;
  image.hidden = false;
  image.dataset.expectedSrc = project.image;
  image.src = project.image;
  windowBody.querySelector('#project-period').hidden = !project.period;
  fillList(windowBody.querySelector('#project-contributions'), project.contributions);
  fillList(windowBody.querySelector('#project-technologies'), project.technologies);
  windowBody.querySelector('#project-detail').scrollTop = 0;
  windowBody.querySelector('#project-announcement').textContent = `Selected project: ${project.title}`;
}

function skillCategoryIcon(index) {
  const shapes = [
    ['path', { d: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16' }],
    ['path', { d: 'M6 6h12v12H6zM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M9 9h6v6H9z' }],
    ['path', { d: 'M3 3h18v13H3zM8 21h8m-4-5v5M6 7h5m-5 4h8m2-4h2' }],
    ['path', { d: 'M2 12h4l3-7 6 14 3-7h4M3 3h4m10 0h4M3 21h4m10 0h4' }],
    ['path', { d: 'M3 4h6v6H3zM15 14h6v6h-6zM9 7h9v7M6 10v7h9' }],
  ];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const [tag, attributes] = shapes[index];
  const shape = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attributes).forEach(([name, value]) => shape.setAttribute(name, value));
  svg.append(shape);
  return svg;
}

function renderSkills(windowBody) {
  const container = windowBody.querySelector('#skill-groups');
  skillGroups.forEach(([name, skills], index) => {
    const card = document.createElement('section');
    card.className = 'skills-category-card';
    card.dataset.categoryIndex = index;
    card.setAttribute('aria-labelledby', `skills-category-${index}`);
    const header = document.createElement('header');
    header.className = 'skills-category-header';
    const number = document.createElement('span');
    number.className = 'skills-category-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const heading = document.createElement('h4');
    heading.id = `skills-category-${index}`;
    heading.textContent = name;
    header.append(number, skillCategoryIcon(index), heading);
    const items = document.createElement('ul');
    items.className = 'skills-technology-list';
    skills.forEach((skill) => {
      const linked = relatedProjectIndexes(skill).length > 0;
      const item = document.createElement('li');
      item.dataset.technology = skill;
      const tag = document.createElement(linked ? 'button' : 'span');
      tag.className = 'skills-technology-tag';
      tag.textContent = skill;
      if (linked) {
        tag.type = 'button';
        tag.dataset.skill = skill;
        tag.setAttribute('aria-pressed', 'false');
        tag.setAttribute('aria-controls', `skills-applied-${index}`);
      }
      item.append(tag);
      items.append(item);
    });
    const empty = document.createElement('p');
    empty.className = 'skills-category-empty';
    empty.textContent = 'No matching technologies in this category.';
    empty.hidden = true;
    const applied = document.createElement('div');
    applied.id = `skills-applied-${index}`;
    applied.className = 'skills-applied';
    card.append(header, items, empty, applied);
    container.append(card);
  });
  const search = windowBody.querySelector('#skill-search');
  search.addEventListener('input', () => filterSkills(windowBody));
  windowBody.querySelector('#clear-skill-search').addEventListener('click', () => {
    search.value = '';
    filterSkills(windowBody);
    search.focus({ preventScroll: true });
  });
  filterSkills(windowBody);
}

function updateAppliedProjects(card) {
  const applied = card.querySelector('.skills-applied');
  const visibleSkills = [...card.querySelectorAll('[data-technology]')]
    .filter((item) => !item.hidden).map((item) => item.dataset.technology);
  const selected = card.dataset.selectedSkill;
  const skills = selected ? [selected] : visibleSkills;
  const indexes = [...new Set(skills.flatMap(relatedProjectIndexes))].sort((a, b) => a - b);
  applied.hidden = visibleSkills.length === 0;
  const label = document.createElement('h5');
  label.textContent = selected ? `Applied In / ${selected}` : 'Applied In';
  const list = document.createElement('ul');
  indexes.forEach((index) => {
    const item = document.createElement('li');
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'project-link';
    link.dataset.openProject = index;
    link.textContent = projects[index].title;
    item.append(link);
    list.append(item);
  });
  const note = document.createElement('p');
  note.textContent = indexes.length
    ? 'Links reflect documented technology use. Project details include development status.'
    : 'No documented project association for these technologies.';
  applied.replaceChildren(label, list, note);
}

function normalizeTechnology(value) {
  return value.trim().toLowerCase().replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ');
}

function filterSkills(windowBody) {
  const search = windowBody.querySelector('#skill-search');
  const query = normalizeTechnology(search.value);
  let count = 0;
  windowBody.querySelectorAll('.skills-category-card').forEach((card) => {
    let visible = 0;
    card.querySelectorAll('[data-technology]').forEach((item) => {
      item.hidden = !normalizeTechnology(item.dataset.technology).includes(query);
      if (!item.hidden) visible++;
    });
    count += visible;
    delete card.dataset.selectedSkill;
    card.querySelectorAll('[data-skill]').forEach((tag) => tag.setAttribute('aria-pressed', 'false'));
    card.querySelector('.skills-category-empty').hidden = visible > 0;
    updateAppliedProjects(card);
  });
  windowBody.querySelector('#clear-skill-search').hidden = search.value.length === 0;
  windowBody.querySelector('#skills-empty-state').hidden = count > 0;
  windowBody.querySelector('#skills-search-status').textContent = query
    ? `${count} matching ${count === 1 ? 'technology' : 'technologies'} across 5 categories.`
    : `${count} technologies across 5 categories.`;
}

function showSkillProjects(button) {
  const card = button.closest('.skills-category-card');
  const selected = card.dataset.selectedSkill === button.dataset.skill ? null : button.dataset.skill;
  if (selected) card.dataset.selectedSkill = selected;
  else delete card.dataset.selectedSkill;
  card.querySelectorAll('[data-skill]').forEach((tag) => {
    tag.setAttribute('aria-pressed', String(tag.dataset.skill === selected));
  });
  updateAppliedProjects(card);
}

const email = 'jessicazhao390@gmail.com';
async function copyEmail(button) {
  const windowBody = button.closest('.window-body');
  const status = windowBody.querySelector('#copy-status');
  const label = button.querySelector('.copy-email-label');
  button.disabled = true;
  button.dataset.copyState = 'copying';
  button.setAttribute('aria-busy', 'true');
  label.textContent = 'Copying…';
  status.textContent = '';
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    // An async response must not affect a closed or newly opened Contact instance.
    if (!status.isConnected) return;
    windowBody.querySelector('#copy-email-fallback')?.remove();
    button.dataset.copyState = 'copied';
    label.textContent = 'Email Copied';
    status.textContent = 'Email copied to clipboard.';
  } catch {
    // Keep a manual copy path for restricted clipboard permissions and file:// previews.
    if (!status.isConnected) return;
    button.dataset.copyState = 'manual';
    label.textContent = 'Copy Email';
    let input = windowBody.querySelector('#copy-email-fallback');
    if (!input) {
      input = document.createElement('input');
      input.id = 'copy-email-fallback';
      input.className = 'copy-fallback';
      input.type = 'text';
      input.readOnly = true;
      input.value = email;
      input.setAttribute('aria-label', 'Email address to copy');
      status.after(input);
    }
    input.focus();
    input.select();
    status.textContent = 'Automatic copying is unavailable. The email is selected below; press Ctrl+C or Command+C, or use your device’s Copy command.';
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
}

// Geometry is relative to the layer, which occupies only the workspace between the bars.
function workspaceSize() {
  return { width: windowLayer.clientWidth, height: windowLayer.clientHeight };
}

function clampGeometry(rect) {
  const { width, height } = workspaceSize();
  const gap = Math.min(12, width / 20, height / 20);
  const w = Math.max(1, Math.min(rect.width, width - gap * 2));
  const h = Math.max(1, Math.min(rect.height, height - gap * 2));
  return {
    width: w, height: h,
    x: Math.min(Math.max(gap, rect.x), Math.max(gap, width - w - gap)),
    y: Math.min(Math.max(gap, rect.y), Math.max(gap, height - h - gap)),
  };
}

function initialGeometry(app) {
  const { width, height } = workspaceSize();
  const sizes = { about: [650, 560], projects: [940, 650], skills: [700, 620], education: [670, 580], contact: [820, 580] };
  const [w, h] = sizes[app];
  const centered = clampGeometry({ width: w, height: h, x: (width - Math.min(w, width - 24)) / 2, y: (height - Math.min(h, height - 24)) / 2 });
  // Mobile panels fill the workspace; retain the existing floating geometry policy.
  if (smallScreen.matches) return centered;
  const floating = windowOrder.map((name) => appWindows.get(name))
    .filter((state) => !state.minimized && !state.maximized);
  if (!floating.length) return centered;

  const gap = Math.min(12, width / 20, height / 20);
  const titleStrip = 48; // Exposes the title and controls, rather than a thin border.
  const minHeight = Math.min(300, height - gap * 2);
  const y = Math.max(...floating.map((state) => state.geometry.y + titleStrip));
  const availableHeight = height - gap - y;
  const x = centered.x + floating.length * 24;
  if (availableHeight >= minHeight) {
    return clampGeometry({ ...centered, x, y, height: Math.min(centered.height, availableHeight) });
  }

  // Dragged windows may leave little room below. Compare bounded alternatives
  // without moving existing windows or changing their saved restore geometry.
  let best = centered;
  let bestScore = -1;
  for (const candidateHeight of [centered.height, minHeight]) {
    const positionsY = [gap, height - gap - candidateHeight,
      ...floating.flatMap((state) => [state.geometry.y + titleStrip, state.geometry.y - candidateHeight])];
    for (const candidateX of [x, gap, width - gap - centered.width]) {
      for (const candidateY of positionsY) {
        const rect = clampGeometry({ ...centered, x: candidateX, y: candidateY, height: candidateHeight });
        const exposed = floating.map(({ geometry: old }) => {
          const overlapX = Math.max(0, Math.min(old.x + old.width, rect.x + rect.width) - Math.max(old.x, rect.x));
          const overlapY = Math.max(0, Math.min(old.y + titleStrip, rect.y + rect.height) - Math.max(old.y, rect.y));
          return 1 - overlapX * overlapY / (old.width * titleStrip);
        });
        const score = Math.min(...exposed) * 100 + exposed.reduce((sum, value) => sum + value, 0) + rect.height / height / 100;
        if (score > bestScore) { best = rect; bestScore = score; }
      }
    }
  }
  return best;
}

function positionWindow(state) {
  const { width, height } = workspaceSize();
  const rect = smallScreen.matches || state.maximized
    ? { x: 0, y: 0, width, height }
    : state.geometry;
  Object.assign(state.element.style, {
    left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.width}px`, height: `${rect.height}px`,
  });
  state.element.classList.toggle('maximized', state.maximized);
}

function syncWindows() {
  windowOrder.forEach((app, index) => {
    const state = appWindows.get(app);
    const visible = !state.minimized && (!smallScreen.matches || activeApp === app);
    state.element.hidden = !visible;
    state.element.style.zIndex = String(index + 1);
    state.element.classList.toggle('active-window', activeApp === app && visible);
    state.taskButton.setAttribute('aria-pressed', String(activeApp === app && visible));
    state.taskButton.setAttribute('aria-label', `${appNames[app]} — ${state.minimized ? 'minimized; restore' : visible ? 'open; focus' : 'open; switch to'}`);
    state.taskButton.classList.toggle('is-minimized', state.minimized);
    positionWindow(state);
  });
  taskbarApps.classList.toggle('is-empty', appWindows.size === 0);
}

function announce(message) {
  document.querySelector('#window-status').textContent = message;
}

function focusWindow(app, moveKeyboardFocus = true) {
  const state = appWindows.get(app);
  if (!state) return;
  state.minimized = false;
  activeApp = app;
  windowOrder = windowOrder.filter((entry) => entry !== app).concat(app);
  syncWindows();
  if (moveKeyboardFocus) {
    // Restore a useful focus target without changing the content's scroll position.
    const target = state.lastFocus?.isConnected && state.element.contains(state.lastFocus)
      ? state.lastFocus : state.element;
    target.focus({ preventScroll: true });
  }
}

function activateNext(fallbackApp) {
  activeApp = [...windowOrder].reverse().find((app) => !appWindows.get(app).minimized) || null;
  syncWindows();
  if (activeApp) focusWindow(activeApp);
  else document.querySelector(`[data-app="${fallbackApp}"]`)?.focus({ preventScroll: true });
}

function stopDragging() {
  if (!drag) return;
  const { header, pointerId } = drag;
  drag = null;
  if (header.hasPointerCapture(pointerId)) header.releasePointerCapture(pointerId);
  document.body.classList.remove('window-dragging');
}

function minimizeWindow(app) {
  const state = appWindows.get(app);
  if (!state) return;
  stopDragging();
  state.minimized = true;
  if (activeApp === app) activateNext(app);
  else syncWindows();
  announce(`${appNames[app]} minimized. Restore it from the taskbar.`);
}

function closeWindow(app) {
  const state = appWindows.get(app);
  if (!state) return;
  stopDragging();
  const wasActive = activeApp === app;
  state.element.remove();
  state.taskButton.remove();
  appWindows.delete(app);
  windowOrder = windowOrder.filter((entry) => entry !== app);
  if (wasActive) activateNext(app);
  else syncWindows();
  announce(`${appNames[app]} closed.`);
}

function toggleMaximize(app) {
  const state = appWindows.get(app);
  if (!state || smallScreen.matches) return;
  stopDragging();
  state.maximized = !state.maximized;
  // Floating geometry is kept separately, so restore returns to its previous bounds.
  const button = state.element.querySelector('.maximize-button');
  const action = state.maximized ? 'Restore' : 'Maximize';
  button.textContent = state.maximized ? '❐' : '□';
  button.setAttribute('aria-label', `${action} ${appNames[app]}`);
  button.title = action;
  button.setAttribute('aria-pressed', String(state.maximized));
  focusWindow(app, false);
  announce(`${appNames[app]} ${state.maximized ? 'maximized' : 'restored'}.`);
}

function attachWindowEvents(state) {
  const { app, element } = state;
  const body = element.querySelector('.window-body');
  const header = element.querySelector('.window-header');
  element.addEventListener('pointerdown', () => focusWindow(app, false));
  element.addEventListener('focusin', (event) => {
    state.lastFocus = event.target;
    if (activeApp !== app) focusWindow(app, false);
  });
  element.querySelector('.close-button').addEventListener('click', () => closeWindow(app));
  element.querySelector('.minimize-button').addEventListener('click', () => minimizeWindow(app));
  element.querySelector('.maximize-button').addEventListener('click', () => toggleMaximize(app));
  body.addEventListener('click', (event) => {
    const project = event.target.closest('[data-project]');
    if (project) selectProject(project);
    const skill = event.target.closest('[data-skill]');
    if (skill) showSkillProjects(skill);
    const link = event.target.closest('[data-open-project]');
    if (link) {
      const projectWindow = openApp(document.querySelector('[data-app="projects"]'));
      selectProject(projectWindow.element.querySelector(`[data-project="${link.dataset.openProject}"]`));
      projectWindow.element.querySelector('#project-detail').focus({ preventScroll: true });
    }
    const copyButton = event.target.closest('#copy-email');
    if (copyButton) copyEmail(copyButton);
  });
  header.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || !event.isPrimary || smallScreen.matches || state.maximized || event.target.closest('button')) return;
    event.preventDefault();
    stopDragging();
    focusWindow(app, false);
    drag = { app, header, pointerId: event.pointerId, x: event.clientX, y: event.clientY, start: { ...state.geometry } };
    header.setPointerCapture(event.pointerId);
    document.body.classList.add('window-dragging');
  });
  header.addEventListener('pointermove', (event) => {
    if (!drag || drag.app !== app || drag.pointerId !== event.pointerId) return;
    state.geometry = clampGeometry({ ...drag.start, x: drag.start.x + event.clientX - drag.x, y: drag.start.y + event.clientY - drag.y });
    positionWindow(state);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((name) => {
    header.addEventListener(name, stopDragging);
  });
}

function openApp(launcher) {
  const app = launcher.dataset.app;
  if (appWindows.has(app)) {
    focusWindow(app);
    return appWindows.get(app);
  }
  const template = document.querySelector(`#${app}-content`);
  if (!template) return null;
  const element = document.querySelector('#window-template').content.firstElementChild.cloneNode(true);
  element.id = `app-${app}`;
  element.dataset.appWindow = app;
  const title = element.querySelector('.window-title');
  title.id = `title-${app}`;
  title.textContent = appNames[app];
  element.setAttribute('aria-labelledby', title.id);
  const body = element.querySelector('.window-body');
  body.append(template.content.cloneNode(true));
  body.classList.toggle('projects-body', app === 'projects');
  for (const [selector, action] of [['.close-button', 'Close'], ['.minimize-button', 'Minimize'], ['.maximize-button', 'Maximize']]) {
    element.querySelector(selector).setAttribute('aria-label', `${action} ${appNames[app]}`);
  }
  const taskButton = document.createElement('button');
  taskButton.className = 'taskbar-entry';
  taskButton.type = 'button';
  taskButton.textContent = appNames[app];
  taskButton.title = appNames[app];
  taskButton.setAttribute('aria-controls', element.id);
  taskButton.addEventListener('click', () => focusWindow(app));
  const state = { app, element, taskButton, minimized: false, maximized: false, geometry: initialGeometry(app), lastFocus: null };
  appWindows.set(app, state);
  windowOrder.push(app);
  windowLayer.append(element);
  taskbarApps.append(taskButton);
  if (app === 'projects') {
    renderProjectDirectory(body);
    selectProject(body.querySelector('[data-project]'));
  }
  if (app === 'skills') renderSkills(body);
  attachWindowEvents(state);
  focusWindow(app);
  announce(`${appNames[app]} opened.`);
  return state;
}

document.querySelectorAll('[data-app]').forEach((launcher) => {
  launcher.addEventListener('click', () => openApp(launcher));
});
document.querySelector('#show-desktop').addEventListener('click', () => {
  stopDragging();
  appWindows.forEach((state) => { state.minimized = true; });
  activeApp = null;
  syncWindows();
  document.querySelector('[data-app]').focus({ preventScroll: true });
  announce('Desktop. Open applications remain in the taskbar.');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && introFinished && activeApp && windowLayer.contains(document.activeElement)) {
    event.preventDefault();
    closeWindow(activeApp);
  }
});

function fitWorkspace() {
  stopDragging();
  appWindows.forEach((state) => {
    // Keep desktop restore geometry while in the mobile layout.
    if (!smallScreen.matches) state.geometry = clampGeometry(state.geometry);
  });
  if (smallScreen.matches && !activeApp) {
    activeApp = [...windowOrder].reverse().find((app) => !appWindows.get(app).minimized) || null;
  }
  syncWindows();
  // A desktop/mobile transition may hide the focused application.
  const focused = document.activeElement.closest?.('[data-app-window]');
  if (focused?.hidden) {
    if (activeApp) focusWindow(activeApp);
    else document.querySelector('#show-desktop').focus({ preventScroll: true });
  }
}
window.addEventListener('resize', fitWorkspace);
smallScreen.addEventListener('change', fitWorkspace);
new ResizeObserver(fitWorkspace).observe(windowLayer);
window.addEventListener('blur', stopDragging);
syncWindows();
