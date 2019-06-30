CREATE TABLE public.tokens (
   token character varying(100) NOT NULL,
   user_id bigint NOT NULL,
   "expired_at" timestamp with time zone NOT NULL,
   "created_at" timestamp with time zone NOT NULL,
   CONSTRAINT token_user_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE NO ACTION
) WITH ( OIDS = FALSE ) ;
CREATE INDEX tokens_token_idx ON public.tokens (token ASC NULLS LAST);