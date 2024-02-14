--
-- PostgreSQL database dump
--

-- Dumped from database version 12.17 (Ubuntu 12.17-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.17 (Ubuntu 12.17-0ubuntu0.20.04.1)

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

SET default_table_access_method = heap;

--
-- Name: abstracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.abstracts (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "createdBy" integer,
    email character varying(1000) NOT NULL,
    title character varying(1000) NOT NULL,
    author character varying(1000) NOT NULL,
    affiliation character varying(1000) NOT NULL,
    presenting_author character varying(1000) NOT NULL,
    background character varying(1000) NOT NULL,
    objective character varying(1000) NOT NULL,
    methodology character varying(1000) NOT NULL,
    results character varying(1000),
    conclusion character varying NOT NULL,
    recommendations character varying NOT NULL,
    inline character varying(1000) NOT NULL,
    "subThemeId" integer
);


ALTER TABLE public.abstracts OWNER TO postgres;

--
-- Name: abstracts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.abstracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.abstracts_id_seq OWNER TO postgres;

--
-- Name: abstracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.abstracts_id_seq OWNED BY public.abstracts.id;


--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id integer NOT NULL,
    name character varying NOT NULL,
    type character varying DEFAULT 'primary'::character varying NOT NULL,
    "parentId" integer
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: category_closure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category_closure (
    id_ancestor integer NOT NULL,
    id_descendant integer NOT NULL
);


ALTER TABLE public.category_closure OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_id_seq OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "createdBy" integer,
    name character varying(1000) NOT NULL,
    code character varying(1000) NOT NULL
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.countries_id_seq OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "createdBy" integer,
    original_name character varying(1000) NOT NULL,
    current_name character varying(1000) NOT NULL,
    extension character varying(1000) NOT NULL,
    size integer NOT NULL
);


ALTER TABLE public.files OWNER TO postgres;

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.files_id_seq OWNER TO postgres;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: jisajilis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jisajilis (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "createdBy" integer,
    status character varying(1000) DEFAULT false NOT NULL,
    path_file character varying NOT NULL,
    "userId" integer
);


ALTER TABLE public.jisajilis OWNER TO postgres;

--
-- Name: jisajilis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jisajilis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.jisajilis_id_seq OWNER TO postgres;

--
-- Name: jisajilis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jisajilis_id_seq OWNED BY public.jisajilis.id;


--
-- Name: menus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menus (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "createdBy" integer,
    description character varying(1000) NOT NULL,
    name character varying(1000),
    state character varying(1000),
    url character varying(1000),
    icon character varying(1000),
    code character varying(1000),
    uid character varying(1000) NOT NULL
);


ALTER TABLE public.menus OWNER TO postgres;

--
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menus_id_seq OWNER TO postgres;

--
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


--
-- Name: registrationcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registrationcategories (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "createdBy" integer,
    name character varying(1000) NOT NULL,
    code character varying(1000) NOT NULL,
    description character varying(1000) NOT NULL
);


ALTER TABLE public.registrationcategories OWNER TO postgres;

--
-- Name: registrationcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registrationcategories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.registrationcategories_id_seq OWNER TO postgres;

--
-- Name: registrationcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registrationcategories_id_seq OWNED BY public.registrationcategories.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "createdBy" integer,
    name character varying(1000) NOT NULL,
    description character varying(1000) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: subthemes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subthemes (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "createdBy" integer,
    name character varying(1000) NOT NULL,
    code character varying(1000) NOT NULL
);


ALTER TABLE public.subthemes OWNER TO postgres;

--
-- Name: subthemes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subthemes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subthemes_id_seq OWNER TO postgres;

--
-- Name: subthemes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subthemes_id_seq OWNED BY public.subthemes.id;


--
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "createdBy" integer,
    first_name character varying(1000) NOT NULL,
    middle_name character varying(1000) NOT NULL,
    last_name character varying(1000) NOT NULL,
    phone_number character varying(1000),
    user_identification character varying(1000),
    sex character varying(1000) NOT NULL,
    username character varying(1000),
    password character varying DEFAULT 'Evlina@1990'::character varying,
    email character varying(1000) NOT NULL,
    salutation character varying(1000) NOT NULL,
    organization character varying(1000) NOT NULL,
    "countryId" integer,
    "registationcategoryId" integer,
    "group" character varying(1000),
    description character varying(1000)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_menus_menus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_menus_menus (
    "usersId" integer NOT NULL,
    "menusId" integer NOT NULL
);


ALTER TABLE public.users_menus_menus OWNER TO postgres;

--
-- Name: users_roles_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_roles_roles (
    "usersId" integer NOT NULL,
    "rolesId" integer NOT NULL
);


ALTER TABLE public.users_roles_roles OWNER TO postgres;

