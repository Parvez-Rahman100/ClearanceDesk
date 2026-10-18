export type EnglishDelivery = {
  id: string;
  doDate: string;
  doNumber: string;
  deliveryDate: string;
  umbrella: number;
  proprietor: string;
  address: string;
  deliveryChallan: string;
  pcsTon: number | null;
  weightTon: number;
};

export type BanglaDelivery = {
  id: string;
  serialNumber: number;
  doNumber: string;
  customerName: string;
  address: string;
  quantityTon: number;
  deliveryDate: string;
};

export const initialEnglishDeliveries: EnglishDelivery[] = [
  { id: 'english-0772', doDate: '2026-10-12', doNumber: 'DO 0772', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Mollah Steel & Iron', address: 'Elenga', deliveryChallan: '87', pcsTon: 2.238, weightTon: 3.19 },
  { id: 'english-0699', doDate: '2026-10-05', doNumber: 'DO 0699', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Bhai Bhai Traders', address: 'Mymensingh', deliveryChallan: '88', pcsTon: 25.997, weightTon: 20.65 },
  { id: 'english-0768', doDate: '2026-10-12', doNumber: 'DO 0768', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Amina Traders', address: 'Elenga', deliveryChallan: '89', pcsTon: 0.183, weightTon: 0.175 },
  { id: 'english-0780', doDate: '2026-10-13', doNumber: 'DO 0780', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Amina Traders', address: 'Elenga', deliveryChallan: '89', pcsTon: 0.31, weightTon: 0.355 },
  { id: 'english-0798', doDate: '2026-10-15', doNumber: 'DO 0798', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Amina Traders', address: 'Elenga', deliveryChallan: '89', pcsTon: 0.868, weightTon: 0.83 },
  { id: 'english-0726', doDate: '2026-10-08', doNumber: 'DO 0726', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Khalil & Brothers', address: 'Bhairab', deliveryChallan: '90', pcsTon: 26.406, weightTon: 23.98 },
  { id: 'english-0746', doDate: '2026-10-11', doNumber: 'DO 0746', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Janani Enterprise', address: 'Trishal', deliveryChallan: '91', pcsTon: 10.136, weightTon: 7.725 },
  { id: 'english-0809', doDate: '2026-10-17', doNumber: 'DO 0809', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Habib Traders', address: 'Pouli', deliveryChallan: '92', pcsTon: null, weightTon: 6.865 },
  { id: 'english-0722', doDate: '2026-10-11', doNumber: 'DO 0722', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Zia Enterprise', address: "Cox's Bazar", deliveryChallan: '93', pcsTon: 22.149, weightTon: 14.82 },
  { id: 'english-0742', doDate: '2026-10-11', doNumber: 'DO 0742', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Zia Enterprise', address: "Cox's Bazar", deliveryChallan: '94', pcsTon: 18.373, weightTon: 15.065 },
  { id: 'english-0803', doDate: '2026-10-17', doNumber: 'DO 0803', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Maa Steel', address: 'Dhaka', deliveryChallan: '95', pcsTon: 0.593, weightTon: 0.6 },
  { id: 'english-0810', doDate: '2026-10-17', doNumber: 'DO 0810', deliveryDate: '2026-10-17', umbrella: 0, proprietor: 'Maa Steel', address: 'Dhaka', deliveryChallan: '95', pcsTon: null, weightTon: 17.865 },
];

export const initialBanglaDeliveries: BanglaDelivery[] = [
  { id: 'bangla-0772', serialNumber: 1, doNumber: 'DO ০৭৭২', customerName: 'মোল্লা স্টীল এন্ড আয়রন', address: 'এলেঙ্গা', quantityTon: 3.19, deliveryDate: '2026-10-17' },
  { id: 'bangla-0699', serialNumber: 2, doNumber: 'DO ০৬৯৯', customerName: 'ভাই ভাই ট্রেডার্স', address: 'ফুলবাড়িয়া, ময়মনসিংহ', quantityTon: 20.65, deliveryDate: '2026-10-17' },
  { id: 'bangla-0768', serialNumber: 3, doNumber: 'DO ০৭৬৮', customerName: 'আমিনা ট্রেডার্স', address: 'এলেঙ্গা', quantityTon: 0.175, deliveryDate: '2026-10-17' },
  { id: 'bangla-0780', serialNumber: 4, doNumber: 'DO ০৭৮০', customerName: 'আমিনা ট্রেডার্স', address: 'এলেঙ্গা', quantityTon: 0.355, deliveryDate: '2026-10-17' },
  { id: 'bangla-0798', serialNumber: 5, doNumber: 'DO ০৭৯৮', customerName: 'আমিনা ট্রেডার্স', address: 'এলেঙ্গা', quantityTon: 0.83, deliveryDate: '2026-10-17' },
  { id: 'bangla-0726', serialNumber: 6, doNumber: 'DO ০৭২৬', customerName: 'খলিল এন্ড ব্রাদার্স', address: 'ভৈরব', quantityTon: 23.98, deliveryDate: '2026-10-17' },
  { id: 'bangla-0746', serialNumber: 7, doNumber: 'DO ০৭৪৬', customerName: 'জননী এন্টারপ্রাইজ', address: 'ত্রিশাল, ময়মনসিংহ', quantityTon: 7.725, deliveryDate: '2026-10-17' },
  { id: 'bangla-0809', serialNumber: 8, doNumber: 'DO ০৮০৯', customerName: 'হাবিব ট্রেডার্স', address: 'পৌলী', quantityTon: 6.865, deliveryDate: '2026-10-17' },
  { id: 'bangla-0722', serialNumber: 9, doNumber: 'DO ০৭২২', customerName: 'জিয়া এন্টারপ্রাইজ', address: 'কক্সবাজার', quantityTon: 14.82, deliveryDate: '2026-10-17' },
  { id: 'bangla-0742', serialNumber: 10, doNumber: 'DO ০৭৪২', customerName: 'জিয়া এন্টারপ্রাইজ', address: 'কক্সবাজার', quantityTon: 15.065, deliveryDate: '2026-10-17' },
  { id: 'bangla-0803', serialNumber: 11, doNumber: 'DO ০৮০৩', customerName: 'মা স্টীল', address: 'ঢাকা', quantityTon: 0.6, deliveryDate: '2026-10-17' },
  { id: 'bangla-0810', serialNumber: 12, doNumber: 'DO ০৮১০', customerName: 'মা স্টীল', address: 'ঢাকা', quantityTon: 17.865, deliveryDate: '2026-10-17' },
];

function readSavedRows<T>(storageKey: string, initialRows: T[]): T[] {
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) as T[] : initialRows;
  } catch {
    return initialRows;
  }
}

export const readEnglishDeliveries = () => readSavedRows('clearancedesk.today-delivered.english.v1', initialEnglishDeliveries).map((row) => ({
  ...row,
  umbrella: row.umbrella ?? 0,
  doDate: row.id === 'english-0722' && row.doDate === '2026-10-17' ? '2026-10-11' : row.doDate,
}));
export const readBanglaDeliveries = () => readSavedRows('clearancedesk.today-delivered.bangla.v1', initialBanglaDeliveries);
