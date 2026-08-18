export const createBasePaths = (baseRoute: string) => {
  const root = baseRoute.replace(/^\//, "");
  return {
    ROOT: root,
    INDEX: `/${root}`,
  };
};

export const createCRUDPaths = (baseRoute: string, idParam: string = "id") => {
  const base = createBasePaths(baseRoute);
  return {
    ...base,
    CREATE: `${base.INDEX}/create`,
    DETAIL: (id: string = `:${idParam}`) => `${base.INDEX}/${id}`,
    EDIT: (id: string = `:${idParam}`) => `${base.INDEX}/${id}/edit`,
  };
};

export const createUpdatePaths = (baseRoute: string) => {
  const base = createBasePaths(baseRoute);
  return {
    ...base,
    EDIT: `${base.INDEX}/edit`,
  };
};
