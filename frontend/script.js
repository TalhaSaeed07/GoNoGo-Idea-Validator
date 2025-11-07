const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Replace with your n8n Webhook URL
const WEBHOOK_URL = "http://localhost:5678/webhook-test/097097be-a69c-493e-af64-164cd9d6cd30";

// --- Parse plain text into structured data ---
function parsePlainText(text) {
  const lines = text
    .split(/\n|(?=Idea:|Rating:|Scalability:|Pros:|Cons:|Requirements:|Regions:|Verdict:)/)
    .map(l => l.trim())
    .filter(l => l);

  const data = {};
  lines.forEach(line => {
    if (line.startsWith("Idea:")) data.idea = line.replace("Idea:", "").trim();
    else if (line.startsWith("Rating:")) data.rating = parseInt(line.replace("Rating:", "").trim());
    else if (line.startsWith("Scalability:")) data.Scalability = line.replace("Scalability:", "").trim();
    else if (line.startsWith("Pros:")) data.pros = line.replace("Pros:", "").trim().split(/,\s*/);
    else if (line.startsWith("Cons:")) data.cons = line.replace("Cons:", "").trim().split(/,\s*/);
    else if (line.startsWith("Requirements:")) data.requirements = line.replace("Requirements:", "").trim();
    else if (line.startsWith("Regions:")) data.regions = line.replace("Regions:", "").trim();
    else if (line.startsWith("Verdict:")) data.verdict = line.replace("Verdict:", "").trim();
  });
  return data;
}

// --- Render result in the chat box ---
function renderResult(data) {
  chatBox.innerHTML = `
    <div class="space-y-4">
      <p><span class="font-semibold text-pink-400">Idea:</span> ${data.idea || "N/A"}</p>

      ${data.rating !== undefined ? `
      <div>
        <span class="font-semibold text-pink-400">Rating:</span>
        <div class="flex gap-1 mt-1">
          ${[...Array(10)].map((_, i) => `
            <div class="w-6 h-6 rounded-sm ${i < data.rating ? 'bg-green-500' : 'bg-gray-600'}"></div>
          `).join('')}
        </div>
      </div>` : ""}

      ${data.Scalability ? `
      <div>
        <span class="font-semibold text-pink-400">Scalability:</span>
        <div class="w-full bg-gray-600 rounded-full h-4 mt-1">
          <div class="bg-blue-500 h-4 rounded-full" style="width:${data.Scalability};"></div>
        </div>
        <p class="text-sm text-gray-400 mt-1">${data.Scalability}</p>
      </div>` : ""}

      ${data.pros ? `
      <div>
        <span class="font-semibold text-pink-400">Pros:</span>
        <ul class="list-disc list-inside text-green-400">
          ${Array.isArray(data.pros) ? data.pros.map(p => `<li>${p}</li>`).join('') : data.pros}
        </ul>
      </div>` : ""}

      ${data.cons ? `
      <div>
        <span class="font-semibold text-pink-400">Cons:</span>
        <ul class="list-disc list-inside text-red-400">
          ${Array.isArray(data.cons) ? data.cons.map(c => `<li>${c}</li>`).join('') : data.cons}
        </ul>
      </div>` : ""}

      ${data.requirements ? `
      <div>
        <span class="font-semibold text-pink-400">Requirements:</span>
        <p>${data.requirements}</p>
      </div>` : ""}

      ${data.regions ? `
      <div>
        <span class="font-semibold text-pink-400">Regions:</span>
        <p>${data.regions}</p>
      </div>` : ""}

      ${data.verdict ? `
      <div class="mt-4 p-3 rounded-xl ${data.verdict.toLowerCase() === 'go' ? 'bg-green-700' : 'bg-red-700'} text-center font-bold text-lg">
        Verdict: ${data.verdict}
      </div>` : ""}
    </div>
  `;

  // --- Check if a PDF exists now ---
  addPdfDownloadButton(data.pdf);
}

// --- Add or update PDF Download Button ---
function addPdfDownloadButton(pdfUrl) {
  if (!pdfUrl) return;
  let existingBtn = document.getElementById("pdf-download-btn");

  if (!existingBtn) {
    const pdfSection = document.createElement("div");
    pdfSection.classList.add("mt-6", "text-center");
    pdfSection.innerHTML = `
      <a id="pdf-download-btn"
         href="${pdfUrl}"
         target="_blank"
         download="Idea_Report.pdf"
         class="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition">
         📄 Download PDF Report
      </a>
    `;
    chatBox.appendChild(pdfSection);
  } else {
    existingBtn.href = pdfUrl;
  }
}

// --- Handle form submit ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML = `<p class="text-gray-400 italic">Analyzing your idea...</p>`;
  input.value = "";

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: message }),
    });

    const data = await res.json();
    console.log("Backend response:", data);

    // Render text + PDF directly
    const parsed = parsePlainText(data.reply || "");
    parsed.pdf = data.pdf || null;
    renderResult(parsed);

  } catch (err) {
    chatBox.innerHTML = `<p class="text-red-400">⚠️ Error connecting to server</p>`;
    console.error("Error:", err);
  }
});
