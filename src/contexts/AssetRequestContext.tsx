import { createContext, useContext, useReducer, ReactNode } from "react";
import type { Database } from "@/types/database.types";

type AssetRequest = Database["public"]["Tables"]["asset_requests"]["Row"];
type Asset = Database["public"]["Tables"]["assets"]["Row"];

type State = {
  currentRequest: AssetRequest | null;
  assets: Asset[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "SET_REQUEST"; payload: AssetRequest }
  | { type: "SET_ASSETS"; payload: Asset[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };

const initialState: State = {
  currentRequest: null,
  assets: [],
  loading: false,
  error: null,
};

const AssetRequestContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_REQUEST":
      return { ...state, currentRequest: action.payload };
    case "SET_ASSETS":
      return { ...state, assets: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AssetRequestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AssetRequestContext.Provider value={{ state, dispatch }}>
      {children}
    </AssetRequestContext.Provider>
  );
}

export function useAssetRequest() {
  const context = useContext(AssetRequestContext);
  if (!context) {
    throw new Error(
      "useAssetRequest must be used within an AssetRequestProvider",
    );
  }
  return context;
}
