import { Skeleton } from "@/components/ui/skeleton"

export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-20 bg-card rounded-lg border shadow-sm p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden shadow-md border">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
