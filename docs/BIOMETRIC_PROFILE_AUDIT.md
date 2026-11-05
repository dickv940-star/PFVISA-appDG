# PFVISA — Audit Persyaratan Biometrik Foto

Terakhir ditinjau: 5 November 2026

## Prinsip verifikasi

- Angka biometrik hanya boleh dipakai sebagai target Auto Crop jika dinyatakan oleh sumber resmi untuk negara, dokumen, dan kanal pengajuan yang sesuai.
- Rentang resmi dipakai sebagai rentang; Auto Crop memilih titik tengah sebagai titik awal, bukan menyatakan bahwa titik tengah adalah satu-satunya posisi yang sah.
- Jika sumber resmi tidak menetapkan garis mata atau margin atas numerik, field tersebut dibiarkan kosong. Jangan menurunkan margin atas dari garis mata atau mengisi angka generik.
- Aturan paspor cetak, paspor digital, visa, e-Visa, dan izin tinggal tidak boleh saling diwariskan tanpa sumber.
- Status `verified-official` berarti data terukur yang digunakan pada profil ini berasal dari sumber resmi untuk cakupan yang disebutkan. Status ini bukan jaminan foto diterima dan tidak berarti seluruh aturan visual/format telah divalidasi otomatis.

## Profil dengan target biometrik yang telah diverifikasi pada putaran ini

| Profil | Ukuran / rasio | Tinggi kepala | Garis mata | Margin atas | Status dan cakupan |
|---|---|---:|---:|---:|---|
| Indonesia — e-Visa digital | 2:3; output awal 400 × 600 px | 50–60% tinggi gambar | 50–60% dari tepi bawah | Tidak ditentukan | Resmi; hanya unggahan e-Visa |
| Amerika Serikat — paspor | 2 × 2 inci | 25–35 mm dagu ke puncak kepala | Tidak ditentukan | Tidak ditentukan | Resmi; panduan foto paspor |
| Amerika Serikat — visa digital | 2 × 2 inci / gambar digital persegi | 50–69% tinggi gambar | 56–69% dari tepi bawah | Tidak ditentukan | Resmi; template komposisi visa digital |
| Kanada — paspor dewasa cetak | 50 × 70 mm | 31–36 mm dagu ke crown | Tidak ditentukan | Tidak ditentukan | Resmi; bukan profil pembaruan online |
| Australia — paspor | Rentang resmi 35–40 × 45–50 mm; preset kerja PFVISA 35 × 45 mm | 32–36 mm dagu ke crown | Tidak ditentukan | Tidak ditentukan | Resmi; preset PFVISA berada dalam rentang ukuran yang diizinkan |

## Sumber resmi yang digunakan

1. Direktorat Jenderal Imigrasi RI, lembar format foto e-Visa: https://www.imigrasi.go.id/upload/file/Syarat%20Foto.pdf
2. U.S. Department of State, passport photos: https://travel.state.gov/en/passports/apply/help/photos.html
3. U.S. Department of State, visa photo composition template: https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/photo-composition-template.html
4. Government of Canada, passport photo requirements: https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html
5. Australian Passport Office, photo guidelines: https://www.passports.gov.au/PhotoGuidelines
6. ICAO Doc 9303 Part 3, displayed identification features and portrait quality: https://www.icao.int/publications/documents/9303_p3_cons_en.pdf

## Cakupan katalog dan pekerjaan yang masih terbuka

Repository memiliki katalog lintas negara dan variasi dokumen yang jauh lebih luas daripada lima profil di atas. Entri ukuran yang berasal dari katalog pihak ketiga atau fallback tidak otomatis menjadi standar resmi. Pada putaran ini, hanya lima kombinasi negara/dokumen di atas yang diberi status `verified-official`; profil lain tetap `reference` atau `unverified` sampai sumber resmi yang tepat ditemukan dan dicocokkan.

Prioritas audit berikutnya:
1. Paspor nasional tiap negara dari situs imigrasi/kementerian/otoritas penerbit.
2. Visa dan e-Visa menurut negara tujuan serta kanal pengajuan (portal pemerintah, kedutaan, atau pusat visa).
3. Kartu identitas dan izin tinggal sebagai kategori terpisah.
4. Periksa apakah otoritas memberi ukuran kepala, garis mata, margin atas, atau hanya arahan kualitatif.
5. Catat URL sumber, jenis dokumen, kanal, tanggal pemeriksaan, dan status perubahan sebelum mengaktifkan target Auto Crop.

## Catatan teknis

- Auto Crop menggunakan titik tengah rentang resmi jika rentang tersedia.
- Bila hanya tinggi kepala tersedia, Auto Crop mengunci skala kepala dan memakai komposisi vertikal netral; ia tidak menampilkan margin atas atau garis mata sebagai angka resmi.
- Bila garis mata tersedia dan margin atas tidak tersedia, posisi mata menjadi jangkar vertikal.
- Perkiraan crown dari landmark wajah tetap memiliki toleransi deteksi; pengguna harus memeriksa hasil dan dapat menyempurnakan crop di Editor.
- Perubahan profil tidak mengubah pipeline render Editor, sumber crop Editor untuk Print / Auto Collage, ekspor 600 DPI, atau output master print.
