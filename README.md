# YUEQI.OS — Version 2

YUEQI.OS is Yueqi Zhao's browser-based personal engineering workstation, developed for EEEE3134 Coursework Part I. It presents a portfolio through a miniature desktop interface: application launchers, floating windows and a taskbar, rather than a conventional scrolling homepage.

The interface uses a dark navy background, cyan and purple accents, technical borders and a subtle engineering HUD wallpaper. All visible portfolio copy is in English. Personal information and project descriptions follow the information supplied by the owner; project artwork is explicitly labelled as concept imagery, not real project photographs.

## Features and desktop interaction

- Approximately two-second simulated boot introduction, with **Skip Intro** and Escape support. Reduced-motion preferences skip the introduction. If JavaScript is unavailable, the boot overlay stays hidden; application interactions require JavaScript.
- Five application launchers, a top system bar, a centred introduction and a bottom taskbar.
- One window instance per app. Multiple apps can coexist on desktop; clicking an existing launcher or taskbar entry focuses and restores its window instead of creating a duplicate.
- Pointer-based dragging from the title bar, bounded by the workspace between the system bar and taskbar. Window controls do not initiate dragging; maximized windows cannot be dragged.
- Clicking a window or moving keyboard focus into it brings it to the front. The active window has a subtle cyan border and title-bar distinction.
- Minimize keeps the app in the taskbar. Maximize fills the available workspace; restore returns to the saved floating geometry, subject to viewport bounds. Close removes the window and its taskbar entry. Escape closes the focused app.
- New desktop windows cascade below existing floating-window title bars where space permits. Initial height can be reduced to fit. When dragged windows leave little room, bounded alternatives prioritize exposed title-bar areas without moving existing windows. Maximizing or manually overlapping windows can still cover other apps; their taskbar entries remain available.
- **Desktop** minimizes all apps without discarding their contents. Content, selections and scroll positions survive focus changes and minimization. Closing an app or refreshing the page resets its state.
- At widths of 700px or less, one full-width app is visible at a time. The taskbar switches between open apps, and Desktop returns to the launchers. Dragging is disabled and maximize is hidden. The taskbar can scroll horizontally within its own area.
- Keyboard-accessible controls, visible focus styles, descriptive project-image alt text, status announcements and reduced-motion support.

There is no arbitrary edge resizing, window snapping, persistent desktop layout, backend, account system or contact form.

## Applications

### About Me

A structured personal profile with a prominent name and engineering discipline, a concise introduction, academic background, six areas of interest and an overview of the types of engineering experience represented in the portfolio.

### Project Explorer

Exactly five projects, in the order listed in the image table below. The desktop layout has a left project directory and an independently scrollable right detail pane; on mobile these are stacked. Each case file contains a category, full title, overview, contributions, technologies and outcome/status. Selecting another project updates its content, concept image and alt text, and resets the detail pane to the top.

Find-Nomi includes its June–August 2026 research period. MediSentinel remains described as coursework in development, with the networking/reporting workflow explicitly identified as ongoing implementation/planning.

### Tech Stack

An Engineering Skills Dashboard with 47 technology labels across five numbered categories:

1. Programming
2. Embedded & Hardware
3. Engineering Software
4. Computer Vision & Control
5. Software Development

Search filters technology names without removing the category cards. Clear resets the filter; unmatched searches display a clear empty state. Cyan technology buttons have documented project associations. Selecting one narrows its category's **Applied In** links; selecting a project opens its existing Project Explorer case file. No proficiency percentages, ratings or certifications are displayed.

### Education

An Academic Records panel containing:

- University of Nottingham Ningbo China (UNNC), Ningbo, China.
- BEng (Hons) Electrical and Electronic Engineering.
- September 2023 – June 2027; status **In Progress**.
- A timeline marking commencement in September 2023 and expected completion in June 2027.
- Six academic interest tags and a concise academic overview.

The panel does not display module grades, GPA, rankings, awards or graduation results.

### Contact

A responsive Engineering Communication Hub with a desktop two-column layout, introduction, academic affiliation, Ningbo location indicator and collaboration message. The only contact channels are:

