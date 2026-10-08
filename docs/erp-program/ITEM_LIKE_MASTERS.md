# Item-like master inventory

No construction catalog/master entity was located in `prisma/schema.prisma` or the checked-in migration.

| Master domain | Existing table/model | Evidence / disposition |
|---|---|---|
| Materials / inventory items | None | No item, stock, UOM, or warehouse entity found |
| Services / subcontract work | None | No service or subcontract catalogue found |
| Labour / trade categories | None | No labour classification or rate-card entity found |
| Equipment / plant types | None | No equipment catalogue found |
| BOQ / cost-code / WBS libraries | None | No BOQ, cost code, WBS, activity, or resource library found |
| Supplier / customer / employee masters | None | No corresponding model found |
| Organization/project shells | `Company`, `Project` | Present only as declared platform entities; database deployment is unverified |

All construction-domain entries are **NEW (not yet implemented)**, not evidence that an alternate master system was checked or reconciled. Respect future canonical-master ownership before adding duplicates.
