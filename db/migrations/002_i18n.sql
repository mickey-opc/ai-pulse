-- Migration: Add Chinese translation fields
ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_zh TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS summary_zh TEXT;
