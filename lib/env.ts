// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().min(1),

    // AWS
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_BUCKET_NAME: z.string().min(1),

    // App Config
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_MAXIMUM_FILE_SIZE: z.string().transform(Number),
    NEXT_PUBLIC_ALLOWED_FILE_TYPES: z.string(),
    NEXT_PUBLIC_MINIMUM_PRODUCTS: z.string().transform(Number),
    NEXT_PUBLIC_MAXIMUM_PRODUCTS: z.string().transform(Number),
})

type EnvSchema = z.infer<typeof envSchema>

// Validate and transform environment variables
function getValidatedEnv(): EnvSchema {
    if (!process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES) {
        throw new Error('NEXT_PUBLIC_ALLOWED_FILE_TYPES is not defined');
    }

    if (!process.env.NEXT_PUBLIC_MAXIMUM_FILE_SIZE) {
        throw new Error('NEXT_PUBLIC_MAXIMUM_FILE_SIZE is not defined');
    }

    if (!process.env.NEXT_PUBLIC_MINIMUM_PRODUCTS) {
        throw new Error('NEXT_PUBLIC_MINIMUM_PRODUCTS is not defined');
    }

    if (!process.env.NEXT_PUBLIC_MAXIMUM_PRODUCTS) {
        throw new Error('NEXT_PUBLIC_MAXIMUM_PRODUCTS is not defined');
    }

    const parsed = envSchema.safeParse({
        DATABASE_URL: process.env.DATABASE_URL,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_MAXIMUM_FILE_SIZE: process.env.NEXT_PUBLIC_MAXIMUM_FILE_SIZE,
        NEXT_PUBLIC_ALLOWED_FILE_TYPES: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES,
        NEXT_PUBLIC_MINIMUM_PRODUCTS: process.env.NEXT_PUBLIC_MINIMUM_PRODUCTS,
        NEXT_PUBLIC_MAXIMUM_PRODUCTS: process.env.NEXT_PUBLIC_MAXIMUM_PRODUCTS,
    })

    if (!parsed.success) {
        console.error(
            '❌ Invalid environment variables:',
            parsed.error.flatten().fieldErrors
        )
        throw new Error('Invalid environment variables')
    }

    return parsed.data
}

// Configuration object with validated environment variables
export const config = {
    database: {
        url: getValidatedEnv().DATABASE_URL,
    },
    aws: {
        accessKeyId: getValidatedEnv().AWS_ACCESS_KEY_ID,
        secretAccessKey: getValidatedEnv().AWS_SECRET_ACCESS_KEY,
        region: getValidatedEnv().AWS_REGION,
        bucketName: getValidatedEnv().AWS_BUCKET_NAME,
    },
    app: {
        url: getValidatedEnv().NEXT_PUBLIC_APP_URL,
        maxFileSize: getValidatedEnv().NEXT_PUBLIC_MAXIMUM_FILE_SIZE,
        allowedFileTypes: getValidatedEnv().NEXT_PUBLIC_ALLOWED_FILE_TYPES.split(','),
        minProducts: getValidatedEnv().NEXT_PUBLIC_MINIMUM_PRODUCTS,
        maxProducts: getValidatedEnv().NEXT_PUBLIC_MAXIMUM_PRODUCTS,
    },
} as const

// Constants for use throughout the application
export const ALLOWED_FILE_TYPES = config.app.allowedFileTypes
export const MAX_FILE_SIZE = config.app.maxFileSize
export const MIN_PRODUCTS = config.app.minProducts
export const MAX_PRODUCTS = config.app.maxProducts

// Type for the entire config object
export type Config = typeof config

// Initialize environment validation
export function init() {
    getValidatedEnv()
}