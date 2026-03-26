export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-plum-400/20 animate-breathe-outer" />
        <div className="absolute inset-2 rounded-full bg-plum-500/30 animate-breathe-mid" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-plum-500 to-plum-700 animate-breathe" />
      </div>
    </div>
  );
}
