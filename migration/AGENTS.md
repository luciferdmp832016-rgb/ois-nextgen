# Migration Rules

- Do not import the complete legacy database during Stage A.
- Do not connect to production systems.
- Every migration action must be idempotent and reconciliable.
- Legacy identity mapping is allowed only as a scoped kernel table in Stage A.
