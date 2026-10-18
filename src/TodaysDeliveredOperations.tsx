import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { toBlob } from 'html-to-image';
import { CalendarDays, Download, Plus, X } from 'lucide-react';
import { readBanglaDeliveries, readEnglishDeliveries, type BanglaDelivery, type EnglishDelivery } from './todays-delivered-data';

type Section = 'english' | 'bangla';

const displayDate = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

const displayBanglaDate = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const dateToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

function formatTon(value: number | null) {
  return value === null ? '-' : value.toFixed(3);
}

function normalizeDoNumber(value: string) {
  return toWesternDigits(value)
    .replace(/ডি\s*ও/gu, 'DO').replace(/\s+/g, '').toUpperCase();
}

function toWesternDigits(value: string) {
  return value.replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)));
}

function displayBanglaDoNumber(value: string) {
  return value.replace(/^DO\s*/i, 'ডি ও ').replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);
}

function formatBanglaQuantity(value: number) {
  return value.toLocaleString('bn-BD', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function TodaysDeliveredOperations({ onSectionChange }: { onSectionChange: (isBangla: boolean) => void }) {
  const [section, setSection] = useState<Section>('english');
  const [selectedDate, setSelectedDate] = useState('2026-10-17');
  const [englishRows, setEnglishRows] = useState(readEnglishDeliveries);
  const [banglaRows, setBanglaRows] = useState(readBanglaDeliveries);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const exportSheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('clearancedesk.today-delivered.english.v1', JSON.stringify(englishRows));
      setStorageError(null);
    } catch {
      setStorageError('Could not save English deliveries on this device.');
    }
  }, [englishRows]);

  useEffect(() => {
    try {
      window.localStorage.setItem('clearancedesk.today-delivered.bangla.v1', JSON.stringify(banglaRows));
      setStorageError(null);
    } catch {
      setStorageError('Could not save Bangla deliveries on this device.');
    }
  }, [banglaRows]);

  const selectedEnglishRows = useMemo(
    () => englishRows.filter((row) => row.deliveryDate === selectedDate),
    [englishRows, selectedDate],
  );
  const selectedBanglaRows = useMemo(
    () => banglaRows.filter((row) => row.deliveryDate === selectedDate),
    [banglaRows, selectedDate],
  );
  const englishWeight = selectedEnglishRows.reduce((total, row) => total + row.weightTon, 0);
  const englishPcs = selectedEnglishRows.reduce((total, row) => total + (row.pcsTon ?? 0), 0);
  const banglaQuantity = selectedBanglaRows.reduce((total, row) => total + row.quantityTon, 0);
  const activeCount = section === 'english' ? selectedEnglishRows.length : selectedBanglaRows.length;
  const isBangla = section === 'bangla';
  const sectionDate = isBangla ? displayBanglaDate(selectedDate) : displayDate(selectedDate);

  useEffect(() => {
    onSectionChange(isBangla);
  }, [isBangla, onSectionChange]);

  function addEnglishDelivery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const doNumber = String(form.get('doNumber')).trim().toUpperCase();
    if (englishRows.some((row) => normalizeDoNumber(row.doNumber) === normalizeDoNumber(doNumber))) {
      setFormError(`${doNumber} already exists in English deliveries.`);
      return;
    }
    const pcsValue = String(form.get('pcsTon')).trim();
    const row: EnglishDelivery = {
      id: `english-${crypto.randomUUID()}`,
      doDate: String(form.get('doDate')),
      doNumber,
      deliveryDate: String(form.get('deliveryDate')),
      umbrella: Number(form.get('umbrella')),
      proprietor: String(form.get('proprietor')).trim(),
      address: String(form.get('address')).trim(),
      deliveryChallan: String(form.get('deliveryChallan')).trim(),
      pcsTon: pcsValue ? Number(pcsValue) : null,
      weightTon: Number(form.get('weightTon')),
    };
    setEnglishRows((current) => [...current, row]);
    setSelectedDate(row.deliveryDate);
    setShowAddForm(false);
    setFormError(null);
  }

  function addBanglaDelivery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const doNumber = String(form.get('doNumber')).trim();
    if (banglaRows.some((row) => normalizeDoNumber(row.doNumber) === normalizeDoNumber(doNumber))) {
      setFormError(`${doNumber} নম্বরটি বাংলা ডেলিভারি তালিকায় আগে থেকেই আছে।`);
      return;
    }
    const quantityText = toWesternDigits(String(form.get('quantityTon')).trim());
    const quantityTon = Number(quantityText);
    if (!quantityText || !Number.isFinite(quantityTon) || quantityTon < 0) {
      setFormError('পরিমাণ শূন্য বা তার বেশি সংখ্যা হতে হবে।');
      return;
    }
    const row: BanglaDelivery = {
      id: `bangla-${crypto.randomUUID()}`,
      serialNumber: banglaRows.reduce((maximum, item) => Math.max(maximum, item.serialNumber), 0) + 1,
      doNumber,
      customerName: String(form.get('customerName')).trim(),
      address: String(form.get('address')).trim(),
      quantityTon,
      deliveryDate: String(form.get('deliveryDate')),
    };
    setBanglaRows((current) => [...current, row]);
    setSelectedDate(row.deliveryDate);
    setShowAddForm(false);
    setFormError(null);
  }

  async function exportBanglaImage() {
    const exportSheet = exportSheetRef.current;
    if (!exportSheet) {
      setExportError('ছবি তৈরি করা যায়নি।');
      return;
    }

    setIsExporting(true);
    setExportError(null);
    let imageUrl: string | null = null;
    try {
      await document.fonts.ready;
      const previousStyle = exportSheet.getAttribute('style');
      let imageBlob: Blob | null;
      exportSheet.style.position = 'fixed';
      exportSheet.style.left = '0px';
      exportSheet.style.top = '0px';
      exportSheet.style.zIndex = '999999';
      exportSheet.style.opacity = '0';
      exportSheet.style.pointerEvents = 'none';
      try {
        imageBlob = await toBlob(exportSheet, {
          backgroundColor: '#ffffff',
          cacheBust: true,
          pixelRatio: 2,
          style: { opacity: '1' },
        });
      } finally {
        if (previousStyle === null) exportSheet.removeAttribute('style');
        else exportSheet.setAttribute('style', previousStyle);
      }

      if (!imageBlob) {
        throw new Error('PNG image generation returned no data');
      }

      imageUrl = URL.createObjectURL(imageBlob);
      const preview = new Image();
      preview.src = imageUrl;
      await preview.decode();
      const canvas = document.createElement('canvas');
      canvas.width = preview.naturalWidth;
      canvas.height = preview.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not validate generated PNG');
      }
      context.drawImage(preview, 0, 0);
      const border = context.getImageData(4, 4, 1, 1).data;
      if (border[2] < 200 || border[0] > 120 || border[1] > 150) {
        throw new Error('Generated PNG is blank or missing the blue frame');
      }

      const download = document.createElement('a');
      download.download = `bangla-delivery-${selectedDate}.png`;
      download.href = imageUrl;
      document.body.appendChild(download);
      try {
        download.click();
      } finally {
        download.remove();
      }
      window.setTimeout(() => {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
      }, 1000);
    } catch (error) {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      console.error('Failed to export Bangla delivery image', error);
      setExportError('ছবি ডাউনলোড করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <>
      <div className={`page-content delivered-operations-page ${isBangla ? 'bangla-language' : ''}`} lang={isBangla ? 'bn' : 'en'}>
        <section className="page-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" />{isBangla ? 'আজকের ডেলিভারি কার্যক্রম' : "TODAY'S DELIVERED OPERATIONS"}</div>
            <h1>{isBangla ? 'আজকের ডেলিভারি কার্যক্রম' : "Today's Delivered Operations"}</h1>
            <p className="page-subtitle">{isBangla ? 'নির্বাচিত তারিখের বাংলা ডেলিভারি তালিকা।' : 'English and Bangla delivery sheets, kept separate.'}</p>
          </div>
          <div className="hero-actions">
            <label className="date-filter"><CalendarDays size={16} /><span className="sr-only">{isBangla ? 'ডেলিভারির তারিখ নির্বাচন করুন' : 'Select delivery date'}</span><input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} aria-label={isBangla ? 'ডেলিভারির তারিখ নির্বাচন করুন' : 'Select delivery date'} /></label>
            {isBangla && <button className="button button-secondary" disabled={isExporting} onClick={() => void exportBanglaImage()}><Download size={16} />{isExporting ? 'ছবি তৈরি হচ্ছে…' : 'ছবি ডাউনলোড'}</button>}
            <button className="button button-primary" onClick={() => { setFormError(null); setShowAddForm(true); }}><Plus size={17} />{isBangla ? 'ডেলিভারি যোগ করুন' : 'Add English delivery'}</button>
          </div>
        </section>
        {isBangla && exportError && <p className="workspace-form-error" role="alert">{exportError}</p>}

        <section className="metrics-grid" aria-label={isBangla ? 'নির্বাচিত ডেলিভারির হিসাব' : 'Selected delivery totals'}>
          <article className="metric metric-open"><div className="metric-top"><span>{section === 'english' ? 'English deliveries' : 'বাংলা ডেলিভারি'}</span><span className="metric-icon"><CalendarDays size={17} /></span></div><div className="metric-value">{isBangla ? activeCount.toLocaleString('bn-BD') : activeCount}</div><div className="metric-foot"><span className="metric-marker marker-green" />{sectionDate}</div></article>
          {section === 'english'
            ? <><article className="metric"><div className="metric-top"><span>Sum of PCS TN</span></div><div className="metric-value">{englishPcs.toFixed(3)}</div><div className="metric-foot">Across English deliveries</div></article><article className="metric"><div className="metric-top"><span>Sum of weight ton</span></div><div className="metric-value">{englishWeight.toFixed(3)}</div><div className="metric-foot">Across English deliveries</div></article></>
            : <><article className="metric"><div className="metric-top"><span>মোট পরিমাণ (মেঃ টন)</span></div><div className="metric-value">{formatBanglaQuantity(banglaQuantity)}</div><div className="metric-foot">নির্বাচিত দিনের মোট ডেলিভারি</div></article><article className="metric"><div className="metric-top"><span>ডেলিভারির তারিখ</span></div><div className="metric-value metric-date-value">{sectionDate}</div><div className="metric-foot">নির্বাচিত দিনের বাংলা ডেলিভারি</div></article></>}
        </section>

        <section className="orders-panel">
          <div className="panel-heading">
            <div><div className="panel-title-row"><h2>{section === 'english' ? 'English delivery' : 'বাংলা ডেলিভারি'}</h2><span className="result-count">{isBangla ? activeCount.toLocaleString('bn-BD') : activeCount}</span></div><p>{section === 'english' ? 'Sales delivery records' : 'বাংলা ডেলিভারি রেকর্ড'} · {sectionDate}</p></div>
          </div>
          <div className="table-toolbar"><div className="filter-tabs" role="tablist" aria-label={isBangla ? 'ডেলিভারির ভাষা' : 'Delivery language'}>
            <button role="tab" aria-selected={section === 'english'} className={`filter-tab ${section === 'english' ? 'selected' : ''}`} onClick={() => setSection('english')}>{isBangla ? 'ইংরেজি ডেলিভারি' : 'English delivery'}</button>
            <button role="tab" aria-selected={section === 'bangla'} className={`filter-tab ${section === 'bangla' ? 'selected' : ''}`} onClick={() => setSection('bangla')}>বাংলা ডেলিভারি</button>
          </div><button className="button button-quiet" onClick={() => { setFormError(null); setShowAddForm(true); }}><Plus size={15} />{isBangla ? 'বাংলা ডেলিভারি যোগ করুন' : 'Add to English'}</button></div>

          {section === 'english' ? <div className="table-scroll"><table><thead><tr><th>UMBRELLA</th><th>DO DATE</th><th>DO NO</th><th>DELIVERY DATE</th><th>NAME OF PROPRIETOR</th><th>ADDRESS</th><th>DELIVERY CHALLAN</th><th>PCS TON</th><th>WEIGHT TON</th></tr></thead><tbody>
            {selectedEnglishRows.map((row) => <tr key={row.id}><td>{row.umbrella}</td><td>{displayDate(row.doDate)}</td><td><strong>{row.doNumber}</strong></td><td>{displayDate(row.deliveryDate)}</td><td>{row.proprietor}</td><td>{row.address}</td><td>{row.deliveryChallan}</td><td className="numeric-cell">{formatTon(row.pcsTon)}</td><td className="numeric-cell">{formatTon(row.weightTon)}</td></tr>)}
          </tbody></table>{selectedEnglishRows.length === 0 && <div className="empty-state"><strong>No English deliveries for this date</strong><span>Choose another date or add an English delivery.</span></div>}</div>
            : <div className="table-scroll"><table className="bangla-delivery-table" lang="bn"><thead><tr><th>ক্রমিক নং</th><th>ডি ও নং</th><th>ক্রেতার নাম</th><th>ঠিকানা</th><th>পরিমাণ মেঃ টন</th></tr></thead><tbody>
              {selectedBanglaRows.map((row) => <tr key={row.id}><td>{row.serialNumber.toLocaleString('bn-BD')}</td><td><strong>{displayBanglaDoNumber(row.doNumber)}</strong></td><td>{row.customerName}</td><td>{row.address}</td><td className="numeric-cell">{formatBanglaQuantity(row.quantityTon)}</td></tr>)}
            </tbody></table>{selectedBanglaRows.length === 0 && <div className="empty-state"><strong>এই তারিখে কোনো বাংলা ডেলিভারি নেই</strong><span>অন্য তারিখ নির্বাচন করুন অথবা বাংলা ডেলিভারি যোগ করুন।</span></div>}</div>}
          <div className="table-footer"><span>{section === 'english' ? 'English delivery records' : 'বাংলা ডেলিভারি রেকর্ড'}: <strong>{isBangla ? activeCount.toLocaleString('bn-BD') : activeCount}</strong></span><span>{isBangla ? storageError ? 'এই ডিভাইসে সংরক্ষণ করা যায়নি।' : 'এই ডিভাইসে সংরক্ষিত' : storageError ?? 'Saved on this device'}</span></div>
        </section>
        <footer className="page-footer"><span>{isBangla ? 'ক্লিয়ারেন্স ডেস্ক | আজকের ডেলিভারি কার্যক্রম' : "Clearance Desk | Today's Delivered Operations"}</span><span>{isBangla ? 'বাংলা ডেলিভারি তালিকা' : 'English and Bangla registers are stored separately'}</span></footer>
      </div>

      {isBangla && <section className="bangla-export-sheet" ref={exportSheetRef} lang="bn" aria-hidden="true">
        <header className="bangla-export-header">
          <img src="/alif-steel-logo.svg" alt="" />
          <div className="bangla-export-heading">
            <h2>আলিফ স্টীল মিলস লিঃ</h2>
            <p>ডেলিভারী বা বিক্রয় : {new Intl.DateTimeFormat('bn-BD', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${selectedDate}T12:00:00`))} ইং</p>
          </div>
        </header>
        <table className="bangla-export-table">
          <colgroup><col /><col /><col /><col /><col /></colgroup>
          <thead><tr><th>ক্রমিক নং</th><th>ডি ও নং</th><th>ক্রেতার নাম</th><th>ঠিকানা</th><th>পরিমাণ মেঃ টন</th></tr></thead>
          <tbody>{selectedBanglaRows.map((row) => <tr key={row.id}>
            <td>{row.serialNumber.toLocaleString('bn-BD')}</td>
            <td>{displayBanglaDoNumber(row.doNumber)}</td>
            <td>{row.customerName}</td>
            <td>{row.address}</td>
            <td>{formatBanglaQuantity(row.quantityTon)}</td>
          </tr>)}</tbody>
          <tfoot><tr><td colSpan={3}></td><th>মোট</th><td>{formatBanglaQuantity(banglaQuantity)}</td></tr></tfoot>
        </table>
      </section>}

      {showAddForm && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAddForm(false); }}><form className="order-dialog" onSubmit={section === 'english' ? addEnglishDelivery : addBanglaDelivery}>
        <div className="dialog-header"><div><span className="eyebrow">{section === 'english' ? 'ENGLISH DELIVERY' : 'বাংলা ডেলিভারি'}</span><h2>{section === 'english' ? 'Add English delivery' : 'বাংলা ডেলিভারি যোগ করুন'}</h2><p>{section === 'english' ? 'Enter the delivery details.' : 'ডেলিভারির তথ্য লিখুন।'}</p></div><button type="button" className="icon-button" onClick={() => setShowAddForm(false)} aria-label={isBangla ? 'ফর্ম বন্ধ করুন' : 'Close form'}><X size={19} /></button></div>
        {section === 'english'
          ? <div className="form-grid"><label className="field">Umbrella<input name="umbrella" required min="0" step="1" type="number" defaultValue="0" /></label><label className="field">DO date<input name="doDate" required type="date" defaultValue={selectedDate} /></label><label className="field">Delivery date<input name="deliveryDate" required type="date" defaultValue={selectedDate || dateToday()} /></label><label className="field">DO no<input name="doNumber" required placeholder="DO 0811" /></label><label className="field">Delivery challan<input name="deliveryChallan" required /></label><label className="field field-wide">Name of proprietor<input name="proprietor" required /></label><label className="field field-wide">Address<input name="address" required /></label><label className="field">PCS ton<input name="pcsTon" min="0" step="0.001" type="number" /></label><label className="field">Weight ton<input name="weightTon" required min="0" step="0.001" type="number" /></label></div>
          : <div className="form-grid" lang="bn"><label className="field">ডেলিভারির তারিখ<input name="deliveryDate" required type="date" defaultValue={selectedDate || dateToday()} lang="bn" /></label><label className="field">ডি ও নং<input name="doNumber" required placeholder="ডি ও ০৮১১" /></label><label className="field field-wide">ক্রেতার নাম<input name="customerName" required /></label><label className="field field-wide">ঠিকানা<input name="address" required /></label><label className="field">পরিমাণ মেঃ টন<input name="quantityTon" required inputMode="decimal" /></label></div>}
        {formError && <p className="workspace-form-error" role="alert">{formError}</p>}
        <div className="dialog-footer"><span>{section === 'english' ? <><span className="required-mark">*</span> Required fields</> : <><span className="required-mark">*</span> আবশ্যক তথ্য</>}</span><div><button className="button button-secondary" type="button" onClick={() => setShowAddForm(false)}>{isBangla ? 'বাতিল' : 'Cancel'}</button><button className="button button-primary" type="submit"><Plus size={16} />{section === 'english' ? 'Add delivery' : 'ডেলিভারি যোগ করুন'}</button></div></div>
      </form></div>}
    </>
  );
}

export default TodaysDeliveredOperations;
