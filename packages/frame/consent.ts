// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// A light cookie consent for a site's own preferences (for example, the
// docs' full-width choice). There's no tracking behind it: it only decides
// whether a preference is remembered on this machine.
//
// - Before the visitor answers, nothing is written to storage. Preferences
//   live in memory for the page view, and setting one asks for an answer
//   (asking()), so a banner only shows to someone who changed something.
// - Accepting writes the answer and the preferences to storage, now and
//   from then on.
// - Declining removes anything stored and keeps preferences in memory only.
//   The refusal itself isn't stored either, so a later visit can ask again.
//
// Framework-free: a site wires it to its UI (use-consent.ts for React).

export type Consent = {
  accept(): void;
  // Asks for an answer without setting anything (a switch that does nothing
  // until the visitor answers). No-op once they have.
  ask(): void;
  asking(): boolean;
  decline(): void;
  get(name: string): null | string;
  // Bumped on every change, for a UI that needs a value to compare.
  revision(): number;
  set(name: string, value: string): void;
  state(): ConsentState;
  subscribe(listener: () => void): () => void;
};

export type ConsentState = "accepted" | "declined" | "unset";

// The part of the Web Storage API the store uses; localStorage fits.
export type StorageLike = {
  getItem(key: string): null | string;
  key(index: number): null | string;
  readonly length: number;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
};

export const DEFAULT_CONSENT_PREFIX = "frame";

// Storage can be missing (prerendering) or throw (blocked cookies, some
// private windows); either way the store carries on in memory.
const safely = <T>(action: () => T, fallback: T): T => {
  try {
    return action();
  } catch {
    return fallback;
  }
};

// The same for a write, which has nothing to fall back to.
const attempt = (action: () => void): void => {
  try {
    action();
  } catch {
    // Storage is blocked; the value stays in memory.
  }
};

export const consentKeys = (prefix: string = DEFAULT_CONSENT_PREFIX) => {
  return {
    consent: `${prefix}:consent`,
    pref: (name: string) => `${prefix}:pref:${name}`,
  };
};

export const createConsent = ({
  prefix = DEFAULT_CONSENT_PREFIX,
  storage,
}: {
  prefix?: string;
  storage: null | StorageLike;
}): Consent => {
  const keys = consentKeys(prefix);
  const read = (key: string) =>
    storage ? safely(() => storage.getItem(key), null) : null;
  const write = (key: string, value: string) =>
    storage && attempt(() => storage.setItem(key, value));
  // Only touches storage when there's something there to clear.
  const remove = (key: string) => {
    if (storage && read(key) !== null) attempt(() => storage.removeItem(key));
  };

  let state: ConsentState =
    read(keys.consent) === "accepted" ? "accepted" : "unset";
  let asking = false;
  const prefs = new Map<string, string>();
  const listeners = new Set<() => void>();
  let revision = 0;
  const changed = () => {
    revision++;
    for (const listener of listeners) listener();
  };

  // The preference names this store has written, found by key prefix, so a
  // decline can clear them without a list kept anywhere else.
  const storedNames = (): string[] => {
    if (!storage) return [];
    const prefPrefix = keys.pref("");
    return safely(() => {
      const names: string[] = [];
      for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);
        if (key?.startsWith(prefPrefix))
          names.push(key.slice(prefPrefix.length));
      }
      return names;
    }, []);
  };

  return {
    accept() {
      state = "accepted";
      asking = false;
      write(keys.consent, "accepted");
      for (const [name, value] of prefs) write(keys.pref(name), value);
      changed();
    },
    ask() {
      if (state !== "unset" || asking) return;
      asking = true;
      changed();
    },
    asking: () => asking,
    decline() {
      if (state === "accepted") {
        // Bring stored preferences into memory so this page view keeps them.
        for (const name of storedNames()) {
          const value = read(keys.pref(name));
          if (value !== null && !prefs.has(name)) prefs.set(name, value);
        }
      }
      state = "declined";
      asking = false;
      remove(keys.consent);
      for (const name of new Set([...prefs.keys(), ...storedNames()]))
        remove(keys.pref(name));
      changed();
    },
    get(name) {
      if (prefs.has(name)) return prefs.get(name) ?? null;
      return state === "accepted" ? read(keys.pref(name)) : null;
    },
    revision: () => revision,
    set(name, value) {
      prefs.set(name, value);
      if (state === "accepted") write(keys.pref(name), value);
      else if (state === "unset") asking = true;
      changed();
    },
    state: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

// One store per prefix for the page, made on first use in the browser, so
// every switch and the cookie bar share it. While prerendering there's no
// window and no store. Reading localStorage can throw when site data is
// blocked; the store then keeps everything in memory.
const browserStores = new Map<string, Consent>();

export const browserConsent = (
  prefix: string = DEFAULT_CONSENT_PREFIX,
  win: { localStorage: StorageLike } | undefined = typeof window === "undefined"
    ? undefined
    : (globalThis as { localStorage: StorageLike }),
): Consent | null => {
  if (!win) return null;
  let store = browserStores.get(prefix);
  if (!store) {
    let storage: null | StorageLike;
    try {
      storage = win.localStorage;
    } catch {
      storage = null;
    }
    store = createConsent({ prefix, storage });
    browserStores.set(prefix, store);
  }
  return store;
};
