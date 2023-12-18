export class OrderStatus {
    static readonly created = "created";
    static readonly ordering = "ordering";
    static readonly deleted = "deleted";
    static readonly paid = "paid";
    static readonly notPaid = "not-paid";
    static readonly inKitchen = "inKitchen";
    static readonly served = "served";
    static readonly userClosed = "user-closed";
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

// export const foodCategories : Categories = {
//     mainDish: "Plato Fuerte", 
//     sideDish: "Aperitivo", 
//     drinks: "Bebida",
//     dessert: "Postre",
// }

export const foodCategories = ["Plato Fuerte", "Aperitivo","Bebida","Postre"];

export class PersistenceKeys {
    static TOKEN = "fos-token";
    static ROLE = "fos-role";
    static DBPENDING = "fos-dashboard-pending";
    static DBPREPARING = "fos-dashboard-preparing";
}