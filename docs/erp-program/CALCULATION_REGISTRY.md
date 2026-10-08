# Calculation registry

**No business calculation implementation was found** in the inspected source/schema.

| Calculation | Implementation/source | Inputs/output | Worked example / golden test | Disposition |
|---|---|---|---|---|
| Accessible project count | Dashboard filters projects by authorized company role or active project membership, then uses `projects.length` | Authorized non-archived project rows → integer count | Worked rule: for a result set containing `N` authorized project rows, the displayed count is `N`. No live `N` was computed because the app is not connected to its intended database. | Simple UI record count, not a construction KPI. Preserve its authorization filter when dashboard evolves. |
| Active / on-hold project counts | Dashboard filters the already-authorized list by project status | Accessible projects → status counts | Worked rule: `active_count = count(project.status == ACTIVE)` and `on_hold_count = count(project.status == ON_HOLD)` within the authorized result set; no sample/live values are fabricated. | UI summary counts only; no financial or schedule formula. |

No rates, quantity extensions, tax/GST/TDS, currency conversion, invoice totals, stock valuation, payroll, earned value, BOQ, budget, cost, or progress formulas were found. Do not assume formulas, rounding conventions, or golden report outputs exist. Parts owning calculations must first nominate one authoritative engine and add documented worked examples/tests.
