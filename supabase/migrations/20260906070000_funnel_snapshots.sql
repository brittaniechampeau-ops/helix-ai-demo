-- One funnel reading per window, whoever writes it.
--
-- A local collector run and the cloud sweep can both be alive. They must not both
-- claim to be the writer for one window, or two runtimes disagree about one hour and
-- nothing downstream can tell which is true. The unique key makes the second writer
-- a harmless no-op and the row records which one won.

CREATE TABLE IF NOT EXISTS public.drive_funnel_snapshots (
  id            bigserial PRIMARY KEY,
  window_start  timestamptz NOT NULL,
  kind          text NOT NULL DEFAULT 'funnel',
  writer        text NOT NULL,
  reading       jsonb NOT NULL,
  errors        jsonb NOT NULL DEFAULT '[]'::jsonb,
  started_at    timestamptz,
  finished_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS drive_funnel_snapshots_window
  ON public.drive_funnel_snapshots (window_start, kind);

COMMENT ON COLUMN public.drive_funnel_snapshots.writer IS
  'Which runtime produced this window. Two writers cannot both own one window; the second is a no-op.';
COMMENT ON COLUMN public.drive_funnel_snapshots.errors IS
  'Sources that could not be read. Their counters are null in `reading`, never zero.';

ALTER TABLE public.drive_funnel_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS drive_funnel_snapshots_admin_read ON public.drive_funnel_snapshots;
CREATE POLICY drive_funnel_snapshots_admin_read ON public.drive_funnel_snapshots
  FOR SELECT USING (public.is_admin());
