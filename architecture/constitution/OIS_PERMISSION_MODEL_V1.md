# OIS Permission Model V1

Permissions are capability-oriented and scoped. Broad legacy permissions such as `page:intelligence` are forbidden.

Access is granted through:

- Role definitions.
- Permission definitions.
- Role-permission bindings.
- Product capability grants.
- Tenant context scope checks.

An allow decision requires both a permission/capability match and a valid scope.
