import { IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants"
import * as z from "zod"

export const productFormSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters." })
        .max(100, { message: "Name cannot exceed 100 characters." }),
    mrp: z.number()
        .positive({ message: "MRP must be positive." })
        .min(1, { message: "MRP must be at least 1." }),
    msp: z.number()
        .positive({ message: "MSP must be positive." })
        .min(1, { message: "MSP must be at least 1." }),
    frontImage: z.instanceof(FileList)
        .refine((files) => files.length > 0, "Front image is required.")
        .refine((files) => files.length <= 1, "Only one image is allowed.")
        .refine(
            (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
            `Image size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
        )
        .refine(
            (files) => Array.from(files).every((file) => IMAGE_TYPES.includes(file.type)),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
    sideImage: z.instanceof(FileList)
        .refine((files) => files.length > 0, "Side image is required.")
        .refine((files) => files.length <= 1, "Only one image is allowed.")
        .refine(
            (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
            `Image size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
        )
        .refine(
            (files) => Array.from(files).every((file) => IMAGE_TYPES.includes(file.type)),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
    backImage: z.instanceof(FileList)
        .refine((files) => files.length > 0, "Back image is required.")
        .refine((files) => files.length <= 1, "Only one image is allowed.")
        .refine(
            (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
            `Image size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
        )
        .refine(
            (files) => Array.from(files).every((file) => IMAGE_TYPES.includes(file.type)),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
}).refine((data) => data.msp <= data.mrp, {
    message: "MSP cannot be greater than MRP",
    path: ["msp"]
})