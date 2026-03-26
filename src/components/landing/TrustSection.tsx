export function TrustSection() {
  const features = [
    {
      title: "Vaulted at PSA Vault",
      desc: "Every card is professionally authenticated, graded PSA 10, and stored in a US-based secure vault facility. Your NFT is your claim.",
      icon: (
        <svg className="w-5 h-5 text-plum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: "Odds On-Chain",
      desc: "Pool contents and pull probabilities are readable directly from smart contracts on Base. Verify yourself on Basescan anytime.",
      icon: (
        <svg className="w-5 h-5 text-plum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Chainlink VRF",
      desc: "Pulls use Chainlink's Verifiable Random Function for provably fair randomness. No one can influence the outcome — not even us.",
      icon: (
        <svg className="w-5 h-5 text-plum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "85% Buyback",
      desc: "Don't love your pull? Sell it back within 72 hours at 85% of fair market value. Guaranteed by the on-chain buyback vault.",
      icon: (
        <svg className="w-5 h-5 text-plum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Redeem Physical",
      desc: "Request physical delivery at any time. Your PSA 10 card ships insured from the vault directly to your door for a $20 fee.",
      icon: (
        <svg className="w-5 h-5 text-plum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: "Real-Time Oracle",
      desc: "Fair market values are updated every 6 hours from PokeTrace and PokemonPriceTracker data with outlier rejection and circuit breakers.",
      icon: (
        <svg className="w-5 h-5 text-plum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-10">
      <div
        className="rounded-[28px] border border-white/60 backdrop-blur-md p-8 md:p-12"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
        }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Built on trust, <br className="hidden md:block" />verified on-chain
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Every aspect of RareCandy is designed for transparency and player protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-4 py-5 px-4 rounded-xl hover:bg-white/40 transition-colors"
            >
              <div className="w-10 h-10 bg-plum-100 rounded-xl flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
