# Order Clearance Tracker

Clearance Desk tracks delivery records by date, account, DO number, PCS TN, weight, and delivery status. It is preloaded with 59 rows transcribed from the two supplied photos and works locally without a backend.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Local changes are saved in this browser's local storage. The dashboard totals the visible delivery rows. The first photo reconciles to its printed subtotal (291.938 PCS TN, 240,304 weight); the second photo's visible rows total 558.736 PCS TN and 425,599 weight, while its printed subtotal is 572.487 and 428,638. That second-sheet difference is flagged for source review rather than filled with guessed data. Use `npm run build` to create a production build and `npm run preview` to serve it locally.

## Optional Firebase sync

Copy `.env.example` to `.env.local` and enter a Firebase Web App's API key, auth domain, project ID, and app ID. The app reads and writes documents in the Firestore `deliveries` collection. Configure Firestore security rules for your users before enabling cloud sync; the client configuration is not an access-control mechanism. Without these values, the app stays in local-only mode.

## Included workflows

- Search by account name, account code, or DO number; filter by delivery status.
- Select a date in the delivery header to show that day's deliveries; clear the date to see all dates again.
- Add and edit delivery records with the same columns as the source sheets; new records cannot reuse an existing DO number.
- Export the current delivery view as CSV, or import CSV files using the exported column order: DATE, ACCOUNT CODE, ACCOUNT NAME, INV / DO NO, Sum of PCS TN, Sum of WEIGHT, STATUS. Dates may use YYYY-MM-DD or DD-MM-YY; imports are validated for duplicate DO numbers before they are added.
