// Level configurations for different game themes

export interface LevelConfig {
  name: string;
  image: string;
}

// Space theme (Letter Launcher) - 10 levels
export const SPACE_LEVEL_CONFIG: Record<number, LevelConfig> = {
  1: { name: "Moon", image: "🌙" },
  2: { name: "Mars", image: "🔴" },
  3: { name: "Jupiter", image: "🪐" },
  4: { name: "Saturn", image: "🪐" },
  5: { name: "Venus", image: "🟠" },
  6: { name: "Uranus", image: "🔵" },
  7: { name: "Neptune", image: "🔵" },
  8: { name: "Mercury", image: "⚫" },
  9: { name: "Pluto", image: "⚪" },
  10: { name: "Sun", image: "☀️" },
};

// Detective theme - 10 levels
export const DETECTIVE_LEVEL_CONFIG: Record<number, LevelConfig> = {
  1: { name: "Case 1", image: "🔍" },
  2: { name: "Case 2", image: "🔍" },
  3: { name: "Case 3", image: "🔍" },
  4: { name: "Case 4", image: "🔍" },
  5: { name: "Case 5", image: "🔍" },
  6: { name: "Case 6", image: "🔍" },
  7: { name: "Case 7", image: "🔍" },
  8: { name: "Case 8", image: "🔍" },
  9: { name: "Case 9", image: "🔍" },
  10: { name: "Case 10", image: "🔍" },
};

// Superhero theme - 10 levels
export const SUPERHERO_LEVEL_CONFIG: Record<number, LevelConfig> = {
  1: { name: "Mission 1", image: "🦸" },
  2: { name: "Mission 2", image: "🦸" },
  3: { name: "Mission 3", image: "🦸" },
  4: { name: "Mission 4", image: "🦸" },
  5: { name: "Mission 5", image: "🦸" },
  6: { name: "Mission 6", image: "🦸" },
  7: { name: "Mission 7", image: "🦸" },
  8: { name: "Mission 8", image: "🦸" },
  9: { name: "Mission 9", image: "🦸" },
  10: { name: "Mission 10", image: "🦸" },
};
