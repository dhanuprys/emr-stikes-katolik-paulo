## Form Fields

This section will contain the list of all data fields for each page.

All of these fields without `(opsional)` suffix should be has red `*` (required) marker.

### Patient Identity

#### Rekam Medik Rawat Inap (Ringkasan Masuk-Keluar Pasien Rawat Inap)

field -> No Reg MRS: text
field -> No. RM: text
field -> Paviliun: text
field -> Kelas: text

field -> Nama: text
field -> Alamat: textarea
field -> Kota: text
field -> Provinsi: text
field -> Kota: text
field -> No. Telp: text
field -> Asal Pasien: text
field -> Biaya: text
field -> Tanggal masuk: datetime
field -> Tanggal keluar: datetime (opsional)
field -> Tanggal meninggal: datetime (opsional)

field -> Tanggal lahir: date
field -> Gender: radio {L | P}
field -> Umur: text
field -> Bangsa: text
field -> Agama: text
field -> Pendidikan: text
field -> Pekerjaan: text
field -> Status pernikahan (opsional): text
field -> Nama suami/istri (opsional): text
field -> Nama ayah: text
field -> Nama ibu: text
field -> No. RM Ibu: text
field -> Pekerjaan: text
field -> Asal MRS: radio {Poli | IGD | Praktek | Admission}

field -> Dokter I: text
field -> Dokter II: text (opsional)
field -> Dokter III: text (opsional)
field -> Dokter IV: text (opsional)

field -> Diagnosa Masuk: textarea
field -> Jenis kasus: radio {bedah | penyakit dalam}

**Dalam keadaan darurat perlu menghubungi**
field -> Nama: text
field -> Alamat: textarea
field -> Telepon: text
field -> Hubungan: text

field -> Diagnosa Keluar: textarea
field -> Diagnosa Utama: textarea
field -> Diagnosa Tambahan (opsional): textarea
field -> Diagnosa Komplikasi (opsional): textarea

field -> Penyebab Trauma (opsional): textarea
field -> Operasi/Tindakan I: textarea (opsional)
field -> Operasi/Tindakan II: textarea (opsional)

field -> Hasil Perawatan (opsional): radio {Sembuh | Membaik | Tidak Membaik | Tanpa Pengobatan | Hanya Tindakan Diagnosis | Meninggal < 48 jam MRS | Meninggal > 48 jam MRS}
field -> Cara Keluar (opsional): radio {Diijinkan pulang | Dirujuk ke RS Lain | Atas kemauan sendiri | Melarikan diri}

### Initial Assesment

#### RESUME (RINGKASAN PERAWATAN PASIEN PULANG)

field -> Tanggal dan waktu: datetime

field -> Anamesa: textarea
field -> Riwayat Penyakit Dahulu: textarea
field -> Riwayat Penyakit Sekarang: textarea

**Pemeriksaan MRS**
field -> Fisik: textarea
field -> Laboratorium: textarea
field -> Radiologi: textarea
field -> Lain-lain: textarea (opsional)

field -> Diagnosa Masuk: textarea
field -> Diagnosa Akhir: textarea
field -> Tanggal Masuk: datetime
field -> Tanggal Keluar/Meninggal (opsional): datetime
field -> Indikasi MRS: textarea
field -> Masalah yang dihadapi: textarea
field -> Konsultasi: textarea
field -> Pengobatan: textarea
field -> Pembedahan/Tindakan: textarea
field -> Perjalanan Penyakit: textarea
field -> Keadaan/hasil pengobatan waktu KRS: textarea
field -> Prognosis: textarea
field -> Instruksi/Tindak Lanjut: textarea

#### BAGIAN I: ASESMEN AWAL MEDIS

**SUBYEKTIF: ANAMNESA**
field -> Keluhan Utama: textarea
field -> Keluhan Penyerta: textarea
field -> Riwayat Penyakit Dahulu: textarea
field -> Riwayat Penyakit Keluarga: textarea
**Riwayat Alergi**
field -> Makanan/minuman: textarea
field -> Obat: textarea
field -> Lain-lain: textarea

**OBYEKTIF: PEMERIKSAAN FISIK**
field -> Status Generalis: textarea
field -> Status Lokalis: textarea

