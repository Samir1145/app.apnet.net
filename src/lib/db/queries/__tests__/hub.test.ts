import { describe, it } from "node:test";
import assert from "node:assert";
import { filterHubItems } from "../hub";
import type { HubItem } from "../../schema";

describe("Hub Database Queries & Filters", () => {
  const sampleItems: Partial<HubItem>[] = [
    {
      id: "hub_skl_01",
      name: "IBC Avoidance Auditor",
      description: "Detects fraudulent transactions under Section 66",
      itemType: "agent-skill",
      visibility: "PUBLIC",
      downloads: 450,
      tags: ["ibc", "forensics"],
    },
    {
      id: "hub_cmd_02",
      name: "Section 29A Scrutiny",
      description: "Disqualification check for resolution applicants",
      itemType: "slash-command",
      visibility: "PUBLIC",
      downloads: 1200,
      tags: ["ibc", "eligibility"],
    },
    {
      id: "hub_pvt_03",
      name: "Private Chamber Precedence Index",
      description: "Proprietary arguments for NCLAT",
      itemType: "legal-vault",
      visibility: "PRIVATE_CHAMBER",
      orgId: "Chambers of Vikram",
      downloads: 10,
      tags: ["nclat"],
    },
  ];

  it("filters items by public visibility by default", () => {
    const result = filterHubItems(sampleItems as HubItem[], { visibility: "PUBLIC" });
    assert.strictEqual(result.items.length, 2);
    assert.strictEqual(result.items.every((i) => i.visibility === "PUBLIC"), true);
  });

  it("includes private chamber items when orgId matches", () => {
    const result = filterHubItems(sampleItems as HubItem[], {
      includePrivate: true,
      orgId: "Chambers of Vikram",
    });
    assert.strictEqual(result.items.length, 3);
  });

  it("filters items by search query against name, description, and tags", () => {
    const result = filterHubItems(sampleItems as HubItem[], { q: "section 66" });
    assert.strictEqual(result.items.length, 1);
    assert.strictEqual(result.items[0].id, "hub_skl_01");
  });
});
