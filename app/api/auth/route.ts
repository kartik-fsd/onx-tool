import { userAuthSchema } from "@/lib/validation/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const body = userAuthSchema.parse(json);

        let user = await prisma.user.findUnique({
            where: {
                phone: body.phone,
            },
            select: {
                id: true,
                name: true,
                phone: true,
                createdAt: true,
                sellers: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        products: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            // Create new user
            user = await prisma.user.create({
                data: {
                    name: body.name,
                    phone: body.phone,
                },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    createdAt: true,
                    sellers: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            products: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    },
                },
            });
        } else {
            // Update existing user's name if it changed
            if (user.name !== body.name) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { name: body.name },
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        createdAt: true,
                        sellers: {
                            select: {
                                id: true,
                                name: true,
                                createdAt: true,
                                products: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }

        // Define types for sellers and products
        type Seller = typeof user.sellers[number];

        // Calculate statistics
        const stats = {
            totalSellers: user.sellers.length,
            totalProducts: user.sellers.reduce(
                (acc: number, seller: Seller) => acc + seller.products.length,
                0
            ),
            lastActive:
                user.sellers.length > 0
                    ? Math.max(
                        ...user.sellers.map((s: Seller) => s.createdAt.getTime())
                    )
                    : user.createdAt.getTime(),
        };

        return NextResponse.json({
            ...user,
            stats,
            message: user ? "Login successful" : "Account created successfully",
        });
    } catch (error) {
        console.error("Authentication error:", error);

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    error: "Authentication failed",
                    message: error.message,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
