import * as z from "zod"
import { IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants"
import { phoneRegex } from "./auth"

export const sellerFormSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    phone: z.string()
        .regex(phoneRegex, { message: "Invalid phone number" })
        .min(10, { message: "Phone number must be at least 10 digits." })
        .max(10, { message: "Phone number cannot exceed 10 digits." }),
    gstNumber: z.string()
        .length(15, { message: "GST number must be exactly 15 characters." })
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
            message: "Invalid GST number format."
        }),
    shopImage: z.instanceof(FileList)
        .refine((files) => files.length > 0, "Shop image is required.")
        .refine((files) => files.length <= 1, "Only one image is allowed.")
        .refine(
            (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
            `Image size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
        )
        .refine(
            (files) => Array.from(files).every((file) => IMAGE_TYPES.includes(file.type)),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
})