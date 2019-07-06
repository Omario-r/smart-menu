CREATE TABLE public.recipe_foodstuffs
(
    id bigserial NOT NULL,
    recipe_id bigint,
    foodstuff_id bigint,
    weight_recipe integer,
    weight_portion integer,
    PRIMARY KEY (id),
    CONSTRAINT recipe_fk FOREIGN KEY (recipe_id)
        REFERENCES public.recipes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT foodstuff_fk FOREIGN KEY (foodstuff_id)
        REFERENCES public.foodstuffs (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (OIDS = FALSE);