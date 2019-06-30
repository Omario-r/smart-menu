CREATE TABLE public.foodstuffs
(
    id bigserial NOT NULL,
    name character varying(150),
    category integer,
    compatibility_ids integer[],
    gluten_free boolean,
    glycemic_index integer,
    PRIMARY KEY (id)
)
WITH ( OIDS = FALSE );