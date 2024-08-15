import { Reducer } from "react";
import { RawOrderItem } from "../models/Order";
import _ from "lodash";

type CurrentOrderPayload = {
  orderItems: RawOrderItem[];
};

export type CurrentOrderState = {
  orderedItems: RawOrderItem[];
};

export type CurrentOrderDispatchType = {
  type: "addItems" | "deleteItem" | "replaceItems" | "updateItems";
  payload: CurrentOrderPayload;
};

export const currentOrderDispatcher: Reducer<
  CurrentOrderState,
  CurrentOrderDispatchType
> = (
  state: CurrentOrderState,
  action: CurrentOrderDispatchType,
): CurrentOrderState => {
  switch (action.type) {
    case "addItems": {
      const orderItems = [...state.orderedItems, ...action.payload.orderItems];
      return { ...state, orderedItems: orderItems };
    }
    case "replaceItems": {
      return { ...state, orderedItems: action.payload.orderItems };
    }
    case "updateItems": {
      const orderItems = updateAndReplace(
        state.orderedItems,
        action.payload.orderItems,
      );
      console.log(orderItems);
      return { ...state, orderedItems: orderItems };
    }
    case "deleteItem": {
      return state;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};

const updateAndReplace = (
  current: RawOrderItem[],
  newValues: RawOrderItem[],
): RawOrderItem[] => {
  const newItems = current.map((item) => {
    const item2 = _.find(newValues, { id: item.id });
    return item2 ? { ...item, ...item2 } : item;
  });

  return newItems;
};
