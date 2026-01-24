-- 1. Create the 'resumes' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

-- 2. Safely create policies (only if they don't exist)
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'objects' 
    and policyname = 'Public Access'
  ) then
    create policy "Public Access"
      on storage.objects for select
      using ( bucket_id = 'resumes' );
  end if;

  if not exists (
    select 1 from pg_policies 
    where tablename = 'objects' 
    and policyname = 'Public Uploads'
  ) then
    create policy "Public Uploads"
      on storage.objects for insert
      with check ( bucket_id = 'resumes' );
  end if;
end $$;

-- 3. Confirm setup
select * from storage.buckets where id = 'resumes';
