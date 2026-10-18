import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowDownToLine, ArrowUpRight, BadgeCheck, CalendarDays, Check, ChevronDown, CircleAlert, FileUp, LayoutDashboard, Plus, Search, Trash2, X } from 'lucide-react';
import { deliveryCsvHeaders, parseDeliveryCsv, readSavedOrders } from './data';
import type { ClearanceOrder, ClearanceStatus } from './types';

type ActivityType = 'Added' | 'Updated' | 'Imported';
type DeliveryActivity = { orderId: string; action: ActivityType; date: string; timestamp: number };
type Filter = 'All deliveries' | "Today's Update" | ClearanceStatus;
const filters: Filter[] = ['All deliveries', "Today's Update", 'OK FOR DELIVERY', 'BEFORE DELIVER CK BLNC'];
const pageSizeOptions = [10, 25, 50, 100];
const firebaseEnabled = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_APP_ID);
const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
const formatDate = (date: string) => {
  const parsed = new Date(`${date}T12:00:00`);
  return `${parsed.getDate()}-${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(parsed)}-${parsed.getFullYear()}`;
};
const formatPcs = (value: number | null) => value === null ? '-' : value.toFixed(3);
const formatWeight = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
const statusClass = (status: ClearanceStatus) => `status status-${status.toLowerCase().replaceAll(' ', '-')}`;
const getLocalDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function readSavedActivities(): DeliveryActivity[] {
  try {
    const saved = window.localStorage.getItem('order-clearance-tracker.activity.v1');
    return saved ? JSON.parse(saved) as DeliveryActivity[] : [];
  } catch {
    return [];
  }
}

function createDoNumber(orders: ClearanceOrder[]) {
  const highest = orders.reduce((value, order) => Math.max(value, Number(order.doNumber.match(/\d+$/)?.[0] ?? 0)), 699);
  return `DO ${String(highest + 1).padStart(4, '0')}`;
}

function normalizeDoNumber(doNumber: string) {
  return doNumber.replace(/\s+/g, '').toUpperCase();
}

