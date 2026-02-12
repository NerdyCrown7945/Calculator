import { useMemo } from 'react';
import { MathEngine } from './lib/mathEngine';
import { useWorkspaceStore } from './store';
import { BlockRenderer } from './components/BlockRenderer';

export function App(): JSX.Element {
  const {
    doc,
    selectedBlockId,
    addBlock,
    selectBlock,
    setAngleMode,
    exportSerialized,
    importSerialized,
    filePath,
    newDocument
  } = useWorkspaceStore();
  const engine = useMemo(() => new MathEngine(), []);

  engine.setAngleMode(doc.settings.angleMode);

  const selected = doc.blocks.find((b) => b.id === selectedBlockId);

  const openDocument = async (): Promise<void> => {
    const result = await window.workspaceAPI.openDocument();
    if (!result) return;
    importSerialized(result.content, result.filePath);
  };

  const saveDocument = async (forceSaveAs = false): Promise<void> => {
    const content = exportSerialized();
    const result = await window.workspaceAPI.saveDocument({ content, filePath: forceSaveAs ? undefined : filePath });
    if (!result) return;
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>{doc.metadata.title}</h2>
        <div className="toolbar vertical">
          <button onClick={() => newDocument()}>New</button>
          <button onClick={() => openDocument()}>Open</button>
          <button onClick={() => saveDocument()}>Save</button>
          <button onClick={() => saveDocument(true)}>Save As</button>
        </div>
        <hr />
        <div className="toolbar vertical">
          <button onClick={() => addBlock('calculator')}>+ Calculator</button>
          <button onClick={() => addBlock('notes')}>+ Notes</button>
          <button onClick={() => addBlock('graph')}>+ Graph</button>
          <button onClick={() => addBlock('cas')}>+ CAS</button>
          <button onClick={() => addBlock('table')}>+ Table</button>
        </div>
        <hr />
        <div className="toolbar vertical">
          <label>Angle Mode</label>
          <select value={doc.settings.angleMode} onChange={(e) => setAngleMode(e.target.value as 'rad' | 'deg')}>
            <option value="rad">Radians</option>
            <option value="deg">Degrees</option>
          </select>
        </div>
        <ul>
          {doc.blocks.map((block) => (
            <li key={block.id}>
              <button className={selectedBlockId === block.id ? 'selected' : ''} onClick={() => selectBlock(block.id)}>
                {block.title} ({block.type})
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="content">
        {selected ? <BlockRenderer block={selected} engine={engine} /> : <p>좌측에서 블록을 선택하거나 추가하세요.</p>}
      </main>
    </div>
  );
}
