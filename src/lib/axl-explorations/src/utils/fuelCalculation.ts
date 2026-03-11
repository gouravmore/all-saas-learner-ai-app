/**
 * Fuel Calculation Utility
 * 
 * Reusable fuel calculation system for games.
 * This will eventually replace stars in all games.
 * 
 * Default Speed tiers (Letter Launcher, Word Detective):
 * - 0 - 1s: +5 fuel
 * - 1 - 2.5s: +3 fuel
 * - > 2.5s: +1 fuel
 * - Wrong answer: +0 fuel
 * 
 * Odd One Out Speed tiers:
 * - 0 - 3s: +5 fuel
 * - 3 - 6s: +3 fuel
 * - > 6s: +1 fuel
 * - Wrong answer: +0 fuel
 */

export interface FuelCalculationResult {
  fuelEarned: number;
  speedTier: 'fast' | 'medium' | 'slow' | 'wrong';
}

/**
 * Calculate fuel earned based on response time and correctness
 * @param responseTime - Response time in milliseconds
 * @param isCorrect - Whether the answer was correct
 * @param gameType - Optional game type to use different thresholds ('oddOneOut' for custom thresholds, default for standard)
 * @returns Fuel calculation result
 */
export function calculateFuel(responseTime: number, isCorrect: boolean, gameType?: string): FuelCalculationResult {
  if (!isCorrect) {
    return {
      fuelEarned: 0,
      speedTier: 'wrong'
    };
  }

  // Odd One Out uses different thresholds
  if (gameType === 'oddOneOut') {
    if (responseTime <= 3000) {
      return {
        fuelEarned: 5,
        speedTier: 'fast'
      };
    } else if (responseTime <= 6000) {
      return {
        fuelEarned: 3,
        speedTier: 'medium'
      };
    } else {
      return {
        fuelEarned: 1,
        speedTier: 'slow'
      };
    }
  }

  // Default thresholds for Letter Launcher and Word Detective
  if (responseTime <= 1000) {
    return {
      fuelEarned: 5,
      speedTier: 'fast'
    };
  } else if (responseTime <= 2500) {
    return {
      fuelEarned: 3,
      speedTier: 'medium'
    };
  } else {
    return {
      fuelEarned: 1,
      speedTier: 'slow'
    };
  }
}

export function getFuelRequirement(level: number, contentCount?: number): { requiredFuel: number; maxFuel: number } {
  // Use provided contentCount or default to 30 for backward compatibility
  const questionsPerLevel = contentCount || 30;
  const maxFuel = questionsPerLevel * 5; // Max fuel = contentCount * 5 (max fuel per question)
  
  // Calculate required fuel as a percentage of max fuel based on level
  // Level 1-3: ~53% of max fuel (80/150 for 30 questions)
  // Level 4-6: ~67% of max fuel (100/150 for 30 questions)
  // Level 7-10: ~80% of max fuel (120/150 for 30 questions)
  let requiredFuelPercentage: number;
    requiredFuelPercentage = 80 / 100; // 80%
  
  // Scale required fuel based on actual content count
  const requiredFuel = Math.round(maxFuel * requiredFuelPercentage);
  
  return { maxFuel, requiredFuel };
}

/**
 * Get mission destination name for a level
 * @param level - Level number (1-based)
 * @returns Destination name
 */
export function getMissionDestination(level: number): string {
  const destinations: Record<number, string> = {
    1: 'Moon',
    2: 'Mars',
    3: 'Jupiter',
    4: 'Saturn',
    5: 'Venus',
    6: 'Uranus',
    7: 'Neptune',
    8: 'Mercury',
    9: 'Pluto',
    10: 'Sun'
  };

  return destinations[level] || `Planet ${level}`;
}

/**
 * Get fuel tier display text
 * @param speedTier - Speed tier
 * @returns Display text
 */
export function getFuelTierText(speedTier: FuelCalculationResult['speedTier']): string {
  const texts = {
    fast: 'Fuel +5!',
    medium: 'Fuel +3!',
    slow: 'Fuel +1!',
    wrong: 'No Fuel'
  };
  return texts[speedTier];
}