function App() {
  const [orders, setOrders] = useState<ClearanceOrder[]>(readSavedOrders);
  const [activities, setActivities] = useState<DeliveryActivity[]>(readSavedActivities);
  const [filter, setFilter] = useState<Filter>('All deliveries');
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState('');
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ClearanceOrder | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);
  const [syncLabel, setSyncLabel] = useState(firebaseEnabled ? 'Connecting' : 'Saved on this device');

  useEffect(() => {
    if (!firebaseEnabled) return;
    import('./firebase').then(({ loadRemoteOrders }) => loadRemoteOrders()).then((remoteOrders) => {
      if (remoteOrders?.length) setOrders(remoteOrders);
      setSyncLabel('Cloud connected');
    }).catch(() => setSyncLabel('Saved on this device'));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('order-clearance-tracker.deliveries.v2', JSON.stringify(orders));
    } catch {
      setSyncLabel('Session only');
    }
  }, [orders]);

  useEffect(() => {
    try {
      window.localStorage.setItem('order-clearance-tracker.activity.v1', JSON.stringify(activities));
    } catch {
      setSyncLabel('Session only');
    }
  }, [activities]);

  useEffect(() => {
    if (!notification) return;
    const timeout = window.setTimeout(() => setNotification(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, pageSize, query, selectedDeliveryDate]);

  const todayKey = getLocalDateKey();
  const activityByOrder = useMemo(() => new Map(activities.map((activity) => [activity.orderId, activity])), [activities]);
  const todayActivityByOrder = useMemo(
    () => new Map(activities.filter((activity) => activity.date === todayKey).map((activity) => [activity.orderId, activity])),
    [activities, todayKey],
  );
  const selectedOrder = orders.find((order) => order.id === selectedId) ?? null;
  const visibleOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = filter === 'All deliveries'
        || (filter === "Today's Update" ? todayActivityByOrder.has(order.id) : order.status === filter);
      const matchesDate = !selectedDeliveryDate || order.deliveryDate === selectedDeliveryDate;
      const matchesQuery = !normalizedQuery || [order.doNumber, order.accountCode, order.accountName]
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesFilter && matchesDate && matchesQuery;
    }).sort((left, right) => filter === "Today's Update"
      ? (todayActivityByOrder.get(right.id)?.timestamp ?? 0) - (todayActivityByOrder.get(left.id)?.timestamp ?? 0)
      : 0);
  }, [filter, orders, query, selectedDeliveryDate, todayActivityByOrder]);

  const pageCount = Math.max(1, Math.ceil(visibleOrders.length / pageSize));
  const pageStart = visibleOrders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, visibleOrders.length);
  const paginatedOrders = visibleOrders.slice(pageStart - 1, pageEnd);
  const pageNumbers: Array<number | 'ellipsis-start' | 'ellipsis-end'> = pageCount <= 7
    ? Array.from({ length: pageCount }, (_, index) => index + 1)
    : currentPage <= 4
      ? [1, 2, 3, 4, 5, 'ellipsis-end', pageCount]
      : currentPage >= pageCount - 3
        ? [1, 'ellipsis-start', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
        : [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', pageCount];

  useEffect(() => {
    if (currentPage > pageCount) setCurrentPage(pageCount);
  }, [currentPage, pageCount]);

  const pcsTotal = orders.reduce((sum, order) => sum + (order.pcsTn ?? 0), 0);
  const weightTotal = orders.reduce((sum, order) => sum + order.weight, 0);
  const balanceCheckCount = orders.filter((order) => order.status === 'BEFORE DELIVER CK BLNC').length;
  const todayActivityCount = orders.filter((order) => todayActivityByOrder.has(order.id)).length;

  function saveOrder(order: ClearanceOrder): string | null {
    const originalOrder = orders.find((item) => item.id === order.id);
    const doNumberChanged = !originalOrder || normalizeDoNumber(originalOrder.doNumber) !== normalizeDoNumber(order.doNumber);
    const duplicate = doNumberChanged
      ? orders.find((item) => item.id !== order.id && normalizeDoNumber(item.doNumber) === normalizeDoNumber(order.doNumber))
      : undefined;
    if (duplicate) return `${order.doNumber} already exists. Each DO number must be unique.`;

    const timestamp = Date.now();
    const action: ActivityType = originalOrder ? 'Updated' : 'Added';
    setOrders((current) => current.some((item) => item.id === order.id)
      ? current.map((item) => item.id === order.id ? order : item)
      : [...current, order]);
    setActivities((current) => [
      ...current.filter((activity) => activity.orderId !== order.id),
      { orderId: order.id, action, date: getLocalDateKey(new Date(timestamp)), timestamp },
    ]);
    if (firebaseEnabled) import('./firebase').then(({ saveRemoteOrder }) => saveRemoteOrder(order)).then(() => setSyncLabel('Cloud connected')).catch(() => setSyncLabel('Saved on this device'));
    setShowDialog(false);
    setEditingOrder(null);
    return null;
  }

  async function deleteOrder(order: ClearanceOrder) {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      if (firebaseEnabled) {
        const { deleteRemoteOrder } = await import('./firebase');
        await deleteRemoteOrder(order.id);
        setSyncLabel('Cloud connected');
      }
      setOrders((current) => current.filter((item) => item.id !== order.id));
      setActivities((current) => current.filter((activity) => activity.orderId !== order.id));
      setSelectedId(null);
      setConfirmDelete(false);
      setNotification({ message: `${order.doNumber} deleted`, type: 'success' });
    } catch (error) {
      console.error('Failed to delete delivery record', error);
      setDeleteError(`Could not delete ${order.doNumber}. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  }

  function exportOrders() {
    const rows = [
      deliveryCsvHeaders,
      ...visibleOrders.map((order) => [order.deliveryDate, order.accountCode, order.accountName, order.doNumber, order.pcsTn ?? '-', order.weight, order.status]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'delivery-clearance.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function importCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setNotification({ message: 'Only .csv files can be uploaded.', type: 'error' });
      return;
    }

    setIsImporting(true);
    try {
      const importedOrders = parseDeliveryCsv(await file.text());
      const seenDoNumbers = new Set<string>();
      for (const order of importedOrders) {
        const normalizedDoNumber = normalizeDoNumber(order.doNumber);
        const existingOrder = orders.find((item) => normalizeDoNumber(item.doNumber) === normalizedDoNumber);
        if (existingOrder) throw new Error(`${order.doNumber} already exists. No rows were imported.`);
        if (seenDoNumbers.has(normalizedDoNumber)) throw new Error(`${order.doNumber} appears more than once in the CSV. No rows were imported.`);
        seenDoNumbers.add(normalizedDoNumber);
      }
      const timestamp = Date.now();
      setOrders((current) => [...current, ...importedOrders]);
      setActivities((current) => [
        ...current.filter((activity) => !importedOrders.some((order) => order.id === activity.orderId)),
        ...importedOrders.map((order) => ({ orderId: order.id, action: 'Imported' as const, date: getLocalDateKey(new Date(timestamp)), timestamp })),
      ]);
      setFilter('All deliveries');
      setSelectedDeliveryDate('');
      setQuery('');
      setCurrentPage(1);
      setNotification({ message: `${importedOrders.length} deliveries imported`, type: 'success' });

      if (firebaseEnabled) {
        try {
          const { saveRemoteOrder } = await import('./firebase');
          await Promise.all(importedOrders.map((order) => saveRemoteOrder(order)));
          setSyncLabel('Cloud connected');
        } catch (error) {
          console.error('Failed to sync imported delivery records', error);
          setSyncLabel('Saved on this device');
          setNotification({ message: 'Deliveries imported locally, but cloud sync failed.', type: 'error' });
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not read this CSV file.';
      setNotification({ message, type: 'error' });
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard" aria-label="Clearance Desk home"><span className="brand-mark"><BadgeCheck size={20} /></span><span className="brand-name">Clearance<span>Desk</span></span></a>
        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switcher"><span className="workspace-avatar">D</span><span>Delivery operations</span><ChevronDown size={15} /></button>
        <nav className="primary-nav" aria-label="Delivery navigation">
          <div className="nav-heading">DELIVERIES</div>
          <button className={`nav-link ${filter === 'All deliveries' ? 'active' : ''}`} onClick={() => setFilter('All deliveries')}><LayoutDashboard size={17} />All records</button>
          <button className={`nav-link ${filter === 'BEFORE DELIVER CK BLNC' ? 'active' : ''}`} onClick={() => setFilter('BEFORE DELIVER CK BLNC')}><CircleAlert size={17} />Balance check<span className="nav-count">{balanceCheckCount}</span></button>
          <button className={`nav-link ${filter === 'OK FOR DELIVERY' ? 'active' : ''}`} onClick={() => setFilter('OK FOR DELIVERY')}><BadgeCheck size={17} />OK for delivery</button>
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-rule" /><div className="sync-note"><span className="sync-dot" />{syncLabel}</div><div className="profile-row"><div className="profile-avatar">DO</div><div><strong>Delivery register</strong><span>October 2026</span></div><ChevronDown size={15} /></div></div>
      </aside>

      <main className="main-area" id="dashboard">
        <header className="topbar"><div className="company-brand"><img className="company-logo" src="/alif-steel-logo.svg" alt="" /><div className="company-copy"><strong>Alif Steel Mills Limited</strong><span>Delivery clearance</span></div></div><div className="topbar-right"><span className="today-label"><CalendarDays size={15} />{todayLabel}</span><span className="avatar-small">DO</span></div></header>
        <div className="page-content">
          <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" />DELIVERY OPERATIONS</div><h1>Delivery clearance</h1><p className="page-subtitle">Dispatch records and balance-check status, October 2026.</p></div><div className="hero-actions"><label className="date-filter"><CalendarDays size={16} /><span className="sr-only">Show deliveries for date</span><input type="date" value={selectedDeliveryDate} onChange={(event) => setSelectedDeliveryDate(event.target.value)} aria-label="Show deliveries for date" />{selectedDeliveryDate && <button type="button" className="clear-date" onClick={() => setSelectedDeliveryDate('')} aria-label="Clear date filter"><X size={14} /></button>}</label><button className="button button-primary" onClick={() => { setEditingOrder(null); setShowDialog(true); }}><Plus size={17} />Add delivery</button></div></section>

          <section className="metrics-grid" aria-label="Delivery totals">
            <article className="metric metric-open"><div className="metric-top"><span>Delivery records</span><span className="metric-icon"><LayoutDashboard size={17} /></span></div><div className="metric-value">{orders.length}</div><div className="metric-foot"><span className="metric-marker marker-orange" />{balanceCheckCount} before balance check</div></article>
            <article className="metric"><div className="metric-top"><span>Sum of PCS TN</span><span className="metric-icon"><BadgeCheck size={17} /></span></div><div className="metric-value">{pcsTotal.toFixed(3)}</div><div className="metric-foot"><span className="metric-marker marker-green" />Across all delivery records</div></article>
            <article className="metric"><div className="metric-top"><span>Sum of weight</span><span className="metric-icon"><ArrowDownToLine size={17} /></span></div><div className="metric-value">{formatWeight(weightTotal)}</div><div className="metric-foot"><span className="metric-marker marker-blue" />Across all delivery records</div></article>
          </section>

          <section className="orders-panel">
            <div className="panel-heading"><div><div className="panel-title-row"><h2>Delivery register</h2><span className="result-count">{visibleOrders.length}</span></div><p>{selectedDeliveryDate ? `Deliveries for ${formatDate(selectedDeliveryDate)}.` : 'Photo records transcribed for October 2026.'}</p></div><div className="panel-actions"><input ref={importInput} className="sr-only" type="file" accept=".csv,text/csv" aria-label="Choose CSV file to import" onChange={importCsv} /><button className="button button-quiet" disabled={isImporting} onClick={() => importInput.current?.click()}><FileUp size={16} />{isImporting ? 'Importing…' : 'Import CSV'}</button><button className="button button-quiet" onClick={exportOrders}><ArrowDownToLine size={16} />Export CSV</button></div></div>
            <div className="table-toolbar"><div className="filter-tabs" role="tablist" aria-label="Filter deliveries">{filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={`filter-tab ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)}>{item === 'All deliveries' ? item : item === "Today's Update" ? item : item === 'OK FOR DELIVERY' ? 'OK for delivery' : 'Balance check'}{item === "Today's Update" && <span className="tab-count">{todayActivityCount}</span>}{item === 'BEFORE DELIVER CK BLNC' && <span className="tab-count">{balanceCheckCount}</span>}</button>)}</div><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search account or DO no." aria-label="Search deliveries" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}</label></div>
            <div className="entries-toolbar"><label htmlFor="page-size">Show <select id="page-size" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>{pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}</select> entries</label></div>
            <div className="table-scroll"><table><thead><tr><th>DATE</th><th>ACCOUNT NAME</th><th>INV / DO NO</th><th>PCS TN</th><th>WEIGHT</th><th>STATUS</th><th><span className="sr-only">Open delivery details</span></th></tr></thead><tbody>
              {paginatedOrders.map((order) => <tr key={order.id}>
                <td><span className="delivery-date">{formatDate(order.deliveryDate)}</span></td>
                <td><div className="customer-cell"><strong>{order.accountCode}. {order.accountName}</strong></div></td>
                <td><button className="order-reference" onClick={() => setSelectedId(order.id)}><strong>{order.doNumber}</strong>{activityByOrder.get(order.id)?.date === todayKey && <span className="activity-label">{activityByOrder.get(order.id)?.action} today</span>}</button></td>
                <td className="numeric-cell">{formatPcs(order.pcsTn)}</td>
                <td className="numeric-cell weight-cell">{formatWeight(order.weight)}</td>
                <td><span className={statusClass(order.status)}><span />{order.status}</span></td>
                <td><button className="row-open" onClick={() => setSelectedId(order.id)} aria-label={`Open ${order.doNumber}`}><ArrowUpRight size={16} /></button></td>
              </tr>)}
            </tbody></table>{visibleOrders.length === 0 && <div className="empty-state"><Search size={22} /><strong>{filter === "Today's Update" ? 'No delivery updates today' : 'No matching deliveries'}</strong><span>{filter === "Today's Update" ? 'Added, edited, or imported deliveries will appear here.' : 'Try another account, DO number, or status.'}</span></div>}</div>
            <div className="table-footer"><span>Showing <strong>{pageStart} to {pageEnd}</strong> of <strong>{visibleOrders.length}</strong> deliveries</span><nav className="pagination" aria-label="Delivery register pages">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} aria-label="First page">First</button>
              <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} aria-label="Previous page">Previous</button>
              {pageNumbers.map((page) => typeof page === 'number'
                ? <button key={page} className={currentPage === page ? 'current' : ''} onClick={() => setCurrentPage(page)} aria-label={`Page ${page}`} aria-current={currentPage === page ? 'page' : undefined}>{page}</button>
                : <span className="pagination-ellipsis" key={page}>…</span>)}
              <button onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} disabled={currentPage === pageCount} aria-label="Next page">Next</button>
              <button onClick={() => setCurrentPage(pageCount)} disabled={currentPage === pageCount} aria-label="Last page">Last</button>
            </nav><span className="sync-label">{syncLabel}</span></div>
          </section>
          <footer className="page-footer"><span>Clearance Desk <span className="footer-dot">|</span> Delivery operations</span><span>Imported from 2 source photos</span></footer>
        </div>
      </main>

      {showDialog && <DeliveryDialog orders={orders} order={editingOrder} defaultDeliveryDate={selectedDeliveryDate || new Date().toISOString().slice(0, 10)} onClose={() => { setShowDialog(false); setEditingOrder(null); }} onSave={saveOrder} />}
      {selectedOrder && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }}><section className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className="detail-header"><div><span className="eyebrow">DELIVERY RECORD</span><h2 id="detail-title">{selectedOrder.doNumber}</h2></div><button className="icon-button" onClick={() => setSelectedId(null)} aria-label="Close details"><X size={19} /></button></div>
        <div className="detail-customer"><span className="customer-mark">{selectedOrder.accountCode.slice(0, 1)}</span><div><strong>{selectedOrder.accountCode}. {selectedOrder.accountName}</strong><span>{formatDate(selectedOrder.deliveryDate)}</span></div></div>
        <div className="detail-facts"><div><span>PCS TN</span><strong>{formatPcs(selectedOrder.pcsTn)}</strong></div><div><span>Weight</span><strong>{formatWeight(selectedOrder.weight)}</strong></div><div><span>Delivery date</span><strong>{formatDate(selectedOrder.deliveryDate)}</strong></div><div><span>Status</span><strong>{selectedOrder.status}</strong></div></div>
        <div className="detail-actions"><button className="button button-danger" onClick={() => { setDeleteError(null); setConfirmDelete(true); }}><Trash2 size={15} />Delete</button><button className="button button-secondary" onClick={() => { setEditingOrder(selectedOrder); setSelectedId(null); setShowDialog(true); }}>Edit record</button><button className="button button-primary" onClick={() => setSelectedId(null)}>Done</button></div>
      </section></div>}
      {confirmDelete && selectedOrder && <div className="confirm-backdrop"><section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-delete-title" aria-describedby="confirm-delete-description">
        <h2 id="confirm-delete-title">Are you sure?</h2>
        <p id="confirm-delete-description">Delete {selectedOrder.doNumber}? This action cannot be undone.</p>
        {deleteError && <p className="delete-error" role="alert">{deleteError}</p>}
        <div className="confirm-actions"><button className="button button-secondary" disabled={isDeleting} onClick={() => { setConfirmDelete(false); setDeleteError(null); }}>No, keep it</button><button className="button button-danger" disabled={isDeleting} onClick={() => void deleteOrder(selectedOrder)}>{isDeleting ? 'Deleting…' : 'Yes, delete'}</button></div>
      </section></div>}
      {notification && <div className={`toast ${notification.type === 'error' ? 'toast-error' : ''}`} role={notification.type === 'error' ? 'alert' : 'status'}><span>{notification.message}</span><button className="toast-close" onClick={() => setNotification(null)} aria-label="Dismiss notification"><X size={15} /></button></div>}
    </div>
  );
}

