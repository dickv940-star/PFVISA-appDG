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
  const countrySelect = $("country-select");
  const documentSelect = $("document-select");
  const requirementsTitle = $("requirements-title");
  const requirementsSummary = $("requirements-summary");
  const requirementsList = $("requirements-list");
  const officialLink = $("official-link");
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

  const countryGuides = {
    id: {
      name: "Indonesia",
      official: "https://www.imigrasi.go.id/",
      documents: {
        passport: { label: "Paspor Indonesia", preset: "35x45", summary: "Gunakan panduan ukuran awal ini sambil mencocokkan dengan instruksi terbaru kantor imigrasi atau kanal permohonan Anda.", rules: ["Latar belakang, ukuran kepala, dan tampilan wajah harus mengikuti instruksi resmi yang berlaku.", "Gunakan foto terbaru, tajam, dengan wajah terlihat jelas dan ekspresi netral.", "Hindari bayangan keras, pantulan, filter, retouch berlebihan, atau aksesori yang menutupi wajah."] },
        visa: { label: "Visa ke negara lain", preset: "35x45", summary: "Ukuran foto visa ditentukan oleh negara tujuan dan jenis permohonan, bukan hanya negara asal pemohon.", rules: ["Pilih negara tujuan sebenarnya lalu cocokkan dimensi foto dengan petunjuk kedutaan atau pusat visa.", "Periksa apakah latar belakang, ukuran wajah, dan format digital memiliki aturan khusus.", "Jika permohonan meminta ukuran berbeda, gunakan ukuran khusus dan ikuti persyaratan resmi."] },
        id: { label: "Kartu identitas / dokumen umum", preset: "35x45", summary: "Dokumen identitas yang berbeda dapat memakai ukuran dan latar belakang berbeda.", rules: ["Konfirmasikan ukuran dan warna latar dengan instansi penerbit.", "Pastikan wajah dan kedua mata terlihat jelas.", "Jangan menganggap ukuran paspor otomatis berlaku untuk semua kartu identitas."] }
      }
    },
    us: { name: "Amerika Serikat", official: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html", documents: {
      passport: { label: "Paspor AS", preset: "2x2", summary: "Foto paspor AS umumnya berbentuk persegi 2 × 2 inci (51 × 51 mm).", rules: ["Foto berwarna, diambil dalam 6 bulan terakhir, dan dicetak/diekspor dengan kualitas baik.", "Latar belakang putih atau putih pudar; wajah menghadap kamera dengan ekspresi netral.", "Kepala umumnya 1–1⅜ inci (25–35 mm) dari dagu ke puncak kepala; periksa panduan resmi untuk detail dan pengecualian.", "Jangan memakai kacamata kecuali pengecualian medis yang diizinkan; jangan gunakan filter atau ubah penampilan."] },
      visa: { label: "Visa AS", preset: "2x2", summary: "Foto visa AS umumnya 2 × 2 inci (51 × 51 mm), tetapi unggahan digital dapat memiliki spesifikasi piksel tersendiri.", rules: ["Wajah menghadap kamera dan kepala berada di tengah; latar belakang polos putih atau putih pudar.", "Foto terbaru, berwarna, tanpa bayangan yang mengganggu.", "Persyaratan ukuran kepala dan file digital perlu dicocokkan dengan formulir/jenis visa yang digunakan."] }
    }},
    schengen: { name: "Wilayah Schengen", official: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en", documents: {
      visa: { label: "Visa Schengen", preset: "35x45", summary: "Foto visa Schengen umumnya berukuran 35 × 45 mm; pusat visa atau konsulat dapat memberi instruksi teknis tambahan.", rules: ["Foto terbaru, berwarna, tajam, dan menampilkan wajah menghadap kamera.", "Latar belakang polos dan terang; hindari bayangan, pantulan, dan rambut yang menutupi mata.", "Ukuran wajah, posisi kepala, dan jumlah foto harus mengikuti instruksi konsulat atau penyedia layanan di negara tempat mengajukan.", "Foto untuk visa tidak otomatis sama dengan persyaratan kartu izin tinggal atau dokumen nasional."] },
      residence: { label: "Izin tinggal / dokumen nasional", preset: "35x45", summary: "Ketentuan izin tinggal dapat berbeda antarnegara Schengen dan jenis kartu.", rules: ["Periksa aturan negara penerbit kartu, bukan hanya panduan visa Schengen umum.", "Pastikan rasio foto, latar belakang, dan proporsi wajah cocok dengan formulir resmi.", "Gunakan panduan ini sebagai ukuran awal saja."] }
    }},
    gb: { name: "Britania Raya (UK)", official: "https://www.gov.uk/photos-for-passports", documents: {
      passport: { label: "Paspor UK", preset: "35x45", summary: "Permohonan paspor UK secara online memiliki ketentuan foto digital tersendiri; cetak foto dan layanan tertentu bisa berbeda.", rules: ["Ambil foto berwarna, jelas, tanpa efek atau filter.", "Latar belakang polos dan terang; wajah menghadap kamera dengan ekspresi netral.", "Jangan memakai penutup kepala kecuali alasan agama atau medis yang diperbolehkan.", "Untuk pengajuan online, ikuti pemeriksaan ukuran dan kualitas file yang ditampilkan layanan resmi."] },
      visa: { label: "Visa UK", preset: "35x45", summary: "Visa UK dapat memiliki aturan berbeda berdasarkan proses aplikasi dan pusat pengambilan biometrik.", rules: ["Ikuti instruksi pada akun permohonan dan pusat visa tempat biometrik diambil.", "Jangan menganggap ukuran foto paspor UK berlaku pada semua kategori visa.", "Pastikan foto tidak dimodifikasi sehingga mengubah ciri wajah."] }
    }},
    ca: { name: "Kanada", official: "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html", documents: {
      passport: { label: "Paspor Kanada", preset: "50x70", summary: "Foto cetak paspor Kanada umumnya 50 × 70 mm; ketentuan foto digital bergantung pada layanan yang digunakan.", rules: ["Foto harus memenuhi dimensi dan proporsi kepala yang ditentukan pemerintah Kanada.", "Gunakan foto terbaru, tajam, dengan pencahayaan merata dan latar belakang polos.", "Untuk foto cetak, beberapa persyaratan seperti informasi studio/fotografer dapat berlaku; periksa halaman resmi."] },
      visa: { label: "Visa / imigrasi Kanada", preset: "35x45", summary: "Foto untuk aplikasi visa atau imigrasi dapat berbeda dari foto paspor warga Kanada.", rules: ["Ikuti daftar dokumen dan spesifikasi foto pada jenis aplikasi yang tepat.", "Cocokkan dimensi, ukuran file, format, dan proporsi kepala dengan instruksi resmi.", "Jangan gunakan ukuran paspor Kanada secara otomatis untuk semua aplikasi imigrasi."] }
    }},
    au: { name: "Australia", official: "https://www.passports.gov.au/ 사진", documents: {
      passport: { label: "Paspor Australia", preset: "35x45", summary: "Foto paspor Australia perlu memenuhi ketentuan komposisi dan kualitas resmi; ukuran cetak bisa ditentukan oleh layanan foto.", rules: ["Foto terbaru, berwarna, tajam, dengan latar belakang polos dan pencahayaan merata.", "Wajah menghadap kamera dan mata terlihat jelas; hindari bayangan serta pantulan.", "Periksa panduan resmi untuk proporsi kepala, penutup kepala, dan kebutuhan foto bayi/anak."] },
      visa: { label: "Visa Australia", preset: "35x45", summary: "Persyaratan foto visa Australia bergantung pada subkelas visa dan apakah foto diminta secara digital atau fisik.", rules: ["Ikuti daftar dokumen pada ImmiAccount atau surat permintaan dokumen.", "Cocokkan resolusi dan format digital jika diunggah secara online.", "Jangan menganggap setiap visa Australia memakai spesifikasi foto yang sama."] }
    }},
    in: { name: "India", official: "https://www.passportindia.gov.in/", documents: {
      passport: { label: "Paspor India", preset: "35x45", summary: "Spesifikasi foto dapat berbeda antara pengajuan paspor, pusat layanan, dan pengunggahan online.", rules: ["Periksa ukuran piksel atau cetak yang diminta pada portal atau pusat layanan.", "Wajah menghadap depan, mata terlihat, pencahayaan merata, dan latar belakang polos.", "Ikuti instruksi resmi untuk proporsi kepala dan format file."] },
      visa: { label: "Visa India / e-Visa", preset: "35x45", summary: "Permohonan e-Visa dapat meminta file foto digital dengan dimensi dan format tertentu.", rules: ["Gunakan spesifikasi unggahan yang tercantum pada portal e-Visa saat mengajukan.", "Pastikan seluruh wajah terlihat dan latar belakang memenuhi ketentuan.", "Periksa batas ukuran file dan format sebelum mengunggah."] }
    }},
    cn: { name: "Tiongkok", official: "https://www.visaforchina.cn/", documents: {
      passport: { label: "Paspor / dokumen Tiongkok", preset: "33x48", summary: "Dokumen Tiongkok dapat menggunakan ukuran foto 33 × 48 mm, tetapi ketentuan bergantung pada dokumen dan kanal permohonan.", rules: ["Periksa standar foto yang berlaku pada kantor paspor atau pusat layanan terkait.", "Latar belakang, posisi kepala, dan pakaian dapat memiliki ketentuan khusus.", "Jangan gunakan preset ini tanpa memastikan kecocokan dengan dokumen Anda."] },
      visa: { label: "Visa Tiongkok", preset: "33x48", summary: "Visa Tiongkok memiliki spesifikasi foto tersendiri; pusat aplikasi dapat menerapkan pemeriksaan teknis tambahan.", rules: ["Pastikan ukuran 33 × 48 mm memang sesuai dengan pusat aplikasi yang menangani permohonan.", "Gunakan foto terbaru, berwarna, tajam, dengan wajah menghadap depan.", "Periksa instruksi terbaru untuk latar belakang, ukuran kepala, dan kualitas file."] }
    }},
    jp: { name: "Jepang", official: "https://www.mofa.go.jp/j_info/visit/visa/", documents: {
      passport: { label: "Paspor Jepang", preset: "35x45", summary: "Persyaratan foto paspor Jepang ditetapkan oleh otoritas penerbit dan dapat berbeda dari foto visa.", rules: ["Periksa ukuran dan format yang diminta otoritas penerbit paspor.", "Gunakan foto terbaru dengan wajah terlihat jelas dan latar belakang sederhana.", "Pastikan tidak ada bayangan, pantulan, atau pengeditan yang mengubah wajah."] },
      visa: { label: "Visa Jepang", preset: "35x45", summary: "Foto visa Jepang mengikuti petunjuk kedutaan/konsulat dan kategori permohonan.", rules: ["Cocokkan ukuran foto dengan daftar dokumen kedutaan atau konsulat tempat mengajukan.", "Foto harus jelas, terbaru, dan menampilkan wajah secara langsung.", "Permohonan elektronik dapat memiliki aturan unggahan berbeda dari dokumen kertas."] }
    }},
    ae: { name: "Uni Emirat Arab", official: "https://icp.gov.ae/en/", documents: {
      visa: { label: "Visa UEA", preset: "2x2", summary: "Sistem visa UEA dapat meminta ukuran atau resolusi berbeda menurut portal dan jenis permohonan.", rules: ["Periksa ketentuan pada portal resmi atau penyedia layanan yang memproses visa.", "Gunakan foto terbaru dengan latar belakang polos dan wajah terlihat jelas.", "Jangan menganggap ukuran 2 × 2 inci berlaku untuk semua layanan UEA."] },
      id: { label: "Emirates ID / izin tinggal", preset: "35x45", summary: "Emirates ID dan izin tinggal dapat memiliki spesifikasi yang berbeda dari foto visa.", rules: ["Ikuti persyaratan teknis pada layanan ICP yang relevan.", "Pastikan proporsi kepala, latar belakang, dan kualitas foto sesuai instruksi.", "Periksa kembali ukuran file dan format unggahan."] }
    }}
  };
  const extraPresets = {
    "50x70": { width: 50, height: 70, label: "50 × 70 mm" },
    "33x48": { width: 33, height: 48, label: "33 × 48 mm" }
  };
  Object.assign(presets, extraPresets);

  function populateDocuments() {
    const guide = countryGuides[countrySelect.value] || countryGuides.id;
    documentSelect.replaceChildren();
    Object.entries(guide.documents).forEach(([key, doc]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = doc.label;
      documentSelect.appendChild(option);
    });
    updateRequirements();
  }

  function updateRequirements() {
    const guide = countryGuides[countrySelect.value] || countryGuides.id;
    const doc = guide.documents[documentSelect.value] || Object.values(guide.documents)[0];
    if (!doc) return;
    requirementsTitle.textContent = "Syarat foto — " + guide.name;
    requirementsSummary.textContent = doc.summary;
    requirementsList.replaceChildren();
    doc.rules.forEach((rule) => {
      const item = document.createElement("li");
      item.textContent = rule;
      requirementsList.appendChild(item);
    });
    officialLink.href = guide.official;
    officialLink.textContent = "Buka sumber resmi " + guide.name + " ↗";
    if (presets[doc.preset]) {
      sizePreset.value = doc.preset;
      customFields.hidden = true;
      renderPhoto();
    }
  }

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
    photoFrame.classList.toggle("wide", size.width / size.height > 1.2);
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

  countrySelect.addEventListener("change", populateDocuments);
  documentSelect.addEventListener("change", updateRequirements);
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

  populateDocuments();
  updateLabels();
  window.addEventListener("beforeunload", () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  });
})();