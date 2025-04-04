
CREATE OR REPLACE FUNCTION public.increment_poll_votes(poll_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.polls
  SET total_votes = total_votes + 1
  WHERE id = poll_id_param;
END;
$$;
