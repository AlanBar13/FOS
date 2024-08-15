export interface KeyValues {
  key: string;
  value: string;
}

export class OrderStatus {
  static created = "created";
  static ordering = "ordering";
  static deleted = "deleted";
  static paid = "paid";
  static notPaid = "notPaid";
  static inKitchen = "inKitchen";
  static served = "served";
  static userClosed = "userClosed";

  static getSpanishName(status?: string): string {
    if (status == null) {
      return "Desconocido";
    }
    switch (status) {
      case this.created:
        return "Creado";
      case this.ordering:
        return "Ordenando";
      case this.deleted:
        return "Borrado";
      case this.paid:
        return "Pagado";
      case this.notPaid:
        return "No Pagado";
      case this.inKitchen:
        return "En Cocina";
      case this.served:
        return "Servido";
      case this.userClosed:
        return "Cerrado x Usuario";
      default:
        return "Desconocido";
    }
  }

  static getStatusArray(): KeyValues[] {
    return Object.keys(OrderStatus).map((status) => {
      const obj: KeyValues = {
        key: status,
        value: this.getSpanishName(status),
      };
      return obj;
    });
  }
}

export class ItemStatus {
  static readonly ordered = "ordered";
  static readonly inProgress = "inProgress";
  static readonly done = "done";

  static getSpanishName(status?: string): string {
    if (status == null) {
      return "Desconocido";
    }

    switch (status) {
      case this.ordered:
        return "Ordenado";
      case this.inProgress:
        return "Preparando";
      case this.done:
        return "Listo";
      default:
        return "Desconocido";
    }
  }
}

export class UserRoles {
  static readonly dev = "dev";
  static readonly admin = "admin";
  static readonly viewer = "viewer";
  static readonly waiter = "waiter";

  static getRoles() {
    return [this.admin, this.viewer, this.waiter];
  }

  static getSpanishName(role: string) {
    switch (role) {
      case this.dev:
        return "Developer";
      case this.admin:
        return "Administrador";
      case this.waiter:
        return "Mesero";
      default:
        return "Usuario";
    }
  }
}

export class FoodCategories {
  static readonly mainDish = "Plato Fuerte";
  static readonly sideDish = "Aperitivo";
  static readonly drinks = "Bebida";
  static readonly dessert = "Postre";
}

// export const foodCategories : Categories = {
//     mainDish: "Plato Fuerte",
//     sideDish: "Aperitivo",
//     drinks: "Bebida",
//     dessert: "Postre",
// }

export const foodCategories = ["Plato Fuerte", "Aperitivo", "Bebida", "Postre"];

export class PersistenceKeys {
  static TOKEN = "fos-token";
  static ROLE = "fos-role";
  static DBPENDING = "fos-dashboard-pending";
  static DBPREPARING = "fos-dashboard-preparing";
}
