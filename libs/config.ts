export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableCarOptions = [
  'CarLoan',
  'CarInsurance',
  'ExtendedWarranty',
  'RoadsideAssistance',
  'CertifiedPreOwned',
  'FinancingAvailable',
  'TradeInAccepted',
];

const thisYear = new Date().getFullYear();

export const carYears: string[] = [];
for (let i = 1900; i <= thisYear; i++) {
  carYears.push(String(i));
}

export const carYear: number[] = [];
for (let i = 1900; i <= thisYear; i++) {
  carYear.push(i);
}

export const carMileageRanges = [0, 5000, 10000, 20000, 50000, 75000, 100000, 150000, 200000, 300000];

export const carPriceRanges = [0, 5000, 10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000];

export const Messages = {
  error1: 'Something went wrong!',
  error2: 'Please login first!',
  error3: 'Please fulfill all inputs!',
  error4: 'Message is empty!',
  error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topCarRank = 2;

