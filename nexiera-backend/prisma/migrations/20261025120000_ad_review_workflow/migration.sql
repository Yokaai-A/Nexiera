ALTER TABLE `ads`
  MODIFY `status` ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE', 'PAUSED') NOT NULL DEFAULT 'PENDING_REVIEW';

-- Existing ACTIVE ads were already published through the previous workflow.
UPDATE `ads` SET `status` = 'APPROVED' WHERE `status` = 'ACTIVE';

ALTER TABLE `ads`
  MODIFY `status` ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PAUSED') NOT NULL DEFAULT 'PENDING_REVIEW';
