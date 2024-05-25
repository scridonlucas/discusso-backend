import User from './user';
import Discussion from './discussions';

User.hasMany(Discussion);
Discussion.belongsTo(User);

void User.sync({ alter: true });
void Discussion.sync({ alter: true });

export default { User, Discussion };
