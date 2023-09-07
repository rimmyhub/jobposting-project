SELECT `chat`.`id` AS `chat_id`, `COUNT(chatContent)`.`sender_id` 
  FROM `chat` `chat` 
  LEFT JOIN `chat_content` `chatContent` 
    ON `chatContent`.`chat_id`=`chat`.`id` 
   AND (`chatContent`.`delete_at` IS NULL) 
 WHERE ( `chatContent`.`sender_id` != 1
   AND `chatContent`.`is_check` = 0 ) 
   AND ( `chat`.`delete_at` IS NULL ) 
 GROUP BY `chatContent`.`sender_id`