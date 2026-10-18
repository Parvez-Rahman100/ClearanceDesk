import type { ClearanceOrder } from './types';

const sourceRows: Array<Omit<ClearanceOrder, 'id'>> = [
  { deliveryDate: '2026-10-05', accountCode: 'C271', accountName: 'M/S BHAI BHAI TRADERS (FULBARIA, MYMENSING)', doNumber: 'DO 0699', pcsTn: 25.997, weight: 20578, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-06', accountCode: 'C271', accountName: 'M/S BHAI BHAI TRADERS (FULBARIA, MYMENSING)', doNumber: 'DO 0700', pcsTn: 28.997, weight: 20337, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-08', accountCode: 'C091', accountName: 'M/S AMINA TRADERS (ELENGA)', doNumber: 'DO 0720', pcsTn: 9.244, weight: 7828, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-08', accountCode: 'C091', accountName: 'M/S AMINA TRADERS (ELENGA)', doNumber: 'DO 0721', pcsTn: 10.381, weight: 8378, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C091', accountName: 'M/S AMINA TRADERS (ELENGA)', doNumber: 'DO 0733', pcsTn: 10, weight: 8642, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C271', accountName: 'M/S BHAI BHAI TRADERS (FULBARIA, MYMENSING)', doNumber: 'DO 0739', pcsTn: 23.989, weight: 20447, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C271', accountName: 'M/S BHAI BHAI TRADERS (FULBARIA, MYMENSING)', doNumber: 'DO 0740', pcsTn: 27.5, weight: 20452, status: 'BEFORE DELIVER CK BLNC' },
  { deliveryDate: '2026-10-12', accountCode: 'C102', accountName: 'M/S MOLLAH STEEL & IRON (ELENGA)', doNumber: 'DO 0754', pcsTn: 8, weight: 6836, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C102', accountName: 'M/S MOLLAH STEEL & IRON (ELENGA)', doNumber: 'DO 0772', pcsTn: 3.237, weight: 3244, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C091', accountName: 'M/S AMINA TRADERS (ELENGA)', doNumber: 'DO 0758', pcsTn: 25, weight: 20461, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C091', accountName: 'M/S AMINA TRADERS (ELENGA)', doNumber: 'DO 0763', pcsTn: 26, weight: 20187, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C091', accountName: 'M/S AMINA TRADERS (ELENGA)', doNumber: 'DO 0764', pcsTn: 10, weight: 8450, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C091', accountName: 'M/S AMINA TRADERS (ELENGA)', doNumber: 'DO 0765', pcsTn: 10, weight: 8454, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C091', accountName: 'M/S AMINA TRADERS (ELENGA)', doNumber: 'DO 0767', pcsTn: 10, weight: 7949, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C091', accountName: 'M/S AMINA TRADERS (ELENGA)', doNumber: 'DO 0768', pcsTn: 10.664, weight: 9234, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C271', accountName: 'M/S BHAI BHAI TRADERS (FULBARIA, MYMENSING)', doNumber: 'DO 0773', pcsTn: 13, weight: 4395, status: 'BEFORE DELIVER CK BLNC' },
  { deliveryDate: '2026-10-13', accountCode: 'C102', accountName: 'M/S MOLLAH STEEL & IRON (ELENGA)', doNumber: 'DO 0778', pcsTn: 8.695, weight: 7578, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-13', accountCode: 'C102', accountName: 'M/S MOLLAH STEEL & IRON (ELENGA)', doNumber: 'DO 0784', pcsTn: 6, weight: 4477, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-13', accountCode: 'C102', accountName: 'M/S MOLLAH STEEL & IRON (ELENGA)', doNumber: 'DO 0785', pcsTn: 6, weight: 5151, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-13', accountCode: 'C102', accountName: 'M/S MOLLAH STEEL & IRON (ELENGA)', doNumber: 'DO 0786', pcsTn: 2.924, weight: 2414, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-13', accountCode: 'C091', accountName: 'M/S AMINA TRADERS (ELENGA)', doNumber: 'DO 0780', pcsTn: 16.31, weight: 9212, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-14', accountCode: 'C275', accountName: 'M/S SANDWICH PANEL SOLUTION BD', doNumber: 'DO 0791', pcsTn: null, weight: 15600, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-06', accountCode: 'C018', accountName: 'M/S ANKITA TRADERS (BOGRA)', doNumber: 'DO 0707', pcsTn: 0.8, weight: 602, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-08', accountCode: 'C058', accountName: 'M/S ALAM TRADERS (KISHOREGONJ)', doNumber: 'DO 0723', pcsTn: 19.371, weight: 16484, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-08', accountCode: 'C015', accountName: "M/S ZIA ENTERPRISE (COX'S BAZAR)", doNumber: 'DO 0722', pcsTn: 22.149, weight: 14800, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-08', accountCode: 'C282', accountName: "M/S KHALIL & BROTHER'S (BHAIRAB BAZAR)", doNumber: 'DO 0726', pcsTn: 26.402, weight: 23756, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C130', accountName: 'M/S R.M TRADERS (NOAKHALI)', doNumber: 'DO 0749', pcsTn: 31.355, weight: 13671, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C043', accountName: 'M/S SARKAR TRADERS (SIRAJGANJ)', doNumber: 'DO 0745', pcsTn: 19.467, weight: 15723, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C015', accountName: "M/S ZIA ENTERPRISE (COX'S BAZAR)", doNumber: 'DO 0741', pcsTn: 19.308, weight: 14945, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C015', accountName: "M/S ZIA ENTERPRISE (COX'S BAZAR)", doNumber: 'DO 0742', pcsTn: 18.373, weight: 14977, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C015', accountName: "M/S ZIA ENTERPRISE (COX'S BAZAR)", doNumber: 'DO 0747', pcsTn: 17.583, weight: 14835, status: 'BEFORE DELIVER CK BLNC' },
  { deliveryDate: '2026-10-11', accountCode: 'C052', accountName: 'M/S S.S TRADING (LALMONIRHAT)', doNumber: 'DO 0743', pcsTn: 16.258, weight: 14340, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C052', accountName: 'M/S S.S TRADING (LALMONIRHAT)', doNumber: 'DO 0744', pcsTn: 17.779, weight: 15840, status: 'BEFORE DELIVER CK BLNC' },
  { deliveryDate: '2026-10-11', accountCode: 'C071', accountName: 'M/S JANATA ENTERPRIS (SHERPUR)', doNumber: 'DO 0737', pcsTn: 31.929, weight: 22559, status: 'BEFORE DELIVER CK BLNC' },
  { deliveryDate: '2026-10-11', accountCode: 'C083', accountName: 'M/S R. K TRADING (JAMALPUR)', doNumber: 'DO 0750', pcsTn: 0.81, weight: 785, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C096', accountName: 'M/S JANANI ENTERPRISE (TRISHAL)', doNumber: 'DO 0746', pcsTn: 10.136, weight: 7987, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C113', accountName: 'M/S BHAI BHAI TRADERS-3 (KOCHUA, CHANDPUR)', doNumber: 'DO 0752', pcsTn: 7, weight: 4697, status: 'BEFORE DELIVER CK BLNC' },
  { deliveryDate: '2026-10-11', accountCode: 'C119', accountName: 'M/S KALAM SHOWDAGOR & SONS (NOAKHALI)', doNumber: 'DO 0748', pcsTn: 4.633, weight: 7319, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C131', accountName: 'M/S RUPALI TRADERS (NOAKHALI)', doNumber: 'DO 0753', pcsTn: 33.335, weight: 16162, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-11', accountCode: 'C236', accountName: 'M/S MAHFUZ ENTERPRISE (CHANDINA, COMILLA)', doNumber: 'DO 0748', pcsTn: 20.995, weight: 14875, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C005', accountName: 'M/S AMANAT TRADERS (COMILLA)', doNumber: 'DO 0775', pcsTn: 15.29, weight: 12244, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C219', accountName: 'M/S LITTON & BROTHERS (COMILLA)', doNumber: 'DO 0755', pcsTn: 27, weight: 14936, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C219', accountName: 'M/S LITTON & BROTHERS (COMILLA)', doNumber: 'DO 0756', pcsTn: 17.402, weight: 14660, status: 'BEFORE DELIVER CK BLNC' },
  { deliveryDate: '2026-10-12', accountCode: 'C219', accountName: 'M/S LITTON & BROTHERS (COMILLA)', doNumber: 'DO 0757', pcsTn: 17.339, weight: 14927, status: 'BEFORE DELIVER CK BLNC' },
  { deliveryDate: '2026-10-12', accountCode: 'C067', accountName: 'M/S FATEMA TRADERS (NETROKONA)', doNumber: 'DO 0760', pcsTn: 17.744, weight: 14640, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C007', accountName: 'M/S SAHABUDDIN TRADERS (FENI)', doNumber: 'DO 0771', pcsTn: 10, weight: 3195, status: 'BEFORE DELIVER CK BLNC' },
  { deliveryDate: '2026-10-12', accountCode: 'C047', accountName: 'M/S ANONNA TRADERS (DEBIGANJ)', doNumber: 'DO 0774', pcsTn: 8.445, weight: 7073, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C114', accountName: 'M/S BISMILLAH TRADERS (FENI)', doNumber: 'DO 0769', pcsTn: 4.918, weight: 2713, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C118', accountName: 'M/S ISLAMIA TRADERS, KACHUA, CHANDPUR', doNumber: 'DO 0773', pcsTn: 6.076, weight: 4649, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C122', accountName: 'M/S MINAH ENTERPRISE (CHITTAGONG)', doNumber: 'DO 0762', pcsTn: 17, weight: 14361, status: 'BEFORE DELIVER CK BLNC' },
  { deliveryDate: '2026-10-12', accountCode: 'C183', accountName: 'M/S FAHIM TRADING (FARIDPUR SADAR)', doNumber: 'DO 0761', pcsTn: 7.122, weight: 5262, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C220', accountName: 'M/S SIKANDOR ALI & SONS (SYLHET)', doNumber: 'DO 0765', pcsTn: 25, weight: 21974, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-12', accountCode: 'C257', accountName: 'M/S TALHA ENTERPRISE (BELKUCHI, SIRAJGANJ)', doNumber: 'DO 0777', pcsTn: 5.506, weight: 4824, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-13', accountCode: 'C005', accountName: 'M/S AMANAT TRADERS (COMILLA)', doNumber: 'DO 0782', pcsTn: 1.921, weight: 1549, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-13', accountCode: 'C224', accountName: 'M/S HERO & BROTHERS (B. BARIA)', doNumber: 'DO 0779', pcsTn: 17.454, weight: 14550, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-13', accountCode: 'C067', accountName: 'M/S FATEMA TRADERS (NETROKONA)', doNumber: 'DO 0781', pcsTn: 0.198, weight: 194, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-13', accountCode: 'C288', accountName: 'M/S SONIA TRADERS (RAYPURA, NORSINGDI)', doNumber: 'DO 0783', pcsTn: 7.792, weight: 6696, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-13', accountCode: 'C288', accountName: 'M/S SONIA TRADERS (RAYPURA, NORSINGDI)', doNumber: 'DO 0789', pcsTn: 18.437, weight: 17947, status: 'OK FOR DELIVERY' },
  { deliveryDate: '2026-10-13', accountCode: 'C015', accountName: "M/S ZIA ENTERPRISE (COX'S BAZAR)", doNumber: 'DO 0792', pcsTn: 16.409, weight: 14848, status: 'BEFORE DELIVER CK BLNC' },
];

export const seedOrders: ClearanceOrder[] = sourceRows.map((row, index) => ({ ...row, id: `delivery-${String(index + 1).padStart(3, '0')}` }));

export const deliveryCsvHeaders = ['DATE', 'ACCOUNT CODE', 'ACCOUNT NAME', 'INV / DO NO', 'Sum of PCS TN', 'Sum of WEIGHT', 'STATUS'] as const;

function parseCsvRows(contents: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let insideQuotes = false;
  let afterQuote = false;

  function finishRow() {
    row.push(field);
    if (row.some((value) => value.trim() !== '')) rows.push(row);
    row = [];
    field = '';
    afterQuote = false;
  }

  for (let index = 0; index < contents.length; index += 1) {
    const character = contents[index];
    if (insideQuotes) {
      if (character === '"' && contents[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        insideQuotes = false;
        afterQuote = true;
      } else {
        field += character;
      }
      continue;
    }

    if (afterQuote) {
      if (character === ',') {
        row.push(field);
        field = '';
        afterQuote = false;
      } else if (character === '\n' || character === '\r') {
        finishRow();
        if (character === '\r' && contents[index + 1] === '\n') index += 1;
      } else {
        throw new Error(`Unexpected character after a quoted value near row ${rows.length + 1}.`);
      }
    } else if (character === '"') {
      if (field.length > 0) throw new Error(`Unexpected quote near row ${rows.length + 1}.`);
      insideQuotes = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      finishRow();
      if (character === '\r' && contents[index + 1] === '\n') index += 1;
    } else {
      field += character;
    }
  }

  if (insideQuotes) throw new Error('CSV contains an unclosed quoted value.');
  if (field.length > 0 || row.length > 0 || afterQuote) finishRow();
  return rows;
}

export function parseDeliveryCsv(contents: string): ClearanceOrder[] {
  const rows = parseCsvRows(contents.replace(/^\uFEFF/, ''));
  if (rows.length < 2) throw new Error('CSV must include the required header and at least one delivery row.');

  const header = rows[0].map((value) => value.trim().toUpperCase());
  if (header.length !== deliveryCsvHeaders.length || deliveryCsvHeaders.some((value, index) => header[index] !== value.toUpperCase())) {
    throw new Error(`CSV headers must be: ${deliveryCsvHeaders.join(', ')}.`);
  }

  return rows.slice(1).map((values, index) => {
    const rowNumber = index + 2;
    if (values.length !== deliveryCsvHeaders.length) throw new Error(`Row ${rowNumber} must contain exactly ${deliveryCsvHeaders.length} columns.`);

    const [dateText, accountCode, accountName, doNumber, pcsText, weightText, statusText] = values.map((value) => value.trim());
    let deliveryDate = dateText;
    const dayFirstDate = /^(\d{2})-(\d{2})-(\d{2}|\d{4})$/.exec(dateText);
    if (dayFirstDate) {
      const [, day, month, yearText] = dayFirstDate;
      const year = yearText.length === 2 ? `20${yearText}` : yearText;
      deliveryDate = `${year}-${month}-${day}`;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
      throw new Error(`Row ${rowNumber}: DATE must use YYYY-MM-DD or DD-MM-YY format.`);
    }
    const parsedDate = new Date(`${deliveryDate}T00:00:00Z`);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== deliveryDate) {
      throw new Error(`Row ${rowNumber}: DATE is not a valid calendar date.`);
    }
    if (!accountCode || !accountName || !doNumber) throw new Error(`Row ${rowNumber}: ACCOUNT CODE, ACCOUNT NAME, and INV / DO NO are required.`);

    const pcsTn = pcsText === '' || pcsText === '-' ? null : Number(pcsText);
    if (pcsTn !== null && (!Number.isFinite(pcsTn) || pcsTn < 0)) throw new Error(`Row ${rowNumber}: Sum of PCS TN must be a non-negative number or "-".`);
    if (!weightText || !Number.isFinite(Number(weightText)) || Number(weightText) < 0) {
      throw new Error(`Row ${rowNumber}: Sum of WEIGHT must be a non-negative number.`);
    }

    const normalizedStatus = statusText.toUpperCase();
    if (normalizedStatus !== 'OK FOR DELIVERY' && normalizedStatus !== 'BEFORE DELIVER CK BLNC') {
      throw new Error(`Row ${rowNumber}: STATUS must be OK FOR DELIVERY or BEFORE DELIVER CK BLNC.`);
    }

    return {
      id: `delivery-${crypto.randomUUID()}`,
      deliveryDate,
      accountCode: accountCode.toUpperCase(),
      accountName,
      doNumber: doNumber.toUpperCase(),
      pcsTn,
      weight: Number(weightText),
      status: normalizedStatus,
    };
  });
}

export function readSavedOrders(): ClearanceOrder[] {
  try {
    const saved = window.localStorage.getItem('order-clearance-tracker.deliveries.v2');
    return saved ? JSON.parse(saved) as ClearanceOrder[] : seedOrders;
  } catch {
    return seedOrders;
  }
}
