import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projectSchema, translateSchema } from './project.schema';
import { verify2FASchema } from './auth.schema';

const localized = (text: string) => ({ en: text, uz: text, ru: text });

const validProject = {
  title: localized('Title'),
  description: localized('Description'),
  content: localized('Content'),
  image_url: 'https://example.com/a.png',
  github_url: '',
  live_url: null,
  tech_stack: ['React'],
};

test('project schema accepts a normal project', () => {
  assert.equal(projectSchema.safeParse({ body: validProject }).success, true);
});

test('project schema rejects javascript: URLs', () => {
  const body = { ...validProject, live_url: 'javascript:alert(1)' };
  assert.equal(projectSchema.safeParse({ body }).success, false);
});

test('project schema rejects oversized titles and tag lists', () => {
  assert.equal(projectSchema.safeParse({ body: { ...validProject, title: localized('x'.repeat(201)) } }).success, false);
  const tooManyTags = Array.from({ length: 21 }, (_, i) => `tag${i}`);
  assert.equal(projectSchema.safeParse({ body: { ...validProject, tech_stack: tooManyTags } }).success, false);
});

test('translate schema only allows known languages', () => {
  assert.equal(translateSchema.safeParse({ body: { text: 'hi', from: 'en' } }).success, true);
  assert.equal(translateSchema.safeParse({ body: { text: 'hi', from: 'de' } }).success, false);
  assert.equal(translateSchema.safeParse({ body: { text: '', from: 'en' } }).success, false);
});

test('2FA schema requires exactly six digits', () => {
  assert.equal(verify2FASchema.safeParse({ body: { token: '123456' } }).success, true);
  assert.equal(verify2FASchema.safeParse({ body: { token: '12345a' } }).success, false);
  assert.equal(verify2FASchema.safeParse({ body: { token: '12345' } }).success, false);
});
