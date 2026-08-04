export function useAuthForm() {
  const serverError = ref("");
  const successMessage = ref("");

  function clearErrors() {
    serverError.value = "";
    successMessage.value = "";
  }

  return { serverError, successMessage, clearErrors };
}
