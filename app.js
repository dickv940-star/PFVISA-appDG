(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const fileInput = $("photo-input");
  const dropZone = $("drop-zone");
  const sizePreset = $("size-preset");
  const customFields = $("custom-fields");
  const customWidth = $("custom-width");
  const customHeight = $("custom-height");
  const dpiSelect = $("dpi");
  const previewCanvas = $("preview-canvas");
  const photoFrame = $("photo-frame");
  const emptyState = $("empty-state");
  const fileName = $("file-name");
  const downloadBtn = $("download-btn");
  const resetBtn = $("reset-btn");
  const status = $("status");

  const presets = {
    "35x45": { width: 35, height: 45, label: "35 × 45 mm" },
    "2x2": { width: 50.8, height: 50.8, label: "2 × 2 inci" },
    "40x60": { width: 40, height: 60, label: "40 × 60 mm" },
    "30x40": { width: 30, height: 40, label: "30 × 40 mm" }
  };

  let sourceImage = null;
  let sourceUrl = null;
  let activeFile = null;

  function getSize() {
    if (sizePreset.value === "custom") {
      return {
        width: clampNumber(customWidth.value, 10, 100, 35),
        height: clampNumber(customHeight.value, 10, 100, 45)
      };
    }
    const selected = presets[sizePreset.value] || presets["35x45"];
    return { width: selected.width, height: selected.height };
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function mmLabel(value) {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(1)));
  }

  function getDimensions() {
    const size = getSize();
    const dpi = clampNumber(dpiSelect.value, 72, 1200, 300);
    return {
      widthMm: size.width,
      heightMm: size.height,
      widthPx: Math.max(1, Math.round((size.width / 25.4) * dpi)),
      heightPx: Math.max(1, Math.round((size.height / 25.4) * dpi)),
      dpi
    };
  }

  function setStatus(message, type = "") {
    status.textContent = message;
    status.className = "status" + (type ? " " + type : "");
  }

  function cropRect(imageWidth, imageHeight, targetRatio) {
    const imageRatio = imageWidth / imageHeight;
    if (imageRatio > targetRatio) {
      const cropWidth = imageHeight * targetRatio;
      return { x: (imageWidth - cropWidth) / 2, y: 0, width: cropWidth, height: imageHeight };
    }
    const cropHeight = imageWidth / targetRatio;
    return { x: 0, y: (imageHeight - cropHeight) / 2, width: imageWidth, height: cropHeight };
  }

  function renderPhoto() {
    if (!sourceImage) {
      updateLabels();
      return;
    }

    const dimensions = getDimensions();
    const ratio = dimensions.widthPx / dimensions.heightPx;
    const crop = cropRect(sourceImage.naturalWidth, sourceImage.naturalHeight, ratio);

    previewCanvas.width = dimensions.widthPx;
    previewCanvas.height = dimensions.heightPx;
    const context = previewCanvas.getContext("2d", { alpha: false });
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    context.drawImage(
      sourceImage,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, previewCanvas.width, previewCanvas.height
    );

    previewCanvas.hidden = false;
    emptyState.hidden = true;
    updateLabels();
    downloadBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function updateLabels() {
    const size = getSize();
    const dimensions = getDimensions();
    const widthText = mmLabel(size.width);
    const heightText = mmLabel(size.height);
    const label = widthText + " × " + heightText + " mm";

    $("dimension-label").textContent = sizePreset.value === "2x2" ? "2 × 2 inci" : label;
    $("spec-size").textContent = sizePreset.value === "2x2" ? "2 × 2 inci" : label;
    $("spec-pixels").textContent = dimensions.widthPx + " × " + dimensions.heightPx + " px";
    photoFrame.classList.toggle("square", Math.abs(size.width - size.height) < 0.1);
    photoFrame.classList.toggle("portrait", size.height > size.width);
    photoFrame.classList.toggle("wide", size.width / size.height > 0.9 && size.width / size.height < 0.75);
  }

  function loadFile(file) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setStatus("Format tidak didukung. Gunakan JPG, PNG, atau WebP.", "error");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setStatus("Ukuran file melebihi 20 MB. Pilih foto yang lebih kecil.", "error");
      return;
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    sourceUrl = URL.createObjectURL(file);
    activeFile = file;
    const image = new Image();

    image.onload = () => {
      sourceImage = image;
      fileName.textContent = file.name + " · " + image.naturalWidth + " × " + image.naturalHeight + " px";
      renderPhoto();
      setStatus("Foto siap. Periksa pemotongan dan posisi wajah sebelum menyimpan.", "success");
    };
    image.onerror = () => {
      sourceImage = null;
      setStatus("Foto tidak dapat dibaca. Coba file gambar lain.", "error");
      URL.revokeObjectURL(sourceUrl);
      sourceUrl = null;
    };
    image.src = sourceUrl;
  }

  function resetPhoto() {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    sourceUrl = null;
    sourceImage = null;
    activeFile = null;
    fileInput.value = "";
    previewCanvas.hidden = true;
    emptyState.hidden = false;
    previewCanvas.width = 1;
    previewCanvas.height = 1;
    fileName.textContent = "Belum ada foto dipilih.";
    downloadBtn.disabled = true;
    resetBtn.disabled = true;
    setStatus("Unggah foto untuk memulai.");
    updateLabels();
  }

  function downloadPhoto() {
    if (!sourceImage) {
      setStatus("Unggah foto terlebih dahulu.", "error");
      return;
    }
    try {
      const dimensions = getDimensions();
      const link = document.createElement("a");
      const baseName = activeFile ? activeFile.name.replace(/\.[^.]+$/, "") : "pfvisa-photo";
      link.download = baseName + "-" + Math.round(dimensions.widthMm) + "x" + Math.round(dimensions.heightMm) + "mm-" + dimensions.dpi + "dpi.png";
      link.href = previewCanvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus("Foto berhasil disiapkan sebagai PNG.", "success");
    } catch (error) {
      setStatus("Tidak dapat menyimpan foto. Coba muat ulang file gambar.", "error");
    }
  }

  fileInput.addEventListener("change", (event) => loadFile(event.target.files && event.target.files[0]));
  sizePreset.addEventListener("change", () => {
    customFields.hidden = sizePreset.value !== "custom";
    renderPhoto();
  });
  customWidth.addEventListener("input", renderPhoto);
  customHeight.addEventListener("input", renderPhoto);
  dpiSelect.addEventListener("change", renderPhoto);
  downloadBtn.addEventListener("click", downloadPhoto);
  resetBtn.addEventListener("click", resetPhoto);

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("dragging");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("dragging");
    });
  });
  dropZone.addEventListener("drop", (event) => {
    const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) loadFile(file);
  });

  updateLabels();
  window.addEventListener("beforeunload", () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  });
})();