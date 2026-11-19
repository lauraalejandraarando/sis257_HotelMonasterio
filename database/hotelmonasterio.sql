--
-- PostgreSQL database dump
--

\restrict GozRo5hpGzukcxacKxU77SpkyDHHZsOdEgToqcjwbwzSUiuLUtLQdxqqWxP0BXW

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-19 17:07:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 240 (class 1259 OID 18899)
-- Name: configuraciones_hotel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuraciones_hotel (
    id integer NOT NULL,
    clave character varying(80) NOT NULL,
    valor character varying(255) NOT NULL,
    descripcion text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.configuraciones_hotel OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18898)
-- Name: configuraciones_hotel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuraciones_hotel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuraciones_hotel_id_seq OWNER TO postgres;

--
-- TOC entry 5277 (class 0 OID 0)
-- Dependencies: 239
-- Name: configuraciones_hotel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuraciones_hotel_id_seq OWNED BY public.configuraciones_hotel.id;


--
-- TOC entry 248 (class 1259 OID 18979)
-- Name: detalles_equipaje; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalles_equipaje (
    id integer NOT NULL,
    codigo character varying(30) NOT NULL,
    descripcion character varying(200) NOT NULL,
    estado character varying(20) DEFAULT 'en_custodia'::character varying NOT NULL,
    fecha_entrega timestamp without time zone,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL,
    guarda_equipaje_id integer NOT NULL
);


ALTER TABLE public.detalles_equipaje OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 18978)
-- Name: detalles_equipaje_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalles_equipaje_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalles_equipaje_id_seq OWNER TO postgres;

--
-- TOC entry 5278 (class 0 OID 0)
-- Dependencies: 247
-- Name: detalles_equipaje_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalles_equipaje_id_seq OWNED BY public.detalles_equipaje.id;


--
-- TOC entry 228 (class 1259 OID 18781)
-- Name: detalles_reserva; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalles_reserva (
    id integer NOT NULL,
    precio_noche numeric(10,2) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    reserva_id integer NOT NULL,
    habitacion_id integer NOT NULL
);


ALTER TABLE public.detalles_reserva OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18780)
-- Name: detalles_reserva_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalles_reserva_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalles_reserva_id_seq OWNER TO postgres;

--
-- TOC entry 5279 (class 0 OID 0)
-- Dependencies: 227
-- Name: detalles_reserva_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalles_reserva_id_seq OWNED BY public.detalles_reserva.id;


--
-- TOC entry 246 (class 1259 OID 18958)
-- Name: guardas_equipaje; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guardas_equipaje (
    id integer NOT NULL,
    fecha_recepcion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_entrega timestamp without time zone,
    estado character varying(20) DEFAULT 'en_custodia'::character varying NOT NULL,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL,
    huesped_id integer NOT NULL,
    reserva_id integer
);


ALTER TABLE public.guardas_equipaje OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 18957)
-- Name: guardas_equipaje_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guardas_equipaje_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guardas_equipaje_id_seq OWNER TO postgres;

--
-- TOC entry 5280 (class 0 OID 0)
-- Dependencies: 245
-- Name: guardas_equipaje_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guardas_equipaje_id_seq OWNED BY public.guardas_equipaje.id;


--
-- TOC entry 222 (class 1259 OID 18716)
-- Name: habitaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habitaciones (
    id integer NOT NULL,
    numero character varying(20) NOT NULL,
    piso integer NOT NULL,
    estado character varying(30) DEFAULT 'disponible'::character varying NOT NULL,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL,
    tipo_habitacion_id integer NOT NULL
);


ALTER TABLE public.habitaciones OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 18715)
-- Name: habitaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habitaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.habitaciones_id_seq OWNER TO postgres;

--
-- TOC entry 5281 (class 0 OID 0)
-- Dependencies: 221
-- Name: habitaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habitaciones_id_seq OWNED BY public.habitaciones.id;


--
-- TOC entry 224 (class 1259 OID 18737)
-- Name: huespedes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.huespedes (
    id integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    tipo_documento character varying(20) NOT NULL,
    numero_documento character varying(30) NOT NULL,
    nacionalidad character varying(60) NOT NULL,
    telefono character varying(30),
    correo character varying(120),
    direccion text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.huespedes OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18736)
-- Name: huespedes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.huespedes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.huespedes_id_seq OWNER TO postgres;

--
-- TOC entry 5282 (class 0 OID 0)
-- Dependencies: 223
-- Name: huespedes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.huespedes_id_seq OWNED BY public.huespedes.id;


--
-- TOC entry 252 (class 1259 OID 19024)
-- Name: incidentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incidentes (
    id integer NOT NULL,
    descripcion text NOT NULL,
    monto_estimado numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    monto_autorizado numeric(10,2),
    estado character varying(25) DEFAULT 'reportado'::character varying NOT NULL,
    fecha_reporte timestamp without time zone DEFAULT now() NOT NULL,
    fecha_resolucion timestamp without time zone,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL,
    tipo_incidente_id integer NOT NULL,
    huesped_id integer NOT NULL,
    reserva_id integer,
    habitacion_id integer
);


ALTER TABLE public.incidentes OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 19023)
-- Name: incidentes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.incidentes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incidentes_id_seq OWNER TO postgres;

--
-- TOC entry 5283 (class 0 OID 0)
-- Dependencies: 251
-- Name: incidentes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.incidentes_id_seq OWNED BY public.incidentes.id;


--
-- TOC entry 234 (class 1259 OID 18834)
-- Name: movimientos_caja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimientos_caja (
    id integer NOT NULL,
    tipo_movimiento character varying(10) NOT NULL,
    concepto character varying(150) NOT NULL,
    monto numeric(10,2) NOT NULL,
    metodo_pago character varying(20) NOT NULL,
    referencia character varying(100),
    observaciones text,
    fecha_movimiento timestamp without time zone DEFAULT now() NOT NULL,
    turno_caja_id integer NOT NULL
);


ALTER TABLE public.movimientos_caja OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18833)
-- Name: movimientos_caja_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movimientos_caja_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movimientos_caja_id_seq OWNER TO postgres;

--
-- TOC entry 5284 (class 0 OID 0)
-- Dependencies: 233
-- Name: movimientos_caja_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movimientos_caja_id_seq OWNED BY public.movimientos_caja.id;


--
-- TOC entry 230 (class 1259 OID 18794)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id integer NOT NULL,
    monto numeric(10,2) NOT NULL,
    metodo_pago character varying(20) NOT NULL,
    tipo_pago character varying(20) DEFAULT 'adelanto'::character varying NOT NULL,
    referencia character varying(100),
    observaciones text,
    fecha_pago timestamp without time zone DEFAULT now() NOT NULL,
    reserva_id integer NOT NULL
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18793)
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_id_seq OWNER TO postgres;

