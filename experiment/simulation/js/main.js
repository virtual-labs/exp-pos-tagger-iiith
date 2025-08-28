//Your JavaScript goes in here

// Helper functions to show/hide result panel
function showResultPanel() {
  const panel = document.getElementById("result-panel");
  if (panel) {
    panel.style.display = "block";
  }
}

function hideResultPanel() {
  const panel = document.getElementById("result-panel");
  if (panel) {
    panel.style.display = "none";
  }
}

// Utility to fetch and parse the data file based on language
function fetchDataFile(language, callback) {
  let file = "";
  if (language === "eng") file = "analyse-size/accuracies_english";
  else if (language === "hin") file = "analyse-size/accuracies_hindi";
  else return;
  $.ajax({
    url: file,
    dataType: "text",
    success: function (data) {
      callback(parseDataFile(data));
    },
    error: function () {
      alert("Failed to load data file.");
    },
  });
}

// Parse the tab-separated data file into an array of objects
function parseDataFile(data) {
  const lines = data.trim().split("\n");
  return lines.map((line) => {
    const tokens = line.split("\t");
    return {
      train_token: tokens[0],
      train_type: tokens[1],
      algo: tokens[2],
      feature: tokens[3],
      test_token: tokens[4],
      test_type: tokens[5],
      accuracy: tokens[6],
    };
  });
}

// Render all steps into the new layout
function renderAllSteps() {
  // Language
  document.getElementById(
    "step-language"
  ).innerHTML = `<h3 class='step-heading'>&emsp;&nbsp;1. Language</h3>
        <select autocomplete='off' name='lang' id='lang-select'>
            <option value='null'>---Select Language---</option>
            <option value='eng'>English</option>
            <option value='hin'>Hindi</option>
        </select>`;
  // Training size
  document.getElementById(
    "step-train-size"
  ).innerHTML = `<h3 class='step-heading'>&emsp;&nbsp;2. Training Corpus Size</h3>
        <select name='train' id='train' disabled>
            <option value='null'>---Select Size of Training corpus---</option>
        </select>`;
  // Algorithm
  document.getElementById(
    "step-algo"
  ).innerHTML = `<h3 class='step-heading'>&emsp;&nbsp;3. Algorithm</h3>
        <select name='algo' id='algo' disabled>
            <option value='null'>---Select Algorithm for Training---</option>
        </select>`;
  // Feature
  document.getElementById(
    "step-feature"
  ).innerHTML = `<h3 class='step-heading'>&emsp;&nbsp;4. Feature for Training</h3>
        <select name='feature' id='feature' disabled>
            <option value='null'>---Select Feature for Training---</option>
        </select>`;
  // Accuracy
  document.getElementById(
    "step-accuracy-container"
  ).innerHTML = `<button id='check-accuracy' class='sim-button' disabled>Check Accuracy</button>`;
  document.getElementById("result-content").innerHTML = "";
  hideResultPanel();
}

// Setup step logic for the new layout
function setupStepLogic() {
  let lang = null,
    train = null,
    algo = null,
    feature = null,
    data = null;
  document
    .getElementById("lang-select")
    .addEventListener("change", function () {
      lang = this.value;
      document.getElementById("train").disabled = lang === "null";
      if (lang !== "null") {
        fetchDataFile(lang, function (parsedData) {
          data = parsedData;
          // Populate train dropdown
          const uniqueTrainTokens = [
            ...new Set(data.map((row) => row.train_token)),
          ];
          let html = `<option value='null'>---Select Size of Training corpus---</option>`;
          uniqueTrainTokens.forEach((token) => {
            html += `<option value='${token}'>${token}</option>`;
          });
          document.getElementById("train").innerHTML = html;
        });
      }
      document.getElementById("train").value = "null";
      document.getElementById("algo").value = "null";
      document.getElementById("feature").value = "null";
      document.getElementById("algo").disabled = true;
      document.getElementById("feature").disabled = true;
      document.getElementById("check-accuracy").disabled = true;
      document.getElementById("result-content").innerHTML = "";
      hideResultPanel();
    });
  document.getElementById("train").addEventListener("change", function () {
    train = this.value;
    document.getElementById("algo").disabled = train === "null";
    if (train !== "null") {
      // Populate algo dropdown
      const algos = [
        ...new Set(
          data.filter((row) => row.train_token === train).map((row) => row.algo)
        ),
      ];
      let html = `<option value='null'>---Select Algorithm for Training---</option>`;
      algos.forEach((algo) => {
        html += `<option value='${algo}'>${algo}</option>`;
      });
      document.getElementById("algo").innerHTML = html;
    }
    document.getElementById("algo").value = "null";
    document.getElementById("feature").value = "null";
    document.getElementById("feature").disabled = true;
    document.getElementById("check-accuracy").disabled = true;
    document.getElementById("result-content").innerHTML = "";
    hideResultPanel();
  });
  document.getElementById("algo").addEventListener("change", function () {
    algo = this.value;
    document.getElementById("feature").disabled = algo === "null";
    if (algo !== "null") {
      // Populate feature dropdown
      const features = [
        ...new Set(
          data
            .filter((row) => row.train_token === train && row.algo === algo)
            .map((row) => row.feature)
        ),
      ];
      let html = `<option value='null'>---Select Feature for Training---</option>`;
      features.forEach((feature) => {
        html += `<option value='${feature}'>${feature}</option>`;
      });
      document.getElementById("feature").innerHTML = html;
    }
    document.getElementById("feature").value = "null";
    document.getElementById("check-accuracy").disabled = true;
    document.getElementById("result-content").innerHTML = "";
    hideResultPanel();
  });
  document.getElementById("feature").addEventListener("change", function () {
    feature = this.value;
    document.getElementById("check-accuracy").disabled = feature === "null";
    document.getElementById("result-content").innerHTML = "";
    hideResultPanel();
  });
  document
    .getElementById("check-accuracy")
    .addEventListener("click", function () {
      if (lang && train && algo && feature && data) {
        const row = data.find(
          (row) =>
            row.train_token === train &&
            row.algo === algo &&
            row.feature === feature
        );
        let resultHtml = `<b>Accuracy is: </b>${row ? row.accuracy : "N/A"}`;
        document.getElementById("result-content").innerHTML = resultHtml;
        showResultPanel();
      }
    });
  // Reset button logic
  const resetBtn = document.getElementById("reset-simulation");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      renderAllSteps();
      setupStepLogic();
    });
  }
}

