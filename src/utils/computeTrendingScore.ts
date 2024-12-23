export function computeTrendingScore(
  likes: number,
  comments: number,
  bookmarks: number,
  hoursSinceCreation: number
): number {
  const LIKE_WEIGHT = 3;
  const COMMENT_WEIGHT = 5;
  const BOOKMARK_WEIGHT = 2;

  // time decay exponent
  const TIME_EXPONENT = 1.5;

  // offset to avoid extreme results for brand-new discussions
  const TIME_OFFSET = 2;

  const weightedSum =
    LIKE_WEIGHT * likes +
    COMMENT_WEIGHT * comments +
    BOOKMARK_WEIGHT * bookmarks;

  const logScore = Math.log10(Math.max(weightedSum, 1));

  const timeFactor = Math.pow(hoursSinceCreation + TIME_OFFSET, TIME_EXPONENT);

  // Weighted sum of interactions / timeFactor
  const finalScore: number = logScore / timeFactor;

  return finalScore;
}
