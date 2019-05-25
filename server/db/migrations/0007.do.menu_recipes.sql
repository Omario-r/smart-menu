CREATE TABLE public.menu_recipes
(
    id bigserial NOT NULL,
    menu_id bigint NOT NULL,
    recipe_id bigint,
    week smallint,
    day smallint,
    eat_time smallint,
    dish smallint,
    portions smallint,
    PRIMARY KEY (id),
    CONSTRAINT menu_fk FOREIGN KEY (menu_id)
        REFERENCES public.menus (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT recipe_fk FOREIGN KEY (recipe_id)
        REFERENCES public.recipes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (OIDS = FALSE);