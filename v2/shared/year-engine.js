/**
 * TIME MACHINE — shared year-experience engine
 * ================================================
 * This file is REUSED by every year (1857 / 1914 / 1941 / 1971 / 1999).
 * You should never need to edit this file when adding a new year —
 * only write a new /years/<year>/data.js and a thin <year>.html loader.
 *
 * Flow it drives:
 *   Title card -> Scene 1 video -> MCQ -> Scene 2 video -> MCQ ->
 *   Scene 3 video -> MCQ -> (resolve ending) -> Ending video -> Ending panel
 *
 * See /years/1857/data.js for the shape of the data object this expects,
 * and /MAP.md at the project root for the full folder guide.
 */

export function initYearExperience(YEAR_DATA, options = {}) {
  const backUrl = options.backUrl || "./index.html";
  const totalScenes = YEAR_DATA.scenes.length;

  const state = {
    sceneIndex: -1, // -1 = title card
    selections: [], // full option objects, in order chosen
    muted: true,
  };

  // ---------- build DOM ----------
  const root = document.getElementById("year-app") || createRoot();
  root.innerHTML = `
    <div class="y-topbar">
      <div class="y-eyebrow">TIME MACHINE<span>${escapeHtml(YEAR_DATA.title)} — TEMPORAL PLAYBACK</span></div>
      <div class="y-topbar-right">
        <button type="button" class="y-mute-btn" id="y-mute-btn">🔇 SOUND OFF</button>
        <a class="y-return-btn" href="${backUrl}">⏎ RETURN</a>
      </div>
    </div>

    <div class="y-progress" id="y-progress"></div>

    <div class="y-title-card" id="y-title-card">
      <h1>${escapeHtml(YEAR_DATA.title)}</h1>
      <div class="y-subtitle">${escapeHtml(YEAR_DATA.subtitle || "")}</div>
      ${YEAR_DATA.introText ? `<p class="y-intro-text">${escapeHtml(YEAR_DATA.introText)}</p>` : ""}
      <button type="button" class="y-begin-btn" id="y-begin-btn">Begin Sequence</button>
    </div>

    <div class="y-stage">
      <video class="y-video" id="y-video" playsinline muted></video>
      <div class="y-video-notice" id="y-video-notice">
        <p>Video not found at <code id="y-video-path"></code></p>
        <p>Drop your generated clip at that path and reload, or continue for now.</p>
        <button type="button" class="y-skip-btn" id="y-skip-btn">Continue anyway</button>
      </div>
    </div>
    <div class="y-letterbox top"></div>
    <div class="y-letterbox bottom"></div>
    <div class="y-scene-tag" id="y-scene-tag"></div>

    <div class="y-choice-panel" id="y-choice-panel">
      <div class="y-prompt" id="y-prompt"></div>
      <div class="y-options" id="y-options"></div>
    </div>

    <div class="y-ending-panel" id="y-ending-panel">
      <div class="y-ending-eyebrow">TIMELINE RESOLVED</div>
      <div class="y-ending-title" id="y-ending-title"></div>
      <div class="y-ending-desc" id="y-ending-desc"></div>
      <div class="y-ending-actions">
        <button type="button" class="y-replay-btn" id="y-replay-btn">Replay This Year</button>
        <a class="y-home-btn" href="${backUrl}">Back to Time Machine</a>
      </div>
    </div>
    <div class="sr-only" id="y-aria-live" aria-live="polite"></div>
  `;

  const videoEl = document.getElementById("y-video");
  const noticeEl = document.getElementById("y-video-notice");
  const noticePathEl = document.getElementById("y-video-path");
  const skipBtn = document.getElementById("y-skip-btn");
  const titleCardEl = document.getElementById("y-title-card");
  const beginBtn = document.getElementById("y-begin-btn");
  const choicePanelEl = document.getElementById("y-choice-panel");
  const promptEl = document.getElementById("y-prompt");
  const optionsEl = document.getElementById("y-options");
  const sceneTagEl = document.getElementById("y-scene-tag");
  const progressEl = document.getElementById("y-progress");
  const endingPanelEl = document.getElementById("y-ending-panel");
  const endingTitleEl = document.getElementById("y-ending-title");
  const endingDescEl = document.getElementById("y-ending-desc");
  const replayBtn = document.getElementById("y-replay-btn");
  const muteBtn = document.getElementById("y-mute-btn");
  const liveEl = document.getElementById("y-aria-live");

  buildProgressDots();
  beginBtn.addEventListener("click", startExperience);
  skipBtn.addEventListener("click", () => handleVideoReady(true));
  replayBtn.addEventListener("click", resetExperience);
  muteBtn.addEventListener("click", toggleMute);
  videoEl.addEventListener("ended", () => onVideoFinished(false));
  videoEl.addEventListener("error", () => onVideoError());

  // ---------- flow ----------
  function startExperience() {
    titleCardEl.classList.add("hide");
    loadScene(0);
  }

  function loadScene(index) {
    state.sceneIndex = index;
    choicePanelEl.classList.remove("show");
    updateProgressDots();
    const scene = YEAR_DATA.scenes[index];
    sceneTagEl.innerHTML = `SCENE <b>${index + 1} / ${totalScenes}</b> — ${escapeHtml(scene.label || "")}`;
    playClip(scene.video);
  }

  function playClip(src) {
    noticeEl.classList.remove("show");
    videoEl.classList.remove("show");
    videoEl.muted = state.muted;
    videoEl.src = src;
    videoEl.currentTime = 0;
    noticePathEl.textContent = src;
    const playPromise = videoEl.load();
    videoEl.oncanplay = () => {
      videoEl.classList.add("show");
      videoEl.play().catch(() => {
        /* autoplay with sound blocked — user can hit the mute toggle / tap screen */
      });
    };
  }

  function onVideoError() {
    videoEl.classList.remove("show");
    noticeEl.classList.add("show");
  }

  function onVideoFinished(skipped) {
    handleVideoReady(skipped);
  }

  function handleVideoReady() {
    noticeEl.classList.remove("show");
    if (state.sceneIndex === "ending") {
      showEndingPanel();
      return;
    }
    showChoices(YEAR_DATA.scenes[state.sceneIndex]);
  }

  function showChoices(scene) {
    promptEl.textContent = scene.prompt;
    optionsEl.innerHTML = "";
    scene.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "y-option-btn";
      btn.innerHTML = `<span class="y-opt-index">OPTION ${String.fromCharCode(65 + i)}</span>${escapeHtml(opt.label)}`;
      btn.addEventListener("click", () => pickOption(opt));
      optionsEl.appendChild(btn);
    });
    choicePanelEl.classList.add("show");
    liveEl.textContent = scene.prompt;
  }

  function pickOption(option) {
    state.selections.push(option);
    choicePanelEl.classList.remove("show");
    const next = state.sceneIndex + 1;
    if (next < totalScenes) {
      loadScene(next);
    } else {
      resolveEnding();
    }
  }

  function resolveEnding() {
    state.sceneIndex = "ending";
    updateProgressDots();
    const ending =
      YEAR_DATA.endings.find((e) => {
        try {
          return e.when(state.selections);
        } catch (err) {
          return false;
        }
      }) || YEAR_DATA.endings[YEAR_DATA.endings.length - 1];
    state.resolvedEnding = ending;
    sceneTagEl.innerHTML = `TIMELINE <b>RESOLVED</b>`;
    playClip(ending.video);
  }

  function showEndingPanel() {
    const ending = state.resolvedEnding;
    endingTitleEl.textContent = ending.title;
    endingDescEl.textContent = ending.description || "";
    endingPanelEl.classList.add("show");
    liveEl.textContent = `Ending reached: ${ending.title}`;
  }

  function resetExperience() {
    state.sceneIndex = -1;
    state.selections = [];
    state.resolvedEnding = null;
    endingPanelEl.classList.remove("show");
    choicePanelEl.classList.remove("show");
    videoEl.pause();
    videoEl.removeAttribute("src");
    titleCardEl.classList.remove("hide");
    updateProgressDots();
  }

  function toggleMute() {
    state.muted = !state.muted;
    videoEl.muted = state.muted;
    muteBtn.textContent = state.muted ? "🔇 SOUND OFF" : "🔊 SOUND ON";
    if (!state.muted) videoEl.play().catch(() => {});
  }

  function buildProgressDots() {
    progressEl.innerHTML = "";
    for (let i = 0; i < totalScenes; i++) {
      const dot = document.createElement("span");
      dot.className = "y-dot";
      dot.dataset.index = String(i);
      progressEl.appendChild(dot);
    }
  }

  function updateProgressDots() {
    const dots = progressEl.querySelectorAll(".y-dot");
    dots.forEach((dot, i) => {
      dot.classList.remove("done", "active");
      if (state.sceneIndex === "ending" || state.sceneIndex > i) dot.classList.add("done");
      else if (state.sceneIndex === i) dot.classList.add("active");
    });
  }

  function createRoot() {
    const div = document.createElement("div");
    div.id = "year-app";
    document.body.appendChild(div);
    return div;
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }
}
