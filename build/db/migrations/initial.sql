--liquibase formatted sql

--changeset seroha:1 context:"Create the call_events"

CREATE TABLE "call_events" (
                               "id" bigserial NOT NULL,
                               "status" TEXT CHECK (
                                   "status" IN ('Up', 'Busy', 'Ringing', 'Idle', 'Hangup')
                                   ) NOT NULL,
                               "caller_id" TEXT NOT NULL,
                               "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
                               "channel" TEXT NOT NULL
);

SELECT create_hypertable('call_events', by_range('timestamp', INTERVAL '1 day'));

--changeset seroha:2 context:"Create the user table"

CREATE TABLE "user" (
                        "id" SERIAL NOT NULL,
                        "email" TEXT NOT NULL,
                        "username" TEXT NOT NULL,
                        "phone" TEXT NOT NULL
);

ALTER TABLE "user" ADD PRIMARY KEY("id");
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");

--changeset seroha:3 context:"Create the auth_tokens table"

CREATE TABLE "auth_tokens" (
                               "id" SERIAL NOT NULL,
                               "user_id" INTEGER NOT NULL,
                               "token" TEXT NOT NULL
);

ALTER TABLE "auth_tokens" ADD PRIMARY KEY("id");

--changeset seroha:4 context:"Add foreign key constraints"

ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_foreign"
    FOREIGN KEY("user_id") REFERENCES "user"("id");

--changeset seroha:5 context:"Create index on call_events table for status and timestamp"

CREATE INDEX ON "call_events"("status", "timestamp" DESC);

--changeset seroha:6 context:"Create materialized view agg_call_events (TimescaleDB)" runInTransaction:false

CREATE MATERIALIZED VIEW "agg_call_events"
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', "timestamp") AS "hour",
       "status",
       COUNT(*)
FROM "call_events"
GROUP BY "hour", "status";

--changeset seroha:7 context:"Add password"

ALTER TABLE "user" ADD COLUMN password TEXT NOT NULL;

--changeset seroha:8 context:"Rename users table"

ALTER TABLE "user" RENAME TO users;

--changeset seroha:9 context:"Add create_at"

ALTER TABLE "auth_tokens"
    ADD COLUMN "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "users"
    ADD COLUMN "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

--changeset seroha:10 context:"Fix call_event status"

ALTER TABLE "call_events" DROP CONSTRAINT "call_events_status_check";

ALTER TABLE "call_events"
    ADD CONSTRAINT "call_events_status_check"
        CHECK ("status" IN ('Up', 'Busy', 'Ring', 'Idle', 'Hangup'));

--changeset seroha:11 context:"Seed"

INSERT INTO users (email, username, password, phone) VALUES ('test@test.com', 'test', '$scrypt$N=32768,r=8,p=1,maxmem=67108864$okD97j+f4siaVSe2Xx4jfpLCYmxrO7d0xqTCzlZMv4M$TfttQ9pu0Fjrn/UQxA0YL3jzgG45uJdxYjgcCOH5DMNNbuvj4b4u0R7aPRFUuGZ2k24uGwpqmvmLLRm1LRboow', 6001)

--changeset seroha:12 contex:"Fix user phone type"

ALTER TABLE "users"
ALTER COLUMN "phone" TYPE TEXT;

--changeset seroha:13 context:"add call_event new status"

ALTER TABLE "call_events" DROP CONSTRAINT "call_events_status_check";

ALTER TABLE "call_events"
    ADD CONSTRAINT "call_events_status_check"
        CHECK ("status" IN ('Up', 'Busy', 'Ring', 'Idle', 'Hangup', 'Newexten', 'VarSet', 'SoftHangupRequest'));