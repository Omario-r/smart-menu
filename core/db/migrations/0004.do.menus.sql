CREATE TABLE public.menus
(
    id bigserial NOT NULL,
    name character varying(100),
    description character varying(500),
    owner_id bigint NOT NULL,
    weeks smallint[],
    created_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
        CONSTRAINT menu_user_fk FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (OIDS = FALSE);