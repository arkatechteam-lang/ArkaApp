import { ProductionInput } from "../types";

export function validateProduction(input: ProductionInput) {
  const errors: Record<string, string> = {};

  if (!input.date) errors.date = "Date is required";

  if (!input.round && input.round !== 0)
    errors.round = "Round is required";
  else if (input.round > 99)
    errors.round = "Round cannot exceed 99";

  if (!input.bricks) errors.bricks = "Bricks is required";
  if (!input.wetAsh) errors.wetAsh = "Wet Ash is required";
  if (!input.marblePowder) errors.marblePowder = "Marble Powder is required";
  if (!input.crusherPowder) errors.crusherPowder = "Crusher Powder is required";
  if (!input.flyAsh) errors.flyAsh = "Fly Ash is required";
  if (!input.cement) errors.cement = "Cement is required";

  return errors;
}