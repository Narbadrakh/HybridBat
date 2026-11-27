# Devlog: 2026-11-25. Зарын жагсаалт, дэлгэрэнгүй хуудас, зургийн upload

## Өнөөдрийн зорилго

Өмнөх devlog-уудаар (11/16 UI, 11/17 DB, 11/18 Clerk + "Зар нэмэх" форм) нүүр хуудас, загварын хуудас, `listings` хүснэгт, нэвтрэлт, зар нэмэх форм бэлэн болсон. Өнөөдөр:

1. Бүх зарын жагсаалт `/listings` (хайлт, шүүлтүүртэй)
2. Зарын дэлгэрэнгүй хуудас `/listings/[id]` (утастай)
3. Зарын зургийг Supabase Storage-д хадгалах

## Хийсэн зүйлс

### 1. Clerk-ийн урсгал баталгаажсан

- Бүртгүүлэх (`/sign-up`) ажилласан.
- Нэвтрээгүй хүн `/listings/new` руу орвол `/sign-in` руу чиглэнэ.
- Нэвтэрсэн хэрэглэгч "Зар нэмэх" формыг харна.

### 2. `/listings`: шүүлтүүртэй жагсаалт

| Шүүлтүүр | Хэрхэн ажилладаг |
|----------|------------------|
| Хайх | Гарчиг, тайлбараас `ilike` (том/жижиг үсэг ялгахгүй). `%` `_` `\` тэмдэгтийг escape хийнэ |
| Төрөл | `battery` / `repair` / `cell`. URL-аас ирсэн утгыг `LISTING_TYPE_LABEL`-ээр шалгана |
| Доод/дээд үнэ | Тоо биш утгыг үл тооно |
| Загвар | `?model=prius-30` (hidden input) |

Шүүлтүүр "Хайх" товч дарж илгээгдэнэ (GET form). Сонголт өөрчлөхөд автоматаар шүүгдэхгүй.

### 3. `/listings/[id]`: дэлгэрэнгүй хуудас

- `id` нь **uuid (string)**. Regex-ээр шалгаж, буруу бол DB руу явуулахгүйгээр `notFound()` (404) буцаана. Шалгахгүй бол Postgres алдаа өгч 500 болно.
- Утасны дугаар **зөвхөн энд** харагдана. Жагсаалтын query утас, `user_id`-г сонгодоггүй.
- `phone`, `description` нь `null` байж болох тул нөхцөлтэй харуулна.

### 4. Зургийн upload (Supabase Storage)

**Урсгал:**

```
Хэрэглэгч форм бөглөж зураг сонгоно
   -> Server Action (createListing) сервер дээр ажиллана
      1. Clerk-ээр нэвтэрсэн эсэхийг шалгана
      2. Талбаруудыг шалгана
      3. Зургийг шалгана: 5MB-аас бага, эхний байтаар жинхэнэ төрлийг (JPG/PNG/WebP) тодорхойлно
      4. Secret key-ээр Storage-д <uuid>.<ext> нэрээр оруулна
      5. Нийтийн URL-ыг DB-ийн image_url баганад хадгална
      6. DB алдаа гарвал оруулсан зургийг устгана (хаягдал үлдээхгүй)
   -> Карт, дэлгэрэнгүй хуудас next/image-ээр зургийг харуулна
```

**Хийсэн тохиргоо:**

| # | Юу | Хаана |
|---|-----|-------|
| 1 | Public bucket `listing-images` | Supabase -> Storage |
| 2 | `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | `.env.local` (NEXT_PUBLIC_ГҮЙ) |
| 3 | `@supabase/supabase-js` | `npm install` |
| 4 | Серверийн клиент | `lib/supabase-admin.ts` (`server-only`) |
| 5 | `image_url` багана | `lib/db/schema.ts` + `drizzle/0001_petite_terrax.sql` |
| 6 | Remote зураг зөвшөөрөх, Server Action body 6MB | `next.config.ts` |

