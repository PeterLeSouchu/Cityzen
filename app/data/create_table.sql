BEGIN;

DROP TABLE IF EXISTS "favorite_activity" CASCADE;

DROP TABLE IF EXISTS "activity" CASCADE;

DROP TABLE IF EXISTS "city" CASCADE;

DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "city" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "department_code" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "activity" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url_image" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "avg_rating" NUMERIC,
    "latitude" NUMERIC NOT NULL,
    "longitude" NUMERIC NOT NULL,
    "id_user" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "id_city" INT NOT NULL REFERENCES "city" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

-- Tables de liaison
CREATE TABLE "favorite_activity" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_user" INTEGER NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "id_activity" INTEGER NOT NULL REFERENCES "activity" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    UNIQUE (id_user, id_activity)
);

ALTER SEQUENCE "user_id_seq" RESTART WITH 1;
ALTER SEQUENCE "city_id_seq" RESTART WITH 1;
ALTER SEQUENCE "activity_id_seq" RESTART WITH 1;
ALTER SEQUENCE "favorite_activity_id_seq" RESTART WITH 1;
COMMIT;