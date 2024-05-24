import User from './user';
import Post from './posts';

void User.sync();
void Post.sync();

export default { User, Post };
