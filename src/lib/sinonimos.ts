
export const CATALOGO_BASE = {
  // ---- CUADERNOS ----
  "cuaderno_100h_rayado": {
    canonico: "Cuaderno 100 hojas rayado",
    sinonimos: [
      "cuaderno 100 hojas líneas",
      "cuaderno 100h rayado",
      "cuaderno universitario 100h una línea",
      "cuaderno 100 hojas una linea",
      "cuaderno 100 rayado",
      "cuaderno 100h lineas",
      "cuad. 100h rayado"
    ],
    atributos: { hojas: 100, formato: "universitario", tipo: "rayado" }
  },
  "cuaderno_100h_cuadriculado_5mm": {
    canonico: "Cuaderno 100 hojas cuadriculado 5mm",
    sinonimos: [
      "cuaderno 100h cuadriculado",
      "cuaderno cuadrícula 5mm",
      "cuaderno cuadriculado 5mm",
      "cuaderno matemáticas 100h",
      "cuaderno 100 hojas cuadros"
    ],
    atributos: { hojas: 100, formato: "universitario", tipo: "cuadriculado", cuadricula_mm: 5 }
  },
  "repuesto_universitario_rayado": {
    canonico: "Repuesto universitario rayado",
    sinonimos: [
      "hojas sueltas universitarias rayadas",
      "repuesto universitario líneas",
      "repuesto hojas rayadas",
      "hojas universitarias rayadas"
    ],
    atributos: { tipo: "rayado", tamaño: "universitario" }
  },

  // ---- PAPELERÍA / FORMATOS ----
  "papel_bond_a4_75g": {
    canonico: "Papel bond A4 75g (resma)",
    sinonimos: [
      "resma a4 75g",
      "papel a4 75 gramos",
      "bond a4 75",
      "resma bond a4",
      "papel carta a4 75g"
    ],
    atributos: { tamaño: "A4", gramaje_gm2: 75, presentacion: "resma" }
  },
  "papel_bond_oficio_75g": {
    canonico: "Papel bond Oficio 75g (resma)",
    sinonimos: [
      "resma oficio 75g",
      "papel oficio 75 gramos",
      "bond oficio 75",
      "resma bond oficio"
    ],
    atributos: { tamaño: "Oficio", gramaje_gm2: 75, presentacion: "resma" }
  },

  // ---- ARCHIVOS / CARPETAS ----
  "folder_rapido": {
    canonico: "Folder rápido (con broche)",
    sinonimos: [
      "folder con broche",
      "carpeta rápida",
      "broche legajador",
      "folder fastener",
      "carpeta con ganchos"
    ]
  },
  "micas_tamaño_oficio": {
    canonico: "Micas tamaño Oficio (funda plástica)",
    sinonimos: [
      "fundas plásticas oficio",
      "micas oficio",
      "fundas oficio",
      "funda mica oficio"
    ],
    atributos: { tamaño: "Oficio" }
  },
  "carpeta_plastica_con_vincha": {
    canonico: "Carpeta plástica con vincha",
    sinonimos: [
      "carpeta con vincha",
      "carpeta plástica con liga",
      "carpeta elástica",
      "carpeta con banda"
    ]
  },
  "archivador_palanca": {
    canonico: "Archivador de palanca",
    sinonimos: [
      "carpeta de palanca",
      "archivador palanca oficio",
      "folder palanca"
    ]
  },

  // ---- ESCRITURA ----
  "lapiz_hb": {
    canonico: "Lápiz HB",
    sinonimos: [
      "lápiz número 2",
      "lapiz #2",
      "lápiz grafito hb",
      "lapiz escolar hb"
    ],
    atributos: { dureza: "HB" }
  },
  "portaminas_0_5": {
    canonico: "Portaminas 0.5 mm",
    sinonimos: [
      "lapicero mecánico 0.5",
      "portaminas 0,5",
      "portaminas 05"
    ],
    atributos: { mina_mm: 0.5 }
  },
  "minas_0_5": {
    canonico: "Minas 0.5 mm",
    sinonimos: [
      "cargas 0.5",
      "repues tos portaminas 0.5",
      "minas para portaminas 0,5"
    ],
    atributos: { mina_mm: 0.5 }
  },
  "boligrafo_azul": {
    canonico: "Bolígrafo azul",
    sinonimos: [
      "esfero azul",
      "esferográfico azul",
      "lapicero azul",
      "bic azul"
    ],
    atributos: { color: "azul" }
  },
  "resaltador": {
    canonico: "Resaltador (marcatexto)",
    sinonimos: [
      "marcatexto",
      "marcador fluorescente",
      "stabilo"
    ]
  },
  "corrector": {
    canonico: "Corrector (líquido o lápiz)",
    sinonimos: [
      "liquid paper",
      "blanco",
      "corrector en cinta",
      "cinta correctora"
    ]
  },

  // ---- DIBUJO / ARTE ----
  "temperas": {
    canonico: "Témperas surtidas",
    sinonimos: [
      "pinturas témpera",
      "tempera",
      "pinturas escolares"
    ]
  },
  "acuarelas": {
    canonico: "Acuarelas",
    sinonimos: [
      "pastillas de acuarela",
      "pinturas de agua"
    ]
  },
  "pincel_redondo_n6": {
    canonico: "Pincel redondo N°6",
    sinonimos: [
      "pincel nro 6",
      "pincel #6 redondo",
      "pincel redondo 6"
    ],
    atributos: { tipo: "redondo", numero: 6 }
  },
  "cartulina_bristol_blanca": {
    canonico: "Cartulina bristol blanca",
    sinonimos: [
      "bristol blanca",
      "cartulina blanca bristol"
    ]
  },
  "microporoso_foamy": {
    canonico: "Microporoso (foamy)",
    sinonimos: [
      "foamy",
      "goma eva",
      "microporoso"
    ]
  },
  "papel_lustre": {
    canonico: "Papel lustre",
    sinonimos: [
      "papel charol",
      "papel brillante colores"
    ]
  },
  "papel_seda": {
    canonico: "Papel seda",
    sinonimos: [
      "papel tissue",
      "papel de seda"
    ]
  },
  "papel_crepe": {
    canonico: "Papel crepé",
    sinonimos: [
      "papel crespón",
      "papel corrugado fino"
    ]
  },
  "plastilina": {
    canonico: "Plastilina",
    sinonimos: [
      "masa moldeable",
      "arcilla escolar (plastilina)"
    ]
  },

  // ---- ADHESIVOS / CINTAS ----
  "goma_blanca": {
    canonico: "Goma blanca (pegamento escolar)",
    sinonimos: [
      "colbón",
      "cola blanca",
      "pegamento escolar"
    ]
  },
  "pegamento_en_barra": {
    canonico: "Pegamento en barra",
    sinonimos: [
      "goma en barra",
      "stick glue",
      "barrita adhesiva"
    ]
  },
  "silicona_liquida": {
    canonico: "Silicona líquida",
    sinonimos: [
      "pegamento silicona",
      "silicón líquido"
    ]
  },
  "cinta_masking": {
    canonico: "Cinta masking",
    sinonimos: [
      "cinta de enmascarar",
      "masking tape",
      "cinta papel"
    ]
  },
  "cinta_adhesiva_transparente": {
    canonico: "Cinta adhesiva transparente",
    sinonimos: [
      "cinta scotch",
      "cinta transparente",
      "teipe transparente"
    ]
  },
  "cinta_embalaje": {
    canonico: "Cinta de embalaje",
    sinonimos: [
      "cinta canela",
      "cinta café",
      "cinta de empaque"
    ]
  },

  // ---- GEOMETRÍA / MEDICIÓN ----
  "regla_30cm": {
    canonico: "Regla 30 cm",
    sinonimos: [
      "regla 30",
      "regla treinta cm",
      "regla plástica 30cm"
    ],
    atributos: { longitud_cm: 30 }
  },
  "escuadra_45": {
    canonico: "Escuadra 45°",
    sinonimos: [
      "escuadra de 45",
      "escuadra ángulo 45"
    ]
  },
  "escuadra_60": {
    canonico: "Escuadra 60°",
    sinonimos: [
      "escuadra de 60",
      "escuadra ángulo 60"
    ]
  },
  "transportador": {
    canonico: "Transportador",
    sinonimos: [
      "semicírculo",
      "transportador de ángulos"
    ]
  },
  "compas": {
    canonico: "Compás",
    sinonimos: [
      "compás escolar",
      "compas"
    ]
  },
  "juego_geometria": {
    canonico: "Juego de geometría (regla, escuadras, transportador)",
    sinonimos: [
      "set de geometría",
      "kit de geometría"
    ]
  },

  // ---- CORTE / ORGANIZACIÓN ----
  "tijera_punta_roma": {
    canonico: "Tijera punta roma",
    sinonimos: [
      "tijeras escolares",
      "tijera sin punta",
      "tijera punta redonda"
    ]
  },
  "grapadora_pequeña": {
    canonico: "Grapadora pequeña",
    sinonimos: [
      "engrampadora",
      "abrochadora pequeña"
    ]
  },
  "grapas_24_6": {
    canonico: "Grapas 24/6",
    sinonimos: [
      "grapas pequeñas",
      "grapas estándar",
      "grapas 24-6"
    ]
  },
  "perforadora": {
    canonico: "Perforadora",
    sinonimos: [
      "perforador de papel",
      "taladradora de hojas"
    ]
  },
  "clips": {
    canonico: "Clips",
    sinonimos: [
      "clip para papel",
      "clips metálicos",
      "clips sujetapapeles"
    ]
  },
  "borrador_blanco": {
    canonico: "Borrador blanco",
    sinonimos: [
      "goma de borrar",
      "borrador vinílico",
      "borrador escolar"
    ]
  },
  "sacapuntas": {
    canonico: "Sacapuntas",
    sinonimos: [
      "tajalápiz",
      "saca puntas",
      "afilalápiz"
    ]
  },

  // ---- VARIOS / TEC ----
  "calculadora_basica": {
    canonico: "Calculadora básica",
    sinonimos: [
      "calculadora simple",
      "calculadora escolar"
    ]
  },
  "estuche": {
    canonico: "Estuche escolar",
    sinonimos: [
      "cartuchera",
      "cartuchera escolar"
    ]
  },
  "mochila": {
    canonico: "Mochila escolar",
    sinonimos: [
      "maleta escolar",
      "backpack"
    ]
  },
  "lonchera": {
    canonico: "Lonchera",
    sinonimos: [
      "lunchera",
      "portaalimentos"
    ]
  }
} as const;
