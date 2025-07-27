import { ValidationResult } from "../types";

export class TodoValidator {
  static validateText(text: string): ValidationResult {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return {
        isValid: false,
        errorMessage: "Task cannot be empty",
      };
    }
    return { isValid: true };
  }
}
