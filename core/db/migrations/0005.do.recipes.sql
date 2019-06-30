CREATE TABLE public.recipes
(
    id bigserial NOT NULL,
    name character varying(500),
    foodstuff bigint[],
    description character varying(10000),
    public boolean NOT NULL DEFAULT false,
    owner_id bigint NOT NULL,
    recipe_users bigint[],
    parent_id bigint,
    portions smallint,
    PRIMARY KEY (id),
    created_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    CONSTRAINT recipes_users_fk FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (OIDS = FALSE);