--
-- TOC entry 5285 (class 0 OID 0)
-- Dependencies: 229
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;


--
-- TOC entry 256 (class 1259 OID 19077)
-- Name: registros_auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registros_auditoria (
    id integer NOT NULL,
    accion character varying(50) NOT NULL,
    entidad character varying(80) NOT NULL,
    entidad_id integer,
    datos_anteriores jsonb,
    datos_nuevos jsonb,
    descripcion text,
    fecha_accion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    usuario_id integer
);


ALTER TABLE public.registros_auditoria OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 19076)
-- Name: registros_auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registros_auditoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registros_auditoria_id_seq OWNER TO postgres;

--
-- TOC entry 5286 (class 0 OID 0)
-- Dependencies: 255
-- Name: registros_auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registros_auditoria_id_seq OWNED BY public.registros_auditoria.id;


--
-- TOC entry 226 (class 1259 OID 18758)
-- Name: reservas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservas (
    id integer NOT NULL,
    codigo_reserva character varying(30) NOT NULL,
    fecha_entrada date NOT NULL,
    fecha_salida date NOT NULL,
    cantidad_huespedes integer NOT NULL,
    estado character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL,
    huesped_id integer NOT NULL,
    fecha_limite_pago timestamp with time zone
);


ALTER TABLE public.reservas OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18757)
-- Name: reservas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservas_id_seq OWNER TO postgres;

--
-- TOC entry 5287 (class 0 OID 0)
-- Dependencies: 225
-- Name: reservas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservas_id_seq OWNED BY public.reservas.id;


--
-- TOC entry 244 (class 1259 OID 18938)
-- Name: servicios_adicionales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicios_adicionales (
    id integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2) NOT NULL,
    importe_total numeric(10,2) NOT NULL,
    fecha_servicio timestamp without time zone DEFAULT now() NOT NULL,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    reserva_id integer NOT NULL,
    tarifa_servicio_id integer NOT NULL
);


ALTER TABLE public.servicios_adicionales OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 18937)
-- Name: servicios_adicionales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicios_adicionales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicios_adicionales_id_seq OWNER TO postgres;

--
-- TOC entry 5288 (class 0 OID 0)
-- Dependencies: 243
-- Name: servicios_adicionales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicios_adicionales_id_seq OWNED BY public.servicios_adicionales.id;


--
-- TOC entry 258 (class 1259 OID 19096)
-- Name: sesiones_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sesiones_usuario (
    id integer NOT NULL,
    token_identificador character varying(255) NOT NULL,
    fecha_inicio timestamp without time zone DEFAULT now() NOT NULL,
    fecha_fin timestamp without time zone,
    estado character varying(20) DEFAULT 'activa'::character varying NOT NULL,
    direccion_ip character varying(45),
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    usuario_id integer NOT NULL
);


ALTER TABLE public.sesiones_usuario OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 19095)
-- Name: sesiones_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sesiones_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sesiones_usuario_id_seq OWNER TO postgres;

--
-- TOC entry 5289 (class 0 OID 0)
-- Dependencies: 257
-- Name: sesiones_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sesiones_usuario_id_seq OWNED BY public.sesiones_usuario.id;


--
-- TOC entry 238 (class 1259 OID 18874)
-- Name: solicitudes_mantenimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitudes_mantenimiento (
    id integer NOT NULL,
    tipo_problema character varying(80) NOT NULL,
    descripcion text NOT NULL,
    prioridad character varying(15) DEFAULT 'media'::character varying NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_reporte timestamp without time zone DEFAULT now() NOT NULL,
    fecha_solucion timestamp without time zone,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL,
    habitacion_id integer NOT NULL
);


ALTER TABLE public.solicitudes_mantenimiento OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18873)
-- Name: solicitudes_mantenimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitudes_mantenimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitudes_mantenimiento_id_seq OWNER TO postgres;

--
-- TOC entry 5290 (class 0 OID 0)
-- Dependencies: 237
-- Name: solicitudes_mantenimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitudes_mantenimiento_id_seq OWNED BY public.solicitudes_mantenimiento.id;


--
-- TOC entry 236 (class 1259 OID 18852)
-- Name: tareas_limpieza; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tareas_limpieza (
    id integer NOT NULL,
    tipo_limpieza character varying(50) NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_finalizacion timestamp without time zone,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL,
    habitacion_id integer NOT NULL
);


ALTER TABLE public.tareas_limpieza OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 18851)
-- Name: tareas_limpieza_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tareas_limpieza_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tareas_limpieza_id_seq OWNER TO postgres;

--
-- TOC entry 5291 (class 0 OID 0)
-- Dependencies: 235
-- Name: tareas_limpieza_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tareas_limpieza_id_seq OWNED BY public.tareas_limpieza.id;


--
-- TOC entry 242 (class 1259 OID 18916)
-- Name: tarifas_servicios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tarifas_servicios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    unidad_cobro character varying(50) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tarifas_servicios OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 18915)
-- Name: tarifas_servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tarifas_servicios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tarifas_servicios_id_seq OWNER TO postgres;

--
-- TOC entry 5292 (class 0 OID 0)
-- Dependencies: 241
-- Name: tarifas_servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tarifas_servicios_id_seq OWNED BY public.tarifas_servicios.id;


--
-- TOC entry 220 (class 1259 OID 18696)
-- Name: tipos_habitacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_habitacion (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    capacidad integer NOT NULL,
    tipo_bano character varying(20) NOT NULL,
    precio_noche numeric(10,2) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipos_habitacion OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 18695)
-- Name: tipos_habitacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_habitacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_habitacion_id_seq OWNER TO postgres;

--
-- TOC entry 5293 (class 0 OID 0)
-- Dependencies: 219
-- Name: tipos_habitacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_habitacion_id_seq OWNED BY public.tipos_habitacion.id;


--
-- TOC entry 250 (class 1259 OID 19002)
-- Name: tipos_incidente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_incidente (
    id integer NOT NULL,
    nombre character varying(80) NOT NULL,
    descripcion text,
    requiere_cobro boolean DEFAULT true NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipos_incidente OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 19001)
-- Name: tipos_incidente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_incidente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_incidente_id_seq OWNER TO postgres;

--
-- TOC entry 5294 (class 0 OID 0)
-- Dependencies: 249
-- Name: tipos_incidente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_incidente_id_seq OWNED BY public.tipos_incidente.id;