- **Email:** [jessicazhao390@gmail.com](mailto:jessicazhao390@gmail.com), with Copy Email, pending/success feedback and a selected-text fallback if clipboard access is unavailable or denied.
- **GitHub:** [jessicazhao390-maker](https://github.com/jessicazhao390-maker), opening in a new tab with `noopener noreferrer`.

Copying uses the browser Clipboard API when available. Localhost or HTTPS preview is recommended; manual copying remains available if browser permissions restrict the API. The email link hands off to the visitor's configured email application.

## Project concept images

| Project | Display image | Source backup |
| --- | --- | --- |
| Vision-Guided Autonomous Robotic Vehicle | `robotic-vehicle.webp` | `robotic-vehicle.png` |
| X-Band Doppler Radar Speed Detection System | `doppler-radar.webp` | `doppler-radar.png` |
| Closed-Loop Two-Switch Forward Converter | `forward-converter.webp` | `forward-converter.png` |
| Find-Nomi — Smart Tracking & Visualisation | `find-nomi.webp` | `find-nomi.png` |
| MediSentinel — Pharmaceutical Shipment Monitoring | `medisentinel.webp` | `medisentinel.png` |

All ten files are in `assets/images/`. The website uses the optimized WebP files; the original PNGs remain unchanged as source backups. The WebPs were encoded at high quality (0.97) using the installed browser's encoder, with no resizing or cropping during conversion. Source dimensions remain **1672 × 941**, approximately 16:9. The existing CSS displays them in a 16:9 frame with `object-fit: cover`, avoiding distortion.

The five display images total **2,669,814 bytes**, compared with **11,525,053 bytes** for the PNGs: **76.83% fewer image bytes** when browsing all five projects. Keeping the PNG backups increases repository storage; they are not referenced by the running website. These figures describe asset sizes, not measured network loading times.

`assets/favicon.svg` provides a lightweight navy-and-cyan circuit-inspired Y symbol. It is linked through a relative URL, as are the stylesheet, script and project images.

## Technology stack

- Semantic HTML5 and reusable `<template>` elements.
- CSS3: Grid, Flexbox, container queries, responsive layouts and reduced-motion rules.
- Vanilla JavaScript: DOM events, Pointer Events, pointer capture, ResizeObserver, Map-based window state and the Clipboard API.
- Local WebP images, PNG source backups and an SVG favicon.

There are no JavaScript frameworks, npm packages, runtime image libraries, build steps, CDN assets, external image hosts or paid services. Python is only an optional local preview server; it is not part of the deployed website. Use a modern browser supporting the APIs and CSS features listed above.

## Directory structure

```text
EEEE3134-Portfolio-V2/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── favicon.svg
    └── images/
        ├── robotic-vehicle.png
        ├── robotic-vehicle.webp
        ├── doppler-radar.png
        ├── doppler-radar.webp
        ├── forward-converter.png
        ├── forward-converter.webp
        ├── find-nomi.png
        ├── find-nomi.webp
        ├── medisentinel.png
        └── medisentinel.webp
```

`index.html` contains the desktop, shared window shell and five content templates. `script.js` holds project data, skills and their documented project associations, and window interactions. `style.css` holds the established visual system and application styles.

## Run locally

From the project directory, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000 in a browser. Press Ctrl+C in the terminal to stop the server. No installation or build is required. Directly opening `index.html` also renders the site, although clipboard access may use the manual fallback.

## GitHub Pages deployment instructions

These are instructions for a future manual deployment; this optimization work does not initialize Git, create a repository, commit, push or deploy.

1. When ready to publish, create or choose a GitHub repository. GitHub Free supports Pages from public repositories.
2. Put `index.html`, `style.css`, `script.js`, `README.md` and the complete `assets/` directory at the root of the publishing branch. Preserve filenames and capitalization; do not put the whole project inside an extra enclosing folder.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose the publishing branch (for example, `main`) and **/(root)**, then save.
4. When publishing finishes, open the URL shown by Pages. A project site normally uses `https://<username>.github.io/<repository>/`.
5. Verify all five apps, all five WebP images, the favicon, clipboard feedback and mobile layouts on the published URL. Check browser network requests for missing resources.

Relative `./` paths allow the same files to run at localhost's root or under a repository subpath without a code change. No custom build command or server-side runtime is needed.

References: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) and [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Manual regression checklist

- Wait for the boot intro; reload and try Skip Intro, keyboard navigation and reduced-motion mode.
- Open all five apps, check initial title-bar visibility, focus each window, and confirm repeated opening does not duplicate it.
- Drag floating windows to workspace edges; minimize and restore through the taskbar; maximize and restore; close and reopen.
- Select all five projects, verify their WebP images and alt text, and check independent scrolling and state retention.
- Search Tech Stack, clear the filter, try an unmatched query and follow an Applied In link.
- Check Education and About Me content, Email/GitHub links and Copy Email success/manual fallback.
- Recheck 1440, 1024, 768, 390 and 320px viewports for overflow, reachable controls and readable content.
- Verify the root URL and a repository subpath, including favicon and all image requests.

## Final optimization verification

The final local Chrome regression run passed **257 checks**, covering boot/Skip Intro, reduced motion, all five applications, search and project links, image switching and alt text, real pointer dragging, focus, minimize/restore, maximize/geometry restore, closing/reopening, independent scrolling and clipboard success/manual fallback.

- Five-app layout checks passed at **1440, 1024, 768, 390 and 320px**, including image aspect ratios, workspace bounds, reachable title-bar controls and no horizontal page overflow.
- All **120 opening orders** of the five apps were checked at each desktop width (1440, 1024 and 768px): **360 opening-order cases**. Default title bars remained exposed and windows stayed inside the workspace. Real DOM visibility checks and the constrained-placement fallback also passed.
- All five WebPs decoded at their original dimensions. The SVG favicon and images loaded successfully at both a localhost root and the simulated `/EEEE3134-Portfolio-V2/` repository subpath.
- The recorded run had no uncaught JavaScript exceptions, console errors or HTTP asset errors. The verified PNG backups, CSS and personal/project copy were checked against the pre-optimization snapshot.

These are local Chrome results, not a live GitHub Pages deployment or a guarantee of identical behavior in every browser. Safari, Firefox and physical touch devices were not tested in this run.
