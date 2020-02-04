--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.0

-- Started on 2020-02-05 01:18:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2850 (class 1262 OID 16393)
-- Name: OrderDb; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "OrderDb" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';


ALTER DATABASE "OrderDb" OWNER TO "postgres";

\connect "OrderDb"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- TOC entry 205 (class 1259 OID 16403)
-- Name: OrderPizza; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."OrderPizza" (
    "id" bigint NOT NULL,
    "count" integer NOT NULL,
    "orderId" bigint NOT NULL,
    "pizzaTypeId" integer NOT NULL,
    "size" character varying NOT NULL
);


ALTER TABLE "public"."OrderPizza" OWNER TO "postgres";

--
-- TOC entry 204 (class 1259 OID 16401)
-- Name: OrderPizza_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."OrderPizza" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."OrderPizza_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 203 (class 1259 OID 16396)
-- Name: Orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."Orders" (
    "id" bigint NOT NULL,
    "customerName" character varying(50) NOT NULL,
    "customerAddress" character varying(100) NOT NULL,
    "status" character varying(20) NOT NULL
);


ALTER TABLE "public"."Orders" OWNER TO "postgres";

--
-- TOC entry 202 (class 1259 OID 16394)
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."Orders" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."Order_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 207 (class 1259 OID 16416)
-- Name: PizzaType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."PizzaType" (
    "id" bigint NOT NULL,
    "type" character varying NOT NULL
);


ALTER TABLE "public"."PizzaType" OWNER TO "postgres";

--
-- TOC entry 206 (class 1259 OID 16414)
-- Name: PizzaType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."PizzaType" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."PizzaType_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 2842 (class 0 OID 16403)
-- Dependencies: 205
-- Data for Name: OrderPizza; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2840 (class 0 OID 16396)
-- Dependencies: 203
-- Data for Name: Orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- TOC entry 2844 (class 0 OID 16416)
-- Dependencies: 207
-- Data for Name: PizzaType; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."PizzaType" ("id", "type") OVERRIDING SYSTEM VALUE VALUES (1, 'Marinara');
INSERT INTO "public"."PizzaType" ("id", "type") OVERRIDING SYSTEM VALUE VALUES (2, 'Salami');


--
-- TOC entry 2851 (class 0 OID 0)
-- Dependencies: 204
-- Name: OrderPizza_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."OrderPizza_id_seq"', 5, true);


--
-- TOC entry 2852 (class 0 OID 0)
-- Dependencies: 202
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Order_id_seq"', 28, true);


--
-- TOC entry 2853 (class 0 OID 0)
-- Dependencies: 206
-- Name: PizzaType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."PizzaType_id_seq"', 3, true);


--
-- TOC entry 2704 (class 2606 OID 16407)
-- Name: OrderPizza OrderPizza_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."OrderPizza"
    ADD CONSTRAINT "OrderPizza_pkey" PRIMARY KEY ("id");


--
-- TOC entry 2702 (class 2606 OID 16400)
-- Name: Orders Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."Orders"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");


--
-- TOC entry 2708 (class 2606 OID 16431)
-- Name: PizzaType PizzaTypeUnique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."PizzaType"
    ADD CONSTRAINT "PizzaTypeUnique" UNIQUE ("type");


--
-- TOC entry 2710 (class 2606 OID 16423)
-- Name: PizzaType PizzaType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."PizzaType"
    ADD CONSTRAINT "PizzaType_pkey" PRIMARY KEY ("id");


--
-- TOC entry 2705 (class 1259 OID 16413)
-- Name: fki_Order_Pizza_FK; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_Order_Pizza_FK" ON "public"."OrderPizza" USING "btree" ("orderId");


--
-- TOC entry 2706 (class 1259 OID 16429)
-- Name: fki_Pizza_Type_FK; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_Pizza_Type_FK" ON "public"."OrderPizza" USING "btree" ("pizzaTypeId");


--
-- TOC entry 2711 (class 2606 OID 16408)
-- Name: OrderPizza Order_Pizza_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."OrderPizza"
    ADD CONSTRAINT "Order_Pizza_FK" FOREIGN KEY ("orderId") REFERENCES "public"."Orders"("id");


--
-- TOC entry 2712 (class 2606 OID 16424)
-- Name: OrderPizza Pizza_Type_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."OrderPizza"
    ADD CONSTRAINT "Pizza_Type_FK" FOREIGN KEY ("pizzaTypeId") REFERENCES "public"."PizzaType"("id");


-- Completed on 2020-02-05 01:18:33

--
-- PostgreSQL database dump complete
--

