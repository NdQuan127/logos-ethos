/**
 * The command palette: find a post or run a site action from the keyboard.
 * Built on cmdk (list, filtering, arrow keys, ARIA) inside a Radix dialog
 * (focus trap, Escape, scroll lock, focus return). It opens without animation:
 * it is summoned by keyboard, often, and must feel instant.
 */
import { Title } from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { SearchEntry } from '../../pages/search.json';
import { fold } from '../../lib/fold';
import { routes } from '../../lib/routes';
import { announce } from '../../scripts/announce';
import { pageUrl } from '../../scripts/copy';
import { platformShortcut } from '../../scripts/platform';
import { toggleTheme } from '../../scripts/theme';

type Status = 'idle' | 'loading' | 'ready' | 'error';

interface Action {
  id: string;
  label: string;
  keywords: string;
  shortcut?: string;
  icon: ReactNode;
  run: () => void;
}

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="cmd-icon">
    {d}
  </svg>
);

const ACTIONS: Action[] = [
  {
    id: 'home',
    label: 'Trang chủ',
    keywords: 'bai viet danh sach home',
    icon: icon(<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />),
    run: () => location.assign(routes.home),
  },
  {
    id: 'about',
    label: 'Giới thiệu',
    keywords: 'about lien he tac gia',
    icon: icon(
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>,
    ),
    run: () => location.assign(routes.about),
  },
  {
    id: 'theme',
    label: 'Đổi nền sáng/tối',
    keywords: 'theme dark light toi sang giao dien',
    shortcut: 'T',
    icon: icon(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />),
    run: () => toggleTheme(),
  },
  {
    id: 'copy',
    label: 'Chép liên kết trang này',
    keywords: 'copy link url chia se share',
    icon: icon(
      <>
        <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
      </>,
    ),
    run: () => {
      navigator.clipboard.writeText(pageUrl()).then(
        () => announce('Đã chép liên kết trang'),
        () => announce('Không chép được liên kết'),
      );
    },
  },
  {
    id: 'rss',
    label: 'Theo dõi qua RSS',
    keywords: 'rss feed theo doi',
    icon: icon(
      <>
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" />
      </>,
    ),
    run: () => location.assign(routes.rss),
  },
];

/** Wraps the part of `text` that matches the query in <mark>. */
function highlight(text: string, query: string): ReactNode {
  const needle = fold(query.trim());
  if (!needle) return text;
  const at = fold(text).indexOf(needle);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + needle.length)}</mark>
      {text.slice(at + needle.length)}
    </>
  );
}

/**
 * Every word of the query must appear, without diacritics. Matches in the
 * title rank above matches found only in the description, category or tags.
 */
function score(value: string, search: string, keywords?: string[]): number {
  const words = fold(search).split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;
  const title = fold(keywords?.[0] ?? value);
  const rest = fold(keywords?.slice(1).join(' ') ?? '');
  if (!words.every((word) => title.includes(word) || rest.includes(word))) return 0;
  return words.every((word) => title.includes(word)) ? (title.startsWith(words[0]) ? 1 : 0.8) : 0.4;
}

export default function Palette({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<SearchEntry[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  const load = useCallback(() => {
    setStatus('loading');
    fetch(routes.search)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<SearchEntry[]>;
      })
      .then((entries) => {
        setPosts(entries);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    const onToggle = () => setOpen((value) => !value);
    const onOpen = () => setOpen(true);
    window.addEventListener('palette:toggle', onToggle);
    window.addEventListener('palette:open', onOpen);
    return () => {
      window.removeEventListener('palette:toggle', onToggle);
      window.removeEventListener('palette:open', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open && status === 'idle') load();
    if (!open) setQuery('');
  }, [open, status, load]);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  const postItems = useMemo(
    () =>
      posts.map((post) => (
        <Command.Item
          key={post.href}
          value={post.href}
          keywords={[post.title, post.description, post.category, ...post.tags]}
          onSelect={() => run(() => location.assign(post.href))}
        >
          <i className="dot" style={{ ['--tone' as string]: `var(--${post.tone})` }} aria-hidden="true" />
          <span className="cmd-title">{highlight(post.title, query)}</span>
          <span className="cmd-meta">{post.date}</span>
        </Command.Item>
      )),
    // `run` only closes the dialog, so the items depend on the data and the query alone.
    [posts, query],
  );

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Tìm bài viết hoặc lệnh"
      filter={score}
      loop
      overlayClassName="cmd-overlay"
      contentClassName="cmd-content raised"
    >
      <Title className="sr-only">Tìm kiếm</Title>
      <div className="cmd-input">
        {icon(
          <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </>,
        )}
        <Command.Input value={query} onValueChange={setQuery} placeholder="Tìm bài viết hoặc lệnh…" />
        <kbd className="kbd">Esc</kbd>
      </div>
      <Command.List>
        {status === 'loading' && <Command.Loading>Đang tải danh sách bài…</Command.Loading>}
        {status === 'error' && (
          <div className="cmd-state" role="alert">
            Không tải được danh sách bài.{' '}
            <button type="button" className="link" onClick={load}>
              Thử lại
            </button>
          </div>
        )}
        <Command.Empty>Không có kết quả cho “{query.trim()}”. Thử từ khác, hoặc gõ không dấu.</Command.Empty>
        {posts.length > 0 && <Command.Group heading="Bài viết">{postItems}</Command.Group>}
        <Command.Group heading="Lệnh">
          {ACTIONS.map((action) => (
            <Command.Item
              key={action.id}
              value={action.id}
              keywords={[action.label, action.keywords]}
              onSelect={() => run(action.run)}
            >
              {action.icon}
              <span className="cmd-title">{highlight(action.label, query)}</span>
              {action.shortcut && <kbd className="kbd">{platformShortcut(action.shortcut)}</kbd>}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
      <div className="cmd-foot" aria-hidden="true">
        <span>
          <kbd className="kbd">↑</kbd>
          <kbd className="kbd">↓</kbd> chọn
        </span>
        <span>
          <kbd className="kbd">↵</kbd> mở
        </span>
      </div>
    </Command.Dialog>
  );
}
