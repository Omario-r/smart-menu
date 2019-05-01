CREATE TABLE public.menus
(
    id bigserial NOT NULL,
    name character varying(250),
    days jsonb[],
    owner_id bigint NOT NULL,
    menu_users bigint[],
    parent_id bigint,
    recipes bigint[],
    PRIMARY KEY (id),
        CONSTRAINT menu_user_fk FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (OIDS = FALSE);