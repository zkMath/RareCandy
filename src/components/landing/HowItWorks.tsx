export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Pull",
      desc: "Connect your wallet, pay $100 USDC, and pull from the gacha machine. Chainlink VRF ensures provably fair random selection.",
      icon: (
        <svg className="w-6 h-6 text-plum-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Reveal",
      desc: "Your NFT is revealed — a real PSA 10 Pokemon card sitting in a physical vault. See its fair market value, tier, and rarity.",
      icon: (
        <svg className="w-6 h-6 text-plum-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Choose",
      desc: "Keep it, sell it back at 85% FMV within 72 hours, list it on the marketplace, or redeem the physical card shipped to your door.",
      icon: (
        <svg className="w-6 h-6 text-plum-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative z-10 max-w-6xl mx-auto px-6 py-10"
    >
      <div
        className="rounded-[28px] border border-white/60 backdrop-blur-md p-8 md:p-12"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
        }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            How RareCandy Works
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Three simple steps from pull to ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-plum-100 rounded-2xl flex items-center justify-center">
                {step.icon}
              </div>
              <div className="text-xs font-bold text-plum-400 uppercase tracking-wider mb-2">
                Step {step.num}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