--
-- TOC entry 232 (class 1259 OID 18812)
-- Name: turnos_caja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.turnos_caja (
    id integer NOT NULL,
    tipo_turno character varying(10) NOT NULL,
    fecha_operativa date NOT NULL,
    fecha_apertura timestamp without time zone NOT NULL,
    fecha_cierre timestamp without time zone,
    monto_inicial numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    efectivo_esperado numeric(10,2),
    dinero_contado numeric(10,2),
    diferencia numeric(10,2),
    estado character varying(15) DEFAULT 'abierto'::character varying NOT NULL,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.turnos_caja OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18811)
-- Name: turnos_caja_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.turnos_caja_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.turnos_caja_id_seq OWNER TO postgres;

--
-- TOC entry 5295 (class 0 OID 0)
-- Dependencies: 231
-- Name: turnos_caja_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.turnos_caja_id_seq OWNED BY public.turnos_caja.id;


--
-- TOC entry 254 (class 1259 OID 19049)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre_usuario character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    correo character varying(120) NOT NULL,
    rol character varying(20) DEFAULT 'recepcion'::character varying NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    ultimo_acceso timestamp without time zone,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 19048)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5296 (class 0 OID 0)
-- Dependencies: 253
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4943 (class 2604 OID 18902)
-- Name: configuraciones_hotel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuraciones_hotel ALTER COLUMN id SET DEFAULT nextval('public.configuraciones_hotel_id_seq'::regclass);


--
-- TOC entry 4958 (class 2604 OID 18982)
-- Name: detalles_equipaje id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_equipaje ALTER COLUMN id SET DEFAULT nextval('public.detalles_equipaje_id_seq'::regclass);


--
-- TOC entry 4920 (class 2604 OID 18784)
-- Name: detalles_reserva id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_reserva ALTER COLUMN id SET DEFAULT nextval('public.detalles_reserva_id_seq'::regclass);


--
-- TOC entry 4953 (class 2604 OID 18961)
-- Name: guardas_equipaje id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guardas_equipaje ALTER COLUMN id SET DEFAULT nextval('public.guardas_equipaje_id_seq'::regclass);