function DeliveryDialog({ orders, order, defaultDeliveryDate, onClose, onSave }: { orders: ClearanceOrder[]; order: ClearanceOrder | null; defaultDeliveryDate: string; onClose: () => void; onSave: (order: ClearanceOrder) => string | null }) {
  const [deliveryDate, setDeliveryDate] = useState(order?.deliveryDate ?? defaultDeliveryDate);
  const [accountCode, setAccountCode] = useState(order?.accountCode ?? '');
  const [accountName, setAccountName] = useState(order?.accountName ?? '');
  const [doNumber, setDoNumber] = useState(order?.doNumber ?? createDoNumber(orders));
  const [pcsTn, setPcsTn] = useState(order?.pcsTn?.toString() ?? '');
  const [weight, setWeight] = useState(order?.weight.toString() ?? '');
  const [status, setStatus] = useState<ClearanceStatus>(order?.status ?? 'OK FOR DELIVERY');
  const [doNumberError, setDoNumberError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedPcs = pcsTn.trim() === '' || pcsTn.trim() === '-' ? null : Number(pcsTn);
    if (parsedPcs !== null && !Number.isFinite(parsedPcs)) return;
    const error = onSave({ id: order?.id ?? `delivery-${crypto.randomUUID()}`, deliveryDate, accountCode: accountCode.trim().toUpperCase(), accountName: accountName.trim(), doNumber: doNumber.trim().toUpperCase(), pcsTn: parsedPcs, weight: Number(weight), status });
    setDoNumberError(error);
  }

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="order-dialog" onSubmit={submit}>
    <div className="dialog-header"><div><span className="eyebrow">DELIVERY REGISTER</span><h2>{order ? 'Edit delivery' : 'Add delivery'}</h2><p>Enter the details from the delivery record.</p></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close form"><X size={19} /></button></div>
    <div className="form-grid"><label className="field">Date<input required type="date" value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} /></label><label className="field">Account code<input value={accountCode} onChange={(event) => setAccountCode(event.target.value)} placeholder="C271" /></label><label className="field field-wide">Account name<input required value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Customer / account name" /></label><label className="field">INV / DO no<input required value={doNumber} onChange={(event) => { setDoNumber(event.target.value); setDoNumberError(null); }} aria-invalid={Boolean(doNumberError)} aria-describedby={doNumberError ? 'do-number-error' : undefined} />{doNumberError && <span className="field-error" id="do-number-error" role="alert">{doNumberError}</span>}</label><label className="field">PCS TN<input inputMode="decimal" value={pcsTn} onChange={(event) => setPcsTn(event.target.value)} placeholder="-" /></label><label className="field">Weight<input required min="0" step="1" type="number" value={weight} onChange={(event) => setWeight(event.target.value)} /></label><label className="field">Status<select value={status} onChange={(event) => setStatus(event.target.value as ClearanceStatus)}><option>OK FOR DELIVERY</option><option>BEFORE DELIVER CK BLNC</option></select></label></div>
    <div className="dialog-footer"><span><span className="required-mark">*</span> Required fields</span><div><button className="button button-secondary" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit"><Check size={16} />{order ? 'Save changes' : 'Add delivery'}</button></div></div>
  </form></div>;
}

export default App;