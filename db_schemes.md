# Database schemas

## Users

- user_name `TEXT` `NOT NULL`
- password `TEXT` `NOT NULL`

## Sessions

- user_name `TEXT` `NOT NULL`
- session_id `TEXT` `NOT NULL`

## Videos

- id `TEXT` `NOT NULL`
- title `TEXT` `NOT NULL`
- tags `TEXT`
- owner `TEXT` `NOT NULL`
- upload_date `BIGINT` `NOT NULL` (Millis)
- length `TEXT` `NOT NULL` (HH:MM:SS)
- path `TEXT` `NOT NULL` (xyz/video.mp4)
- thumbnail `TEXT` `NOT NULL` (xyz/image.png)