--
-- TOC entry 4908 (class 2604 OID 18719)
-- Name: habitaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitaciones ALTER COLUMN id SET DEFAULT nextval('public.habitaciones_id_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 18740)
-- Name: huespedes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.huespedes ALTER COLUMN id SET DEFAULT nextval('public.huespedes_id_seq'::regclass);


--
-- TOC entry 4967 (class 2604 OID 19027)
-- Name: incidentes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes ALTER COLUMN id SET DEFAULT nextval('public.incidentes_id_seq'::regclass);


--
-- TOC entry 4930 (class 2604 OID 18837)
-- Name: movimientos_caja id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos_caja ALTER COLUMN id SET DEFAULT nextval('public.movimientos_caja_id_seq'::regclass);


--
-- TOC entry 4922 (class 2604 OID 18797)
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- TOC entry 4978 (class 2604 OID 19080)
-- Name: registros_auditoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_auditoria ALTER COLUMN id SET DEFAULT nextval('public.registros_auditoria_id_seq'::regclass);


--
-- TOC entry 4916 (class 2604 OID 18761)
-- Name: reservas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas ALTER COLUMN id SET DEFAULT nextval('public.reservas_id_seq'::regclass);


--
-- TOC entry 4950 (class 2604 OID 18941)
-- Name: servicios_adicionales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios_adicionales ALTER COLUMN id SET DEFAULT nextval('public.servicios_adicionales_id_seq'::regclass);


--
-- TOC entry 4981 (class 2604 OID 19099)
-- Name: sesiones_usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones_usuario ALTER COLUMN id SET DEFAULT nextval('public.sesiones_usuario_id_seq'::regclass);


--
-- TOC entry 4937 (class 2604 OID 18877)
-- Name: solicitudes_mantenimiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_mantenimiento ALTER COLUMN id SET DEFAULT nextval('public.solicitudes_mantenimiento_id_seq'::regclass);


--
-- TOC entry 4932 (class 2604 OID 18855)
-- Name: tareas_limpieza id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas_limpieza ALTER COLUMN id SET DEFAULT nextval('public.tareas_limpieza_id_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 18919)
-- Name: tarifas_servicios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarifas_servicios ALTER COLUMN id SET DEFAULT nextval('public.tarifas_servicios_id_seq'::regclass);


--
-- TOC entry 4904 (class 2604 OID 18699)
-- Name: tipos_habitacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_habitacion ALTER COLUMN id SET DEFAULT nextval('public.tipos_habitacion_id_seq'::regclass);


--
-- TOC entry 4962 (class 2604 OID 19005)
-- Name: tipos_incidente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_incidente ALTER COLUMN id SET DEFAULT nextval('public.tipos_incidente_id_seq'::regclass);


--
-- TOC entry 4925 (class 2604 OID 18815)
-- Name: turnos_caja id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.turnos_caja ALTER COLUMN id SET DEFAULT nextval('public.turnos_caja_id_seq'::regclass);


--
-- TOC entry 4973 (class 2604 OID 19052)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5253 (class 0 OID 18899)
-- Dependencies: 240
-- Data for Name: configuraciones_hotel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuraciones_hotel (id, clave, valor, descripcion, fecha_creacion, fecha_actualizacion) FROM stdin;
\.


--
-- TOC entry 5261 (class 0 OID 18979)
-- Dependencies: 248
-- Data for Name: detalles_equipaje; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalles_equipaje (id, codigo, descripcion, estado, fecha_entrega, observaciones, fecha_creacion, fecha_actualizacion, guarda_equipaje_id) FROM stdin;
\.


--
-- TOC entry 5241 (class 0 OID 18781)
-- Dependencies: 228
-- Data for Name: detalles_reserva; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalles_reserva (id, precio_noche, fecha_creacion, reserva_id, habitacion_id) FROM stdin;
1	150.00	2026-11-18 16:24:41.450278	1	1
2	150.00	2026-11-18 17:05:21.524045	2	1
3	150.00	2026-11-19 11:33:21.968408	3	1
\.


--
-- TOC entry 5259 (class 0 OID 18958)
-- Dependencies: 246
-- Data for Name: guardas_equipaje; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.guardas_equipaje (id, fecha_recepcion, fecha_entrega, estado, observaciones, fecha_creacion, fecha_actualizacion, huesped_id, reserva_id) FROM stdin;
\.


--
-- TOC entry 5235 (class 0 OID 18716)
-- Dependencies: 222
-- Data for Name: habitaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.habitaciones (id, numero, piso, estado, observaciones, fecha_creacion, fecha_actualizacion, tipo_habitacion_id) FROM stdin;
1	101	1	disponible	Habitacion modificada por Brayan	2026-11-18 01:32:52.868181	2026-11-19 11:35:24.950788	2
2	104	3	disponible	\N	2026-11-19 12:10:36.209944	2026-11-19 12:10:36.209944	3
3	106	4	disponible	\N	2026-11-19 12:10:55.672785	2026-11-19 12:10:55.672785	5
4	107	6	reservada	\N	2026-11-19 12:11:16.35249	2026-11-19 12:11:16.35249	6
\.


--
-- TOC entry 5237 (class 0 OID 18737)
-- Dependencies: 224
-- Data for Name: huespedes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.huespedes (id, nombres, apellidos, tipo_documento, numero_documento, nacionalidad, telefono, correo, direccion, fecha_creacion, fecha_actualizacion, estado) FROM stdin;
3	ales	arandos	CI	1234567898	chilenas	700000001	ale0s@gmail.com	barrientoss	2026-11-19 11:15:57.072274	2026-11-19 11:16:31.601624	t
2	Brayan Erick	Choque	CI	12345678	Boliviana	70000000	correo@gmail.com	Sucre, Bolivia	2026-11-18 02:55:10.753675	2026-11-19 11:20:41.552743	f
4	mario	bros	CI	123456898	brasil	1233456897	mario@gmail.com	ahis	2026-11-19 11:29:50.340106	2026-11-19 11:29:50.340106	t
\.


--
-- TOC entry 5265 (class 0 OID 19024)
-- Dependencies: 252
-- Data for Name: incidentes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.incidentes (id, descripcion, monto_estimado, monto_autorizado, estado, fecha_reporte, fecha_resolucion, observaciones, fecha_creacion, fecha_actualizacion, tipo_incidente_id, huesped_id, reserva_id, habitacion_id) FROM stdin;
\.


--
-- TOC entry 5247 (class 0 OID 18834)
-- Dependencies: 234
-- Data for Name: movimientos_caja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimientos_caja (id, tipo_movimiento, concepto, monto, metodo_pago, referencia, observaciones, fecha_movimiento, turno_caja_id) FROM stdin;
1	ingreso	Ingreso de prueba	50.00	efectivo	TEST-001	Movimiento de prueba	2026-11-18 17:09:22.638955	1
\.


--
-- TOC entry 5243 (class 0 OID 18794)
-- Dependencies: 230
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id, monto, metodo_pago, tipo_pago, referencia, observaciones, fecha_pago, reserva_id) FROM stdin;
1	150.00	efectivo	adelanto	\N	\N	2026-11-18 16:25:07.657048	1
2	150.00	efectivo	adelanto	\N	\N	2026-11-18 17:05:52.419708	2
3	150.00	transferencia	saldo	0	nada	2026-11-19 11:34:36.37872	3
\.


--
-- TOC entry 5269 (class 0 OID 19077)
-- Dependencies: 256
-- Data for Name: registros_auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registros_auditoria (id, accion, entidad, entidad_id, datos_anteriores, datos_nuevos, descripcion, fecha_accion, fecha_creacion, usuario_id) FROM stdin;
\.


--
-- TOC entry 5239 (class 0 OID 18758)
-- Dependencies: 226
-- Data for Name: reservas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservas (id, codigo_reserva, fecha_entrada, fecha_salida, cantidad_huespedes, estado, observaciones, fecha_creacion, fecha_actualizacion, huesped_id, fecha_limite_pago) FROM stdin;
1	RES-1795033481464-148	2026-11-19	2026-11-20	1	finalizada	\N	2026-11-18 16:24:41.450278	2026-11-18 16:51:54.190908	2	2026-11-18 18:24:41.464-04
2	RES-1795035921553-78	2026-11-20	2026-11-21	1	confirmada	\N	2026-11-18 17:05:21.524045	2026-11-18 17:05:52.419708	2	2026-11-18 19:05:21.553-04
3	RES-1795102401982-779	2026-12-23	2026-12-24	1	finalizada		2026-11-19 11:33:21.968408	2026-11-19 11:35:24.950788	4	2026-11-19 13:33:21.982-04
\.


--
-- TOC entry 5257 (class 0 OID 18938)
-- Dependencies: 244
-- Data for Name: servicios_adicionales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicios_adicionales (id, cantidad, precio_unitario, importe_total, fecha_servicio, observaciones, fecha_creacion, reserva_id, tarifa_servicio_id) FROM stdin;
1	2	25.00	50.00	2026-11-18 17:06:22.374845	Lavado de ropa del huesped	2026-11-18 17:06:22.374845	2	1
\.


--
-- TOC entry 5271 (class 0 OID 19096)
-- Dependencies: 258
-- Data for Name: sesiones_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sesiones_usuario (id, token_identificador, fecha_inicio, fecha_fin, estado, direccion_ip, fecha_creacion, usuario_id) FROM stdin;
1	c9d799a8-79c8-41ed-8064-853ed5e48947	2026-11-19 09:20:28.169997	\N	activa	::1	2026-11-19 09:20:28.169997	1
2	7d7ba83d-94bb-4102-a09b-a875c02bf84a	2026-11-19 09:27:18.865202	\N	activa	::1	2026-11-19 09:27:18.865202	1
3	700565f9-257b-4b51-ac9a-3fdf9a7f2b75	2026-11-19 09:29:32.108848	\N	activa	::1	2026-11-19 09:29:32.108848	1
4	482056c2-6bb2-49d1-83aa-ba9995524341	2026-11-19 10:51:08.841497	\N	activa	::1	2026-11-19 10:51:08.841497	1
5	1337f96a-5dd0-4515-8cf9-8b609f6f6cf3	2026-11-19 11:39:23.022605	\N	activa	::1	2026-11-19 11:39:23.022605	1
6	e54c0c86-34a5-4855-a08c-c9de33e8d553	2026-11-19 16:02:25.083883	\N	activa	::1	2026-11-19 16:02:25.083883	1
7	47c80d08-2ae0-4689-a264-f6ed9f03c309	2026-11-19 16:02:26.848154	\N	activa	::1	2026-11-19 16:02:26.848154	1
8	cc815eb0-9427-4086-949e-579c731926ac	2026-11-19 16:03:52.168351	\N	activa	::1	2026-11-19 16:03:52.168351	1
9	1be972dc-adb2-4387-aaed-e79dd48f4952	2026-11-19 16:09:02.175925	\N	activa	::1	2026-11-19 16:09:02.175925	1
10	3e7c7e34-8e56-4c54-8679-ada875c87cba	2026-11-19 17:01:47.291793	\N	activa	::1	2026-11-19 17:01:47.291793	1
11	ef3b0644-24dc-4b94-bb5f-8c22e20488c3	2026-11-19 17:02:06.33244	\N	activa	::1	2026-11-19 17:02:06.33244	1
\.


--
-- TOC entry 5251 (class 0 OID 18874)
-- Dependencies: 238
-- Data for Name: solicitudes_mantenimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitudes_mantenimiento (id, tipo_problema, descripcion, prioridad, estado, fecha_reporte, fecha_solucion, observaciones, fecha_creacion, fecha_actualizacion, habitacion_id) FROM stdin;
\.


--
-- TOC entry 5249 (class 0 OID 18852)
-- Dependencies: 236
-- Data for Name: tareas_limpieza; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tareas_limpieza (id, tipo_limpieza, estado, fecha_asignacion, fecha_finalizacion, observaciones, fecha_creacion, fecha_actualizacion, habitacion_id) FROM stdin;
\.


--
-- TOC entry 5255 (class 0 OID 18916)
-- Dependencies: 242
-- Data for Name: tarifas_servicios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tarifas_servicios (id, nombre, descripcion, precio, unidad_cobro, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	Lavanderia	Servicio de lavado de ropa para huespedes	25.00	Por servicio	t	2026-11-18 16:59:24.583795	2026-11-18 16:59:24.583795
\.


--
-- TOC entry 5233 (class 0 OID 18696)
-- Dependencies: 220
-- Data for Name: tipos_habitacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipos_habitacion (id, nombre, capacidad, tipo_bano, precio_noche, descripcion, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
2	Individual	1	Privado	150.00	\N	t	2026-11-18 01:32:24.29309	2026-11-18 01:32:24.29309
3	Triple	3	privado	300.00	Habitación amplia para tres huéspedes.	t	2026-11-19 11:36:37.323158	2026-11-19 11:36:37.323158
4	Doble	2	compartido	200.00	Habitación con dos camas individuales.	t	2026-11-19 12:09:35.217271	2026-11-19 12:09:35.217271
5	Matrimonial	2	privado	150.00	Habitación con cama matrimonial.	t	2026-11-19 12:10:05.022883	2026-11-19 12:10:05.022883
6	Suite	2	privado	0.00	Habitación superior con mayor comodidad.	t	2026-11-19 12:10:13.484338	2026-11-19 12:10:13.484338
\.


--
-- TOC entry 5263 (class 0 OID 19002)
-- Dependencies: 250
-- Data for Name: tipos_incidente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipos_incidente (id, nombre, descripcion, requiere_cobro, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
\.


--
-- TOC entry 5245 (class 0 OID 18812)
-- Dependencies: 232
-- Data for Name: turnos_caja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.turnos_caja (id, tipo_turno, fecha_operativa, fecha_apertura, fecha_cierre, monto_inicial, efectivo_esperado, dinero_contado, diferencia, estado, observaciones, fecha_creacion, fecha_actualizacion) FROM stdin;
1	mañana	2026-11-18	2026-11-18 17:07:55.46	2026-11-18 17:09:57.104	100.00	150.00	150.00	0.00	cerrado	Cierre de caja de prueba	2026-11-18 17:07:55.466504	2026-11-18 17:09:57.100164
\.


--
-- TOC entry 5267 (class 0 OID 19049)
-- Dependencies: 254
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre_usuario, password_hash, nombres, apellidos, correo, rol, activo, ultimo_acceso, fecha_creacion, fecha_actualizacion) FROM stdin;
2	brayan2	a25c5cb48b563aa0339a3bb1149a0a9e:01f00dae033bca910cfd3e72be949d6d69d56be6f08293c595a962cd43874475d9b904c9303b3d9e69bd6c917c9d916a9a9949a9758b2b5cadae101f607366d2	Brayan Erick	Choque	brayan2@gmail.com	administrador	f	\N	2026-11-19 00:03:22.90433	2026-11-19 10:50:31.332782
1	admin	332daa25cc09158755a032cff8561367:1b7ff5c0d3a90a2cbf38bee1fbc7893659fbd6eae928d207ba96aeaa95b92b2638cc8cfa1181ab6eb0375c33bee3a1f5c2e057d73fe22551385ae911088fb325	Brayan	Choque	brayan@gmail.com	administrador	t	2026-11-19 17:02:06.348	2026-11-18 23:59:26.540252	2026-11-19 17:02:06.352017
\.


--
-- TOC entry 5297 (class 0 OID 0)
-- Dependencies: 239
-- Name: configuraciones_hotel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuraciones_hotel_id_seq', 1, false);


--
-- TOC entry 5298 (class 0 OID 0)
-- Dependencies: 247
-- Name: detalles_equipaje_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalles_equipaje_id_seq', 1, false);


--
-- TOC entry 5299 (class 0 OID 0)
-- Dependencies: 227
-- Name: detalles_reserva_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalles_reserva_id_seq', 3, true);


--
-- TOC entry 5300 (class 0 OID 0)
-- Dependencies: 245
-- Name: guardas_equipaje_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.guardas_equipaje_id_seq', 1, false);


--
-- TOC entry 5301 (class 0 OID 0)
-- Dependencies: 221
-- Name: habitaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.habitaciones_id_seq', 4, true);


--
-- TOC entry 5302 (class 0 OID 0)
-- Dependencies: 223
-- Name: huespedes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.huespedes_id_seq', 4, true);


--
-- TOC entry 5303 (class 0 OID 0)
-- Dependencies: 251
-- Name: incidentes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.incidentes_id_seq', 1, false);


--
-- TOC entry 5304 (class 0 OID 0)
-- Dependencies: 233
-- Name: movimientos_caja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientos_caja_id_seq', 1, true);


--
-- TOC entry 5305 (class 0 OID 0)
-- Dependencies: 229
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_seq', 3, true);


--
-- TOC entry 5306 (class 0 OID 0)
-- Dependencies: 255
-- Name: registros_auditoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registros_auditoria_id_seq', 1, false);


--
-- TOC entry 5307 (class 0 OID 0)
-- Dependencies: 225
-- Name: reservas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservas_id_seq', 3, true);


--
-- TOC entry 5308 (class 0 OID 0)
-- Dependencies: 243
-- Name: servicios_adicionales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicios_adicionales_id_seq', 1, true);


--
-- TOC entry 5309 (class 0 OID 0)
-- Dependencies: 257
-- Name: sesiones_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sesiones_usuario_id_seq', 11, true);


--
-- TOC entry 5310 (class 0 OID 0)
-- Dependencies: 237
-- Name: solicitudes_mantenimiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitudes_mantenimiento_id_seq', 1, false);


--
-- TOC entry 5311 (class 0 OID 0)
-- Dependencies: 235
-- Name: tareas_limpieza_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tareas_limpieza_id_seq', 1, false);


--
-- TOC entry 5312 (class 0 OID 0)
-- Dependencies: 241
-- Name: tarifas_servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tarifas_servicios_id_seq', 1, true);


--
-- TOC entry 5313 (class 0 OID 0)
-- Dependencies: 219
-- Name: tipos_habitacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_habitacion_id_seq', 6, true);


--
-- TOC entry 5314 (class 0 OID 0)
-- Dependencies: 249
-- Name: tipos_incidente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_incidente_id_seq', 1, false);


--
-- TOC entry 5315 (class 0 OID 0)
-- Dependencies: 231
-- Name: turnos_caja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.turnos_caja_id_seq', 1, true);


--
-- TOC entry 5316 (class 0 OID 0)
-- Dependencies: 253
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 2, true);


--
-- TOC entry 4996 (class 2606 OID 18777)
-- Name: reservas PK_309c659053bcf5e56f8e40a2b42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT "PK_309c659053bcf5e56f8e40a2b42" PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 18792)
-- Name: detalles_reserva PK_3373bc4b5cb8594aea06c255e00; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_reserva
    ADD CONSTRAINT "PK_3373bc4b5cb8594aea06c255e00" PRIMARY KEY (id);


--
-- TOC entry 5003 (class 2606 OID 18809)
-- Name: pagos PK_37321ca70a2ed50885dc205beb2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "PK_37321ca70a2ed50885dc205beb2" PRIMARY KEY (id);


--
-- TOC entry 5059 (class 2606 OID 19091)
-- Name: registros_auditoria PK_52a47d9f5f33f509ae83e56a747; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_auditoria
    ADD CONSTRAINT "PK_52a47d9f5f33f509ae83e56a747" PRIMARY KEY (id);


--
-- TOC entry 5040 (class 2606 OID 19019)
-- Name: tipos_incidente PK_55c0b2f01660d99c8331d9375eb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_incidente
    ADD CONSTRAINT "PK_55c0b2f01660d99c8331d9375eb" PRIMARY KEY (id);


--
-- TOC entry 5017 (class 2606 OID 18895)
-- Name: solicitudes_mantenimiento PK_5657dc453f003e189bfbc058bf2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_mantenimiento
    ADD CONSTRAINT "PK_5657dc453f003e189bfbc058bf2" PRIMARY KEY (id);


--
-- TOC entry 5023 (class 2606 OID 18933)
-- Name: tarifas_servicios PK_623741759c4d82cc0f02e5d68c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarifas_servicios
    ADD CONSTRAINT "PK_623741759c4d82cc0f02e5d68c2" PRIMARY KEY (id);


--
-- TOC entry 4992 (class 2606 OID 18754)
-- Name: huespedes PK_7bbb4dd385151b83ae9a9608e63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.huespedes
    ADD CONSTRAINT "PK_7bbb4dd385151b83ae9a9608e63" PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 18733)
