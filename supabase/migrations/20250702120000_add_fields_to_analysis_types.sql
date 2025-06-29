-- Migration: Add new fields to analysis_types for advanced AI config and workflow
ALTER TABLE analysis_types
  ADD COLUMN weightage decimal(5,2) NULL,
  ADD COLUMN redo boolean NOT NULL DEFAULT false,
  ADD COLUMN redo_notes text NULL,
  ADD COLUMN output_structure jsonb NULL,
  ADD COLUMN input_structure jsonb NULL,
  ADD COLUMN prompt text NULL,
  ADD COLUMN top_k int NULL,
  ADD COLUMN top_p decimal(5,2) NULL,
  ADD COLUMN temperature decimal(5,2) NULL,
  ADD COLUMN suggested_models text[] NULL; 