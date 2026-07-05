# Storage Test Plan

Stage 0D documents storage readiness but keeps runtime storage inactive.

## Current Provider

`STORAGE_PROVIDER=mock` in local, Codex Cloud and GitHub Actions.

## Future Activation Tests

- Upload and download binary file.
- Verify checksum and size.
- Verify tenant-scoped path.
- Verify signed URL expiry.
- Verify audit event for sensitive writes.
- Verify storage config hash in deployment manifest.
- Verify production storage is unavailable from CI and Codex.

## Required Before Runtime Use

- Storage adapter ADR.
- Tests for metadata, checksum and tenancy.
- Abacus staging storage smoke result.
- Rollback procedure for storage policy changes.
