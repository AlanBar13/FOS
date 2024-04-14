import nodemailer from "nodemailer";
import env from "../config/env";
import hbs from "nodemailer-express-handlebars";
import logger from "../utils/logger";
import { Order, OrderItem, Menu } from "@prisma/client";
import { format, parseISO } from "date-fns";

const hbsOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: "src/templates",
    layoutsDir: "src/templatses",
    defaultLayout: "",
  },
  viewPath: "src/templates",
  extName: ".hbs",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: env.email.user, pass: env.email.pass },
});

interface ExtOrderItems extends OrderItem {
  Menu: Menu;
}

/**
 * Sends order ticket to user when order is completed
 *
 * @param payload - Order Item attributes
 * @returns Order Item from DB
 */
export const sendTicketEmail = async (
  to: string[],
  order: Order,
  items: ExtOrderItems[],
) => {
  transporter.use("compile", hbs(hbsOptions));

  const menuItems = items.map((item) => {
    return {
      name: item.Menu.name,
      qty: item.qty,
      total: formatPriceFixed(item.Menu!.price * item.qty),
    };
  });

  if (menuItems.length > 0) {
    const email = {
      from: "FOS support",
      to: to,
      subject: `[${env.companyName}] Ticket orden #${order.id}`,
      template: "ticketMail",
      context: {
        restaurantName: env.companyName,
        purchaseDate: formatDate(order.createdAt.toISOString()),
        orderId: order.id,
        tableId: order.tableId,
        total: formatPriceFixed(order.total),
        items: menuItems,
      },
    };

    await transporter.sendMail(email, (err, info) => {
      if (err) {
        logger.error(`[MAIL] ${JSON.stringify(err)}`);
      }
    });
  } else {
    logger.error(`[MAIL] No items to send ticket for order ${order.id}`);
  }
};

const numberWithCommas = (x = "") => x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const nunberWithCommasFixed = (x: number) =>
  numberWithCommas(Number(x).toFixed(2));

const formatPriceFixed = (val: number) => `$ ` + nunberWithCommasFixed(val);

const formatDate = (date: string) => {
  return format(parseISO(date), "d/MM/yy HH:mm");
};
