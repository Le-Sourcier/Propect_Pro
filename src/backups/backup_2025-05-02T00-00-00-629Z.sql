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
7b63b0e0-64e4-476d-be63-f0221271b396	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMDk4MTAsImV4cCI6MTc0NjYxNDYxMH0.Wu9yJGx4DbnQ4Es8xdrJyBkBiLuljeM7l4-op7Nzfi0	2025-04-30 10:44:30.875+00	2025-04-30 10:43:30.876+00	2025-04-30 10:43:30.876+00
8d3c5cbd-4e37-4673-bdf4-9e8c24aff65e	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMTgzNzMsImV4cCI6MTc0NjYyMzE3M30.qFjucEQpr9dhzl8Fr6QqipiudHjw1NwvacH8QVUZ988	2025-04-30 13:07:13.171+00	2025-04-30 13:06:13.173+00	2025-04-30 13:06:13.173+00
3279d38c-a36e-4645-9166-af9f21f47d60	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMjYyMTYsImV4cCI6MTc0NjYzMTAxNn0.kV6ipbRft8Xly-6o4Fye7R0krpbQkQfmGCvku984UFo	2025-04-30 15:17:56.344+00	2025-04-30 15:16:56.345+00	2025-04-30 15:16:56.345+00
81a9d9e0-9589-4547-907a-9e3e5a31fc36	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMzA5MDksImV4cCI6MTc0NjYzNTcwOX0.cycOhNIRIKtBUkHTnvsYcDbGbQFd8QDRXtc0N-WCX6I	2025-04-30 16:36:09.111+00	2025-04-30 16:35:09.113+00	2025-04-30 16:35:09.113+00
a7d13c3c-e348-4483-870b-20f3a1bfc4b1	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDYwNTIzMjYsImV4cCI6MTc0NjY1NzEyNn0.BAgItNxOdoX2X6vbSvTch2968wNb_12keE4cGkX_EZQ	2025-04-30 22:33:06.969+00	2025-04-30 22:32:06.97+00	2025-04-30 22:32:06.97+00
48ed7553-a040-4690-92aa-624f129c7d7e	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjcyYWQ0LWNhNDYtNGIyMC1iM2ViLTQwYzM3M2E3NGNkMyIsImVtYWlsIjoiaGFja2Vyc3JhbmNoMkBnbWFpbC5jb20iLCJpYXQiOjE3NDYxMzcwNTcsImV4cCI6MTc0Njc0MTg1N30.an_xD_iHC_mjDYobiB3ZtF3tHkG7JHURKyvLdl2G6AE	2025-05-01 22:05:17.336+00	2025-05-01 22:04:17.338+00	2025-05-01 22:04:17.338+00
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
24c5063c-4da1-4785-91fb-55de3957202d	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	test.csv	{pappers,google,database}	1	1	/uploads/enriched/enriched_24c5063c-4da1-4785-91fb-55de3957202d.csv	completed	2025-04-30 16:36:06.933+00	2025-04-30 16:36:24.036+00
1f6c3146-d7a3-423c-9b9a-6bac87198131	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	test.csv	{pappers,google,database}	1	1	/uploads/enriched/enriched_1f6c3146-d7a3-423c-9b9a-6bac87198131.csv	completed	2025-04-30 16:36:48.662+00	2025-04-30 16:36:59.301+00
da96d0b9-738c-4602-9dc1-83aa6be88ec9	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	test.csv	{pappers,google,database}	1	0	/uploads/enriched/enriched_da96d0b9-738c-4602-9dc1-83aa6be88ec9.csv	failed	2025-04-30 16:37:19.165+00	2025-04-30 16:38:42.604+00
42e1704f-0bfa-4430-a28b-86869a088db6	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	0	0	\N	in_progress	2025-04-30 22:35:06.727+00	2025-04-30 22:35:06.727+00
c02b12b3-4855-428f-a384-7033926c9623	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-04-30 22:43:47.229+00	2025-04-30 22:43:47.229+00
d98c0db8-0054-450f-be0e-0124432ce79a	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-04-30 23:04:31.191+00	2025-04-30 23:04:31.191+00
ff69598a-8cf4-4139-a841-64e6d9bcf980	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-04-30 23:05:58.552+00	2025-04-30 23:05:58.552+00
3eb7acf2-a484-4a25-b3a1-5059ca1f59ae	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-04-30 23:16:04.222+00	2025-04-30 23:16:04.222+00
70682e00-d0ed-41a7-8b49-5195fbfad0d0	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-04-30 23:20:24.765+00	2025-04-30 23:20:24.765+00
17629ac5-feb7-4cef-834c-bd23fc111323	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-04-30 23:21:51.028+00	2025-04-30 23:21:51.028+00
fd421076-6b5e-4ef6-af14-8096f0a80b97	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-04-30 23:23:08.906+00	2025-04-30 23:23:08.906+00
427c53a9-b1c0-4634-acaf-98b3f135cbfd	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-04-30 23:30:32.702+00	2025-04-30 23:30:32.702+00
a712fe2c-85ef-476e-bc5c-6bae8c73753b	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-04-30 23:34:49.215+00	2025-04-30 23:34:49.215+00
7f46fcb9-d8f1-4f3f-879f-3033bba2cf2d	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-05-01 22:05:07.869+00	2025-05-01 22:05:07.869+00
e86975e7-4d0f-4b8f-87da-3b1853abda53	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-05-01 22:07:36.853+00	2025-05-01 22:07:36.853+00
ab85a437-fa4f-42fe-9166-5cbffc4caa3f	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-05-01 22:09:25.867+00	2025-05-01 22:09:25.867+00
aa0bdcc5-825c-4b6f-9292-91f6c2eee3e4	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-05-01 22:15:02.918+00	2025-05-01 22:15:02.918+00
cb1f351f-ac23-4d95-bd62-2b79d8ab3ec2	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-05-01 22:15:52.383+00	2025-05-01 22:15:52.383+00
5ed566c9-dc16-481d-9b57-07f4cc571f55	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-05-01 22:20:49.59+00	2025-05-01 22:20:49.59+00
33b0cc9c-104c-4419-82b4-a62d05a81789	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-05-01 22:23:27.785+00	2025-05-01 22:23:27.785+00
4180d1da-597e-4e8d-b03c-ecde74c9cab7	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	3	0	\N	in_progress	2025-05-01 22:26:02.816+00	2025-05-01 22:26:02.816+00
2c8f67f5-9ef1-4bdc-a23e-7eec54767a81	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	test_enrichment.csv	{pappers,google,database}	2	0	\N	in_progress	2025-05-01 22:27:42.318+00	2025-05-01 22:27:42.318+00
8471ea1a-7b85-40b9-8326-00fd8b2b3e64	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	116	0	\N	in_progress	2025-05-01 22:29:37.904+00	2025-05-01 22:29:37.904+00
b1914070-01f7-49b6-90be-4d9addf1b197	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	google-maps-data.csv	{pappers,google,database}	116	0	\N	in_progress	2025-05-01 22:54:22.673+00	2025-05-01 22:54:23.037+00
4dec7df3-7fce-4552-a784-db23ff576e89	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	test.csv	{pappers,google,database}	1	0	\N	in_progress	2025-05-01 22:57:50.656+00	2025-05-01 22:57:50.656+00
3ccef069-21e9-40dc-ba7b-a7aa2e928112	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	test.csv	{pappers,google,database}	1	0	\N	in_progress	2025-05-01 22:57:52.156+00	2025-05-01 22:57:52.156+00
7af01b3e-d252-43d8-b0cf-8f4a770f5193	5f672ad4-ca46-4b20-b3eb-40c373a74cd3	test_enrichment.csv	{pappers,google,database}	2	1	\N	in_progress	2025-05-01 22:59:48.056+00	2025-05-01 23:00:09.364+00
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

