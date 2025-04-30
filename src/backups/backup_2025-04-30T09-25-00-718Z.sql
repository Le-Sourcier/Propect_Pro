--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)

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
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'USER',
    'ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

--
-- Name: enum_Users_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_status" AS ENUM (
    'UNVERIFIED',
    'VERIFIED',
    'ARCHIVED',
    'BLOCKED'
);


ALTER TYPE public."enum_Users_status" OWNER TO postgres;

--
-- Name: enum_enrich_jobs_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_enrich_jobs_status AS ENUM (
    'In progress',
    'Queud',
    'Queued',
    'Completed',
    'Failed',
    'in_progress',
    'queued',
    'completed',
    'failed'
);


ALTER TYPE public.enum_enrich_jobs_status OWNER TO postgres;

--
-- Name: enum_scraping_jobs_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_scraping_jobs_status AS ENUM (
    'pending',
    'In progress',
    '',
    'Queud',
    'running',
    'Running',
    'completed',
    'Completed',
    'failed',
    'Failed'
);


ALTER TYPE public.enum_scraping_jobs_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Profiles" (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    phone character varying(255),
    fname character varying(255),
    lname character varying(255),
    dob date,
    address character varying(255),
    image character varying(255),
    bio text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Profiles" OWNER TO postgres;

--
-- Name: ScrapingJobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ScrapingJobs" (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    query character varying(255) NOT NULL,
    location character varying(255),
    max_results integer DEFAULT 10 NOT NULL,
    use_proxy boolean DEFAULT false NOT NULL,
    proxy_urls character varying(255)[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ScrapingJobs" OWNER TO postgres;

--
-- Name: Sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sessions" (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    ip_address character varying(255),
    user_agent character varying(255),
    token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Sessions" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    status public."enum_Users_status" DEFAULT 'UNVERIFIED'::public."enum_Users_status" NOT NULL,
    role public."enum_Users_role" DEFAULT 'USER'::public."enum_Users_role" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: enrich_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrich_jobs (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    sources character varying(255)[] NOT NULL,
    records integer NOT NULL,
    enriched integer,
    link text,
    status public.enum_enrich_jobs_status DEFAULT 'in_progress'::public.enum_enrich_jobs_status NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.enrich_jobs OWNER TO postgres;

--
-- Name: scraping_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scraping_jobs (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    source character varying(255) NOT NULL,
    query character varying(255) NOT NULL,
    location character varying(255),
    results integer DEFAULT 10 NOT NULL,
    status public.enum_scraping_jobs_status DEFAULT 'pending'::public.enum_scraping_jobs_status NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.scraping_jobs OWNER TO postgres;

--
-- Data for Name: Profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Profiles" (id, user_id, phone, fname, lname, dob, address, image, bio, "createdAt", "updatedAt") FROM stdin;
670d5e17-8337-49c6-8cc3-78b48ee64b3c	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	90675566	Le-Sourcier	Anonymous	\N	\N	\N	\N	2025-04-24 15:21:05.202+00	2025-04-24 15:21:05.202+00
\.


--
-- Data for Name: ScrapingJobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ScrapingJobs" (id, user_id, query, location, max_results, use_proxy, proxy_urls, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sessions" (id, user_id, ip_address, user_agent, token, expires_at, "createdAt", "updatedAt") FROM stdin;
52f235bb-3e18-43a4-9681-15f78876612f	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1Nzg5NzYsImV4cCI6MTc0NjE4Mzc3Nn0.7u7lyIkwRZDTRLybVIyVZvrES57QJsQa85_--bsQrYM	2025-04-25 11:03:56.749+00	2025-04-25 11:02:56.751+00	2025-04-25 11:02:56.751+00
68c4c813-5824-4690-8b5c-effe355a1b3f	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1NzkxNzEsImV4cCI6MTc0NjE4Mzk3MX0.pKNRLwAVWjh0ghOixTxsX4dPqK0cz9MUcyncKfpAOOs	2025-04-25 11:07:11.9+00	2025-04-25 11:06:11.902+00	2025-04-25 11:06:11.902+00
d6962763-ab81-4c03-81f7-9f94794d627c	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1NzkxOTAsImV4cCI6MTc0NjE4Mzk5MH0.Z1V7qf8anj3PvF6-qh_cwiYbujw4AyJuwZn-T7r4Asc	2025-04-25 11:07:30.382+00	2025-04-25 11:06:30.383+00	2025-04-25 11:06:30.383+00
ea358f15-fdf0-4fba-b183-f135830d4e4a	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1Nzk0NjEsImV4cCI6MTc0NjE4NDI2MX0.1QEO5pFqHNnjhEC9revUN5lqcvFNNMDF6kb0dxCIVOg	2025-04-25 11:12:01.814+00	2025-04-25 11:11:01.817+00	2025-04-25 11:11:01.817+00
6a80b991-06f3-4b3c-abe5-29d0800a2fcc	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1Nzk2MjQsImV4cCI6MTc0NjE4NDQyNH0.2R9buluLznFalSOyzRTW8-PE6SSkOmVVlheTsKovTQ4	2025-04-25 11:14:44.336+00	2025-04-25 11:13:44.338+00	2025-04-25 11:13:44.338+00
19b47062-01ec-43b3-bb11-2d3c2d36167d	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1Nzk2NDksImV4cCI6MTc0NjE4NDQ0OX0.V2fHBFiucXkvK6Bk5WoQeYwR7O-pKgl8ehAHimz-xS4	2025-04-25 11:15:09.26+00	2025-04-25 11:14:09.26+00	2025-04-25 11:14:09.26+00
517e175f-bd4f-4016-8fda-262e59864ace	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1Nzk2NjAsImV4cCI6MTc0NjE4NDQ2MH0.jsNPk7gQyQocEtHhCWeMQmFey-B5mVV2Rm5to5nau2E	2025-04-25 11:15:20.661+00	2025-04-25 11:14:20.661+00	2025-04-25 11:14:20.661+00
f1118dbf-7118-425b-b9a7-22044ad46758	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1Nzk4MzQsImV4cCI6MTc0NjE4NDYzNH0.HYL10cmUqCk1-ovxU_smrIh1zaxzcXSytwP1CQoTNWg	2025-04-25 11:18:14.603+00	2025-04-25 11:17:14.603+00	2025-04-25 11:17:14.603+00
285511b5-6294-43b3-b11f-9be4ee3b0115	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1ODA1MDQsImV4cCI6MTc0NjE4NTMwNH0.YZfI1l942wD0j3wAc34KWRVboGLwd_4ooCDYePKa_vY	2025-04-25 11:29:24.136+00	2025-04-25 11:28:24.138+00	2025-04-25 11:28:24.138+00
c43955d5-3d0b-4998-a623-f18bc085d3b4	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1ODI3ODUsImV4cCI6MTc0NjE4NzU4NX0.SG9LwvzWAiuVWfnOovGxpFBl_EwKlh_iMNvBPerICYQ	2025-04-25 12:07:25.074+00	2025-04-25 12:06:25.076+00	2025-04-25 12:06:25.076+00
ed597583-36c0-4f38-849b-b0507e89ce14	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1ODY1ODUsImV4cCI6MTc0NjE5MTM4NX0.74Mv-sUPxGijsPu9HV00lJIehERuaEUNg07wsOLYKk4	2025-04-25 13:10:45.37+00	2025-04-25 13:09:45.371+00	2025-04-25 13:09:45.371+00
717ddfd2-8e93-453d-821e-c3ae6ab168ff	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU1OTQzOTUsImV4cCI6MTc0NjE5OTE5NX0.UDXSCN0gbOVsTQ5panDL9BzMUpZgutQe8Vk6Um0Ni_w	2025-04-25 15:20:55.161+00	2025-04-25 15:19:55.165+00	2025-04-25 15:19:55.165+00
52254a14-e2ff-4c12-8630-30882037a843	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU2MDMxOTUsImV4cCI6MTc0NjIwNzk5NX0.FAyypmdrm3RB1kEL6s1-aBzyNbX2zWIiYTBlsEHvOuo	2025-04-25 17:47:35.966+00	2025-04-25 17:46:35.967+00	2025-04-25 17:46:35.967+00
dffb68a4-dbbb-491d-a5e7-30b2e2e2329a	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU2MTcxMjQsImV4cCI6MTc0NjIyMTkyNH0.pkN6MwW6c6yq1mv4Paac5zKiJJUdUUa8_WkfvA3UdsU	2025-04-25 21:39:44.663+00	2025-04-25 21:38:44.666+00	2025-04-25 21:38:44.666+00
409adca7-3b15-471b-8075-e37d42ba75c1	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4MjMwMjAsImV4cCI6MTc0NjQyNzgyMH0.LJECoUv7id5T11stw_Te1Eganpo5E48hXrehy0AJbtM	2025-04-28 06:51:20.299+00	2025-04-28 06:50:20.3+00	2025-04-28 06:50:20.3+00
5aab85b4-3282-41df-8c03-22bcbe48d55d	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4MzA4NTUsImV4cCI6MTc0NjQzNTY1NX0.gWSiiTZmca_M9-KALHv8RkB4-zuCaDiQkG1ebFRjUFM	2025-04-28 09:01:55.903+00	2025-04-28 09:00:55.906+00	2025-04-28 09:00:55.906+00
3c589e1a-4ee2-4ee4-b6d0-d6fede732570	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4Mzk5ODQsImV4cCI6MTc0NjQ0NDc4NH0.L5McK65wjCv5frvDXMQHwSPykdh-_1T8vswTOBgECLk	2025-04-28 11:34:04.556+00	2025-04-28 11:33:04.559+00	2025-04-28 11:33:04.559+00
62113d87-b730-4f24-aa94-46437b18f572	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4NTU0MzAsImV4cCI6MTc0NjQ2MDIzMH0.MNl5o_Ujdeqw38SRqk1prWQEq1LS6bm9ZppePUr8Xiw	2025-04-28 15:51:30.89+00	2025-04-28 15:50:30.891+00	2025-04-28 15:50:30.891+00
21a8f4cd-91cb-443d-b806-1f9f36d38035	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4NjQxODgsImV4cCI6MTc0NjQ2ODk4OH0.zZSU2jp7rqWJ8vfzCfr5FTttTjkvMjwm0sQRm-DM1Xk	2025-04-28 18:17:28.534+00	2025-04-28 18:16:28.537+00	2025-04-28 18:16:28.537+00
5cce77c7-43c9-4457-9108-d5956d4daf1a	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU5MTE0MzUsImV4cCI6MTc0NjUxNjIzNX0.2EgSNeNh0zOS-slgIQq7Zr3B9UIqR9JBGgxsaNwrFfo	2025-04-29 07:24:55.151+00	2025-04-29 07:23:55.159+00	2025-04-29 07:23:55.159+00
64c80ccf-a8a1-4732-b867-d76b35727856	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU5MzI0OTAsImV4cCI6MTc0NjUzNzI5MH0.fiZc64aZ7YHUpgzDST49U_Ug_9fmxuJvt2qruauj58o	2025-04-29 13:15:50.415+00	2025-04-29 13:14:50.417+00	2025-04-29 13:14:50.417+00
d563b6dc-2cbd-40df-b065-9d2cda7f1e1a	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU5NDcyMjIsImV4cCI6MTc0NjU1MjAyMn0.PiMYE0pIRX4F4XZRmyLnyEdbeCM67w5WYMET1FGOYZA	2025-04-29 17:21:22.695+00	2025-04-29 17:20:22.697+00	2025-04-29 17:20:22.697+00
ceb5df0d-b549-4371-a56b-12c335249bc1	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU5NTcxNTksImV4cCI6MTc0NjU2MTk1OX0.wEFS_Z0I5vvnwosF8kcwNEd_JLxl_Y4xHyo_GJKZ5L8	2025-04-29 20:06:59.267+00	2025-04-29 20:05:59.269+00	2025-04-29 20:05:59.269+00
ab23034e-669b-4af4-b68e-09d2960e7bf7	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU5NjA0ODksImV4cCI6MTc0NjU2NTI4OX0.l7-XdVKM7ub9dS-WhG37vAlXzQbUCiBqqZ1BQ9sEzls	2025-04-29 21:02:29.258+00	2025-04-29 21:01:29.26+00	2025-04-29 21:01:29.26+00
d3cc6df2-bf77-493f-ad4c-136a11354a8a	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU5NjA5NzksImV4cCI6MTc0NjU2NTc3OX0.WwoxCsdJiuXbVG8pIIbmyGZtS0F-6wa-OkN8JpeVilU	2025-04-29 21:10:39.664+00	2025-04-29 21:09:39.665+00	2025-04-29 21:09:39.665+00
1efd6f35-bd32-4ffe-ab1c-8ef7b060eb8a	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU5NjU2NTAsImV4cCI6MTc0NjU3MDQ1MH0.6fUN837NkB__Cf_CR-WC2dR48iZCAOs30yfsK5wSlcY	2025-04-29 22:28:30.759+00	2025-04-29 22:27:30.761+00	2025-04-29 22:27:30.761+00
8740d3d5-fc64-4665-9fa5-bf47fad043ca	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDU5NzI4MjYsImV4cCI6MTc0NjU3NzYyNn0.LFZiv35b372STLfVv4Q_NZMumRBFo78ElCPXgvYwmg0	2025-04-30 00:28:06.947+00	2025-04-30 00:27:06.949+00	2025-04-30 00:27:06.949+00
6c5b643f-c899-4d37-a985-342e7e26d993	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMDE5OTAsImV4cCI6MTc0NjYwNjc5MH0._Zi-HtGjSiTvnvXxhi40RzM4VlH_6M3CHdbfZgy8IzA	2025-04-30 08:34:10.012+00	2025-04-30 08:33:10.015+00	2025-04-30 08:33:10.015+00
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, email, password, token, status, role, "createdAt", "updatedAt") FROM stdin;
5f672ad4-ca46-4b20-b3eb-40c373a74cd3	hackersranch2@gmail.com	$2b$10$wH3ilzKGK2aEkH9e3b2oPOcqQuQBLyQ8HdzhfWShgtjH7lOYSY0XG	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0NTUwODA2NSwiZXhwIjoxNzQ4MTAwMDY1fQ.11gnzosZu5Ez0hn0ALcyGsIUioGnmzEN39QYYjWw0aY	VERIFIED	USER	2025-04-24 15:21:05.133+00	2025-04-24 15:21:05.133+00
\.


--
-- Data for Name: enrich_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrich_jobs (id, user_id, name, sources, records, enriched, link, status, "createdAt", "updatedAt") FROM stdin;
248aa4d8-19b7-414c-ae7c-c66b540161c8	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	test_enrichment.csv	{google,pappers}	6	6	/uploads/enriched/enriched_248aa4d8-19b7-414c-ae7c-c66b540161c8.csv	completed	2025-04-30 02:17:55.768+00	2025-04-30 02:19:01.07+00
\.


--
-- Data for Name: scraping_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scraping_jobs (id, user_id, source, query, location, results, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: Profiles Profiles_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "Profiles_phone_key" UNIQUE (phone);


--
-- Name: Profiles Profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "Profiles_pkey" PRIMARY KEY (id);


--
-- Name: ScrapingJobs ScrapingJobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ScrapingJobs"
    ADD CONSTRAINT "ScrapingJobs_pkey" PRIMARY KEY (id);


--
-- Name: ScrapingJobs ScrapingJobs_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ScrapingJobs"
    ADD CONSTRAINT "ScrapingJobs_user_id_key" UNIQUE (user_id);


--
-- Name: Sessions Sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Sessions_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_token_key" UNIQUE (token);


--
-- Name: enrich_jobs enrich_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrich_jobs
    ADD CONSTRAINT enrich_jobs_pkey PRIMARY KEY (id);


--
-- Name: scraping_jobs scraping_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scraping_jobs
    ADD CONSTRAINT scraping_jobs_pkey PRIMARY KEY (id);


--
-- Name: Profiles Profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "Profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Sessions Sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrich_jobs enrich_jobs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrich_jobs
    ADD CONSTRAINT enrich_jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: scraping_jobs scraping_jobs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scraping_jobs
    ADD CONSTRAINT scraping_jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

