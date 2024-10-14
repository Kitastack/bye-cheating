import "i18next"

import ns1ID from "./src/locales/id.json"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS:"ns1",
    resources: {
      ns1: typeof ns1ID
    }
  }
}