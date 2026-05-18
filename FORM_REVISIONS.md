# Initial Assesment

## Riwayat Imunisasi

On the previous implementation we use radio button to select between "BCG", "Hepatitis", "Polio", "DPT", "Campak", "Lain-lain". But the fact is user can be vaccinated with multiple types of vaccines, so we need to use checkbox instead of radio button.

## Riwayat Kehamilan dan Kelahiran

On the "Riwayat Kehamilan dan Kelahiran" fields group. The all fields inside it using required red marks. But actually it's not required to fill all of the fields, because each patient has different status. You should omit the red marks from the fields.

## Riwayat Penyakit Keluarga

You should remove the all of radio selection (Hipertensi, Hepatitis, Asma, TBC paru, DM, Lainnya) and then only keep the "Keterangan" text input. But also change it from standard input into textarea.

## Data Obyektif

On the "Data Obyektif" fields. We have two labels called "Pergerakan" and "Tangis" You should omit that from our UI because it's not neccassry. And then add a new textarea input field to replace those fields with label "GCS".

## Tanda-tanda Vital

On the "Tanda-tanda Vital" fields group, we have a field label called "Keteraturan" with radio button selection. Now please change that into label "Nadi" and text input with "... / menit" suffix label.

## Diagnosa Keperawatan

This is very good implementation. But please change the standard text input into textarea input for the "Diagnosis Keperawatan", "Etiologi", and "Prioritas" fields. And also, make those fields have a minimum height of 150px

## Rencana Keperawatan - Tujuan & Kriteria Evaluasi

This is very good implementation. But please change the standard text input into textarea input for the "DP", "Tujuan" and "Kriteria Evaluasi" fields. And also, make those fields have a minimum height of 150px

## Rencana Keperawatan - Intervensi & Edukasi

This is very good implementation. But please change the standard text input into textarea input for the "DP", "Mandiri", "Kolaborasi", and "Edukasi" fields. And also, make those fields have a minimum height of 150px