// Data for the static interactive demo
const STATIC_DEMO_SENTENCES = {
  eng: [
    {
      text: "The quick brown fox jumps over the lazy dog.",
      taggedHtml:
        'The <span class="tag-sample">DET</span> quick <span class="tag-sample">ADJ</span> brown <span class="tag-sample">ADJ</span> fox <span class="tag-sample">NOUN</span> jumps <span class="tag-sample">VERB</span> over <span class="tag-sample">ADP</span> the <span class="tag-sample">DET</span> lazy <span class="tag-sample">ADJ</span> dog <span class="tag-sample">NOUN</span> . <span class="tag-sample">.</span>',
    },
    {
      text: "She reads a book every day.",
      taggedHtml:
        'She <span class="tag-sample">PRONOUN</span> reads <span class="tag-sample">VERB</span> a <span class="tag-sample">DET</span> book <span class="tag-sample">NOUN</span> every <span class="tag-sample">DET</span> day <span class="tag-sample">NOUN</span> . <span class="tag-sample">.</span>',
    },
    {
      text: "Cats sleep on soft mats.",
      taggedHtml:
        'Cats <span class="tag-sample">NOUN</span> sleep <span class="tag-sample">VERB</span> on <span class="tag-sample">ADP</span> soft <span class="tag-sample">ADJ</span> mats <span class="tag-sample">NOUN</span> . <span class="tag-sample">.</span>',
    },
  ],
  hin: [
    {
      text: "यह एक सुंदर किताब है।",
      taggedHtml:
        'यह <span class="tag-sample">PRONOUN</span> एक <span class="tag-sample">NUM</span> सुंदर <span class="tag-sample">ADJ</span> किताब <span class="tag-sample">NOUN</span> है <span class="tag-sample">VERB</span> । <span class="tag-sample">.</span>',
    },
    {
      text: "राम स्कूल जाता है।",
      taggedHtml:
        'राम <span class="tag-sample">NOUN</span> स्कूल <span class="tag-sample">NOUN</span> जाता <span class="tag-sample">VERB</span> है <span class="tag-sample">VERB</span> । <span class="tag-sample">.</span>',
    },
    {
      text: "बिल्ली दूध पीती है।",
      taggedHtml:
        'बिल्ली <span class="tag-sample">NOUN</span> दूध <span class="tag-sample">NOUN</span> पीती <span class="tag-sample">VERB</span> है <span class="tag-sample">VERB</span> । <span class="tag-sample">.</span>',
    },
  ],
};

// Setup for the interactive demo (now in result panel)
function setupInteractiveDemo() {
  const selectEl = document.getElementById("result-demo-select");
  const outputEl = document.getElementById("result-demo-output");
  if (!selectEl || !outputEl) return;
  // Helper to repopulate dropdown based on language
  function populateDemoDropdown(lang) {
    selectEl.innerHTML =
      '<option value="placeholder">-- Choose an example --</option>';
    if (!STATIC_DEMO_SENTENCES[lang]) return;
    STATIC_DEMO_SENTENCES[lang].forEach((ex, idx) => {
      const option = document.createElement("option");
      option.value = idx;
      option.textContent = ex.text;
      selectEl.appendChild(option);
    });
  }
  // Add event listener
  selectEl.addEventListener("change", function () {
    const lang = window.currentDemoLang || "eng";
    const idx = this.value;
    if (idx === "placeholder") {
      outputEl.innerHTML = "";
    } else {
      outputEl.innerHTML = STATIC_DEMO_SENTENCES[lang][idx].taggedHtml;
    }
  });
  // Hide by default
  selectEl.style.display = "none";
  outputEl.style.display = "none";
  // Listen for language change
  window.setDemoLanguage = function (lang) {
    window.currentDemoLang = lang;
    populateDemoDropdown(lang);
    selectEl.value = "placeholder";
    outputEl.innerHTML = "";
  };
  // Default to English
  window.setDemoLanguage("eng");
}

