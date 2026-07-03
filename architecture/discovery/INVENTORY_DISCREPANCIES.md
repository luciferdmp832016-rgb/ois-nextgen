# Inventory Discrepancies

## Service Count Difference

The prior platform audit reports 81 service files. The authoritative source scan reports 100 service files.

The reconciliation package explains the difference as a lag between the prior audit and the current source tree. The source tree is authoritative for Stage A because it was generated directly from the supplied source-reference package.

## Reconciled Counts

| Metric | Prior Report | Source Scan | Stage A Position |
|---|---:|---:|---|
| Pages | 90 | 90 | Reconciled |
| API route files | Not separately declared | 273 | Source scan authoritative |
| Prisma models | 135 | 135 | Reconciled |
| Service files | 81 | 100 | Source scan authoritative |

## Action

No code is generated from the 100 services in Stage A. The count is preserved only as discovery evidence until Phase 2 provides the service porting catalog and business rule catalog.
