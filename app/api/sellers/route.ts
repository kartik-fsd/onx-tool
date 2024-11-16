import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { uploadToS3 } from "@/lib/s3-utils"
import { sellerFormSchema } from "@/lib/validation/seller"

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const shopImage = formData.get("shopImage") as File

        // Upload image to S3
        const imageUrl = await uploadToS3(shopImage)

        // Create seller data object
        const sellerData = {
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            gstNumber: formData.get("gstNumber") as string,
            shopImage: imageUrl,
            userId: formData.get("userId") as string,
        }

        // Validate data
        const validatedFields = sellerFormSchema.parse({
            ...sellerData,
            shopImage: [shopImage], // Adjust for validation schema
        })

        // Create seller in database
        const seller = await prisma.seller.create({
            data: sellerData,
        })

        return NextResponse.json(seller)
    } catch (error) {
        console.error("Seller creation error:", error)
        return NextResponse.json(
            { error: "Failed to create seller" },
            { status: 400 }
        )
    }
}