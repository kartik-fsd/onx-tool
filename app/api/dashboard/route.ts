import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import {
    DashboardStats,
    FilterOptions,
    ProductData,
    SellerData
} from "@/types/dashboard"
import { z } from "zod"

const queryParamsSchema = z.object({
    dateRange: z.enum(['today', 'week', 'month', 'all']).optional(),
    sortBy: z.enum(['date', 'products', 'name']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.string().transform(Number).pipe(z.number().positive()).optional(),
    limit: z.string().transform(Number).pipe(z.number().positive().max(100)).optional(),
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const validatedParams = queryParamsSchema.parse({
            dateRange: searchParams.get('dateRange'),
            sortBy: searchParams.get('sortBy'),
            sortOrder: searchParams.get('sortOrder'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        const page = validatedParams.page || 1;
        const limit = validatedParams.limit || 10;
        const skip = (page - 1) * limit;

        // Build date filter
        const dateFilter = (() => {
            const now = new Date();
            switch (validatedParams.dateRange) {
                case 'today':
                    return {
                        createdAt: {
                            gte: new Date(now.setHours(0, 0, 0, 0)),
                            lt: new Date(now.setHours(23, 59, 59, 999))
                        }
                    };
                case 'week':
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() - 7);
                    return {
                        createdAt: {
                            gte: weekStart,
                            lte: now
                        }
                    };
                case 'month':
                    const monthStart = new Date(now);
                    monthStart.setMonth(now.getMonth() - 1);
                    return {
                        createdAt: {
                            gte: monthStart,
                            lte: now
                        }
                    };
                default:
                    return {};
            }
        })();

        // Build sort order
        const orderBy = (() => {
            switch (validatedParams.sortBy) {
                case 'products':
                    return {
                        products: {
                            _count: validatedParams.sortOrder
                        }
                    };
                case 'name':
                    return {
                        name: validatedParams.sortOrder
                    };
                default:
                    return {
                        createdAt: validatedParams.sortOrder || 'desc'
                    };
            }
        })();

        // Execute queries in parallel
        const [sellers, totalSellersCount, totalProductsCount] = await Promise.all([
            prisma.seller.findMany({
                where: dateFilter,
                include: {
                    products: {
                        select: {
                            id: true,
                            name: true,
                            mrp: true,
                            msp: true,
                            frontImage: true,
                            sideImage: true,
                            backImage: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true
                        }
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.seller.count({ where: dateFilter }),
            prisma.product.count({ where: dateFilter })
        ]);

        const stats: DashboardStats = {
            totalSellers: totalSellersCount,
            totalProducts: totalProductsCount,
            averageProductsPerSeller: totalSellersCount > 0
                ? totalProductsCount / totalSellersCount
                : 0
        };

        const totalPages = Math.ceil(totalSellersCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processedSellers: SellerData[] = sellers.map((seller: { products: any[]; }) => ({
            ...seller,
            products: seller.products.map((product): ProductData => ({
                id: product.id,
                name: product.name,
                mrp: product.mrp,
                msp: product.msp,
                frontImage: product.frontImage,
                sideImage: product.sideImage,
                backImage: product.backImage,
                createdAt: new Date(product.createdAt),
                updatedAt: new Date(product.updatedAt)
            }))
        }));

        return NextResponse.json({
            stats,
            sellers: processedSellers,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalSellersCount,
                hasNextPage,
                hasPreviousPage,
                limit
            }
        });

    } catch (error) {
        console.error('Dashboard data fetch error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: "Invalid query parameters",
                    details: error.errors
                },
                { status: 400 }
            );
        }

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    error: "Failed to fetch dashboard data",
                    message: error.message
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

interface AnalyticsProductCount {
    createdAt: Date;
    _count: {
        id: number;
    };
}

interface TopUserData {
    id: string;
    name: string;
    _count: {
        sellers: number;
    };
}

interface AverageProductCount {
    _avg: {
        _count: {
            products: true;
        };
    };
}

interface AnalyticsResponse {
    productsPerDay: AnalyticsProductCount[];
    topUsers: TopUserData[];
    averageProducts: AverageProductCount;
}

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const dateRange = searchParams.get('dateRange') as FilterOptions['dateRange'];

        const dateFilter = (() => {
            const now = new Date();
            switch (dateRange) {
                case 'today':
                    return {
                        createdAt: {
                            gte: new Date(now.setHours(0, 0, 0, 0))
                        }
                    };
                case 'week':
                    return {
                        createdAt: {
                            gte: new Date(now.setDate(now.getDate() - 7))
                        }
                    };
                case 'month':
                    return {
                        createdAt: {
                            gte: new Date(now.setMonth(now.getMonth() - 1))
                        }
                    };
                default:
                    return {};
            }
        })();

        const [productsPerDay, topUsers, averageProducts] = await Promise.all([
            prisma.product.groupBy({
                by: ['createdAt'],
                _count: {
                    id: true
                },
                where: dateFilter,
                orderBy: {
                    createdAt: 'asc'
                }
            }),
            prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: {
                            sellers: true
                        }
                    }
                },
                orderBy: {
                    sellers: {
                        _count: 'desc'
                    }
                },
                take: 5
            }),
            prisma.seller.aggregate({
                _avg: {
                    _count: {
                        products: true
                    }
                },
                where: dateFilter
            })
        ]);

        const response: AnalyticsResponse = {
            productsPerDay,
            topUsers,
            averageProducts
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Analytics data fetch error:', error);
        return NextResponse.json(
            { error: "Failed to fetch analytics data" },
            { status: 500 }
        );
    }
}