--
-- Name: abstracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.abstracts ALTER COLUMN id SET DEFAULT nextval('public.abstracts_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: jisajilis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jisajilis ALTER COLUMN id SET DEFAULT nextval('public.jisajilis_id_seq'::regclass);


--
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- Name: registrationcategories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrationcategories ALTER COLUMN id SET DEFAULT nextval('public.registrationcategories_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: subthemes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subthemes ALTER COLUMN id SET DEFAULT nextval('public.subthemes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: abstracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.abstracts (id, "createdAt", "updatedAt", "createdBy", email, title, author, affiliation, presenting_author, background, objective, methodology, results, conclusion, recommendations, inline, "subThemeId") FROM stdin;
4	2024-02-04 21:45:14.993636	2024-02-04 21:45:14.993636	\N	lyobawinnie@gmail.com	NUTRITION OFFICER	Winfrida B. Lyoba¹, ² ³and Joyce D. Mwakatoga, ⁴ 	¹ The Nelson Mandela Institution of Science and Technology; Department of Global Health and Bio-Medical Science ² Ifakara Health Institute; Department of Health System and Impact Evaluation and Policy ³ Bukoba Municipal Council; Division of Health, Social-welfare and Nutrition  ⁴ Sokoine University of Agriculture; Department and Department of Agricultural Extension and Community Development	Winfrida B.Lyoba	Maternal and child mortality remains to be a global public health challenge. Tanzania has adopted Antenatal care (ANC) model which is the best cost-effective intervention enclosed with potential components of maternal and child health care services commonly at primary health care to improve maternal and child health. Consequently, timing of ANC at first visit has great implication to ensure optimal health effects for both women and children including reduces of maternal and neonatal mortality. Despite of the potential benefits of early ANC visit, in Tanzania proportion of women appeared to ANC in first trimester is low (34%).	This study aims to understand the socio-demographic characteristics associated with timing of ANC visit during pregnancy.	Institutional based cross-sectional study was employed using a mixed method approach. Quantitative data was collected from 320 women with children aged 0-6 months attending antenatal and postnatal services at selected health care facilities on the day of study from March to April 2019 using a systematic random sampling.  In addition, qualitative study utilized a purposive sampling and involved 6 health care providers using in-depth interview (IDIs), 19 pregnant women and 15 women with children aged 0-6 months using Focused Group Discussion (FGDs). Descriptive statistics and multivariate binary logistic regression was used to determine the characteristics associated with timing of ANC visit among pregnant women using SPSS software version 22.0. Further, thematic analysis was done using NviVO software and themes were triangulated with quantitative results. The study was approved by Ifakara Health Institute Review Board on 09th February, 2019 (IHI/IRB/No: 9-2019).	One hundred and three (32.2%) pregnant women appeared at ANC for the first time in the first trimester. Maternal age (AOR=1.839, 95% Cl: 1.023, 3.303), being accompanied by husband/partner (AOR=2.165, 95% Cl: 1.256, 3.733), and awareness of the danger signs (AOR=2.079, 95% Cl: 1.172, 3.687) and parity (AOR=2.164, 95% Cl: 1.091, 4.291) was the characteristics associated with early ANC. Knowledge on the timing for ANC (AOR=0.564, 95% Cl: 0.320, 994) and household income (AOR=0.529, 95% Cl: 0.281, 0.995) was less associated with early ANC visit during pregnancy. Qualitative finding revealed that health condition, support from husband/partners, perception-of ANC visit, negligence and socio-cultural belief were the reasons for the timing of their first ANC visit.	Timing of first ANC visit in first trimester in Kasulu district is low. The characteristics associated with timing of first ANC were: maternal age, parity, number of children, accompanied by husband/partner and awareness of danger signs was associated with timing of ANC visit in first trimester. To reduce maternal and newborn deaths all barriers should be identified and addressed at all levels. 	To ensure goal number three of the Sustainable Development Goals targets to reduce global maternal mortality ratio of less than 70 deaths per 100 000 live births, maternal deaths to 216/100 000 live births in developing countries, and neonatal mortality to low as 12 per 1000 live birth and under-five mortality to at least low as 25 per 1000 live birth by 2030, awareness about the potential benefits of timing at first ANC visit, improve health and nutrition services at ANC and Postnatal Care (PNC), promotion of male involvement, focus on adolescent and young girls and planning for income generating activities, are crucial for improving of maternal and newborn health before, during and after pregnancy.	Yes	15
5	2024-02-09 04:52:20.294899	2024-02-09 04:52:20.294899	\N	samsonnyanda@gmail.com	PLACENTA ABNORMALITIES: SONOGRAPHIC PATTERNS AND ASSOCIATED FACTORS IN PREGNANCY AT MUHIMBILI NATIONAL HOSPITAL, DAR ES SALAAM, TANZANIA.	Samson Nyanda  ,  Lilian Salingwa  ,  Flora Lwakatare .	Muhimbili University of Health and Allied Sciences.	Samson Nyanda	Placenta pathologies are often overlooked and receive attention only when complications arise. A complete fetal ultrasound should include a full assessment of the placenta for any possible abnormalities. Familiarity with the placenta's normal and abnormal imaging appearance is necessary for healthcare providers to improve maternal and fetal outcomes. 	To demonstrate the sonographic patterns and proportions of placenta abnormalities and their associated factors among pregnant women at Muhimbili National Hospital (MNH) 	A hospital-based cross-sectional prospective study was carried out between January and March 2023 at MNH. Real-time placenta ultrasound findings were taken and documented from all pregnant women who met the inclusion criteria using a standard ultrasound machine with similar optimal settings on each visit until the sample size was reached. A bivariate analysis was performed to find placenta abnormalities associated factors	A total of 220 pregnant women were enrolled in a study. Prevalence of placenta pathologies were 32.7 %, 27.3% and 35.4 % for placenta morphology, placenta parenchyma, and placenta maternal surface respectively. Placenta pathologies excluding those related to location and abruption were overlooked in 200 (91.7%) pregnant women. The previous mode of delivery and unexplained pregnancy loss were associated with placenta abnormalities p values 0.046 and 0.005 respectively	There was a high prevalence of placenta abnormalities. Placenta abnormalities patterns should be evaluated documented and followed up in subsequent scans to improve fetal and maternal outcomes	A Standardized placenta reporting format based on the reported placenta patterns should be established to ensure the practitioner examines and reports all possible placenta pathologies.	Yes	7
6	2024-02-09 05:28:51.099298	2024-02-09 05:28:51.099298	\N	rahma.omar@amref.org	NURTURING POTENTIAL COMMUNITY HEALTH WORKERS FOR EFFECTIVE AND SUSTAINABLE COMMUNITY TB INTERVENTION. SCHOOL TB CLUBS EXPERIENCE IN ZANZIBAR	Dr. Rahma Omar	Amref Tanzania	Dr. Rahma Omar	Tanzania is one of the 30 highest tuberculosis (TB) burden countries in the world. In 2021 TB incidence was reported to be 195 per 100,000 population. Even though the government is putting much effort to control the disease, about 36,000 people with TB are still missed. Among main factor causing TB prevalent is low awareness of the disease in the community. \nCommunity health workers (CHWs) serve as frontline providers for underserved, marginalized and hard-to-reach population, thus contribute to equitable primary health care. However; most of CHWs are adults who are responsible for daily earning of their families which affect coverage and frequency of their community duties. Given the public health importance of TB in Tanzania it necessary to engage additional available means to ensure effectiveness and sustainability in community TB health promotion.\n	To test the use of school health club members to conduct TB health promotional activities in their communities	Five school TB clubs of 15 to 25 members were established in Pemba under USAID Afya Shirikihi Activity. All school club members were oriented on basic TB education which consisted of five TB symptoms and preventive measures. 40 school club members from two schools were tested to provide TB health education and screening in the community thus were capacitated with TB posters and documentation materials in addition. Each school club member (all 40 capacitated members) was assigned to provide TB health education and screening in three households (HH) including their residential and was linked to one CHW of the area.	In one month; a total of 98(81.6%) out of 120 HH were reached. where 360 HH (202female:158male) members were screened for TB. Among them, 19 (12female:7male) were presumed to have TB, of which 63% were women. All presumptive were referred to the nearby health facilities. Further investigation concluded no TB among them	Students generally can play a significant role in health improvement of their respective communities as they can be a means of expanding coverage and frequency in health interventions such as health promotion. Furthermore; they can provide a pool of CHWs for sustainable community interventions	Engagement of secondary school students in health promotional activities of their communities.\nScale up this model to other health matters of concern	Yes	13
7	2024-02-09 05:38:22.018864	2024-02-09 05:38:22.018864	\N	rahma.omar@amref.org	REACHING MARGINALIZED POPULATION WITH TB HEALTH EDUCATION AS A MEANS TO PROMOTE EQUITY, SOCIAL INCLUSION AND GENDER SENSITIVE SERVICES. EXPERIENCE IN ZANZIBAR, TANZANIA	R. Omar1, Z. Kondo2, J. Tesha1, M. Machaku1, F. Temu1, M. Dahoma3, H. Hamad3, P. Wilbroad4, G. Munuo1.	1Amref Tanzania, 2Health Plus, 3Zanzibar Integrated HIV, Hepatitis, TB and Leprosy Program, 4USAID	Dr. Rahma Omar	Tanzania is one of the world's 30 highest tuberculosis (TB) burden countries. Despite the efforts done by the government, TB incidence is still high as in 2022, 100,100 people fell ill with TB and only 75% of them were notified and treated. About 36,000 people with TB are still missed due to several factors, including poor awareness of the disease in the community. Reaching missing people requires interventions that are accessible to all, addressing equity and social inclusion. The Zanzibar community has a diverse population, including individuals with disabilities. Despite being significant, this population is usually left behind in health promotion interventions. This increases the risk of diseases TB included	To reach students and other population group with hearing impairment with TB health education	Amref under USAID Afya Shirikishi (AS) Zanzibar in collaboration with Zanzibar Integrated HIV, Hepatitis, TB and Leprosy Program (ZIHHTLP) implements TB preventive interventions to reach people with hearing impairment. A sign language interpreter was trained on TB and recorded, giving the TB health education. The health education content included TB definition, cardinal symptoms, preventive measures, and infection control	Forty-nine students (18 girls and 31 boys) with a hearing impairment from grade four to seven were reached with face-to-face TB health education complemented with a sign language interpretation. Pre-session evaluation identified no student could define TB correctly. Post-session, all students could mention at least one key takeaway of the disease: at least one TB symptom and measure to prevent the spread of the infection	Ensuring equal access, equality, right-based, gender-sensitive, and social inclusion TB response requires innovative approaches to reach marginalized people at risk of TB. Social and behavioural change materials and messages that can be used and are user-friendly to marginalized populations should be developed	Scaling up this approach to other diseases	Yes	1
8	2024-02-09 16:16:59.313745	2024-02-09 16:16:59.313745	\N	nicholausyg@gmail.com	QUALITY OF LIFE OF MOTHERS OF CHILDREN WITH CEREBRAL  PALSY AT MOSHI MUNICIPAL	Nicholaus Nyemba 	Nicholaus Nyemba	Nicholaus Nyemba	Quality of life (QoL) is an individual's perception of their position in life in the context of \nthe culture and value systems in which they live, and in relation to their aims, expectations, \nstandards and interests, conditioned by the environment (WHO, 1996).\nAlthough a promoting home environment can maximize a child‟s capabilities and minimize \nthe effect of impairment, providing the high-quality care that is needed by a child with longterm functional limitations may influence the health and quality of life QoL of caregivers \n(Davis et al., 2010), yet mothers of children with cerebral palsy (CP) as a primary member of \nthe medical and rehabilitation team have a lot of social and emotional problems (Sajed et al., \n2009) that impact their QoL.	1.To explore the psychological effect of mothers of children with CP .2 To inquire the social effect of the mothers of children with CP in Tanzania 3. To explore the physical health of mothers of children with CP in Tanzania.4 To assess the economic effect of having a child with CP to the mothers  	Qualitative study design using a phenomenological approach was used where eight \nparticipants were selected using purposive sampling KCMC hospital at Moshi. The data was \ncollected through semi-structured interview from participants at the hospital. Data analysis \nwas done using the principle of qualitative analysis\n\n\n	The results of this study reflect the pre determine themes which were developed from the \nobjectives prior to data collection. The categories were developed from the raw data which \nwere recoded as per the themes. The themes under the study were the overall quality of life, \npsychological effect, social relationship, physical health and economic impact among \nmothers of children with cerebral palsy\nDeterminants of quality of life.\nUnder this emerged theme, three categories were obtained from interview which are social \nsupport, lack of support and acceptance which was regarded as major determinants of QoL	Caring for a child with CP impacted on the QOL in psychological, social, physical and \neconomic issues of the mothers of children with cerebral palsy. Measures to improve quality \nof life of mothers of children with cerebral palsy should be incorporated in the management \nof CP with emphasis on identified areas of need. The family members and community are \ninvolved in in the quality of life of mothers of children with cerebral palsy in both positive \nand negative influence.	The quality of life of the mothers of children with CP can be good if the proper support, \ncoping strategies, and individualized family care and acceptance are present. The service \nproviders should aim at establishing a family cantered programme and interventions should \nbe addressed to the family as a whole to meet the health care needs of children with cerebral \npalsy and to assist family in taking care of their affected child. Education and proper \ninformation on CP cause and prognosis should be provided by health professional once \ndiagnosed and should involve both parents to avoid misunderstanding of the condition. Also \neducation to the community about the condition will assist in minimizing social isolation and \nincrease social support. Multidisciplinary approach i.e. psychologist, social worker, physician,Occupational Therapist and physiotherapist should be employed in aiding of care provision and addressing strategies \nto cope with the condition and needs of the child. There is a need for provision of interventions, including the provision of assistive devices, such as wheelchairs to children with CP especially those who are grown up in order to reduce physical strain to mothers. Also researches should be done on determinant of QoL and coping strategies on mothers of children with CP to help mothers to have good quality of life	Yes	3
9	2024-02-09 17:26:02.775715	2024-02-09 17:26:02.775715	\N	mtiturwambo@gmail.com	 HELICOBACTER INFECTION AMONG NEWLY DIAGNOSED TYPE 2 DIABETES MELLITUS PATIENTS ATTENDING DIABETES CLINICS IN DAR ES SALAAM REGION, 2023	DR. ISMAIL MOHAMED MTITU	PROF. YASIN MGONDA, DR. WARLES CHARLES	DR. ISMAIL MOHAMED MTITU	Helicobacter pylori infection (HIP) is a major public health problem globally with high burden in developing world.Globally, 4.4 billion people were found to be positive for Helicobacter pylori, which is more common among older adults. Helicobacter pylori is a gram-negative bacterium which causes infections in the epithelial lining of gastric mucosa. Helicobacter pylori infection is also associated with extra-gastrointestinal disorders such as metabolic syndrome and cardiovascular diseases including diabetes mellitus2. Gastric mucosa infection with Helicobacter pylori results in local inflammation in nearly all hosts. Persistence of this process increases the risk of developing chronic gastritis, intestinal metaplasia, and gastric cancer. It is also associated with peptic ulcer disease in about 90%.\n\n\n\n	To determine the pattern and factors associated with Helicobacter pylori infection among newly diagnosed diabetic patients attending diabetic clinics in Dar es Salaam Region	A cross-sectional analytical study was conducted among newly diagnosed type 2 diabetic patients attending diabetic clinics in Dar es Salaam Region Tanzania from October 2022 to August 2023. Target population was newly diagnosed diabetics with stool-positive H.pylori antigen test. Blood Sample was taken to measure FBG and HbA1c level. Stool sample were collected for screening Helicobacter pylori using a rapid Helicobacter pylori stool antigen test. Descriptive statistics, prevalence of Helicobacter pylori infection and factors associated with Helicobacter pylori infection were assessed using chi-square test and T-test. Data was analyzed using SPSS software version 25. A p value of less or equal to 0.05 was considered statistically significant.	The study recruited 306 adult diabetes patients. Majority of study participants were predominantly female (N=207, (67.6%) with a median age of 57 yrs. Prevalence of Helicobacter pylori infection was (n= 146/306, 48%). Overall mean RBG in study participants was 10.67 mmol/L. The overall median HbA1c level was 8.9 (IQR:  7-11) %. The mean RBG (11.3 mmol/l) for reactive H. pylori Antigen test was significantly higher than the mean RBG (10.04mmol/l) for stool non-reactive H. pylori Ag test (T-test =2.02, p=0.04). The mean HbA1c (10%) for reactive stool H.pylori antigen test was significantly higher than mean HbA1c (8.6%) for non-reactive stool H. pylori Antigen test (T-test=4.3, p-value <0.001). 	There was a high prevalence of Helicobacter pylori infection in newly diagnosed type 2 diabetes mellitus. Majority of the participants were asymptomatic with poor glycaemic control.	There is a dire need to provide proper counseling, education and awareness regarding diabetes mellitus and its association with Helicobacter pylori infection. Effective and appropriate measures should be taken against control of diabetes mellitus eradication of Helicobacter pylori infection.	No	10
10	2024-02-10 05:33:57.531412	2024-02-10 05:33:57.531412	\N	protasebaracka@gmail.com	PREVALENCE AND ASSOCIATED RISK FACTORS OF INTESTINAL PARASITIC INFESTATIONS AMONG CHILDREN AGED 3 TO 12 YEARS IN NZEGA TOWN COUNCIL-TABORA, MAY 2023.	Protase Byamungu, Deogratius Bintabara, Ezekiel Mwakitinya, Francis Francis.	The Department of Community Medicine, The University of Dodoma.	Protase Byamungu	Intestinal parasitic infections are a global public health concern, especially in developing countries due to environmental and social factors. Around 1.5 billion people, or 24% of the world's population, suffer from these infections, with hookworms, Ascaris lumbricoides, Trichuris trichiura, Giardia lamblia, and Entamoeba histolytica being prevalent. Sub-Saharan Africa faces particularly high infection rates. In Tanzania, studies reveal varying prevalence of parasitic infections in children. However, there is scarcity of information on the prevalence of intestinal parasitic infestation among children at Nzega Town Council in Tabora. \n\n	To determine the prevalence and assess risk factors associated with intestinal worm infestation among children aged 3-12 years at Nzega in Tabora May 2023.	A cross-sectional study design was employed, and households with children aged 3 to 12 years were conveniently sampled from specific wards (Nzega Mashariki, Nzega Magharibi, and Itilo) within Nzega Town Council. The total number of participants interviewed was 5888, but only 4001 completed the survey and provided stool samples. Formol ether concentration technique was used for analyzing stool samples. Data collected was analyzed and results obtained.	Among caregivers 33.6% were aged 34-40, 89% were females, and 38.9% were Sukuma. Majority were educated (78.8%), principally at the primary level (59.8%) and had three children (29.8%). Among children, 31.6% were aged 4-6 years, 52% were males, and attended primary school (54.1%). 57% of care takers knew about worms, often from healthcare centers (54.3%), 40.3% understood transmission (64.4% fecal-oral), and abdominal pain was a commonly known sign (71.7%). Preventive measures included handwashing (71.1%) and use of albendazole (56.8%). 74% of respondents used pipe water, 64.9% boiled it, 72.1% had flush toilets, and 66.7% washed hands before preparing food. Main waste disposal was by open dumping (48.5%). Laboratory results showed 2.3% (92/4001) infestations with Giardia as a common parasite (21.7%). Caretakers age (p=0.03) and the number of transmission ways known (p=0.01) had significant statistical association to the prevalence of intestinal parasitic infestations.	Findings indicate a relatively low prevalence of intestinal parasitic infestations in Nzega Town council. While this is positive news, it highlights the need for continued efforts to maintain and improve the health conditions in the area through targeted interventions and health education initiatives.	1.\tPublic education on the frequency of deworming preferably 3 months, to reduce the risk of transmission and infection. This could be emphasized from the Reproduction and child health (RCH) clinics and during medical visits in dispensaries, healthy centers and hospitals.\n2.\tChildren should be given education on the effects of walking bare foot to prevent intestinal worm infestation among children and this education could be provided from the school level for the school aged children.\n3.\tMass chemotherapy should increase to children to prevent the risk infection of intestinal worm infestation.\n	Yes	11
11	2024-02-11 12:22:14.312699	2024-02-11 12:22:14.312699	\N	ekawishe@gmail.com	USE OF NUTRITION INFORMATION IN PLANNING IN MOROGORO MUNICIPALITY AND MOROGORO DISTRICT 	*Ester Kawishe, Nyamizi Bundala and John Msuya	MS	Ester Kawishe	Nutrition information impose significance in the planning for nutrition intervention. The information should be from strengthened nutrition information system( Integrated Monitoring Systems(iMES), DHIS2, PLANREP) through the iMES is when can generate the accountability score card based on signed nutrition agreement from Nation to community level. Tanzania as other African country still invest low in nutrition information and there is inadequate data limits in planning. 	To evaluate collection and use of nutrition information at sub-nation levels	. A cross -sectional survey involving a sample of 42 Key informers from the councils, wards and villages/Streets from two councils in Morogoro Municipality(urban) and Morogoro district (rural) to determine the use of nutrition information in planning. The respondents were the heads of nutrition departments, Nutrition Officers and Executive Officers at ward and Village/Street Levels. Tool used for data collection was unstructured questionnaire. The data was analyzed by non -statistical approach. 	Use of nutrition information for planning is not practiced at sub council level( Wards/Villages/Mitaa)  but at the council at least Health, planning and Education are using them in planning. till at council relevant data such of stunting can not be captured	Nutrition information has been faced with challenges of  tools for data collection, not being accessed easily, delay  and quality data hence  could posibly hinder use of them in planning. The Community Health Workers, Ward/ Mtaa/ Village Executive Officer still are not much involved with the data apart from just compiling them and forwarding them to the council level.	Nutrition Officers at Regions and Councils should investment on capacitate all the people responsible for data collection and use.\nPO-RALG/TFNC should enforce the council to have budget for hard carbonated nutrition data form for good documentation and reference as well as easier work for the data collector and compiler.\nMinistry of Health should think of adopting the UNICEF/WHO 2018,recommendation for giving incentives to the Community Health Worker\nStill their is a room of more big studies in this area due to it relevance so as to improve nutrition services	Yes	15
12	2024-02-11 17:33:43.506385	2024-02-11 17:33:43.506385	\N	josephsingo15@gmail.com	DR	Deogratius bintabara, joseph b singo, mathew mvula, geofrey sichone, festo k shayo	UDOM	Joseph Singo	A medical doctor, graduated at UDOM in 2022, underwent internship training at St. Francis regional refferal hospital (SFRH)ifakara 2022-2023\nCurrently doing intern at NHIF\nEnsuasist in public health, primary health care, NCDs, infectious diseases and emergency medicine.	This study aims to determine the prevalence and factors associated with mental health conditions among university students in Tanzania during the COVID‐19 pandemic.	A sample of 425 students from six medical universities and colleges in Tanzania completed an online survey and was included in the analysis.\nThe questionnaire consisted of validated Depression, Anxiety and Stress Scale—21 Items (DASS‐21) questions (Cronbach’s alpha = 0.92) assessing the presence of mental health symptoms: depression, anxiety, and stress. Multivariable logistic regression models were fitted to explain the factors associated with mental health conditions. A P‐value < 0.05 was considered statistically significant in all inferential analyses	The median age (interquartile range) of the participants was 24 (22–26). The prevalence of mental health conditions was 28.94%, 54.12%, and 15.06% for depression, anxiety, and stress, respectively, while the prevalence of having any mental health condition was 58.59%. In an adjusted regression model, being in the fourth and fifth years of study and living with a spouse were significantly associated with increased odds of depression: AOR = 5.99 (1.31–27.47), AOR = 5.52 (1.18– 25.81), and AOR = 1.84 (1.08–3.15), respectively. Moreover, studying in private universities and living with a spouse were significantly associated with an increased likelihood of anxiety: AOR = 2.35 (1.72– 2.76), and AOR = 2.32 (1.20–4.50), respectively. The likelihood of stress was only among participants studying in private universities; AOR = 2.90 (1.60–5.27). The study revealed alarmingly high rates of mental health conditions among medical students in Tanzania during the COVID‐19 pandemic. 	The findings suggest the need for regular checkups for medical students regarding their mental health status. 	recommendations are, the government and other stakeholders establish mental health services within the universities for the effective prevention of the rising burden of mental health problems among universities in Tanzania and other countries with similar settings.	Yes	8
13	2024-02-11 17:41:46.632888	2024-02-11 17:41:46.632888	\N	josephsingo15@gmail.com	DR	Deogratius Bintabara, joseph b singo, mathew mvula, jofrey sichone and festo shayo	University of Dodoma	Dr Joseph B Singo (MD)	The COVID‐19 pandemic brought about a major public health concern worldwide. It forced many countries to enforce lockdowns, leading to the closure of higher learning institutions. The abrupt\nshift in the lifestyle of students had a profound impact on their mental health.	This study aims to determine the prevalence and factors associated with mental health conditions among university students in Tanzania during the COVID‐19 pandemic	A sample of 425 students from six medical universities and colleges in Tanzania completed an online survey and was included in the analysis.\nThe questionnaire consisted of validated Depression, Anxiety and Stress Scale—21 Items (DASS‐21) questions (Cronbach’s alpha = 0.92) assessing the presence of mental health symptoms: depression, anxiety, and stress. Multivariable logistic regression models were fitted to explain the factors associated with mental health conditions. A P‐value < 0.05 was considered statistically significant in all inferential analyse	The median age (interquartile range) of the participants was 24 (22–26). The prevalence of mental health conditions was 28.94%, 54.12%, and 15.06% for depression, anxiety, and stress, respectively, while the prevalence of having any mental health condition was 58.59%. In an adjusted regression model, being in the fourth and fifth years of study and living with a spouse were significantly associated with increased odds of depression: AOR = 5.99 (1.31–27.47), AOR = 5.52 (1.18– 25.81), and AOR = 1.84 (1.08–3.15), respectively. Moreover, studying in private universities and living with a spouse were significantly associated with an increased likelihood of anxiety: AOR = 2.35 (1.72– 2.76), and AOR = 2.32 (1.20–4.50), respectively. The likelihood of stress was only among participants studying in private universities; AOR = 2.90 (1.60–5.2	The study revealed alarmingly high rates of mental health conditions among medical students in Tanzania during the COVID‐19 pandemic. The findings suggest the need for regular checkups for medical students regarding their mental health status	recommendations are, the government and other stakeholders establish mental health services within the universities for the effective prevention of the rising burden of mental health problems among universities in Tanzania and other countries with similar settings.	Yes	14
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, name, type, "parentId") FROM stdin;
\.


--
-- Data for Name: category_closure; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category_closure (id_ancestor, id_descendant) FROM stdin;
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.countries (id, "createdAt", "updatedAt", "createdBy", name, code) FROM stdin;
1	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Afghanistan	AF
2	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	land Islands	AX
3	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Albania	AL
4	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Algeria	DZ
5	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	American Samoa	AS
6	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	AndorrA	AD
7	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Angola	AO
8	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Anguilla	AI
9	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Antarctica	AQ
10	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Antigua and Barbuda	AG
11	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Argentina	AR
12	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Armenia	AM
13	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Aruba	AW
14	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Australia	AU
15	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Austria	AT
16	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Azerbaijan	AZ
17	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Bahamas	BS
18	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Bahrain	BH
19	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Bangladesh	BD
20	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Barbados	BB
21	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Belarus	BY
22	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Belgium	BE
23	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Belize	BZ
24	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Benin	BJ
25	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Bermuda	BM
26	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Bhutan	BT
27	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Bolivia	BO
28	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Bosnia and Herzegovina	BA
29	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Botswana	BW
30	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Bouvet Island	BV
31	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Brazil	BR
32	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	British Indian Ocean Territory	IO
33	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Brunei Darussalam	BN
34	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Bulgaria	BG
35	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Burkina Faso	BF
36	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Burundi	BI
37	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Cambodia	KH
38	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Cameroon	CM
39	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Canada	CA
40	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Cape Verde	CV
41	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Cayman Islands	KY
42	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Central African Republic	CF
43	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Chad	TD
44	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Chile	CL
45	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	China	CN
46	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Christmas Island	CX
47	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Cocos (Keeling) Islands	CC
48	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Colombia	CO
49	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Comoros	KM
50	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Congo	CG
51	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Congo, The Democratic Republic of the	CD
52	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Cook Islands	CK
53	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Costa Rica	CR
54	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Cote D'Ivoire	CI
55	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Croatia	HR
56	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Cuba	CU
57	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Cyprus	CY
58	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Czech Republic	CZ
59	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Denmark	DK
60	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Djibouti	DJ
61	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Dominica	DM
62	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Dominican Republic	DO
63	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Ecuador	EC
64	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Egypt	EG
65	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	El Salvador	SV
66	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Equatorial Guinea	GQ
67	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Eritrea	ER
68	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Estonia	EE
69	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Ethiopia	ET
70	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Falkland Islands (Malvinas)	FK
71	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Faroe Islands	FO
72	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Fiji	FJ
73	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Finland	FI
74	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	France	FR
75	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	French Guiana	GF
76	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	French Polynesia	PF
77	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	French Southern Territories	TF
78	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Gabon	GA
79	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Gambia	GM
80	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Georgia	GE
81	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Germany	DE
82	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Ghana	GH
83	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Gibraltar	GI
84	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Greece	GR
85	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Greenland	GL
86	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Grenada	GD
87	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Guadeloupe	GP
88	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Guam	GU
89	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Guatemala	GT
90	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Guernsey	GG
91	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Guinea	GN
92	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Guinea-Bissau	GW
93	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Guyana	GY
94	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Haiti	HT
95	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Heard Island and Mcdonald Islands	HM
96	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Holy See (Vatican City State)	VA
97	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Honduras	HN
98	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Hong Kong	HK
99	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Hungary	HU
100	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Iceland	IS
101	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	India	IN
102	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Indonesia	ID
103	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Iran, Islamic Republic Of	IR
104	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Iraq	IQ
105	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Ireland	IE
106	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Isle of Man	IM
107	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Israel	IL
108	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Italy	IT
109	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Jamaica	JM
110	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Japan	JP
111	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Jersey	JE
112	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Jordan	JO
113	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Kazakhstan	KZ
114	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Kenya	KE
115	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Kiribati	KI
116	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Korea, Democratic People'S Republic of	KP
117	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Korea, Republic of	KR
118	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Kuwait	KW
119	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Kyrgyzstan	KG
120	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Lao People'S Democratic Republic	LA
121	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Latvia	LV
122	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Lebanon	LB
123	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Lesotho	LS
124	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Liberia	LR
125	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Libyan Arab Jamahiriya	LY
126	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Liechtenstein	LI
127	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Lithuania	LT
128	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Luxembourg	LU
129	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Macao	MO
130	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Macedonia, The Former Yugoslav Republic of	MK
131	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Madagascar	MG
132	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Malawi	MW
133	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Malaysia	MY
134	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Maldives	MV
135	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Mali	ML
136	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Malta	MT
137	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Marshall Islands	MH
138	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Martinique	MQ
139	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Mauritania	MR
140	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Mauritius	MU
141	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Mayotte	YT
142	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Mexico	MX
143	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Micronesia, Federated States of	FM
144	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Moldova, Republic of	MD
145	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Monaco	MC
146	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Mongolia	MN
147	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Montenegro	ME
148	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Montserrat	MS
149	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Morocco	MA
150	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Mozambique	MZ
151	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Myanmar	MM
152	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Namibia	NA
153	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Nauru	NR
154	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Nepal	NP
155	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Netherlands	NL
156	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Netherlands Antilles	AN
157	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	New Caledonia	NC
158	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	New Zealand	NZ
159	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Nicaragua	NI
160	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Niger	NE
161	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Nigeria	NG
162	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Niue	NU
163	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Norfolk Island	NF
164	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Northern Mariana Islands	MP
165	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Norway	NO
166	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Oman	OM
167	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Pakistan	PK
168	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Palau	PW
169	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Palestinian Territory, Occupied	PS
170	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Panama	PA
171	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Papua New Guinea	PG
172	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Paraguay	PY
173	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Peru	PE
174	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Philippines	PH
175	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Pitcairn	PN
176	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Poland	PL
177	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Portugal	PT
178	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Puerto Rico	PR
179	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Qatar	QA
180	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Reunion	RE
181	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Romania	RO
182	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Russian Federation	RU
183	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	RWANDA	RW
184	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Saint Helena	SH
185	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Saint Kitts and Nevis	KN
186	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Saint Lucia	LC
187	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Saint Pierre and Miquelon	PM
188	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Saint Vincent and the Grenadines	VC
189	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Samoa	WS
190	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	San Marino	SM
191	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Sao Tome and Principe	ST
192	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Saudi Arabia	SA
193	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Senegal	SN
194	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Serbia	RS
195	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Seychelles	SC
196	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Sierra Leone	SL
197	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Singapore	SG
198	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Slovakia	SK
199	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Slovenia	SI
200	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Solomon Islands	SB
201	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Somalia	SO
202	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	South Africa	ZA
203	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	South Georgia and the South Sandwich Islands	GS
204	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Spain	ES
205	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Sri Lanka	LK
206	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Sudan	SD
207	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Suriname	SR
208	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Svalbard and Jan Mayen	SJ
209	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Swaziland	SZ
210	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Sweden	SE
211	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Switzerland	CH
212	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Syrian Arab Republic	SY
213	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Taiwan, Province of China	TW
214	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Tajikistan	TJ
215	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Tanzania, United Republic of	TZ
216	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Thailand	TH
217	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Timor-Leste	TL
218	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Togo	TG
219	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Tokelau	TK
220	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Tonga	TO
221	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Trinidad and Tobago	TT
222	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Tunisia	TN
223	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Turkey	TR
224	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Turkmenistan	TM
225	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Turks and Caicos Islands	TC
226	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Tuvalu	TV
227	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Uganda	UG
228	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Ukraine	UA
229	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	United Arab Emirates	AE
230	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	United Kingdom	GB
231	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	United States	US
232	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	United States Minor Outlying Islands	UM
233	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Uruguay	UY
234	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Uzbekistan	UZ
235	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Vanuatu	VU
236	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Venezuela	VE
237	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Viet Nam	VN
238	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Virgin Islands, British	VG
239	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Virgin Islands, U.S.	VI
240	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Wallis and Futuna	WF
241	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Western Sahara	EH
242	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Yemen	YE
243	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Zambia	ZM
244	2024-01-28 13:59:19.121552	2024-01-28 13:59:19.121552	\N	Zimbabwe	ZW
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.files (id, "createdAt", "updatedAt", "createdBy", original_name, current_name, extension, size) FROM stdin;
1	2024-01-28 15:14:21.258631	2024-01-28 15:14:21.258631	\N	CamScanner 01-05-2024 09.28(1).pdf	686ffe81-8174-4cfc-a814-aafedebaedaf.pdf	pdf	388434
2	2024-01-29 00:10:16.644589	2024-01-29 00:10:16.644589	\N	CamScanner 01-05-2024 09.28(1).pdf	cdef5bbc-2d41-4d37-9303-3854c72f31f6.pdf	pdf	388434
\.


--
-- Data for Name: jisajilis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jisajilis (id, "createdAt", "updatedAt", "createdBy", status, path_file, "userId") FROM stdin;
\.


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menus (id, "createdAt", "updatedAt", "createdBy", description, name, state, url, icon, code, uid) FROM stdin;
\.


--
-- Data for Name: registrationcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registrationcategories (id, "createdAt", "updatedAt", "createdBy", name, code, description) FROM stdin;
2	2024-01-28 14:15:02.485063	2024-01-28 14:15:02.485063	\N	Student	ST	Student
3	2024-01-28 14:15:02.485063	2024-01-28 14:15:02.485063	\N	Researcher	Researcher	Researcher
4	2024-02-05 21:09:36.499774	2024-02-05 21:09:36.499774	\N	Academician and Researcher	Academician and Researcher	Academician and Researcher
5	2024-02-05 21:10:16.734298	2024-02-05 21:10:16.734298	\N	Ministerial Officials	Ministerial Officials	Ministerial Officials
6	2024-02-05 21:11:13.490382	2024-02-05 21:11:13.490382	\N	Heath care professionals	Heath care professionals	Heath care professionals
7	2024-02-05 21:11:52.878441	2024-02-05 21:11:52.878441	\N	Social  welfare professionals	Social  Welfare professionals	Social  Welfare professionals
8	2024-02-06 06:57:59.185673	2024-02-06 06:57:59.185673	\N	Nutrition Services professionals	Nutrition Services professionals	Nutrition Services professionals
9	2024-02-06 06:58:34.046909	2024-02-06 06:58:34.046909	\N	Other	Other	Other
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, "createdAt", "updatedAt", "createdBy", name, description) FROM stdin;
\.


--
-- Data for Name: subthemes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subthemes (id, "createdAt", "updatedAt", "createdBy", name, code) FROM stdin;
1	2024-02-01 19:03:08.808159	2024-02-01 19:03:08.808159	\N	Social determinants, Social Behavioral Change and Communication (SBCC) and Community Health System	
2	2024-02-01 19:03:40.236324	2024-02-01 19:03:40.236324	\N	Health Care Financing	
3	2024-02-01 19:04:01.80529	2024-02-01 19:04:01.80529	\N	Data use, Innovation, Technology and Research	
4	2024-02-01 19:04:16.580077	2024-02-01 19:04:16.580077	\N	Health Workforce	
5	2024-02-01 19:04:28.727348	2024-02-01 19:04:28.727348	\N	Leadership and Governance	
6	2024-02-01 19:04:41.157353	2024-02-01 19:04:41.157353	\N	Health Commodities	
7	2024-02-01 19:04:52.350268	2024-02-01 19:04:52.350268	\N	Reproductive, maternal, new borne, adolescent and child health	
8	2024-02-01 19:05:08.785507	2024-02-01 19:05:08.785507	\N	Emerging and re-emerging diseases	
9	2024-02-01 19:05:21.981477	2024-02-01 19:05:21.981477	\N	Communicable diseases	
10	2024-02-01 19:05:35.895929	2024-02-01 19:05:35.895929	\N	Non-Communicable diseases	
11	2024-02-01 19:05:50.258211	2024-02-01 19:05:50.258211	\N	Neglected Tropical diseases	
12	2024-02-01 19:06:00.884742	2024-02-01 19:06:00.884742	\N	Oral Health	
14	2024-02-01 19:06:23.641067	2024-02-01 19:06:23.641067	\N	Mental health and substance abuse	
15	2024-02-01 19:06:57.596328	2024-02-01 19:06:57.596328	\N	Nutrition services	
16	2024-02-01 19:07:13.244014	2024-02-01 19:07:13.244014	\N	Social Welfare Services (Gender Based Violence, Violence Against Children, Social protection, Aging population)	
13	2024-02-01 19:06:11.228054	2024-02-01 19:06:11.228054	\N	Communities engagement	
\.


--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "createdAt", "updatedAt", "createdBy", first_name, middle_name, last_name, phone_number, user_identification, sex, username, password, email, salutation, organization, "countryId", "registationcategoryId", "group", description) FROM stdin;
28	2024-02-04 12:26:53.324024	2024-02-04 12:26:53.324024	\N	ALBERT	CHRISTOPHER	SINKAMBA	0714371734	CFN8207	Male	sinkamba	Imes@2024	albert91sukwa@gmail.com	Nill	SONGEA MC	215	3	Individual	\N
29	2024-02-04 16:14:38.179409	2024-02-04 16:14:38.179409	\N	NEEMA	ABEL	KIVELIA	0767876917	CFN3910	Female	Kive Ney 	3KivOri7	kivelianeema@gmail.com	Miss	NAMTUMBO DISTRICT HOSPITAL 	215	3	Individual	\N
30	2024-02-04 17:04:14.216776	2024-02-04 17:04:14.216776	\N	YOHANA	NONGA	KENYATTA	0712040700	CFN2021	Male	0712040700	No1nga1No1nga	yohanakenyatta@gmail.com	Mr	LGA	215	3	Individual	\N
31	2024-02-04 18:12:48.275364	2024-02-04 18:12:48.275364	\N	MICHAEL 	ALOISI 	SWAY	0699544244	CFN1721	Male	19900528141150000129	Michael1990,,	michaelalois994@gmail.com	Mr.	LGA 	215	3	Individual	\N
32	2024-02-04 19:57:21.685715	2024-02-04 19:57:21.685715	\N	PHILIMON 	JONAS	NSODYA	0712040012	CFN5193	Male	nsodyap@gmail.com	Babamichael1	nsodyap@gmail.com	District Nutrition Officer	KILINDI DC	215	3	Individual	\N
33	2024-02-04 22:13:26.189998	2024-02-04 22:13:26.189998	\N	WINFRIDA	BENEDICTO	LYOBA	0713420146	CFN8408	Female	Winfrida Lyoba	Abigaili2017..	lyobawinnie@gmail.com	KAGERA	BUKOBA MUNICIPA COUNCIL	215	3	Individual	\N
34	2024-02-05 05:28:45.952353	2024-02-05 05:28:45.952353	\N	PAUL	CHRISTOPHER	CHAOTE	0786565944	CFN6030	Male	pchaote	Chaote#123	pchaote@gmail.com	Dr	PO RALG	215	3	Individual	\N
35	2024-02-05 07:44:02.746096	2024-02-05 07:44:02.746096	\N	REWARD	ARON	LEMA	0769629474	CFN6424	Female	rewardaron7@gmail.com	Mama1234#	rewardaron7@gmail.com	Ms	GOVERMENT	215	3	Individual	\N
36	2024-02-07 05:35:25.264384	2024-02-07 05:35:25.264384	\N	IDDI	RAMADHAN	KALESERE	0714240611	CFN6088	Male	Iddikalesere	ornamented1@'	kaleseraidrisa@gmail.com	Dr	TAMISEMI	215	6	Individual	\N
37	2024-02-07 05:41:51.212331	2024-02-07 05:41:51.212331	\N	GODFREY	JOSEPH	NYOMBI	+255753160786	CFN3524	Male	nyombi	Ngokolo2020	nyombyg@gmail.com	Mr	USAID TANZANIA	215	6	Individual	\N
38	2024-02-07 05:51:24.511436	2024-02-07 05:51:24.511436	\N	REVOCATUS 	BALTAZARY	KITENA	0714777151	CFN9582	Male	Rbaltazary	Revo1988@@@	rbrevoc@gmail.com	Dr	DODOMA CITY COUNCIL	215	6	Individual	\N
39	2024-02-07 05:53:13.138511	2024-02-07 05:53:13.138511	\N	SAID	RASHID	MUHIDINI	+255659528724	CFN1203	Male	saidrashid62@yahoo.com	Said.r@1989	saidrashid62@yahoo.com	Mr.	TAWAKAL HOSPITAL, ZANZIBAR	215	6	Individual	\N
40	2024-02-07 06:01:31.337211	2024-02-07 06:01:31.337211	\N	JAFARI	NAWABU 	MAKOMBE	0756853224	CFN5906	Male	nawabujafari@gmail.com	Tudom2015	nawabujafari@gmail.com	Dr	KASULU TOWN COUNCIL HOSPITAL	215	6	Individual	\N
41	2024-02-07 06:01:58.647994	2024-02-07 06:01:58.647994	\N	MAGINYA	SIMON	MPUYA	0627519993	CFN9756	Male	maginyampuya@gmail.com	Ikukwa@123	maginyampuya@gmail.com	Dr	IKUKWA HEALTH CENTER, MBEYA DC  MBEYA	215	6	Individual	\N
42	2024-02-07 06:15:36.039944	2024-02-07 06:15:36.039944	\N	GODBLESS	NELSON	MASAKI	0788432524	CFN3279	Male	jahblessnelson11@gmail.com	Gbnmasack05/05	jahblessnelson11@gmail.com	Dr	MAKAZI DISP	215	6	Individual	\N
43	2024-02-07 06:34:33.527468	2024-02-07 06:34:33.527468	\N	HAPPINESSS	WIMILE	MBEYELA	+255715035596	CFN6409	Female	NYEMO	hophope	happy2nov@yahoo.com	Dr	KINONDONI MUNICIPAL COUNCIL 	215	6	Individual	\N
45	2024-02-07 06:37:50.392595	2024-02-07 06:37:50.392595	\N	MFAUME	SAIDI	MNOKOTE	0766148717	CFN9158	Male	mmnokote	Evlina@1990	nokote@gmail.com	Mr.	MNOKOTE	215	2	Individual	\N
46	2024-02-07 06:38:51.358623	2024-02-07 06:38:51.358623	\N	HELENA	NONOS	MHAGAMA	0719069294	CFN9640	Female	hellen	Nonosius1996	hellenmhgma@gmail.com	Mrs	GOVERMENT	215	6	Individual	\N
47	2024-02-07 06:43:54.296413	2024-02-07 06:43:54.296413	\N	TIENYI	MNYORO	DANIEL	0627481345	CFN9933	Male	Tienyi Mnyoro Daniel	Rosetienyi@1999	dtienyi@gmail.com	Mr	LUGALO HOSPITAL	215	6	Individual	\N
48	2024-02-07 06:45:11.819811	2024-02-07 06:45:11.819811	\N	GEORGE	RWEHUMBIZA	KASIBANTE	+255653422341	CFN7228	Male	Kasibante	Geo@2054	kasibantedrgeorge@gmail.com	Dr George Kasibante 	MISUNGWI DC	215	6	Individual	\N
49	2024-02-07 06:46:59.922053	2024-02-07 06:46:59.922053	\N	BARAKA 	JIMSONI 	GELILE 	0673246783	CFN2175	Male	barakajimson@gmail.com	Baraka@12345	barakajimson@gmail.com	Dr	KINGALE HEALTH CENTER 	215	\N	Forum	\N
50	2024-02-07 06:52:31.818835	2024-02-07 06:52:31.818835	\N	ELIAS	MANASEH	MWANA	+255623343338	CFN5028	Male	Dr.Mwana	NdanshaU5090!	emwana@gmail.com	Dr.	UNIVERSITY OF DODOMA 	215	2	Individual	\N
51	2024-02-07 06:53:15.918324	2024-02-07 06:53:15.918324	\N	ABDALLAH	MAURICE	MAHUNGU	+255759969993	CFN8425	Male	Maurice	Maurice3021?	abdallahmaurice14@gmail.com	Dr.	TAMISEMI	215	6	Individual	\N
52	2024-02-07 06:58:21.895114	2024-02-07 06:58:21.895114	\N	HAMIS	JOHN	WAMBURA	0784039844	CFN6689	Male	Wamburah	Ryan@2018	wamburah49@gmail.com	Dr	SIMANJIRO DC	215	6	Individual	\N
53	2024-02-07 07:00:09.505671	2024-02-07 07:00:09.505671	\N	KELVIN	MALEMBELA	JUVENARY	0769400432	CFN4015	Male	Kelvin Malembela	Kevoo@0769400432	kelvin.malembela@gmail.com	Dr	RTI INTERNATIONAL	215	6	Individual	\N
55	2024-02-07 07:02:06.162715	2024-02-07 07:02:06.162715	\N	ADOLATH	EMILIAN	KAYOMBO	0717674820	CFN3574	Male	Adolath	Karen@2016	kayomboadolath@gmail.com	Mr	RAS MBEYA	215	5	Individual	\N
56	2024-02-07 07:11:49.807017	2024-02-07 07:11:49.807017	\N	STEPHEN 	NGUSSA 	LUSHIBA 	0758505593	CFN9578	Male	Sngussa 	Stephen@9019	stephenngussa@gmail.com	Dr	SAVE AND SUPPORT CHILDREN ORGANIZATION 	215	6	Individual	\N
57	2024-02-07 07:12:33.223431	2024-02-07 07:12:33.223431	\N	ISSA	ADAM	SWAI	0762 595 290	CFN1273	Male	Issaadamswai 	25DEC1989./	izomackloving@gmail.com	Dr 	MTWANGO HEALTH CENTER 	215	6	Individual	\N
58	2024-02-07 07:12:45.895949	2024-02-07 07:12:45.895949	\N	BEST	RICHARD	MAGOMA	+255 754621046	CFN9036	Male	magomabest	Nyambita@1978	magomabest@yahoo.co.uk	Dr	REGIONAL SECRETARIET - DODOMA	215	6	Individual	\N
60	2024-02-07 07:13:58.709906	2024-02-07 07:13:58.709906	\N	GODFREY	EVARD	KACHOLI	+255716301686	CFN9578	Male	gkacholi	v!!zP:G4Dx%%]9X	gkacholi@mzumbe.ac.tz	Dr.	MZUMBE UNIVERSITY	215	4	Individual	\N
61	2024-02-07 07:16:00.917763	2024-02-07 07:16:00.917763	\N	DR. HASSAN	ALLY	MKWACHU	0654179224	CFN4704	Male	Dr. Mkwachu	Mikausho#2018	mkwachuhassan@gmail.com	Dr.	ENGUSERO HEALTH CENTER KITETO MANYARA	215	6	Individual	\N
62	2024-02-07 07:16:29.179604	2024-02-07 07:16:29.179604	\N	SAUMU	SEIF	KUMBISAGA	0736609095	CFN7513	Female	KumbisagaSS	Drsaumu3751	kinyotasaumu@gmail.com	Dr	 KYELA  DC	215	6	Individual	\N
63	2024-02-07 07:25:21.907487	2024-02-07 07:25:21.907487	\N	DARISON	ANDREW	SYLIVAND	0755419447	CFN9860	Male	Darison	Linda&Melinda2	darisonandrew@gmail.com	Dr.	CHUNYA DISTRICT COUNCIL	215	6	Individual	\N
64	2024-02-07 07:26:05.644484	2024-02-07 07:26:05.644484	\N	MATESO	CHARLES	ANDREA	0763706596	CFN4857	Male	mcharles	Afya@2021	charlesmateso@gmail.com	Mr	RS GEITA	215	6	Individual	\N
65	2024-02-07 07:29:57.663808	2024-02-07 07:29:57.663808	\N	SARAH	IBRAHIM	MIENDA	0658282281	CFN5960	Female	Sarah	Sarah094$	sarahmyra094@gmail.com	Ms	CHAMWINO DISTRICT HOSPITAL	215	6	Individual	\N
66	2024-02-07 07:39:51.505385	2024-02-07 07:39:51.505385	\N	MASHAURI 	THOMAS	BIGILWAMUNGU	0757126443	CFN2081	Male	mashauri	Calist@Thom12	mashaurithomasandrea@gmail.com	DR	MBEYA CITY COUNCIL	215	6	Individual	\N
26	2024-01-28 14:59:38.78145	2024-01-28 14:59:38.78145	\N	Admin	Admin	HQ	0766148716	CFN8824	Male	mnokote	superUser.	admin@gmail.com	Mr	PORALG	215	3	\N	\N
59	2024-02-07 07:13:28.12384	2024-02-07 07:13:28.12384	\N	Edwin	Exaud	Swai	+255754375200	CFN6820	Male	eswai	PHC@wco2024	swaie@who.int	Dr.	WHO	215	\N	Forum	\N
67	2024-02-07 07:40:38.480719	2024-02-07 07:40:38.480719	\N	DEOGRASIA 	BAKARI 	MKAPA 	+255712895016	CFN2290	Female	Dr.Mkapa,DB	mamaJuniour@123	mkapadeograsia@yahoo.com	Dr	BUKOMBE DC 	215	6	Individual	\N
68	2024-02-07 07:40:45.296615	2024-02-07 07:40:45.296615	\N	MAY	ALEXANDER	MWAMWILE	0768174242	CFN6749	Male	mayfield	baba2warren	may20tz@yahoo.com	Dr.	PO-RALG	215	5	Individual	\N
69	2024-02-07 07:42:28.708003	2024-02-07 07:42:28.708003	\N	EMMANUEL	BEATI	MTIKA	0754049695	CFN7358	Male	Mtika	Dremmanuel1	mtikaeb14@gmail.com	Dr 	RS RUKWA	215	6	Individual	\N
72	2024-02-07 07:47:46.556196	2024-02-07 07:47:46.556196	\N	JUMA	JUMANNE	HAULE	0742997013	CFN3607	Male	Jhaule	Babanyra@16	jhaule89@gmail.com	Mr	DAR ES SALAWM REGIONAL SECRETARIET	215	6	Individual	\N
73	2024-02-07 07:49:04.377599	2024-02-07 07:49:04.377599	\N	CLEMENT	SOBE	MORABU	0757994546	CFN5643	Male	DR.MORABU	2308@dr!	clementmorabu@yahoo.com	Dr	MISUNGWI DISTRICT COUNCIL	215	5	Individual	\N
74	2024-02-07 07:54:04.883658	2024-02-07 07:54:04.883658	\N	AVITUS	PAUL	NYAMWIHURA	0714318456	CFN5230	Male	Dr avitus	Retina21	avinepaul.ap@gmail.com	Dr	MAKETE DISTRICT COUNCIL	215	6	Individual	\N
76	2024-02-07 08:06:41.336098	2024-02-07 08:06:41.336098	\N	TECLA	FELIX	ORIO 	0755308172	CFN5232	Female	orio	Dhis2016	oriotecla@yahoo.com	Dr	RAS IRINGA	215	6	Individual	\N
77	2024-02-07 08:10:05.135819	2024-02-07 08:10:05.135819	\N	LEVINA	SUNDI	MBOGOMA	0742313966	CFN6672	Female	YaMungu	raymond39_1'	mbogomalevina@yahoo.com	Dr.	NJOMBE DISTRICT COUNCIL	215	6	Individual	\N
78	2024-02-07 08:14:40.715515	2024-02-07 08:14:40.715515	\N	ROSALIA	SEVERIN	AROPE	0715392181	CFN3404	Female	rosalia.arope@tamisemi.go.tz 	Simba@123	aroperosalia@yahoo.com	Mrs	PO-RALG 	215	7	Individual	\N
79	2024-02-07 08:16:25.906365	2024-02-07 08:16:25.906365	\N	KHADIJA	MUSSA	HAROUN	0717006742	CFN2405	Female	Kharoun	Manzuja.123	khadijaharoun@gmail.com	EHO	RAS, IRINGA	215	6	Individual	\N
80	2024-02-07 08:19:05.952478	2024-02-07 08:19:05.952478	\N	AGREY	COSMAS	JOACHIM	0756921721	CFN7727	Male	Agrey Cosmas	Ngara1992	agreycosmas@yahoo.com	Mr	SHDEPHA+	215	6	Individual	\N
81	2024-02-07 08:29:57.473825	2024-02-07 08:29:57.473825	\N	SIMON	PHILIP	NCHIMBI	0656662000	CFN7645	Male	snchimbi	Muhimbili@2007	snchimbi17@gmail.com	Mr.	MUHIMBILI ORTHOPAEDIC INSTITUTE	215	6	Individual	\N
82	2024-02-07 08:36:50.131202	2024-02-07 08:36:50.131202	\N	FRIDA 	MICHAEL	AKYOO	+255769869660	CFN7767	Female	FridaAkyoo	Hakunamatata2024	f.akyoo@solidarmed.ch	MS	SOLIDARMED TANZANIA	215	6	Individual	\N
83	2024-02-07 08:39:02.161001	2024-02-07 08:39:02.161001	\N	PASTORY	KULWA	NGUMIJI	0655737259	CFN2387	Male	Pastorpk	Ngumiji06	kulwapastory@gmail.com	Dr	KACHWAMBA HC	215	6	Individual	\N
84	2024-02-07 08:43:29.658447	2024-02-07 08:43:29.658447	\N	MARGARETH	SIMON	KIMWAGA	0715050805	CFN1185	Female	dr.margareth	Leon@2020	maggiekim70@gmail.com	DR	MAPINDUZI HEALTH CENTER	215	6	Individual	\N
85	2024-02-07 08:51:33.790618	2024-02-07 08:51:33.790618	\N	BARAKA	HAMISI	MSUMI	0753019242	CFN8167	Male	baraka 	Afya1@2024	barakmsumi@gmail.com	Dr	TABORA MUNICIPAL COUNCIL	215	9	Individual	\N
86	2024-02-07 08:58:25.353862	2024-02-07 08:58:25.353862	\N	ENOCK	ISACK	SHADRACK	0754455331 	CFN6334	Male	ENOCK	1010@Enock	enockisack51@yahoo.com	Dr 	WANGINGOMBE DISTRICT HOSPITAL	215	6	Individual	\N
87	2024-02-07 09:15:13.545438	2024-02-07 09:15:13.545438	\N	MOHAMED	A	MKUMBWA 	0621954331	CFN8338	Male	drmkumbwa2018@gmail.com	Gaby@2024	drmkumbwa2018@gmail.com	Dr.	DR .JAKAYA MRISHO KIKWETE DISTRICT HOSPITAL	215	6	Individual	\N
88	2024-02-07 09:15:52.655361	2024-02-07 09:15:52.655361	\N	AISHA	ZUHERI	ALI	0762026087	CFN5737	Female	aishazuheri@gmail.com	Ai0762026087	aishazuheri@gmail.com	SENIOR ASSISTANT MEDICAL OFFICER	DSM CITY COUNCIL OFFICE	215	6	Individual	\N
89	2024-02-07 09:19:38.157612	2024-02-07 09:19:38.157612	\N	LUSEKELO	BROWN	NJONGE	0763301819	CFN7476	Male	Lnjonge	Kaj-1976@@	lusekelo.njonge@jhpiego.org	Dr	JHPIEGO	215	6	Individual	\N
90	2024-02-07 09:51:39.14835	2024-02-07 09:51:39.14835	\N	EMMANUEL 	PAUL	BIYA	0658044441	CFN8950	Male	ebiya	Pombe@1992852	manuelbiya@gmail.com	Dr	KINONDONI MUNICIPAL COUNCIL	215	6	Individual	\N
91	2024-02-07 09:54:22.516364	2024-02-07 09:54:22.516364	\N	RABIA	YUSSUF	ESMAIL	+255713204114	CFN2762	Female	RabiaEs	Sanaah@227	rubyesmail32@gmail.com	Mrs.	MINISTRY OF HEALTH	215	5	Individual	\N
92	2024-02-07 10:33:38.288423	2024-02-07 10:33:38.288423	\N	JAMES	ERNEST	MAMBOLEO	0786305956	CFN6373	Male	Chepes Jay	Jaymes.03	chepesjay22@gmail.com	Dr	MUHIMBILI UNIVERSITY OF HEALTH	215	4	Individual	\N
93	2024-02-07 10:34:34.567507	2024-02-07 10:34:34.567507	\N	GODBLESS	HENRY	MFURU	+255 766195641	CFN3914	Male	MFURU	S'H]dL;9-V.+x}W	mfurugodbless725@gmail.com	Dr.	MUHAS	215	2	Individual	\N
94	2024-02-07 10:34:36.692383	2024-02-07 10:34:36.692383	\N	MAKUNGA	KULWA 	BUTEYE	0752594343	CFN7129	Male	jbuteye	Justin@23	bute99tine@yahoo.com	Dr.	KWIMBA DC -MWANZA	215	6	Individual	\N
95	2024-02-07 10:50:00.054895	2024-02-07 10:50:00.054895	\N	CHRISTINE	EPHRAIM	RUKINISHA	+255764672122	CFN7750	Female	lukinishac	Tanzania@2021	christinelukinisha@gmail.com	Ms	NEWALA DC	215	8	Individual	\N
96	2024-02-07 10:54:38.356745	2024-02-07 10:54:38.356745	\N	SEPHORD	SAUL	NTIBABARA	+255716149446	CFN9916	Male	Sephord	Ssnr@1993	sesantiro@gmail.com	Mr	TANZANIA FIELD EPIDEMIOLOGY AND LABORATORY TRAINING PROGRAM	215	5	Individual	\N
97	2024-02-07 11:16:35.596712	2024-02-07 11:16:35.596712	\N	JONHAS	MASATU	MALIJA	+255718707498	CFN1836	Male	masatu.jm@gmail.com	0757663409	masatu.jm@gmail.com	Mr.	TANZANIA FIELD EPIDEMIOLOGY AND LABORATORY TRAINING PROGRAM 	215	2	Individual	\N
98	2024-02-07 11:21:30.657377	2024-02-07 11:21:30.657377	\N	SELEMANI 	JOHO	JUMAA	+255655565420	CFN9231	Male	ibnijoho@gmail.com	Mwakuriwa@1992	ibnijoho@gmail.com	Mr	PRESIDENT'S OFFICE REGIONAL ADMINISTRATION AND LOCAL GOVERNMENT (PANGANI DISTRICT COUNCIL)	215	5	Individual	\N
99	2024-02-07 11:29:43.378863	2024-02-07 11:29:43.378863	\N	NEEMA	CHARLES	MPANDUJI	0683102529	CFN9745	Female	masakia	V2ch@20072010	mpandujineema@gmail.com	Dr	NATIONAL AIDS, STI AND HEPATISIS CONTROL PROGRAM	215	5	Individual	\N
100	2024-02-07 11:33:09.280225	2024-02-07 11:33:09.280225	\N	JENIPHA	MONICA	METODI	0784312473	CFN3476	Female	Jenipha 	Ndeanka02	j-metodi@yahoo.com	Dr	MNH	215	4	Individual	\N
101	2024-02-07 11:37:26.934729	2024-02-07 11:37:26.934729	\N	BARAKA	JOSEPH	DEDU	0782747881	CFN4598	Male	Dedu	Dedu@2024	dedubaraka@gmail.com	Mr	IKUNGI DC	215	6	Individual	\N
102	2024-02-07 11:39:16.037692	2024-02-07 11:39:16.037692	\N	MKAMA	NYAJIBHAI	JULIUS	+255719597444	CFN1295	Male	MKAMA	Musa1948@	mkamajulius1@gmail.com	Mr	TUMBI REGIONAL REFERRAL HOSPITAL	215	6	Individual	\N
103	2024-02-07 11:49:58.960747	2024-02-07 11:49:58.960747	\N	ELIZABETH	JAMES	NYEMA	754360241	CFN1528	Female	enyema	Benedict@99	bjnyema@gmail.com	Dr	MBEYA RS	215	6	Individual	\N
104	2024-02-07 12:15:39.000462	2024-02-07 12:15:39.000462	\N	JOSEPH	ATHANAS	MWINAMILA	0744824484	CFN9260	Male	Joseph	Josep@19	josephathanas1@gmail.com	Dr	KATUNGURU HC, SENGEREMA DC	215	6	Individual	\N
105	2024-02-07 12:25:16.000381	2024-02-07 12:25:16.000381	\N	DENNIS	FRANCIS	MROSSO	0687514075	CFN4894	Male	Dennis 	Mrosso1998	mrossodennis6@gmail.com	Mr	LUGALO GENERAL HOSPITAL	215	6	Individual	\N
108	2024-02-07 13:37:48.344974	2024-02-07 13:37:48.344974	\N	ALEX	P	ALEXANDER	067243770        	CFN1375	Male	ALEX ALEXANDER	@Fau13//fa	alexandersonalex042@gmail.com	DR	  HEAD DEPARTMENT OF HEALTH, SOCIAL WELFARE AND NUTRITION SERVICES SAME DISTRICT COUNCIL	215	6	Individual	\N
110	2024-02-07 14:39:07.769813	2024-02-07 14:39:07.769813	\N	SHAFII	HAFIDHI	HEMED	0715557919	CFN3632	Male	Shafii hemed	140970Mama	allysultan00@gmail.com	Mr	HAFFORD HOSPITAL	215	\N	Individual	\N
112	2024-02-07 15:08:20.987119	2024-02-07 15:08:20.987119	\N	ANTIDIUS	PAUL	RWEHUMBIZA	+255768155204	CFN4366	Male	arwehumbiza 	Kabasheke@17	rwehumbizaantidius@gmail.com	Dr 	SONGEA REGIONAL REFERRAL HOSPITAL 	215	6	Individual	\N
113	2024-02-07 15:09:22.086496	2024-02-07 15:09:22.086496	\N	WITO	PATRICK	SANGA	0718260626	CFN4524	Male	Wiston	Ahjussi97	wistonpatrick97@gmail.com	Mr	ISMANI HEALTH CENTRE	215	6	Individual	\N
114	2024-02-07 15:24:18.602414	2024-02-07 15:24:18.602414	\N	AMOS	MWITA	CHACHA	0621662650	CFN2109	Male	nyambochi100@gmail.com	Mwita@2010	nyambochi100@gmail.com	Mr	ILYAMCHELE DISPENSARY	215	6	Individual	\N
115	2024-02-07 17:06:30.667642	2024-02-07 17:06:30.667642	\N	MAHMOUD	OMARY	MAHMOUD	0624898625	CFN5473	Male	Mahmoud	Abdullah@123	omarymahmoud330@gmail.com	Dr	MAJENGO HC	215	6	Individual	\N
116	2024-02-07 17:33:04.195594	2024-02-07 17:33:04.195594	\N	EDITRUDA	BENEDICT	SANGA	0752995601	CFN5163	Female	10260368	Sanga@54321	sangaeditruda@gmail.com	Dr.Editruda benedict Sanga	MAKAMBAKO HEALTH CENTRE	215	6	Individual	\N
117	2024-02-07 18:06:15.63607	2024-02-07 18:06:15.63607	\N	SAIDI	TIMAMU	MGATA	0767494405	CFN6660	Male	Smgata	Mjombadeo2209	smgata@psi.or.tz	Mr	PSI	215	6	Individual	\N
119	2024-02-07 18:53:17.94035	2024-02-07 18:53:17.94035	\N	ELIKANA	SHIBONE	LUBANGO	0758203081	CFN3893	Male	lubangoelikana@gmail.com	Elianna30032021#	lubangoelikana@gmail.com	Dr.	UKUNE HEALTH CENTRE	215	6	Individual	\N
120	2024-02-07 19:17:31.190199	2024-02-07 19:17:31.190199	\N	DANIEL	ELIFURAHA	MATERU	0629950163	CFN5399	Male	Eliyatosha	Godlove1990	danielemateru@gmail.com	Mr.	SONGEA RRH	215	6	Individual	\N
121	2024-02-07 19:34:10.173877	2024-02-07 19:34:10.173877	\N	CHRISTIAN	AMAS	CHACHA	0769923302	CFN6685	Male	chriss	Drcaris619	chriss11caris@gmail.com	Mr.	BUCHOSA DC	215	6	Individual	\N
122	2024-02-07 19:37:13.398376	2024-02-07 19:37:13.398376	\N	SARAH	MICHAEL	LUCUMAY	0754369079	CFN1139	Female	Slucumay	Sarah@@arko	saruumn@gamail.com	Ms	KINONDONI MC	215	6	Individual	\N
123	2024-02-07 19:39:33.770795	2024-02-07 19:39:33.770795	\N	WILSON 	MBOGO	MALALE	0763 768 286 	CFN7238	Male	19891224151120000721	Mbogo@193	mbogosenior193@gmail.com	Dr.	AL MANSOOR DISPENSARY 	215	6	Individual	\N
126	2024-02-07 20:35:22.453702	2024-02-07 20:35:22.453702	\N	ADIATH	MURSHID	SHUZA	0762411992	CFN2589	Female	Addy	Imran2021	adiathshuza46@gmail.com	Ms	TANZANIA REDCROSS	215	6	Individual	\N
127	2024-02-08 04:06:31.968148	2024-02-08 04:06:31.968148	\N	EUSTADIUS 	KAMUGISHA	FELICIAN	0754442389	CFN8681	Male	Kamugisha	Kashangati@06	eustadius.felician@yahoo.com	Mr.	BUKOBA REGIONAL REFERRAL HOSPITAL	215	6	Individual	\N
128	2024-02-08 06:45:25.535277	2024-02-08 06:45:25.535277	\N	PASCHAL	GERALD	KALINGA	0755203140	CFN5804	Male	pkalinga	Mwangosi123@	paschal.kalinga@gmail.com	Dr.	MISUNGWI DC	215	6	Individual	\N
130	2024-02-08 06:52:01.651002	2024-02-08 06:52:01.651002	\N	ANITHA 	FRANCIS 	MGANGA 	0713599154	CFN6432	Female	mganganitha@gmail.com	Anitha@1993	mgangaanitha@gmail.com	Miss	BAHI DISTRICT COUNCIL 	215	2	Individual	\N
131	2024-02-08 06:55:07.37815	2024-02-08 06:55:07.37815	\N	GODFREY	SYLASI	STANSLAUS	0699256173	CFN5191	Male	19930614412080000228	Gody1234	stanslausgodfrey1234@gmail.com	Dr.	KAKONKO COUNCIL	215	6	Individual	\N
132	2024-02-08 07:04:55.798085	2024-02-08 07:04:55.798085	\N	VICTORY	GODFREY	NYENZA	0767473273	CFN3507	Male	nyenzavic	Sagimembe2019	nyenzavic@gmail.com	Mr.	RS RUVUMA	215	7	Individual	\N
133	2024-02-08 07:06:11.368854	2024-02-08 07:06:11.368854	\N	HADIJA 	IDDI	ZEGEGGA	0759358233	CFN9362	Female	Dr Zegegga 	Hythamke2023	zegeggah@gmail.com	Dr.	MASWA DC	215	6	Individual	\N
134	2024-02-08 07:06:11.394575	2024-02-08 07:06:11.394575	\N	SELEMANI	HUSSEIN	KASUGULU	0784635357	CFN2547	Male	Skasugulu	kilongawima	skassugulu@yahoo.com	Dr.	NANYAMBA TOWN COUNCIL	215	6	Individual	\N
135	2024-02-08 07:10:01.99435	2024-02-08 07:10:01.99435	\N	ANDREW	PETER 	BULALI	0719003286	CFN8895	Male	Dr. Drew 2588	114425andY#	peterbulali@gmail.com	Dr.	MINISTRY OF HEALTH TANZANIA 	215	6	Individual	\N
137	2024-02-08 07:10:46.766214	2024-02-08 07:10:46.766214	\N	BONIVENTURA 	JOSEPHINA	MAKANZA	0712683346	CFN5925	Male	Makanza	890890Makanza	bonmakanza@gmail.com	Mr.	CHILD IN THE SUN	215	7	Individual	\N
138	2024-02-08 07:11:09.922832	2024-02-08 07:11:09.922832	\N	MOHAMED 	A	MNYAU	0713220116	CFN2361	Male	Waziri	Waziri@11	mohamedmnyau@gmail.com	Dr.	KIGAMBONI DH	215	6	Individual	\N
139	2024-02-08 07:12:01.162552	2024-02-08 07:12:01.162552	\N	JOHN	GODFREY 	SABATELE	0685329239	CFN7170	Male	josabatele@gmail.com	MADINAH2002199!	josabatele@gmail.com	Mr.	UNIVERSITY OF DODOMA	215	2	Individual	\N
140	2024-02-08 07:13:34.107029	2024-02-08 07:13:34.107029	\N	MUSA	JACKSON	LUNYONGA	0764797430	CFN7454	Male	Musa J. Lunyonga	1404Jacky	mlunyonga@americares.org	Mr.	AMERICARES FOUNDATION TANZANIA	215	7	Individual	\N
141	2024-02-08 07:16:16.803332	2024-02-08 07:16:16.803332	\N	MASUMBUKO	BUNDALA	NDAKA	0719584418	CFN8172	Male	masumbuko	Malcom2015	bmasumbuko@rocketmail.com	Dr.	UDOM	215	2	Individual	\N
142	2024-02-08 07:17:14.103695	2024-02-08 07:17:14.103695	\N	BARAKA	JOHN	MABULA	0756586428	CFN2886	Male	Mabula	Luyeye@2024	barakamabula1997@gmail.com	Mr.	BRAC TANZANIA MICROFINANCE LIMITED 	215	6	Individual	\N
143	2024-02-08 07:17:26.912643	2024-02-08 07:17:26.912643	\N	MIRAJI 	AZIZI	SALUMU 	0652186322	CFN1193	Male	Miraji 	Mirqji@123	mirajiaziz34@gmail.com	Dr.	GOVERNMENT 	215	6	Individual	\N
145	2024-02-08 07:18:06.784345	2024-02-08 07:18:06.784345	\N	HELLEN	MSAKI	BALTAZAR	+255713220593	CFN1097	Female	Hellena	Martin333tz	hellenbaltazar5@gmail.com	Dr.	UNIVERSITY OF DODOMA	215	2	Individual	\N
111	2024-02-07 14:48:39.802045	2024-02-07 14:48:39.802045	\N	MERENIA	SELEMANI	FAUSTINE	0654248157	CFN4946	Female	Merenia	Merenia@2024	mereniandaki17@gmail.com	Miss	MUHEZA DISTRICT COUNCIL	215	6	Individual	Health Secretary
125	2024-02-07 19:48:48.687029	2024-02-07 19:48:48.687029	\N	HAPPINESS	WIMILE	MBEYELA	0715035596	CFN4332	Female	happiness	Hopehope20	happinesssmbeyela@gmail.com	Dr.	KINONDONI MUNICIPAL COUNCIL	215	6	Individual	\N
146	2024-02-08 07:18:52.422628	2024-02-08 07:18:52.422628	\N	AUGUSTINO	JONAS	MWOGOSI	+255714696752	CFN8676	Male	mwogosia	augu@1525Vale	mwogosia@gmail.com	Mr.	UNIVERSITY OF DODOMA	215	2	Individual	\N
147	2024-02-08 07:24:07.574446	2024-02-08 07:24:07.574446	\N	EUSEBI	CORNELIUS	KESSY	+255755573765	CFN9039	Male	Kessydr	Kessydr1011	kessydr1982@gmail.com	Dr.	CHAMWINO DC	215	6	Individual	\N
148	2024-02-08 07:24:16.348237	2024-02-08 07:24:16.348237	\N	JACINTHA	WINCESLAUS	KAIJAGE	0756068783	CFN6726	Female	Jacy	Mulo@123	jacinthakaijage36@gmail.com	Ms	HEALTH	215	6	Individual	\N
149	2024-02-08 07:26:20.695603	2024-02-08 07:26:20.695603	\N	AGUSTINO	KABOMA	MAKULA	+255657021442	CFN8074	Male	AgustinoMakula	Makula1710	agustinomakula1991@gmail.com	Dr.	UDOM	215	2	Individual	\N
150	2024-02-08 07:26:59.097813	2024-02-08 07:26:59.097813	\N	ESTER	CHARLES	MAMBALI	+255716474435	CFN9016	Female	EsterMambali	Lucy.@1986	ester.mambali@gmail.com	Lady.	MOH	215	7	Individual	\N
151	2024-02-08 07:27:38.906793	2024-02-08 07:27:38.906793	\N	KATANTA	LAZARUS	SIMWANZA	+255755825542	CFN1317	Male	Katanta	Ntandi@2804ks	drkatanta@gmail.com	Dr.	TANZANIA BOYS& MENS AMBASSADORS	215	6	Individual	\N
152	2024-02-08 07:31:54.458126	2024-02-08 07:31:54.458126	\N	ISIAKA	HAMISI	KIKUWI	+255718544135	CFN3389	Male	Mmbu Club Digital	Shani@110518jongo	mbuclub15@gmail.com	Mr.	MMBU CLUB DIGITAL	215	\N	Forum	\N
154	2024-02-08 07:34:29.022045	2024-02-08 07:34:29.022045	\N	FARHAT	LAHDAD	MOHAMED	0777547713	CFN2421	Female	far123	OmarlovesFarhat1	farhat_j@live.com	Ms	UNIVERSITY OF DODOMA	215	2	Individual	\N
155	2024-02-08 07:41:17.360676	2024-02-08 07:41:17.360676	\N	SULEIMAN	AMIRI	MPOSO	0672383922	CFN6509	Male	Markjr	Mposo@2242	suleymanmarksman867@gmail.com	Dr.	GOVERNMENT	215	6	Individual	\N
156	2024-02-08 07:47:44.635212	2024-02-08 07:47:44.635212	\N	K	K	K	0773456789	CFN6444	Female	kt	tzporalg	kate.green@yahoo.co.uk	Dr.	MUHAS	215	3	Individual	\N
157	2024-02-08 07:50:55.198448	2024-02-08 07:50:55.198448	\N	MAOMBI	NAFTALI	SILVERY	+255620732672	CFN5234	Male	Maombi01	Maombi2019	maombinaftali20@gmail.com	Mr.	UNEMPLOYED	215	6	Individual	\N
158	2024-02-08 07:51:07.409388	2024-02-08 07:51:07.409388	\N	AMANUEL	HAILESELASSIE	GEBREMEDHIN	+251914732100	CFN8930	Male	Amanuel	Aman732100#	amanuel.hselassie@moh.gov.et	Mr.	MINISTRY OF HEALTH	69	5	Individual	\N
159	2024-02-08 07:55:07.470861	2024-02-08 07:55:07.470861	\N	MARIA	ELEUTER	KAPINGA	+255685053500	CFN8477	Female	Maria13	Steeli13	mkapinga13@gmail.com	Dr.	MAGU DISTRICT COUNCIL	215	6	Individual	\N
162	2024-02-08 08:10:26.378945	2024-02-08 08:10:26.378945	\N	SUZANA	MATHIAS	NCHALLA	0689770782	CFN3459	Female	suzy69mathias@gmail.com	Suzy68@mathias	suzy69mathias@gmail.com	Ms	PO RALG	215	5	Individual	\N
163	2024-02-08 08:17:24.116818	2024-02-08 08:17:24.116818	\N	JOHN	AMANI	SARUA	0692249902	CFN5131	Male	Drjohnamani	Doctoramani2	amancarson2@gmail.com	Dr.	GLOBAL MATERNITY	215	6	Individual	\N
164	2024-02-08 08:25:28.439573	2024-02-08 08:25:28.439573	\N	HENRY	ALEX	MPUMPI	0746930952	CFN9466	Male	Henry Mpumpi 	9272Gairo	henrympumpi@gmail.com	Dr.	GAIRO DISTRICT HOSPITAL 	215	6	Individual	\N
165	2024-02-08 08:35:18.733534	2024-02-08 08:35:18.733534	\N	MATHEW	SHILEKA	SAMWEL	0717453315	CFN7595	Male	Mtuwa4	Kqmbarage1	mtuwa4zondo@gmail.com	Dr.	NEWALA DC	215	6	Individual	\N
167	2024-02-08 08:41:37.741589	2024-02-08 08:41:37.741589	\N	AZDA	ATHUMAN	KWARIKO	0754484847	CFN3870	Female	Azda	Whibsy1257	eizdakath@gmail.com	Dr.	GEZI	215	6	Individual	\N
168	2024-02-08 08:45:57.447919	2024-02-08 08:45:57.447919	\N	RICHARD	SEBASTIAN	SILUMBE	0713481467	CFN5169	Male	Silumbe	Richieannei09.!	rsilumbe@gmail.com	Mr.	CLINTON HEALTH ACCESS INITIATIVE (CHAI)	215	6	Individual	\N
169	2024-02-08 08:47:22.464629	2024-02-08 08:47:22.464629	\N	MCFGH	HGUII	NGHHH	78008775578	CFN2053	Female	Nbnjkkbhhhh	yhghjkvvvhchjkjcdukkhh2A	khuh@gmail.com	Miss	KGFUY	215	2	Individual	\N
170	2024-02-08 08:52:37.027118	2024-02-08 08:52:37.027118	\N	ANODI	RWEHUMBIZA 	KAIHULA	+255656721324	CFN2914	Male	Anodi Kaihula 	Kaihula@1998	akaihula@gmail.com	Mr.	TANZANIA HEALTH SUMMIT 	215	6	Individual	\N
171	2024-02-08 08:54:39.514562	2024-02-08 08:54:39.514562	\N	LEONARD 	FRANCIS 	NYIGO 	0755812355	CFN3004	Male	NYIGO 	Leza@123	nyigoleonard@gmail.com	Dr.	ULYANKULU HC 	215	6	Individual	\N
172	2024-02-08 08:58:23.952817	2024-02-08 08:58:23.952817	\N	IBRAHIM	DAUD	GABIKWA	+255768210753	CFN9265	Male	GABIKWA	Ibrah@123	ibrahimgabikwa20@gmail.com	Mr.	ST. JOHN'S UNIVERSITY OF TANZANIA 	215	2	Individual	\N
173	2024-02-08 09:05:22.886515	2024-02-08 09:05:22.886515	\N	MAKAME	GORA	HAJI	+255773404220	CFN2388	Male	Makgora94	Michael94	makgora3294@gmail.com	Dr.	STATE UNIVERSITY OF ZANZIBAR	215	6	Individual	\N
174	2024-02-08 09:17:20.017913	2024-02-08 09:17:20.017913	\N	IVONY	ISSACK	KAMALA	0756085959	CFN5082	Female	Ivony	AsinMuka213	ivonykamala@gmail.com	Ms	LAERDAL GLOBAL HEALTH, TANZANIA	215	3	Individual	\N
175	2024-02-08 09:21:31.640689	2024-02-08 09:21:31.640689	\N	ELINEEMA	GOODLUCK	KIHUNRWA	+255679655150	CFN4404	Male	elineema	Goodlucky123#	elineemakihunrwa17@gmail.com	Dr.	DODOMA REFERRAL HOSPITAL	215	9	Individual	\N
176	2024-02-08 09:26:25.529438	2024-02-08 09:26:25.529438	\N	PETER	BENEDICT	LEMMY	0715398507	CFN7521	Male	peterchainz	Iseul4321@	peterchainz@gmail.com	Dr.	MBULU DC	215	6	Individual	\N
177	2024-02-08 09:33:43.659524	2024-02-08 09:33:43.659524	\N	EVA	COSTANTINE	MANGA	0755520997	CFN8114	Female	Evakidoti	Eva@2024	evamanga52@gmail.com	Miss	HAYDOM LUTHERAN HOSPITAL 	215	2	Individual	\N
178	2024-02-08 09:34:08.618995	2024-02-08 09:34:08.618995	\N	SHARIFU	BUSHIRI	DADI	0766 280 311 	CFN7697	Male	Bdadi	Bdadi0416	sharifu.bdadi@gmail.com	Mr.	BDADI FOUNDATION 	215	7	Individual	\N
179	2024-02-08 09:46:43.251513	2024-02-08 09:46:43.251513	\N	LUCIANA	SILU	MDUMA	+255627805252	CFN1149	Female	Luciana	ILOVEMYDAD95lucy!	lucianamduma20@gmail.com	Dr.	KOREA FOUNDATION FOR INTERNATIONAL HEALTHCARE	215	6	Individual	\N
180	2024-02-08 09:48:42.285016	2024-02-08 09:48:42.285016	\N	ASTELIUS	KALUGABA	ALISTIDES	0766912478	CFN3128	Male	Astelius_IPHCC	Pellagia1970	asterium104@gmail.com	Mr.	UDOM	215	2	Individual	\N
181	2024-02-08 09:56:11.034904	2024-02-08 09:56:11.034904	\N	WENDY	ROBERT	MUNISI	0765909415	CFN6667	Female	Wendy	Inse912+++++	wendyrobert79@gmail.com	Dr.	DED UYUI	215	6	Individual	\N
182	2024-02-08 10:09:02.838402	2024-02-08 10:09:02.838402	\N	KUDUISHE	JUMA	KISOWILE	0789414741	CFN3696	Female	Kuduishe	SGake6364!	kuduzekudu@gmail.com	Dr.	MEDIKEA	215	6	Individual	\N
183	2024-02-08 18:56:05.588278	2024-02-08 18:56:05.588278	\N	ISACK	HOKELAI	KANIKI	+255675599971	CFN6080	Male	Kaniki	Kimath98!	isackkaniki@yahoo.com	Mr.	DODOMA RRH /AHDA	215	6	Individual	\N
194	2024-02-08 18:59:39.889345	2024-02-08 18:59:39.889345	\N	BENSONI	BERNARDI	MAKUA	0719161936	CFN6912	Male	BensonBernardi	Kitwango1998	densonbernardi@gmail.com	Mr.	IFAKARA HEALTH INSTITUTE	215	3	Individual	\N
195	2024-02-08 19:03:59.87252	2024-02-08 19:03:59.87252	\N	ROMANI	LIVING 	MINJA	0763120963	CFN3330	Male	Mr. Romani	iphc@2024	rminjar@gmail.com	Mr.	STATE UNIVERSITY OF ZANZIBAR 	215	2	Individual	\N
196	2024-02-08 19:04:24.113582	2024-02-08 19:04:24.113582	\N	JUSTINE 	GODSON 	MPONDA	0737 101 088 	CFN9071	Male	@Mponda	6$BnbZUjjH	just.mponda@gmail.com	Mr.	INSTITUTE OF SOCIAL WORK 	215	9	Individual	\N
197	2024-02-08 19:16:01.353774	2024-02-08 19:16:01.353774	\N	DEVISI	MARTINI	MAHUGULI	0672151539	CFN4077	Male	Amahuguli05	74AEWK6zzmhvp8m	devisimartine6@gmail.com	Mr.	MZUMBE UNIVERSITY	215	2	Individual	\N
198	2024-02-08 19:17:45.980396	2024-02-08 19:17:45.980396	\N	GREGORY	CHARLES	NDAKI	0768772292	CFN5623	Male	gregorycndaki@myyahoo.com	Gcn@2292	gregorycndaki@myyahoo.com	Mr.	KILOSA DISTRICT HOSPITAL 	215	6	Individual	\N
199	2024-02-08 19:22:52.556376	2024-02-08 19:22:52.556376	\N	ISAYA	DICKSON	MWAKALEBELA	0652251882	CFN6647	Male	Isaya	Isaya2561	isayadickson5@gmail.com	Dr.	ALSHIFA MEDICAL AND DIALYSIS CENTER	215	6	Individual	\N
200	2024-02-08 19:45:49.812785	2024-02-08 19:45:49.812785	\N	JACKLINE	DERECK	RWAKILOMBA	0685573582	CFN3317	Female	Jackie	Jackie2808	jackiedereck1@gmail.com	Ms	DUKE	215	6	Individual	\N
202	2024-02-08 20:11:39.74144	2024-02-08 20:11:39.74144	\N	EVARIST 	JOSEPH 	SHINJI 	+255749387000	CFN6113	Male	Ejest 	Ejest2312	joseph.evarist2@gmail.com	Dr.	HOMSO 	215	6	Individual	\N
203	2024-02-08 20:22:26.342581	2024-02-08 20:22:26.342581	\N	OWDEN	ASUNGWILE	KABUKA	0769090999	CFN9741	Male	OWDEN KABUKA	Nsajigwa1	owdenkabuka1@gmail.com	Dr.	THE MWALIMU NYERERE MEMORIAL ACADEMY	215	6	Individual	\N
204	2024-02-08 20:43:32.652725	2024-02-08 20:43:32.652725	\N	BARAKA	AGREY	MWAMBINGU 	0768358503	CFN3694	Male	Baraka	Barak@123	barakaagrey99@gmail.com	Mr.	AMANA RRH	215	6	Individual	\N
205	2024-02-08 21:19:27.545827	2024-02-08 21:19:27.545827	\N	PATRICK	JOSEPH	KUSHOKA	0747280808	CFN1435	Male	Kushoka2024	Kushoka6905	patrickkushoka970@gmail.com	Dr.	DODOMA CHRISTIAN MEDICAL CENTRE TRUST	215	6	Individual	\N
206	2024-02-08 21:20:21.809585	2024-02-08 21:20:21.809585	\N	ALLY	MASUDI 	CHIKAMBO 	0625710549	CFN8592	Male	Ally Masudi 	Chikambo@1999	allychikambo99@gmail.com	Mr.	TANZANIA MEDICAL LABORATORY STUDENTS ASSOCIATION 	215	2	Individual	\N
207	2024-02-08 21:26:16.755413	2024-02-08 21:26:16.755413	\N	FARAJA	THOMAS	MADADI	0625899128	CFN2131	Male	Dc Kiba	Kiba2931.	thomsfaraja@gmail.com	Mr.	NONE	215	3	Individual	\N
208	2024-02-08 21:34:49.092638	2024-02-08 21:34:49.092638	\N	CHARLES	MLINDA	MAKOYE	+255785897282	CFN8480	Male	black	sonofagnesMK@10	charleskilindilo@gmail.com	Dr.	SEKOTOURE HOSPITAL	215	\N	Booth	\N
209	2024-02-08 22:01:33.645954	2024-02-08 22:01:33.645954	\N	MICHAEL	LUFULONDAMA	MASASI	+255755076407	CFN4977	Male	masasimichaelesq@gmail.com	Madamundezu1.	masasimichaelesq@gmail.com	Dr.	TEMEKE MUNICIPAL COUNCIL	215	6	Individual	\N
210	2024-02-08 22:21:07.731957	2024-02-08 22:21:07.731957	\N	JOSEPH 	SENTOZI	BIRUSHA	+255755937945	CFN9272	Male	JohTechs	JohTechsElectronics223	josephbirusha03@gmail.com	Mr.	UDOM HEALTH CLUB	215	2	Individual	\N
211	2024-02-08 22:37:21.697577	2024-02-08 22:37:21.697577	\N	EDGAR	GEORGE	KASYANJO	+2556 2552 8950	CFN4601	Male	Edgar Kasyanjo	Wrongpassword98	edgarkasyanjo01@gmail.com	Mr.	DARE ORGANIZATION	215	6	Individual	\N
212	2024-02-08 22:43:39.138947	2024-02-08 22:43:39.138947	\N	FRANK 	WILIBARD 	SHAO	0744543786	CFN9527	Male	Frank wilibard Shao 	@Frankshao2	frankxhao@gmail.com	Mr.	ST FRANCIS UNIVERSITY COLLEGE OF HEALTH AND ALLIED SCIENCES 	215	2	Individual	\N
213	2024-02-08 22:45:22.281681	2024-02-08 22:45:22.281681	\N	OSCAR	JOSEPH	MASHIN	0763365951	CFN9062	Male	oscar	Poly321. 	oscarmashin@gmail.com	Mr.	KCMC	215	6	Individual	\N
216	2024-02-09 01:37:45.4074	2024-02-09 01:37:45.4074	\N	SYEDA	MAHAM	JAMAL	255685573638	CFN1223	Female	Mahamjamal123	Karachi1947	mahamjamal03@gmail.com	Ms	TANZANIA MEDICAL STUDENT’S ASSOCIATION	215	2	Individual	\N
217	2024-02-09 01:40:16.089598	2024-02-09 01:40:16.089598	\N	PENDO	JOHN 	CHAULA	+255768836392	CFN6102	Female	Chaulapendo 	Pendo16041984	chaulapendo@gmail.com	Dr.	DODOMA REGIONAL REFERRAL HOSPITAL 	215	6	Individual	\N
218	2024-02-09 01:54:07.971325	2024-02-09 01:54:07.971325	\N	MUSSA	AMIRI	MALOLO	0742426168	CFN1017	Male	mussamalolo@gmail.com	ZUHURA@3009abc	mussamalolo@gmail.com	Mr.	BENJAMIN MKAPA HOSPITAL	215	6	Individual	\N
219	2024-02-09 02:01:35.736301	2024-02-09 02:01:35.736301	\N	KUSAYA 	ATHANAS	SABO	0754344139	CFN6036	Male	alfredkusaya@gmail.com	Sabo@1990	alfredkusaya@gmail.com	Dr.	ILEMELA DISTRICT HOSPITAL 	215	6	Individual	\N
221	2024-02-09 02:06:11.084533	2024-02-09 02:06:11.084533	\N	JUDITH 	JOHN	BOSHE	0623685454 	CFN9420	Female	jboshe	26Tweety1986	jboshe@gmail.com	Dr.	KILIMANJARO CHRISTIAN MEDICAL CENTRE 	215	4	Individual	\N
224	2024-02-09 02:35:30.698533	2024-02-09 02:35:30.698533	\N	STEPHEN 	GABRIEL 	MBWAMBO	0752814803	CFN3150	Male	mbwambos	Eliza2020	mbwambo702@gmail.com	Mr.	MINISTRY OF HEALTH 	215	3	Individual	\N
225	2024-02-09 03:12:46.958076	2024-02-09 03:12:46.958076	\N	MWITA	NDOBO	MAGERE 	0674901581	CFN8508	Male	Kichuri	nyagino2001	magere610@gmail.com	Dr.	MANEROMANGO HC KISARAWE DC	215	6	Individual	\N
226	2024-02-09 03:34:10.264308	2024-02-09 03:34:10.264308	\N	STEVEN 	KASIM 	ATHUMANI 	0628091872	CFN9318	Male	STEVEN KASIM ATHUMANI 	Steve0177	stevenkasimathumani@gmail.com	Dr.	CITY COLLEGE OF HEALTH AND ALLIED SCIENCES (CCOHAS) MAIN CAMPUS DSM TEMEKE 	215	2	Individual	\N
228	2024-02-09 03:38:35.0994	2024-02-09 03:38:35.0994	\N	GABRIEL	AUGUSTINO	KITINUSA	0653521340	CFN1014	Male	drkitinusa@gmail.com	mwakapimba1	drkitinusa@gmail.com	Dr.	THE UNIVERSITY OF DODO	215	6	Individual	\N
229	2024-02-09 03:38:44.769325	2024-02-09 03:38:44.769325	\N	SAIIDI	MOHAMEDI	MWANAFUNO	0686639565	CFN2948	Male	SMWANAFUNO	Mwanafuno135	saidmohhamed9@gmail.com	Dr.	GOVERNMENT	215	6	Individual	\N
230	2024-02-09 03:49:12.862053	2024-02-09 03:49:12.862053	\N	EMMANUEL	WILLIAM	MCHEKA	0672524121	CFN7320	Male	MCHEKA.98%	Mcheka9898%	emmanuelmcheka1@gmail.com	Mr.	GFF	215	9	Individual	\N
231	2024-02-09 04:24:05.014295	2024-02-09 04:24:05.014295	\N	GEORGE	THOMAS	NSOKE	0762 199 151	CFN2577	Male	19920905111030000128	Ethanoate15@	georgensoke@gmail.com	Dr.	NGORONGORO CONSERVATION AREA AUTHORITY	215	6	Individual	\N
232	2024-02-09 04:37:55.693986	2024-02-09 04:37:55.693986	\N	JACQUELINE	ALLY	RUHUNDWA	0759125980	CFN8125	Female	Jruhundwa	XOxo95++	ruhundwajacqueline@gmail.com	Miss	FHI360	215	2	Individual	\N
233	2024-02-09 04:50:35.166303	2024-02-09 04:50:35.166303	\N	HAWA	KITAPILA	CHALONGITE	0718134426	CFN9775	Female	Ms.Hawa	hawaChalo77	hawac790@gmail.com	Miss	TAPSA	215	2	Individual	\N
234	2024-02-09 05:02:06.400338	2024-02-09 05:02:06.400338	\N	ANTHON	GEORGE	MWINGWA	0764153917	CFN9955	Male	anthonymwingwa@gmail.com	Felicity0807	anthonymwingwa@gmail.com	Dr.	KCMC	215	6	Individual	\N
235	2024-02-09 05:02:06.573371	2024-02-09 05:02:06.573371	\N	PROSPER	AUGUSTINE	KILEMWA	0712642686	CFN9403	Male	Prosperkilemwa	Popa23041993ihafa	prosperkilemwa@gmail.com	Dr.	MUSOMA REGIONAL REFERRAL HOSPITAL	215	2	Individual	\N
236	2024-02-09 05:02:56.282165	2024-02-09 05:02:56.282165	\N	AHMADI 	SELEMANI	AHMADI	+255755858913	CFN3462	Male	drzungu	Medical@2017	selemani283@gmail.com	Dr.	IRAMBA DISTRICT COUNCIL	215	6	Individual	\N
237	2024-02-09 05:07:59.09988	2024-02-09 05:07:59.09988	\N	EVERLYN 	JONATHAN 	KILIMBA 	+255755503357	CFN9737	Female	Everlyn 	Everlyn8	evykilimba@yahoi.com	Ms	SINGIDA RRH	215	6	Individual	\N
238	2024-02-09 05:10:23.355774	2024-02-09 05:10:23.355774	\N	ABDUL	DAVIS	MWASUMBI	+255763197716	CFN9720	Male	admwasumbi	Luqu20mani14	admwasumbi@gmail.com	Mr.	WANGING'OMBE DISTRICT COUNCIL 	215	6	Individual	\N
239	2024-02-09 05:17:19.079963	2024-02-09 05:17:19.079963	\N	EDWINE 	LEONIDASI	MWOMBEKI	+255653818422	CFN3681	Male	edwinmwombeki2020@gmail.com	Ed0788668273	edwinmwombeki2020@gmail.com	Mr.	UDOM	215	2	Individual	\N
240	2024-02-09 05:23:31.252059	2024-02-09 05:23:31.252059	\N	IDDA	LYATONGA	SWAI	+255783128049	CFN5852	Female	ilyatonga	IDDAlyatonga@1981	ilyatonga@mzumbe.ac.tz	Dr.	MZUMBE UNIVERSITY	215	4	Individual	\N
241	2024-02-09 05:30:37.841953	2024-02-09 05:30:37.841953	\N	PAUL 	MAUKI 	MAYOMBO 	0784836913 	CFN5477	Male	Mayombo 	Wawili2011	paulmayombo@gmail.com	Dr.	DED SENGEREMA 	215	6	Individual	\N
242	2024-02-09 05:34:18.904933	2024-02-09 05:34:18.904933	\N	CYRIALIS	ISHENGOMA	MUTABUZI	+255 754307768	CFN7873	Male	Cyrialis 	Ish3ngoma	mutabuzic@gmail.com	Dr.	DODOMA CHRISTIAN MEDICAL CENTRE TRUST	215	6	Individual	\N
243	2024-02-09 05:43:08.63915	2024-02-09 05:43:08.63915	\N	DICKSON	JOSHUA 	DANIEL	+255624617271	CFN7788	Male	Dickson123	Dc0624617271	wwwdicksond217@gmail.com	Mr.	KAMPALA INTERNATIONAL UNIVERSITY IN TANZANIA 	215	2	Individual	Dickson Daniel is a driven third-year Bachelor of Pharmacy student at Kampala International University in Tanzania. He is the visionary CEO and founder of Onco Intelligence, a startup dedicated to harnessing the power of artificial intelligence to address challenges in oncology. Dickson is not only a passionate advocate for cancer awareness but has also championed impactful initiatives for the past two years. His commitment extends to conducting case studies in pediatric cancer, showcasing his dedication to making a difference in the field of healthcare.
244	2024-02-09 05:51:50.993329	2024-02-09 05:51:50.993329	\N	EVARISTI 	AMEDEUSI 	KIMARO	0784271567	CFN1037	Male	Kimaro 	Queen@2018	kimaroevarist01@gmail.com	Mr.	MUSOMA DISTRICT COUNCIL HOSPITAL	215	6	Individual	Technologist II
245	2024-02-09 05:56:18.100123	2024-02-09 05:56:18.100123	\N	LUSAJO 	JOSEPHAT 	SWALO	0768393188	CFN6587	Male	19930105595140000228	4321Lusaj.	lusajoswallo@gmail.com	Mr.	MULEBA DISTRICT COUNCIL 	215	6	Individual	-I'm the community health worker by professional, and I'm working at KAIGARA HEALTH CENTER as HEALTH ASSISTANT \n
246	2024-02-09 05:59:19.731978	2024-02-09 05:59:19.731978	\N	SHADRACK	AHAZZ	FUTE	0759476805	CFN6930	Male	shadrack@05!	Fute@05!	shadrackfute07@gmail.com	Mr.	MBEYA ZONAL REFERRAL HOSPITAL	215	4	Individual	I prefer learning hope this will brings more positive result in my resercher journey.
247	2024-02-09 06:15:20.803203	2024-02-09 06:15:20.803203	\N	TEGEMEA	PATRICK	MWALINGO	0712223657	CFN8280	Female	tegemeagwantwa	Ndenukajubha2015%	patricktegemea@gmail.com	Dr.	UNIVERSITY OF DODOMA	215	4	Individual	I am a maternal and child health researcher focusing on exploring community and clinical solution to reduce maternal and neonatal mortalities and improve maternal and children wellbeing. I have done research work exploring the relationship between local community engagement practices, utilization of maternal and neonatal health services and maternal and neonatal health outcomes. I am also interested in preventing prematurity and improving the wellbeing of premature babies, human milk research and the role it plays in children wellbeing and global health research.
248	2024-02-09 06:16:31.548802	2024-02-09 06:16:31.548802	\N	MICHAEL	RUGAIGANISA	LAURIAN	+255676338599	CFN2026	Male	THE SKYWELL PHARMACY	SKYWELl2022	michaellaurian96@gmail.com	Mr.	THE SKYWELL PHARMACY	215	6	Individual	RETAIL PHARMACEUTICAL STORE IN Dar es Salaam, TANZANIA
249	2024-02-09 06:20:50.679911	2024-02-09 06:20:50.679911	\N	PAUL 	JOSEPHAT 	NJIGE	+255627289268	CFN2201	Male	Njige	@Em3paulo	paulnjige3@gmail.com	Mr.	MY MEDICS APP 	215	2	Individual	Pharmacy student at st John's university of Tanzania 
250	2024-02-09 06:20:52.396194	2024-02-09 06:20:52.396194	\N	JENIPHA	MAYOMBO	NGONYANI	0754998713	CFN5817	Female	Jen@mayombo	2011march	jenmayombo@yahoo.com	Dr.	MOROGORO MUNICIPAL COUNCEL	215	6	Individual	Attending Primary Health Care conference
251	2024-02-09 06:22:19.393905	2024-02-09 06:22:19.393905	\N	LALASHE	M	KIRETUN	+255742967565	CFN3115	Male	KIRETUN	Maina@01083	lalashemelusuri@gmail.vom	Mr.	The University of Dodoma	215	9	Individual	I am currently employed with the University of Dodoma as the Global Fund ANC-PNC Project Coordinator.
227	2024-02-09 03:35:26.635222	2024-02-09 03:35:26.635222	\N	SAMSON	SAMWEL	NYANDA	0687040900	CFN6772	Male	samnyanda	Nyanda101	samsonnyanda@gmail.com	Dr.	SINGIDA MUNICIPAL COUNCIL	215	2	Individual	\N
252	2024-02-09 06:23:57.191957	2024-02-09 06:23:57.191957	\N	H	GENE	PEUSE	746700827	CFN4274	Male	gpeuse	HapaTanzania1	gpeuse@usaid.gov	Dr.	USAID	215	9	Individual	USAID is a donor
253	2024-02-09 06:25:33.905046	2024-02-09 06:25:33.905046	\N	FRIDA	FOCUS	MATAWA	0762831189	CFN4869	Female	Frida	Mamaibra24	frida.focus@gmail.com	Miss	KCCO	215	6	Individual	Project coordinator in eye health promotion activities especially cataract disease.
254	2024-02-09 06:57:13.626866	2024-02-09 06:57:13.626866	\N	ELIUD	MAXIMILLIAN	NFURAH	0672726936	CFN2384	Male	Eliud	Tanzania1333$%	eliudmax7@gmail.com	Mr.	AZAMPAY	215	6	Individual	Ready to attend. 
255	2024-02-09 06:58:25.945112	2024-02-09 06:58:25.945112	\N	NELSON	MANDELA	STEPHEN	0747793023	CFN9091	Male	Nelsonsteven	Urit3020	nelsonsteven136@gmail.com	Mr.	MOROGORO URBAN AREA	215	6	Individual	Attendance for the conference 
256	2024-02-09 07:01:55.277024	2024-02-09 07:01:55.277024	\N	ITUMBI 	JOSEPH 	ITUMBI 	+255754388291	CFN6075	Male	JOITUMBI	Jose2000	josephitumbi2@gmail.com	Mr.	YOUTH OF UNITED NATIONS ASSOCIATION UDOM CHAPTER 	215	2	Individual	Am working with a youth organisation basically we are dealing with the 17 sustainable development goals as goal number 3- good health and well being is one of our implementated goal in our organisation it's my hope that if I will attend the conference it will add value to my organisation at large 
257	2024-02-09 07:04:31.618139	2024-02-09 07:04:31.618139	\N	CONRAD	APPOLINARY 	MAKATU	0786382880	CFN9317	Male	cmakatu	Ilazo@2023	conrad.makatu@nhif.or.tz	Dr.	NATIONAL HEALTH INSURANCE FUND-NHIF	215	6	Individual	I am Paediatrician, working at NHIF
258	2024-02-09 07:10:26.026922	2024-02-09 07:10:26.026922	\N	DANIEL 	ABIHUDI	SAIDEYA	0628710546/0754942624	CFN2790	Male	Daniel A. Saideya	Qwert12345	dannysaideya@gmail.com	Mr.	TAMSA	215	2	Individual	I am a third year medical student, at the university of Dodoma. Secondly I am a research enhusiast, further more I am commited to ensuring all people have access to promotive, preventive, curative, and rehabilitative health services of quality, when and where they need them, without financial difficulties through research and innovation. Last but not least I am looking foward to be apart of the internatonal primary health care conference on march 2024.
259	2024-02-09 07:27:48.778878	2024-02-09 07:27:48.778878	\N	EMMANUEL 	ARTHUR 	MFUNDO 	0718481954	CFN3783	Male	MacArthur 	Arthur@1	macarthur861@gmail.com	Mr.	NATIONAL HEALTH INSURANCE FUND 	215	6	Individual	Register 
260	2024-02-09 07:49:37.697366	2024-02-09 07:49:37.697366	\N	JOSEPHINE	SOSPETER 	KABULULU	0767505912	CFN8785	Female	jkabululu	Jsk@2811	jkabululu5@gmail.com	Ms	KISIKI HC	214	6	Individual	To attend meeting
261	2024-02-09 08:07:51.843787	2024-02-09 08:07:51.843787	\N	SAID	SELEMAN	KAMBI	0752899653	CFN1701	Male	said.kambi@singidadc.go.tz	saidkambi	saidkambi48@gmail.com	Mr.	KINYAGIGI 	215	6	Individual	Nill
262	2024-02-09 08:08:32.037756	2024-02-09 08:08:32.037756	\N	AMOS 	MASALU	BUSUNZU	0678770161	CFN3809	Male	Amos	A1524!mashimba	amoze1524@gmail.com	Mr.	KILIMANJARO CHRISTIAN MEDICAL COLLEGE UNIVWRSTY	215	2	Individual	Am a medical student who is highly interested in clinical research
263	2024-02-09 08:37:21.969424	2024-02-09 08:37:21.969424	\N	DAVID	SHUKRANI	WILFRED	+255624175409	CFN9110	Male	dswilfred	David1996	dswilfred20@gmail.com	Mr.	TANZANIA MEDICAL STUDENTS’ ASSO (TAMSA)	215	2	Individual	David Shukrani Wilfred is a medical student and the chairperson of Tanzania Medical Students’ Association at Muhimbili University of health and Allied Sciences (TAMSA-MUHAS), enthusiastic youth in promoting public health by primarily engaging community in addressing major health problems. He has taken part in community outreaches to promote awareness and address various health issues as well as conferences. Taking part in this International Primary Health care conference will be a golden opportunity to understand how can we take part as medical students in enhancing the efficient of primary towards reaching Universal Health Coverage(UHC).
264	2024-02-09 09:01:42.778377	2024-02-09 09:01:42.778377	\N	ENOCK 	BULIMA 	PHILIBERT 	0748600177	CFN7357	Male	bulimasayaka 	Bulima@58	enockphilibet7@gmail.com	Dr.	MUHIMBILI UNIVERSITY OF HEALTH AND ALLIED SCIENCE (MUHAS)	215	2	Individual	I'm ready to attend the conference discussing the universal health coverage in Tanzania. Confidently this is going to be a great achievement of ministry of health and the nation in general
265	2024-02-09 09:08:07.723904	2024-02-09 09:08:07.723904	\N	JOYCE	JOHN	LYIMO	+255754 287373 	CFN3959	Female	joyjohn	onejoy26	joycelyimo26@gmail.com	Ms	KINONDONI MUNICIPAL	215	\N	Booth	Kinondoni CHMT
266	2024-02-09 09:09:05.387362	2024-02-09 09:09:05.387362	\N	EDITH	SHOSE	MLAY	0767179290	CFN5421	Female	emlay	Love@me2	edithmlay666@gmail.com	Dr.	NATIONAL HEALTH INSURANCE FUND 	215	6	Individual	Physician working at National Health Insurance Fund
267	2024-02-09 09:23:45.179608	2024-02-09 09:23:45.179608	\N	JAYNES	FREDINAND 	KABUHAYA 	+255755876320	CFN4015	Female	Jaynes Fredinand 	jAynes@2001	jayneskabuhaya@gmail.com	Ms	KILIMANJARO CHRISTIAN MEDICAL UNIVERSITY COLLEGE (KCMUCO)	215	2	Individual	I am a medical student in third year year. An opportunity to attend this conference will enable me to learn alot concerning my carrier so as to be a good doctor as I usually wishes. This opportunity will also enable me to come across many other students and medical professionals to whom I will get to learn and share alot which will increase my awareness and experience in medicine.
144	2024-02-08 07:17:42.271607	2024-02-08 07:17:42.271607	\N	BENTON	ONESMO	MBWALE	0678851852	CFN2482	Male	Benton	Bagamoyo23	bentononesmo05@gmail.com	Dr.	NONE	215	6	Individual	\N
268	2024-02-09 10:02:35.6098	2024-02-09 10:02:35.6098	\N	AGATHA	ANTHONY	NSHIMBE	0694210116	CFN2546	Female	Agatha Anthony	dodoma1234	agathaanthony007@icloud.com	Ms	PHARMA AFRICA	215	6	Individual	I am founder and executive director of pharmaafrica organization. As an organization we work to support the government on health care education, health and drug research and drug shortage .as a professional organization and youth we are interested to be a part of this conferences to learn and also connect in building better health.
269	2024-02-09 10:11:43.279089	2024-02-09 10:11:43.279089	\N	HADIJA	IDRISA	MARISA	0789021449	CFN4126	Female	Hadija	1234Abcd	luluidrisahadija@gmail.com	Miss	NZEGA DC	215	7	Individual	Social welfare office NZEGA DC
270	2024-02-09 10:29:53.076515	2024-02-09 10:29:53.076515	\N	EDWICK 	GAMANYA 	MAPALALA 	0787260971	CFN7268	Female	edwick.Mapalala 	Mapa2lala	edwick.mapalala@repssi.org	Ms	REGIONAL PSYCHOSOCIAL SUPPORT INITIATIVE	215	7	Individual	NGO 
271	2024-02-09 10:57:43.26187	2024-02-09 10:57:43.26187	\N	MAHFUDHI	AHMAD	SAID	0744847711	CFN9527	Male	Mahfudhi	9919Mahfudhi	mahfudhiahmad3@gmail.com	Mr.	MUHAS	215	2	Individual	Promoting of health among the people for disease prevention 
272	2024-02-09 11:33:17.290715	2024-02-09 11:33:17.290715	\N	GODFREY	JOHN	ANDREW	0757975720	CFN1503	Male	Dr. Godfrey Andrew 	AND19rew74	andrewgodfrey19@gmail.com	Dr.	LUSHOTO DC	215	9	Individual	Kushiriki kikao 
273	2024-02-09 11:41:32.892904	2024-02-09 11:41:32.892904	\N	MARY 	S	MAKALA	0758222270	CFN6883	Female	mushimary69	Mushi 6969	mushimary69@gmail.com	Dr.	GOVERNMENT	215	\N	Individual	Clinician
274	2024-02-09 11:46:27.364534	2024-02-09 11:46:27.364534	\N	RICHARD	DONALD	KATANJI	+255625523365	CFN2608	Male	Richkatanji	Rich@katanji07	richkatanji@gmail.com	Mr.	MAWENZI REGIONAL REFERRAL HOSPITAL 	215	6	Individual	Bachelor of Science in Nursing graduated from The University of Dodoma, 2018-2022.\nFormer member of Udom Health Club.\nFormer intern nurse officer in Mawenzi Regional Referral Hospital.\nRegistered Nurse Officer with License Number 67777.\nYoung beginner in Nursing Research.\nHealth promotion activist.\n
275	2024-02-09 11:49:42.102176	2024-02-09 11:49:42.102176	\N	TUMAINI	KITEGA 	WARYOBA	0763778849	CFN1283	Male	Waryoba 	5566Tumaini	tumainiwaryoba@yahoo.com	Mr.	ORGANIZATION FOR MEDICAL OUTREACH TO COMMUNITIES	215	6	Individual	Am medical Laboratory Scientist, Hepatitis advocator.
276	2024-02-09 12:38:32.907508	2024-02-09 12:38:32.907508	\N	ISACK	ENOCK	NYAIMAGA	+255754391594	CFN4500	Male	nyaimagaisack	Trevor2341	isackenocknyaimaga@gmail.com	Mr.	SOUTHERN AFRICA YOUTH FORUM (SAYOF-SADC)	215	6	Individual	primary health care is a pivotal area in the health sector and through this conference we hope to deliberate more on how best are we going to determine sustainable primary health care services that will lead to achievement of Sustainable goals as a country.\nLooking forward to commit and contribute to agendas set for the forum.
298	2024-02-09 16:12:02.071755	2024-02-09 16:12:02.071755	\N	VENANCE 	VEDASTO	MGAIGA	0764477880	CFN4201	Male	Dr. V. MGAIGA	Eliesh2017	venancemgaiga6@gmail.com	Dr.	CHAMWINO DC	215	6	Individual	I'm ready for the meeting 
220	2024-02-09 02:05:46.886393	2024-02-09 02:05:46.886393	\N	JUDITH	EMIL	MSHANA	0783 878428 	CFN2529	Female	Judith20	Judith20	mshanajudith20@gmail.com	Dr.	MUHIMBILI NATIONAL HOSPITAL	215	6	Individual	Medical officer at muhimbili national hospital
277	2024-02-09 13:20:35.437792	2024-02-09 13:20:35.437792	\N	ASA	JACOB	NCHIMBI	0713845818	CFN6060	Male	Nchimbie	kinG1712	nchimbiasa@gmail.com	Dr.	ONA EYECARE	215	6	Individual	1.Diagnosis and managment of refractive error and ocular diseases\n2.performing all workshop duties including fitting of spectacles\n3.managment of organisation\n
282	2024-02-09 13:58:33.17322	2024-02-09 13:58:33.17322	\N	SOPHIA	ROGASIAN 	TAIRO	0754572130	CFN3728	Female	Flaviana	FLaviana13#	tairosophia7@gmail.com	Ms	DODOMA RRH	215	6	Individual	I want to attend the conference to improve my capabilities
283	2024-02-09 14:03:19.947522	2024-02-09 14:03:19.947522	\N	GRACE	ALOYCE	MINJA	0766516168	CFN3298	Female	Gracealoyce	G@1988be	graceloloduo@mail.com	Ms	KAMBI YA SIMBA HEALTH CENTER	215	6	Individual	Medical doctor, interested in Enhancing community awareness on importance of hospital delivery. 
284	2024-02-09 14:50:11.040629	2024-02-09 14:50:11.040629	\N	ATUKUZWE	MORDECAI	GWIHANGWE	0764494606	CFN5271	Male	Mordecai	September2022	gmordecai@ymail.com	Mr.	ONE ALLIED TANZANIA	215	6	Individual	I am a director of the medical consultancy company in Tanzania
287	2024-02-09 15:28:51.903703	2024-02-09 15:28:51.903703	\N	IBRAHIMU	RICHARD	MAKONGWA	+255756409920	CFN1737	Male	Ibrahimu 	Makongwa1	makongwa87@gmail.com	Dr.	AMANA REGIONAL REFERRAL HOSPITAL 	215	6	Individual	Focusing in Primary Health care is a way to go,this is practical translation of SDG 3
288	2024-02-09 15:30:46.7132	2024-02-09 15:30:46.7132	\N	KIMBURU	KAKA	MKELIA	0767239710	CFN5492	Male	Palimu	Jhd,184.	limbu1@gmail.com	Mr.	KEKO	29	2	Individual	To gain knowledge on health care 
289	2024-02-09 15:33:51.866408	2024-02-09 15:33:51.866408	\N	JUHUDI	AUGUSTINO	MLIMAKIFI	0628864263	CFN5713	Male	Juhudi	Jhd,184.	mlimakifijuhudi@gmail.com	Mr.	MUHAS 	215	2	Individual	To gain knowledge on Health aspect related to public health at whole 
291	2024-02-09 15:53:35.788167	2024-02-09 15:53:35.788167	\N	GEMA	PAUL	SALIA	+255713132747	CFN1284	Female	Salia	Salia99@gema	saliagemma99@gmail.com	Miss	MUHIMBILI UNIVERSITY OF HEALTH AND ALLIED SCIENCES 	215	2	Individual	Student at Muhimbili University of Health and Allied Sciences studying doctor of medicine fifth year interested in public heath and primary heath care forums 
292	2024-02-09 15:53:55.654983	2024-02-09 15:53:55.654983	\N	EDGAR	MOFAT	SIMFUKWE	+255747956270	CFN1910	Male	Simfukwe	Hexane1217$	edgarcmfukwe@gmail.com	Mr.	BENJAMIN MKAPA HOSPITAL	215	6	Individual	Pharmacist
293	2024-02-09 15:54:08.665644	2024-02-09 15:54:08.665644	\N	PAULINO	HILOLIMUS	MLOWE	0762339499	CFN5145	Male	paulino	Mlowe2022!	paulinomlowe859@gmail.com	Mr.	GENESIS HOSP	215	6	Individual	I am lab technician
294	2024-02-09 16:01:53.609558	2024-02-09 16:01:53.609558	\N	ELIHU	SAGENGE	BUZUKA	0743348594	CFN9486	Male	Elihu9991	Elihu9991	elihubuzuka@gmail.com	Dr.	PRIVATE	215	6	Individual	Nothing lives forever yet life continues
295	2024-02-09 16:04:11.941612	2024-02-09 16:04:11.941612	\N	RASHID 	MUSSA	MDAKI	078206882	CFN1145	Male	Mdakizo	Mdakizo1996	mdakizo96@gmail.com	Dr.	MUHAS 	215	2	Individual	Medical student passionate in public health 
296	2024-02-09 16:04:53.137655	2024-02-09 16:04:53.137655	\N	NEEMA	JOSEPH	MKWEJI	+255784592214	CFN8481	Female	neema mkweji	Geovanni3112	mkwejineema@yahoo.com	Dr.	LOCAL GOVERNMENT TRAINING INSTITUTE	215	6	Individual	I prefer to attend the conference so as to  improve my knowledge on primary health care and universal health care in general 
290	2024-02-09 15:52:18.202648	2024-02-09 15:52:18.202648	\N	NICHOLAUS	GILBERTY 	NYEMBA 	0742783929	CFN7307	Male	THERAPISTNYEMBA	Ubuntugn100	nicholausyg@gmail.com	Mr.	ILALA DISTRICT HOSPITAL-KIVULE	215	6	Individual	Hospital Improvements Focal
299	2024-02-09 16:22:28.572725	2024-02-09 16:22:28.572725	\N	MAJANI	M	EDWARD	0620557757	CFN5231	Male	Majani 	Edward@2020	majanimedward@gmail.com	Dr.	ST.FRANCIS UNIVERSITY COLLEGE OF HEALTH AND ALLIED SCIENCES	215	2	Individual	I am a fourth year medical student at St. Francis University College of Health and Allied Sciences with an interest with public health research 
300	2024-02-09 16:24:50.962528	2024-02-09 16:24:50.962528	\N	PETRO 	MAIKO	NASIBU 	0628817553	CFN2675	Male	Mahungilo 	Mahungilo914	petronasibu914@gmail.com	Dr.	GOVERNMENT 	215	6	Individual	I'm Petro Nasibu 30yrs old male doctor by professional,  I employed by my government.
301	2024-02-09 16:28:04.712598	2024-02-09 16:28:04.712598	\N	GIDION	ANDREW	MWAKALESI	0783552882	CFN6557	Male	gidionandrew721@gmail.com	gidion_721	gidionandrew721@gmail.com	Mr.	AGA KHAN HOSPITAL, DAR ES SALAAM	215	2	Individual	Gidion Andrew Mwakalesi, is an Intern Nurse at Aga Khan Hospital, Dar Es Salaam, Graduated BSc Nursing recently at Muhimbili University of Health and Allied Science (MUHAS)\nInterested in healthcare research and innovation and working on my new innovation on digital health care delivery to the community.
302	2024-02-09 16:29:19.127163	2024-02-09 16:29:19.127163	\N	FARAJI	ABRAHAMANI	HASANI	0627700628	CFN9218	Male	Raji	Raji7923	faraji7923@gmail.com	Mr.	MUHIMBI UNIVERSITY OF HEALTH AND ALLIED SCIENCEM	215	2	Individual	Am a bachelor nursing student at MUHAS Tanzania I would like to join this conference so as to learn more about health services in Tanzania 
303	2024-02-09 16:32:08.317527	2024-02-09 16:32:08.317527	\N	WOLTER	LENGAI	MALLYA	0766224929	CFN9252	Male	waltermallya354@gmail.com	Mallya@1958	waltermallya354@gmail.com	Mr.	TEACHER	215	9	Individual	Nimependa kujiunga nanyi
304	2024-02-09 16:38:43.243114	2024-02-09 16:38:43.243114	\N	ISMAIL	MOHAMED	MTITU	+255715712747	CFN3136	Male	mtitu	Mtitu0175712747	mtiturwambo@gmail.com	Dr.	MINISTRY OF HEALTH-  TANZANIA	215	5	Individual	I am medical doctor specialist in internal medicine and public health specialist working with the Ministry of Health -Tanzania, currently am working at directorate of reproductive maternal and child health (DRMNCH).
305	2024-02-09 16:55:12.017921	2024-02-09 16:55:12.017921	\N	NICKSON 	AUDAX 	RWEYEMAMU 	+255765450520	CFN8831	Male	Nickson Audax Rweyemamu 	2293Nick*	nicksonaudax461@gmail.com	Mr.	MYCN	215	3	Individual	Non
306	2024-02-09 16:57:25.531193	2024-02-09 16:57:25.531193	\N	FREDRICK 	HENRY 	MOSHI 	0784845262	CFN4409	Male	Dr.Moshi	Medi@cine0	dmo@mbeyadc.go.tz	Dr.	LGA	215	6	Individual	District Medical Officer at Mbeya district Council.\n
307	2024-02-09 16:57:33.418731	2024-02-09 16:57:33.418731	\N	INNOCENT	ANTHONY	MORABU	0656880184	CFN4105	Male	Innocent	25May1995	innocentanthony255@gmail.com	Mr.	CUHAS BUGANDO	215	2	Individual	Passionate about public health 
308	2024-02-09 16:58:12.256264	2024-02-09 16:58:12.256264	\N	ISSA 	MOHAMED 	MBANDE 	0784985240	CFN1096	Male	Mbande	Issa1234	mbandeissa120@gmail.com	Mr.	UNIVERSITY OF DODOMA 	215	2	Individual	Gain experience of primary health care as candidate of Master of science in public health second Year.
309	2024-02-09 17:08:03.177969	2024-02-09 17:08:03.177969	\N	AZIZI	AZIZI	MAULANA	0758726451	CFN5717	Male	2020-04-14140 	Njombe2020	azizimaulana@gmail.com	Mr.	MUHIMBILI UNIVERSITY OF HEALTH AND ALLIED SCIENCES 	215	2	Individual	I expect to attend so that to learn from Expertisees 
311	2024-02-09 17:21:38.965619	2024-02-09 17:21:38.965619	\N	RICHARD	CHRISTOPHER	NGAJA	0652776685	CFN1803	Male	ngaja	cHRIS21*	richngaja@gmail.com	Mr.	ST. ELIZABETH HOSPITAL ARUSHA	215	9	Individual	HEALTH SECRETARY
312	2024-02-09 17:29:34.351574	2024-02-09 17:29:34.351574	\N	SHAKILA	BASHIRU	MAJURA	+255674274424	CFN4950	Female	19951017121130000218	MAJUra2015	shakila.majura@icloud.com	Miss	MUHAS	215	6	Individual	The upcoming International Primary Health Care Conference brings together experts, practitioners, and policymakers from around the globe to discuss innovations, challenges, and best practices in primary health care delivery. Attendees can expect engaging presentations, workshops, and networking opportunities focused on advancing equitable, accessible, and sustainable primary health care systems for all. 
313	2024-02-09 17:33:58.161337	2024-02-09 17:33:58.161337	\N	COSTANSIA	SAMWEL	LISSU	0673051631	CFN7342	Female	Costalissu	@costalissu2000#com	costalissu@gmail.com	Ms	MUHIMBILI UNIVERSITY OF HEALTH AND ALLIED SCIENCES	215	2	Individual	I am a forth year nursing student at Muhimbili University of Health and Allied Sciences focused and well passionate in caring patients and alleviating their suffering. Very much ambitious in promoting health care at primary level and community so as to prevent the occurrence of disease and hence reducing cost of community members due to disease conditions 
314	2024-02-09 17:36:30.670952	2024-02-09 17:36:30.670952	\N	MBALU	SAKA	MADUHU	0682706308	CFN6220	Female	Mbalu	1234567M	mbalusaka@gmail.com	Dr.	USHETU DH	215	6	Individual	Registration for attending internationameeting
315	2024-02-09 17:53:54.220206	2024-02-09 17:53:54.220206	\N	CAROLINE 	SITA	LINJA	0787952344	CFN7725	Female	Clinja	Carolyn21@	carolinelinja21@gmail.com	Lady.	MGORI H/C	215	6	Individual	Caroline Sita Linja RN,BScN,MSc MW
316	2024-02-09 18:07:55.834351	2024-02-09 18:07:55.834351	\N	HOSEA	JOSEPH	SEPEKU	0682834599	CFN3140	Male	hoseahsepeku@gmail.com 	TUnapendana@96	hoseahsepeku@gmail.com	Dr.	MVUMI HOSPITAL	215	6	Individual	My name is hosea sepekub,I am current working at mvumi Hospital i desperate to attend this conference so I can learn new ideas
317	2024-02-09 18:25:59.802037	2024-02-09 18:25:59.802037	\N	SWALIHINA	JABIRI	WAZIRI	0672383290	CFN2986	Male	Swalihina Waziri 	Wazirijabiri2024	waziriswalihina@gmail.com	Mr.	MINISTRY OF HEALTH	215	6	Individual	Environmental health practitioner conducting an internship program under Ministry of Health in Tanzania 
318	2024-02-09 18:41:50.44924	2024-02-09 18:41:50.44924	\N	EDSON 	GABRIELY	KANEKU	+255622977240	CFN2318	Male	edsonkaneku@yahoo.com	Kaneku123@	edsonkaneku@gmail.com	Mr.	HERI ADVENTIST HOSPITAL 	215	6	Individual	Health Manager 
321	2024-02-09 19:08:40.476968	2024-02-09 19:08:40.476968	\N	MASOUD	ALLY	DONGWALA	0714635803	CFN7253	Male	Masoud	Iphc@2024	drmasoud05@gmail.com	Mr.	SIKONGE DISTRICT COUNCIL	215	6	Individual	Masoud Ally is a Health care Proffesional working under Ministry of Health Social welfare and Nutrition at Sikonge district Council since 2015.Am delightly to be happy if i will be among of the Deligates to attend this Meeting so as to increase knowledge and awareness concerning  improving Primary Health care services within the Country
322	2024-02-09 19:37:44.63583	2024-02-09 19:37:44.63583	\N	JUMA	JUMA	ADINAN	+255755552959	CFN7706	Male	Adinan	Conference#1	adinanjuma@gmail.com	Dr.	EAST CENTRAL AND SOUTHERN AFRICA HEALTH COMMUNITY	215	4	Individual	Health System Strengthening | Non-Communicable Disease | Strategic partnership | Public Health Emergencies | Outbreak Investigations | Monitoring & Evaluation
323	2024-02-09 19:42:08.106362	2024-02-09 19:42:08.106362	\N	YEKONIA 	LUKA 	MLOWE 	0673141731	CFN1111	Male	Yekonia	Yekomlowe98	yekoniamlowe98@gmail.com	Mr.	MOUNT MERU REGIONAL REFERRAL HOSPITAL 	215	6	Individual	It's my pleasure to attend this conference and here and even contribute on matter concern community health. 
350	2024-02-10 18:39:25.531893	2024-02-10 18:39:25.531893	\N	DESIRÉ	DAMIAN	RUHINDA	0717236767	CFN6133	Male	Medikea	Medikeahealth2024	desire@medikea.co.tz	Dr.	MEDIKEA 	215	\N	Booth	Inquiring pricing for booth
327	2024-02-09 19:54:40.992344	2024-02-09 19:54:40.992344	\N	YEKONIA	LUKA 	MLOWE 	0743141731	CFN9378	Male	Cryptoyeko	Yekomlowe98	cryptoyeko98@gmail.com	Mr.	MOUNT MERU REGIONAL REFERRAL HOSPITAL 	215	2	Individual	I am Yekonia Mlowe\nA intern Nurse at Mount Meru Regional Referral Hospital, with a bachelor's of science in nursing. Much interested in research digital health and devoted to work and save peoples life by solving different health problem including non Communicable Disease challenge to the community. \nI worked as a volunteer during my schooling and even in my internship to provide awareness to the community on non Communicable Disease like Cancer with Onco Intelligence Community, and all others with University Nursing students association of Tanzania at the University of Dodoma and all over the country. \nCommunity Program has been part of my interest as they hold a real definition of savings the community to attain good health.\nToward achieving universal health coverage, community initiative will help and even make this possible.\nI will be happy to attend this conference to listen and share.
328	2024-02-09 21:01:35.978704	2024-02-09 21:01:35.978704	\N	AIDATH 	ISMAIL 	ISHULULA 	+255694103145	CFN4632	Female	Aidath 	14072002Ai	aidathismail@gmail.com	Miss	UNIVERSITY OF DODOMA 	215	2	Individual	Am the university student of bachelor degree in Biology. I'm so excited to participate in this conference so as to learn some objective made towards public health as the one of upcoming scientist 
329	2024-02-09 21:20:40.362846	2024-02-09 21:20:40.362846	\N	KENETH	LUDOVICK 	MLINDA	+255762225822	CFN1539	Male	Dr Keneth 	Nsimba0137	kennethmlinda@protonmail.com	Dr.	MBEYA DC	215	6	Individual	Futuring the future health care improvement 
330	2024-02-09 21:34:38.413804	2024-02-09 21:34:38.413804	\N	ESTOM 	DAUDI	UVAMBE 	0757614369	CFN2177	Male	ESTOM 	Estom123	estomuvambetmsic@gmail.com	Mr.	MUHAS 	215	2	Individual	I will attend 
331	2024-02-10 00:57:17.709019	2024-02-10 00:57:17.709019	\N	JOSEPH	V.	KAYINGA	0756003880	CFN1159	Male	KAYINGA	UstawiBora2024	kayingaj@gmail.com	Mr.	HEALTH AND EDUCATION AT RISK ORGANIZATION	215	7	Individual	As a Country representative of Social Workers globally I hope to contribute on the role and contribution of social workers and welfare officers assigned duty stations and to compare with best practices available
332	2024-02-10 04:57:36.05278	2024-02-10 04:57:36.05278	\N	MUKIZA	MWEBEMBEZI	NGEMERA	0713312377	CFN7111	Male	mngemera	1969@NOYb	mngemera@ymail.com	Dr.	KAIRUKI HOSPITAL	215	6	Individual	Medical specialist - Physician\nFellow - Nephrology
333	2024-02-10 05:14:19.335494	2024-02-10 05:14:19.335494	\N	PROTASE	BYAMUNGU	BARAKA	0767948184	CFN8616	Male	Protase	Byamungu100	protasebaracka@gmail.com	Mr.	THE UNIVERSITY OF DODOMA	215	2	Individual	To attend the conference
334	2024-02-10 06:34:37.122469	2024-02-10 06:34:37.122469	\N	SAIDA	AHMED 	MURUGWA 	0743605779	CFN5290	Female	MURUGWA 	Mas123456789	eyl0@cdc.gov	Miss	CDC	215	6	Individual	Public health specialist supporting global health security-emerging and re-emerging infections
335	2024-02-10 08:37:45.709048	2024-02-10 08:37:45.709048	\N	POLYCARP	PETER 	MALLYA	0652504523	CFN6673	Male	Polycarp mallya	Babanamama225	polycarppeter28@gmail.com	Mr.	AMPLIFY GLOBAL INSTITUTES TANZANIA	215	3	Individual	I can’t wait to get involved 
336	2024-02-10 08:54:35.736933	2024-02-10 08:54:35.736933	\N	EDWIN	PONCEOUS	KACHENJE	0788991623	CFN3562	Male	Kachenje Edwin	Triumph01	kachenjejr@gmail.com	Mr.	TAMSA 	215	2	Individual	A student interested in research
337	2024-02-10 09:57:34.129027	2024-02-10 09:57:34.129027	\N	EXPERY 	MATHIAS 	MASSAWE	0757903044	CFN1017	Male	expery 	Monica12345@	massawe94expery@gmail.com	Mr.	UNIVERSITY OF DAR ES SALAAM	215	2	Individual	My area of research is in Universal Health Coverage. I would like to attend this conference as a PhD student so as to learn more about Universal Health Coverage.
338	2024-02-10 09:58:10.539486	2024-02-10 09:58:10.539486	\N	DEARDONE 	RAYMONDI	WILLIAM 	0752564603	CFN1205	Male	Deardone William 	2020Nurse	deardoneraymondi@gmail.com	Mr.	ST JOHN'S UNIVERSITY OF TANZANIA 	215	2	Individual	Am a forth year student at St John's university of Tanzania persuing bachelor of science in nursing.\nI wish to be involved in this conference so that I can share my views and gain the insight from other professionals about primary health care,for the gain of the community and improvement of both at individual and community levels.\nMy plan is if I gain the chance I wish to present article about "how treatment of family as a primary unit of community health will lead to improved community health care".\nThrough the study I have performed within my local residence and comprised references to the Tanzania societies.\nThanks 
339	2024-02-10 10:41:23.52828	2024-02-10 10:41:23.52828	\N	SHAIBU	HAJI	HAMADI	0713875888	CFN5438	Male	Shaibu	Tajiri24	shaibuhamadi02@gmail.com	Mr.	MWALIMU JULIUS K. NYERERE UNIVERSITY OF AGRICULTURE AND TECHNOLOGY	215	6	Individual	Registration:\n1st International Primary Health Care Conference in Tanzania 
340	2024-02-10 12:05:53.303396	2024-02-10 12:05:53.303396	\N	RAYMOND 	MAGEMBE 	REVOCATUS 	+25564849979	CFN3972	Male	raymondorevocatus5@gmail.com	1235789R@y	raymondorevocatus5@gmail.com	Mr.	CHIWERERE DISPENSARY 	215	6	Individual	Universal health care coverage 
341	2024-02-10 12:46:31.865149	2024-02-10 12:46:31.865149	\N	JAMAL	YUSUF	ABDULKARIM	0764676911	CFN9753	Male	Drjamal	06051995Jamal	drjamalya@gmail.com	Dr.	NYASA DC	215	6	Individual	Government health personel
342	2024-02-10 13:11:02.944131	2024-02-10 13:11:02.944131	\N	ELISHA 	D	MOLLEL	0687292742	CFN1152	Male	Elisha Mollel	Elisha2121	elishamollel132@gmail.com	Mr.	MUHAS	215	2	Individual	Am a student from Muhimbili university of health and allied sciences (MUHAS)\nI wish to attend there 
285	2024-02-09 15:24:50.760091	2024-02-09 15:24:50.760091	\N	JACKSON	WARYOBA	JOHN	0657462005	CFN8334	Male	Jacksonjohn	Jackson0301	doctorjacksonjohn0301@gmail.com	Dr.	NONE	215	2	Individual	currently involving in community education on NCD, wishing to be part of the conference.
343	2024-02-10 15:08:06.111994	2024-02-10 15:08:06.111994	\N	AVIN	PETER	NJOKI	0764090013	CFN7103	Male	Avin	Jackson@1994Bukabuye	avinpeter1994@gmail.com	Mr.	TANGA COLLEGE OF HEALTH AND ALLIED SCIENCES	215	6	Individual	Primary Health Care is a pivotal approach to achieve Universal Health Coverage
344	2024-02-10 16:24:19.474678	2024-02-10 16:24:19.474678	\N	JOYCE	SEBASTIAN	MOSHA	0763885431	CFN4506	Female	Mosha	0763Joy88	joycemosha37@gmail.com	Miss	MTMERU REGIONAL REFERRAL HOSPITAL 	215	2	Individual	Am intern lab scientist I wish to attend this meeting inorder to improve my carrier through other people's idea so that to ensure customer satisfaction as well as to increase my knowledge
345	2024-02-10 18:23:48.156105	2024-02-10 18:23:48.156105	\N	FAUSTINE	MWITA	CHANDI	0753686190	CFN7506	Male	Fchandi	Annelle100%	chandifstn@gmail.com	Dr.	LUGALO	215	6	Individual	Mwita
346	2024-02-10 18:32:37.218639	2024-02-10 18:32:37.218639	\N	BERNARD	CHENGE	GILINDA	0629040868	CFN9576	Male	112517871	Gilinda@123	bernardgilinda@gmail.com	Dr.	KAHAMA MC 	215	6	Individual	Practitioner
377	2024-02-11 09:32:43.851223	2024-02-11 09:32:43.851223	\N	DAIMA	ANTHONY ROBERT	MACHANG'U	+255757202996	CFN6118	Male	Daimantony	TAtOU2a-cSCQetA	dcube2008@gmail.com	Dr.	MDH	215	3	Individual	A public health officer working with MDH to take public health issues in Tanzania. 
351	2024-02-10 18:55:41.310189	2024-02-10 18:55:41.310189	\N	PETER	RICHARD	TOROKAA	0763833147	CFN2518	Male	ptorokaa	Jayden@1	petertorokaa@gmail.com	Mr.	MUHAS	215	2	Individual	Medical student
353	2024-02-10 19:00:15.436903	2024-02-10 19:00:15.436903	\N	NELSON	NICHOLAUS	KIMOLO	+255754814191	CFN5827	Male	Nelkim	Mbilikimo78	nelson_kimolo@yahoo.com	Dr.	KONDOA DISTRICT COUNCIL	215	6	Individual	Participant
354	2024-02-10 19:04:56.855385	2024-02-10 19:04:56.855385	\N	SUBISYA 	BENARD	KABUJE	0621503609	CFN2698	Female	subisya.kabuje@tamisemi.go.tz	kelvin2000	subisya.kabuje@tamisemi.go.tz	Ms	PO-RALG	215	5	Individual	I m assistant Director for social welfare service,l in the  team of preparation of this meeting 
355	2024-02-10 19:08:20.614825	2024-02-10 19:08:20.614825	\N	STEPHEN	ADAM	MWANDAMBO	0764640474	CFN3590	Male	steandambo@gmail.com	Muje@1309	steandambo@gmail.com	Dr.	TANG CITY COUNCIL	215	6	Individual	Would like to learn more about PHC
356	2024-02-10 19:14:20.441124	2024-02-10 19:14:20.441124	\N	MSAFIRI 	HASANI 	ASENGA 	0717990359	CFN6281	Male	Assenga	m12345678A	asengamsafiri9@gmail.com	Dr.	MBINGA COUNCIL HOSPITAL 	215	6	Individual	Dm
357	2024-02-10 19:15:15.766606	2024-02-10 19:15:15.766606	\N	AMIN 	JOSEPH	VASOMANA	0753580425	CFN1274	Male	aminvasmana	suzana	aminvasomana@gmail.com	Dr.	LGA	215	6	Individual	Need to be a participant ni PHC conference 
358	2024-02-10 19:18:54.849319	2024-02-10 19:18:54.849319	\N	PHILLIPINA 	PHILLIPO 	TITUS 	0787094637	CFN6116	Female	Phillipina 	Pina@1289	phillipophillipina@gmail.com	Dr.	MVOMERO DISTRICT COUNCIL 	215	6	Individual	CMOH Mvomero 
359	2024-02-10 19:39:43.349191	2024-02-10 19:39:43.349191	\N	THADEUS 	VALENTINE 	MAKWANDA 	0768893861	CFN1064	Male	drthadeus	Ngombo20%	drthadeus@gmail.com	Dr.	MLELE DISTRICT COUNCIL 	215	6	Individual	Inspired to save lives of the vulnerable people 
360	2024-02-10 19:47:18.434674	2024-02-10 19:47:18.434674	\N	FIDES	PAUL	KOMBE	0713504908	CFN9896	Female	fidekombe3@gmail.com 	FIDE@2635	fidekombe3@gmail.com	Ms	UNIVERSITY OF DODOMA	215	7	Individual	Social Welfare Officer 
361	2024-02-10 20:18:06.990502	2024-02-10 20:18:06.990502	\N	MIRIAM	BRIGITA	CHECHE	0659 107676 	CFN1106	Female	+255659107676	pangasegs@123	mama3e@yahoo.co.uk	Dr.	KOROGWE DISTRICT COUNCIL	215	6	Individual	Medical Doctor
362	2024-02-10 21:04:12.909327	2024-02-10 21:04:12.909327	\N	LENATUS	OSWARS	KALOLL	0763024668	CFN4194	Male	Lenatus 	lisekelow4	lenatusk78@gmai.com	Dr.	KITENGULE HOSPITAL	215	6	Individual	Ahljjù
363	2024-02-10 22:38:55.258518	2024-02-10 22:38:55.258518	\N	ROBERT	NELSON	RWEBANGIRA	0755442047	CFN9938	Male	robinrweba@yahoo.com	SUZE2015tte	robinrweba@yahoo.com	Dr.	KASULU DC	215	6	Individual	Online Participant
364	2024-02-11 00:06:20.050936	2024-02-11 00:06:20.050936	\N	GEORGE	STEPHEN 	MATIKO	0678336545	CFN8722	Male	GSMATIKO	George@2023	georgestephen359@gmail.com	Dr.	NEWALA DC	215	6	Individual	Dr
365	2024-02-11 02:37:17.682179	2024-02-11 02:37:17.682179	\N	AZIZI 	ATHUMANI 	KETO 	+255789292125	CFN7998	Male	ketoaziz21@gmail.com	kipinguaa	ketoaziz21@gmail.com	Dr.	MALINYI DISTRICT COUNCIL 	215	5	Individual	Council Medical officer for health 
366	2024-02-11 04:35:22.067015	2024-02-11 04:35:22.067015	\N	WILSON	BISEKO	JAPHET	+255765621941	CFN7818	Male	wjaphet118@gmail.com	1234wilsoN	wjaphet118@gmail.com	Ms	UBUNGO MANISPAA 	215	2	Individual	I really need to learn a lot of things 
367	2024-02-11 04:49:35.665547	2024-02-11 04:49:35.665547	\N	JAFFARY 	MOHAMED 	IHUCHA 	0769235054 	CFN6929	Male	Jaffarayjr	0769235054Jr	jafaraymud15@gmail.com	Dr.	MUHAS	215	2	Individual	To attend 1st international primary health care conference in Tanzania date from 25-27/03/2024\n\nMain theme: Primary health care (PHC) as a vehicle for the journey to achieve universal health coverage (UHC) in Tanzania
370	2024-02-11 05:49:50.612303	2024-02-11 05:49:50.612303	\N	OMARY	AWAMI 	MWANGAZA 	0787130283	CFN3557	Male	9796360	Mwangaza@2022	mwangazao@gmail.com	Dr.	MMOH KINONDONI 	215	6	Individual	Am interested to attend this conference since am at primary level working in zeal n zest with CHW house to house NCD screeng.
371	2024-02-11 05:56:01.091903	2024-02-11 05:56:01.091903	\N	DR.DEOGRATIUS	JEREMIAH	MAZENGO	0754894146	CFN9864	Male	dmazengo	12345678	mazengodeogratius@gmail.com	Dr.	MBULU TOWN COUCIL HOSPITAL	215	\N	Forum	I expect to get very new Imformation so that we can change our institute
372	2024-02-11 06:38:26.173933	2024-02-11 06:38:26.173933	\N	SAMWEL	JAMES	MAPULA	0762948291	CFN3365	Male	Mapula	Mapula@79	mapulasj78@gmail.com	Dr.	MSALALA DISTRICT HOSPITAL	215	6	Individual	Need to learn WHO 6 BLOCKS OF PHC
373	2024-02-11 06:52:49.928495	2024-02-11 06:52:49.928495	\N	HAMZA	HASSAN	MKINGULE	+255742915602	CFN9078	Male	9758832	Hamza@2024	kaburu15@gmail.com	Dr.	MPWAPWA DISTRICT HOSPITAL 	215	6	Individual	I am looking forward to share experience  and learn important issues pertaining to PHC for the purpose of improving health services to the community of Mpwapwa District.
374	2024-02-11 07:17:44.483522	2024-02-11 07:17:44.483522	\N	ERASTO 	ESTON 	LUVANDA 	0769139635	CFN7131	Male	Erasto 	Erasto@123	erastoestonluvanda@gmail.com	Dr.	TUNDUMA HOSPITAL 	215	6	Individual	Am medical doctor from tunduma town council hospital I'm interested to join the conference 
375	2024-02-11 07:19:54.883851	2024-02-11 07:19:54.883851	\N	NAIMA	HASSAN	MKINGULE	+255715678888	CFN1403	Female	naimamkingule@gmail.com	Makaligago84!	naimamkingule@gmail.com	Ms	PHLB	215	6	Individual	I will be happy to attend this interesting conference
376	2024-02-11 08:01:34.050052	2024-02-11 08:01:34.050052	\N	THABITI	SADRU	RAJABU	0715978762	CFN2802	Male	thabiti	Farhat12@	tsadru@yahoo.com	Mr.	KISARAWE DISTRICT COUNCIL	215	6	Individual	Health secretary
378	2024-02-11 09:32:46.221169	2024-02-11 09:32:46.221169	\N	CHARLES 	MANGULLU 	CONRAD 	0765524800	CFN5928	Male	Conrad	Mangullu8	charlesconrad33@yahoo.com	Mr.	DED KALIUA 	215	6	Individual	I will be attending the conference as it will reflect all the good work that has been done in primary health care and plan for the good to come 
379	2024-02-11 09:35:07.015439	2024-02-11 09:35:07.015439	\N	DAVID	PAUL	NGILANGWA	+255756997676	CFN6654	Male	dngilangwa	Kihesakwetu4536@	dngilangwa@gmail.com	Dr.	UWC	215	4	Individual	I would like to attend the conference 
380	2024-02-11 09:52:51.910988	2024-02-11 09:52:51.910988	\N	ENID	SIMON	CHIWANGA	0784514467	CFN8233	Female	Enid Chiwanga	Doreen1971	enichiwanga@gmail.com	Dr.	DODOMA REGIONAL REFERRAL HOSPITAL	215	6	Individual	I am an Obstetrician Gyanecologist who is still practising but i also i do some research and some taeaching
381	2024-02-11 11:11:46.753578	2024-02-11 11:11:46.753578	\N	ESTER	CLEMENT 	KAWISHE	+255713566551	CFN9747	Female	kawishe	Ester1980!	ekawishe@gmail.com	Ms	MOROGORO MUNICIPAL COUNCIL	215	8	Individual	I am a Nutrition Officer working at Morogoro Municipal Council with over 10 years working as a nutritionist with MSc. Human Nutrition and BSc. Home Economics and Human Nutrition from Sokoine University of Agriculture
382	2024-02-11 14:20:31.719046	2024-02-11 14:20:31.719046	\N	THEMBO	MUTAIBISA 	MOSES	0742494057	CFN2148	Male	msibiling@gmail.com	Confrence2024	msibiling@gmail.com	Dr.	KAMPALA INTERNATIONAL UNIVERSITY IN TANZANIA 	215	4	Individual	I wish to be part of this great conference 
383	2024-02-11 15:19:04.344293	2024-02-11 15:19:04.344293	\N	NEEMA	AMEIR	MTAMBO	0655877801	CFN3889	Female	Mtambo 	Mtambo2024	queenmtambo@gmail.com	Dr.	REGIONAL REFERRAL HOSPITAL	215	6	Individual	A medical doctor 
384	2024-02-11 15:28:26.222006	2024-02-11 15:28:26.222006	\N	EDDA	FERDINAND	MATANDA	0715064017	CFN1427	Female	Edda Ferdinand	Matanda99	eddafmatanda@gmail.com	Ms	KAMPALA INTERNATIONAL UNIVERSITY IN TANZANIA	215	4	Individual	Researcher and lecturer at Kampala international university
385	2024-02-11 15:43:03.130405	2024-02-11 15:43:03.130405	\N	CECYLIA	REUBEN	KATOBA	0764627333	CFN6532	Female	Kigongo123	25111960C	katobacecy5@gmail.com	Miss	KIGONGO DISPENSARY CHATO	215	6	Individual	Ready to learn new and important skills on governance 
386	2024-02-11 17:22:51.062968	2024-02-11 17:22:51.062968	\N	JOSEPH	B	SINGO	0678230721	CFN4736	Male	Mayson	Georgina#01mayson	josephsingo15@gmail.com	Dr.	NONE	215	3	Individual	I want to present a paper
387	2024-02-11 20:44:21.644198	2024-02-11 20:44:21.644198	\N	GILBERT	ELIFURAHA	MREMA	0754890811	CFN2787	Male	gilbert mrema	789c46r23n0	gilbertmrema2016@gmail.com	Dr.	MKURANGA DISTRICT HOSPITAL	215	6	Individual	Interest to get new ideas to solve primary health care needs
388	2024-02-11 20:51:39.321672	2024-02-11 20:51:39.321672	\N	REBECCA	WILLIAM	MDUMA	0763214448	CFN4677	Female	dr-mduma	Malebo88	rebeccawllm015@gmail.com	Dr.	LUDEWA DISTRICT COUNCIL	215	6	Individual	Health Centre incharge looking to expand my horizon 
389	2024-02-11 21:09:31.332632	2024-02-11 21:09:31.332632	\N	MICHAEL	MASSABA	SELLE	0754441481	CFN5837	Male	Mas7	Mas7@1993	michaelmassaba@gmail.com	Dr.	NGOMAMTIMBA HC	215	6	Individual	Medical officer incharge at Ngomamtimba HC
390	2024-02-12 05:04:57.582996	2024-02-12 05:04:57.582996	\N	MARIA	CHARLES 	MWANYILU 	0759387596	CFN9838	Female	Nyilu	Mwanyilu1985	mcnyilu@gmail.com	Dr.	KAMANGA HEALTH CENTER 	215	6	Individual	Doctor Maria
\.


