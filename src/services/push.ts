import { apiAuth } from "./api";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push no soportado");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permiso denegado");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");

  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!vapidKey) {
    throw new Error("VITE_VAPID_PUBLIC_KEY no definida");
  }

  const newKey = urlBase64ToUint8Array(vapidKey);
  let subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const currentKey = subscription.options.applicationServerKey;
    const keysMatch = currentKey &&
      currentKey.byteLength === newKey.byteLength &&
      new Uint8Array(currentKey).every((val, i) => val === newKey[i]);

    if (keysMatch) {
      await apiAuth.post("/push/subscribe", subscription);
      return subscription;
    }

    await subscription.unsubscribe();
  }

  subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: newKey,
  });

  await apiAuth.post("/push/subscribe", subscription);

  return subscription;
}

export async function unsubscribeFromPush() {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await subscription.unsubscribe();
  await apiAuth.delete("/push/subscribe", { data: subscription });
}
