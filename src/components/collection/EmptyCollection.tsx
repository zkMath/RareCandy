import Link from "next/link";

interface EmptyCollectionProps {
  message: string;
  showPullButton?: boolean;
}

export function EmptyCollection({ message, showPullButton }: EmptyCollectionProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-20 h-20 rounded-2xl bg-plum-50 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-plum-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <p className="text-gray-500 text-sm mb-6">{message}</p>
      {showPullButton && (
        <Link
          href="/gacha"
          className="px-6 py-3 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors shadow-lg shadow-plum-300/30"
        >
          Pull Your First Card
        </Link>
      )}
    </div>
  );
}
