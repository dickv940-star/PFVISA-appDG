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
  const cropModeBtn = $("crop-mode-btn");
  const cropControls = $("crop-controls");
  const cropZoomInput = $("crop-zoom");
  const cropZoomLabel = $("crop-zoom-label");
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
    "50x70": { width: 50, height: 70, label: "50 × 70 mm" },
    "33x48": { width: 33, height: 48, label: "33 × 48 mm" },
    "45x45": { width: 45, height: 45, label: "45 × 45 mm" },
    "40x50": { width: 40, height: 50, label: "40 × 50 mm" },
    "30x40": { width: 30, height: 40, label: "30 × 40 mm" }
  };

  function generalCountryGuide(name, official, passportPreset = "35x45") {
    return {
      name, official,
      documents: {
        passport: {
          label: "Paspor " + name, preset: passportPreset,
          summary: "Ukuran awal di editor ini bukan konfirmasi standar resmi negara ini. Periksa instruksi terbaru otoritas penerbit sebelum menggunakan foto.",
          rules: [
            "Persyaratan paspor berbeda menurut negara, jenis permohonan, dan apakah foto dicetak atau diunggah secara digital.",
            "Periksa dimensi, proporsi kepala/wajah, warna latar, ukuran file, format, dan batas usia foto pada sumber resmi.",
            "Gunakan foto berwarna yang tajam, pencahayaan merata, wajah menghadap lurus, mata terlihat, dan ekspresi sesuai petunjuk resmi.",
            "Hindari filter, retouch yang mengubah ciri wajah, bayangan kuat, pantulan, atau benda yang menutupi wajah.",
            "Aplikasi ini hanya mengubah rasio/ukuran dan tidak memeriksa biometrik atau menjamin foto diterima."
          ]
        },
        visa: {
          label: "Visa " + name, preset: passportPreset,
          summary: "Persyaratan foto visa ditentukan oleh jenis visa dan kanal pengajuan. Ukuran awal di editor ini bukan standar resmi untuk semua visa.",
          rules: [
            "Buka petunjuk resmi untuk kategori visa dan portal yang benar sebelum memilih ukuran akhir.",
            "Cocokkan dimensi, resolusi, format file, batas ukuran file, latar belakang, dan proporsi wajah.",
            "Visa elektronik, permohonan melalui pusat visa, dan dokumen cetak dapat memakai aturan berbeda.",
            "Jangan menganggap ukuran paspor berlaku otomatis untuk visa atau izin tinggal."
          ]
        },
        id: {
          label: "Kartu identitas / izin tinggal", preset: passportPreset,
          summary: "Dokumen identitas dan izin tinggal dapat memiliki spesifikasi foto yang berbeda dari paspor.",
          rules: [
            "Ikuti spesifikasi instansi penerbit untuk dokumen yang dipilih.",
            "Konfirmasikan ukuran, latar belakang, proporsi wajah, format, dan batas file.",
            "Gunakan ukuran awal hanya untuk penyuntingan; verifikasi kembali sebelum mengirim."
          ]
        }
      }
    };
  }

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
    au: { name: "Australia", official: "https://www.passports.gov.au/PhotoGuidelines", documents: {
      passport: { label: "Paspor Australia", preset: "35x45", summary: "Ukuran foto resmi: lebar 35–40 mm, tinggi 45–50 mm. Ukuran wajah dari dagu ke puncak kepala 32–36 mm.", rules: ["Foto berwarna, jelas, fokus, diambil dalam 6 bulan terakhir.", "Latar belakang putih atau abu-abu muda polos; pencahayaan merata tanpa bayangan atau pantulan.", "Wajah menghadap lurus, kepala tidak miring, mata terbuka, mulut tertutup, ekspresi netral, rambut tidak menutupi tepi wajah.", "Tidak boleh memakai kacamata kecuali pengecualian medis yang memenuhi ketentuan. Penutup kepala keagamaan diperbolehkan jika wajah tetap terlihat penuh.", "Tidak boleh retouch atau mengubah ciri wajah. Untuk paspor, siapkan dua foto cetak glossy minimal 200 gsm dengan proses dye-sublimation.", "Aplikasi ini hanya mengubah ukuran dan rasio; belum mengukur ukuran wajah secara otomatis dan tidak menjamin foto diterima."] },
      visa: { label: "Visa Australia", preset: "35x45", summary: "Persyaratan foto visa Australia berbeda menurut jenis visa dan kanal pengajuan.", rules: ["Ikuti spesifikasi pada portal resmi atau surat permintaan dokumen untuk subkelas visa Anda.", "Cocokkan dimensi, resolusi, ukuran file, format, dan latar belakang dengan instruksi aplikasi.", "Jangan menganggap ukuran paspor 35 × 45 mm berlaku untuk semua jenis visa."] }
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
    }},
    nz: generalCountryGuide("Selandia Baru", "https://www.passports.govt.nz/what-you-need-for-your-application/passport-photos/"),
    sg: generalCountryGuide("Singapura", "https://www.ica.gov.sg/documents/passport"),
    my: generalCountryGuide("Malaysia", "https://www.imi.gov.my/"),
    kr: generalCountryGuide("Korea Selatan", "https://www.passport.go.kr/"),
    br: generalCountryGuide("Brasil", "https://www.gov.br/pf/pt-br/assuntos/passaporte"),
    mx: generalCountryGuide("Meksiko", "https://www.gob.mx/sre"),
    za: generalCountryGuide("Afrika Selatan", "https://www.dha.gov.za/"),
    th: generalCountryGuide("Thailand", "https://consular.mfa.go.th/"),
    ph: generalCountryGuide("Filipina", "https://consular.dfa.gov.ph/"),
    vn: generalCountryGuide("Vietnam", "https://evisa.gov.vn/"),
    sa: generalCountryGuide("Arab Saudi", "https://www.moi.gov.sa/"),
    qa: generalCountryGuide("Qatar", "https://portal.moi.gov.qa/"),
    tr: generalCountryGuide("Turki", "https://www.mfa.gov.tr/"),
    pk: generalCountryGuide("Pakistan", "https://dgip.gov.pk/"),
    bd: generalCountryGuide("Bangladesh", "https://www.dip.gov.bd/"),
    np: generalCountryGuide("Nepal", "https://nepalpassport.gov.np/"),
    ng: generalCountryGuide("Nigeria", "https://immigration.gov.ng/"),
    eg: generalCountryGuide("Mesir", "https://www.mfa.gov.eg/"),
    tw: generalCountryGuide("Taiwan", "https://www.boca.gov.tw/"),
    hk: generalCountryGuide("Hong Kong", "https://www.immd.gov.hk/eng/"),
    ie: generalCountryGuide("Irlandia", "https://www.ireland.ie/en/dfa/passports/"),
    fr: generalCountryGuide("Prancis", "https://www.service-public.fr/"),
    de: generalCountryGuide("Jerman", "https://www.auswaertiges-amt.de/"),
    it: generalCountryGuide("Italia", "https://www.esteri.it/"),
    es: generalCountryGuide("Spanyol", "https://www.exteriores.gob.es/"),
    nl: generalCountryGuide("Belanda", "https://www.netherlandsworldwide.nl/passport-id-card"),
    ch: generalCountryGuide("Swiss", "https://www.eda.admin.ch/"),
    se: generalCountryGuide("Swedia", "https://polisen.se/"),
    no: generalCountryGuide("Norwegia", "https://www.politiet.no/"),
    ru: generalCountryGuide("Rusia", "https://mid.ru/")
  };
  const extraPresets = {
    "50x70": { width: 50, height: 70, label: "50 × 70 mm" },
    "33x48": { width: 33, height: 48, label: "33 × 48 mm" }
  };
  Object.assign(presets, extraPresets);

  // Parameter khusus per negara + jenis dokumen. Sumber/tingkat kepastian ditampilkan
  // kepada pengguna; profil umum tidak boleh dianggap sebagai jaminan penerimaan resmi.
  const photoSpecs = {
    "id:passport": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Panduan paspor Indonesia perlu dikonfirmasi pada kanal Imigrasi yang digunakan." },
    "id:visa": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Ukuran visa mengikuti negara tujuan dan portal permohonan." },
    "id:id": { preset: "30x40", dpi: 600, headMm: 30, topMm: 2.5, source: "Referensi format foto 30 × 40 mm; pastikan cocok dengan instansi penerbit." },

    "us:passport": { preset: "2x2", dpi: 300, headMm: 32.8, topMm: 6.5, source: "Referensi Visafoto untuk paspor AS; cocokkan panduan resmi." },
    "us:visa": { preset: "2x2", dpi: 300, headMm: 32.8, topMm: 6.5, source: "Referensi foto visa AS 2 × 2 inci; portal visa dapat menentukan ketentuan digital tersendiri." },

    "schengen:visa": { preset: "35x45", dpi: 600, headMm: 33.5, topMm: 5, source: "Referensi format Schengen 35 × 45 mm; konsulat/pusat visa dapat memberi instruksi tambahan." },
    "schengen:residence": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Izin tinggal berbeda menurut negara penerbit; ukuran ini hanya titik awal." },

    "gb:passport": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Foto paspor UK digital tidak selalu mengikuti ukuran cetak; ikuti pemeriksaan foto pada layanan GOV.UK." },
    "gb:visa": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Visa UK dapat memakai foto digital atau pengambilan biometrik; ikuti instruksi permohonan." },

    "ca:passport": { preset: "50x70", dpi: 600, headMm: 34, topMm: 5, source: "Paspor Kanada umumnya 50 × 70 mm; ukuran kepala harus diperiksa terhadap panduan resmi." },
    "ca:visa": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Aplikasi imigrasi Kanada memiliki ketentuan berbeda menurut kategori aplikasi." },

    "au:passport": { preset: "35x45", dpi: 600, headMm: 34, topMm: 5, source: "Panduan resmi paspor Australia: foto 35–40 × 45–50 mm, tinggi wajah 32–36 mm. Profil 35 × 45 mm adalah ukuran kerja." },
    "au:visa": { preset: "35x45", dpi: 600, headMm: 34, topMm: 5, source: "Persyaratan yang diberikan: kepala 34 mm dan jarak tepi atas 5 mm; periksa kembali subclass/portal visa." },

    "in:passport": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "India memiliki beberapa format paspor cetak/digital; konfirmasi spesifikasi portal yang digunakan." },
    "in:visa": { preset: "2x2", dpi: 300, headMm: 32.8, topMm: 6.5, source: "Referensi umum foto visa India 2 × 2 inci; e-Visa dapat meminta ukuran piksel berbeda." },

    "cn:passport": { preset: "33x48", dpi: 300, headMm: null, topMm: null, source: "Referensi format 33 × 48 mm; verifikasi panduan paspor resmi yang berlaku." },
    "cn:visa": { preset: "33x48", dpi: 300, headMm: null, topMm: null, source: "Referensi format visa Tiongkok 33 × 48 mm; pusat visa dapat memperbarui persyaratan." },

    "jp:passport": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Ukuran foto paspor Jepang harus dicocokkan dengan instruksi permohonan yang dipakai." },
    "jp:visa": { preset: "45x45", dpi: 600, headMm: 27, topMm: 5, source: "Referensi Visafoto untuk salah satu format visa Jepang 45 × 45 mm; persyaratan dapat berbeda menurut aplikasi." },

    "ae:visa": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Persyaratan visa UEA dapat berubah menurut emirate, jenis visa, dan portal." },
    "ae:id": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Emirates ID/izin tinggal dapat memiliki spesifikasi digital tersendiri; verifikasi pada portal resmi." }
  };

  function currentPhotoSpec() {
    return photoSpecs[countrySelect.value + ":" + documentSelect.value] || null;
  }

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

  let cropZoom = 1;
  let cropPanX = 0;
  let cropPanY = 0;
  let cropMode = false;
  let dragPoint = null;
  let faceLandmarkerPromise = null;
  let detectedCrop = null;

  async function detectAndCropFace(image) {
    setStatus("Mendeteksi wajah dan menyesuaikan crop otomatis…");
    try {
      if (!faceLandmarkerPromise) {
        faceLandmarkerPromise = import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm")
          .then(async (vision) => {
            const files = await vision.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm");
            return vision.FaceLandmarker.createFromOptions(files, {
              baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                delegate: "CPU"
              },
              runningMode: "IMAGE",
              numFaces: 1
            });
          });
      }
      const detector = await faceLandmarkerPromise;
      if (sourceImage !== image) return;
      const result = detector.detect(image);
      const marks = result.faceLandmarks && result.faceLandmarks[0];
      if (!marks || marks.length < 264) throw new Error("Wajah tidak terdeteksi");
      const w = image.naturalWidth, h = image.naturalHeight;
      const p = (i) => ({ x: marks[i].x * w, y: marks[i].y * h });
      const forehead = p(10), chin = p(152), leftEye = p(33), rightEye = p(263);
      const faceHeight = chin.y - forehead.y;
      if (faceHeight <= 0) throw new Error("Posisi wajah tidak terbaca");
      const headTop = Math.max(0, forehead.y - faceHeight * 0.22);
      const headHeight = chin.y - headTop;
      const spec = currentPhotoSpec();
      const dims = getDimensions();
      const headFraction = spec && spec.headMm != null ? spec.headMm / dims.heightMm : 0.72;
      const topMargin = spec && spec.topMm != null ? spec.topMm / dims.heightMm : 0.07;
      const ratio = dims.widthPx / dims.heightPx;
      let ch = headHeight / headFraction, cw = ch * ratio;
      const scale = Math.min(1, w / cw, h / ch);
      cw *= scale; ch *= scale;
      const centerX = (leftEye.x + rightEye.x) / 2;
      detectedCrop = {
        x: Math.max(0, Math.min(w - cw, centerX - cw / 2)),
        y: Math.max(0, Math.min(h - ch, headTop - ch * topMargin)),
        width: cw, height: ch
      };
      cropZoom = 1; cropPanX = 0; cropPanY = 0;
      cropZoomInput.value = "1"; cropZoomLabel.textContent = "1.0×";
      renderPhoto();
      setStatus("Crop otomatis selesai. Periksa puncak kepala, dagu, dan posisi mata sebelum menyimpan.", "success");
    } catch (error) {
      detectedCrop = null;
      renderPhoto();
      setStatus("Deteksi otomatis gagal. Pastikan internet aktif, lalu gunakan Atur Crop Foto secara manual.", "error");
    }
  }

  function resetCrop() {
    cropZoom = 1;
    cropPanX = 0;
    cropPanY = 0;
    cropZoomInput.value = "1";
    cropZoomLabel.textContent = "1.0×";
  }

  function updateRequirements() {
    const guide = countryGuides[countrySelect.value] || countryGuides.id;
    const doc = guide.documents[documentSelect.value] || Object.values(guide.documents)[0];
    if (!doc) return;
    const spec = currentPhotoSpec();
    const presetKey = spec && presets[spec.preset] ? spec.preset : doc.preset;
    requirementsTitle.textContent = "Syarat foto — " + guide.name;
    requirementsSummary.textContent = doc.summary;
    requirementsList.replaceChildren();
    doc.rules.forEach((rule) => {
      const item = document.createElement("li");
      item.textContent = rule;
      requirementsList.appendChild(item);
    });
    if (spec) {
      const facts = [
        "Profil kerja PFVISA: " + presets[presetKey].label + ", " + spec.dpi + " DPI.",
        spec.headMm != null ? "Target tinggi kepala (perkiraan ubun-ubun hingga dagu): " + mmLabel(spec.headMm) + " mm." : "Ukuran kepala belum dikunci otomatis karena spesifikasi yang tepat bergantung pada dokumen/portal.",
        spec.topMm != null ? "Target jarak tepi atas ke ubun-ubun: " + mmLabel(spec.topMm) + " mm." : "Jarak tepi atas kepala belum ditetapkan otomatis; periksa petunjuk resmi.",
        spec.source,
        "Profil ini membantu penyesuaian ukuran dan crop, tetapi bukan jaminan penerimaan. Ketentuan resmi dapat berbeda menurut kategori aplikasi."
      ];
      facts.forEach((rule) => {
        const item = document.createElement("li");
        item.textContent = rule;
        requirementsList.appendChild(item);
      });
    }
    officialLink.href = guide.official;
    officialLink.textContent = "Buka sumber resmi " + guide.name + " ↗";
    if (presets[presetKey]) {
      resetCrop();
      sizePreset.value = presetKey;
      customFields.hidden = true;
      if (spec && spec.dpi) dpiSelect.value = String(spec.dpi);
      detectedCrop = null;
      renderPhoto();
      if (sourceImage) detectAndCropFace(sourceImage);
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
    let base;
    if (detectedCrop) {
      base = { ...detectedCrop };
    } else if (imageRatio > targetRatio) {
      const cropWidth = imageHeight * targetRatio;
      base = { x: (imageWidth - cropWidth) / 2, y: 0, width: cropWidth, height: imageHeight };
    } else {
      const cropHeight = imageWidth / targetRatio;
      base = { x: 0, y: (imageHeight - cropHeight) / 2, width: imageWidth, height: cropHeight };
    }
    const width = base.width / cropZoom;
    const height = base.height / cropZoom;
    const maxX = Math.max(0, (imageWidth - width) / 2);
    const maxY = Math.max(0, (imageHeight - height) / 2);
    const centerX = base.x + base.width / 2 + cropPanX * maxX;
    const centerY = base.y + base.height / 2 + cropPanY * maxY;
    return {
      x: Math.max(0, Math.min(imageWidth - width, centerX - width / 2)),
      y: Math.max(0, Math.min(imageHeight - height, centerY - height / 2)),
      width, height
    };
  }

  function renderPhoto() {
    if (!sourceImage) {
      updateLabels();
      return;
    }

    const dimensions = getDimensions();
    const ratio = dimensions.widthPx / dimensions.heightPx;
    const crop = cropRect(sourceImage.naturalWidth, sourceImage.naturalHeight, ratio);

    if (previewCanvas.width !== dimensions.widthPx) previewCanvas.width = dimensions.widthPx;
    if (previewCanvas.height !== dimensions.heightPx) previewCanvas.height = dimensions.heightPx;
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
    cropModeBtn.disabled = false;
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
      detectedCrop = null;
      fileName.textContent = file.name + " · " + image.naturalWidth + " × " + image.naturalHeight + " px";
      renderPhoto();
      detectAndCropFace(image);
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
    cropMode = false;
    cropControls.hidden = true;
    cropModeBtn.textContent = "Atur Crop Foto";
    photoFrame.classList.remove("crop-active");
    cropModeBtn.disabled = true;
    resetCrop();
    previewCanvas.width = 1;
    previewCanvas.height = 1;
    fileName.textContent = "Belum ada foto dipilih.";
    downloadBtn.disabled = true;
    resetBtn.disabled = true;
    setStatus("Unggah foto untuk memulai.");
    updateLabels();
  }

  function pngWithDpi(dataUrl, dpi) {
    const binary = atob(dataUrl.split(",")[1]);
    const original = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) original[i] = binary.charCodeAt(i);
    // PNG signature (8 bytes) + IHDR chunk (25 bytes) = 33 bytes.
    if (original.length < 33 || String.fromCharCode(...original.slice(12, 16)) !== "IHDR") return original;
    const ppm = Math.round(dpi / 0.0254);
    const chunk = new Uint8Array(21);
    const view = new DataView(chunk.buffer);
    view.setUint32(0, 9, false);
    chunk.set([112, 72, 89, 115], 4); // pHYs
    view.setUint32(8, ppm, false);
    view.setUint32(12, ppm, false);
    chunk[16] = 1; // pixels per metre
    let crc = 0xffffffff;
    for (let i = 4; i < 17; i++) {
      crc ^= chunk[i];
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    view.setUint32(17, (crc ^ 0xffffffff) >>> 0, false);
    const output = new Uint8Array(original.length + chunk.length);
    output.set(original.slice(0, 33), 0);
    output.set(chunk, 33);
    output.set(original.slice(33), 33 + chunk.length);
    return output;
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
      const pngBytes = pngWithDpi(previewCanvas.toDataURL("image/png"), dimensions.dpi);
      const pngBlob = new Blob([pngBytes], { type: "image/png" });
      const objectUrl = URL.createObjectURL(pngBlob);
      link.href = objectUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
      setStatus("Foto PNG berhasil disiapkan dengan metadata resolusi " + dimensions.dpi + " DPI.", "success");
    } catch (error) {
      setStatus("Tidak dapat menyimpan foto. Coba muat ulang file gambar.", "error");
    }
  }

  countrySelect.addEventListener("change", populateDocuments);
  documentSelect.addEventListener("change", updateRequirements);
  fileInput.addEventListener("change", (event) => loadFile(event.target.files && event.target.files[0]));
  sizePreset.addEventListener("change", () => {
    customFields.hidden = sizePreset.value !== "custom";
    resetCrop();
    detectedCrop = null;
    renderPhoto();
    if (sourceImage) detectAndCropFace(sourceImage);
  });

  cropModeBtn.addEventListener("click", () => {
    if (!sourceImage) {
      setStatus("Unggah foto terlebih dahulu untuk mulai crop.", "error");
      return;
    }
    cropMode = !cropMode;
    cropControls.hidden = !cropMode;
    photoFrame.classList.toggle("crop-active", cropMode);
    cropModeBtn.textContent = cropMode ? "Selesai Atur Crop" : "Atur Crop Foto";
    setStatus(cropMode ? "Seret foto pada pratinjau untuk mengatur posisi. Gunakan zoom bila perlu." : "Posisi crop diterapkan. Periksa hasil sebelum menyimpan.", "success");
  });

  cropZoomInput.addEventListener("input", () => {
    cropZoom = clampNumber(cropZoomInput.value, 1, 2.5, 1);
    cropZoomLabel.textContent = cropZoom.toFixed(1) + "×";
    renderPhoto();
  });

  previewCanvas.addEventListener("pointerdown", (event) => {
    if (!cropMode || !sourceImage) return;
    dragPoint = { x: event.clientX, y: event.clientY };
    previewCanvas.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  previewCanvas.addEventListener("pointermove", (event) => {
    if (!cropMode || !dragPoint || !sourceImage) return;
    const rect = previewCanvas.getBoundingClientRect();
    const dx = event.clientX - dragPoint.x;
    const dy = event.clientY - dragPoint.y;
    dragPoint = { x: event.clientX, y: event.clientY };
    cropPanX = Math.max(-1, Math.min(1, cropPanX - (dx / Math.max(1, rect.width)) * 2));
    cropPanY = Math.max(-1, Math.min(1, cropPanY - (dy / Math.max(1, rect.height)) * 2));
    renderPhoto();
  });
  const endCropDrag = () => { dragPoint = null; };
  previewCanvas.addEventListener("pointerup", endCropDrag);
  previewCanvas.addEventListener("pointercancel", endCropDrag);
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