field -> Pemeriksaan Penunjang: textarea
field -> Diagnosa Kerja: textarea
field -> Diagnosa Banding: textarea
field -> Rencana Pelayanan: textarea

field -> Nama DPJP Utama: text
field -> Tanggal dan waktu pengkajian: datetime

#### ASESMEN KEPERAWATAN

field -> Tanggal Asesmen: datetime
field -> Informasi dari: radio {pasien | orang tua | keluarga | orang lain}
field -> Nama pemberi informasi: text
field -> Hubungan pemberi informasi: text
field -> Asal Masuk: radio {IGD | IRJA | Rujukan | Praktek Pribadi}
field -> Cara masuk: radio {di gendong, incubator transfer, kereta dorong, lain-lain [can input text]}

[GROUP]

field -> Keluhan Utama: textarea
field -> Riwayat Penyakit Sekarang: textarea
field -> Riwayat Penyakit Dahulu: textarea
field -> Pernah dirawat: radio {Tidak | ya, kapan [can input text]}
field -> Riwayat pembedahan/pembiusan: radio {tidak | ya, kapan [can input text]}
field -> Masalah dalam operasi/pembiusan: radio {tidak | ya, sebutkan [can input text]}
field -> Riwayat transfusi darah: radio {Tidak | ya, kapan [can input text]}
field -> Obat dari rumah: radio {Tidak | Ada [can input text]}
field -> Riwayat imunisasi: radio{BCG | Hepatitis | Polio | DPT | Campak | Lain-lain [can input]}
field -> Riwayat penyakit keluarga: radio{Hipertensi | Hepatitis | Asma | TBC paru | DM | Lainnya [can input]}
field -> Riwayat kehamilan dan kelahiran:
field -> Usia Kehamilan: text
field -> Anak ke: text
field -> Riwayat penyakit selama kehamilan: radio{tidak ada | hipertensi | asma | toxoplasma | DM | jantung | thypoid | TBC | Lain-lain [can input]}
field -> Komplikasi saat persalinan: radio{tidak adsa, kejang, pendarahan, lain-lain [can input]}
field -> Tempat kelahiran: radio{Rumah sakit, Puskesmas, BPM, lain-lain [can input]}
field -> Jenis persalinan: radio{Spontan, Sectio C, Vaccum eks, Forcep eks., Alasan tindakan [can input]}
field -> Ditolong oleh: radio{dokter, bidan}
field -> Keadaan saat lahir: radio{segera menangis, menangis saat beberapa saat, tidak menangis}
field -> BBL: text [suffix label: "gr"]
field -> PBL: text [suffix label: "cm"]

[/GROUP]

// from this to bottom is optional (without marker)

[GROUP:POLA AKTIFITAS SEHARI-HARI]
**Nutrisi**
field -> BB: text [suffix label: "kg"]
field -> TB: text [suffix label: "cm"]
field -> Nafsu makan: radio {Normal | Kurang | Berlebihan}

**Pola Makan**
field -> Frekuensi: text [suffix label: "/ hari"]
field -> Jenis Makanan: textarea

**Pola Minum**
field -> Jumlah: text [suffix label: "cc"]
field -> Jenis Minuman: textarea

field -> Keluhan: radio {Mual | Muntah | Sulit Menelan | Tidak ada}

**Eliminasi**

field -> Frekuensi BAK: text [suffix label: "/ hari"]
field -> Karakteristik BAK: radio {Lancar | Menetes | Retensi}

field -> Frekuensi BAB: text [suffix label: "/ hari"]
field -> Karakteristik BAB: radio {Normal | Ada darah | Berlendir | Bau}

**Istirahat Tidur**
field -> Tidur siang, lama: text [suffix label: "jam"]
field -> Tidur malam, lama: text [suffix label: "jam"]
field -> Gangguan tidur: radio {Tidak | ya, sebutkan [can input text]}
field -> Penghantar tidur: radio {Tidak | ya, sebutkan [can input text]}

**Personal Hygiene**
field -> Frekuensi Mandi: text [suffix label: "/ hari"]
field -> Tingkat ketergantungan: radio {Tergantung | dibantu | mandiri}

