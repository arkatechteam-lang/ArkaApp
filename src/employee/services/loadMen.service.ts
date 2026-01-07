import { LoadMan } from "../types";

/**
 * Fetch load men (employees)
 * TEMP: mocked
 * TODO: replace with Supabase query
 */
export async function fetchLoadMen(): Promise<LoadMan[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  return [
    { id: "LM-001", name: "Raju Kumar" },
    { id: "LM-002", name: "Suresh Yadav" },
    { id: "LM-003", name: "Mohan Singh" },
    { id: "LM-004", name: "Ramesh Patel" },
    { id: "LM-005", name: "Gopal Reddy" },
  ];
}
