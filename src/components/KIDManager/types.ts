export interface Period {
  holdingPeriod: string;
  finalAmount: number;
  performance: string;
}

export interface Scenario {
  scenarioName: string;
  periods: Period[];
}

export interface PerformanceScenarios {
  initialInvestment: number;
  scenarios: Scenario[];
}

export interface CompositionOfCosts {
  entryCosts: number;
  exitCosts: number;
  ongoingCosts: number;
  transactionCosts: number;
  incidentalCosts: number;
}

export interface Costs {
  compositionOfCosts: CompositionOfCosts;
}

export interface ProductDetails {
  productName: string;
  productType: string;
  isin: string;
  currency: string;
}

export interface Risks {
  riskIndicator: string;
  sriScale: {
    lowest: number;
    highest: number;
    current: number;
  };
}

export interface RedemptionInformation {
  recommendedHoldingPeriod: string;
  earlyRedemptionPossible: boolean;
}

export interface KID {
  id: number;
  name: string;
  url: string;
  file: File;
  documentTitle: string;
  documentLanguage: string;
  documentDate: string;
  manufacturerName: string;
  productDetails: ProductDetails;
  risks: Risks;
  performanceScenarios: PerformanceScenarios;
  costs: Costs;
  redemptionInformation: RedemptionInformation;
}
