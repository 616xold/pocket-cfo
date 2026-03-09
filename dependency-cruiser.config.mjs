/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: "no-app-to-app-imports",
      from: { path: "^apps/([^/]+)/" },
      to: { path: "^apps/([^/]+)/", pathNot: "^apps/$1/" },
      severity: "error"
    },
    {
      name: "domain-must-stay-pure",
      from: { path: "^packages/domain/" },
      to: {
        path: "^apps/|^packages/(db|codex-runtime)/"
      },
      severity: "error"
    },
    {
      name: "web-cannot-import-db-directly",
      from: { path: "^apps/web/" },
      to: { path: "^packages/db/" },
      severity: "error"
    }
  ],
  options: {
    tsConfig: {
      fileName: "./tsconfig.json"
    },
    doNotFollow: {
      path: "node_modules"
    },
    includeOnly: "^apps|^packages"
  }
};
