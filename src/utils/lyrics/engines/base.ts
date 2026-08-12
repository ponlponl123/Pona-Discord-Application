import { parseYouTubeAuthorTitle, parseYouTubeTitle } from '@/utils/parser';

export function normalizeLyricSearchQuery(
  title?: string,
  author?: string,
): { cleanTitle: string; cleanAuthor: string; searchQuery: string } {
  const rawAuthor = author || '';
  const rawTitle = title || '';

  const parsed = parseYouTubeTitle(rawTitle, rawAuthor);
  const cleanAuthor = parseYouTubeAuthorTitle(parsed.cleanAuthor || rawAuthor);
  const cleanTitle = parsed.cleanTitle || rawTitle;

  const searchQuery = cleanTitle && cleanAuthor ? `${cleanTitle} ${cleanAuthor}` : cleanTitle || rawTitle;

  return {
    cleanTitle,
    cleanAuthor,
    searchQuery,
  };
}
