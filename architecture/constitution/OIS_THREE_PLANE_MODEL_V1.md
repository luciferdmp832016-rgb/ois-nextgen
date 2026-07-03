# OIS Three Plane Model V1

## OIS Platform Core

Shared kernel services, data models, contracts, repositories, audit, observability and tenant context.

## OIS Control Plane

Administrative experience for organizations, workspaces, projects, product catalog, product installations, identity, access, modules and architecture status.

## Product Experience Plane

End-user product shells such as PITS, csAgent, KEIHB and ICR. A product shell uses product APIs/BFFs and never owns platform governance.

## Direction

Product Shell -> Product API/BFF -> Domain Service -> Core Capability -> Repository -> Database
