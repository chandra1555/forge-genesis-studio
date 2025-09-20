// src/lib/utils.ts

/**
 * Cleans AI output so it can be used as raw game code.
 * - Removes markdown fences
 * - Strips explanations
 */
export function cleanAIOutput(output: string): string {
  if (!output) return "";

  // Remove markdown code fences like ```js ... ```
  let code = output.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "");

  // Remove "Here is the code" or extra explanation
  code = code.replace(/Here[\s\S]*?:/i, "").trim();

  return code;
}

/**
 * Extracts the first code block from text.
 * If no block exists, falls back to cleaned text.
 */
export function extractCodeBlock(text: string): string {
  const match = text.match(/```(?:[a-z]+)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : cleanAIOutput(text);
}

/**
 * Validates if generated code looks like usable game code.
 * Checks for key structures like function, class, update, create.
 */
export function validateGameCode(code: string): boolean {
  if (!code) return false;
  return /(function|class|update|create)/.test(code);
}

/**
 * Returns a Phaser.js scene template that AI can use as a base.
 */
export function getPhaserTemplate(sceneName: string): string {
  return `
  class ${sceneName} extends Phaser.Scene {
    constructor() {
      super('${sceneName}');
    }

    preload() {
      // Load assets here
    }

    create() {
      // Setup game objects
    }

    update() {
      // Main game loop
    }
  }

  export default ${sceneName};
  `;
}

/**
 * Utility: safe JSON parse without breaking app
 */
export function safeJsonParse<T = any>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}
