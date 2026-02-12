import { NotesBlock } from '../../shared/types';
import { useWorkspaceStore } from '../store';

export function NotesBlockView({ block }: { block: NotesBlock }): JSX.Element {
  const { updateBlock } = useWorkspaceStore();
  return (
    <div>
      <h3>{block.title}</h3>
      <textarea
        className="notes"
        value={block.markdown}
        onChange={(e) => updateBlock(block.id, (current) => (current.type === 'notes' ? { ...current, markdown: e.target.value } : current))}
        placeholder="# 메모\n수식 설명, 실험 노트 등을 작성하세요"
      />
    </div>
  );
}