--
-- Data for Name: users_menus_menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_menus_menus ("usersId", "menusId") FROM stdin;
\.


--
-- Data for Name: users_roles_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_roles_roles ("usersId", "rolesId") FROM stdin;
\.


--
-- Name: abstracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.abstracts_id_seq', 13, true);


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 1, false);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.countries_id_seq', 244, true);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.files_id_seq', 2, true);


--
-- Name: jisajilis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jisajilis_id_seq', 2, true);


--
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menus_id_seq', 1, false);


--
-- Name: registrationcategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registrationcategories_id_seq', 9, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: subthemes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subthemes_id_seq', 16, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 390, true);


--
-- Name: registrationcategories PK_3bb024e0b103c109c8a3448e773; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrationcategories
    ADD CONSTRAINT "PK_3bb024e0b103c109c8a3448e773" PRIMARY KEY (id);


--
-- Name: menus PK_3fec3d93327f4538e0cbd4349c4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY (id);


--
-- Name: subthemes PK_45445cb197d95b2e6b92aa1f50c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subthemes
    ADD CONSTRAINT "PK_45445cb197d95b2e6b92aa1f50c" PRIMARY KEY (id);


--
-- Name: files PK_6c16b9093a142e0e7613b04a3d9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY (id);


--
-- Name: users_roles_roles PK_6c1a055682c229f5a865f2080c1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "PK_6c1a055682c229f5a865f2080c1" PRIMARY KEY ("usersId", "rolesId");


