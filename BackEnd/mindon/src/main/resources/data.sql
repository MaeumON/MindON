DROP DATABASE IF EXISTS on_board;
CREATE DATABASE on_board DEFAULT CHARSET utf8mb4;
USE on_board;

SET GLOBAL event_scheduler = ON;

CREATE TABLE `diseases` (
                            `disease_id` TINYINT AUTO_INCREMENT NOT NULL,
                            `disease_name` VARCHAR(20) NOT NULL,
                            PRIMARY KEY (`disease_id`)
);

CREATE TABLE `emotions` (
                            `emotion_id` TINYINT NOT NULL,
                            `emotion` VARCHAR(20) NOT NULL COMMENT '기본, 기쁜, 슬픈, 평범한, 불쾌한, 설레는, 놀란, 두려운, 화나는',
                            PRIMARY KEY (`emotion_id`)
);

CREATE TABLE `users` (
                         `user_id` VARCHAR(10) NOT NULL,
                         `user_name` VARCHAR(5) NOT NULL,
                         `email` VARCHAR(60) NOT NULL UNIQUE,
                         `password` VARCHAR(255) NOT NULL,
                         `phone` VARCHAR(20) NOT NULL UNIQUE,
                         `disease_id` TINYINT NOT NULL,
                         `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
                         `user_status` TINYINT NOT NULL DEFAULT 0 COMMENT '0: 활성화, 1: 탈퇴, 2: 정지',
                         `reported_cnt` INT NOT NULL DEFAULT 0,
                         PRIMARY KEY (`user_id`),
                         FOREIGN KEY (`disease_id`) REFERENCES `diseases` (`disease_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `groups` (
                          `group_id` INT AUTO_INCREMENT NOT NULL,
                          `title` VARCHAR(15) NOT NULL,
                          `description` TEXT,
                          `is_private` BOOLEAN NOT NULL,
                          `private_password` VARCHAR(4),
                          `is_host` BOOLEAN NOT NULL,
                          `period` TINYINT NOT NULL COMMENT '1~8',
                          `invite_code` VARCHAR(8) NOT NULL,
                          `progress_weeks` TINYINT NOT NULL DEFAULT 0,
                          `total_member` TINYINT NOT NULL DEFAULT 0,
                          `created_user_id` VARCHAR(10) NOT NULL,
                          `start_date` DATETIME NOT NULL,
                          `end_date` DATETIME NOT NULL,
                          `meeting_time` TINYINT NOT NULL COMMENT '0~23',
                          `day_of_week` TINYINT NOT NULL COMMENT '0~6',
                          `min_member` TINYINT NOT NULL DEFAULT 2,
                          `max_member` TINYINT NOT NULL DEFAULT 8,
                          `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          `group_status` TINYINT NOT NULL DEFAULT 0 COMMENT '0 : 진행예정, 1 : 진행중, 2 : 종료',
                          `disease_id` TINYINT NOT NULL,
                          PRIMARY KEY (`group_id`),
                          FOREIGN KEY (`created_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                          FOREIGN KEY (`disease_id`) REFERENCES `diseases` (`disease_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `user_group` (
                              `user_id` VARCHAR(10) NOT NULL,
                              `group_id` INT NOT NULL,
                              `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              `is_banned` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '강퇴 : True',
                              `banned_date` DATETIME,
                              PRIMARY KEY (`user_id`, `group_id`),
                              FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                              FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `meetings` (
                            `meeting_id` INT AUTO_INCREMENT NOT NULL,
                            `meeting_week` TINYINT NOT NULL COMMENT '1~period',
                            `group_id` INT NOT NULL,
                            `date` DATETIME NOT NULL,
                            `meeting_status` TINYINT NOT NULL DEFAULT 0 COMMENT '0: 진행 전, 1: 진행중, 2: 종료',
                            `curriculum` TINYINT COMMENT 'period에 따라 랜덤 부여 ex) period : 4 -> 1, 3, 7, 8 순서대로 진행',
                            PRIMARY KEY (`meeting_id`),
                            FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `user_review` (
                               `user_id` VARCHAR(10) NOT NULL,
                               `meeting_id` INT NOT NULL,
                               `meeting_week` TINYINT NOT NULL COMMENT '1~8',
                               `summation` TEXT NOT NULL,
                               `cheering_message` TEXT NOT NULL,
                               `speech_amount` INT NOT NULL,
                               `emotion_id` TINYINT NOT NULL,
                               PRIMARY KEY (`user_id`, `meeting_id`),
                               FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                               FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`meeting_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                               FOREIGN KEY (`emotion_id`) REFERENCES `emotions` (`emotion_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `reasons` (
                           `reason_id` TINYINT AUTO_INCREMENT NOT NULL,
                           `reason_name` VARCHAR(10) NOT NULL,
                           PRIMARY KEY (`reason_id`)
);

CREATE TABLE `reports` (
                           `report_id` INT AUTO_INCREMENT NOT NULL,
                           `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           `reason` TEXT,
                           `reason_id` TINYINT NOT NULL,
                           `reporting_user_id` VARCHAR(10) NOT NULL,
                           `reported_user_id` VARCHAR(10) NOT NULL,
                           `group_id` INT NOT NULL,
                           PRIMARY KEY (`report_id`),
                           FOREIGN KEY (`reason_id`) REFERENCES `reasons` (`reason_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                           FOREIGN KEY (`reporting_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                           FOREIGN KEY (`reported_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                           FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `questions` (
                             `question_id` INT AUTO_INCREMENT NOT NULL,
                             `curriculum_week` TINYINT NOT NULL COMMENT '1~8',
                             `detail` TEXT NOT NULL,
                             PRIMARY KEY (`question_id`)
);

CREATE TABLE `stt` (
                       `user_id` VARCHAR(10) NOT NULL,
                       `meeting_id` INT NOT NULL,
                       `question_id` INT NOT NULL,
                       `text` TEXT NOT NULL,
                       PRIMARY KEY (`user_id`, `meeting_id`, `question_id`),
                       FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                       FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`meeting_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                       FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 1. 'users' 테이블의 'user_status' 필드 범위 제한 (0, 1, 2)
ALTER TABLE users ADD CONSTRAINT chk_user_status CHECK (user_status IN (0, 1, 2));

-- 2. 'groups' 테이블의 'period', 'meeting_time', 'group_status' 범위 제한
ALTER TABLE `groups` ADD CONSTRAINT chk_period CHECK (period BETWEEN 1 AND 8);
ALTER TABLE `groups` ADD CONSTRAINT chk_meeting_time CHECK (meeting_time BETWEEN 0 AND 23);
ALTER TABLE `groups` ADD CONSTRAINT chk_group_status CHECK (group_status IN (0, 1, 2));

-- 3. 'user_review' 테이블의 'meeting_week' 필드 범위 제한 (1~8)
ALTER TABLE user_review ADD CONSTRAINT chk_user_review_meeting_week CHECK (meeting_week BETWEEN 1 AND 8);

-- 4. 'questions' 테이블의 'curriculum_week' 필드 범위 제한 (1~8)
ALTER TABLE questions ADD CONSTRAINT chk_curriculum_week CHECK (curriculum_week BETWEEN 1 AND 8);

-- 5. 'meetings' 테이블의 'meeting_status' 필드 범위 제한 (0, 1, 2)
ALTER TABLE meetings ADD CONSTRAINT chk_meeting_status CHECK (meeting_status IN (0, 1, 2));

-- 6. 'meetings' 테이블의 'meeting_week' 동적 범위 트리거 설정
DELIMITER $$

CREATE TRIGGER CheckMeetingWeekBeforeInsert
    BEFORE INSERT ON meetings
    FOR EACH ROW
BEGIN
    IF NEW.meeting_week < 1 OR NEW.meeting_week > `groups`.period THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'meeting_week must be between 1 and the value of period';
    END IF;
END$$

CREATE TRIGGER CheckMeetingWeekBeforeUpdate
    BEFORE UPDATE ON meetings
    FOR EACH ROW
BEGIN
    IF NEW.meeting_week < 1 OR NEW.meeting_week > `groups`.period THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'meeting_week must be between 1 and the value of period';
    END IF;
END$$

DELIMITER ;

-- 초대 코드 랜덤 생성 트리거
DELIMITER $$

CREATE TRIGGER BeforeInsertGroups
    BEFORE INSERT ON `groups`
    FOR EACH ROW
BEGIN
    DECLARE new_code VARCHAR(10);
    DECLARE code_exists INT;

    SET new_code = (SELECT CONCAT(
                                   SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                   SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                   SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                   SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                   SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                   SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                   SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                   SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1)
                           ));

    -- 코드 중복 검사
    SELECT COUNT(*) INTO code_exists FROM `groups` WHERE invite_code = new_code;
    WHILE code_exists > 0 DO
            SET new_code = (SELECT CONCAT(
                                           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1),
                                           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(RAND()*36)+1, 1)
                                   ));
            SELECT COUNT(*) INTO code_exists FROM `groups` WHERE invite_code = new_code;
        END WHILE;

    SET NEW.invite_code = new_code;
END$$

DELIMITER ;

-- 신고 횟수 갱신 트리거
DELIMITER $$

CREATE TRIGGER UpdateReportedCountAfterInsert
    AFTER INSERT ON reports
    FOR EACH ROW
BEGIN
    -- reported_user_id를 가진 사용자의 reported_cnt를 업데이트
    UPDATE users
    SET reported_cnt = reported_cnt + 1
    WHERE user_id = NEW.reported_user_id;
END$$

DELIMITER ;

-- groups의 종료 날짜 자동 생성 트리거
DELIMITER $$

CREATE TRIGGER CalculateEndDateBeforeInsert
    BEFORE INSERT ON `groups`
    FOR EACH ROW
BEGIN
    -- start_date로부터 period 주 만큼 후의 날짜를 end_date로 계산
    SET NEW.end_date = DATE_ADD(NEW.start_date, INTERVAL (NEW.period - 1) WEEK);
END$$

DELIMITER ;

-- groups의 날짜에 시간 정보 추가하기 (status 자동 변경을 위해)
DELIMITER $$

CREATE TRIGGER SetGroupTimesBeforeInsertOrUpdate
    BEFORE INSERT ON `groups`
    FOR EACH ROW
BEGIN
    -- start_date와 end_date의 시간을 meeting_time 값으로 설정
    SET NEW.start_date = CONCAT(DATE(NEW.start_date), ' ', LPAD(NEW.meeting_time, 2, '0'), ':00:00');
    SET NEW.end_date = CONCAT(DATE(NEW.end_date), ' ', LPAD(NEW.meeting_time, 2, '0'), ':00:00');
END$$

CREATE TRIGGER SetGroupTimesBeforeUpdate
    BEFORE UPDATE ON `groups`
    FOR EACH ROW
BEGIN
    -- start_date와 end_date의 시간을 meeting_time 값으로 설정
    SET NEW.start_date = CONCAT(DATE(NEW.start_date), ' ', LPAD(NEW.meeting_time, 2, '0'), ':00:00');
    SET NEW.end_date = CONCAT(DATE(NEW.end_date), ' ', LPAD(NEW.meeting_time, 2, '0'), ':00:00');
END$$

DELIMITER ;


--  group_status 상태 자동 변경 스케줄러
DELIMITER $$

CREATE EVENT UpdateGroupStatusHourly
    ON SCHEDULE EVERY 1 hour STARTS TIMESTAMP(CURRENT_DATE, '00:00:00')
    DO
    BEGIN
        UPDATE `groups`
        SET group_status = CASE
                               WHEN CURDATE() < start_date THEN 0
                               WHEN CURDATE() >= start_date AND CURDATE() <= DATE_ADD(end_date, INTERVAL 1 HOUR) THEN 1
                               ELSE 2
            END;
    END$$

DELIMITER ;

-- group_user 행 추가시 groups total_member 증가 트리거
DELIMITER $$

CREATE TRIGGER IncreaseTotalMembers
    AFTER INSERT ON user_group
    FOR EACH ROW
BEGIN
    UPDATE `groups`
    SET total_member = total_member + 1
    WHERE group_id = NEW.group_id;
END$$

DELIMITER ;

-- group_user 행 삭제시 groups total_member 감소 트리거
DELIMITER $$

CREATE TRIGGER DecreaseTotalMembers
    AFTER DELETE ON user_group
    FOR EACH ROW
BEGIN
    UPDATE `groups`
    SET total_member = total_member - 1
    WHERE group_id = OLD.group_id;
END$$

DELIMITER ;

-- 스케줄러로 progress_weeks 자동 업데이트alter
-- DELIMITER $$

-- CREATE EVENT UpdateProgressWeeksWeekly
-- ON SCHEDULE EVERY 1 WEEK STARTS (SELECT MIN(DATE_ADD(start_date, INTERVAL 1 HOUR)) FROM `groups` WHERE progress_weeks < period)
-- DO
--     BEGIN
--         UPDATE `groups`
--         SET progress_weeks = progress_weeks + 1
--         WHERE progress_weeks < period;
--     END$$

-- DELIMITER ;


-- users 신고 횟수 3회 이상이면 계정 정지
DELIMITER $$

CREATE TRIGGER BeforeUpdateReportCount
    BEFORE UPDATE ON users
    FOR EACH ROW
BEGIN
    IF NEW.reported_cnt >= 3 AND OLD.reported_cnt < 3 THEN
        SET NEW.user_status = 2;
    END IF;
END$$

DELIMITER ;



-- 인덱스 추가 (groups)
CREATE INDEX idx_groups_disease_id ON `groups`(disease_id);
CREATE INDEX idx_groups_is_private ON `groups`(is_private);
CREATE INDEX idx_groups_is_host ON `groups`(is_host);
CREATE INDEX idx_groups_day_of_week ON `groups`(day_of_week);


INSERT INTO diseases (disease_name) VALUES ('소아암');
select * from diseases;

INSERT INTO users (user_id, user_name, email, password, phone, disease_id)
values ("user1", "우담", "user1@ssafy.com", "ssafy1234", "01012345678", 1),
       ("user2", "현", "user2@ssafy.com", "ssafy1234", "01012345677", 1),
       ("user3", "현희", "user3@ssafy.com", "ssafy1234", "01012345676", 1),
       ("user4", "하영", "user4@ssafy.com", "ssafy1234", "01012345675", 1),
       ("user5", "수인", "user5@ssafy.com", "ssafy1234", "01012345674", 1),
       ("user6", "아현", "user6@ssafy.com", "ssafy1234", "01012345673", 1);
select * from users;

INSERT INTO `groups` (title, description, disease_id, is_private, private_password, is_host, start_date, period, meeting_time, day_of_week, min_member, max_member, created_user_id)
values ("소아암 자조모임","같이하자", 1, true, "1234", true, '2025-01-24',2,17,1,2,8,'user2'),
       ("소아암 자조모임", "같이해", 1, false, null, true, '2025-01-01',4,12,1,4,6,'user1'),
       ("상태 자동 변경 확인용", "룰룰라룰ㄹ", 1, false, null, true, '2025-02-01',4,12,1,4,6,'user1');
select * from `groups`;

INSERT INTO user_group (user_id, group_id)
values ("user2" , 1),
       ("user1" , 1);
select * from user_group;
select * from `groups`;

INSERT INTO reasons (reason_name)
values ("욕설 및 비방"),
       ("광고");

INSERT INTO reports (reason_id, reason, reporting_user_id, reported_user_id, group_id)
values (1, "욕을 자꾸 하자나요 쟤가", 'user1', 'user2',1),
       (2, "광고 같아요;;;;", 'user1', 'user2',1),
       (2, "광고 같음", 'user1', 'user2',1);
select * from reports;
select * from users;

DELETE FROM user_group
WHERE user_id = 'user1' AND group_id = 1;
select * from user_group;
select * from `groups`; -- total_member 감소 확인

INSERT INTO questions (curriculum_week, detail)
values (1, "1주차"),
       (2, "2주차"),
       (3, "3주차"),
       (4, "4주차"),
       (5, "5주차"),
       (6, "6주차"),
       (7, "7주차"),
       (8, "8주차");
select * from questions;

INSERT INTO emotions(emotion_id, emotion)
VALUES (0,"기본"),
       (1,"기쁜"),
       (2,"슬픈"),
       (3,"평범한"),
       (4,"불쾌한"),
       (5,"설레는"),
       (6,"놀란"),
       (7,"두려운"),
       (8,"화나는");
select * from emotions;