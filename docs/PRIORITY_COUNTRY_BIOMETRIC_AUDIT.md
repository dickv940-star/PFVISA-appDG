# Audit persyaratan foto biometrik — negara prioritas

Tanggal audit: 5 November 2026

Dokumen ini membedakan validasi foto paspor, visa, dan e-Visa. Status `verified-official` hanya berlaku untuk kombinasi negara/dokumen/kanal yang disebutkan pada sumber, bukan seluruh jenis izin masuk negara tersebut.

## Profil yang memiliki data resmi dan diterapkan di PFVISA

| Negara | Dokumen/kanal | Ukuran | Tinggi kepala | Garis mata | Margin atas | Status |
|---|---|---|---|---|---|---|
| Australia | Paspor cetak | 35–40 × 45–50 mm; preset 35 × 45 | 32–36 mm dagu ke crown | Tidak ada angka | Tidak ada angka | verified-official |
| Amerika Serikat | Paspor kertas | 2 × 2 inci | 25–35 mm | Tidak ditetapkan pada aturan paspor cetak | Tidak ditetapkan | verified-official |
| Amerika Serikat | Visa digital | 2 × 2 inci; 600–1200 px persegi | 50–69% tinggi gambar | 56–69% dari bawah | Tidak ditetapkan | verified-official |
| Arab Saudi | Tourist e-Visa | 200 × 200 px; 5–100 KB | 70–80% tinggi gambar / 1,4–1,6 inci crown-ke-dagu | Tidak ditetapkan | Tidak ditetapkan | verified-official |
| China | Visa — foto cetak | 48 × 33 mm | 28–33 mm | Tidak ditetapkan secara numerik pada spesifikasi cetak | 3–5 mm | verified-official |
| Korea Selatan | Paspor | 35 × 45 mm | 32–36 mm crown tanpa rambut ke dagu | Tidak ditetapkan | Tidak ditetapkan | verified-official |
| Korea Selatan | Visa Form 17 | 35 × 45 mm | Tidak ditetapkan | Tidak ditetapkan | Tidak ditetapkan | verified-official untuk ukuran/posisi dasar |
| Jepang | Paspor | 35 × 45 mm | 34 ± 2 mm | Tidak ditetapkan | Tidak ditetapkan | verified-official |
| Jepang | Visa di Indonesia | 35 × 45 mm | Tidak ditetapkan | Tidak ditetapkan | Tidak ditetapkan | verified-official untuk ukuran/posisi dasar |
| Inggris (UK) | Paspor — foto cetak | 35 × 45 mm | 29–34 mm crown ke dagu | Tidak ditetapkan | Tidak ditetapkan | verified-official |

## Profil yang sengaja belum diberi status verified

- Australia visa: tidak ada satu aturan biometrik generik untuk semua subclass/kanal; gunakan instruksi yang ditampilkan pada aplikasi visa terkait.
- Arab Saudi passport: foto tourist e-Visa tidak boleh dianggap sebagai aturan paspor nasional.
- China passport: spesifikasi visa China tidak boleh diwariskan ke paspor nasional.
- UK visa: persyaratan foto tergantung proses visa/biometrik dan tidak disamakan dengan foto paspor UK.
- Foto digital paspor UK: GOV.UK meminta pengguna tidak melakukan crop sendiri; sistem pengajuan melakukan crop. Profil 35 × 45 mm/29–34 mm di PFVISA hanya untuk foto cetak.

## Sumber resmi

- Australia Passport Office: https://www.passports.gov.au/PhotoGuidelines
- U.S. Department of State passport photos: https://travel.state.gov/en/passports/apply/help/photos.html
- U.S. Department of State visa composition: https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/photo-composition-template.html
- Saudi eVisa official photo specifications: https://visa.visitsaudi.com/Home/PhotoSpecifications
- Chinese Visa Application Service Center, instructions of Consular Department MFA PRC: https://www.visaforchina.cn/MES4_EN/tongzhigonggao/551659995754795028.html
- Korean Embassy in Indonesia passport photo guidance: https://overseas.mofa.go.kr/id-bali-ko/brd/m_23841/view.do?page=1&seq=7
- Korean Ministry of Justice Visa Application Form 17: https://overseas.mofa.go.kr/upload/cntnts/bd-en/visa_application_form.pdf
- Japan Ministry of Foreign Affairs passport photo standards: https://www.mofa.go.jp/mofaj/toko/passport/ic_photo.html
- Japan Embassy in Indonesia visa photo guidance: https://www.id.emb-japan.go.jp/visa_3.html
- UK passport printed photo requirements: https://www.gov.uk/photos-for-passports/photo-requirements
- UK digital passport photo guidance: https://www.passport.service.gov.uk/photo/how-to-take-a-photo

## Batasan implementasi

Auto Crop hanya dapat menargetkan parameter yang tersedia di sumber resmi dan didukung oleh deteksi/renderer saat ini. Panduan posisi kualitatif tidak sama dengan pengukuran biometrik. PFVISA tidak mengklaim dapat mengukur lebar kepala, sudut rotasi, jarak mata, atau margin yang tidak tersedia pada field profil/landmark pipeline. Pengguna tetap perlu meninjau hasil crop.

Perubahan profil ini hanya mengubah data profil negara/dokumen dan entri negara/preset digital yang dibutuhkan. Tidak mengubah `print.js`, `index.html`, Editor crop rendering, atau pipeline Print / Auto Collage 600 DPI.
