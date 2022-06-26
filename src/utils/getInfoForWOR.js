export function getCourtOutcomes() {
  const courtOutcomes = [
    "Judgment for Possession",
    "Default Judgment",
    "Consent to Enter Judgment - Tenant Vacates (without payment plan)",
    "Breach of Consent to Enter Judgment - Pay and Stay",
    "Breach of Consent to Enter Judgment - Pay and Vacate",
    "No Judgment for Possession is Entered",
    "Marini Hearing Scheduled",
    "Bankruptcy",
    "Other",
  ];

  return courtOutcomes;
}

export function getBreachTerms() {
  const breachTerms = [
    "TENANT HAS NOT VACATED",
    "FAILED TO MAKE PAYMENT",
    "BREACH OF OTHER CONDITIONS",
  ];

  return breachTerms;
}
