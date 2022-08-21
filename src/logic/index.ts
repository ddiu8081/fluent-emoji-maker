import { createSignal } from "solid-js";

export const [isDark, setDark] = createSignal(!!localStorage.getItem('dark'))