--
-- Name: category_closure PK_8da8666fc72217687e9b4f4c7e9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_closure
    ADD CONSTRAINT "PK_8da8666fc72217687e9b4f4c7e9" PRIMARY KEY (id_ancestor, id_descendant);


--
-- Name: category PK_9c4e4a89e3674fc9f382d733f03; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: countries PK_b2d7006793e8697ab3ae2deff18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: jisajilis PK_c9c7fefc07580f822d75dc67241; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jisajilis
    ADD CONSTRAINT "PK_c9c7fefc07580f822d75dc67241" PRIMARY KEY (id);


--
-- Name: users_menus_menus PK_e7d73a1a95b3c44d31cd93e04b7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_menus_menus
    ADD CONSTRAINT "PK_e7d73a1a95b3c44d31cd93e04b7" PRIMARY KEY ("usersId", "menusId");


--
-- Name: abstracts PK_f78ff02f3549b2a3ec00348675b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.abstracts
    ADD CONSTRAINT "PK_f78ff02f3549b2a3ec00348675b" PRIMARY KEY (id);


--
-- Name: users UQ_17d1817f241f10a3dbafb169fd2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE (phone_number);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: IDX_4aa1348fc4b7da9bef0fae8ff4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4aa1348fc4b7da9bef0fae8ff4" ON public.category_closure USING btree (id_ancestor);


