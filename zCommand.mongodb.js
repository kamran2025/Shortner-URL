
use('short-url');
db.users.updateOne({name: 'kamran'}, {$set:{role: 'ADMIN'}})