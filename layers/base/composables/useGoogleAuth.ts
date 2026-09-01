declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (r: { credential: string }) => void;
          }) => void;
          renderButton: (
            el: HTMLElement,
            config: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

export function useGoogleAuth() {
  const config = useRuntimeConfig();
  const scriptLoaded = ref(false);

  function loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        scriptLoaded.value = true;
        return resolve();
      }
      // Prevent double-injection if the tag already exists but hasn't loaded yet
      const existing = document.getElementById(
        "google-gsi-script",
      ) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", () => {
          scriptLoaded.value = true;
          resolve();
        });
        existing.addEventListener("error", reject);
        return;
      }
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoaded.value = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function renderButton(
    el: HTMLElement,
    onCredential: (idToken: string) => void,
  ) {
    await loadScript();
    window.google.accounts.id.initialize({
      client_id: (config.public.googleClientId as string) || "",
      callback: (response) => onCredential(response.credential),
    });
    window.google.accounts.id.renderButton(el, {
      theme: "outline",
      size: "large",
      width: el.clientWidth,
      text: "continue_with",
    });
  }

  return { loadScript, renderButton, scriptLoaded };
}
