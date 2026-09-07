-- Bill links to phases/materials, and profile identity fields

alter table profiles add column if not exists email text;
alter table profiles add column if not exists photo_url text;

alter table bills add column if not exists phase_id integer references phases(id) on delete set null;
alter table bills add column if not exists material_id integer references materials(id) on delete set null;
