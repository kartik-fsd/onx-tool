

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// constants/index.ts
import { config } from '@/lib/env'

export const ALLOWED_FILE_TYPES = config.app.allowedFileTypes
export const MAX_FILE_SIZE = config.app.maxFileSize
export const MINIMUM_PRODUCTS = config.app.minProducts
export const MAXIMUM_PRODUCTS = config.app.maxProducts

// Image upload related constants
export const IMAGE_UPLOAD_CONFIG = {
    maxSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_FILE_TYPES,
    maxDimensions: {
        width: 2048,
        height: 2048,
    },
} as const

// API related constants
export const API_ENDPOINTS = {
    products: '/api/products',
    sellers: '/api/sellers',
    dashboard: '/api/dashboard',
} as const

// Validation messages
export const VALIDATION_MESSAGES = {
    fileSize: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    fileType: `Only ${ALLOWED_FILE_TYPES.join(', ')} files are allowed`,
    minProducts: `Minimum ${MINIMUM_PRODUCTS} products required`,
    maxProducts: `Maximum ${MAXIMUM_PRODUCTS} products allowed`,
} as const