// Helper to show/hide demo after accuracy
function showDemoAfterAccuracy() {
  const selectEl = document.getElementById("result-demo-select");
  const outputEl = document.getElementById("result-demo-output");
  if (selectEl && outputEl) {
    selectEl.style.display = "";
    outputEl.style.display = "";
    selectEl.value = "placeholder";
    outputEl.innerHTML = "";
  }
}
function hideDemo() {
  const selectEl = document.getElementById("result-demo-select");
  const outputEl = document.getElementById("result-demo-output");
  if (selectEl && outputEl) {
    selectEl.style.display = "none";
    outputEl.style.display = "none";
    selectEl.value = "placeholder";
    outputEl.innerHTML = "";
  }
}

// Setup instructions panel functionality
function setupInstructionsPanel() {
  const tab = document.getElementById("instructionsTab");
  const instructionsContent = document.getElementById("instructionsContent");
  const arrowIcon = tab ? tab.querySelector(".arrow-icon") : null;
  const instructionsPanel = tab ? tab.closest(".instructions-panel") : null;

  if (tab && instructionsContent && instructionsPanel) {
    // Start collapsed by default (instructions hidden)
    instructionsContent.classList.add("collapsed");
    instructionsPanel.classList.add("collapsed");

    tab.addEventListener("click", () => {
      const isCollapsed = instructionsContent.classList.contains("collapsed");
      if (isCollapsed) {
        // Expand: remove collapsed classes
        instructionsContent.classList.remove("collapsed");
        instructionsPanel.classList.remove("collapsed");
      } else {
        // Collapse: add collapsed classes
        instructionsContent.classList.add("collapsed");
        instructionsPanel.classList.add("collapsed");
      }
    });
  }
}

// Setup info icon interactions
function setupInfoIcons() {
  const infoIcons = document.querySelectorAll(".info-icon");
  infoIcons.forEach((icon) => {
    // Make info icons accessible via keyboard
    icon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // Could show a modal or alert with the title text
        const title = icon.getAttribute("title");
        if (title) {
          alert(title);
        }
      }
    });

    // Optional: show tooltip on click for mobile users
    icon.addEventListener("click", (e) => {
      e.preventDefault();
      const title = icon.getAttribute("title");
      if (title) {
        // Create a temporary tooltip or use native browser tooltip
        const existingTooltip = document.querySelector(".temp-tooltip");
        if (existingTooltip) {
          existingTooltip.remove();
        }

        const tooltip = document.createElement("div");
        tooltip.className = "temp-tooltip";
        tooltip.textContent = title;
        tooltip.style.cssText = `
                    position: absolute;
                    background: var(--color-neutral-800);
                    color: white;
                    padding: 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.8rem;
                    z-index: 1000;
                    max-width: 200px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    top: ${e.pageY + 10}px;
                    left: ${e.pageX + 10}px;
                `;
        document.body.appendChild(tooltip);

        // Remove tooltip after 3 seconds
        setTimeout(() => {
          tooltip.remove();
        }, 3000);
      }
    });
  });
}

// On DOMContentLoaded, render all steps and set up logic
window.addEventListener("DOMContentLoaded", function () {
  renderAllSteps();
  setupStepLogic();
  setupInteractiveDemo();
  setupInstructionsPanel();
  setupInfoIcons();
  // Ensure check accuracy button always has sim-button class
  const checkBtn = document.getElementById("check-accuracy");
  if (checkBtn) checkBtn.classList.add("sim-button");
});

// Patch setupStepLogic to show/hide demo appropriately and update language
const origSetupStepLogic = setupStepLogic;
setupStepLogic = function () {
  origSetupStepLogic();
  // Patch event listeners for dropdowns and check accuracy
  const langSel = document.getElementById("lang-select");
  const trainSel = document.getElementById("train");
  const algoSel = document.getElementById("algo");
  const featSel = document.getElementById("feature");
  const checkBtn = document.getElementById("check-accuracy");
  hideDemo();
  if (langSel)
    langSel.addEventListener("change", function () {
      hideDemo();
      if (window.setDemoLanguage) window.setDemoLanguage(this.value);
    });
  if (trainSel) trainSel.addEventListener("change", hideDemo);
  if (algoSel) algoSel.addEventListener("change", hideDemo);
  if (featSel) featSel.addEventListener("change", hideDemo);
  if (checkBtn)
    checkBtn.addEventListener("click", function () {
      // Only show demo if accuracy is shown
      const resultContent = document.getElementById("result-content");
      if (
        resultContent &&
        resultContent.textContent.trim().startsWith("Accuracy is:")
      ) {
        showDemoAfterAccuracy();
      }
    });
};

//# sourceMappingURL=main.js.map
