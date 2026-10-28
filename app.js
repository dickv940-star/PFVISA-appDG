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
  const outputFormatSelect = $("output-format");
  const exportProfileNote = $("export-profile-note");
  const metricFormat = $("spec-format");
  const countrySelect = $("country-select");
  const documentSelect = $("document-select");
  const requirementsTitle = $("requirements-title");
  const requirementsSummary = $("requirements-summary");
  const requirementsList = $("requirements-list");
  const officialLink = $("official-link");
  const referenceLink = document.createElement("a");
  referenceLink.id = "visafoto-reference-link";
  referenceLink.className = "official-link reference-link";
  referenceLink.href = "https://id.visafoto.com/id-visa-photo";
  referenceLink.target = "_blank";
  referenceLink.rel = "noopener noreferrer";
  referenceLink.textContent = "Lihat profil & variasi ukuran di Visafoto ↗";
  referenceLink.hidden = true;
  officialLink.insertAdjacentElement("afterend", referenceLink);
  const previewCanvas = $("preview-canvas");
  const cropModeBtn = $("crop-mode-btn");
  const autoCropBtn = $("auto-crop-btn");
  const measurementStatus = $("measurement-status");
  const metricZoom = $("metric-zoom");
  const metricHead = $("metric-head");
  const metricHeadTarget = $("metric-head-target");
  const metricTop = $("metric-top");
  const metricTopTarget = $("metric-top-target");
  const measurementNote = $("measurement-note");
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
          label: "Paspor " + name, preset: passportPreset, profileStatus: "unverified",
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
          label: "Visa " + name, preset: passportPreset, profileStatus: "unverified",
          summary: "Persyaratan foto visa ditentukan oleh jenis visa dan kanal pengajuan. Ukuran awal di editor ini bukan standar resmi untuk semua visa.",
          rules: [
            "Buka petunjuk resmi untuk kategori visa dan portal yang benar sebelum memilih ukuran akhir.",
            "Cocokkan dimensi, resolusi, format file, batas ukuran file, latar belakang, dan proporsi wajah.",
            "Visa elektronik, permohonan melalui pusat visa, dan dokumen cetak dapat memakai aturan berbeda.",
            "Jangan menganggap ukuran paspor berlaku otomatis untuk visa atau izin tinggal."
          ]
        },
        id: {
          label: "Kartu identitas / izin tinggal", preset: passportPreset, profileStatus: "unverified",
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
        visa: { label: "Visa Indonesia — 35 × 45 mm", preset: "35x45", summary: "Profil ini mengikuti referensi Visafoto untuk foto Visa Indonesia: ukuran 35 × 45 mm, resolusi 600 DPI, tinggi kepala 34,5 mm, dan jarak tepi atas ke ubun-ubun 3 mm. Periksa kembali instruksi portal visa yang akan Anda gunakan.", rules: ["Ukuran foto: lebar 35 mm × tinggi 45 mm.", "Resolusi kerja: 600 DPI; hasil raster sekitar 827 × 1063 piksel.", "Proporsi acuan: tinggi kepala dari ubun-ubun hingga dagu 34,5 mm; jarak tepi atas ke ubun-ubun 3 mm.", "Gunakan foto berwarna, tajam, wajah menghadap lurus, mata terlihat, pencahayaan merata, dan latar belakang sesuai instruksi permohonan.", "PFVISA membantu ukuran dan crop; pengukuran ubun-ubun/dagu oleh deteksi otomatis hanya perkiraan, bukan pemeriksaan biometrik atau jaminan penerimaan."] },
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
    cn: { name: "Tiongkok", official: "https://bio.visaforchina.cn/SGP3_EN/qianzhengyewu/jichuzhishi/changjianwenti/376268253753905152.html", documents: {
      passport: { label: "Paspor / dokumen Tiongkok", preset: "33x48", summary: "Profil 33 × 48 mm ini khusus mengikuti panduan foto visa Tiongkok yang ditautkan; ketentuan foto paspor/dokumen lain perlu diverifikasi terpisah.", rules: ["Ukuran acuan foto visa: lebar 33 mm × tinggi 48 mm.", "Foto berwarna, diambil dalam 6 bulan terakhir, wajah terlihat penuh, tanpa penutup kepala kecuali alasan keagamaan yang diizinkan.", "Latar belakang putih atau mendekati putih, tanpa bingkai; wajah harus jelas dan berada di tengah.", "Untuk foto visa Tiongkok pada referensi ini: tinggi kepala 28–33 mm, lebar kepala 15–22 mm, dan jarak puncak kepala ke tepi atas 3–5 mm.", "Panduan paspor atau dokumen Tiongkok lain bisa berbeda; periksa instruksi instansi penerbit."] },
      visa: { label: "Visa Tiongkok", preset: "33x48", summary: "Profil ini menggunakan panduan resmi Chinese Visa Application Service Center (CVASC): foto berwarna 33 × 48 mm, latar putih, dan diambil dalam 6 bulan terakhir.", rules: ["Ukuran foto: 33 mm lebar × 48 mm tinggi.", "Tinggi kepala dari puncak kepala hingga dagu: 28–33 mm; lebar kepala: 15–22 mm.", "Jarak dari puncak kepala ke tepi atas foto: 3–5 mm.", "Wajah menghadap lurus; mata terbuka, bibir tertutup, telinga terlihat bila memungkinkan, dan ekspresi netral.", "Hindari bayangan pada wajah/latar, pantulan atau lensa kacamata berwarna, filter, distorsi, dan objek yang menutupi fitur wajah.", "Auto Crop menggunakan target tengah rentang sebagai titik awal. Periksa lebar kepala dan hasil akhir secara visual; pengukuran otomatis bukan jaminan penerimaan."] }
    }},
    jp: { name: "Jepang", official: "https://www.mofa.go.jp/j_info/visit/visa/", documents: {
      passport: { label: "Paspor Jepang", preset: "35x45", summary: "Persyaratan foto paspor Jepang ditetapkan oleh otoritas penerbit dan dapat berbeda dari foto visa.", rules: ["Periksa ukuran dan format yang diminta otoritas penerbit paspor.", "Gunakan foto terbaru dengan wajah terlihat jelas dan latar belakang sederhana.", "Pastikan tidak ada bayangan, pantulan, atau pengeditan yang mengubah wajah."] },
      visa: { label: "Visa Jepang (pengajuan di Indonesia)", preset: "35x45", summary: "Untuk permohonan visa Jepang melalui JVAC di Indonesia, foto yang diminta berukuran 35 × 45 mm (lebar × tinggi), berwarna, berlatar polos, wajah menghadap lurus dan terlihat jelas, serta diambil dalam 6 bulan terakhir. Ketentuan unggahan elektronik dapat berbeda.", rules: ["Ukuran cetak: 35 mm lebar × 45 mm tinggi. Jangan gunakan profil 45 × 45 mm untuk pengajuan kertas di Indonesia.", "Foto berwarna dengan latar polos; wajah menghadap ke depan dan terlihat jelas.", "Foto diambil dalam 6 bulan terakhir. Kedutaan Jepang di Indonesia menyatakan foto harus tanpa latar dan bukan hasil editing; gunakan editor hanya untuk crop/ukuran dan jangan mengubah fitur wajah.", "JVAC Indonesia tidak mencantumkan angka tinggi kepala atau margin atas dalam ringkasan spesifikasi ini. Jangan mengklaim ukuran kepala otomatis telah memenuhi angka tertentu.", "Periksa kembali persyaratan untuk kanal pengajuan dan jenis visa yang digunakan."] }
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
    "id:visa": { preset: "35x45", dpi: 600, headMm: 34.5, topMm: 3, source: "Referensi Visafoto untuk Indonesia Visa 35 × 45 mm: tinggi kepala 34,5 mm dan jarak tepi atas ke ubun-ubun 3 mm. Ini bukan standar pemerintah dan harus dicocokkan dengan portal pengajuan." },
    "id:id": { preset: "30x40", dpi: 600, headMm: 30, topMm: 2.5, source: "Referensi format foto 30 × 40 mm; pastikan cocok dengan instansi penerbit." },

    "us:passport": { preset: "2x2", dpi: 300, pixelWidth: 600, pixelHeight: 600, minPixelWidth: 600, maxPixelWidth: 1200, minPixelHeight: 600, maxPixelHeight: 1200, format: "image/jpeg", profileStatus: "reference", headMm: 32.766, topMm: null, eyeLineMm: 29.97, source: "Referensi Visafoto: https://id.visafoto.com/us-passport-photo — 2 × 2 inci. Untuk foto digital, dimensi piksel dapat memiliki rentang; 600 × 600 px dipakai sebagai ukuran awal, bukan profil semua sistem. Ikuti instruksi pengajuan yang sebenarnya." },
    "us:visa": { preset: "2x2", dpi: 300, pixelWidth: 600, pixelHeight: 600, minPixelWidth: 600, maxPixelWidth: 1200, minPixelHeight: 600, maxPixelHeight: 1200, format: "image/jpeg", profileStatus: "reference", headMm: null, topMm: null, source: "Referensi awal 2 × 2 inci / 600 × 600 px. Visa AS memiliki ketentuan berdasarkan formulir dan kanal pengajuan; dimensi ini bukan jaminan untuk setiap kategori. Verifikasi pada instruksi aplikasi yang dipakai." },

    "schengen:visa": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Visafoto mencantumkan Schengen Visa 35 × 45 mm: https://id.visafoto.com/requirements. Ukuran kepala dan jarak atas tidak dikunci di profil generik ini karena ketentuan konsulat/pusat visa perlu diverifikasi untuk tempat pengajuan." },
    "schengen:residence": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Izin tinggal berbeda menurut negara penerbit; ukuran ini hanya titik awal." },

    "gb:passport": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Foto paspor UK digital tidak selalu mengikuti ukuran cetak; ikuti pemeriksaan foto pada layanan GOV.UK." },
    "gb:visa": { preset: "35x45", dpi: 600, headMm: 32.8, topMm: 4.9, source: "Visafoto: https://id.visafoto.com/gb-visa-photo — 35 × 45 mm, 600 DPI, tinggi kepala 32,8 mm dan jarak tepi atas 4,9 mm. Cocokkan dengan jalur visa/biometrik yang berlaku." },

    "ca:passport": { preset: "50x70", dpi: 600, headMm: 35, topMm: null, eyeLineMm: 39, source: "Visafoto: https://id.visafoto.com/ca-passport-photo — 50 × 70 mm, 600 DPI, tinggi kepala 35 mm; garis mata 39 mm dari tepi bawah. Jarak atas tidak disimpulkan dari garis mata. Cocokkan dengan panduan resmi Kanada." },
    "ca:visa": { preset: "35x45", dpi: 305, format: "image/jpeg", maxFileKB: 240, headMm: 34.7, topMm: 3, source: "Visafoto: https://id.visafoto.com/ca-visa-photo — 35 × 45 mm, 305 DPI, tinggi kepala 34,7 mm dan jarak tepi atas 3 mm. Ukuran file yang dicantumkan Visafoto 60–240 KB; cek instruksi kategori aplikasi terbaru." },

    "au:passport": { preset: "35x45", dpi: 600, headMm: 34, topMm: 5, source: "Visafoto: https://id.visafoto.com/au-passport-photo — 35 × 45 mm, 600 DPI, tinggi kepala 34 mm dan jarak atas 5 mm. Panduan resmi Australia mengizinkan rentang ukuran foto yang lebih luas; cocokkan dengan jalur permohonan." },
    "au:visa": { preset: "35x45", dpi: 600, headMm: 34, topMm: 5, source: "Visafoto: https://id.visafoto.com/au-visa-photo — 35 × 45 mm, 600 DPI, tinggi kepala 34 mm dan jarak atas 5 mm. Persyaratan subclass/portal visa dapat berbeda." },

    "in:passport": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "India memiliki beberapa format paspor cetak/digital; konfirmasi spesifikasi portal yang digunakan." },
    "in:visa": { preset: "2x2", dpi: 300, headMm: 32.766, topMm: null, source: "Visafoto: https://id.visafoto.com/in-visa-photo — 2 × 2 inci, 300 DPI, tinggi kepala 1,29 inci (32,8 mm), garis mata 1,18 inci dari tepi bawah, ukuran file 0–290 KB. Jarak atas tidak disimpulkan dari garis mata; e-Visa dapat memiliki profil digital lain." },

    "cn:passport": { preset: "33x48", dpi: 300, headMm: null, topMm: null, source: "Spesifikasi terukur di bawah merujuk foto visa Tiongkok, bukan otomatis foto paspor/dokumen lain." },
    "cn:visa": { preset: "33x48", dpi: 600, headMm: 31.5, topMm: 5, headMinMm: 28, headMaxMm: 33, topMinMm: 3, topMaxMm: 5, source: "Visafoto: https://id.visafoto.com/cn-visa-photo — 33 × 48 mm, 600 DPI, tinggi kepala 31,5 mm dan jarak atas 5 mm. Rentang pada panduan CVASC yang ditautkan: tinggi kepala 28–33 mm, lebar kepala 15–22 mm, jarak atas 3–5 mm. Auto Crop memakai angka Visafoto; lebar kepala masih perlu diperiksa." },

    "jp:passport": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Ukuran foto paspor Jepang harus dicocokkan dengan instruksi permohonan yang dipakai." },
    "jp:visa": { preset: "35x45", dpi: 300, format: "image/jpeg", profileStatus: "official-size-reference", headMm: null, topMm: null, source: "Profil pengajuan visa Jepang di Indonesia: JVAC/VFS mencantumkan foto 35 × 45 mm, berwarna, latar polos, wajah menghadap lurus dan jelas, diambil dalam 6 bulan terakhir: https://www.vfsglobal.com/one-pager/japan/indonesia/english/index.html. Kedutaan Jepang di Indonesia juga menyebut foto 4,5 × 3,5 cm dan bukan hasil editing: https://www.id.emb-japan.go.jp/visa_3.html. Tidak ada angka DPI, tinggi kepala, atau margin atas yang dikunci oleh dua ringkasan ini; 300 DPI adalah setelan ekspor editor, bukan klaim aturan resmi. Aturan e-Visa atau pengajuan di negara lain dapat berbeda." },
    "ae:visa": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Visafoto mencantumkan beberapa varian UEA: 43 × 55 mm (Flydubai/Etihad), 600 × 600 px (ICP), 2 × 2 inci (VFS), serta 35 × 45 mm untuk izin tinggal/ICA. Profil 35 × 45 mm di sini hanya titik awal; pilih kanal/portal yang benar sebelum crop otomatis." },
    "ae:id": { preset: "35x45", dpi: 600, headMm: null, topMm: null, source: "Emirates ID/izin tinggal dapat memiliki spesifikasi digital tersendiri; verifikasi pada portal resmi." }
  };

  function fallbackCountryGuide() {
    const selected = countrySelect.options[countrySelect.selectedIndex];
    const name = selected ? selected.textContent : "Negara belum dikenal";
    const note = "Profil " + name + " belum memiliki spesifikasi Visafoto yang diverifikasi per jenis dokumen. Ukuran 35 × 45 mm hanya ukuran sementara, bukan aturan negara ini. Periksa daftar Visafoto dan portal resmi sebelum menggunakan Auto Crop.";
    return {
      name,
      official: "https://id.visafoto.com/requirements",
      documents: {
        passport: { label: "Paspor — profil perlu diverifikasi", preset: "35x45", summary: note, rules: [note, "Jangan menganggap ukuran atau proporsi kepala ini sebagai ketentuan resmi.", "Gunakan Auto Crop hanya sebagai titik awal dan periksa portal penerbit dokumen."] },
        visa: { label: "Visa — profil perlu diverifikasi", preset: "35x45", summary: note, rules: [note, "Spesifikasi visa dapat berbeda menurut jenis visa, konsulat, dan kanal unggahan.", "Periksa ukuran piksel, batas ukuran file, latar belakang, proporsi kepala, dan posisi mata pada portal resmi."] }
      }
    };
  }

  function currentPhotoSpec() {
    return photoSpecs[countrySelect.value + ":" + documentSelect.value] || null;
  }

  function profileStatusLabel(spec, doc) {
    const state = (spec && spec.profileStatus) || (doc && doc.profileStatus) || "unverified";
    if (state === "verified-official") return "Profil terverifikasi dari sumber resmi";
    if (state === "official-size-reference") return "Ukuran dasar dirujuk ke sumber resmi; detail biometrik belum lengkap";
    if (state === "reference") return "Profil referensi — cocokkan dengan portal permohonan";
    return "Profil belum lengkap / belum diverifikasi untuk jenis dokumen ini";
  }

  function selectedExportFormat(spec) {
    return spec && spec.format ? spec.format : (outputFormatSelect ? outputFormatSelect.value : "image/jpeg");
  }

  function populateDocuments() {
    const guide = countryGuides[countrySelect.value] || fallbackCountryGuide();
    documentSelect.replaceChildren();
    Object.entries(guide.documents).forEach(([key, doc]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = doc.label;
      documentSelect.appendChild(option);
    });
    if (countrySelect.value === "id" && guide.documents.visa) {
      documentSelect.value = "visa";
    }
    updateRequirements();
  }

  let cropZoom = 1;
  let cropPanX = 0;
  let cropPanY = 0;
  let cropMode = false;
  let dragPoint = null;
  let faceLandmarkerPromise = null;
  let detectedCrop = null;
  let detectedHead = null;

  async function detectAndCropFace(image) {
    // Show a real crop using the currently selected output ratio immediately,
    // while the optional face model loads. This prevents a long blank/no-op
    // feeling when the external face-detection model is slow or unavailable.
    if (sourceImage !== image) return;
    detectedCrop = null;
    detectedHead = null;
    cropZoom = 1;
    cropPanX = 0;
    cropPanY = 0;
    cropZoomInput.value = "1";
    cropZoomLabel.textContent = "100%";
    cropMode = true;
    cropControls.hidden = false;
    photoFrame.classList.add("crop-active");
    cropModeBtn.textContent = "Selesai Atur Crop";
    renderPhoto();
    setStatus("Auto Crop aktif: memuat deteksi wajah lalu menghitung tinggi kepala, margin atas, dan skala crop…");
    try {
      if (!faceLandmarkerPromise) {
        // Retry through a second CDN if the primary module/WASM host is blocked.
        faceLandmarkerPromise = (async () => {
          let vision;
          let files;
          try {
            vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm");
            files = await vision.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm");
          } catch (primaryError) {
            vision = await import("https://unpkg.com/@mediapipe/tasks-vision@0.10.22/+esm");
            files = await vision.FilesetResolver.forVisionTasks("https://unpkg.com/@mediapipe/tasks-vision@0.10.22/wasm");
          }
          return vision.FaceLandmarker.createFromOptions(files, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "CPU"
            },
            runningMode: "IMAGE",
            numFaces: 1
          });
        })();
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

      // Landmark 10 is the upper forehead, not the true crown. Estimate crown
      // above it, then preserve the requested head-height/top-margin geometry.
      const headTop = forehead.y - faceHeight * 0.25;
      const headHeight = chin.y - headTop;
      const spec = currentPhotoSpec();
      const dims = getDimensions();
      // Prefer exact targets; for documented ranges, use the midpoint.
      // Profiles without measurements use a clearly approximate fallback.
      const targetHeadMm = spec && spec.headMm != null
        ? spec.headMm
        : spec && spec.headMinMm != null && spec.headMaxMm != null
          ? (spec.headMinMm + spec.headMaxMm) / 2
          : null;
      const targetTopMm = spec && spec.topMm != null
        ? spec.topMm
        : spec && spec.topMinMm != null && spec.topMaxMm != null
          ? (spec.topMinMm + spec.topMaxMm) / 2
          : null;
      const headFraction = targetHeadMm != null ? targetHeadMm / dims.heightMm : 0.72;
      const topMargin = targetTopMm != null ? targetTopMm / dims.heightMm : 0.07;
      const ratio = dims.widthPx / dims.heightPx;
      // Calculate crop scale from the detected head height, rather than using
      // a fixed zoom. At 100%, this computed crop matches the selected target.
      const ch = headHeight / headFraction;
      const cw = ch * ratio;
      const centerX = (leftEye.x + rightEye.x) / 2;
      const cropX = centerX - cw / 2;
      const cropY = spec && spec.eyeLineMm != null
        ? ((leftEye.y + rightEye.y) / 2) - ch * (1 - spec.eyeLineMm / dims.heightMm)
        : headTop - ch * topMargin;

      // Do not shrink the crop to fit the uploaded image: doing so silently
      // changes the requested head-to-photo proportion. Out-of-frame areas
      // are rendered as the existing white canvas background.
      detectedCrop = { x: cropX, y: cropY, width: cw, height: ch };
      detectedHead = { top: headTop, chin: chin.y };
      cropZoom = 1; cropPanX = 0; cropPanY = 0;
      cropZoomInput.value = "1"; cropZoomLabel.textContent = "100%";
      // Apply the automatic result immediately, then leave the editor open so
      // the user can fine-tune position and zoom without running Auto Crop again.
      cropMode = true;
      cropControls.hidden = false;
      photoFrame.classList.add("crop-active");
      cropModeBtn.textContent = "Selesai Atur Crop";
      renderPhoto();
      const edgeIssue = cropX < 0 || cropY < 0 || cropX + cw > w || cropY + ch > h;
      const targetDescription = [
        targetHeadMm == null ? "tinggi kepala belum diverifikasi" : "target tinggi kepala " + mmLabel(targetHeadMm) + " mm",
        targetTopMm == null ? "margin atas belum diverifikasi" : "target margin atas " + mmLabel(targetTopMm) + " mm"
      ].join(", ");
      setStatus(
        edgeIssue
          ? "Auto Crop menghitung posisi dan zoom (" + targetDescription + "), tetapi foto sumber terlalu rapat atau wajah terlalu dekat tepi. Periksa area putih dan atur crop manual bila perlu."
          : "Auto Crop menghitung posisi wajah, tinggi kepala, margin atas, dan zoom (" + targetDescription + "). Puncak kepala merupakan estimasi; periksa hasil sebelum menyimpan.",
        edgeIssue ? "error" : "success"
      );
    } catch (error) {
      // Do not cache a rejected model promise forever; the next Auto Crop click
      // should be able to retry after a transient network/CDN failure.
      faceLandmarkerPromise = null;
      detectedCrop = null;
      detectedHead = null;
      cropMode = true;
      cropControls.hidden = false;
      photoFrame.classList.add("crop-active");
      cropModeBtn.textContent = "Selesai Atur Crop";
      renderPhoto();
      const reason = error && error.message ? error.message : "model wajah tidak tersedia";
      setStatus("Auto Crop wajah belum berhasil (" + reason + "). Crop rasio dasar tetap tersedia. Periksa koneksi internet lalu tekan Auto Crop sesuai profil untuk mencoba lagi.", "error");
    }
  }

  function resetCrop() {
    cropZoom = 1;
    cropPanX = 0;
    cropPanY = 0;
    cropZoomInput.value = "1";
    cropZoomLabel.textContent = "100%";
  }

  function updateRequirements() {
    const guide = countryGuides[countrySelect.value] || fallbackCountryGuide();
    const doc = guide.documents[documentSelect.value] || Object.values(guide.documents)[0];
    if (!doc) return;
    const spec = currentPhotoSpec();
    const presetKey = spec && presets[spec.preset] ? spec.preset : doc.preset;
    requirementsTitle.textContent = "Syarat foto — " + guide.name;
    requirementsSummary.textContent = doc.summary + " Status profil: " + profileStatusLabel(spec, doc) + ".";
    if (exportProfileNote) {
      exportProfileNote.textContent = spec && spec.maxFileKB
        ? "Batas file profil " + spec.maxFileKB + " KB. Cocokkan format dan ukuran akhir dengan portal resmi."
        : "Batas file dan format khusus belum ditetapkan pada profil ini. Periksa portal tujuan; hasil ekspor belum tentu memenuhi semua aturan.";
    }
    requirementsList.replaceChildren();
    doc.rules.forEach((rule) => {
      const item = document.createElement("li");
      item.textContent = rule;
      requirementsList.appendChild(item);
    });
    if (spec) {
      const facts = [
        "Profil kerja PFVISA: " + presets[presetKey].label + ", " + spec.dpi + " DPI. " + profileStatusLabel(spec, doc) + ".",
        spec.headMinMm != null && spec.headMaxMm != null ? "Rentang tinggi kepala acuan (perkiraan ubun-ubun hingga dagu): " + mmLabel(spec.headMinMm) + "–" + mmLabel(spec.headMaxMm) + " mm." : spec.headMm != null ? "Target tinggi kepala (perkiraan ubun-ubun hingga dagu): " + mmLabel(spec.headMm) + " mm." : "Ukuran kepala belum dikunci otomatis karena spesifikasi yang tepat bergantung pada dokumen/portal.",
        spec.topMinMm != null && spec.topMaxMm != null ? "Rentang jarak tepi atas ke puncak kepala: " + mmLabel(spec.topMinMm) + "–" + mmLabel(spec.topMaxMm) + " mm." : spec.topMm != null ? "Target jarak tepi atas ke ubun-ubun: " + mmLabel(spec.topMm) + " mm." : "Jarak tepi atas kepala belum ditetapkan otomatis; periksa petunjuk resmi.",
        spec.eyeLineMm != null ? "Target garis mata dari tepi bawah: " + mmLabel(spec.eyeLineMm) + " mm; Auto Crop menggunakan posisi mata sebagai acuan vertikal." : "Garis mata belum ditetapkan otomatis untuk profil ini.",
        spec.source,
        "Profil ini membantu penyesuaian ukuran dan crop, tetapi bukan jaminan penerimaan. Ketentuan resmi dapat berbeda menurut kategori aplikasi."
      ];
      facts.forEach((rule) => {
        const item = document.createElement("li");
        item.textContent = rule;
        requirementsList.appendChild(item);
      });
    } else {
      const item = document.createElement("li");
      item.textContent = "PERLU VERIFIKASI: PFVISA belum memiliki profil ukuran, DPI, dan proporsi kepala yang terverifikasi khusus untuk dokumen ini. Ukuran yang tampil hanya titik awal, bukan aturan resmi. Periksa petunjuk pada portal resmi sebelum mengirim foto.";
      requirementsList.appendChild(item);
    }
    officialLink.href = guide.official;
    officialLink.textContent = "Buka sumber resmi " + guide.name + " ↗";
    // The Visafoto index includes many document-specific variants per country.
    // Keep the reference available for every selection; the index is a catalog,
    // not proof that the currently selected profile is fully verified.
    referenceLink.hidden = false;
    if (presets[presetKey]) {
      resetCrop();
      sizePreset.value = presetKey;
      customFields.hidden = true;
      // Always reset DPI when switching country/document so a previous selection
      // cannot silently carry over to a country with no verified photo profile.
      dpiSelect.value = spec && spec.dpi ? String(spec.dpi) : "300";
      if (outputFormatSelect) outputFormatSelect.value = spec && spec.format ? spec.format : "image/jpeg";
      detectedCrop = null;
      detectedHead = null;
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
    const spec = currentPhotoSpec();
    const widthPx = spec && Number.isFinite(spec.pixelWidth) ? spec.pixelWidth : Math.max(1, Math.round((size.width / 25.4) * dpi));
    const heightPx = spec && Number.isFinite(spec.pixelHeight) ? spec.pixelHeight : Math.max(1, Math.round((size.height / 25.4) * dpi));
    return {
      widthMm: size.width,
      heightMm: size.height,
      widthPx,
      heightPx,
      dpi,
      pixelRange: spec && spec.minPixelWidth ? { minWidth: spec.minPixelWidth, maxWidth: spec.maxPixelWidth || spec.minPixelWidth, minHeight: spec.minPixelHeight || spec.minPixelWidth, maxHeight: spec.maxPixelHeight || spec.maxPixelWidth || spec.minPixelWidth } : null,
      maxFileKB: spec && spec.maxFileKB ? spec.maxFileKB : null,
      format: selectedExportFormat(spec)
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
    // A detected crop may extend beyond the source bounds so the target
    // head fraction and top margin remain stable instead of being clamped.
    if (detectedCrop) {
      return { x: centerX - width / 2, y: centerY - height / 2, width, height };
    }
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
    const outsideSource =
      crop.x < 0 || crop.y < 0 ||
      crop.x + crop.width > sourceImage.naturalWidth ||
      crop.y + crop.height > sourceImage.naturalHeight;

    if (outsideSource && detectedCrop) {
      // Build the crop in source-pixel coordinates first. drawImage() clips
      // out-of-bounds source rectangles and can rescale the remaining pixels;
      // this intermediate canvas preserves the requested geometry instead.
      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = Math.max(1, Math.ceil(crop.width));
      cropCanvas.height = Math.max(1, Math.ceil(crop.height));
      const cropContext = cropCanvas.getContext("2d", { alpha: false });
      cropContext.fillStyle = "#ffffff";
      cropContext.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
      cropContext.drawImage(sourceImage, -crop.x, -crop.y);
      context.drawImage(cropCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
    } else {
      context.drawImage(
        sourceImage,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, previewCanvas.width, previewCanvas.height
      );
    }

    previewCanvas.hidden = false;
    emptyState.hidden = true;
    updateLabels();
    updateMeasurements(crop);
    downloadBtn.disabled = false;
    resetBtn.disabled = false;
    cropModeBtn.disabled = false;
    autoCropBtn.disabled = false;
  }

  function updateMeasurements(crop) {
    const spec = currentPhotoSpec();
    const dims = getDimensions();
    // Report effective magnification against a plain ratio-fit crop. The
    // profile-driven auto crop often has a custom crop rectangle, so the manual
    // slider can correctly remain at 1.0x while the actual zoom is not 100%.
    const ratio = dims.widthPx / dims.heightPx;
    const ratioFitHeight = sourceImage
      ? (sourceImage.naturalWidth / sourceImage.naturalHeight > ratio
          ? sourceImage.naturalHeight
          : sourceImage.naturalWidth / ratio)
      : 0;
    const effectiveZoom = crop && ratioFitHeight > 0 ? (ratioFitHeight / crop.height) * 100 : cropZoom * 100;
    metricZoom.textContent = Math.round(effectiveZoom) + "%";
    if (!sourceImage || !crop || !detectedHead) {
      metricHead.textContent = "Belum terukur";
      metricTop.textContent = "Belum terukur";
      metricHeadTarget.textContent = spec && spec.headMinMm != null && spec.headMaxMm != null ? "Target " + mmLabel(spec.headMinMm) + "–" + mmLabel(spec.headMaxMm) + " mm" : spec && spec.headMm != null ? "Target " + mmLabel(spec.headMm) + " mm" : "Target belum diverifikasi";
      metricTopTarget.textContent = spec && spec.topMinMm != null && spec.topMaxMm != null ? "Target " + mmLabel(spec.topMinMm) + "–" + mmLabel(spec.topMaxMm) + " mm" : spec && spec.topMm != null ? "Target " + mmLabel(spec.topMm) + " mm" : "Target belum diverifikasi";
      measurementStatus.textContent = sourceImage ? "Perlu verifikasi" : "Menunggu foto";
      measurementStatus.className = "measurement-badge neutral";
      measurementNote.textContent = "Deteksi wajah belum memberi pengukuran yang dapat digunakan. Periksa posisi secara visual.";
      return;
    }
    const headMm = ((detectedHead.chin - detectedHead.top) / crop.height) * dims.heightMm;
    const topMm = ((detectedHead.top - crop.y) / crop.height) * dims.heightMm;
    metricHead.textContent = mmLabel(Number(headMm.toFixed(1))) + " mm · " + (headMm / dims.heightMm * 100).toFixed(1) + "%";
    metricTop.textContent = mmLabel(Number(topMm.toFixed(1))) + " mm";
    metricHeadTarget.textContent = spec && spec.headMinMm != null && spec.headMaxMm != null ? "Target " + mmLabel(spec.headMinMm) + "–" + mmLabel(spec.headMaxMm) + " mm" : spec && spec.headMm != null ? "Target " + mmLabel(spec.headMm) + " mm" : "Target belum diverifikasi";
    metricTopTarget.textContent = spec && spec.topMinMm != null && spec.topMaxMm != null ? "Target " + mmLabel(spec.topMinMm) + "–" + mmLabel(spec.topMaxMm) + " mm" : spec && spec.topMm != null ? "Target " + mmLabel(spec.topMm) + " mm" : "Target belum diverifikasi";
    const hasTarget = !!(spec && (spec.headMm != null || spec.headMinMm != null || spec.topMm != null || spec.topMinMm != null));
    // The crop is mathematically fitted using an estimated crown. These values
    // are not independent biometric verification and cannot establish a pass.
    measurementStatus.textContent = hasTarget ? "Perlu cek visual" : "Perlu verifikasi";
    measurementStatus.className = "measurement-badge warn";
    measurementNote.textContent = "Angka di atas menunjukkan geometri crop berdasarkan perkiraan puncak kepala dari landmark wajah; bukan pengukuran independen ubun-ubun sebenarnya. Periksa rambut/ubun-ubun, dagu, mata, tepi foto, dan instruksi portal secara visual. PFVISA tidak dapat menjamin penerimaan.";

  }

  function updateLabels() {
    const size = getSize();
    const dimensions = getDimensions();
    const widthText = mmLabel(size.width);
    const heightText = mmLabel(size.height);
    const label = widthText + " × " + heightText + " mm";

    $("dimension-label").textContent = sizePreset.value === "2x2" ? "2 × 2 inci" : label;
    $("spec-size").textContent = sizePreset.value === "2x2" ? "2 × 2 inci" : label;
    $("spec-pixels").textContent = dimensions.widthPx + " × " + dimensions.heightPx + " px" + (dimensions.pixelRange ? " (rentang profil " + dimensions.pixelRange.minWidth + "–" + dimensions.pixelRange.maxWidth + " px)" : "");
    if (metricFormat) metricFormat.textContent = dimensions.format === "image/png" ? "PNG" : "JPG";
    // The visible frame must follow the selected print ratio exactly, including
    // uncommon ratios and custom sizes; CSS presets alone are not sufficient.
    photoFrame.style.aspectRatio = String(size.width) + " / " + String(size.height);
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
    autoCropBtn.disabled = true;
    detectedHead = null;
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

  async function jpegWithDpi(blob, dpi) {
    const input = new Uint8Array(await blob.arrayBuffer());
    if (input.length < 4 || input[0] !== 0xff || input[1] !== 0xd8) return blob;
    const density = Math.max(1, Math.min(65535, Math.round(dpi)));
    if (input[2] === 0xff && input[3] === 0xe0 && input.length >= 20 &&
        input[6] === 0x4a && input[7] === 0x46 && input[8] === 0x49 && input[9] === 0x46 && input[10] === 0x00) {
      input[13] = 1;
      input[14] = (density >> 8) & 255; input[15] = density & 255;
      input[16] = (density >> 8) & 255; input[17] = density & 255;
      return new Blob([input], { type: "image/jpeg" });
    }
    const segment = new Uint8Array([0xff,0xe0,0x00,0x10,0x4a,0x46,0x49,0x46,0x00,0x01,0x01,0x01,(density>>8)&255,density&255,(density>>8)&255,density&255,0x00,0x00]);
    const output = new Uint8Array(input.length + segment.length);
    output.set(input.slice(0,2),0); output.set(segment,2); output.set(input.slice(2),2+segment.length);
    return new Blob([output], { type: "image/jpeg" });
  }

  async function downloadPhoto() {
    if (!sourceImage) { setStatus("Unggah foto terlebih dahulu.", "error"); return; }
    try {
      const dimensions = getDimensions();
      const format = dimensions.format || "image/jpeg";
      const maxBytes = dimensions.maxFileKB ? dimensions.maxFileKB * 1024 : null;
      let blob = null;
      if (format === "image/png") {
        blob = await new Promise((resolve) => previewCanvas.toBlob(resolve, "image/png"));
        if (!blob) throw new Error("Browser gagal membuat PNG");
        if (maxBytes && blob.size > maxBytes) { setStatus("PNG " + Math.ceil(blob.size / 1024) + " KB melebihi batas profil " + dimensions.maxFileKB + " KB. Pilih JPG jika diizinkan portal.", "error"); return; }
      } else {
        for (let quality = 0.92; quality >= 0.49; quality -= 0.06) {
          blob = await new Promise((resolve) => previewCanvas.toBlob(resolve, "image/jpeg", quality));
          if (blob && (!maxBytes || blob.size <= maxBytes)) break;
        }
        if (!blob) throw new Error("Browser gagal membuat JPG");
        if (maxBytes && blob.size > maxBytes) { setStatus("JPG masih " + Math.ceil(blob.size / 1024) + " KB, melebihi batas profil " + dimensions.maxFileKB + " KB. Periksa aturan portal atau gunakan foto sumber lain.", "error"); return; }
      }
      let finalBlob = blob;
      if (format === "image/jpeg") finalBlob = await jpegWithDpi(blob, dimensions.dpi);
      if (format === "image/png") {
        const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob); });
        finalBlob = new Blob([pngWithDpi(dataUrl, dimensions.dpi)], { type: "image/png" });
      }
      const baseName = activeFile ? activeFile.name.replace(/\.[^.]+$/, "") : "pfvisa-photo";
      const extension = format === "image/png" ? "png" : "jpg";
      const link = document.createElement("a");
      link.download = baseName + "-" + dimensions.widthPx + "x" + dimensions.heightPx + "px." + extension;
      const objectUrl = URL.createObjectURL(finalBlob); link.href = objectUrl; document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
      setStatus("File " + extension.toUpperCase() + " disiapkan: " + dimensions.widthPx + " × " + dimensions.heightPx + " px, " + Math.ceil(finalBlob.size / 1024) + " KB" + (maxBytes ? " (batas profil " + dimensions.maxFileKB + " KB)" : " (batas file profil belum diketahui)") + ". Metadata DPI disertakan pada file hasil. Periksa portal sebelum mengirim.", "success");
    } catch (error) { setStatus("Tidak dapat menyimpan foto: " + (error && error.message ? error.message : "kesalahan ekspor") + ".", "error"); }
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

  autoCropBtn.addEventListener("click", () => {
    if (!sourceImage) {
      setStatus("Unggah foto terlebih dahulu untuk mulai Auto Crop.", "error");
      return;
    }
    detectedCrop = null;
    detectedHead = null;
    resetCrop();
    detectAndCropFace(sourceImage);
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
    cropZoom = clampNumber(cropZoomInput.value, 0.5, 2.5, 1);
    cropZoomLabel.textContent = Math.round(cropZoom * 100) + "%";
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
  if (outputFormatSelect) outputFormatSelect.addEventListener("change", () => {
    const spec = currentPhotoSpec();
    if (spec && spec.format) {
      outputFormatSelect.value = spec.format;
      setStatus("Format ditetapkan oleh profil yang dipilih. Verifikasi aturan portal sebelum mengirim.", "error");
    }
    updateLabels();
  });
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