**Өөрчилсөн файлууд:**

| Файл | Өөрчлөлт |
|------|----------|
| `lib/db/schema.ts` | `imageUrl: text("image_url")` |
| `lib/listing-types.ts` | `Listing` төрөлд `imageUrl` |
| `lib/listings.ts` | `cardColumns`-д `imageUrl`; `searchListings`, `getListingById(id: string)` |
| `app/listings/new/actions.ts` | Зураг шалгах, upload, rollback |
| `app/listings/new/ListingForm.tsx` | Файл сонгох талбар, урьдчилсан харалт, 5MB-ийн client шалгалт |
| `app/_components/FeaturedListings.tsx` | `ListingCard`-д зураг (зураггүй бол 🔋) |
| `app/listings/page.tsx` | `ListingCard`-ыг дахин ашигласан |
| `app/listings/[id]/page.tsx` | Том зураг |
| `next.config.ts` | `images.remotePatterns`, `serverActions.bodySizeLimit` |

## Тулгарсан асуудал, шийдэл

| Асуудал | Шалтгаан | Шийдэл |
|---------|----------|--------|
| `.ts` файлд 77 алдаа | JSX кодыг `lib/listings.ts` (`.ts`) руу буулгасан | Хуудас нь `app/.../page.tsx`, өгөгдлийн функц нь `lib/*.ts` |
| `getListingById(n)`: number -> string | `id` нь uuid, `Number(id)` ашигласан | uuid regex + string параметр |
| `type: string` -> `"battery" \| ...` | URL-ийн `type`-ыг шалгаагүй | `sp.type in LISTING_TYPE_LABEL` шалгалт |
| `Property 'imageUrl' is missing` | `cardColumns`-д `imageUrl` нэмээгүй | `imageUrl: listings.imageUrl` нэмсэн |
| Хар горимд картын гарчиг харагдахгүй | Картын дэвсгэр `bg-white`, үсэг цагаан | Картыг `bg-surface`-тэй `ListingCard` болгож нэгтгэсэн |
| "Зураг" талбар форм дээр харагдахгүй | `ListingForm.tsx` хуучин хэвээр, шинийг буулгаагүй | Файлыг бүтнээр нь солих |
| Drizzle `NOTICE ... already exists` | Drizzle-ийн дотоод хүснэгт аль хэдийн байгаа | Алдаа биш |
| Хуулсан кодонд ` ```typescript ` орсон | Markdown хашилтыг хамт хуулсан | Зөвхөн кодыг хуулна |

## Аюулгүй байдал

- Зураг оруулах **secret key зөвхөн серверт**: `lib/supabase-admin.ts` нь `server-only`, env нэр `NEXT_PUBLIC_`-гүй.
- Файлын нэр, MIME төрөлд найдахгүй. Эхний байтаар шалгана (JPEG `FF D8 FF`, PNG `89 50 4E 47`, WebP `RIFF....WEBP`).
- 5MB хязгаар хоёр газар: browser (хурдан хариу), сервер (жинхэнэ хамгаалалт).
- Файлын нэр санамсаргүй UUID. Давхцал, хэрэглэгчийн өгсөн нэрээр path инъекц хийх боломжгүй.
- RLS идэвхтэй, policy-гүй хэвээр. Апп DB-д серверээс шууд холбогддог.

### Анхаарах зүйл: ил гарсан нууц мэдээлэл

Хөгжүүлэлтийн явцад chat-д дараах нууц утгууд орсон. **Бүгдийг нь шинэчлэх** шаардлагатай:

- [ ] Supabase DB нууц үг -> Project Settings -> Database -> Reset password; `DATABASE_URL`, `DIRECT_URL`-д шинэчлэх
- [ ] Supabase `sb_secret_...` түлхүүр -> шинийг үүсгэж, хуучныг Delete
- [ ] Clerk `sk_test_...` -> Dashboard -> API Keys -> дахин үүсгэх
- [ ] `VERCEL_OIDC_TOKEN` (түр токен, `vercel env pull`-аар шинэчлэгдэнэ)

Дүрэм: нууц утгыг chat, дэлгэцийн зураг, GitHub-д тавихгүй. Зөвхөн `.env.local`-д.

## Env хувьсагчид (утгагүй)

| Нэр | Нууц | Зориулалт |
|-----|------|-----------|
| `DATABASE_URL` | Тийм | Postgres (pooler, 6543). Апп ажиллах үед |
| `DIRECT_URL` | Тийм | Postgres (5432). Migration |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Үгүй | Clerk (browser) |
| `CLERK_SECRET_KEY` | Тийм | Clerk (сервер) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `SIGN_UP_URL` | Үгүй | `/sign-in`, `/sign-up` |
| `SUPABASE_URL` | Үгүй | Storage хаяг |
| `SUPABASE_SECRET_KEY` | Тийм | Storage-д зураг оруулах |
| `VERCEL_OIDC_TOKEN` | Тийм (түр) | Vercel CLI, кодод шууд хэрэглэгдэхгүй |

## Төлөв

| Зүйл | Төлөв |
|------|-------|
| `npx tsc --noEmit` | Алдаа 0 |
| `/listings` (шүүлтүүр: засвар -> 2 зар) | Ажиллаж байна |
| `/listings/[id]`, 404 шалгалт | Хийсэн |
| Clerk нэвтрэлт | Ажиллаж байна |
| `image_url` migration (`0001`) | Хэрэгжсэн |
| **Зурагтай зар нэмэх end-to-end** | **Туршилт хүлээгдэж байна** (форм шинэчлэгдсэний дараа) |

### Зургийн upload-ыг баталгаажуулах жагсаалт

- [ ] `/listings/new` дээр "Зураг" талбар гарсан, сонгоход урьдчилсан харалт гарна
- [ ] Зар нийтлэхэд Storage-д `<uuid>.jpg` файл үүснэ
- [ ] `listings.image_url` баганад холбоос бичигдэнэ
- [ ] Нүүр хуудас, `/listings`, дэлгэрэнгүй хуудсанд зураг харагдана
- [ ] 5MB-аас том зураг татгалзагдана
- [ ] `.jpg` болгож нэрийг нь сольсон `.pdf` татгалзагдана
- [ ] Зураггүй зар хэвээр ажиллана (🔋 дүрс)

## Дараагийн ажил

1. Зургийн upload-ыг дээрх жагсаалтаар баталгаажуулах
2. Туршилтын "BATTERY ZARNA" зарыг устгах
3. Нууц түлхүүрүүдийг шинэчлэх (дээрх жагсаалт)
4. "Миний зарууд": засах, "зарагдсан" болгох (`status`)
5. Хуучин зургийг зар устгах/солих үед Storage-оос цэвэрлэх
6. `lib/models.ts`-ийг DB руу шилжүүлж `model_slug`-д foreign key нэмэх
7. n8n + Facebook Page-д автоматаар нийтлэх
8. Claude туслах (загварт тохирох батерей)
9. Hero зургийг өөрийн/лицензтэй зургаар солих
10. README ба архитектурын тайлбар

## Сургамж

- `.ts` файл JSX ойлгодоггүй. Хуудас нь `app/**/page.tsx`, өгөгдлийн функц нь `lib/*.ts`.
- DB-ийн `id` төрөл (uuid / serial) нь URL шалгалт, функцийн параметрт нөлөөлнө.
- Гаднаас ирсэн бүх утгыг (URL, форм, файл) шалгана. Төрлийн системд найдахгүй.
- Нэг л газар (`ListingCard`) дахин ашиглавал загвар, засвар хоёулаа нэг дор.
- Нууц түлхүүр нэг удаа ил гарвал шинэчилнэ.
