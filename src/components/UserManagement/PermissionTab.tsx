import { PERMISSION_CATALOG } from "@/config/permission.config";

type CatalogPermission = (typeof PERMISSION_CATALOG)[number];

function groupPermissionsByFeature() {
  return PERMISSION_CATALOG.reduce<Record<string, CatalogPermission[]>>(
    (groups, permission) => {
      (groups[permission.feature] ??= []).push(permission);
      return groups;
    },
    {},
  );
}

export function PermissionTab() {
  const permissionsByFeature = Object.entries(groupPermissionsByFeature());

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive border rounded">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Action</th>
                <th>Label</th>
                <th>Permission key</th>
              </tr>
            </thead>
            <tbody>
              {permissionsByFeature.flatMap(([feature, permissions]) =>
                permissions.map((permission, index) => (
                  <tr key={permission.key}>
                    {index === 0 && (
                      <td
                        rowSpan={permissions.length}
                        className="fw-semibold align-middle"
                      >
                        {feature}
                      </td>
                    )}
                    <td className="text-capitalize">{permission.action}</td>
                    <td>{permission.label}</td>
                    <td>
                      <code>{permission.key}</code>
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
