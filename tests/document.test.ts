import { describe, expect, it } from 'vitest';
import { createEmptyDocument, deserializeDocument, serializeDocument } from '../src/shared/document';

describe('document serialization', () => {
  it('creates empty document with version', () => {
    const doc = createEmptyDocument('Demo');
    expect(doc.version).toBe(1);
    expect(doc.metadata.title).toBe('Demo');
  });

  it('serializes and deserializes', () => {
    const doc = createEmptyDocument();
    doc.blocks.push({ id: '1', type: 'notes', title: 'N', markdown: 'hello' });
    const raw = serializeDocument(doc);
    const parsed = deserializeDocument(raw);
    expect(parsed.blocks.length).toBe(1);
    expect(parsed.blocks[0].type).toBe('notes');
  });
});