-- Name: habitaciones PK_8c9da53b9b028aa9c4974228948; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitaciones
    ADD CONSTRAINT "PK_8c9da53b9b028aa9c4974228948" PRIMARY KEY (id);


--
-- TOC entry 5006 (class 2606 OID 18831)
-- Name: turnos_caja PK_a03721ede79454a666476ef5bc2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.turnos_caja
    ADD CONSTRAINT "PK_a03721ede79454a666476ef5bc2" PRIMARY KEY (id);


--
-- TOC entry 5009 (class 2606 OID 18849)
-- Name: movimientos_caja PK_a35825837a156d21e0b922fa627; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos_caja
    ADD CONSTRAINT "PK_a35825837a156d21e0b922fa627" PRIMARY KEY (id);


--
-- TOC entry 5019 (class 2606 OID 18913)
-- Name: configuraciones_hotel PK_a7da76545471369dbf74819bbe1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuraciones_hotel
    ADD CONSTRAINT "PK_a7da76545471369dbf74819bbe1" PRIMARY KEY (id);


--
-- TOC entry 5063 (class 2606 OID 19110)
-- Name: sesiones_usuario PK_be14eb22d2e8fbf2ca6c3fe0d56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones_usuario
    ADD CONSTRAINT "PK_be14eb22d2e8fbf2ca6c3fe0d56" PRIMARY KEY (id);


