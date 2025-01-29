export interface FinancialMetrics {
  revenue: number;
  operatingIncome: number;
  netIncome: number;
  eps: number;
  dividendPerShare: number;
}

export interface CompanyInfo {
  name: string;
  fiscalYear: string;
  sector: string;
  stockSymbol: string;
  reportDate: string;
}

export interface AnnualReport {
  id: number;
  name: string;
  url: string;
  file: File;
  companyInfo: CompanyInfo;
  financialMetrics: FinancialMetrics;
}
