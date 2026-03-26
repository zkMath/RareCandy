/**
 * Card Type Registry
 *
 * Maps each of our 60 unique card types to:
 *   - our internal cardTypeKey (used in DB and onchain)
 *   - PokeTrace card ID
 *   - PokemonPriceTracker TCGPlayer ID
 *   - fallback eBay search query (for manual verification)
 *
 * Card type key format: {TIER}-{SET}-{CARD_NUMBER}-{SHORT_NAME}
 * Example: BASE-SVI-086-GARDEVOIR_EX_IR
 *
 * NOTE: PokeTrace IDs and PPT TCGPlayer IDs below are placeholders.
 * Replace with real IDs from each API's card search endpoint before going live.
 *
 * PokeTrace search: GET /v1/cards?search={name}&grade=PSA10
 * PPT search: GET /api/v2/cards?search={name}
 */

import type { CardIdentifiers } from "./adapters";

export const CARD_REGISTRY: CardIdentifiers[] = [

  // ── BASE TIER ($60–$80 PSA 10) ──────────────────────────────────────────
  {
    cardTypeKey:    "BASE-SVI-086-GARDEVOIR_EX_IR",
    poketraceId:    "svi-086-psa10",
    pptTcgPlayerId: "sv1-86",
    ebaySearchQuery: "Gardevoir ex SVI 086 PSA 10 Scarlet Violet",
  },
  {
    cardTypeKey:    "BASE-OBF-125-CHARIZARD_EX_IR",
    poketraceId:    "obf-125-psa10",
    pptTcgPlayerId: "sv3-125",
    ebaySearchQuery: "Charizard ex OBF 125 PSA 10 Obsidian Flames",
  },
  {
    cardTypeKey:    "BASE-SVI-172-PIKACHU_IR",
    poketraceId:    "svi-172-psa10",
    pptTcgPlayerId: "sv1-172",
    ebaySearchQuery: "Pikachu SVI 172 PSA 10 Scarlet Violet Base",
  },
  {
    cardTypeKey:    "BASE-MEW-133-EEVEE_IR",
    poketraceId:    "mew-133-psa10",
    pptTcgPlayerId: "sv3pt5-133",
    ebaySearchQuery: "Eevee MEW 133 PSA 10 Pokemon 151",
  },
  {
    cardTypeKey:    "BASE-MEW-205-MEWTWO_EX_IR",
    poketraceId:    "mew-205-psa10",
    pptTcgPlayerId: "sv3pt5-205",
    ebaySearchQuery: "Mewtwo ex MEW 205 PSA 10 Pokemon 151",
  },
  {
    cardTypeKey:    "BASE-OBF-155-ARCANINE_EX_IR",
    poketraceId:    "obf-155-psa10",
    pptTcgPlayerId: "sv3-155",
    ebaySearchQuery: "Arcanine ex OBF 155 PSA 10 Obsidian Flames",
  },
  {
    cardTypeKey:    "BASE-PAL-227-MIRAIDON_EX_IR",
    poketraceId:    "pal-227-psa10",
    pptTcgPlayerId: "sv2-227",
    ebaySearchQuery: "Miraidon ex PAL 227 PSA 10 Paldea Evolved",
  },
  {
    cardTypeKey:    "BASE-SVI-225-KORAIDON_EX_IR",
    poketraceId:    "svi-225-psa10",
    pptTcgPlayerId: "sv1-225",
    ebaySearchQuery: "Koraidon ex SVI 225 PSA 10 Scarlet Violet Base",
  },
  {
    cardTypeKey:    "BASE-PAF-099-FLYGON_EX_IR",
    poketraceId:    "paf-099-psa10",
    pptTcgPlayerId: "sv4pt5-99",
    ebaySearchQuery: "Flygon ex PAF 099 PSA 10 Paldean Fates",
  },
  {
    cardTypeKey:    "BASE-PAL-185-IONO_FA",
    poketraceId:    "pal-185-psa10",
    pptTcgPlayerId: "sv2-185",
    ebaySearchQuery: "Iono PAL 185 Full Art PSA 10 Paldea Evolved",
  },
  {
    cardTypeKey:    "BASE-SVI-189-PROF_SADA_FA",
    poketraceId:    "svi-189-psa10",
    pptTcgPlayerId: "sv1-189",
    ebaySearchQuery: "Professor Sada SVI 189 Full Art PSA 10",
  },
  {
    cardTypeKey:    "BASE-SVI-191-PENNY_FA",
    poketraceId:    "svi-191-psa10",
    pptTcgPlayerId: "sv1-191",
    ebaySearchQuery: "Penny SVI 191 Full Art PSA 10 Scarlet Violet",
  },
  {
    cardTypeKey:    "BASE-MEW-208-MISTY_FA",
    poketraceId:    "mew-208-psa10",
    pptTcgPlayerId: "sv3pt5-208",
    ebaySearchQuery: "Misty MEW 208 Full Art PSA 10 Pokemon 151",
  },
  {
    cardTypeKey:    "BASE-MEW-197-BROCK_FA",
    poketraceId:    "mew-197-psa10",
    pptTcgPlayerId: "sv3pt5-197",
    ebaySearchQuery: "Brock MEW 197 Full Art PSA 10 Pokemon 151",
  },
  {
    cardTypeKey:    "BASE-MEW-131-LAPRAS_IR",
    poketraceId:    "mew-131-psa10",
    pptTcgPlayerId: "sv3pt5-131",
    ebaySearchQuery: "Lapras MEW 131 PSA 10 Pokemon 151",
  },
  {
    cardTypeKey:    "BASE-MEW-094-GENGAR_IR",
    poketraceId:    "mew-094-psa10",
    pptTcgPlayerId: "sv3pt5-94",
    ebaySearchQuery: "Gengar MEW 094 PSA 10 Pokemon 151",
  },

  // ── MID-LOW TIER ($80–$100 PSA 10) ─────────────────────────────────────
  {
    cardTypeKey:    "MIDLOW-MEW-006-CHARIZARD_EX_IR",
    poketraceId:    "mew-006-psa10",
    pptTcgPlayerId: "sv3pt5-6",
    ebaySearchQuery: "Charizard ex MEW 006 PSA 10 Pokemon 151",
  },
  {
    cardTypeKey:    "MIDLOW-MEW-085-PIKACHU_EX_IR",
    poketraceId:    "mew-085-psa10",
    pptTcgPlayerId: "sv3pt5-85",
    ebaySearchQuery: "Pikachu ex MEW 085 PSA 10 Pokemon 151",
  },
  {
    cardTypeKey:    "MIDLOW-MEW-086-MEWTWO_EX_IR",
    poketraceId:    "mew-086-psa10",
    pptTcgPlayerId: "sv3pt5-86",
    ebaySearchQuery: "Mewtwo ex MEW 086 PSA 10 Pokemon 151",
  },
  {
    cardTypeKey:    "MIDLOW-MEW-143-SNORLAX_IR",
    poketraceId:    "mew-143-psa10",
    pptTcgPlayerId: "sv3pt5-143",
    ebaySearchQuery: "Snorlax MEW 143 PSA 10 Pokemon 151",
  },
  {
    cardTypeKey:    "MIDLOW-EVS-205-LEAFEON_VMAX_AA",
    poketraceId:    "evs-205-psa10",
    pptTcgPlayerId: "swsh7-205",
    ebaySearchQuery: "Leafeon VMAX EVS 205 Alt Art PSA 10 Evolving Skies",
  },
  {
    cardTypeKey:    "MIDLOW-EVS-209-GLACEON_VMAX_AA",
    poketraceId:    "evs-209-psa10",
    pptTcgPlayerId: "swsh7-209",
    ebaySearchQuery: "Glaceon VMAX EVS 209 Alt Art PSA 10 Evolving Skies",
  },
  {
    cardTypeKey:    "MIDLOW-BRS-165-RAIKOU_V_AA",
    poketraceId:    "brs-165-psa10",
    pptTcgPlayerId: "swsh9-165",
    ebaySearchQuery: "Raikou V BRS 165 Alt Art PSA 10 Brilliant Stars",
  },
  {
    cardTypeKey:    "MIDLOW-ASR-179-DARKRAI_VSTAR_AA",
    poketraceId:    "asr-179-psa10",
    pptTcgPlayerId: "swsh10-179",
    ebaySearchQuery: "Darkrai VSTAR ASR 179 Alt Art PSA 10 Astral Radiance",
  },
  {
    cardTypeKey:    "MIDLOW-EVS-210-SUICUNE_V_AA",
    poketraceId:    "evs-210-psa10",
    pptTcgPlayerId: "swsh7-210",
    ebaySearchQuery: "Suicune V EVS 210 Alt Art PSA 10 Evolving Skies",
  },
  {
    cardTypeKey:    "MIDLOW-BRS-164-ENTEI_V_AA",
    poketraceId:    "brs-164-psa10",
    pptTcgPlayerId: "swsh9-164",
    ebaySearchQuery: "Entei V BRS 164 Alt Art PSA 10 Brilliant Stars",
  },
  {
    cardTypeKey:    "MIDLOW-LOR-180-TORNADUS_AA",
    poketraceId:    "lor-180-psa10",
    pptTcgPlayerId: "swsh11-180",
    ebaySearchQuery: "Tornadus LOR 180 Alt Art PSA 10 Lost Origin",
  },
  {
    cardTypeKey:    "MIDLOW-BRS-156-LUMINEON_V_AA",
    poketraceId:    "brs-156-psa10",
    pptTcgPlayerId: "swsh9-156",
    ebaySearchQuery: "Lumineon V BRS 156 Alt Art PSA 10 Brilliant Stars",
  },
  {
    cardTypeKey:    "MIDLOW-PGO-011-RADIANT_CHARIZARD",
    poketraceId:    "pgo-011-psa10",
    pptTcgPlayerId: "swshp-011",
    ebaySearchQuery: "Radiant Charizard PGO 011 PSA 10 Pokemon Go",
  },
  {
    cardTypeKey:    "MIDLOW-ASR-046-RADIANT_GRENINJA",
    poketraceId:    "asr-046-psa10",
    pptTcgPlayerId: "swsh10-46",
    ebaySearchQuery: "Radiant Greninja ASR 046 PSA 10 Astral Radiance",
  },

  // ── MID TIER ($100–$200 PSA 10) ─────────────────────────────────────────
  {
    cardTypeKey:    "MID-SVI-205-GARDEVOIR_EX_SIR",
    poketraceId:    "svi-205-psa10",
    pptTcgPlayerId: "sv1-205",
    ebaySearchQuery: "Gardevoir ex SVI 205 SIR PSA 10",
  },
  {
    cardTypeKey:    "MID-OBF-196-ARCANINE_EX_SIR",
    poketraceId:    "obf-196-psa10",
    pptTcgPlayerId: "sv3-196",
    ebaySearchQuery: "Arcanine ex OBF 196 SIR PSA 10",
  },
  {
    cardTypeKey:    "MID-PAL-251-MIRAIDON_EX_SIR",
    poketraceId:    "pal-251-psa10",
    pptTcgPlayerId: "sv2-251",
    ebaySearchQuery: "Miraidon ex PAL 251 SIR PSA 10",
  },
  {
    cardTypeKey:    "MID-MEW-234-PIKACHU_EX_SIR",
    poketraceId:    "mew-234-psa10",
    pptTcgPlayerId: "sv3pt5-234",
    ebaySearchQuery: "Pikachu ex MEW 234 SIR PSA 10",
  },
  {
    cardTypeKey:    "MID-MEW-232-MEWTWO_EX_SIR",
    poketraceId:    "mew-232-psa10",
    pptTcgPlayerId: "sv3pt5-232",
    ebaySearchQuery: "Mewtwo ex MEW 232 SIR PSA 10",
  },
  {
    cardTypeKey:    "MID-OBF-234-CHARIZARD_EX_SIR",
    poketraceId:    "obf-234-psa10",
    pptTcgPlayerId: "sv3-234",
    ebaySearchQuery: "Charizard ex OBF 234 SIR PSA 10",
  },
  {
    cardTypeKey:    "MID-PAL-254-IONO_SIR",
    poketraceId:    "pal-254-psa10",
    pptTcgPlayerId: "sv2-254",
    ebaySearchQuery: "Iono PAL 254 SIR PSA 10",
  },
  {
    cardTypeKey:    "MID-EVS-205-ESPEON_VMAX_AA",
    poketraceId:    "evs-205-espeon-psa10",
    pptTcgPlayerId: "swsh7-205-espeon",
    ebaySearchQuery: "Espeon VMAX EVS 205 Alt Art PSA 10",
  },
  {
    cardTypeKey:    "MID-EVS-212-SYLVEON_VMAX_AA",
    poketraceId:    "evs-212-psa10",
    pptTcgPlayerId: "swsh7-212",
    ebaySearchQuery: "Sylveon VMAX EVS 212 Alt Art PSA 10",
  },
  {
    cardTypeKey:    "MID-EVS-218-RAYQUAZA_VMAX_AA",
    poketraceId:    "evs-218-psa10",
    pptTcgPlayerId: "swsh7-218",
    ebaySearchQuery: "Rayquaza VMAX EVS 218 Alt Art PSA 10",
  },
  {
    cardTypeKey:    "MID-FST-265-MIMIKYU_VMAX_AA",
    poketraceId:    "fst-265-psa10",
    pptTcgPlayerId: "swsh8-265",
    ebaySearchQuery: "Mimikyu VMAX FST 265 Alt Art PSA 10",
  },
  {
    cardTypeKey:    "MID-ASR-193-PALKIA_VSTAR_AA",
    poketraceId:    "asr-193-psa10",
    pptTcgPlayerId: "swsh10-193",
    ebaySearchQuery: "Origin Forme Palkia VSTAR ASR 193 Alt Art PSA 10",
  },
  {
    cardTypeKey:    "MID-FST-269-MEW_VMAX_AA",
    poketraceId:    "fst-269-psa10",
    pptTcgPlayerId: "swsh8-269",
    ebaySearchQuery: "Mew VMAX FST 269 Alt Art PSA 10",
  },
  {
    cardTypeKey:    "MID-CRE-179-AEGISLASH_V_AA",
    poketraceId:    "cre-179-psa10",
    pptTcgPlayerId: "swsh6-179",
    ebaySearchQuery: "Aegislash V CRE 179 Alt Art PSA 10",
  },
  {
    cardTypeKey:    "MID-SIT-174-DITTO_VSTAR_AA",
    poketraceId:    "sit-174-psa10",
    pptTcgPlayerId: "swsh11-174",
    ebaySearchQuery: "Ditto VSTAR SIT 174 Alt Art PSA 10",
  },

  // ── HIGH TIER ($200–$400 PSA 10) ─────────────────────────────────────────
  {
    cardTypeKey:    "HIGH-BRS-174-CHARIZARD_VSTAR_RAINBOW",
    poketraceId:    "brs-174-psa10",
    pptTcgPlayerId: "swsh9-174",
    ebaySearchQuery: "Charizard VSTAR BRS 174 Rainbow Rare PSA 10",
  },
  {
    cardTypeKey:    "HIGH-MEW-221-MEGA_GENGAR_EX_SAR",
    poketraceId:    "mew-221-psa10",
    pptTcgPlayerId: "sv3pt5-221",
    ebaySearchQuery: "Mega Gengar ex MEW 221 SAR PSA 10 Pokemon 151",
  },
  {
    cardTypeKey:    "HIGH-PAF-054-CHARIZARD_EX_SIR",
    poketraceId:    "paf-054-psa10",
    pptTcgPlayerId: "sv4pt5-54",
    ebaySearchQuery: "Charizard ex PAF 054 SIR PSA 10 Paldean Fates",
  },
  {
    cardTypeKey:    "HIGH-SWSH039-PIKACHU_VMAX_PROMO",
    poketraceId:    "swsh039-psa10",
    pptTcgPlayerId: "swshp-039",
    ebaySearchQuery: "Pikachu VMAX SWSH039 Promo PSA 10",
  },
  {
    cardTypeKey:    "HIGH-SIT-211-LUGIA_VSTAR_AA",
    poketraceId:    "sit-211-psa10",
    pptTcgPlayerId: "swsh11-211",
    ebaySearchQuery: "Lugia VSTAR SIT 211 Alt Art PSA 10",
  },
  {
    cardTypeKey:    "HIGH-LOR-201-GIRATINA_VSTAR_AA",
    poketraceId:    "lor-201-psa10",
    pptTcgPlayerId: "swsh11-201",
    ebaySearchQuery: "Origin Forme Giratina VSTAR LOR 201 Alt Art PSA 10",
  },
  {
    cardTypeKey:    "HIGH-FST-114-MEW_VMAX_HR",
    poketraceId:    "fst-114-psa10",
    pptTcgPlayerId: "swsh8-114",
    ebaySearchQuery: "Mew VMAX FST 114 Hyper Rare PSA 10",
  },
  {
    cardTypeKey:    "HIGH-CRZ-200-DEOXYS_VMAX_AA",
    poketraceId:    "crz-200-psa10",
    pptTcgPlayerId: "swsh12pt5-200",
    ebaySearchQuery: "Deoxys VMAX CRZ 200 Alt Art PSA 10",
  },

  // ── LEGENDARY TIER ($400–$1,600 PSA 10) ─────────────────────────────────
  {
    cardTypeKey:    "LEG-EVS-215-UMBREON_VMAX_AA",
    poketraceId:    "evs-215-psa10",
    pptTcgPlayerId: "swsh7-215",
    ebaySearchQuery: "Umbreon VMAX EVS 215 Alt Art PSA 10 Evolving Skies",
  },
  {
    cardTypeKey:    "LEG-PAL-215-UMBREON_EX_SIR",
    poketraceId:    "pal-215-psa10",
    pptTcgPlayerId: "sv2-215",
    ebaySearchQuery: "Umbreon ex PAL 215 SIR PSA 10 Paldea Evolved",
  },
  {
    cardTypeKey:    "LEG-SWSH044-CHARIZARD_VMAX_SHINY",
    poketraceId:    "swsh044-psa10",
    pptTcgPlayerId: "swshp-044",
    ebaySearchQuery: "Charizard VMAX SWSH044 Shiny PSA 10 Promo",
  },
  {
    cardTypeKey:    "LEG-SWSH188-PIKACHU_VMAX_PROMO",
    poketraceId:    "swsh188-psa10",
    pptTcgPlayerId: "swshp-188",
    ebaySearchQuery: "Pikachu VMAX SWSH188 Promo PSA 10",
  },
];

// Quick lookup by key
export const REGISTRY_MAP = new Map(
  CARD_REGISTRY.map(c => [c.cardTypeKey, c])
);
