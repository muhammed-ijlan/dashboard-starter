import type { RuleObject } from "antd/es/form";
import type { ZodType } from "zod";

export function zodValidator<T>(schema: ZodType<T>): RuleObject {
  return {
    validator: async (_: RuleObject, value: unknown) => {
      const result = schema.safeParse(value);
      if (!result.success) {
        return Promise.reject(result.error.issues[0]?.message ?? "Validation failed");
      }
      return Promise.resolve();
    },
  };
}
