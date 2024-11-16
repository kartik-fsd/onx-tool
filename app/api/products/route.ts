// app/api/products/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { MINIMUM_PRODUCTS, MAXIMUM_PRODUCTS } from "@/constants"
import * as z from "zod"
import { PrismaClient } from "@prisma/client"

type TransactionClient = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

// Validation schema for API
const productSubmissionSchema = z.object({
    sellerId: z.string().min(1, "Seller ID is required"),
    products: z.array(z.object({
        name: z.string().min(2).max(100),
        mrp: z.number().positive(),
        msp: z.number().positive(),
        frontImage: z.string().url(),
        sideImage: z.string().url(),
        backImage: z.string().url()
    })).min(MINIMUM_PRODUCTS, `Minimum ${MINIMUM_PRODUCTS} products required`)
        .max(MAXIMUM_PRODUCTS, `Maximum ${MAXIMUM_PRODUCTS} products allowed`)
})

type ProductSubmission = z.infer<typeof productSubmissionSchema>;

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Validate request body
        const validatedData = productSubmissionSchema.parse(body) as ProductSubmission

        // Verify seller exists
        const seller = await prisma.seller.findUnique({
            where: { id: validatedData.sellerId },
        })

        if (!seller) {
            return NextResponse.json(
                { error: "Seller not found" },
                { status: 404 }
            )
        }

        // Additional validation for MSP <= MRP
        const invalidProducts = validatedData.products.filter(
            product => product.msp > product.mrp
        )

        if (invalidProducts.length > 0) {
            return NextResponse.json(
                {
                    error: "Invalid product prices",
                    details: "MSP cannot be greater than MRP for some products",
                    products: invalidProducts.map(p => p.name)
                },
                { status: 400 }
            )
        }

        // Create all products in a transaction
        const createdProducts = await prisma.$transaction(async (tx: TransactionClient) => {
            // Update seller's product count
            await tx.seller.update({
                where: { id: validatedData.sellerId },
                data: {
                    updatedAt: new Date(),
                }
            })

            // Create all products
            return Promise.all(
                validatedData.products.map(product =>
                    tx.product.create({
                        data: {
                            name: product.name,
                            mrp: product.mrp,
                            msp: product.msp,
                            frontImage: product.frontImage,
                            sideImage: product.sideImage,
                            backImage: product.backImage,
                            sellerId: validatedData.sellerId
                        }
                    })
                )
            )
        })

        return NextResponse.json({
            message: "Products created successfully",
            count: createdProducts.length,
            products: createdProducts
        })

    } catch (error) {
        console.error("Product creation error:", error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: "Validation error",
                    details: error.errors
                },
                { status: 400 }
            )
        }

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    error: "Product creation failed",
                    message: error.message
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const sellerId = searchParams.get('sellerId')

        if (!sellerId) {
            return NextResponse.json(
                { error: "Seller ID is required" },
                { status: 400 }
            )
        }

        const products = await prisma.product.findMany({
            where: { sellerId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({
            count: products.length,
            products
        })

    } catch (error) {
        console.error("Error fetching products:", error)
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const productId = searchParams.get('id')

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            )
        }

        await prisma.product.delete({
            where: { id: productId }
        })

        return NextResponse.json({
            message: "Product deleted successfully"
        })

    } catch (error) {
        console.error("Error deleting product:", error)
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        )
    }
}

export async function validateImageUrls(images: string[]): Promise<boolean> {
    try {
        const imagePromises = images.map(async (url) => {
            const response = await fetch(url, { method: 'HEAD' })
            return response.ok
        })

        const results = await Promise.all(imagePromises)
        return results.every(Boolean)
    } catch {
        return false
    }
}