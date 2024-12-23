import prisma from '../utils/prismaClient';
import { computeTrendingScore } from '../utils/computeTrendingScore';

export async function updateTrendingScores() {
  try {
    const discussions = await prisma.discussion.findMany({
      where: { isDeleted: false },
      include: {
        _count: { select: { likes: true, comments: true, bookmarks: true } },
      },
    });

    const now = new Date();

    const updates = discussions.map((discussion) => {
      const hoursSinceCreation =
        (now.getTime() - new Date(discussion.createdAt).getTime()) /
        (1000 * 60 * 60);

      const trendingScore = computeTrendingScore(
        discussion._count.likes || 0,
        discussion._count.comments || 0,
        discussion._count.bookmarks || 0,
        hoursSinceCreation
      );

      return prisma.discussion.update({
        where: { id: discussion.id },
        data: { trendingScore },
      });
    });

    await Promise.all(updates);

    console.log('Trending scores updated successfully!');
  } catch (error) {
    console.error('Error updating trending scores:', error);
  }
}