field -> Frekuensi Gosok Gigi: text [suffix label: "/ hari"]
field -> Tingkat ketergantungan: radio {Tergantung | dibantu | mandiri}

field -> Frekuensi cuci rambut: text [suffix label: "/ hari"]
field -> Tingkat ketergantungan: radio {Tergantung | dibantu | mandiri}

field -> Kebersihan kuku: radio {Pendek | Panjang | Bersih | Kotor}

[/GROUP]

[GROUP:DATA OBYEKTIF]

field -> Kesadaran: radio {Komposmentis | Apatis | Somnolen | Stupor | Koma}
field -> Pupil: radio {Isokor | Anisokor} [add input for size with label "mm"]
field -> Pergerakan: radio {Aktif | Lemah}
field -> Kejang: radio {Tidak ada | Subtle | Tonik-klonik}
field -> Tangis: radio {Kuat | Lemah | Melengking | Merintih | Tidak menangis}

[/GROUP]

[GROUP: TANDA-TANDA VITAL]

field -> Suhu: text [suffix label: "C"]
field -> Metode pengukuran suhu: radio {Aksila | Rectal}
field -> Tekanan darah: text [suffix label: "mmHg"]
field -> RR: text [suffix label: "/ menit"]
field -> Keteraturan: radio {Teratur | Tidak teratur}

[/GROUP]

[GROUP]

field -> Skala nyeri: text
field -> Lokasi nyeri: text
field -> Karakteristik: text
field -> Lama diderita: text
field -> Berkurang dengan: radio{istirahat | kompres | terapi [can input]}
field -> Dampak nyeri: radio{Tidak ada | ada, sebutkan [can input]}

[/GROUP]

[GROUP: Pemeriksaan Head to Toe]

**Kulit**
field -> Warna: radio{Merah terang | Pucat | Ikterik, kremer... [can input] | Sianosis | hiperpigmentasi}
field -> Integritas: radio{Utuh | Kering | Rash | Bullae | Pustula}
field -> Akral: radio{Hangat | Kering | Dingin | Lembab | CRT (can input (... detik))}

**Kepala**
field -> Kepala: radio {Normal | Hydrocepalus | Mikrocephalus}
field -> Lingkar kepala: text [suffix label: "cm"]
field -> Ubun-ubun besar: radio {sudah menutup | belum menutup | Datar | Cekung | Cembung}
field -> Wajah: radio{simetris | asimetris}
field -> Mata: radio {Simetris | Ptosis | Exoptalmus}
field -> Biji bola mata: radio {ada | tidak ada}
field -> Sclera: radio {Normal | Ikterus | Hiperemis}
field -> Konjungtiva: radio {Normal | Konjungtivitas | Anemis}
field -> Kelopak mata cowong: radio {ya | tidak}
field -> Telinga: radio {normal | low seat ear}
field -> Hidung: radio {normal | tidak, sebutkan [can input]}
field -> Mulut: radio {normal | palatoschisis | labioschizis| gnatoschizis}
field -> Mukos bibir: radio {Lembab | kering}
field -> Lidah: radio {Bersih | Moniliasis | kotor}

field -> Leher: radio {Normal | kaku kuduk | tortikolis masa}
field -> Dada bentuk: radio {normal | barrelchect | pektus ekskavatum}
field -> Retraksi dada: radio {tidak ada | sternal | intercostal}
field -> Pergerakkan dada: radio {simetris | asimetris jelaskan [can input]}
field -> Pola nafas: radio {teratur | dispnea | cheyne stokes}
field -> Suara nafas: radio {bersih | stridor | wheezing}
field -> Irama jantung: radio {teratur | tidak teratur}
field -> Bunyi jantung: radio {Normal (S1/S2 Tunggal) | Mur-mur | Gallop | Thrill}

**Abdomen**
field -> Bentuk: radio {Normal | Tegang | Ascites | Lainnya [can input]}
field -> Turgor: radio {Baik | Sedang | Jelek}
field -> Pembesaran hepar: radio {Ada | tidak ada}
field -> Pembesaran lien: radio {Ada | Tidak ada}
field -> Perkusi: radio {Thympany | Hyperthympany | Dulnes | Lainnya [can input]}
field -> Peristaltic usus: text [suffix label: "menit"]

