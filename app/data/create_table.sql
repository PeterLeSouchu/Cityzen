BEGIN;

DROP TABLE IF EXISTS "rating_activity" CASCADE;

DROP TABLE IF EXISTS "user_rating" CASCADE;

DROP TABLE IF EXISTS "favorite_activity" CASCADE;

DROP TABLE IF EXISTS "user_activity_rating" CASCADE;

DROP TABLE IF EXISTS "rating" CASCADE;

DROP TABLE IF EXISTS "activity" CASCADE;

DROP TABLE IF EXISTS "zip_code" CASCADE;

DROP TABLE IF EXISTS "city" CASCADE;

DROP TABLE IF EXISTS "department" CASCADE;

DROP TABLE IF EXISTS "country" CASCADE;

DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "country" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "department" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL UNIQUE,
    "id_country" INT NOT NULL REFERENCES "country" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "city" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "id_department" INT NOT NULL REFERENCES "department" ("id"),
    "id_country" INT NOT NULL REFERENCES "country" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "zip_code" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "zip_code" TEXT NOT NULL,
    "id_city" INT NOT NULL REFERENCES "city" ("id"),
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
    "id_user" INT NOT NULL REFERENCES "user" ("id"),
    "id_city" INT NOT NULL REFERENCES "city" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "rating" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "rating" NUMERIC NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

-- Tables de liaison
CREATE TABLE "favorite_activity" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_user" INTEGER NOT NULL REFERENCES "user" ("id"),
    "id_activity" INTEGER NOT NULL REFERENCES "activity" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    UNIQUE (id_user, id_activity)
);

CREATE TABLE "user_activity_rating" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_user" INTEGER NOT NULL REFERENCES "user" ("id"),
    "id_activity" INTEGER NOT NULL REFERENCES "activity" ("id") ON DELETE CASCADE,
    "id_rating" INTEGER NOT NULL REFERENCES "rating" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    UNIQUE (
        id_user,
        id_activity,
        id_rating
    )
);

CREATE TABLE "user_rating" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_user" INT NOT NULL REFERENCES "user" ("id"),
    "id_rating" INT NOT NULL REFERENCES "rating" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "rating_activity" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_activity" INT NOT NULL REFERENCES "activity" ("id") ON DELETE CASCADE,
    "id_rating" INT NOT NULL REFERENCES "rating" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

ALTER SEQUENCE "user_id_seq" RESTART WITH 1;

ALTER SEQUENCE "country_id_seq" RESTART WITH 1;

ALTER SEQUENCE "department_id_seq" RESTART WITH 1;

ALTER SEQUENCE "city_id_seq" RESTART WITH 1;

ALTER SEQUENCE "zip_code_id_seq" RESTART WITH 1;

ALTER SEQUENCE "activity_id_seq" RESTART WITH 1;

ALTER SEQUENCE "rating_id_seq" RESTART WITH 1;

ALTER SEQUENCE "favorite_activity_id_seq" RESTART WITH 1;

ALTER SEQUENCE "user_activity_rating_id_seq" RESTART WITH 1;

ALTER SEQUENCE "user_rating_id_seq" RESTART WITH 1;

ALTER SEQUENCE "rating_activity_id_seq" RESTART WITH 1;

COMMIT;