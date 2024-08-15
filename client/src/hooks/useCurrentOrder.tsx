import {
  createContext,
  PropsWithChildren,
  useReducer,
  Dispatch,
  useContext,
} from "react";
import {
  currentOrderDispatcher,
  CurrentOrderDispatchType,
  CurrentOrderState,
} from "../reducers/currentOrderReducer";

const initialSate: CurrentOrderState = {
  orderedItems: [],
};
const CurrentOrderContext = createContext<CurrentOrderState>(initialSate);
const CurrentOrderDispatch = createContext<Dispatch<CurrentOrderDispatchType>>(
  () => {},
);

export function useCurrentOrder() {
  return useContext(CurrentOrderContext);
}

export function useCurrentOrderDispatch() {
  return useContext(CurrentOrderDispatch);
}

export function CurrentOrderProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(currentOrderDispatcher, initialSate);

  return (
    <CurrentOrderContext.Provider value={state}>
      <CurrentOrderDispatch.Provider value={dispatch}>
        {children}
      </CurrentOrderDispatch.Provider>
    </CurrentOrderContext.Provider>
  );
}
