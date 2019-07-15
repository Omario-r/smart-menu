ALTER TABLE public.menus
    ADD COLUMN public boolean NOT NULL default true;

update menus set public=true;