--
-- TOC entry 5035 (class 2606 OID 18996)
-- Name: detalles_equipaje PK_cf509189a58c4161cdc79a6b8a9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_equipaje
    ADD CONSTRAINT "PK_cf509189a58c4161cdc79a6b8a9" PRIMARY KEY (id);


--
-- TOC entry 5049 (class 2606 OID 19070)
-- Name: usuarios PK_d7281c63c176e152e4c531594a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY (id);


--
-- TOC entry 5047 (class 2606 OID 19045)
-- Name: incidentes PK_d9f29a635ef24ef24bae799468d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT "PK_d9f29a635ef24ef24bae799468d" PRIMARY KEY (id);


--
-- TOC entry 5028 (class 2606 OID 18955)
-- Name: servicios_adicionales PK_e061d20e5f8747c50bc85958265; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios_adicionales
    ADD CONSTRAINT "PK_e061d20e5f8747c50bc85958265" PRIMARY KEY (id);


--
-- TOC entry 4986 (class 2606 OID 18714)
-- Name: tipos_habitacion PK_e812143a9cd32678eede7956c8c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_habitacion
    ADD CONSTRAINT "PK_e812143a9cd32678eede7956c8c" PRIMARY KEY (id);


--
-- TOC entry 5013 (class 2606 OID 18870)
-- Name: tareas_limpieza PK_f85148ed3c131ea6eb765ea77ef; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas_limpieza
    ADD CONSTRAINT "PK_f85148ed3c131ea6eb765ea77ef" PRIMARY KEY (id);


--
-- TOC entry 5032 (class 2606 OID 18975)
-- Name: guardas_equipaje PK_f9410058e005a6a0d2a4a3d43b3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guardas_equipaje
    ADD CONSTRAINT "PK_f9410058e005a6a0d2a4a3d43b3" PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 18735)
