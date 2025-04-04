
CREATE OR REPLACE FUNCTION public.increment_option_vote(option_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.poll_options
  SET votes = votes + 1
  WHERE id = option_id_param;
END;
$$;
