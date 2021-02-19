DROP view vw_posts_with_user;
CREATE VIEW vw_posts_with_user as
select
  posts.*, profiles.username, profiles.avatar, profiles.displayname
from
  posts posts
  join profiles profiles on posts.user_id = profiles.id

select * from vw_posts_with_user;