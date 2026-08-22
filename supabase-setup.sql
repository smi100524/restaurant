-- ================= 赛尔美餐厅点餐系统 · Supabase 建表脚本 =================
-- 使用方法：Supabase 控制台 -> SQL Editor（左侧菜单）-> New query -> 粘贴全部 -> Run
-- 创建菜品表
create table if not exists menu (
  id bigint primary key,
  name text not null default '',
  en text not null default '',
  price numeric not null default 0,
  cat text not null default '其他',
  description text not null default '',
  emoji text not null default '🍽️',
  tags jsonb not null default '[]'::jsonb,
  img text not null default '',
  created_at timestamptz not null default now()
);

-- 创建订单表
create table if not exists orders (
  id bigint primary key,
  no text not null default '',
  name text not null default '',
  phone text not null default '',
  dept text not null default '',
  booker text not null default '',
  book_date text not null default '',
  book_time text not null default '',
  people int not null default 1,
  note text not null default '',
  room text not null default '',
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  ts bigint not null default 0,
  created_at timestamptz not null default now()
);

-- 创建预订表
create table if not exists reservations (
  id bigint primary key,
  name text not null default '',
  phone text not null default '',
  dept text not null default '',
  booker text not null default '',
  book_date text not null default '',
  book_time text not null default '',
  people int not null default 1,
  note text not null default '',
  room text not null default '',
  ts bigint not null default 0,
  created_at timestamptz not null default now()
);

-- 开放匿名读写（便于餐厅运营；后续可加登录鉴权升级）
alter table menu enable row level security;
alter table orders enable row level security;
alter table reservations enable row level security;

create policy menu_all on menu for all using (true) with check (true);
create policy orders_all on orders for all using (true) with check (true);
create policy reservations_all on reservations for all using (true) with check (true);