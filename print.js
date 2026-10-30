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
    <div class="print-collage-heading"><span class="step">04</span><div><h2>Print / Auto Collage</h2><p>Atur orientasi masing-masing foto, lalu susun beberapa ukuran pada satu canvas cetak 10 × 15 cm.</p></div></div>
    <div class="print-collage-controls">
      <label for="print-orientation-a">Orientasi foto A</label>
      <select id="print-orientation-a"><option value="portrait" selected>Portrait</option><option value="landscape">Landscape</option></select>
      <label for="print-size-mode">Mode ukuran foto</label>
      <select id="print-size-mode"><option value="mixed" selected>Dua ukuran</option><option value="single">Satu ukuran saja</option></select>
      <label for="print-size-a">Ukuran foto A</label>
      <select id="print-size-a"><option value="2x3">2 × 3 cm</option><option value="3x4" selected>3 × 4 cm</option><option value="4x6">4 × 6 cm</option><option value="custom">Ukuran bebas</option></select>
      <label for="print-count-a">Jumlah foto A</label><input id="print-count-a" type="number" min="0" max="30" value="4">
      <label for="print-orientation-b">Orientasi foto B</label>
      <select id="print-orientation-b"><option value="portrait" selected>Portrait</option><option value="landscape">Landscape</option></select>
      <div class="print-custom-size" id="print-custom-a" hidden><label>Lebar A (mm)<input id="print-width-a" type="number" min="5" max="100" value="30"></label><label>Tinggi A (mm)<input id="print-height-a" type="number" min="5" max="100" value="40"></label></div>
      <label for="print-size-b">Ukuran foto B</label>
      <select id="print-size-b"><option value="2x3">2 × 3 cm</option><option value="3x4">3 × 4 cm</option><option value="4x6" selected>4 × 6 cm</option><option value="custom">Ukuran bebas</option></select>
      <label for="print-count-b">Jumlah foto B</label><input id="print-count-b" type="number" min="0" max="30" value="2">
      <div class="print-custom-size" id="print-custom-b" hidden><label>Lebar B (mm)<input id="print-width-b" type="number" min="5" max="100" value="40"></label><label>Tinggi B (mm)<input id="print-height-b" type="number" min="5" max="100" value="60"></label></div>
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
    <p class="print-instructions">Tip: klik atau sentuh salah satu foto pada kanvas, lalu seret untuk memindahkan posisinya. Ukuran foto dan ukuran kertas 10 × 15 cm tetap.</p>
    <p id="print-paper-guide" class="print-instructions">Epson: pilih ukuran kertas 10 × 15 cm (4 × 6 inci), jenis media Glossy Photo Paper yang paling sesuai dengan kertas glossy Anda, kualitas High/Best Photo, orientasi potret, dan skala 100% / Actual size. Matikan “Fit to page”. Nama opsi media dapat berbeda menurut model Epson dan merek kertas.</p>
    <div class="print-collage-actions">
      <button type="button" class="button button-primary" id="print-now" disabled><span aria-hidden="true">🖨</span> Print Foto 10 × 15 cm</button>
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
    @media(max-width:520px){.print-page-nav{align-items:flex-start;flex-direction:column}}
  `;
  document.head.appendChild(navStyle);

  function showPrintPage() {
    if (photoCanvas.hidden || !photoCanvas.width || !photoCanvas.height) {
      const status = document.getElementById("status");
      if (status) status.textContent = "Selesaikan crop foto terlebih dahulu sebelum membuka halaman cetak.";
      return;
    }
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
    .print-custom-size{grid-column:span 3;display:flex;gap:8px}.print-custom-size[hidden]{display:none}.print-custom-size label{flex:1}.print-custom-size input{display:block;width:100%;margin-top:5px}
    .print-collage-controls label{font-size:11px;font-weight:700;color:#39475a}.print-collage-controls select,.print-collage-controls input:not([type="range"]){width:100%;min-height:42px;padding:0 10px;border:1px solid #d4e1e3;border-radius:10px;background:#fff;color:#142a3b;font:inherit;font-size:12px}
    .print-collage-controls input[type="range"]{width:100%;accent-color:#177e78;min-height:30px}
    .print-collage-controls output{float:right;color:#14736b;font-variant-numeric:tabular-nums}
    .print-collage-controls .print-check-control{display:flex;align-items:center;gap:8px;min-height:42px;font-size:12px}.print-check-control input{width:17px;height:17px;accent-color:#176b62}.print-collage-controls input[type="color"]{min-height:42px;padding:4px;cursor:pointer}
    .print-sheet-stage{display:grid;place-items:center;padding:18px;background:#edf2f2;border:1px solid #e0e9e9;border-radius:14px}
    #print-sheet-preview{display:block;width:min(100%,320px);height:auto;aspect-ratio:2/3;background:#fff;box-shadow:0 12px 28px rgba(16,38,59,.18);border:1px solid #dce4e4;cursor:grab;touch-action:none;user-select:none}#print-sheet-preview.is-dragging{cursor:grabbing}
    .print-layout-info{margin:12px 0 0;color:#176b62;font-size:12px;font-weight:700;text-align:center}
    .print-instructions{margin:12px 0;padding:12px;border-radius:10px;background:#f3f8f7;color:#536875;font-size:11px;line-height:1.65}
    .print-collage-actions{display:grid;grid-template-columns:minmax(220px,360px);justify-content:center;gap:9px;margin-top:14px}
    @media(max-width:700px){.print-collage-panel{padding:18px}.print-collage-controls{grid-template-columns:1fr 1fr}.print-collage-actions{grid-template-columns:1fr}.print-collage-controls label{align-self:end}}
    @media print{ @page{size:100mm 150mm;margin:0} body *{visibility:hidden!important} #pfvisa-print-root,#pfvisa-print-root *{visibility:visible!important} #pfvisa-print-root{position:fixed;inset:0;width:100mm;height:150mm;margin:0;padding:0} #pfvisa-print-root img{display:block;width:100mm;height:150mm;object-fit:fill} }
  `;
  document.head.appendChild(style);

  const $ = (id) => document.getElementById(id);
  const orientationA = $("print-orientation-a"), orientationB = $("print-orientation-b");
  const sizeMode = $("print-size-mode"), sizeA = $("print-size-a"), sizeB = $("print-size-b");
  const countA = $("print-count-a"), countB = $("print-count-b");
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
  const outputContext = outputCanvas.getContext("2d");
  const info = $("print-layout-info");
  const printButton = $("print-now");
  outputCanvas.width = sheetCanvas.width;
  outputCanvas.height = sheetCanvas.height;
  const manualPositions = new Map();
  let activeDrag = null;

  function selectedSize(which) {
    const select = which === "A" ? sizeA : sizeB;
    let dimensions;
    if (select.value === "custom") {
      dimensions = {
        width: Math.max(5, Number($(which === "A" ? "print-width-a" : "print-width-b").value) || 30),
        height: Math.max(5, Number($(which === "A" ? "print-height-a" : "print-height-b").value) || 40)
      };
    } else {
      const dims = select.value.split("x").map(Number);
      dimensions = { width: dims[0] * 10, height: dims[1] * 10 };
    }
    const orientation = (which === "A" ? orientationA : orientationB).value;
    return orientation === "landscape"
      ? { width: Math.max(dimensions.width, dimensions.height), height: Math.min(dimensions.width, dimensions.height) }
      : { width: Math.min(dimensions.width, dimensions.height), height: Math.max(dimensions.width, dimensions.height) };
  }
  function selectedCount(which) {
    return Math.max(0, Math.min(30, Math.round(Number((which === "A" ? countA : countB).value) || 0)));
  }
  function photoRects() {
    const margin = Number(marginSelect.value), gap = Number(gapSelect.value);
    const groups = [{ size: selectedSize("A"), count: selectedCount("A") }];
    if (sizeMode.value === "mixed") groups.push({ size: selectedSize("B"), count: selectedCount("B") });
    const items = [];
    groups.forEach(g => { for (let i = 0; i < g.count; i++) items.push({ index: items.length, w: g.size.width * MM_TO_PX, h: g.size.height * MM_TO_PX }); });
    // Place larger photos first so mixed-size groups can fit on the fixed sheet.
    items.sort((a, b) => (b.h - a.h) || (b.w - a.w));
    const left = margin * MM_TO_PX, right = (SHEET_W_MM - margin) * MM_TO_PX, bottom = (SHEET_H_MM - margin) * MM_TO_PX;
    let x = left, y = left, rowH = 0;
    const result = [];
    for (const item of items) {
      if (item.w > right - left || item.h > bottom - left) return null;
      if (x + item.w > right + .01) { x = left; y += rowH + gap * MM_TO_PX; rowH = 0; }
      if (y + item.h > bottom + .01) return null;
      const saved = manualPositions.get(item.index);
      result.push({ index:item.index, x:saved ? saved.x : x, y:saved ? saved.y : y, w:item.w, h:item.h });
      x += item.w + gap * MM_TO_PX; rowH = Math.max(rowH,item.h);
    }
    return result;
  }
  function drawPhotoCover(ctx, rect) {
    const ratio = rect.w / rect.h, sourceRatio = photoCanvas.width / photoCanvas.height;
    let sx=0, sy=0, sw=photoCanvas.width, sh=photoCanvas.height;
    if (sourceRatio > ratio) { sw=photoCanvas.height*ratio; sx=(photoCanvas.width-sw)/2; }
    else { sh=photoCanvas.width/ratio; sy=(photoCanvas.height-sh)/2; }
    ctx.drawImage(photoCanvas,sx,sy,sw,sh,rect.x,rect.y,rect.w,rect.h);
  }

  function drawCollage() {
    if (photoCanvas.hidden || !photoCanvas.width || !photoCanvas.height) {
      info.textContent = "Unggah foto dan selesaikan crop terlebih dahulu.";
      printButton.disabled = true; continueButton.disabled = true; return false;
    }
    const ctx = sheetCanvas.getContext("2d", { alpha:false });
    ctx.fillStyle="#fff"; ctx.fillRect(0,0,sheetCanvas.width,sheetCanvas.height);
    const rects=photoRects();
    const total=selectedCount("A")+(sizeMode.value==="mixed"?selectedCount("B"):0);
    if (!rects || !total || rects.length!==total) {
      info.textContent = !total ? "Atur jumlah foto minimal satu." : "Foto tidak muat pada kertas. Kurangi jumlah foto atau pilih ukuran lebih kecil.";
      printButton.disabled=true; continueButton.disabled=true;
      outputContext.clearRect(0,0,outputCanvas.width,outputCanvas.height); outputContext.drawImage(sheetCanvas,0,0); return false;
    }
    ctx.filter="brightness("+brightnessInput.value+"%) contrast("+contrastInput.value+"%) saturate("+saturationInput.value+"%)";
    rects.forEach(rect=>{
      drawPhotoCover(ctx,rect);
      if(strokeEnabledInput.checked){ctx.save();ctx.strokeStyle=strokeColorInput.value;ctx.lineWidth=Number(strokeWidthInput.value)*MM_TO_PX;const inset=ctx.lineWidth/2;ctx.strokeRect(rect.x+inset,rect.y+inset,rect.w-ctx.lineWidth,rect.h-ctx.lineWidth);ctx.restore();}
    });
    ctx.filter="none";
    const pixels=ctx.getImageData(0,0,sheetCanvas.width,sheetCanvas.height), data=pixels.data;
    const ro=Number(redBalanceInput.value)*1.5, go=Number(greenBalanceInput.value)*1.5, bo=Number(blueBalanceInput.value)*1.5;
    for(let p=0;p<data.length;p+=4){data[p]=Math.max(0,Math.min(255,data[p]+ro));data[p+1]=Math.max(0,Math.min(255,data[p+1]+go));data[p+2]=Math.max(0,Math.min(255,data[p+2]+bo));}
    ctx.putImageData(pixels,0,0);
    outputContext.clearRect(0,0,outputCanvas.width,outputCanvas.height);outputContext.drawImage(sheetCanvas,0,0);
    info.textContent=SHEET_W_MM+" × "+SHEET_H_MM+" mm · A: "+selectedCount("A")+" foto "+selectedSize("A").width+" × "+selectedSize("A").height+" mm"+(sizeMode.value==="mixed"?" · B: "+selectedCount("B")+" foto "+selectedSize("B").width+" × "+selectedSize("B").height+" mm":"");
    $("print-brightness-value").textContent=brightnessInput.value+"%";$("print-contrast-value").textContent=contrastInput.value+"%";$("print-saturation-value").textContent=saturationInput.value+"%";
    $("print-red-balance-value").textContent=redBalanceInput.value;$("print-green-balance-value").textContent=greenBalanceInput.value;$("print-blue-balance-value").textContent=blueBalanceInput.value;
    $("print-stroke-width-value").textContent=Number(strokeWidthInput.value).toFixed(1)+" mm";
    printButton.disabled=false;continueButton.disabled=false;return true;
  }

  function canvasPoint(event) {
    const rect = outputCanvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (outputCanvas.width / rect.width),
      y: (event.clientY - rect.top) * (outputCanvas.height / rect.height)
    };
  }


  outputCanvas.addEventListener("pointerdown", (event) => {
    if (printButton.disabled) return;
    const point = canvasPoint(event);
    const hit = photoRects().slice().reverse().find((rect) =>
      point.x >= rect.x && point.x <= rect.x + rect.w &&
      point.y >= rect.y && point.y <= rect.y + rect.h
    );
    if (!hit) return;
    activeDrag = { index: hit.index, offsetX: point.x - hit.x, offsetY: point.y - hit.y };
    outputCanvas.setPointerCapture(event.pointerId);
    outputCanvas.classList.add("is-dragging");
    event.preventDefault();
  });

  outputCanvas.addEventListener("pointermove", (event) => {
    if (!activeDrag) return;
    const point = canvasPoint(event);
    const rect = photoRects().find((item) => item.index === activeDrag.index);
    if (!rect) return;
    const x = Math.max(0, Math.min(outputCanvas.width - rect.w, point.x - activeDrag.offsetX));
    const y = Math.max(0, Math.min(outputCanvas.height - rect.h, point.y - activeDrag.offsetY));
    manualPositions.set(activeDrag.index, { x, y });
    drawCollage();
    event.preventDefault();
  });

  function finishCanvasDrag() {
    activeDrag = null;
    outputCanvas.classList.remove("is-dragging");
  }
  outputCanvas.addEventListener("pointerup", finishCanvasDrag);
  outputCanvas.addEventListener("pointercancel", finishCanvasDrag);
  outputCanvas.addEventListener("lostpointercapture", finishCanvasDrag);

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
    popup.document.write('<!doctype html><html><head><meta charset="utf-8"><title>PFVISA Print</title><style>@page{size:' + SHEET_W_MM + 'mm ' + SHEET_H_MM + 'mm;margin:0}html,body{margin:0;padding:0;width:' + SHEET_W_MM + 'mm;height:' + SHEET_H_MM + 'mm;background:#fff}img{display:block;width:' + SHEET_W_MM + 'mm;height:' + SHEET_H_MM + 'mm}</style></head><body><img src="' + imageUrl + '" alt="Kolase foto cetak"><script>window.onload=function(){setTimeout(function(){window.focus();window.print()},250)};<\\/script></body></html>');
    popup.document.close();
  }

  [orientationA, orientationB].forEach(el => el.addEventListener("change", () => {
    manualPositions.clear();
    drawCollage();
  }));
  function updateSizeControls(){
    $("print-custom-a").hidden=sizeA.value!=="custom";
    $("print-custom-b").hidden=sizeMode.value!=="mixed"||sizeB.value!=="custom";
    sizeB.disabled=sizeMode.value!=="mixed";countB.disabled=sizeMode.value!=="mixed";
    manualPositions.clear();drawCollage();
  }
  [sizeMode,sizeA,sizeB].forEach(el=>el.addEventListener("change",updateSizeControls));
  [countA,countB,$("print-width-a"),$("print-height-a"),$("print-width-b"),$("print-height-b")].forEach(el=>el.addEventListener("input",()=>{manualPositions.clear();drawCollage();}));
  [marginSelect,gapSelect,brightnessInput,contrastInput,saturationInput,redBalanceInput,greenBalanceInput,blueBalanceInput,strokeEnabledInput,strokeColorInput,strokeWidthInput].forEach(el=>el.addEventListener("input",drawCollage));
  updateSizeControls();
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
      printButton.disabled = true;
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