export type ClearanceStatus = 'OK FOR DELIVERY' | 'BEFORE DELIVER CK BLNC';

export type ClearanceOrder = {
  id: string;
  deliveryDate: string;
  accountCode: string;
  accountName: string;
  doNumber: string;
  pcsTn: number | null;
  weight: number;
  status: ClearanceStatus;
};
