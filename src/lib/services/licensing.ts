// admin-panel/src/lib/services/licensing.ts
import { AdminStore } from '../db/seed';
import { License, Activation, ApiKey } from '../db/schema';
import { generateOfflineToken, generateMcpBearerToken } from '../security/tokens';

export interface ActivateRequest {
  licenseKey: string;
  hardwareFingerprint: string;
  deviceName: string;
  osInfo: string;
  ipAddress?: string;
  appVersion?: string;
}

export function activateDevice(store: AdminStore, req: ActivateRequest) {
  // 1. Locate license
  const license = store.licenses.find(l => l.licenseKey === req.licenseKey);
  if (!license) {
    return { success: false, error: 'INVALID_LICENSE_KEY', message: 'License key not found' };
  }

  if (license.status !== 'ACTIVE') {
    return { success: false, error: 'LICENSE_INACTIVE', message: `License is ${license.status}` };
  }

  if (new Date(license.expiresAt).getTime() < Date.now()) {
    return { success: false, error: 'LICENSE_EXPIRED', message: 'License subscription has expired' };
  }

  // 2. Check existing activation for same hardware
  let existingActivation = store.activations.find(
    a => a.licenseId === license.id && a.hardwareFingerprint === req.hardwareFingerprint
  );

  const activeActivations = store.activations.filter(a => a.licenseId === license.id && a.isActive);

  if (existingActivation && existingActivation.isActive) {
    // Refresh ping
    existingActivation.lastPingAt = new Date();
    existingActivation.deviceName = req.deviceName || existingActivation.deviceName;
    existingActivation.osInfo = req.osInfo || existingActivation.osInfo;
    existingActivation.ipAddress = req.ipAddress || existingActivation.ipAddress;
  } else if (existingActivation && !existingActivation.isActive) {
    // Re-activating a previously deactivated device
    if (activeActivations.length >= license.maxDevices) {
      return {
        success: false,
        error: 'DEVICE_LIMIT_EXCEEDED',
        message: `Active device limit of ${license.maxDevices} reached for plan ${license.planTier}.`,
        maxDevices: license.maxDevices,
        activeDevices: activeActivations.length
      };
    }
    existingActivation.isActive = true;
    existingActivation.activatedAt = new Date();
    existingActivation.lastPingAt = new Date();
    existingActivation.deactivatedAt = null;
  } else {
    // Brand new device activation
    if (activeActivations.length >= license.maxDevices) {
      return {
        success: false,
        error: 'DEVICE_LIMIT_EXCEEDED',
        message: `Active device limit of ${license.maxDevices} reached for plan ${license.planTier}.`,
        maxDevices: license.maxDevices,
        activeDevices: activeActivations.length
      };
    }

    const newActivationId = `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    existingActivation = {
      id: newActivationId,
      licenseId: license.id,
      userId: license.userId,
      hardwareFingerprint: req.hardwareFingerprint,
      deviceName: req.deviceName || 'Desktop Workstation',
      osInfo: req.osInfo || 'Desktop OS',
      ipAddress: req.ipAddress || '127.0.0.1',
      lastPingAt: new Date(),
      isActive: true,
      activatedAt: new Date(),
      deactivatedAt: null
    };

    store.activations.push(existingActivation);
  }

  // 3. Generate Cryptographic Tokens
  const offlineToken = generateOfflineToken({
    licenseKey: license.licenseKey,
    userId: license.userId,
    hardwareFingerprint: req.hardwareFingerprint,
    planTier: license.planTier,
    expiresAt: new Date(license.expiresAt).toISOString(),
    issuedAt: new Date().toISOString()
  });

  const { rawToken: mcpBearerToken, keyPrefix, keyHash } = generateMcpBearerToken();

  // Record MCP API Key
  const apiKeyRecord: ApiKey = {
    id: `key_mcp_${Date.now()}`,
    userId: license.userId,
    activationId: existingActivation.id,
    name: `${req.deviceName || 'Desktop'} MCP Agent`,
    keyPrefix,
    keyHash,
    scopes: ['mcp:agent:read', 'mcp:agent:exec', 'mcp:vault:query'],
    isActive: true,
    createdAt: new Date(),
    lastUsedAt: new Date()
  };

  store.apiKeys.push(apiKeyRecord);

  const updatedActiveCount = store.activations.filter(a => a.licenseId === license.id && a.isActive).length;

  return {
    success: true,
    license: {
      key: license.licenseKey,
      plan: license.planTier,
      expiresAt: new Date(license.expiresAt).toISOString(),
      maxDevices: license.maxDevices,
      activeDevices: updatedActiveCount
    },
    tokens: {
      offlineToken,
      mcpBearerToken,
      expiresAt: new Date(license.expiresAt).toISOString()
    },
    device: {
      activationId: existingActivation.id,
      deviceName: existingActivation.deviceName
    }
  };
}

export function deactivateDevice(store: AdminStore, activationId: string, licenseKey?: string) {
  const activation = store.activations.find(a => a.id === activationId);
  if (!activation) {
    return { success: false, error: 'Activation record not found' };
  }

  activation.isActive = false;
  activation.deactivatedAt = new Date();

  // Deactivate any linked API keys
  store.apiKeys.forEach(k => {
    if (k.activationId === activationId) {
      k.isActive = false;
    }
  });

  const remaining = store.activations.filter(a => a.licenseId === activation.licenseId && a.isActive).length;

  return {
    success: true,
    freedSlots: 1,
    remainingActiveDevices: remaining
  };
}
