(() => {
  "use strict";
  const photoCanvas = document.getElementById("preview-canvas");
  const previewPanel = document.querySelector(".preview-panel");
  if (!photoCanvas || !previewPanel) return;

  const DPI = 300;
  const SHEET_W_MM = 100;
  const SHEET_H_MM = 150;
  const MM_TO_PX = DPI / 25.4;
  const sheetCanvas = document.createElement("canvas");
  sheetCanvas.width = Math.round(SHEET_W_MM * MM_TO_PX);
  sheetCanvas.height = Math.round(SHEET_H_MM * MM_TO_PX);

  const panel = document.createElement("section");
  panel.className = "print-collage-panel";
  panel.innerHTML = `
    <div class="print-collage-heading"><span class="step">04</span><div><h2>Print / Auto Collage</h2><p>Susun beberapa salinan foto otomatis pada kertas 10 × 15 cm.</p></div></div>
    <div class="print-collage-controls">
      <label for="print-count">Jumlah foto</label>
      <select id="print-count">
        <option value="1">1 foto</option><option value="2">2 foto</option>
        <option value="4" selected>4 foto</option><option value="6">6 foto</option>
        <option value="8">8 foto</option><option value="10">10 foto</option>
        <option value="12">12 foto</option><option value="16">16 foto</option>
        <option value="20">20 foto</option><option value="custom">Jumlah khusus</option>
      </select>
      <input id="print-custom-count" type="number" min="1" max="30" value="4" aria-label="Jumlah foto khusus" hidden>
      <label for="print-margin">Margin kertas</label>
      <select id="print-margin"><option value="2">2 mm</option><option value="3" selected>3 mm</option><option value="5">5 mm</option></select>
      <label for="print-gap">Jarak antar foto</label>
      <select id="print-gap"><option value="1">1 mm</option><option value="2" selected>2 mm</option><option value="3">3 mm</option></select>
    </div>
    <div class="print-sheet-stage"><canvas id="print-sheet-preview" aria-label="Pratinjau kolase cetak 10 x 15 cm"></canvas></div>
    <p id="print-layout-info" class="print-layout-info">Unggah dan crop foto untuk membuat kolase.</p>
    <p class="print-instructions">Ukuran lembar 100 × 150 mm · 300 DPI. Saat mencetak pilih kertas 10 × 15 cm (4 × 6 inci), orientasi potret, margin nol/tanpa border jika printer mendukung, dan skala 100% / Actual size. Matikan opsi “Fit to page”. Area cetak printer dapat menyisakan tepi putih.</p>
    <div class="print-collage-actions">
      <button type="button" class="button button-secondary" id="print-refresh" disabled>Perbarui kolase</button>
      <button type="button" class="button button-secondary" id="print-download" disabled>Simpan lembar JPG</button>
      <button type="button" class="button button-primary" id="print-now" disabled>Cetak lembar 10 × 15 cm</button>
    </div>`;
  previewPanel.insertAdjacentElement("afterend", panel);

  const style = document.createElement("style");
  style.textContent = `
    .print-collage-panel{grid-column:1/-1;margin-top:2px;padding:26px;background:#fff;border:1px solid #dce7e8;border-radius:22px;box-shadow:0 12px 34px rgba(18,48,63,.055)}
    .print-collage-heading{display:flex;align-items:flex-start;gap:12px;margin-bottom:18px}.print-collage-heading h2{margin:0;font-size:17px;color:#142f40}.print-collage-heading p{margin:4px 0 0;color:#627587;font-size:12px}
    .print-collage-controls{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:9px;align-items:center;margin-bottom:16px}
    .print-collage-controls label{font-size:11px;font-weight:700;color:#39475a}.print-collage-controls select,.print-collage-controls input{width:100%;min-height:42px;padding:0 10px;border:1px solid #d4e1e3;border-radius:10px;background:#fff;color:#142a3b;font:inherit;font-size:12px}
    .print-sheet-stage{display:grid;place-items:center;padding:18px;background:#edf2f2;border:1px solid #e0e9e9;border-radius:14px}
    #print-sheet-preview{display:block;width:min(100%,320px);height:auto;aspect-ratio:2/3;background:#fff;box-shadow:0 12px 28px rgba(16,38,59,.18);border:1px solid #dce4e4}
    .print-layout-info{margin:12px 0 0;color:#176b62;font-size:12px;font-weight:700;text-align:center}
    .print-instructions{margin:12px 0;padding:12px;border-radius:10px;background:#f3f8f7;color:#536875;font-size:11px;line-height:1.65}
    .print-collage-actions{display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:9px;margin-top:14px}
    @media(max-width:700px){.print-collage-panel{padding:18px}.print-collage-controls{grid-template-columns:1fr 1fr}.print-collage-actions{grid-template-columns:1fr}.print-collage-controls label{align-self:end}}
    @media print{ @page{size:100mm 150mm;margin:0} body *{visibility:hidden!important} #pfvisa-print-root,#pfvisa-print-root *{visibility:visible!important} #pfvisa-print-root{position:fixed;inset:0;width:100mm;height:150mm;margin:0;padding:0} #pfvisa-print-root img{display:block;width:100mm;height:150mm;object-fit:fill} }
  `;
  document.head.appendChild(style);

  const $ = (id) => document.getElementById(id);
  const countSelect = $("print-count");
  const customCount = $("print-custom-count");
  const marginSelect = $("print-margin");
  const gapSelect = $("print-gap");
  const outputCanvas = $("print-sheet-preview");
  const outputContext = outputCanvas.getContext("2d");
  const info = $("print-layout-info");
  const refreshButton = $("print-refresh");
  const downloadButton = $("print-download");
  const printButton = $("print-now");
  outputCanvas.width = sheetCanvas.width;
  outputCanvas.height = sheetCanvas.height;

  function selectedCount() {
    return countSelect.value === "custom"
      ? Math.max(1, Math.min(30, Math.round(Number(customCount.value) || 1)))
      : Number(countSelect.value);
  }

  function calculateLayout(count, photoRatio, margin, gap) {
    const usableW = SHEET_W_MM - margin * 2;
    const usableH = SHEET_H_MM - margin * 2;
    let best = null;
    for (let cols = 1; cols <= Math.min(count, 10); cols++) {
      const rows = Math.ceil(count / cols);
      const cellW = (usableW - gap * (cols - 1)) / cols;
      const cellH = (usableH - gap * (rows - 1)) / rows;
      const width = Math.min(cellW, cellH * photoRatio);
      const height = width / photoRatio;
      const score = width * height;
      if (!best || score > best.score) best = { cols, rows, width, height, score };
    }
    return best;
  }

  function drawCollage() {
    if (photoCanvas.hidden || !photoCanvas.width || !photoCanvas.height) {
      info.textContent = "Unggah foto dan selesaikan crop terlebih dahulu.";
      refreshButton.disabled = downloadButton.disabled = printButton.disabled = true;
      return false;
    }
    const count = selectedCount();
    const margin = Number(marginSelect.value);
    const gap = Number(gapSelect.value);
    const ratio = photoCanvas.width / photoCanvas.height;
    const layout = calculateLayout(count, ratio, margin, gap);
    const ctx = sheetCanvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);
    const usedW = layout.cols * layout.width + (layout.cols - 1) * gap;
    const usedH = layout.rows * layout.height + (layout.rows - 1) * gap;
    const startX = (SHEET_W_MM - usedW) / 2;
    const startY = (SHEET_H_MM - usedH) / 2;
    for (let i = 0; i < count; i++) {
      const col = i % layout.cols;
      const row = Math.floor(i / layout.cols);
      const x = (startX + col * (layout.width + gap)) * MM_TO_PX;
      const y = (startY + row * (layout.height + gap)) * MM_TO_PX;
      const w = layout.width * MM_TO_PX;
      const h = layout.height * MM_TO_PX;
      ctx.drawImage(photoCanvas, x, y, w, h);
    }
    outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    outputContext.drawImage(sheetCanvas, 0, 0);
    info.textContent = count + " foto · susunan " + layout.cols + " kolom × " + layout.rows + " baris · tiap foto sekitar " + layout.width.toFixed(1) + " × " + layout.height.toFixed(1) + " mm · lembar 10 × 15 cm";
    refreshButton.disabled = downloadButton.disabled = printButton.disabled = false;
    return true;
  }

  function getJpegUrl() { return sheetCanvas.toDataURL("image/jpeg", 0.96); }
  function printSheet() {
    if (!drawCollage()) return;
    const popup = window.open("", "_blank");
    if (!popup) {
      info.textContent = "Popup diblokir browser. Izinkan popup untuk situs ini lalu tekan Cetak kembali.";
      return;
    }
    const imageUrl = getJpegUrl();
    popup.document.open();
    popup.document.write('<!doctype html><html><head><meta charset="utf-8"><title>PFVISA Print 10x15 cm</title><style>@page{size:100mm 150mm;margin:0}html,body{margin:0;padding:0;width:100mm;height:150mm;background:#fff}img{display:block;width:100mm;height:150mm}</style></head><body><img src="' + imageUrl + '" alt="Kolase foto 10 x 15 cm"><script>window.onload=function(){setTimeout(function(){window.focus();window.print()},250)};<\/script></body></html>');
    popup.document.close();
  }

  countSelect.addEventListener("change", () => {
    customCount.hidden = countSelect.value !== "custom";
    drawCollage();
  });
  [customCount, marginSelect, gapSelect].forEach((el) => el.addEventListener("input", drawCollage));
  [marginSelect, gapSelect].forEach((el) => el.addEventListener("change", drawCollage));
  refreshButton.addEventListener("click", drawCollage);
  downloadButton.addEventListener("click", () => {
    if (!drawCollage()) return;
    const link = document.createElement("a");
    link.href = getJpegUrl();
    link.download = "pfvisa-collage-10x15cm-300dpi.jpg";
    link.click();
  });
  printButton.addEventListener("click", printSheet);
  document.addEventListener("click", (event) => {
    if (event.target.closest("#auto-crop-btn,#crop-mode-btn,#reset-btn")) setTimeout(drawCollage, 150);
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches("#size-preset,#custom-width,#custom-height,#country-select,#document-select,#dpi")) setTimeout(drawCollage, 150);
  });
  document.addEventListener("input", (event) => {
    if (event.target.matches("#crop-zoom,#custom-width,#custom-height")) setTimeout(drawCollage, 100);
  });
  const observer = new MutationObserver(() => {
    if (!photoCanvas.hidden) drawCollage();
  });
  observer.observe(photoCanvas, { attributes: true, attributeFilter: ["width", "height", "hidden"] });
  const initial = outputContext;
  initial.fillStyle = "#fff";
  initial.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
  drawCollage();
})();