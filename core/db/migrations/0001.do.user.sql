
CREATE TABLE public.users (
   id serial NOT NULL,
   email character varying(250),
   phone character varying(20),
   password character varying(50),
   first_name character varying(50),
   last_name character varying(50),
   fathers_name character varying(50),
   role smallint NOT NULL,
   active boolean NOT NULL,
   removed boolean NOT NULL default false,
   created_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
   updated_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
   PRIMARY KEY(id)
) WITH (OIDS = FALSE);
-- roles: 0 - user, 3 - admin
INSERT INTO users (email, password, role, active, removed) VALUES
('admin@smart-menu.ru', 'qOA0Uf7iK157761216d9fdfe8519ea0734243aa9a', 3, true, false);