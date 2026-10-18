import assert from 'node:assert/strict';
import test from 'node:test';
import { authStatus } from '../controllers/auth.controller.js';

const envKeys = ['ADMIN_EMAIL', 'ADMIN_PASSWORD', 'JWT_SECRET'];

test('auth status lists missing admin configuration without returning secret values', () => {
  const original = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  try {
    process.env.ADMIN_EMAIL = '';
    process.env.ADMIN_PASSWORD = 'configured-password';
    process.env.JWT_SECRET = 'too-short';

    let response;
    authStatus({}, { json: (body) => { response = body; } });

    assert.deepEqual(response, {
      configured: false,
      missing: ['ADMIN_EMAIL', 'JWT_SECRET (at least 32 characters)'],
    });
    assert.equal(JSON.stringify(response).includes('configured-password'), false);
  } finally {
    for (const key of envKeys) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
});

test('auth status enables sign-in when required settings are present', () => {
  const original = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  try {
    process.env.ADMIN_EMAIL = 'admin@example.test';
    process.env.ADMIN_PASSWORD = 'configured-password';
    process.env.JWT_SECRET = 'a'.repeat(32);

    let response;
    authStatus({}, { json: (body) => { response = body; } });

    assert.deepEqual(response, { configured: true, missing: [] });
  } finally {
    for (const key of envKeys) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
});