-- Name: habitaciones UQ_054701e5924a6c0a315be7fde31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitaciones
    ADD CONSTRAINT "UQ_054701e5924a6c0a315be7fde31" UNIQUE (numero);


--
-- TOC entry 4994 (class 2606 OID 18756)
-- Name: huespedes UQ_0a0ae6ceeeb9ea057d399b3964d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.huespedes
    ADD CONSTRAINT "UQ_0a0ae6ceeeb9ea057d399b3964d" UNIQUE (numero_documento);


--
-- TOC entry 5051 (class 2606 OID 19072)
-- Name: usuarios UQ_1a7a36f3dffef210b4c0ba5c6c0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "UQ_1a7a36f3dffef210b4c0ba5c6c0" UNIQUE (nombre_usuario);


--
-- TOC entry 4998 (class 2606 OID 18779)
-- Name: reservas UQ_2f55196a3fa1ee518b9d9b937ba; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT "UQ_2f55196a3fa1ee518b9d9b937ba" UNIQUE (codigo_reserva);


--
-- TOC entry 5065 (class 2606 OID 19112)
-- Name: sesiones_usuario UQ_34571936919db1176203292668d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones_usuario
    ADD CONSTRAINT "UQ_34571936919db1176203292668d" UNIQUE (token_identificador);


--
-- TOC entry 5053 (class 2606 OID 19074)
-- Name: usuarios UQ_63665765c1a778a770c9bd585d3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "UQ_63665765c1a778a770c9bd585d3" UNIQUE (correo);


--
-- TOC entry 5037 (class 2606 OID 18998)
-- Name: detalles_equipaje UQ_7786124face94568689756f3acd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_equipaje
    ADD CONSTRAINT "UQ_7786124face94568689756f3acd" UNIQUE (codigo);


--
-- TOC entry 5025 (class 2606 OID 18935)
-- Name: tarifas_servicios UQ_913909d9104a329e4e1859c94fd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarifas_servicios
    ADD CONSTRAINT "UQ_913909d9104a329e4e1859c94fd" UNIQUE (nombre);


--
-- TOC entry 5042 (class 2606 OID 19021)
-- Name: tipos_incidente UQ_e02cbf48e2869b69c617c6c6de3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_incidente
    ADD CONSTRAINT "UQ_e02cbf48e2869b69c617c6c6de3" UNIQUE (nombre);


--
-- TOC entry 5055 (class 1259 OID 19092)
-- Name: IDX_auditoria_entidad; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_auditoria_entidad" ON public.registros_auditoria USING btree (entidad, entidad_id);


--
-- TOC entry 5056 (class 1259 OID 19093)
-- Name: IDX_auditoria_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_auditoria_fecha" ON public.registros_auditoria USING btree (fecha_accion);


--
-- TOC entry 5057 (class 1259 OID 19094)
-- Name: IDX_auditoria_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_auditoria_usuario" ON public.registros_auditoria USING btree (usuario_id);


--
-- TOC entry 5033 (class 1259 OID 18999)
-- Name: IDX_detalle_equipaje_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_detalle_equipaje_estado" ON public.detalles_equipaje USING btree (estado);


--
-- TOC entry 5029 (class 1259 OID 18976)
-- Name: IDX_guardas_equipaje_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_guardas_equipaje_estado" ON public.guardas_equipaje USING btree (estado);


--
-- TOC entry 5030 (class 1259 OID 18977)
-- Name: IDX_guardas_equipaje_huesped; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_guardas_equipaje_huesped" ON public.guardas_equipaje USING btree (huesped_id);


--
-- TOC entry 5044 (class 1259 OID 19047)
-- Name: IDX_incidentes_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_incidentes_estado" ON public.incidentes USING btree (estado);


--
-- TOC entry 5045 (class 1259 OID 19046)
-- Name: IDX_incidentes_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_incidentes_fecha" ON public.incidentes USING btree (fecha_reporte);


--
-- TOC entry 5014 (class 1259 OID 18896)
-- Name: IDX_mantenimiento_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_mantenimiento_estado" ON public.solicitudes_mantenimiento USING btree (estado);


--
-- TOC entry 5015 (class 1259 OID 18897)
-- Name: IDX_mantenimiento_habitacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_mantenimiento_habitacion" ON public.solicitudes_mantenimiento USING btree (habitacion_id);


--
-- TOC entry 5007 (class 1259 OID 18850)
-- Name: IDX_movimientos_caja_turno; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_movimientos_caja_turno" ON public.movimientos_caja USING btree (turno_caja_id);


--
-- TOC entry 5001 (class 1259 OID 18810)
-- Name: IDX_pagos_reserva; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_pagos_reserva" ON public.pagos USING btree (reserva_id);


--
-- TOC entry 5026 (class 1259 OID 18956)
-- Name: IDX_servicios_adicionales_reserva; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_servicios_adicionales_reserva" ON public.servicios_adicionales USING btree (reserva_id);


--
-- TOC entry 5060 (class 1259 OID 19113)
-- Name: IDX_sesiones_usuario_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sesiones_usuario_estado" ON public.sesiones_usuario USING btree (estado);


--
-- TOC entry 5061 (class 1259 OID 19114)
-- Name: IDX_sesiones_usuario_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sesiones_usuario_usuario" ON public.sesiones_usuario USING btree (usuario_id);


--
-- TOC entry 5010 (class 1259 OID 18871)
-- Name: IDX_tareas_limpieza_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tareas_limpieza_estado" ON public.tareas_limpieza USING btree (estado);


--
-- TOC entry 5011 (class 1259 OID 18872)
-- Name: IDX_tareas_limpieza_habitacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tareas_limpieza_habitacion" ON public.tareas_limpieza USING btree (habitacion_id);


--
-- TOC entry 5021 (class 1259 OID 18936)
-- Name: IDX_tarifas_servicios_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tarifas_servicios_activo" ON public.tarifas_servicios USING btree (activo);


--
-- TOC entry 5004 (class 1259 OID 18832)
-- Name: IDX_turnos_caja_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_turnos_caja_estado" ON public.turnos_caja USING btree (estado);


--
-- TOC entry 5020 (class 1259 OID 18914)
-- Name: UQ_configuracion_clave; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UQ_configuracion_clave" ON public.configuraciones_hotel USING btree (clave);


--
-- TOC entry 5038 (class 1259 OID 19000)
-- Name: UQ_detalle_equipaje_codigo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UQ_detalle_equipaje_codigo" ON public.detalles_equipaje USING btree (codigo);


--
-- TOC entry 5043 (class 1259 OID 19022)
-- Name: UQ_tipos_incidente_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UQ_tipos_incidente_nombre" ON public.tipos_incidente USING btree (nombre);


