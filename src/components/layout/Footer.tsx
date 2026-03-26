import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/40 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-plum-500 to-plum-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">RC</span>
              </div>
              <span className="font-semibold text-gray-900">RareCandy</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Own real PSA 10 Pokemon cards. Every NFT backed 1:1 by a physical card vaulted in the USA.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Platform</h4>
            <div className="space-y-2">
              <Link href="/gacha" className="block text-sm text-gray-500 hover:text-plum-600 transition-colors">Pull Cards</Link>
              <Link href="/marketplace" className="block text-sm text-gray-500 hover:text-plum-600 transition-colors">Marketplace</Link>
              <Link href="/pool" className="block text-sm text-gray-500 hover:text-plum-600 transition-colors">Pool Explorer</Link>
              <Link href="/redeem" className="block text-sm text-gray-500 hover:text-plum-600 transition-colors">Redeem Physical</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Legal</h4>
            <div className="space-y-2">
              <Link href="/pool" className="block text-sm text-gray-500 hover:text-plum-600 transition-colors">Odds Disclosure</Link>
              <a href="https://basescan.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-plum-600 transition-colors">Verify On-Chain</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact</h4>
            <a href="mailto:support@rarecandy.io" className="text-sm text-gray-500 hover:text-plum-600 transition-colors">
              support@rarecandy.io
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            Odds are calculated in real-time based on pool contents. Average item value is $107.86 USD.
            Cards are physical PSA 10 graded Pokemon cards vaulted in the USA. This is not financial advice.
            Every NFT corresponds to a real physical card you have the right to redeem.
          </p>
        </div>
      </div>
    </footer>
  );
}
