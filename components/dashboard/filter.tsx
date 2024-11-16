import { FilterOptions } from "@/types/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  return (
    <div className="flex gap-4">
      <Select
        value={filters.dateRange}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            dateRange: value as FilterOptions["dateRange"],
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            sortBy: value as FilterOptions["sortBy"],
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="products">Products Count</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortOrder}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            sortOrder: value as FilterOptions["sortOrder"],
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
