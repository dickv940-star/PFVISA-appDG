(() => {
  "use strict";
  const photoCanvas = document.getElementById("preview-canvas");
  const previewPanel = document.querySelector(".preview-panel");
  const editorWorkspace = document.querySelector(".workspace");
  const introSection = document.querySelector(".intro");
  const pageRoot = document.querySelector("main.page");
  const cropActions = document.querySelector(".crop-actions");
  if (!photoCanvas || !previewPanel || !editorWorkspace || !pageRoot || !cropActions) return;

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
    <section class="print-crop-section" aria-label="Penyesuaian crop khusus cetak">
      <div class="print-crop-heading"><div><h3>Foto untuk dicetak</h3><p>Secara default memakai hasil crop dari Editor. Crop ulang hanya jika ingin mengubah komposisi khusus cetak.</p></div><span id="print-crop-state">Menggunakan crop Editor</span></div>
      <button type="button" class="button button-secondary" id="print-recrop-toggle">Crop Ulang Foto</button>
      <div id="print-recrop-tools" hidden>
        <div class="print-recrop-preview"><canvas id="print-recrop-preview" aria-label="Pratinjau crop ulang untuk cetak"></canvas></div>
        <label for="print-recrop-zoom">Zoom crop <output id="print-recrop-zoom-value">100%</output></label>
        <input id="print-recrop-zoom" type="range" min="1" max="2.5" value="1" step="0.05">
        <p>Geser foto pada pratinjau untuk mengatur posisi. Hasil ini hanya digunakan di halaman cetak dan tidak mengubah crop di Editor.</p>
        <div class="print-recrop-actions">
          <button type="button" class="button button-secondary" id="print-recrop-reset">Reset crop</button>
          <button type="button" class="button button-primary" id="print-recrop-apply">Terapkan Crop Cetak</button>
          <button type="button" class="button button-secondary" id="print-recrop-cancel">Batal</button>
        </div>
      </div>
    </section>
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
      <label for="print-paper">Jenis kertas Epson</label>
      <select id="print-paper"><option value="glossy" selected>Glossy / mengkilap</option><option value="matte">Matte / doff</option></select>
      <label for="print-stroke-enabled">Stroke / garis tepi</label>
      <label class="print-check-control"><input id="print-stroke-enabled" type="checkbox"> Aktifkan stroke</label>
      <label for="print-stroke-color">Warna stroke</label>
      <input id="print-stroke-color" type="color" value="#222222" aria-label="Warna stroke foto">
      <label for="print-stroke-width">Ketebalan stroke <output id="print-stroke-width-value">0.3 mm</output></label>
      <input id="print-stroke-width" type="range" min="0.1" max="2" value="0.3" step="0.1">
      <label for="print-brightness">Kecerahan <output id="print-brightness-value">100%</output></label>
      <input id="print-brightness" type="range" min="80" max="120" value="100" step="1">
      <label for="print-contrast">Kontras <output id="print-contrast-value">100%</output></label>
      <input id="print-contrast" type="range" min="80" max="120" value="100" step="1">
      <label for="print-saturation">Saturasi <output id="print-saturation-value">100%</output></label>
      <input id="print-saturation" type="range" min="70" max="130" value="100" step="1">
      <label for="print-red-balance">Keseimbangan merah <output id="print-red-balance-value">0</output></label>
      <input id="print-red-balance" type="range" min="-20" max="20" value="0" step="1">
      <label for="print-green-balance">Keseimbangan hijau <output id="print-green-balance-value">0</output></label>
      <input id="print-green-balance" type="range" min="-20" max="20" value="0" step="1">
      <label for="print-blue-balance">Keseimbangan biru <output id="print-blue-balance-value">0</output></label>
      <input id="print-blue-balance" type="range" min="-20" max="20" value="0" step="1">
      <button type="button" class="button button-secondary" id="print-color-reset">Reset warna</button>
    </div>
    <div class="print-sheet-stage"><canvas id="print-sheet-preview" aria-label="Pratinjau kolase cetak 10 x 15 cm"></canvas></div>
    <p id="print-layout-info" class="print-layout-info">Unggah dan crop foto untuk membuat kolase.</p>
    <p id="print-paper-guide" class="print-instructions">Epson: pilih ukuran kertas 10 × 15 cm (4 × 6 inci), jenis media Glossy Photo Paper yang paling sesuai dengan kertas glossy Anda, kualitas High/Best Photo, orientasi potret, dan skala 100% / Actual size. Matikan “Fit to page”. Nama opsi media dapat berbeda menurut model Epson dan merek kertas.</p>
    <div class="print-collage-actions">
      <button type="button" class="button button-secondary" id="print-refresh" disabled>Perbarui kolase</button>
      <button type="button" class="button button-secondary" id="print-download" disabled>Simpan lembar JPG</button>
      <button type="button" class="button button-primary" id="print-now" disabled>Cetak lembar 10 × 15 cm</button>
    </div>`;
  const printPage = document.createElement("section");
  printPage.className = "print-page";
  printPage.id = "print-page";
  printPage.hidden = true;
  printPage.setAttribute("aria-label", "Halaman pengaturan dan cetak foto");
  const pageNav = document.createElement("div");
  pageNav.className = "print-page-nav";
  pageNav.innerHTML = '<button type="button" class="button button-secondary" id="print-back-editor">← Kembali ke editor</button><div class="print-step-indicator"><span class="done">01 · Crop foto</span><span class="active">02 · Atur & cetak</span></div>';
  printPage.appendChild(pageNav);
  printPage.appendChild(panel);
  editorWorkspace.insertAdjacentElement("afterend", printPage);

  const continueButton = document.createElement("button");
  continueButton.type = "button";
  continueButton.id = "open-print-page";
  continueButton.className = "button button-primary";
  continueButton.textContent = "Lanjut ke halaman cetak 10 × 15 cm →";
  continueButton.disabled = true;
  cropActions.appendChild(continueButton);

  const navStyle = document.createElement("style");
  navStyle.textContent = `
    .print-page{margin-top:24px}
    .print-page-nav{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:16px}
    .print-step-indicator{display:flex;gap:8px;flex-wrap:wrap;font-size:11px;font-weight:750}
    .print-step-indicator span{padding:8px 11px;border-radius:999px;background:#edf2f4;color:#617587}
    .print-step-indicator .done{background:#e3f5ed;color:#08745f}
    .print-step-indicator .active{background:#e5f2ef;color:#176b62}

    #open-print-page{width:100%;margin-top:4px}
    .print-crop-section{margin:0 0 20px;padding:16px;border:1px solid #d8e7e4;border-radius:14px;background:#f7fbfa}
    .print-crop-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
    .print-crop-heading h3{margin:0;color:#183b46;font-size:14px}
    .print-crop-heading p{margin:4px 0 0;color:#627587;font-size:11px;line-height:1.55}
    #print-crop-state{flex:0 0 auto;padding:6px 9px;border-radius:999px;background:#e1f3ec;color:#08745f;font-size:10px;font-weight:800}
    #print-recrop-toggle{width:100%}
    #print-recrop-tools{margin-top:14px}
    .print-recrop-preview{display:grid;place-items:center;max-height:360px;overflow:hidden;padding:14px;border-radius:12px;background:#eaf0f0}
    #print-recrop-preview{display:block;max-width:min(100%,260px);max-height:330px;width:auto;height:auto;aspect-ratio:3/4;touch-action:none;cursor:grab;background:#fff;box-shadow:0 8px 22px rgba(16,38,59,.16)}
    #print-recrop-preview:active{cursor:grabbing}
    #print-recrop-tools>label{display:flex;justify-content:space-between;margin:12px 0 6px;font-size:12px;font-weight:750}
    #print-recrop-zoom{width:100%;accent-color:#176b62}
    #print-recrop-tools>p{margin:8px 0;color:#627587;font-size:11px;line-height:1.6}
    .print-recrop-actions{display:flex;gap:8px;flex-wrap:wrap}
    .print-recrop-actions .button{flex:1;min-width:130px}
    @media(max-width:520px){.print-page-nav{align-items:flex-start;flex-direction:column}}
  `;
  document.head.appendChild(navStyle);

  function showPrintPage() {
    if (photoCanvas.hidden || !photoCanvas.width || !photoCanvas.height) {
      const status = document.getElementById("status");
      if (status) status.textContent = "Selesaikan crop foto terlebih dahulu sebelum membuka halaman cetak.";
      return;
    }
    if (!captureEditorCrop()) return;
    if (!drawCollage()) return;
    if (introSection) introSection.hidden = true;
    editorWorkspace.hidden = true;
    printPage.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function showEditorPage() {
    printPage.hidden = true;
    editorWorkspace.hidden = false;
    if (introSection) introSection.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  continueButton.addEventListener("click", showPrintPage);
  pageNav.querySelector("#print-back-editor").addEventListener("click", showEditorPage);

  const style = document.createElement("style");
  style.textContent = `
    .print-collage-panel{grid-column:1/-1;margin-top:2px;padding:26px;background:#fff;border:1px solid #dce7e8;border-radius:22px;box-shadow:0 12px 34px rgba(18,48,63,.055)}
    .print-collage-heading{display:flex;align-items:flex-start;gap:12px;margin-bottom:18px}.print-collage-heading h2{margin:0;font-size:17px;color:#142f40}.print-collage-heading p{margin:4px 0 0;color:#627587;font-size:12px}
    .print-collage-controls{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:9px;align-items:center;margin-bottom:16px}
    .print-collage-controls label{font-size:11px;font-weight:700;color:#39475a}.print-collage-controls select,.print-collage-controls input:not([type="range"]){width:100%;min-height:42px;padding:0 10px;border:1px solid #d4e1e3;border-radius:10px;background:#fff;color:#142a3b;font:inherit;font-size:12px}
    .print-collage-controls input[type="range"]{width:100%;accent-color:#177e78;min-height:30px}
    .print-collage-controls output{float:right;color:#14736b;font-variant-numeric:tabular-nums}
    .print-collage-controls .print-check-control{display:flex;align-items:center;gap:8px;min-height:42px;font-size:12px}.print-check-control input{width:17px;height:17px;accent-color:#176b62}.print-collage-controls input[type="color"]{min-height:42px;padding:4px;cursor:pointer}
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
  const paperSelect = $("print-paper");
  const brightnessInput = $("print-brightness");
  const contrastInput = $("print-contrast");
  const saturationInput = $("print-saturation");
  const redBalanceInput = $("print-red-balance");
  const greenBalanceInput = $("print-green-balance");
  const blueBalanceInput = $("print-blue-balance");
  const strokeEnabledInput = $("print-stroke-enabled");
  const strokeColorInput = $("print-stroke-color");
  const strokeWidthInput = $("print-stroke-width");
  const paperGuide = $("print-paper-guide");
  const outputCanvas = $("print-sheet-preview");
  const printPhotoCanvas = document.createElement("canvas");
  const recropPreview = $("print-recrop-preview");
  const recropTools = $("print-recrop-tools");
  const recropToggle = $("print-recrop-toggle");
  const recropZoom = $("print-recrop-zoom");
  const recropZoomValue = $("print-recrop-zoom-value");
  const recropState = $("print-crop-state");
  const recropBaseCanvas = document.createElement("canvas");
  const recropBaseContext = recropBaseCanvas.getContext("2d");
  const recropPreviewContext = recropPreview.getContext("2d");
  let recropScale = 1, recropPanX = 0, recropPanY = 0, recropDragging = null, recropActive = false;
  const outputContext = outputCanvas.getContext("2d");
  const info = $("print-layout-info");
  const refreshButton = $("print-refresh");
  const downloadButton = $("print-download");
  const printButton = $("print-now");
  outputCanvas.width = sheetCanvas.width;
  outputCanvas.height = sheetCanvas.height;

  function captureEditorCrop() {
    if (photoCanvas.hidden || !photoCanvas.width || !photoCanvas.height) return false;
    printPhotoCanvas.width = photoCanvas.width;
    printPhotoCanvas.height = photoCanvas.height;
    printPhotoCanvas.getContext("2d", { alpha: false }).drawImage(photoCanvas, 0, 0);
    recropBaseCanvas.width = photoCanvas.width;
    recropBaseCanvas.height = photoCanvas.height;
    recropBaseContext.drawImage(photoCanvas, 0, 0);
    recropScale = 1; recropPanX = 0; recropPanY = 0;
    recropZoom.value = "1"; recropZoomValue.textContent = "100%";
    recropActive = false; recropTools.hidden = true;
    recropToggle.textContent = "Crop Ulang Foto";
    recropState.textContent = "Menggunakan crop Editor";
    drawRecropPreview();
    return true;
  }

  function drawRecropPreview() {
    if (!recropBaseCanvas.width || !recropBaseCanvas.height) return;
    const width = recropPreview.width = recropBaseCanvas.width;
    const height = recropPreview.height = recropBaseCanvas.height;
    const context = recropPreviewContext;
    context.fillStyle = "#fff"; context.fillRect(0, 0, width, height);
    const scaledWidth = width * recropScale, scaledHeight = height * recropScale;
    const maxX = Math.max(0, (scaledWidth - width) / 2), maxY = Math.max(0, (scaledHeight - height) / 2);
    const dx = (width - scaledWidth) / 2 + recropPanX * maxX;
    const dy = (height - scaledHeight) / 2 + recropPanY * maxY;
    context.imageSmoothingEnabled = true; context.imageSmoothingQuality = "high";
    context.drawImage(recropBaseCanvas, dx, dy, scaledWidth, scaledHeight);
    recropZoomValue.textContent = Math.round(recropScale * 100) + "%";
  }

  function applyPrintRecrop() {
    if (!recropBaseCanvas.width || !recropBaseCanvas.height) return;
    printPhotoCanvas.width = recropBaseCanvas.width;
    printPhotoCanvas.height = recropBaseCanvas.height;
    printPhotoCanvas.getContext("2d", { alpha: false }).drawImage(recropPreview, 0, 0);
    recropActive = false; recropTools.hidden = true;
    recropToggle.textContent = "Ubah Crop Cetak";
    recropState.textContent = "Crop khusus cetak diterapkan";
    drawCollage();
  }

  recropToggle.addEventListener("click", () => {
    if (!recropBaseCanvas.width && !captureEditorCrop()) return;
    recropActive = !recropActive; recropTools.hidden = !recropActive;
    if (recropActive) {
      recropScale = 1; recropPanX = 0; recropPanY = 0; recropZoom.value = "1";
      drawRecropPreview();
    }
  });
  recropZoom.addEventListener("input", () => {
    recropScale = Math.max(1, Math.min(2.5, Number(recropZoom.value) || 1));
    drawRecropPreview();
  });
  $("print-recrop-reset").addEventListener("click", () => {
    recropScale = 1; recropPanX = 0; recropPanY = 0; recropZoom.value = "1";
    drawRecropPreview();
  });
  $("print-recrop-apply").addEventListener("click", applyPrintRecrop);
  $("print-recrop-cancel").addEventListener("click", () => { recropActive = false; recropTools.hidden = true; });
  recropPreview.addEventListener("pointerdown", (event) => {
    if (!recropActive) return;
    recropDragging = { x: event.clientX, y: event.clientY };
    recropPreview.setPointerCapture(event.pointerId); event.preventDefault();
  });
  recropPreview.addEventListener("pointermove", (event) => {
    if (!recropActive || !recropDragging || recropScale <= 1) return;
    const rect = recropPreview.getBoundingClientRect();
    const maxX = Math.max(1, recropPreview.width * (recropScale - 1) / 2);
    const maxY = Math.max(1, recropPreview.height * (recropScale - 1) / 2);
    recropPanX = Math.max(-1, Math.min(1, recropPanX + (event.clientX - recropDragging.x) * recropPreview.width / Math.max(1, rect.width) / maxX));
    recropPanY = Math.max(-1, Math.min(1, recropPanY + (event.clientY - recropDragging.y) * recropPreview.height / Math.max(1, rect.height) / maxY));
    recropDragging = { x: event.clientX, y: event.clientY }; drawRecropPreview();
  });
  const endRecropDrag = () => { recropDragging = null; };
  recropPreview.addEventListener("pointerup", endRecropDrag);
  recropPreview.addEventListener("pointercancel", endRecropDrag);

  function selectedCount() {
    return countSelect.value === "custom"
      ? Math.max(1, Math.min(30, Math.round(Number(customCount.value) || 1)))
      : Number(countSelect.value);
  }

  function selectedPhotoSize() {
    const preset = $("size-preset");
    if (preset && preset.value === "custom") {
      return {
        width: Math.max(1, Number($("custom-width")?.value) || 35),
        height: Math.max(1, Number($("custom-height")?.value) || 45)
      };
    }
    const value = preset?.value || "35x45";
    if (value === "2x2") return { width: 50.8, height: 50.8 };
    const match = value.match(/^(\d+(?:\\.\\d+)?)x(\\d+(?:\\.\\d+)?)$/);
    return match ? { width: Number(match[1]), height: Number(match[2]) } : { width: 35, height: 45 };
  }

  function calculateLayout(count, photoW, photoH, margin, gap) {
    const usableW = SHEET_W_MM - margin * 2;
    const usableH = SHEET_H_MM - margin * 2;
    let best = null;
    const maxCols = Math.min(count, Math.floor((usableW + gap) / (photoW + gap)));
    for (let cols = 1; cols <= maxCols; cols++) {
      const rows = Math.ceil(count / cols);
      const usedW = cols * photoW + (cols - 1) * gap;
      const usedH = rows * photoH + (rows - 1) * gap;
      if (usedW > usableW + 0.001 || usedH > usableH + 0.001) continue;
      // Prefer a compact, balanced block while never changing the selected physical photo size.
      const shapePenalty = Math.abs(Math.log((usedW / usedH) / (SHEET_W_MM / SHEET_H_MM)));
      const score = shapePenalty + (rows * cols - count) * 0.015;
      if (!best || score < best.score) best = { cols, rows, width: photoW, height: photoH, usedW, usedH, score };
    }
    return best;
  }

  function maximumFit(photoW, photoH, margin, gap) {
    const usableW = SHEET_W_MM - margin * 2;
    const usableH = SHEET_H_MM - margin * 2;
    let max = 0;
    const maxCols = Math.floor((usableW + gap) / (photoW + gap));
    const maxRows = Math.floor((usableH + gap) / (photoH + gap));
    for (let cols = 1; cols <= maxCols; cols++) {
      for (let rows = 1; rows <= maxRows; rows++) {
        const usedW = cols * photoW + (cols - 1) * gap;
        const usedH = rows * photoH + (rows - 1) * gap;
        if (usedW <= usableW + 0.001 && usedH <= usableH + 0.001) max = Math.max(max, cols * rows);
      }
    }
    return max;
  }

  function drawCollage() {
    if (!printPhotoCanvas.width || !printPhotoCanvas.height) {
      info.textContent = "Unggah foto dan selesaikan crop terlebih dahulu.";
      refreshButton.disabled = downloadButton.disabled = printButton.disabled = true;
      continueButton.disabled = true;
      return false;
    }
    const count = selectedCount();
    const margin = Number(marginSelect.value);
    const gap = Number(gapSelect.value);
    const photoSize = selectedPhotoSize();
    const layout = calculateLayout(count, photoSize.width, photoSize.height, margin, gap);
    const ctx = sheetCanvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);
    if (!layout) {
      const fitCount = maximumFit(photoSize.width, photoSize.height, margin, gap);
      info.textContent = "Jumlah " + count + " foto tidak muat pada kertas 10 × 15 cm dengan ukuran asli " + photoSize.width + " × " + photoSize.height + " mm. Kurangi jumlah foto (perkiraan kapasitas maksimal: " + fitCount + ").";
      refreshButton.disabled = downloadButton.disabled = printButton.disabled = true;
      continueButton.disabled = true;
      outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
      outputContext.drawImage(sheetCanvas, 0, 0);
      return false;
    }
    // Color adjustments are applied only to the print sheet, never to the editor source canvas.
    ctx.filter = "brightness(" + brightnessInput.value + "%) contrast(" + contrastInput.value + "%) saturate(" + saturationInput.value + "%)";
    const startX = (SHEET_W_MM - layout.usedW) / 2;
    const startY = (SHEET_H_MM - layout.usedH) / 2;
    for (let i = 0; i < count; i++) {
      const col = i % layout.cols;
      const row = Math.floor(i / layout.cols);
      const x = (startX + col * (layout.width + gap)) * MM_TO_PX;
      const y = (startY + row * (layout.height + gap)) * MM_TO_PX;
      const w = layout.width * MM_TO_PX;
      const h = layout.height * MM_TO_PX;
      ctx.drawImage(printPhotoCanvas, x, y, w, h);
      if (strokeEnabledInput.checked) {
        ctx.save();
        ctx.strokeStyle = strokeColorInput.value;
        ctx.lineWidth = Number(strokeWidthInput.value) * MM_TO_PX;
        const inset = ctx.lineWidth / 2;
        ctx.strokeRect(x + inset, y + inset, Math.max(0, w - ctx.lineWidth), Math.max(0, h - ctx.lineWidth));
        ctx.restore();
      }
    }
    ctx.filter = "none";
    // Apply RGB balance to the print-only composite. The source photo canvas stays untouched.
    const pixels = ctx.getImageData(0, 0, sheetCanvas.width, sheetCanvas.height);
    const data = pixels.data;
    const redOffset = Number(redBalanceInput.value) * 1.5;
    const greenOffset = Number(greenBalanceInput.value) * 1.5;
    const blueOffset = Number(blueBalanceInput.value) * 1.5;
    for (let p = 0; p < data.length; p += 4) {
      data[p] = Math.max(0, Math.min(255, data[p] + redOffset));
      data[p + 1] = Math.max(0, Math.min(255, data[p + 1] + greenOffset));
      data[p + 2] = Math.max(0, Math.min(255, data[p + 2] + blueOffset));
    }
    ctx.putImageData(pixels, 0, 0);
    outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    outputContext.drawImage(sheetCanvas, 0, 0);
    info.textContent = count + " foto · " + layout.cols + " kolom × " + layout.rows + " baris · ukuran fisik tiap foto " + photoSize.width.toFixed(1) + " × " + photoSize.height.toFixed(1) + " mm · kertas 100 × 150 mm · margin " + margin + " mm · jarak " + gap + " mm" + (strokeEnabledInput.checked ? " · stroke " + strokeWidthInput.value + " mm" : "") + " · " + (paperSelect.value === "glossy" ? "Glossy" : "Matte/Doff");
    $("print-brightness-value").textContent = brightnessInput.value + "%";
    $("print-contrast-value").textContent = contrastInput.value + "%";
    $("print-saturation-value").textContent = saturationInput.value + "%";
    $("print-red-balance-value").textContent = redBalanceInput.value;
    $("print-green-balance-value").textContent = greenBalanceInput.value;
    $("print-blue-balance-value").textContent = blueBalanceInput.value;
    $("print-stroke-width-value").textContent = Number(strokeWidthInput.value).toFixed(1) + " mm";
    refreshButton.disabled = downloadButton.disabled = printButton.disabled = false;
    continueButton.disabled = false;
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
  [customCount, marginSelect, gapSelect, brightnessInput, contrastInput, saturationInput, redBalanceInput, greenBalanceInput, blueBalanceInput, strokeEnabledInput, strokeColorInput, strokeWidthInput].forEach((el) => el.addEventListener("input", drawCollage));
  [strokeEnabledInput, strokeColorInput].forEach((el) => el.addEventListener("change", drawCollage));
  [marginSelect, gapSelect].forEach((el) => el.addEventListener("change", drawCollage));
  paperSelect.addEventListener("change", () => {
    paperGuide.textContent = paperSelect.value === "glossy"
      ? "Epson Glossy: pilih media Glossy Photo Paper / Premium Glossy Photo Paper sesuai jenis kertas yang benar-benar dipakai. Coba kualitas High/Best Photo dan koreksi warna driver standar terlebih dahulu."
      : "Epson Matte/Doff: pilih media Matte Paper / Photo Quality Ink Jet Paper yang paling sesuai dengan kertas doff Anda. Hasil doff biasanya tampak kurang mengilap; jangan menaikkan saturasi atau kecerahan berlebihan.";
    drawCollage();
  });
  $("print-color-reset").addEventListener("click", () => {
    brightnessInput.value = "100";
    contrastInput.value = "100";
    saturationInput.value = "100";
    redBalanceInput.value = "0";
    greenBalanceInput.value = "0";
    blueBalanceInput.value = "0";
    strokeEnabledInput.checked = false;
    strokeColorInput.value = "#222222";
    strokeWidthInput.value = "0.3";
    drawCollage();
  });
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
    if (photoCanvas.hidden || !photoCanvas.width || !photoCanvas.height) {
      continueButton.disabled = true;
      refreshButton.disabled = downloadButton.disabled = printButton.disabled = true;
      if (!printPage.hidden) showEditorPage();
    } else {
      drawCollage();
    }
  });
  observer.observe(photoCanvas, { attributes: true, attributeFilter: ["width", "height", "hidden"] });
  const initial = outputContext;
  initial.fillStyle = "#fff";
  initial.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
  drawCollage();
})();