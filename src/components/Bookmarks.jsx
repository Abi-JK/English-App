import React from 'react';
import { Bookmark, Trash2, BookOpen, MessageCircle, Zap, Trophy } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';

const typeIcons = {
  vocab: { icon: '📚', color: '#009688' },
  idiom: { icon: '💬', color: '#f59e0b' },
  grammar: { icon: '📖', color: '#8b5cf6' },
  phrasal: { icon: '🔗', color: '#6366f1' },
  word: { icon: '📝', color: '#06b6d4' },
};

const Bookmarks = () => {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', margin: 0 }}>🔖 Bookmarks</h1>
          <p className="text-muted" style={{ marginTop: '4px' }}>
            {bookmarks.length} saved item{bookmarks.length !== 1 ? 's' : ''}
          </p>
        </div>
        {bookmarks.length > 0 && (
          <button className="btn-secondary" onClick={clearBookmarks} style={{ color: '#ef4444', borderColor: '#ef444440' }}>
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <Bookmark size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <h3 style={{ color: 'var(--text-muted)' }}>No bookmarks yet</h3>
          <p style={{ fontSize: '14px' }}>
            Browse Learning Hub, Exam Center, or Phrasal Verbs and bookmark items you want to review later.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {bookmarks.map((item, i) => {
            const tInfo = typeIcons[item.type] || { icon: '📌', color: 'var(--primary-color)' };
            return (
              <div key={`${item.id}-${i}`} className="card" style={{ borderLeft: `4px solid ${tInfo.color}`, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '12px', background: `${tInfo.color}18`, color: tInfo.color, padding: '2px 8px', borderRadius: '8px', fontWeight: '600', textTransform: 'capitalize' }}>
                      {tInfo.icon} {item.type}
                    </span>
                  </div>
                  <button onClick={() => removeBookmark(item.id, item.type)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px', borderRadius: '4px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div>
                  {item.word && <h4 style={{ margin: '0 0 4px', color: 'var(--primary-color)' }}>{item.word}</h4>}
                  {item.phrase && <h4 style={{ margin: '0 0 4px', color: 'var(--primary-color)' }}>{item.phrase}</h4>}
                  {item.title && <h4 style={{ margin: '0 0 4px', color: 'var(--primary-color)' }}>{item.title}</h4>}
                  {item.meaning && <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '0 0 4px' }}>{item.meaning}</p>}
                  {item.rule && <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '0 0 4px' }}>{item.rule}</p>}
                  {item.verb && <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '0 0 4px' }}>{item.verb}: {item.meaning}</p>}
                  {item.use && <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>"{item.use}"</p>}
                  {item.tamil && <p style={{ fontSize: '12px', color: 'var(--primary-color)', margin: '4px 0 0' }}>🇮🇳 {item.tamil}</p>}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Saved: {new Date(item.addedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
