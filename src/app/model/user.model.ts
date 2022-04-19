export class User {
    constructor(
        public id: number,
        public name: string,
        public address: string,
        public accountNum: string,
        public rateClass: number,
        public meterNum: string,
        public prevRdgDate: number,
        public balancePrevBill: number,
        public totalCurrBill: number,
        public accountType : string,
        public billInfo : any
      ){}
}

export class UserInfoBill {
  constructor(
      public billingMonth: any,
      public dateOfRdg: any,
      public presentRdg: any,
      public consumed: any,
      public currentBillCharges: any,
      public dueDate: any
      
    ){}
}
export class WaterInfoBill {
  constructor(
      public id: any,
      public residence: any,
      public commercial: any
      
    ){}
}
