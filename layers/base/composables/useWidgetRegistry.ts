import type { Component } from "vue";

const _registry: Record<string, Component> = {};

export const useWidgetRegistry = () => {
  const register = (map: Record<string, Component>) => {
    Object.assign(_registry, map);
  };
  const resolve = (path: string): Component | null => _registry[path] ?? null;
  return { register, resolve };
};
