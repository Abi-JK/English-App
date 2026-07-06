import { useLocalStorage } from './useLocalStorage';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useLocalStorage('speakup_bookmarks', []);

  const addBookmark = (item) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === item.id && b.type === item.type);
      if (exists) return prev;
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  };

  const removeBookmark = (id, type) => {
    setBookmarks(prev => prev.filter(b => !(b.id === id && b.type === type)));
  };

  const toggleBookmark = (item) => {
    const exists = bookmarks.find(b => b.id === item.id && b.type === item.type);
    if (exists) {
      removeBookmark(item.id, item.type);
      return false;
    } else {
      addBookmark(item);
      return true;
    }
  };

  const isBookmarked = (id, type) => {
    return bookmarks.some(b => b.id === id && b.type === type);
  };

  const clearBookmarks = () => {
    setBookmarks([]);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearBookmarks
  };
};
