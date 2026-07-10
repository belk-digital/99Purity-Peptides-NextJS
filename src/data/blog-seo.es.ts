// Spanish counterpart to blog-seo.ts. Keyed the same way (by slug), consumed by
// src/app/[locale]/(frontend)/[slug]/page.tsx when locale === 'es'. `schemas` is left empty
// for every entry — the English `schemas` arrays contain rich FAQ/HowTo/Article JSON-LD with
// deep technical Q&A content that hasn't been translated, and shipping that English structured
// data on an `es` page would mismatch the page's declared language. Leaving `schemas: []` here
// makes the page fall back to its own default BlogPosting/BreadcrumbList JSON-LD, which is
// already built from the (correctly localized) Spanish post title/excerpt.
export const BLOG_SEO_ES: Record<string, { title: string | null, description: string | null, schemas: any[] }> = {
  "reconstituted-peptide-stability-storage": {
    "title": "Estabilidad de Péptidos Reconstituidos: Guía de Almacenamiento e Investigación 2026",
    "description": "Guía completa sobre la estabilidad de péptidos reconstituidos, mecanismos de degradación y protocolos óptimos de almacenamiento para la integridad de la investigación de laboratorio.",
    "schemas": []
  },
  "bpc-157-tb-500-stack-research": {
    "title": "BPC-157 TB-500 Stack: Investigación Sinérgica y Mecanismos",
    "description": "Explora la sinergia del stack BPC-157 TB-500 en modelos preclínicos. Análisis de mecanismos de reparación tisular, vías de angiogénesis e investigación emergente.",
    "schemas": []
  },
  "tesamorelin-visceral-fat-research": {
    "title": "Investigación de Tesamorelina y Grasa Visceral: Datos Clínicos 2025",
    "description": "Los ensayos de Fase III muestran que la tesamorelina reduce la grasa visceral en un 69% en 26 semanas. Aprende cómo este análogo de GHRH actúa sobre el VAT frente a CJC-1295.",
    "schemas": []
  },
  "retatrutide-cancer-research-preclinical-studies": {
    "title": "Investigación de Retatrutida y Cáncer: Estudios Preclínicos 2026",
    "description": "Nuevos estudios preclínicos muestran los efectos de la retatrutida en células de cáncer pancreático, pulmonar y de mama. Descubre lo que revela la investigación sobre el triple receptor.",
    "schemas": []
  },
  "research-peptide-storage-best-practices": {
    "title": "Almacenamiento de Péptidos de Investigación en Laboratorios | 99PurityPeptides",
    "description": "Guía completa de laboratorio para almacenar péptidos de investigación. Requisitos de temperatura y prevención de degradación para resultados reproducibles.",
    "schemas": []
  },
  "what-are-research-peptides-complete-laboratory-guide-2026": {
    "title": "¿Qué Son los Péptidos de Investigación? Guía Completa de Laboratorio (2026)",
    "description": "¿Qué son los péptidos de investigación? Aprende cómo se producen, prueban en pureza y clasifican los péptidos sintéticos de investigación para uso de laboratorio.",
    "schemas": []
  },
  "top-peptides-for-metabolic-studies": {
    "title": "Los Mejores Péptidos para la Investigación Metabólica en 2026",
    "description": "Explora los péptidos para la investigación metabólica en 2026, incluyendo BPC-157, TB-500, MOTS-C y AOD-9604.",
    "schemas": []
  },
  "everything-lab-researchers-need-to-know-about-bpc-157": {
    "title": "Todo Lo Que los Investigadores Deben Saber Sobre BPC-157",
    "description": "Explora la investigación de BPC-157, estudios de laboratorio, mecanismo de acción y estado regulatorio. Una visión científica para profesionales de la investigación.",
    "schemas": []
  },
  "collagen-peptides-benefits": {
    "title": "Beneficios de los Péptidos de Colágeno: Guía Respaldada por la Ciencia (2026)",
    "description": "Descubre los principales beneficios de los péptidos de colágeno, respaldados por la ciencia, para la piel, las articulaciones, los huesos y los músculos. Colágeno hidrolizado de grado investigación disponible en 99 Purity Peptides.",
    "schemas": []
  },
  "collagen-peptides-vs-peptide-therapy-skin": {
    "title": "Péptidos de Colágeno vs Terapia con Péptidos para la Piel (2026)",
    "description": "Péptidos de colágeno vs. terapia con péptidos para la piel: comparamos GHK-Cu y el colágeno hidrolizado, lo que muestra la investigación y dónde encaja cada uno. Péptidos de investigación RUO.",
    "schemas": []
  },
  "klow-peptide-blend-research-guide-2026": {
    "title": "Mezcla de Péptidos KLOW: Guía de Investigación 2026, Beneficios y Dosis",
    "description": "Mezcla de péptidos KLOW: composición verificada de 50/10/10/10mg, BPC-157, TB-500, KPV, GHK-Cu. Beneficios de investigación, tabla de dosis, comparación KLOW vs GLOW. Referencia 2026.",
    "schemas": []
  },
  "peptide-calculator-reconstitution-guide": {
    "title": "Guía Definitiva de la Calculadora de Péptidos | Protocolos de Laboratorio en EE. UU.",
    "description": "Domina la reconstitución de péptidos con nuestra calculadora interactiva. Aprende las proporciones de agua bacteriostática, las conversiones de mcg a mg y las técnicas estériles para laboratorios de EE. UU.",
    "schemas": []
  },
  "retatrutide-and-carbs": {
    "title": "Retatrutida y Carbohidratos: ¿Necesita Glucosa Este Triple Agonista?",
    "description": "¿Requiere la Retatrutida carbohidratos para funcionar? Explora la ciencia detrás del triple agonismo, la actividad del receptor de glucagón y el metabolismo de carbohidratos en la investigación.",
    "schemas": []
  },
  "retatrutide-weight-loss-research-guide-2026": {
    "title": "Retatrutida para la Pérdida de Peso: Guía de Referencia de Investigación 2026",
    "description": "Referencia para uso exclusivo en investigación sobre la retatrutida (LY3437943), el agonista triple investigacional de receptores hormonales (GLP-1, GIP, glucagón) de Eli Lilly, en estudio para la obesidad y afecciones relacionadas.",
    "schemas": []
  },
  "peptide-reconstitution-calculator": {
    "title": "Calculadora de Péptidos: Herramienta de Dosificación y Reconstitución | 99 Purity Peptides",
    "description": "Resultados precisos de la calculadora de péptidos en segundos. Introduce el tamaño de tu vial, el volumen de agua bacteriostática y la dosis objetivo — nuestra herramienta convierte al instante tu dosificación de péptidos en unidades de jeringa precisas.",
    "schemas": []
  },
  "retatrutide-peptide-research-guide": {
    "title": "Péptido Retatrutida: Guía de Referencia de Investigación 2026",
    "description": "Retatrutida explicada: mecanismo de triple agonista, datos de la Fase 3 TRIUMPH-1, estado ante la FDA y manejo en laboratorio. Una referencia neutral de uso exclusivo en investigación.",
    "schemas": []
  },
  "ghk-cu-copper-peptide-research-guide": {
    "title": "Péptido GHK-Cu: Guía de Investigación Completa 2026",
    "description": "Referencia de investigación sobre el péptido GHK-Cu: mecanismo, evidencia de la vía del colágeno, manejo en laboratorio, estándares de pureza y más de 35 preguntas frecuentes basadas en estudios revisados por pares.",
    "schemas": []
  },
  "tesamorelin-visceral-fat-reduction-percentage": {
    "title": "Porcentaje de Reducción de Grasa Visceral con Tesamorelina | Datos del Ensayo de Fase 3",
    "description": "¿Qué porcentaje de grasa visceral reduce la tesamorelina en investigación? Los ensayos clínicos de Fase 3 reportan una reducción de VAT de aproximadamente 15-18% cerca de las 26 semanas. Revisa los datos, los plazos y los estándares de referencia.",
    "schemas": []
  },
};
