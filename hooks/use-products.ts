// hooks/use-products.ts
import { useState, useCallback } from 'react'
import { useFormState } from '@/lib/context/form-context'
import { toast } from './use-toast'
import { MINIMUM_PRODUCTS, MAXIMUM_PRODUCTS } from '@/constants'

export function useProducts() {
  const { state, dispatch } = useFormState()
  const [isLoading, setIsLoading] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAddProduct = useCallback(async (data: any) => {
    if (state.products.length >= MAXIMUM_PRODUCTS && editingIndex === null) {
      toast({
        title: "Maximum limit reached",
        description: `You can only add up to ${MAXIMUM_PRODUCTS} products.`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      if (editingIndex !== null) {
        dispatch({
          type: "UPDATE_PRODUCT",
          payload: { index: editingIndex, product: data },
        })
        setEditingIndex(null)
        toast({
          title: "Success",
          description: "Product updated successfully.",
        })
      } else {
        dispatch({ type: "ADD_PRODUCT", payload: data })
        toast({
          title: "Success",
          description: "Product added successfully.",
        })
      }
    } catch (error) {
      console.error("Product save error:", error)
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, editingIndex, state.products.length])

  const handleDeleteProduct = useCallback((index: number) => {
    dispatch({ type: "REMOVE_PRODUCT", payload: index })
    toast({
      title: "Product removed",
      description: "The product has been removed from the list.",
    })
  }, [dispatch])

  const handleEditProduct = useCallback((index: number) => {
    setEditingIndex(index)
  }, [])

  const canSubmit = state.products.length >= MINIMUM_PRODUCTS

  return {
    products: state.products,
    isLoading,
    editingIndex,
    canSubmit,
    handleAddProduct,
    handleDeleteProduct,
    handleEditProduct,
    editingProduct: editingIndex !== null ? state.products[editingIndex] : undefined
  }
}