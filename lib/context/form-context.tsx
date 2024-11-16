"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import { User, Seller, Product } from "@/types";

// Define the FormState interface
interface FormState {
  user: Partial<User> | null;
  seller: Partial<Seller> | null;
  products: Partial<Product>[];
  currentStep: "auth" | "seller" | "products";
  isSubmitting: boolean;
}

// Define the valid actions for the reducer
type FormAction =
  | { type: "SET_USER"; payload: Partial<User> }
  | { type: "SET_SELLER"; payload: Partial<Seller> }
  | { type: "ADD_PRODUCT"; payload: Partial<Product> }
  | {
      type: "UPDATE_PRODUCT";
      payload: { index: number; product: Partial<Product> };
    }
  | { type: "REMOVE_PRODUCT"; payload: number }
  | { type: "SET_STEP"; payload: FormState["currentStep"] }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "RESET_FORM" };

// Define the initial state
const initialState: FormState = {
  user: null,
  seller: null,
  products: [],
  currentStep: "auth",
  isSubmitting: false,
};

// Create the context with a proper type
const FormContext = createContext<
  | {
      state: FormState;
      dispatch: React.Dispatch<FormAction>;
    }
  | undefined
>(undefined);

// Reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_SELLER":
      return { ...state, seller: action.payload };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product, index) =>
          index === action.payload.index ? action.payload.product : product
        ),
      };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((_, index) => index !== action.payload),
      };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "RESET_FORM":
      return initialState;
    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Unhandled action type: ${(action as any).type}`);
  }
}

// FormProvider component
export function FormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("formState");
    if (savedState) {
      const parsedState: Partial<FormState> = JSON.parse(savedState);

      // Update the state using specific dispatch actions
      if (parsedState.user) {
        dispatch({ type: "SET_USER", payload: parsedState.user });
      }
      if (parsedState.seller) {
        dispatch({ type: "SET_SELLER", payload: parsedState.seller });
      }
      if (parsedState.products) {
        parsedState.products.forEach((product) =>
          dispatch({ type: "ADD_PRODUCT", payload: product })
        );
      }
      if (parsedState.currentStep) {
        dispatch({ type: "SET_STEP", payload: parsedState.currentStep });
      }
      if (parsedState.isSubmitting) {
        dispatch({ type: "SET_SUBMITTING", payload: parsedState.isSubmitting });
      }
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem("formState", JSON.stringify(state));
  }, [state]);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

// Custom hook to access the form state
export function useFormState() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormState must be used within a FormProvider");
  }
  return context;
}
