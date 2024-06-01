import models from '../models';
import { NewDiscussion } from '../types/discussionType';

const { Discussion } = models;

const addDiscussion = async (newDiscussion: NewDiscussion, userId: number) => {
  const addedDiscussion = await Discussion.create({
    ...newDiscussion,
    userId: userId,
  });
  return addedDiscussion;
};

const getDiscussions = async (limit: number, offset: number) => {
  const discussions = 1;
  return discussions;
};

export default {
  addDiscussion,
  getDiscussions,
};
