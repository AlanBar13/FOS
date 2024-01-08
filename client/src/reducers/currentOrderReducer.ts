import {Reducer} from "react";
import { RawOrderItem } from "../models/Order";

type CurrentOrderPayload = {
    orderItems: RawOrderItem[]
}

export type CurrentOrderState = {
    orderedItems: RawOrderItem[]
}

export type CurrentOrderDispatchType = {
    type: "addItems" | "deleteItem"
    payload: CurrentOrderPayload
}

export const currentOrderDispatcher : Reducer<CurrentOrderState, CurrentOrderDispatchType> = (state: CurrentOrderState, action: CurrentOrderDispatchType) : CurrentOrderState => {
    switch (action.type) {
      case "addItems": {
        console.log(action.payload)
        const orderItems = [...state.orderedItems, ...action.payload.orderItems]
        return {...state, orderedItems: orderItems};
      }
      case "deleteItem": {
        return state;
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
}