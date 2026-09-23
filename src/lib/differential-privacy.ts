/**
 * Differential Privacy (DP) Utility
 * 
 * Implements epsilon-differential privacy techniques to protect sensitive student quiz data
 * during the aggregation of learning analytics, as outlined in Section 5 of the architectural framework.
 */

/**
 * Generates Laplacian noise for differential privacy
 * @param scale The scale parameter (sensitivity / epsilon)
 */
export function generateLaplacianNoise(scale: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  
  // Inverse transform sampling for Laplace distribution
  const value = scale * Math.log(u1) * (u2 > 0.5 ? 1 : -1);
  return value;
}

/**
 * Applies epsilon-differential privacy to an aggregated metric (e.g., average quiz score)
 * @param exactValue The raw, exact aggregated value
 * @param epsilon Privacy budget (lower = more private, higher = more accurate)
 * @param sensitivity Maximum possible change in the output from a single user's data (e.g., 100 for a 0-100 score)
 */
export function applyDifferentialPrivacy(exactValue: number, epsilon: number = 0.5, sensitivity: number = 100): number {
  const scale = sensitivity / epsilon;
  const noise = generateLaplacianNoise(scale);
  
  // Return the noisy value, bounded to logical constraints if necessary
  const noisyValue = exactValue + noise;
  return Math.max(0, Math.min(100, noisyValue)); // Assuming 0-100 scale for scores
}
