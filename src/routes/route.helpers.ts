import React from "react";
import type { RouteObject } from "react-router-dom";

export type LazyRouteComponent = () => Promise<{ default: React.ComponentType }>;

export interface RouteComponents {
  List?: LazyRouteComponent;
  Create?: LazyRouteComponent;
  Detail?: LazyRouteComponent;
  Edit?: LazyRouteComponent;
}

export interface GeneratorRoutesOptions {
  basePath: string;
  title: string;
  idParam?: string | "none";
  components: RouteComponents;
}

export const mapLazy = (importFn: LazyRouteComponent) => async () => {
  const module = await importFn();
  return { Component: module.default };
};

export const generateRoutes = ({
  basePath,
  title,
  idParam = "id",
  components,
}: GeneratorRoutesOptions): RouteObject => {
  const children: RouteObject[] = [];

  if (components.List) {
    children.push({
      index: true,
      lazy: mapLazy(components.List),
      handle: { title },
    });
  }
  if (components.Create) {
    children.push({
      path: "create",
      lazy: mapLazy(components.Create),
      handle: { title: `Create ${title}` },
    });
  }
  if (components.Detail && idParam !== "none") {
    children.push({
      path: `:${idParam}`,
      lazy: mapLazy(components.Detail),
      handle: { title: `${title} Detail` },
    });
  }
  if (components.Edit) {
    const path = idParam === "none" ? "edit" : `:${idParam}/edit`;
    children.push({
      path,
      lazy: mapLazy(components.Edit),
      handle: { title: `Edit ${title}` },
    });
  }

  return {
    ...(basePath ? { path: basePath } : {}),
    children,
  };
};
