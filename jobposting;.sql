--  SELECT `chat`.*, chatContent.*
--    FROM `chat` 
--    LEFT JOIN `chat_content` `chatContent` 
--      ON `chatContent`.`chat_id`=`chat`.`id` 
--     AND (`chatContent`.`delete_at` IS NULL) 
--   WHERE `chat`.`delete_at` IS NULL 
--   GROUP BY `chatContent`.`sender_id`;

UPDATE chat_content
  SET is_check = 1 
 WHERE id = 3;


--  SELECT `chatContent`.`chat_id` AS `chat_id`, COUNT(`chatContent`.`is_check`) AS `isCheck` 
--     FROM `chat`
--    LEFT JOIN `chat_content` `chatContent` 
--      ON `chatContent`.`chat_id`=`chat`.`id` 
--     AND (`chatContent`.`delete_at` IS NULL) 
--   WHERE `chatContent`.`is_check` = 0 
--     and `chatContent`.`sender_id` != 1
--   GROUP BY `chatContent`.`chat_id`;