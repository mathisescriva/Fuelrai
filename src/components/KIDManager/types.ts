export interface Cost {
  label: string;
  value: number;
}

export interface KeyInfo {
  isin: string;
  issuer: string;
  guarantor: string;
  authority: string;
  issueDate: string;
  maturityDate: string;
  currency: string;
  nominalAmount: string;
}

export interface KID {
  id: number;
  name: string;
  url: string;
  file: File;
  costs: Cost[];
  keyInfo: KeyInfo;
}
