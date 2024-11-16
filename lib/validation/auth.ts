import * as z from "zod"

export const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)

export const userAuthSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    phone: z.string()
        .regex(phoneRegex, { message: "Invalid phone number" })
        .min(10, { message: "Phone number must be at least 10 digits." })
        .max(10, { message: "Phone number cannot exceed 10 digits." })
})