// Part 00 — internal Part audit framework (AUD-1..AUD-18, section 21).
// Assembles evidence links per Part into docs/erp-program/audit/ and maintains
// the PROGRAM_AUDIT.csv roll-up. Run via `npm run erp:audit`.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const auditDir = join(root, "docs", "erp-program", "audit");

function auditRecords() {
  if (!existsSync(auditDir)) return [];
  return readdirSync(auditDir)
    .filter((f) => /^part-\d+\.md$/.test(f))
    .sort()
    .map((f) => {
      const text = readFileSync(join(auditDir, f), "utf8");
      const field = (label) => {
        const m = text.match(new RegExp(`^\\|\\s*${label}\\s*\\|\\s*(.+?)\\s*\\|`, "m"));
        return m ? m[1] : "";
      };
      const complete = /AUD-18[\s\S]*?- \[x\]/.test(text) || /\bstatus\b[\s\S]*APPROVED/i.test(text);
      return {
        part: f.replace(/\.md$/, ""),
        file: `docs/erp-program/audit/${f}`,
        status: field("Status") || (complete ? "APPROVED" : "DRAFT"),
        audited_by: field("Audited by") || field("Implementing team")
      };
    });
}

function main() {
  const records = auditRecords();
  let csv = "part,status,audited_by,evidence_file\n";
  for (const r of records) csv += `${r.part},${r.status},${r.audited_by},${r.file}\n`;
  writeFileSync(join(auditDir, "PROGRAM_AUDIT.csv"), csv, "utf8");
  console.log("=== erp:audit — PROGRAM_AUDIT.csv roll-up ===");
  for (const r of records) console.log(`  ${r.part.padEnd(10)} ${r.status.padEnd(10)} ${r.file}`);
  if (!records.length) console.log("  (no audit records found)");
}

main();
