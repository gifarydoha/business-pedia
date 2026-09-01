/**
 * zodSchema — custom VeeValidate ↔ Zod v4 bridge
 *
 * @vee-validate/zod only supports Zod v3 (peer: "^3.24.0").
 * This utility wires any Zod v4 schema into VeeValidate's TypedSchema
 * interface directly, so we can use Zod v4 without the bridge package.
 *
 * Usage (identical to toTypedSchema from @vee-validate/zod):
 *   import { zodSchema } from '~/utils/zodSchema'
 *   import { LoginSchema } from '~/schemas/auth.schemas'
 *
 *   const { handleSubmit } = useForm({ validationSchema: zodSchema(LoginSchema) })
 */

import type { TypedSchema, TypedSchemaError } from "vee-validate";
import type { z, ZodTypeAny } from "zod";

export function zodSchema<T extends ZodTypeAny>(schema: T): TypedSchema<z.input<T>, z.output<T>> {
  return {
    __type: "VVTypedSchema",

    async parse(values: unknown) {
      const result = await schema.safeParseAsync(values);

      if (result.success) {
        return { value: result.data, errors: [] };
      }

      const errors: TypedSchemaError[] = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        errors: [issue.message],
      }));

      return { value: undefined, errors };
    },
  };
}