--
-- TOC entry 5054 (class 1259 OID 19075)
-- Name: UQ_usuarios_nombre_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UQ_usuarios_nombre_usuario" ON public.usuarios USING btree (nombre_usuario);


--
-- TOC entry 5074 (class 2606 OID 19160)
-- Name: servicios_adicionales FK_0fedaa2e37c758a4773e10b3d18; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios_adicionales
    ADD CONSTRAINT "FK_0fedaa2e37c758a4773e10b3d18" FOREIGN KEY (tarifa_servicio_id) REFERENCES public.tarifas_servicios(id) ON DELETE RESTRICT;


--
-- TOC entry 5072 (class 2606 OID 19145)
-- Name: tareas_limpieza FK_123464785503ca80c910604bd56; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas_limpieza
    ADD CONSTRAINT "FK_123464785503ca80c910604bd56" FOREIGN KEY (habitacion_id) REFERENCES public.habitaciones(id) ON DELETE RESTRICT;


--
-- TOC entry 5075 (class 2606 OID 19155)
-- Name: servicios_adicionales FK_2512e98c5b2c7dfe4277e609f1b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios_adicionales
    ADD CONSTRAINT "FK_2512e98c5b2c7dfe4277e609f1b" FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE RESTRICT;


--
-- TOC entry 5079 (class 2606 OID 19185)
-- Name: incidentes FK_37c788cfce209b0e44d9a9eb922; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT "FK_37c788cfce209b0e44d9a9eb922" FOREIGN KEY (huesped_id) REFERENCES public.huespedes(id) ON DELETE RESTRICT;


--
-- TOC entry 5070 (class 2606 OID 19135)
-- Name: pagos FK_3aaf58c87393e9ccbdccffe0f5b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "FK_3aaf58c87393e9ccbdccffe0f5b" FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE RESTRICT;


--
-- TOC entry 5076 (class 2606 OID 19170)
-- Name: guardas_equipaje FK_458b3350b7b7b9fab69a7a94d1a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guardas_equipaje
    ADD CONSTRAINT "FK_458b3350b7b7b9fab69a7a94d1a" FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE RESTRICT;


--
-- TOC entry 5080 (class 2606 OID 19190)
-- Name: incidentes FK_5449bcaea825c031d51cc2f4a8b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT "FK_5449bcaea825c031d51cc2f4a8b" FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE RESTRICT;


--
-- TOC entry 5077 (class 2606 OID 19165)
-- Name: guardas_equipaje FK_721b6be3a9f2789a78ded94946e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guardas_equipaje
    ADD CONSTRAINT "FK_721b6be3a9f2789a78ded94946e" FOREIGN KEY (huesped_id) REFERENCES public.huespedes(id) ON DELETE RESTRICT;


--
-- TOC entry 5071 (class 2606 OID 19140)
-- Name: movimientos_caja FK_817993dc592a81e8f3964a634f5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos_caja
    ADD CONSTRAINT "FK_817993dc592a81e8f3964a634f5" FOREIGN KEY (turno_caja_id) REFERENCES public.turnos_caja(id) ON DELETE RESTRICT;


--
-- TOC entry 5078 (class 2606 OID 19175)
-- Name: detalles_equipaje FK_89bd7aea3e1cb4bd52882cbd88f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_equipaje
    ADD CONSTRAINT "FK_89bd7aea3e1cb4bd52882cbd88f" FOREIGN KEY (guarda_equipaje_id) REFERENCES public.guardas_equipaje(id) ON DELETE RESTRICT;


--
-- TOC entry 5081 (class 2606 OID 19180)
-- Name: incidentes FK_9c3e9cef1f72f59d86d06e74541; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT "FK_9c3e9cef1f72f59d86d06e74541" FOREIGN KEY (tipo_incidente_id) REFERENCES public.tipos_incidente(id) ON DELETE RESTRICT;


--
-- TOC entry 5066 (class 2606 OID 19115)
-- Name: habitaciones FK_a0993e2d23bc3940f454cdac745; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitaciones
    ADD CONSTRAINT "FK_a0993e2d23bc3940f454cdac745" FOREIGN KEY (tipo_habitacion_id) REFERENCES public.tipos_habitacion(id);


--
-- TOC entry 5067 (class 2606 OID 19120)
-- Name: reservas FK_a80edfb022944df8ac9af814925; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT "FK_a80edfb022944df8ac9af814925" FOREIGN KEY (huesped_id) REFERENCES public.huespedes(id);


--
-- TOC entry 5084 (class 2606 OID 19205)
-- Name: sesiones_usuario FK_ae701bc730410988aebc6cf58ad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones_usuario
    ADD CONSTRAINT "FK_ae701bc730410988aebc6cf58ad" FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- TOC entry 5073 (class 2606 OID 19150)
-- Name: solicitudes_mantenimiento FK_b9501eb513affaaa172a3f66a87; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_mantenimiento
    ADD CONSTRAINT "FK_b9501eb513affaaa172a3f66a87" FOREIGN KEY (habitacion_id) REFERENCES public.habitaciones(id) ON DELETE RESTRICT;


--
-- TOC entry 5083 (class 2606 OID 19200)
-- Name: registros_auditoria FK_d6689562c5d3417485e11acb63e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_auditoria
    ADD CONSTRAINT "FK_d6689562c5d3417485e11acb63e" FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5082 (class 2606 OID 19195)
-- Name: incidentes FK_dfa7c6b5b9fa3d01548a497e41d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT "FK_dfa7c6b5b9fa3d01548a497e41d" FOREIGN KEY (habitacion_id) REFERENCES public.habitaciones(id) ON DELETE RESTRICT;


--
-- TOC entry 5068 (class 2606 OID 19125)
-- Name: detalles_reserva FK_e10c790c4433137fbcccf669a2c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_reserva
    ADD CONSTRAINT "FK_e10c790c4433137fbcccf669a2c" FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE CASCADE;


--
-- TOC entry 5069 (class 2606 OID 19130)
-- Name: detalles_reserva FK_f32348d5bc39a8d8c060de935dd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_reserva
    ADD CONSTRAINT "FK_f32348d5bc39a8d8c060de935dd" FOREIGN KEY (habitacion_id) REFERENCES public.habitaciones(id);


-- Completed on 2026-11-19 17:07:12

--
-- PostgreSQL database dump complete
--

\unrestrict GozRo5hpGzukcxacKxU77SpkyDHHZsOdEgToqcjwbwzSUiuLUtLQdxqqWxP0BXW

