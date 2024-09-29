export const validationHandler = (errors: any) => {
  if (errors.length > 0) {
    return Object.assign(
      {},
      ...errors?.map((it: any) => ({
        [it.property]: (it.constraints && Object.values(it.constraints)) || [],
      }))
    );
  }
  return [];
};
