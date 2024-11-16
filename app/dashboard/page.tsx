"use client";

import { useState, useEffect } from "react";
import { SellerList } from "@/components/dashboard/seller-list";
import {
  DashboardStats,
  SellerWithProducts,
  FilterOptions,
} from "@/types/dashboard";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatsCards } from "@/components/dashboard/stats-card";
import { Filters } from "@/components/dashboard/filter";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSellers: 0,
    totalProducts: 0,
    averageProductsPerSeller: 0,
  });
  const [sellers, setSellers] = useState<SellerWithProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const searchParams = new URLSearchParams({
          ...filters,
        });
        const response = await fetch(`/api/dashboard?${searchParams}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setStats(data.stats);
        setSellers(data.sellers);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Filters filters={filters} onFilterChange={setFilters} />
      </div>

      <StatsCards stats={stats} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Sellers</h2>
        <SellerList sellers={sellers} />
      </div>
    </div>
  );
}
