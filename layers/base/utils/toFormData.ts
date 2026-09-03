export function toFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    let val = obj[key];

    // Handle null/undefined (prevent literal "null" strings)
    if (val === null || val === undefined) {
      val = "";
    }

    // Handle booleans (true -> 1, false -> 0)
    if (val === true) val = 1;
    if (val === false) val = 0;

    // Note: If you have Arrays, you might need extra logic to loop through them,
    // but for standard flat objects this is perfect.
    formData.append(key, val as string | Blob);
  }

  return formData;
}