**Genetalia**
field -> Laki-laki: radio {Normal, Tegang, Ascites, Lainnya (can input)}
field -> Testis: radio {Normal, tidak normal sebutkan [can input]}
field -> Perempuan: radio {Normal, fistel}
field -> Sekret: radio {Tidak, Ya sebutkan [can input], bau}
field -> Warna sekret: text

field -> Punggung dan rectum: radio {Punggung | Normal | Lordsis | Kifosis | Skoliosis}
field -> Rektum: radio: {Normal | Fistel | Hemoroid | Atresia ani}

**Ekstremitas**
field -> Ekstremitas: radio {Normal | fraktur | kontraktur | sindaktili | polidaktili | Paralise | Oedema}
field -> Luka: radio {tidak ada | ada, sebutkan [can input]}
field -> Skala Norton: text
field -> Kriteria: text

[/GROUP]

[GROUP: Pengkajian fungsi]

**Sensorik**
field -> Penglihatan: radio {Normal | kabur | alat bantu}
field -> Penciuman: radio {Normal | ada masalah}
field -> Pendengaran: radio {Normal | tuli , sebutkan [can input]}
field -> Kognitif: radio {Orientasi penuh | bingung | lain-lain [can input]}

**Motorik**
field -> Aktivitas sehari-sehari: radio{Mandiri | Dibantu minimal | Ketergantungan total}
field -> Berjalan: radio {Tidak ada masalah | sering jatuh | lumpuh | penggunaan alat bantu}

field -> Risiko jatuh: text
field -> Skor humpty dumpty: text
field -> Kategori: text

**Data psikososial dan spiritual orang tua dan anak**
field -> Orang tua: radio {Tenang | cemas | marah}
field -> Anak: radio {Tenang | Cemas | Marah}
field -> Orang yang paling dekat: text
field -> Apakah pasien mengerti tentang penyakitnya: radio {Ya | tidak}
field -> Nilai-nilai budaya dan keyakinan: text

**Pertumbuhan dan Perkembangan**
field -> Motorik halus: text
field -> Motorik kasar: text
field -> Perkembangan Bahasa: text
field -> Adaptasi Sosial: text

**Kebutuhan Pendidikan dan Komunikais Orang Tua**
field -> Pendidikan orang tua: radio {SD | SMP | SMA | PT/Akademi}
field -> Bahasa: radio {Indonesia | Inggris | Daerah sebutkan [can input]}
field -> Kemampuan baca dan tulis: radio {Baik | Kurang | Tidak bisa}
field -> Penerjemah: radio {Tidak | ya sebutkan (can input)}
field -> Cara belajar yang disukai: radio {Diskusi | Demonstrasi | Audio Visual/Gambar | Membaca}
field -> Hambatan belajar: radio {Tidak | ya sebutkan [can input]}
field -> Informasi yang diperlukan: radio {Nutrisi | Hygiene personal | Penggunaan alat medis | Manajemen nyeri | Proses penyakit | Terapi/obat | Rencana keperawatan | Lain-lain [can input]}
[/GROUP]

[GROUP: Diagnosa Keperawatan (Sesuai Prioritas Masalah Pasien)]

// This section is a flexible add or remove list

List[]{
-- field -> Diagnosis Keperawatan: text
-- field -> Etiologi: text
-- field -> Prioritas: text
}

List[]{
-- field -> DP: text
-- field -> Tujuan: text
-- field -> Kriteria Evaluasi: text
}

List[]{
-- field -> DP: text
-- field -> Mandiri: text
-- field -> Kolaborasi: text
-- field -> Edukasi: checkbox {Rencana keperawatan | proses penyakit | terapi/obat | penggunaan alat medis | manajemen nyeri | lain-lain [can input]}
}|

---

### CPPT

field -> Tanggal: date
field -> Waktu: choose {Pagi, Siang, Malam}

field -> Subjektif: textarea
field -> Objektif: textarea
field -> Assesment: textarea
field -> Planning: textara

### Lab Result

field -> Tanggal: date
field -> Dokumem: a list of files [pdf, png, jpeg, jpg]
