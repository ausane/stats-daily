import { StatsWithoutDocument } from "../types";

export async function handleSubmit(formData: StatsWithoutDocument) {
  try {
    const response = await fetch("/api/stats/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const jsonResponse = await response.json();
    if (jsonResponse.duplicate) return jsonResponse;

    // Throw an error if the response status is not okay
    if (!response.ok) throw new Error("Failed to create new area!");

    // Return the JSON response
    return jsonResponse;
  } catch (error) {
    console.error("Error saving form:", error);
  }
}
