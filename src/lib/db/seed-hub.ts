// admin-panel/src/lib/db/seed-hub.ts
import { HubItem } from './schema';
import * as path from 'path';
import * as fs from 'fs';

export interface HubStore {
  hubItems: HubItem[];
}

let globalHubStore: HubStore | null = null;

export function seedHubData(): HubStore {
  const hubItems: HubItem[] = [];

  // 1. Scraped Community items from local hubData.json
  try {
    const rawDataPath = '/Users/atulgrover/Desktop/hayagriva_hub/src/data/hubData.json';
    if (fs.existsSync(rawDataPath)) {
      const parsed = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
      const lists = parsed.lists || {};
      const categories = ['agentSkills', 'slashCommands', 'systemPrompts', 'agentFlows'];

      for (const cat of categories) {
        const items = lists[cat] || [];
        for (const item of items) {
          hubItems.push({
            id: item.id || `hub_${Math.random().toString(36).substring(7)}`,
            userId: null,
            orgId: null,
            itemType: item.itemType || 'agent-skill',
            name: item.name || 'Untitled Asset',
            slug: (item.name || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            description: item.description || '',
            visibility: 'PUBLIC',
            verified: !!item.verified,
            downloads: typeof item.downloads === 'number' ? item.downloads : Math.floor(Math.random() * 250) + 12,
            tags: Array.isArray(item.tags) ? item.tags : ['community'],
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
    console.warn('[seedHubData] Warning: Unable to read local hubData.json, using fallback public items:', err);
  }

  // 2. Private Chamber Confidential Sovereign Tools (Strict Org Isolation)
  const privateChamberItems: HubItem[] = [
    {
      id: 'priv_rao_ibc_sec66',
      userId: 'usr_adv_01',
      orgId: 'Rao & Partners Insolvency Advocates',
      itemType: 'agent-skill',
      name: 'Forensic PUFE & Section 66 Fraud Tracer',
      slug: 'forensic-pufe-section66-fraud-tracer',
      description: 'Chamber Confidential skill to parse ledger bank statements and detect preferential, undervalued, fraudulent, and extortionate transactions under Sections 43-66 IBC.',
      visibility: 'PRIVATE_CHAMBER',
      verified: true,
      downloads: 48,
      tags: ['ibc', 'forensic-audit', 'pufe', 'chamber-confidential'],
      manifest: {
        files: [
          {
            name: 'handler.js',
            path: 'forensic-pufe/handler.js',
            size: 2150,
            content: 'module.exports.runtime = { handler: async function(params) { return JSON.stringify({ status: "PUFE_SUSPECT", detectedTransactions: 3, section: "Section 66 Fraudulent Trading" }); } };'
          },
          {
            name: 'plugin.json',
            path: 'forensic-pufe/plugin.json',
            size: 890,
            content: '{"name": "Forensic PUFE Tracer", "version": "2.4.0", "active": true, "entrypoint": { "file": "handler.js" }}'
          },
          {
            name: 'README.md',
            path: 'forensic-pufe/README.md',
            size: 640,
            content: '# Chamber Confidential: PUFE Tracer\nStrictly licensed for Rao & Partners Insolvency Advocates.'
          }
        ]
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
      itemType: 'system-prompt',
      name: 'NCLAT Principal Bench Urgent Mentioning Strategist',
      slug: 'nclat-principal-bench-urgent-mentioning',
      description: 'Chamber prompt fine-tuned with NCLAT Rule 63 practice directions for seeking ex-parte ad-interim stay against Section 7 admissions.',
      visibility: 'PRIVATE_CHAMBER',
      verified: true,
      downloads: 32,
      tags: ['nclat', 'urgent-mentioning', 'stay-application', 'chamber-confidential'],
      manifest: {
        files: [
          {
            name: 'prompt.txt',
            path: 'nclat-urgent/prompt.txt',
            size: 1420,
            content: 'You are an elite Senior Advocate at the NCLAT Principal Bench New Delhi specializing in urgent stay of CIRP commencement under Section 61 IBC...'
          }
        ]
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
      itemType: 'agent-flow',
      name: 'Resolution Plan Section 30(2) Mandatory Checklist Flow',
      slug: 'resolution-plan-section-30-2-checklist-flow',
      description: 'Multi-step autonomous workflow validating resolution applicant eligibility under Section 29A and verifying liquidation value priorities.',
      visibility: 'PRIVATE_CHAMBER',
      verified: true,
      downloads: 19,
      tags: ['agent-flow', 'section-30-2', 'coc-approval', 'chamber-confidential'],
      manifest: {
        files: [
          {
            name: 'flow.json',
            path: 'resolution-flow/flow.json',
            size: 3200,
            content: '{"flowName": "Section 30(2) Verifier", "steps": ["verify_29a", "check_liquidation_priority", "verify_operational_creditors", "generate_compliance_cert"]}'
          }
        ]
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
      itemType: 'agent-skill',
      name: 'Emergency Arbitrator Section 9 Relief Drafter',
      slug: 'emergency-arbitrator-section-9-relief-drafter',
      description: 'Singhania & Co proprietary agent skill for drafting immediate interim measures before SIAC, MCIA, and Delhi International Arbitration Centre.',
      visibility: 'PRIVATE_CHAMBER',
      verified: true,
      downloads: 27,
      tags: ['arbitration', 'section-9', 'siac', 'chamber-confidential'],
      manifest: {
        files: [
          {
            name: 'handler.js',
            path: 'arbitration-relief/handler.js',
            size: 1980,
            content: 'module.exports.runtime = { handler: async function(p) { return JSON.stringify({ reliefType: "INTERIM_INJUNCTION", jurisdiction: "DIAC" }); } };'
          }
        ]
      },
      importId: 'priv-singhania-arbitration-seat',
      authorName: 'Pooja Singhania (IP)',
      authorUrl: null,
      imageUrl: null,
      createdAt: new Date('2026-07-14T10:00:00Z'),
      updatedAt: new Date('2026-09-20T17:10:00Z'),
    }
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
