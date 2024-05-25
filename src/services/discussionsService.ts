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

export default {
  addDiscussion,
};
