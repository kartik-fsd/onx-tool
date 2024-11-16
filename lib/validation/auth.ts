import * as z from "zod"

export const phoneRegex = new RegExp(
    /^[6-9]\d{9}$/
)

export const userAuthSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    phone: z.string()
        .regex(phoneRegex, "Please enter a valid Indian phone number")
        .length(10, "Phone number must be exactly 10 digits")
})

export type AuthFormData = z.infer<typeof userAuthSchema>