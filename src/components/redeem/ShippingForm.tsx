"use client";

import { useState } from "react";

interface ShippingFormProps {
  cardName: string;
  onSubmit: (data: {
    shippingName: string;
    shippingAddress: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
  }) => void;
  onBack: () => void;
}

export function ShippingForm({ cardName, onSubmit, onBack }: ShippingFormProps) {
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("US");

  const isValid = name && line1 && city && state && postcode && country;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      shippingName: name,
      shippingAddress: {
        line1,
        line2: line2 || undefined,
        city,
        state,
        postcode,
        country,
      },
    });
  };

  return (
    <div
      className="rounded-[28px] border border-white/60 backdrop-blur-md p-6 md:p-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
      }}
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Shipping Details</h2>
        <p className="text-sm text-gray-500 mt-1">
          Where should we send <span className="font-medium">{cardName}</span>?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
          <input
            type="text"
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
          <input
            type="text"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
            >
              <option value="US">United States</option>
              <option value="AU">Australia</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="JP">Japan</option>
              <option value="DE">Germany</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="flex-1 px-6 py-3 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors disabled:opacity-50"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
