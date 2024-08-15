export const ORDERING_ENABLED_KEY = "ordering-key";

export class OrderStatus {
  static readonly created = "created";
  static readonly ordering = "ordering";
  static readonly deleted = "deleted";
  static readonly paid = "paid";
  static readonly notPaid = "notPaid";
  static readonly inKitchen = "inKitchen";
  static readonly served = "served";
  static readonly userClosed = "userClosed";
}

export class ItemStatus {
  static readonly ordered = "ordered";
  static readonly inProgress = "inProgress";
  static readonly done = "done";
}

export class UserRoles {
  static readonly dev = "dev";
  static readonly admin = "admin";
  static readonly viewer = "viewer";
  static readonly waiter = "waiter";
}

export class FoodCategories {
  static readonly mainDish = "Plato Fuerte";
  static readonly sideDish = "Aperitivo";
  static readonly drinks = "Bebida";
  static readonly dessert = "Postre";
}

export class PaymentMethods {
  static readonly CASH = "cash";
  static readonly CARD = "card";
  //static readonly ONLINE = 'online';

  static get paymentMethods() {
    return {
      cash: PaymentMethods.getSpanishValue(PaymentMethods.CASH),
      card: PaymentMethods.getSpanishValue(PaymentMethods.CARD),
      //onlne: PaymentMethods.getSpanishValue(PaymentMethods.ONLINE)
    };
  }

  static getSpanishValue(value: string): string {
    switch (value) {
      case PaymentMethods.CASH:
        return "Efectivo";
      case PaymentMethods.CARD:
        return "Tarjeta";
      default:
        return "";
    }
  }
}
