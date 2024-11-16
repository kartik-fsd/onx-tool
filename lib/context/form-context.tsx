"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { User, Seller, Product } from "@/types";

interface FormState {
  user: Partial<User> | null;
  seller: Partial<Seller> | null;
  products: Partial<Product>[];
  currentStep: "auth" | "seller" | "products";
  isSubmitting: boolean;
}

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

const initialState: FormState = {
  user: null,
  seller: null,
  products: [],
  currentStep: "auth",
  isSubmitting: false,
};

const FormContext = createContext<
  | {
      state: FormState;
      dispatch: React.Dispatch<FormAction>;
    }
  | undefined
>(undefined);

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: {
          ...(state.user || {}),
          ...action.payload,
        },
      };
    case "SET_SELLER":
      return {
        ...state,
        seller: {
          ...(state.seller || {}),
          ...action.payload,
        },
      };
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
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
}

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem("formState");
    if (savedState) {
      try {
        const parsedState: Partial<FormState> = JSON.parse(savedState);

        if (parsedState.user) {
          dispatch({ type: "SET_USER", payload: parsedState.user });
        }
        if (parsedState.seller) {
          dispatch({ type: "SET_SELLER", payload: parsedState.seller });
        }
        if (parsedState.products) {
          // Clear existing products first
          dispatch({ type: "RESET_FORM" });
          // Then add saved products
          parsedState.products.forEach((product) =>
            dispatch({ type: "ADD_PRODUCT", payload: product })
          );
        }
        if (parsedState.currentStep) {
          dispatch({ type: "SET_STEP", payload: parsedState.currentStep });
        }
        if (parsedState.isSubmitting !== undefined) {
          dispatch({
            type: "SET_SUBMITTING",
            payload: parsedState.isSubmitting,
          });
        }
      } catch (error) {
        console.error("Error parsing saved state:", error);
        localStorage.removeItem("formState");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formState", JSON.stringify(state));
  }, [state]);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormState() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormState must be used within a FormProvider");
  }
  return context;
}