--
-- Name: IDX_673ff63f1585fd65c31984912e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_673ff63f1585fd65c31984912e" ON public.users_menus_menus USING btree ("menusId");


--
-- Name: IDX_6a22002acac4976977b1efd114; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6a22002acac4976977b1efd114" ON public.category_closure USING btree (id_descendant);


--
-- Name: IDX_9c20d9636927fc68327c6b387a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_9c20d9636927fc68327c6b387a" ON public.users_menus_menus USING btree ("usersId");


--
-- Name: IDX_b2f0366aa9349789527e0c36d9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b2f0366aa9349789527e0c36d9" ON public.users_roles_roles USING btree ("rolesId");


--
-- Name: IDX_df951a64f09865171d2d7a502b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_df951a64f09865171d2d7a502b" ON public.users_roles_roles USING btree ("usersId");


--
-- Name: category_closure FK_4aa1348fc4b7da9bef0fae8ff48; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_closure
    ADD CONSTRAINT "FK_4aa1348fc4b7da9bef0fae8ff48" FOREIGN KEY (id_ancestor) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: users_menus_menus FK_673ff63f1585fd65c31984912e4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_menus_menus
    ADD CONSTRAINT "FK_673ff63f1585fd65c31984912e4" FOREIGN KEY ("menusId") REFERENCES public.menus(id);


