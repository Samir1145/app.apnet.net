// admin-panel/src/lib/db/seed-hub.ts
import { HubItem } from './schema';
import * as fs from 'fs';

export interface HubStore {
  hubItems: HubItem[];
}

let globalHubStore: HubStore | null = null;

export function seedHubData(): HubStore {
  const hubItems: HubItem[] = [];

  // Flagship Public Sovereign Tools & Agents across Master Domains
  const publicFlagshipItems: HubItem[] = [
    {
      id: 'hub_skl_avoidance_01',
      userId: null,
      orgId: null,
      urn: 'agent:legal-dispute:corporate-insolvency:avoidance-auditor:1.0.0',
      domain: 'legal-dispute',
      subdomain: 'corporate-insolvency',
      archetype: 'forensic-inquest',
      itemType: 'agent-skill',
      name: 'IBC Section 66 Forensic Auditor',
      slug: 'ibc-sec66-forensic-auditor',
      description: 'Audits corporate debtor general ledgers and bank transaction records to establish Section 66 fraudulent trading or siphoning of funds.',
      visibility: 'PUBLIC',
      verified: true,
      downloads: 450,
      tags: ['ibc', 'forensic-audit', 'section-66', 'avoidance'],
      requiredSkills: ['skill:legal-dispute:corporate-insolvency:ledger-tracer:1.0.0'],
      statutoryVaults: ['vault:legal-dispute:corporate-insolvency:ibc-2016-vault:1.0.0'],
      manifest: {
        files: [
          {
            name: 'handler.js',
            path: 'avoidance-auditor/handler.js',
            size: 1840,
            content: 'module.exports = async function(ctx) { return { status: "SUSPICIOUS_LEDGER_ENTRIES", count: 4 }; };',
          },
          {
            name: 'plugin.json',
            path: 'avoidance-auditor/plugin.json',
            size: 512,
            content: '{"name": "IBC Section 66 Forensic Auditor", "version": "1.0.0"}',
          },
          {
            name: 'README.md',
            path: 'avoidance-auditor/README.md',
            size: 680,
            content: '# IBC Section 66 Forensic Auditor\nAutonomous agent skill for CIRP avoidance audits.',
          },
        ],
      },
      importId: 'hub-skl-avoidance-01',
      authorName: 'Hayagriva Forensic Lab',
      authorUrl: 'https://agenticprofessionals.net',
      imageUrl: null,
      createdAt: new Date('2026-03-01T10:00:00Z'),
      updatedAt: new Date('2026-10-01T12:00:00Z'),
    },
    {
      id: 'hub_cmd_sec29a_02',
      userId: null,
      orgId: null,
      urn: 'command:legal-dispute:corporate-insolvency:sec29a-inquest:1.0.0',
      domain: 'legal-dispute',
      subdomain: 'corporate-insolvency',
      archetype: 'compliance-verifier',
      itemType: 'slash-command',
      name: 'Section 29A Eligibility Inquest Command',
      slug: 'sec29a-eligibility-command',
      description: 'Fast keyboard slash command to inspect resolution applicants against Section 29A disqualification criteria.',
      visibility: 'PUBLIC',
      verified: true,
      downloads: 1200,
      tags: ['ibc', 'eligibility', 'sec29a', 'disqualification'],
      requiredSkills: [],
      statutoryVaults: ['vault:legal-dispute:corporate-insolvency:ibc-2016-vault:1.0.0'],
      manifest: {
        files: [
          {
            name: 'command.json',
            path: 'sec29a/command.json',
            size: 610,
            content: '{"trigger": "/sec29a", "description": "Run Section 29A check"}',
          },
        ],
      },
      importId: 'hub-cmd-sec29a-02',
      authorName: 'Hayagriva Core',
      authorUrl: 'https://agenticprofessionals.net',
      imageUrl: null,
      createdAt: new Date('2026-03-05T10:00:00Z'),
      updatedAt: new Date('2026-10-02T12:00:00Z'),
    },
    {
      id: 'hub_vlt_ibc2016_03',
      userId: null,
      orgId: null,
      urn: 'vault:legal-dispute:corporate-insolvency:ibc-2016-vault:1.0.0',
      domain: 'legal-dispute',
      subdomain: 'corporate-insolvency',
      archetype: 'statutory-repository',
      itemType: 'workspace',
      name: 'IBC 2016 & CIRP Regulations Statutory Vault',
      slug: 'ibc-2016-statutory-vault',
      description: 'High-density vector embeddings of the entire Insolvency and Bankruptcy Code 2016 and IBBI CIRP regulations.',
      visibility: 'PUBLIC',
      verified: true,
      downloads: 2890,
      tags: ['ibc', 'bare-act', 'regulations', 'statutory-vault'],
      requiredSkills: [],
      statutoryVaults: [],
      manifest: {
        files: [
          {
            name: 'manifest.json',
            path: 'ibc-vault/manifest.json',
            size: 840,
            content: '{"statute": "Insolvency and Bankruptcy Code 2016", "sections": 255}',
          },
        ],
      },
      importId: 'hub-vlt-ibc2016-03',
      authorName: 'Hayagriva Statutory Bench',
      authorUrl: 'https://agenticprofessionals.net',
      imageUrl: null,
      createdAt: new Date('2026-02-15T10:00:00Z'),
      updatedAt: new Date('2026-10-01T12:00:00Z'),
    },
    {
      id: 'hub_gov_mca21_04',
      userId: null,
      orgId: null,
      urn: 'agent:corporate-governance:mca21-filings:roc-filing-verifier:1.0.0',
      domain: 'corporate-governance',
      subdomain: 'mca21-filings',
      archetype: 'compliance-verifier',
      itemType: 'agent-skill',
      name: 'MCA21 RoC Filing & DIR-3 KYC Verifier',
      slug: 'mca21-roc-filing-verifier',
      description: 'Verifies annual returns (AOC-4, MGT-7) and DIN status against MCA21 master compliance rules.',
      visibility: 'PUBLIC',
      verified: true,
      downloads: 620,
      tags: ['mca21', 'roc', 'compliance', 'companies-act'],
      requiredSkills: [],
      statutoryVaults: [],
      manifest: {
        files: [
          {
            name: 'handler.js',
            path: 'mca21/handler.js',
            size: 1450,
            content: 'module.exports = async function(p) { return { compliant: true }; };',
          },
        ],
      },
      importId: 'hub-gov-mca21-04',
      authorName: 'Corporate Compliance Desk',
      authorUrl: 'https://agenticprofessionals.net',
      imageUrl: null,
      createdAt: new Date('2026-03-20T10:00:00Z'),
      updatedAt: new Date('2026-09-15T12:00:00Z'),
    },
    {
      id: 'hub_tax_gst_05',
      userId: null,
      orgId: null,
      urn: 'agent:taxation-customs:gst-litigation:gst-scn-reply-architect:1.0.0',
      domain: 'taxation-customs',
      subdomain: 'gst-litigation',
      archetype: 'tribunal-litigator',
      itemType: 'agent-skill',
      name: 'GST Show Cause Notice Reply Architect',
      slug: 'gst-scn-reply-architect',
      description: 'Generates comprehensive legal defenses for Section 73/74 GST demand notices and ITC mismatches.',
      visibility: 'PUBLIC',
      verified: true,
      downloads: 810,
      tags: ['gst', 'scn', 'litigation', 'tax-appeal'],
      requiredSkills: [],
      statutoryVaults: [],
      manifest: {
        files: [
          {
            name: 'handler.js',
            path: 'gst-reply/handler.js',
            size: 1950,
            content: 'module.exports = async function() { return { sectionsCited: ["Section 73", "Section 16(2)"] }; };',
          },
        ],
      },
      importId: 'hub-tax-gst-05',
      authorName: 'Tax Law Counsel',
      authorUrl: 'https://agenticprofessionals.net',
      imageUrl: null,
      createdAt: new Date('2026-04-05T10:00:00Z'),
      updatedAt: new Date('2026-09-22T12:00:00Z'),
    },
    {
      id: 'hub_ent_ocr_06',
      userId: null,
      orgId: null,
      urn: 'skill:general-enterprise:document-forensics:forensic-ocr:1.0.0',
      domain: 'general-enterprise',
      subdomain: 'document-forensics',
      archetype: 'document-analyst',
      itemType: 'agent-skill',
      name: 'Court Pleadings Multi-Page Forensic OCR',
      slug: 'court-pleadings-forensic-ocr',
      description: 'High-speed local OCR tuned for Indian court filings, petition margins, watermarks, and stamp papers.',
      visibility: 'PUBLIC',
      verified: true,
      downloads: 3400,
      tags: ['ocr', 'forensics', 'scanned-pdf', 'tabular-extract'],
      requiredSkills: [],
      statutoryVaults: [],
      manifest: {
        files: [
          {
            name: 'handler.js',
            path: 'forensic-ocr/handler.js',
            size: 2400,
            content: 'module.exports = async function() { return { extractedText: "Before the Honble NCLAT..." }; };',
          },
        ],
      },
      importId: 'hub-ent-ocr-06',
      authorName: 'Hayagriva Core Vision',
      authorUrl: 'https://agenticprofessionals.net',
      imageUrl: null,
      createdAt: new Date('2026-01-10T10:00:00Z'),
      updatedAt: new Date('2026-10-01T12:00:00Z'),
    },
  ];

  hubItems.push(...publicFlagshipItems);

  // Curated Varaha Sovereign Agents across the 5 Flagship Domains
  const { curatedVarahaAgents } = require('../taxonomy/curated-varaha-agents');
  if (Array.isArray(curatedVarahaAgents)) {
    hubItems.push(...curatedVarahaAgents);
  }

  // Scraped Community items from local hubData.json if available
  try {
    const rawDataPath = '/Users/atulgrover/Desktop/hayagriva_hub/src/data/hubData.json';
    if (fs.existsSync(rawDataPath)) {
      const parsed = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
      const lists = parsed.lists || {};
      const categories = ['agentSkills', 'slashCommands', 'systemPrompts', 'agentFlows'];

      for (const cat of categories) {
        const items = lists[cat] || [];
        for (const item of items) {
          const slug = (item.name || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
          const itemType = item.itemType || 'agent-skill';
          const kind = itemType.includes('command') ? 'command' : itemType.includes('vault') ? 'vault' : 'skill';

          hubItems.push({
            id: item.id || `hub_${Math.random().toString(36).substring(7)}`,
            userId: null,
            orgId: null,
            urn: `${kind}:general-enterprise:document-forensics:${slug}:1.0.0`,
            domain: 'general-enterprise',
            subdomain: 'document-forensics',
            archetype: 'general-tool',
            itemType,
            name: item.name || 'Untitled Asset',
            slug,
            description: item.description || '',
            visibility: 'PUBLIC',
            verified: !!item.verified,
            downloads: typeof item.downloads === 'number' ? item.downloads : Math.floor(Math.random() * 250) + 12,
            tags: Array.isArray(item.tags) ? item.tags : ['community'],
            requiredSkills: [],
            statutoryVaults: [],
            manifest: item.manifest || { files: [] },
            importId: item.importId || item.id,
            authorName: item.username || 'MintplexLabs',
            authorUrl: item.userUid ? `https://hub.anythingllm.com/u/${item.userUid}` : 'https://hub.anythingllm.com',
            imageUrl: item.image || null,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date('2026-03-01T10:00:00Z'),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date('2026-10-01T12:00:00Z'),
          });
        }
      }
    }
  } catch (err) {
    console.warn('[seedHubData] Warning reading local hubData.json:', err);
  }

  // Private Chamber Confidential Sovereign Tools (Strict Org Isolation)
  const privateChamberItems: HubItem[] = [
    {
      id: 'priv_rao_ibc_sec66',
      userId: 'usr_adv_01',
      orgId: 'Rao & Partners Insolvency Advocates',
      urn: 'skill:legal-dispute:corporate-insolvency:sec66-fraud-tracer:2.4.0',
      domain: 'legal-dispute',
      subdomain: 'corporate-insolvency',
      archetype: 'forensic-inquest',
      itemType: 'agent-skill',
      name: 'Forensic PUFE & Section 66 Fraud Tracer',
      slug: 'forensic-pufe-section66-fraud-tracer',
      description: 'Chamber Confidential skill to parse ledger bank statements and detect preferential, undervalued, fraudulent, and extortionate transactions under Sections 43-66 IBC.',
      visibility: 'PRIVATE_CHAMBER',
      verified: true,
      downloads: 48,
      tags: ['ibc', 'forensic-audit', 'pufe', 'chamber-confidential'],
      requiredSkills: ['skill:legal-dispute:corporate-insolvency:ledger-tracer:1.0.0'],
      statutoryVaults: ['vault:legal-dispute:corporate-insolvency:ibc-2016-vault:1.0.0'],
      manifest: {
        files: [
          {
            name: 'handler.js',
            path: 'forensic-pufe/handler.js',
            size: 2150,
            content: 'module.exports.runtime = { handler: async function(params) { return JSON.stringify({ status: "PUFE_SUSPECT", detectedTransactions: 3, section: "Section 66 Fraudulent Trading" }); } };',
          },
          {
            name: 'plugin.json',
            path: 'forensic-pufe/plugin.json',
            size: 890,
            content: '{"name": "Forensic PUFE Tracer", "version": "2.4.0", "active": true, "entrypoint": { "file": "handler.js" }}',
          },
          {
            name: 'README.md',
            path: 'forensic-pufe/README.md',
            size: 640,
            content: '# Chamber Confidential: PUFE Tracer\nStrictly licensed for Rao & Partners Insolvency Advocates.',
          },
        ],
      },
      importId: 'priv-rao-ibc-sec66',
      authorName: 'Adv. Rajeshwar Rao',
      authorUrl: null,
      imageUrl: null,
      createdAt: new Date('2026-04-10T11:00:00Z'),
      updatedAt: new Date('2026-10-05T14:30:00Z'),
    },
    {
      id: 'priv_rao_nclat_urgent',
      userId: 'usr_adv_01',
      orgId: 'Rao & Partners Insolvency Advocates',
      urn: 'command:legal-dispute:corporate-insolvency:nclat-urgent-stay:1.0.0',
      domain: 'legal-dispute',
      subdomain: 'corporate-insolvency',
      archetype: 'tribunal-litigator',
      itemType: 'system-prompt',
      name: 'NCLAT Principal Bench Urgent Mentioning Strategist',
      slug: 'nclat-principal-bench-urgent-mentioning',
      description: 'Chamber prompt fine-tuned with NCLAT Rule 63 practice directions for seeking ex-parte ad-interim stay against Section 7 admissions.',
      visibility: 'PRIVATE_CHAMBER',
      verified: true,
      downloads: 32,
      tags: ['nclat', 'urgent-mentioning', 'stay-application', 'chamber-confidential'],
      requiredSkills: [],
      statutoryVaults: ['vault:legal-dispute:corporate-insolvency:ibc-2016-vault:1.0.0'],
      manifest: {
        files: [
          {
            name: 'prompt.txt',
            path: 'nclat-urgent/prompt.txt',
            size: 1420,
            content: 'You are an elite Senior Advocate at the NCLAT Principal Bench New Delhi specializing in urgent stay of CIRP commencement under Section 61 IBC...',
          },
        ],
      },
      importId: 'priv-rao-nclat-urgent',
      authorName: 'Adv. Rajeshwar Rao',
      authorUrl: null,
      imageUrl: null,
      createdAt: new Date('2026-05-18T09:15:00Z'),
      updatedAt: new Date('2026-09-29T16:00:00Z'),
    },
    {
      id: 'priv_rao_resolution_flow',
      userId: 'usr_adv_01',
      orgId: 'Rao & Partners Insolvency Advocates',
      urn: 'agent:legal-dispute:corporate-insolvency:resolution-checker-flow:1.0.0',
      domain: 'legal-dispute',
      subdomain: 'corporate-insolvency',
      archetype: 'compliance-verifier',
      itemType: 'agent-flow',
      name: 'Resolution Plan Section 30(2) Mandatory Checklist Flow',
      slug: 'resolution-plan-section-30-2-checklist-flow',
      description: 'Multi-step autonomous workflow validating resolution applicant eligibility under Section 29A and verifying liquidation value priorities.',
      visibility: 'PRIVATE_CHAMBER',
      verified: true,
      downloads: 19,
      tags: ['agent-flow', 'section-30-2', 'coc-approval', 'chamber-confidential'],
      requiredSkills: ['skill:legal-dispute:corporate-insolvency:sec29a-checker:1.0.0'],
      statutoryVaults: ['vault:legal-dispute:corporate-insolvency:ibc-2016-vault:1.0.0'],
      manifest: {
        files: [
          {
            name: 'flow.json',
            path: 'resolution-flow/flow.json',
            size: 3200,
            content: '{"flowName": "Section 30(2) Verifier", "steps": ["verify_29a", "check_liquidation_priority", "verify_operational_creditors", "generate_compliance_cert"]}',
          },
        ],
      },
      importId: 'priv-rao-resolution-flow',
      authorName: 'Adv. Rajeshwar Rao',
      authorUrl: null,
      imageUrl: null,
      createdAt: new Date('2026-06-02T13:45:00Z'),
      updatedAt: new Date('2026-10-02T11:20:00Z'),
    },
    {
      id: 'priv_singhania_arbitration_seat',
      userId: 'usr_adv_02',
      orgId: 'Singhania & Co. Insolvency Resolution',
      urn: 'skill:legal-dispute:commercial-arbitration:emergency-relief-drafter:1.0.0',
      domain: 'legal-dispute',
      subdomain: 'commercial-arbitration',
      archetype: 'tribunal-litigator',
      itemType: 'agent-skill',
      name: 'Emergency Arbitrator Section 9 Relief Drafter',
      slug: 'emergency-arbitrator-section-9-relief-drafter',
      description: 'Singhania & Co proprietary agent skill for drafting immediate interim measures before SIAC, MCIA, and Delhi International Arbitration Centre.',
      visibility: 'PRIVATE_CHAMBER',
      verified: true,
      downloads: 27,
      tags: ['arbitration', 'section-9', 'siac', 'chamber-confidential'],
      requiredSkills: [],
      statutoryVaults: [],
      manifest: {
        files: [
          {
            name: 'handler.js',
            path: 'arbitration-relief/handler.js',
            size: 1980,
            content: 'module.exports.runtime = { handler: async function(p) { return JSON.stringify({ reliefType: "INTERIM_INJUNCTION", jurisdiction: "DIAC" }); } };',
          },
        ],
      },
      importId: 'priv-singhania-arbitration-seat',
      authorName: 'Pooja Singhania (IP)',
      authorUrl: null,
      imageUrl: null,
      createdAt: new Date('2026-07-14T10:00:00Z'),
      updatedAt: new Date('2026-09-20T17:10:00Z'),
    },
  ];

  hubItems.push(...privateChamberItems);

  globalHubStore = { hubItems };
  return globalHubStore;
}

export function getHubStore(): HubStore {
  if (!globalHubStore) {
    return seedHubData();
  }
  return globalHubStore;
}
