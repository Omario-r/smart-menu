ALTER TABLE public.menus
    ADD COLUMN public boolean NOT NULL;

update menus set public=true;