--
-- Name: category_closure FK_6a22002acac4976977b1efd114a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_closure
    ADD CONSTRAINT "FK_6a22002acac4976977b1efd114a" FOREIGN KEY (id_descendant) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: users FK_9ba5ad47c9b7d6dbbd251a373d2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_9ba5ad47c9b7d6dbbd251a373d2" FOREIGN KEY ("registationcategoryId") REFERENCES public.registrationcategories(id) ON DELETE CASCADE;


--
-- Name: users_menus_menus FK_9c20d9636927fc68327c6b387a7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_menus_menus
    ADD CONSTRAINT "FK_9c20d9636927fc68327c6b387a7" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: abstracts FK_a57ed8e9b6e6099f0855bc8c9d9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.abstracts
    ADD CONSTRAINT "FK_a57ed8e9b6e6099f0855bc8c9d9" FOREIGN KEY ("subThemeId") REFERENCES public.subthemes(id) ON DELETE CASCADE;


--
-- Name: users_roles_roles FK_b2f0366aa9349789527e0c36d97; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "FK_b2f0366aa9349789527e0c36d97" FOREIGN KEY ("rolesId") REFERENCES public.roles(id);


--
-- Name: users FK_cc0dc7234854a65964f1a268275; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_cc0dc7234854a65964f1a268275" FOREIGN KEY ("countryId") REFERENCES public.countries(id) ON DELETE CASCADE;


--
-- Name: category FK_d5456fd7e4c4866fec8ada1fa10; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES public.category(id);


--
-- Name: jisajilis FK_d8e311fbddd437bef657140e3ef; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jisajilis
    ADD CONSTRAINT "FK_d8e311fbddd437bef657140e3ef" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: users_roles_roles FK_df951a64f09865171d2d7a502b1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "FK_df951a64f09865171d2d7a502b1" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

