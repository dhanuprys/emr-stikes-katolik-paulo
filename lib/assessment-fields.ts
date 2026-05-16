export type FieldDef = {
  key: string; label: string; type: 'text'|'textarea'|'datetime'|'date'|'radio'|'number';
  options?: string[]; suffix?: string; optional?: boolean; allowCustom?: boolean;
};
export type SectionDef = { title: string; description?: string; fields: FieldDef[] };

export const assessmentSections: SectionDef[] = [
  // ===== RESUME =====
  { title: "Resume (Ringkasan Perawatan Pasien Pulang)", fields: [
    { key:"resumeTanggal", label:"Tanggal dan waktu", type:"datetime" },
    { key:"resumeAnamesa", label:"Anamnesa", type:"textarea" },
    { key:"resumeRpd", label:"Riwayat Penyakit Dahulu", type:"textarea" },
    { key:"resumeRps", label:"Riwayat Penyakit Sekarang", type:"textarea" },
    { key:"resumeFisik", label:"Pemeriksaan Fisik", type:"textarea" },
    { key:"resumeLab", label:"Laboratorium", type:"textarea" },
    { key:"resumeRadiologi", label:"Radiologi", type:"textarea" },
    { key:"resumeLainLain", label:"Lain-lain", type:"textarea", optional:true },
    { key:"resumeDiagnosaMasuk", label:"Diagnosa Masuk", type:"textarea" },
    { key:"resumeDiagnosaAkhir", label:"Diagnosa Akhir", type:"textarea" },
    { key:"resumeTglMasuk", label:"Tanggal Masuk", type:"datetime" },
    { key:"resumeTglKeluar", label:"Tanggal Keluar/Meninggal", type:"datetime", optional:true },
    { key:"resumeIndikasi", label:"Indikasi MRS", type:"textarea" },
    { key:"resumeMasalah", label:"Masalah yang dihadapi", type:"textarea" },
    { key:"resumeKonsultasi", label:"Konsultasi", type:"textarea" },
    { key:"resumePengobatan", label:"Pengobatan", type:"textarea" },
    { key:"resumeTindakan", label:"Pembedahan/Tindakan", type:"textarea" },
    { key:"resumePerjalanan", label:"Perjalanan Penyakit", type:"textarea" },
    { key:"resumeKeadaanKrs", label:"Keadaan/hasil pengobatan waktu KRS", type:"textarea" },
    { key:"resumePrognosis", label:"Prognosis", type:"textarea" },
    { key:"resumeInstruksi", label:"Instruksi/Tindak Lanjut", type:"textarea" },
  ]},

  // ===== ASESMEN AWAL MEDIS =====
  { title: "Bagian I: Asesmen Awal Medis", description:"Subyektif: Anamnesa", fields: [
    { key:"medisKeluhanUtama", label:"Keluhan Utama", type:"textarea" },
    { key:"medisKeluhanPenyerta", label:"Keluhan Penyerta", type:"textarea" },
    { key:"medisRpd", label:"Riwayat Penyakit Dahulu", type:"textarea" },
    { key:"medisRpk", label:"Riwayat Penyakit Keluarga", type:"textarea" },
    { key:"alergiMakanan", label:"Riwayat Alergi - Makanan/Minuman", type:"textarea" },
    { key:"alergiObat", label:"Riwayat Alergi - Obat", type:"textarea" },
    { key:"alergiLain", label:"Riwayat Alergi - Lain-lain", type:"textarea" },
    { key:"statusGeneralis", label:"Status Generalis", type:"textarea" },
    { key:"statusLokalis", label:"Status Lokalis", type:"textarea" },
    { key:"pemeriksaanPenunjang", label:"Pemeriksaan Penunjang", type:"textarea" },
    { key:"diagnosaKerja", label:"Diagnosa Kerja", type:"textarea" },
    { key:"diagnosaBanding", label:"Diagnosa Banding", type:"textarea" },
    { key:"rencanaPelayanan", label:"Rencana Pelayanan", type:"textarea" },
    { key:"dpjp", label:"Nama DPJP Utama", type:"text" },
    { key:"tglPengkajianMedis", label:"Tanggal dan waktu pengkajian", type:"datetime" },
  ]},

  // ===== ASESMEN KEPERAWATAN =====
  { title: "Asesmen Keperawatan", fields: [
    { key:"tglAsesmenKep", label:"Tanggal Asesmen", type:"datetime" },
    { key:"infoDari", label:"Informasi dari", type:"radio", options:["Pasien","Orang tua","Keluarga","Orang lain"] },
    { key:"namaPemberiInfo", label:"Nama pemberi informasi", type:"text" },
    { key:"hubPemberiInfo", label:"Hubungan pemberi informasi", type:"text" },
    { key:"asalMasukKep", label:"Asal Masuk", type:"radio", options:["IGD","IRJA","Rujukan","Praktek Pribadi"] },
    { key:"caraMasuk", label:"Cara masuk", type:"radio", options:["Di gendong","Incubator transfer","Kereta dorong","Lain-lain"], allowCustom:true },
  ]},

  // ===== KEPERAWATAN GROUP (Riwayat) =====
  { title: "Riwayat Keperawatan", fields: [
    { key:"kepKeluhanUtama", label:"Keluhan Utama", type:"textarea" },
    { key:"kepRps", label:"Riwayat Penyakit Sekarang", type:"textarea" },
    { key:"kepRpd", label:"Riwayat Penyakit Dahulu", type:"textarea" },
    { key:"pernahDirawat", label:"Pernah dirawat", type:"radio", options:["Tidak","Ya"], allowCustom:true },
    { key:"riwayatPembedahan", label:"Riwayat pembedahan/pembiusan", type:"radio", options:["Tidak","Ya"], allowCustom:true },
    { key:"masalahOperasi", label:"Masalah dalam operasi/pembiusan", type:"radio", options:["Tidak","Ya"], allowCustom:true },
    { key:"riwayatTransfusi", label:"Riwayat transfusi darah", type:"radio", options:["Tidak","Ya"], allowCustom:true },
    { key:"obatRumah", label:"Obat dari rumah", type:"radio", options:["Tidak","Ada"], allowCustom:true },
    { key:"riwayatImunisasi", label:"Riwayat imunisasi", type:"radio", options:["BCG","Hepatitis","Polio","DPT","Campak","Lain-lain"], allowCustom:true },
    { key:"riwayatPenyakitKeluarga", label:"Riwayat penyakit keluarga", type:"radio", options:["Hipertensi","Hepatitis","Asma","TBC paru","DM","Lainnya"], allowCustom:true },
  ]},

  // ===== RIWAYAT KEHAMILAN =====
  { title: "Riwayat Kehamilan dan Kelahiran", fields: [
    { key:"usiaKehamilan", label:"Usia Kehamilan", type:"text" },
    { key:"anakKe", label:"Anak ke", type:"text" },
    { key:"riwayatPenyakitHamil", label:"Riwayat penyakit selama kehamilan", type:"radio", options:["Tidak ada","Hipertensi","Asma","Toxoplasma","DM","Jantung","Thypoid","TBC","Lain-lain"], allowCustom:true },
    { key:"komplikasiPersalinan", label:"Komplikasi saat persalinan", type:"radio", options:["Tidak ada","Kejang","Pendarahan","Lain-lain"], allowCustom:true },
    { key:"tempatLahir", label:"Tempat kelahiran", type:"radio", options:["Rumah sakit","Puskesmas","BPM","Lain-lain"], allowCustom:true },
    { key:"jenisPersalinan", label:"Jenis persalinan", type:"radio", options:["Spontan","Sectio C","Vaccum eks","Forcep eks.","Alasan tindakan"], allowCustom:true },
    { key:"ditolongOleh", label:"Ditolong oleh", type:"radio", options:["Dokter","Bidan"] },
    { key:"keadaanLahir", label:"Keadaan saat lahir", type:"radio", options:["Segera menangis","Menangis saat beberapa saat","Tidak menangis"] },
    { key:"bbl", label:"BBL", type:"text", suffix:"gr" },
    { key:"pbl", label:"PBL", type:"text", suffix:"cm" },
  ]},

  // ===== POLA AKTIFITAS =====
  { title: "Pola Aktifitas Sehari-hari — Nutrisi", fields: [
    { key:"bb", label:"BB", type:"text", suffix:"kg" },
    { key:"tb", label:"TB", type:"text", suffix:"cm" },
    { key:"nafsuMakan", label:"Nafsu makan", type:"radio", options:["Normal","Kurang","Berlebihan"] },
    { key:"frekMakan", label:"Frekuensi makan", type:"text", suffix:"/ hari" },
    { key:"jenisMakanan", label:"Jenis Makanan", type:"textarea" },
    { key:"jmlMinum", label:"Jumlah minum", type:"text", suffix:"cc" },
    { key:"jenisMinuman", label:"Jenis Minuman", type:"textarea" },
    { key:"keluhanNutrisi", label:"Keluhan", type:"radio", options:["Mual","Muntah","Sulit Menelan","Tidak ada"] },
  ]},

  { title: "Pola Aktifitas — Eliminasi", fields: [
    { key:"frekBak", label:"Frekuensi BAK", type:"text", suffix:"/ hari" },
    { key:"karBak", label:"Karakteristik BAK", type:"radio", options:["Lancar","Menetes","Retensi"] },
    { key:"frekBab", label:"Frekuensi BAB", type:"text", suffix:"/ hari" },
    { key:"karBab", label:"Karakteristik BAB", type:"radio", options:["Normal","Ada darah","Berlendir","Bau"] },
  ]},

  { title: "Pola Aktifitas — Istirahat Tidur", fields: [
    { key:"tidurSiang", label:"Tidur siang, lama", type:"text", suffix:"jam" },
    { key:"tidurMalam", label:"Tidur malam, lama", type:"text", suffix:"jam" },
    { key:"gangTidur", label:"Gangguan tidur", type:"radio", options:["Tidak","Ya"], allowCustom:true },
    { key:"hantarTidur", label:"Penghantar tidur", type:"radio", options:["Tidak","Ya"], allowCustom:true },
  ]},

  { title: "Pola Aktifitas — Personal Hygiene", fields: [
    { key:"frekMandi", label:"Frekuensi Mandi", type:"text", suffix:"/ hari" },
    { key:"bantuMandi", label:"Tingkat ketergantungan (Mandi)", type:"radio", options:["Tergantung","Dibantu","Mandiri"] },
    { key:"frekGosokGigi", label:"Frekuensi Gosok Gigi", type:"text", suffix:"/ hari" },
    { key:"bantuGosokGigi", label:"Tingkat ketergantungan (Gosok Gigi)", type:"radio", options:["Tergantung","Dibantu","Mandiri"] },
    { key:"frekCuciRambut", label:"Frekuensi cuci rambut", type:"text", suffix:"/ hari" },
    { key:"bantuCuciRambut", label:"Tingkat ketergantungan (Cuci Rambut)", type:"radio", options:["Tergantung","Dibantu","Mandiri"] },
    { key:"kuku", label:"Kebersihan kuku", type:"radio", options:["Pendek","Panjang","Bersih","Kotor"] },
  ]},

  // ===== DATA OBYEKTIF =====
  { title: "Data Obyektif", fields: [
    { key:"kesadaran", label:"Kesadaran", type:"radio", options:["Komposmentis","Apatis","Somnolen","Stupor","Koma"] },
    { key:"pupil", label:"Pupil", type:"radio", options:["Isokor","Anisokor"], allowCustom:true },
    { key:"pupilSize", label:"Ukuran Pupil", type:"text", suffix:"mm" },
    { key:"pergerakan", label:"Pergerakan", type:"radio", options:["Aktif","Lemah"] },
    { key:"kejang", label:"Kejang", type:"radio", options:["Tidak ada","Subtle","Tonik-klonik"] },
    { key:"tangis", label:"Tangis", type:"radio", options:["Kuat","Lemah","Melengking","Merintih","Tidak menangis"] },
  ]},

  // ===== TANDA-TANDA VITAL =====
  { title: "Tanda-Tanda Vital", fields: [
    { key:"suhu", label:"Suhu", type:"text", suffix:"°C" },
    { key:"metodeSuhu", label:"Metode pengukuran suhu", type:"radio", options:["Aksila","Rectal"] },
    { key:"td", label:"Tekanan darah", type:"text", suffix:"mmHg" },
    { key:"rr", label:"RR", type:"text", suffix:"/ menit" },
    { key:"keteraturan", label:"Keteraturan", type:"radio", options:["Teratur","Tidak teratur"] },
  ]},

  // ===== NYERI =====
  { title: "Pengkajian Nyeri", fields: [
    { key:"skalaNyeri", label:"Skala nyeri", type:"text" },
    { key:"lokasiNyeri", label:"Lokasi nyeri", type:"text" },
    { key:"karNyeri", label:"Karakteristik", type:"text" },
    { key:"lamaNyeri", label:"Lama diderita", type:"text" },
    { key:"kurangNyeri", label:"Berkurang dengan", type:"radio", options:["Istirahat","Kompres","Terapi"], allowCustom:true },
    { key:"dampakNyeri", label:"Dampak nyeri", type:"radio", options:["Tidak ada","Ada"], allowCustom:true },
  ]},

  // ===== HEAD TO TOE — Kulit =====
  { title: "Pemeriksaan Head to Toe — Kulit", fields: [
    { key:"kulitWarna", label:"Warna", type:"radio", options:["Merah terang","Pucat","Ikterik","Sianosis","Hiperpigmentasi"], allowCustom:true },
    { key:"kulitIntegritas", label:"Integritas", type:"radio", options:["Utuh","Kering","Rash","Bullae","Pustula"] },
    { key:"kulitAkral", label:"Akral", type:"radio", options:["Hangat","Kering","Dingin","Lembab","CRT"], allowCustom:true },
  ]},

  // ===== HEAD TO TOE — Kepala =====
  { title: "Pemeriksaan Head to Toe — Kepala", fields: [
    { key:"kepalaBentuk", label:"Kepala", type:"radio", options:["Normal","Hydrocepalus","Mikrocephalus"] },
    { key:"lingkarKepala", label:"Lingkar kepala", type:"text", suffix:"cm" },
    { key:"ubun", label:"Ubun-ubun besar", type:"radio", options:["Sudah menutup","Belum menutup","Datar","Cekung","Cembung"] },
    { key:"wajah", label:"Wajah", type:"radio", options:["Simetris","Asimetris"] },
    { key:"mata", label:"Mata", type:"radio", options:["Simetris","Ptosis","Exoptalmus"] },
    { key:"bolaMata", label:"Biji bola mata", type:"radio", options:["Ada","Tidak ada"] },
    { key:"sclera", label:"Sclera", type:"radio", options:["Normal","Ikterus","Hiperemis"] },
    { key:"konjungtiva", label:"Konjungtiva", type:"radio", options:["Normal","Konjungtivitas","Anemis"] },
    { key:"cowong", label:"Kelopak mata cowong", type:"radio", options:["Ya","Tidak"] },
    { key:"telinga", label:"Telinga", type:"radio", options:["Normal","Low seat ear"] },
    { key:"hidung", label:"Hidung", type:"radio", options:["Normal","Tidak"], allowCustom:true },
    { key:"mulut", label:"Mulut", type:"radio", options:["Normal","Palatoschisis","Labioschizis","Gnatoschizis"] },
    { key:"mukosa", label:"Mukosa bibir", type:"radio", options:["Lembab","Kering"] },
    { key:"lidah", label:"Lidah", type:"radio", options:["Bersih","Moniliasis","Kotor"] },
  ]},

  // ===== HEAD TO TOE — Leher & Dada =====
  { title: "Pemeriksaan Head to Toe — Leher & Dada", fields: [
    { key:"leher", label:"Leher", type:"radio", options:["Normal","Kaku kuduk","Tortikolis masa"] },
    { key:"dadaBentuk", label:"Dada bentuk", type:"radio", options:["Normal","Barrelchest","Pektus ekskavatum"] },
    { key:"retraksiDada", label:"Retraksi dada", type:"radio", options:["Tidak ada","Sternal","Intercostal"] },
    { key:"pergerakanDada", label:"Pergerakan dada", type:"radio", options:["Simetris","Asimetris"], allowCustom:true },
    { key:"polaNafas", label:"Pola nafas", type:"radio", options:["Teratur","Dispnea","Cheyne stokes"] },
    { key:"suaraNafas", label:"Suara nafas", type:"radio", options:["Bersih","Stridor","Wheezing"] },
    { key:"iramaJantung", label:"Irama jantung", type:"radio", options:["Teratur","Tidak teratur"] },
    { key:"bunyiJantung", label:"Bunyi jantung", type:"radio", options:["Normal (S1/S2 Tunggal)","Mur-mur","Gallop","Thrill"] },
  ]},

  // ===== HEAD TO TOE — Abdomen =====
  { title: "Pemeriksaan Head to Toe — Abdomen", fields: [
    { key:"abdBentuk", label:"Bentuk", type:"radio", options:["Normal","Tegang","Ascites","Lainnya"], allowCustom:true },
    { key:"abdTurgor", label:"Turgor", type:"radio", options:["Baik","Sedang","Jelek"] },
    { key:"abdHepar", label:"Pembesaran hepar", type:"radio", options:["Ada","Tidak ada"] },
    { key:"abdLien", label:"Pembesaran lien", type:"radio", options:["Ada","Tidak ada"] },
    { key:"abdPerkusi", label:"Perkusi", type:"radio", options:["Thympany","Hyperthympany","Dulnes","Lainnya"], allowCustom:true },
    { key:"abdPeristaltik", label:"Peristaltik usus", type:"text", suffix:"menit" },
  ]},

  // ===== HEAD TO TOE — Genetalia =====
  { title: "Pemeriksaan Head to Toe — Genetalia", fields: [
    { key:"genetaliaLaki", label:"Laki-laki", type:"radio", options:["Normal","Tegang","Ascites","Lainnya"], allowCustom:true },
    { key:"testis", label:"Testis", type:"radio", options:["Normal","Tidak normal"], allowCustom:true },
    { key:"genetaliaPr", label:"Perempuan", type:"radio", options:["Normal","Fistel"] },
    { key:"sekret", label:"Sekret", type:"radio", options:["Tidak","Ya","Bau"], allowCustom:true },
    { key:"sekretWarna", label:"Warna sekret", type:"text" },
  ]},

  // ===== HEAD TO TOE — Punggung, Rektum, Ekstremitas =====
  { title: "Pemeriksaan Head to Toe — Punggung & Ekstremitas", fields: [
    { key:"punggung", label:"Punggung dan rectum", type:"radio", options:["Normal","Lordsis","Kifosis","Skoliosis"] },
    { key:"rektum", label:"Rektum", type:"radio", options:["Normal","Fistel","Hemoroid","Atresia ani"] },
    { key:"ekstremitas", label:"Ekstremitas", type:"radio", options:["Normal","Fraktur","Kontraktur","Sindaktili","Polidaktili","Paralise","Oedema"] },
    { key:"luka", label:"Luka", type:"radio", options:["Tidak ada","Ada"], allowCustom:true },
    { key:"skalaNorton", label:"Skala Norton", type:"text" },
    { key:"kriteriaNorton", label:"Kriteria", type:"text" },
  ]},

  // ===== PENGKAJIAN FUNGSI — Sensorik =====
  { title: "Pengkajian Fungsi — Sensorik", fields: [
    { key:"penglihatan", label:"Penglihatan", type:"radio", options:["Normal","Kabur","Alat bantu"] },
    { key:"penciuman", label:"Penciuman", type:"radio", options:["Normal","Ada masalah"] },
    { key:"pendengaran", label:"Pendengaran", type:"radio", options:["Normal","Tuli"], allowCustom:true },
    { key:"kognitif", label:"Kognitif", type:"radio", options:["Orientasi penuh","Bingung","Lain-lain"], allowCustom:true },
  ]},

  // ===== PENGKAJIAN FUNGSI — Motorik =====
  { title: "Pengkajian Fungsi — Motorik", fields: [
    { key:"aktifitas", label:"Aktivitas sehari-hari", type:"radio", options:["Mandiri","Dibantu minimal","Ketergantungan total"] },
    { key:"berjalan", label:"Berjalan", type:"radio", options:["Tidak ada masalah","Sering jatuh","Lumpuh","Penggunaan alat bantu"] },
    { key:"risikoJatuh", label:"Risiko jatuh", type:"text" },
    { key:"skorJatuh", label:"Skor humpty dumpty", type:"text" },
    { key:"kategoriJatuh", label:"Kategori", type:"text" },
  ]},

  // ===== PSIKOSOSIAL =====
  { title: "Data Psikososial dan Spiritual", fields: [
    { key:"psikoOrtu", label:"Orang tua", type:"radio", options:["Tenang","Cemas","Marah"] },
    { key:"psikoAnak", label:"Anak", type:"radio", options:["Tenang","Cemas","Marah"] },
    { key:"orgDekat", label:"Orang yang paling dekat", type:"text" },
    { key:"mengertiPenyakit", label:"Apakah pasien mengerti tentang penyakitnya", type:"radio", options:["Ya","Tidak"] },
    { key:"nilaiBudaya", label:"Nilai-nilai budaya dan keyakinan", type:"text" },
  ]},

  // ===== PERTUMBUHAN =====
  { title: "Pertumbuhan dan Perkembangan", fields: [
    { key:"motorikHalus", label:"Motorik halus", type:"text" },
    { key:"motorikKasar", label:"Motorik kasar", type:"text" },
    { key:"perkembanganBahasa", label:"Perkembangan Bahasa", type:"text" },
    { key:"adaptasiSosial", label:"Adaptasi Sosial", type:"text" },
  ]},

  // ===== PENDIDIKAN =====
  { title: "Kebutuhan Pendidikan dan Komunikasi Orang Tua", fields: [
    { key:"pendidikanOrtu", label:"Pendidikan orang tua", type:"radio", options:["SD","SMP","SMA","PT/Akademi"] },
    { key:"bhsOrtu", label:"Bahasa", type:"radio", options:["Indonesia","Inggris","Daerah"], allowCustom:true },
    { key:"bacaTulis", label:"Kemampuan baca dan tulis", type:"radio", options:["Baik","Kurang","Tidak bisa"] },
    { key:"penerjemah", label:"Penerjemah", type:"radio", options:["Tidak","Ya"], allowCustom:true },
    { key:"caraBelajar", label:"Cara belajar yang disukai", type:"radio", options:["Diskusi","Demonstrasi","Audio Visual/Gambar","Membaca"] },
    { key:"hambatanBelajar", label:"Hambatan belajar", type:"radio", options:["Tidak","Ya"], allowCustom:true },
    { key:"infoDiperlukan", label:"Informasi yang diperlukan", type:"radio", options:["Nutrisi","Hygiene personal","Penggunaan alat medis","Manajemen nyeri","Proses penyakit","Terapi/obat","Rencana keperawatan","Lain-lain"], allowCustom:true },
  ]},
];

// Build default values from sections
export function buildDefaults(): Record<string,string> {
  const d: Record<string,string> = {};
  for (const s of assessmentSections) for (const f of s.fields) d[f.key] = "";
  return d;
}
