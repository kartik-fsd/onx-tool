import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { userAuthSchema } from "@/lib/validation/auth"

export async function POST(req: Request) {
    try {
        const json = await req.json()
        const body = userAuthSchema.parse(json)

        let user = await prisma.user.findUnique({
            where: {
                phone: body.phone,
            },
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: body.name,
                    phone: body.phone,
                },
            })
        } else {
            // Update name if it changed
            if (user.name !== body.name) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { name: body.name },
                })
            }
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("Authentication error:", error)
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 400 }
        )
    }
}