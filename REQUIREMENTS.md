# Electronic Medical Record (EMR) for ST. VINCENTIUS A PAULO SURABAYA

## Overview

This is an EMR system for a hospital in Surabaya, Indonesia. The system is built using NextJS (typescript), TailwindCSS, and NoSQL (Mongo) for flexible structure of complex data such as clinical notes and reports. This application is for prototypes and proofs of concept only. But we should always follow professional software engineering practices and write clean, maintainable code. We should also write comprehensive documentation for the code. This application will only used by nurses. Every nurses can see all of the data and edit any data here. There are no another role like admin, doctor, patient, etc. This application will mainly used on the desktop screen because the nurses is forbidden to use their personal phone and computer to access this application.

## Tech Stack

- NextJS (typescript)
- NextJS API Routes
- Prisma
- TailwindCSS
- NoSQL (Mongo)

## Application Flow

### Phase 1: Authentication

1. The nurse will login into the system
2. They should input username and password

### Phase 2: Main Dashboard

The dashboard will show the list of all patients in the hospital. There is also "add new patient" button. If the nurse click the button, it will go to the patient registration page (patient identity). If the nurse click the patient list, it will go to the patient detail page (patent detail).

### Phase 3: Patient Identity

This page will opened when the nurse click "add new patient" button or click the patient list from the main dashboard.

If the nurse is adding a new patient, all the fields are empty. If the nurse is editing an existing patient, all the fields will be filled with the patient data.

I will give you the list of the fields on the specific section

### Phase 4: Patient Detail

This page will opened when the nurse click the patient list from the main dashboard.

This page has some menu, like: Edit patient identity, create patient initial assesment,
"Lihat CPPT" in Indonesian it like a progress report and the last is "Lihat hasil Lab"

#### Phase 4.1: Edit Patient Identity

This page will open the previous Phase 3 form with already filled data.

### Phase 4.2: Create Patient Initial Assesment

This page will open a form that focused on the patient's medical condition, the form will have so many sections and it very dynamic (that's why I need NoSQL to store the data). And also the data in this page is editable (overwritable).

### Phase 4.3: CPPT list

This page will show the list of all CPPT (progress report) of the patient. There is also "add new CPPT" button. If the nurse click the button, it will go to the create CPPT page (Phase 4.3.1). If the nurse click the CPPT list, it will go to the CPPT detail page (Phase 4.3.2).

Special for the CPPT we have 3 main phase per day: morning, evening, and night. So it will show a date input filter and the system will show the list of the CPPT for that day.

#### Phase 4.3.1: Create CPPT

This page will open a form that focused on the patient's medical condition, the form will have so many sections and it very dynamic (that's why I need NoSQL to store the data). And also the data in this page is editable (overwritable). The nurse should input a date, phase, and another fields (that i will give you on the specific section).

#### Phase 4.3.2: CPPT Detail

This page will open the previous Phase 4.3.1 form with already filled data.

### Phase 4.4: Lab Results

This page will show the list of all lab results of the patient. There is also "add new lab result" button. If the nurse click the button, it will go to the create lab result page (Phase 4.4.1). If the nurse click the lab result list, it will go to the lab result detail page (Phase 4.4.2).

#### Phase 4.4.1: Create Lab Result

This page will open a form that focused on the patient's lab results, the form will have so many sections and it very dynamic (that's why I need NoSQL to store the data). And also the data in this page is editable (overwritable). The nurse should input a date, and another fields (that i will give you on the specific section).

#### Phase 4.4.2: Lab Result Detail

This page will open the previous Phase 4.4.1 form with already filled data.

## User Interface

You should create a clean UI, modern, and responsive design. The application will be used by nurses on desktop screen, but it also accessible using tablet and mobile phone (although it's not recommended). You shouldn't create a monoton common sidebar layout. Let's try to be creative and make the UI interesting but has best user experience (UX) functional and easy to use.

Special for the initial assesment page, everything should be autosaved, so nurses will not loss their data on page refresh (becuase it has so long page data)

## Technical Note

Please use the best form handler for this NextJS application. Why? Because on the future, we will handle various type of dynamic fields, from checkbox, textfield, textarea, select, datagrid, etc. So we need the best form handler for this NextJS application. You also should return a good and consistent API response structure.

Because we will handle a huge data, remember to create a pagination system for the list pages.

You also needs to handles audit logs and store it on a collections, so everything is recorded on this system.

## Form Fields

You can see the form fields detail on `FORM_FIELDS.md` file.

## API Routes

The major API routes that I imagine is like this: (maybe you can change or adjust it later)

```
GET /api/patient (support pagination and search)
POST /api/patient
GET /api/patient/:id
PUT /api/patient/:id
DELETE /api/patient/:id

GET /api/patient/:id/initial-assesment
POST /api/patient/:id/initial-assesment (also update, overwrite)

GET /api/patient/:id/cppt (support pagination and search by date)
POST /api/patient/:id/cppt
GET /api/patient/:id/cppt/:cppt-id
PUT /api/patient/:id/cppt/:cppt-id
DELETE /api/patient/:id/cppt/:cppt-id

GET /api/patient/:id/lab-result (support pagination and search by date)
POST /api/patient/:id/lab-result
PUT /api/patient/:id/lab-result/:lab-result-id
GET /api/patient/:id/lab-result/:lab-result-id
DELETE /api/patient/:id/lab-result/:lab-result-id
```
