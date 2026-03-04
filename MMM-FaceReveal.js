/*****
MMM-FaceReveal, Copyright © 2026 Dr. Jody Paul, is licensed under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the "Software"), to deal in the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*****/
// ---- Requires face & card paired files. ----
Module.register("MMM-FaceReveal", {
  defaults: {
    facesPath: "images/face-reveal/faces",
    cardsPath: "images/face-reveal/cards",

    faceSuffix: "_face",
    cardSuffix: "_card",
    
    width: null,
    height: null,
    maxWidth: null,
    maxHeight: null,
    objectFit: "contain", // "contain" | "cover"

    // Prompt options
    prompts: ["Who is this?"],
    promptMode: "cycle", // "cycle" | "random"
    promptClassName: "mmfr-prompt",

    // Delay/Transition options
    faceDelayMs: 8000,
    revealDelayMs: 8000,
    transitionMs: 300,

    shufflePerLoop: true,
  },

  start() {
    this.pairs = [];
    this.order = [];
    this.orderIndex = 0;

    this.phase = "LOADING"; // FACE | REVEAL | LOADING | EMPTY | ERROR
    this.timer = null;

    this.promptIndex = 0;
    this.currentPrompt = "";

    this.sendSocketNotification("MMFR_GET_PAIRS", {
      facesPath: this.config.facesPath,
      cardsPath: this.config.cardsPath,
      faceSuffix: this.config.faceSuffix,
      cardSuffix: this.config.cardSuffix
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "MMFR_PAIRS") {
      this.pairs = payload.pairs || [];

      if (!this.pairs.length) {
        this.phase = "EMPTY";
        this.updateDom();
        return;
      }

      // Initialize ordering
      this.resetOrder();

      this.phase = "FACE";
      this.pickPrompt();
      this.updateDom(0);
      this.scheduleNext(this.config.faceDelayMs);
      return;
    }

    if (notification === "MMFR_ERROR") {
      this.phase = "ERROR";
      this.errorMessage = payload && payload.message ? payload.message : "Unknown error";
      this.updateDom();
    }
  },

  resetOrder() {
    this.order = Array.from({ length: this.pairs.length }, (_, i) => i);
    if (this.config.shufflePerLoop) {
      this.shuffle(this.order);
    }
    this.orderIndex = 0;
  },

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  },

  scheduleNext(delay) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.advance(), delay);
  },

  pickPrompt() {
    const prompts = Array.isArray(this.config.prompts) ? this.config.prompts.filter(Boolean) : [];
    if (!prompts.length) {
      this.currentPrompt = "";
      return;
    }

    if (this.config.promptMode === "random") {
      this.currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      return;
    }

    // Default: cycle
    this.currentPrompt = prompts[this.promptIndex % prompts.length];
    this.promptIndex += 1;
  },

  advance() {
    if (!this.pairs.length) return;

    if (this.phase === "FACE") {
      this.phase = "REVEAL";
      this.updateDom(this.config.transitionMs);
      this.scheduleNext(this.config.revealDelayMs);
      return;
    }

    if (this.phase === "REVEAL") {
      // Move to next in current order
      this.orderIndex += 1;

      if (this.orderIndex >= this.order.length) {
        // Begin a new loop
        this.resetOrder();
      }

      this.phase = "FACE";
      this.pickPrompt();
      this.updateDom(this.config.transitionMs);
      this.scheduleNext(this.config.faceDelayMs);
    }
  },

  getStyles() {
    return ["MMM-FaceReveal.css"];
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "mmfr-wrapper";

    if (this.phase === "LOADING") {
      wrapper.innerText = "Loading…";
      wrapper.classList.add("dimmed", "small");
      return wrapper;
    }

    if (this.phase === "EMPTY") {
      wrapper.innerText = "No matching face/card pairs found.";
      wrapper.classList.add("dimmed", "small");
      return wrapper;
    }

    if (this.phase === "ERROR") {
      wrapper.innerText = `MMM-FaceReveal error: ${this.errorMessage || "Unknown error"}`;
      wrapper.classList.add("dimmed", "small");
      return wrapper;
    }

    const pair = this.pairs[this.order[this.orderIndex]];
    const imgSrc = this.phase === "FACE" ? pair.faceUrl : pair.cardUrl;

    const img = document.createElement("img");
    img.className = "mmfr-image";
    img.src = imgSrc;
    img.alt = pair.key;

    // Explicit sizing controls
    if (this.config.width) img.style.width = this.config.width;
    if (this.config.height) img.style.height = this.config.height;
    if (this.config.maxWidth) img.style.maxWidth = this.config.maxWidth;
    if (this.config.maxHeight) img.style.maxHeight = this.config.maxHeight;

    img.style.objectFit = this.config.objectFit || "contain";

    wrapper.appendChild(img);

    const prompt = document.createElement("div");
    prompt.className = this.config.promptClassName || "mmfr-prompt";
    prompt.innerText = this.currentPrompt || "";

    // Fade prompt out during REVEAL (to blank)
    if (this.phase === "REVEAL") {
      prompt.classList.add("mmfr-prompt-hidden");
    }

    wrapper.appendChild(prompt);
    return wrapper;
  }
});
