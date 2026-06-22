import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const CATEGORY_NAMES = [
  'Bioregulators',
  'Cellular Health Research',
  'Cognitive Function Studies',
  'Essentials',
  'Growth Factor Research Peptides',
  'Metabolic Research Peptides',
  'Receptor Agonist Research Peptides',
  'Recovery Research Peptides'
]

const PRODUCTS_DATA = [
  {
    title: 'Tirzepatide',
    desc: 'Tirzepatide is a novel dual glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist. Extensively studied in metabolic research, it demonstrates profound synergistic effects on glycemic control, energy homeostasis, and weight reduction pathways. [1] In laboratory models, Tirzepatide activation of both receptors significantly outperforms selective GLP-1 analogues in metabolic modulation. Researchers utilize this compound to map complex endocrine feedback loops and investigate novel therapeutic avenues for metabolic disorders. This research-grade peptide is synthesized for strictly controlled in-vitro and animal model studies investigating insulin sensitivity and lipid metabolism.',
    focus: 'Metabolic pathway modulation, GIP/GLP-1 dual receptor signaling, energy homeostasis, insulin sensitivity.',
    categories: ['Metabolic Research Peptides', 'Receptor Agonist Research Peptides']
  },
  {
    title: 'Semax',
    desc: 'Semax is a synthetic peptide derived from an adrenocorticotropic hormone (ACTH) fragment. Primarily investigated in cognitive and neurobiological research, Semax acts as a powerful neuroprotector and cognitive enhancer in laboratory models. It operates by modulating brain-derived neurotrophic factor (BDNF) expression and enhancing serotonergic and dopaminergic signaling. [2] Researchers utilize Semax to study synaptic plasticity, memory formation, and neurorecovery following hypoxic or ischemic events. Its unique metabolic stability compared to native ACTH makes it a critical tool for longitudinal neurological investigations.',
    focus: 'Neuroprotection, BDNF modulation, cognitive enhancement, synaptic plasticity, monoamine signaling.',
    categories: ['Cognitive Function Studies', 'Recovery Research Peptides']
  },
  {
    title: 'Selank',
    desc: 'Selank is a synthetic heptapeptide analogue of the naturally occurring immunomodulatory peptide tuftsin. It exhibits profound anxiolytic and nootropic properties in behavioral models by modulating the expression of interleukin-6 (IL-6) and regulating the balance of neurotransmitters such as serotonin and enkephalins. [3] Selank is highly valued in cognitive research for studying stress-response mechanisms, anxiety modulation, and immune-brain axis communication without the sedative side effects common to traditional pharmacological agents.',
    focus: 'Anxiolytic mechanisms, immunomodulation, enkephalin regulation, stress-response mapping.',
    categories: ['Cognitive Function Studies', 'Bioregulators']
  },
  {
    title: 'Retatrutide',
    desc: 'Retatrutide is a revolutionary triple hormone receptor agonist targeting GLP-1, GIP, and Glucagon receptors. This advanced compound represents the frontier of metabolic disease research, exhibiting unprecedented efficacy in energy expenditure and systemic fat mass reduction in preclinical models. [4] By simultaneously activating three distinct but interacting endocrine pathways, Retatrutide offers researchers a robust model to study tri-agonist synergy, hepatic fat clearance, and comprehensive metabolic remodeling. It is essential for investigating extreme metabolic correction protocols in controlled laboratory settings.',
    focus: 'Triple receptor agonism (GLP-1/GIP/Glucagon), extreme metabolic remodeling, energy expenditure, hepatic fat clearance.',
    categories: ['Metabolic Research Peptides', 'Receptor Agonist Research Peptides']
  },
  {
    title: 'NAD+',
    desc: 'Nicotinamide Adenine Dinucleotide (NAD+) is a vital coenzyme found in all living cells, central to cellular metabolism and energy production. In research contexts, exogenous NAD+ and its precursors are studied for their profound role in cellular senescence, mitochondrial function, and sirtuin activation. [5] Laboratory applications involve investigating age-related metabolic decline, DNA repair mechanisms, and cellular resilience under oxidative stress. This highly purified compound allows researchers to accurately trace NAD+ salvage pathways and their systemic health implications.',
    focus: 'Mitochondrial function, sirtuin activation, cellular senescence, DNA repair pathways, oxidative stress.',
    categories: ['Cellular Health Research', 'Essentials']
  },
  {
    title: 'MOTS-c',
    desc: 'MOTS-c (Mitochondrial Derived Peptide) is a naturally occurring peptide encoded within the mitochondrial genome. It functions as a powerful metabolic regulator, primarily targeting skeletal muscle to enhance insulin sensitivity and promote metabolic homeostasis. [6] Researchers study MOTS-c to understand the retrograde signaling from mitochondria to the nucleus, illuminating how mitochondrial stress responses coordinate systemic metabolism. This peptide is critical for studies on exercise mimetics, AMPK activation, and age-related metabolic dysfunction.',
    focus: 'Mitochondrial-nuclear signaling, AMPK activation, exercise mimetics, skeletal muscle metabolism.',
    categories: ['Metabolic Research Peptides', 'Cellular Health Research']
  },
  {
    title: 'Klow',
    desc: 'Klow (proprietary research sequence) is investigated for its potential in advanced cellular regeneration and localized tissue repair. Operating through localized growth factor recruitment, Klow models exhibit accelerated fibroblast proliferation and extracellular matrix synthesis. Researchers employ this peptide to map rapid healing cascades and study the intersection of inflammatory response resolution and structural tissue rebuilding. It is a vital tool for experimental regenerative medicine protocols.',
    focus: 'Extracellular matrix synthesis, fibroblast proliferation, localized tissue repair, inflammatory resolution.',
    categories: ['Recovery Research Peptides', 'Growth Factor Research Peptides']
  },
  {
    title: 'Glow',
    desc: 'Glow (proprietary peptide matrix) is specifically formulated for dermatological and epidermal structural research. It targets collagen synthesis pathways and melanocyte regulation. In laboratory assays, Glow has demonstrated significant upregulation of Type I and Type III collagen precursors while mitigating oxidative damage at the cellular level. Researchers utilize this compound to study anti-aging cellular mechanisms, UV-induced damage repair, and skin barrier fortification models.',
    focus: 'Epidermal collagen synthesis, melanocyte regulation, oxidative stress mitigation, anti-aging cellular mechanisms.',
    categories: ['Cellular Health Research', 'Recovery Research Peptides']
  },
  {
    title: 'Ipamorelin',
    desc: 'Ipamorelin is a highly selective growth hormone secretagogue and ghrelin receptor agonist. Unlike other compounds in its class, Ipamorelin stimulates significant growth hormone release from the pituitary without concurrently elevating cortisol or prolactin levels. [7] This selectivity makes it an exceptional tool for researchers seeking to isolate the effects of growth hormone pulses on muscle hypertrophy, bone density, and lipolysis without confounding stress-hormone interactions. It is a cornerstone compound for clean endocrine axis investigation.',
    focus: 'Selective growth hormone secretion, ghrelin receptor agonism, clean endocrine mapping, bone density.',
    categories: ['Growth Factor Research Peptides', 'Receptor Agonist Research Peptides']
  },
  {
    title: 'Glutathione',
    desc: 'Glutathione (GSH) is the master antioxidant of the cell, a tripeptide comprising cysteine, glycine, and glutamine. It plays a critical role in neutralizing free radicals, detoxifying xenobiotics, and maintaining cellular redox states. [8] In research, high-purity glutathione is utilized to study oxidative stress resilience, cellular detoxification pathways, and the modulation of inflammatory cytokines. It is an essential control substance and investigational tool in virtually all cellular health and longevity laboratory models.',
    focus: 'Cellular redox homeostasis, xenobiotic detoxification, antioxidant defense mechanisms, inflammatory cytokine modulation.',
    categories: ['Essentials', 'Cellular Health Research']
  },
  {
    title: 'Semaglutide',
    desc: 'Semaglutide is a potent, long-acting GLP-1 receptor agonist that has fundamentally changed metabolic research. It mimics endogenous incretin hormones to stimulate insulin secretion, inhibit glucagon release, and delay gastric emptying. [9] Researchers utilize Semaglutide extensively to model sustained metabolic intervention, study appetite regulation in the central nervous system, and investigate cardiovascular protective mechanisms associated with prolonged GLP-1 activation. It remains the gold standard benchmark for modern metabolic pharmacology studies.',
    focus: 'GLP-1 receptor agonism, sustained metabolic intervention, appetite regulation, incretin mimetic pathways.',
    categories: ['Metabolic Research Peptides', 'Receptor Agonist Research Peptides']
  },
  {
    title: 'Cagrilintide',
    desc: 'Cagrilintide is a novel, long-acting synthetic amylin analogue investigated for its profound effects on satiety and energy intake. While GLP-1 agonists target specific metabolic nodes, Cagrilintide acts synergistically by delaying gastric emptying and modulating central satiety signals via the amylin receptor. [10] Research involving Cagrilintide often focuses on combinatory metabolic therapies, exploring how dual-pathway activation (e.g., combining with GLP-1s) can yield exponential reductions in adiposity and unparalleled metabolic control in laboratory models.',
    focus: 'Amylin receptor agonism, central satiety modulation, synergistic metabolic therapy, adiposity reduction.',
    categories: ['Metabolic Research Peptides', 'Receptor Agonist Research Peptides']
  },
  {
    title: 'Sermorelin',
    desc: 'Sermorelin is a synthetic 29-amino acid polypeptide representing the functional fragment of endogenous Growth Hormone-Releasing Hormone (GHRH). It is utilized by researchers to stimulate the pituitary gland to secrete natural human growth hormone in a physiological, pulsatile manner. [11] Unlike synthetic exogenous GH administration, Sermorelin allows researchers to study the natural endocrine feedback loop, preserving the hypothalamic-pituitary-somatotropic axis while investigating the downstream effects of elevated IGF-1 on tissue growth and repair.',
    focus: 'GHRH analogue, physiological pulsatile GH secretion, hypothalamic-pituitary-somatotropic axis, IGF-1 tracking.',
    categories: ['Growth Factor Research Peptides', 'Bioregulators']
  },
  {
    title: 'SNAP-8',
    desc: 'SNAP-8 (Octapeptide-3) is a synthetic elongation of the famous argireline hexapeptide. It functions by mimicking the N-terminal end of SNAP-25, thereby competing for a position in the SNARE complex and destabilizing its formation. [12] This mechanism effectively attenuates the release of acetylcholine at the neuromuscular junction, modeling localized muscle paralysis. Researchers utilize SNAP-8 to study neurotransmitter exocytosis, neuromuscular signaling pathways, and the development of topical anti-wrinkle cosmetic therapeutics in laboratory assays.',
    focus: 'SNARE complex destabilization, acetylcholine release attenuation, neuromuscular junction signaling, cosmetic peptide research.',
    categories: ['Bioregulators', 'Cellular Health Research']
  },
  {
    title: 'TB-500',
    desc: 'TB-500 is a synthetic version of the naturally occurring healing protein Thymosin Beta-4. It is universally recognized in research for its remarkable ability to upregulate cellular migration, promote angiogenesis, and rapidly accelerate localized wound healing. [13] TB-500 achieves this primarily through actin upregulation, facilitating the structural movement of cells to sites of tissue damage. It is an indispensable compound for researchers investigating muscle tear recovery, cardiovascular tissue regeneration, and advanced wound healing models.',
    focus: 'Thymosin Beta-4 analogue, actin upregulation, cellular migration, angiogenesis, rapid tissue regeneration.',
    categories: ['Recovery Research Peptides', 'Growth Factor Research Peptides']
  }
]

async function run() {
  console.log('Initializing Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  console.log('Cleaning up old Products and Categories...')
  const oldProducts = await payload.find({ collection: 'products', limit: 1000 })
  for (const p of oldProducts.docs) {
    try { await payload.delete({ collection: 'products', id: p.id }) } catch (e) {}
  }
  
  const oldCategories = await payload.find({ collection: 'categories', limit: 100 })
  for (const c of oldCategories.docs) {
    try { await payload.delete({ collection: 'categories', id: c.id }) } catch (e) {}
  }

  console.log('Seeding new Categories...')
  const categoryMap: Record<string, string> = {}
  for (const catName of CATEGORY_NAMES) {
    const created = await payload.create({
      collection: 'categories',
      data: {
        name: catName,
        slug: catName.toLowerCase().replace(/ /g, '-'),
      } as any
    })
    categoryMap[catName] = String(created.id)
  }

  console.log('Preparing default media (product-image.webp)...')
  const imagePath = path.resolve(process.cwd(), 'public/99 Images/product-image.webp')
  let defaultMediaId = ''
  if (fs.existsSync(imagePath)) {
    const fileData = fs.readFileSync(imagePath)
    const media = await payload.create({
      collection: 'media',
      data: { alt: 'Research Peptide Vial' },
      file: {
        data: fileData,
        mimetype: 'image/webp',
        name: 'product-image.webp',
        size: fs.statSync(imagePath).size,
      }
    })
    defaultMediaId = media.id
  } else {
    console.warn('WARNING: product-image.webp not found at expected path. Skipping media attachment.')
  }

  console.log('Seeding 15 custom Products...')

  const faqs = [
    { question: "What is the recommended storage temperature?", answer: "We recommend storing this compound at 2-8°C (36-46°F) to maintain optimal stability and prevent degradation. Lyophilized peptides should be kept away from direct light and moisture until reconstitution." },
    { question: "How long does it remain stable after reconstitution?", answer: "Once reconstituted with bacteriostatic water, the compound typically remains stable for 20-30 days when properly refrigerated. We advise against freezing and thawing cycles as they can damage the peptide bonds." },
    { question: "What purity standards do you maintain?", answer: "All our research compounds undergo strict HPLC and MS testing. We guarantee a minimum purity of 99%, ensuring that researchers receive the highest quality materials for their cellular studies with no heavy metals or unwanted synthetic byproducts." },
    { question: "Can this be used for human consumption?", answer: "No. All products available through our lab are strictly for laboratory research and in-vitro testing purposes only. They are not intended for human consumption, diagnostic, or therapeutic use." },
    { question: "What is the typical half-life of this compound?", answer: "In standard in-vitro models, the half-life varies depending on the surrounding enzymatic environment but generally ranges between 30 minutes to 2 hours. Protected analogs may demonstrate extended stability." },
    { question: "Are Certificates of Analysis (COAs) available?", answer: "Yes, every batch is independently tested by a third-party laboratory. We provide updated COAs detailing the exact purity percentage and mass spectrometry results upon request or directly on the product page." },
    { question: "How should I handle the lyophilized powder?", answer: "Always handle the vials in a clean, sterile environment. Use sterile gloves and wipe the vial stopper with an alcohol swab before introducing any reconstitution solvent. Avoid aggressive shaking." },
    { question: "What is the molecular weight?", answer: "The molecular weight is verified via mass spectrometry during our QA process. Exact specifications and chemical structural formulas are provided in the accompanying documentation for research precision." },
    { question: "Are there any specific solvent requirements?", answer: "For most applications, standard sterile bacteriostatic water is sufficient. However, for specific receptor-binding assays requiring distinct pH balances, sterile saline or specialized buffer solutions may be utilized per your protocol." },
    { question: "How is this shipped to prevent degradation?", answer: "We utilize temperature-controlled packaging with insulated barriers to ensure the lyophilized powder remains stable during transit, preventing thermal degradation before it reaches your laboratory." },
  ]

  for (const productData of PRODUCTS_DATA) {
    const { title, desc, focus, categories } = productData
    const basePrice = Math.floor(Math.random() * 150) + 80
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/\+/g, 'plus')

    // Find category IDs for this product
    const productCategoryIds = categories.map(c => categoryMap[c]).filter(Boolean)

    const compliance = `DISCLAIMER: This product is strictly for research and laboratory use only. It is not approved by the FDA or any global regulatory body for human consumption, veterinary use, or therapeutic application. The purchaser assumes all responsibility for the proper handling, storage, and application of this compound. It must only be handled by qualified professionals in a controlled laboratory setting. By purchasing this product, you agree to abide by all local and international laws regarding the use of research chemicals.`
    
    const qualityPurity = `Our peptides are synthesized utilizing Solid-Phase Peptide Synthesis (SPPS) ensuring an ultra-pure final product. Subsequent purification via preparative HPLC eliminates truncated sequences and deletion impurities. Final verification is achieved through Electrospray Ionization Mass Spectrometry (ESI-MS), confirming the exact molecular mass. We guarantee >99% purity across all batches. References available upon request.`

    const payloadData: any = {
      name: title,
      description: desc.substring(0, 150) + '...',
      seoTitle: `${title} Research Peptide | 99% Purity`,
      seoDescription: desc.substring(0, 160),
      slug: slug,
      sku: `SKU-${Math.floor(Math.random() * 90000)}`,
      price: basePrice,
      stock: 1000,
      weight: 0.05,
      dimensions: { length: 5, width: 2, height: 2 },
      categories: productCategoryIds,
      images: defaultMediaId ? [{ image: defaultMediaId }] : [],
      
      // Variants Setup
      hasVariants: true,
      variants: [
        { sku: `${slug}-5mg`, price: basePrice, stock: 500, options: [{ key: 'Size', value: '5mg' }] },
        { sku: `${slug}-10mg`, price: basePrice + 40, stock: 500, options: [{ key: 'Size', value: '10mg' }] },
        { sku: `${slug}-15mg`, price: basePrice + 75, stock: 500, options: [{ key: 'Size', value: '15mg' }] }
      ],

      // Bulk Bundles
      bulkBundles: [
        { name: '5 Kits (Bulk)', quantity: 5, discountPercentage: 15 },
        { name: '10 Kits (Wholesale)', quantity: 10, discountPercentage: 25 }
      ],

      averageRating: 5,
      reviewCount: Math.floor(Math.random() * 80) + 15,
      
      productDetailsTitle: 'Comprehensive Product Details',
      productDetailsDescription: desc,
      
      researchFocusTitle: 'Advanced Research Focus',
      researchFocusDescription: focus,
      
      qualityPurityTitle: 'Uncompromising Quality Standards',
      qualityPurityDescription: qualityPurity,
      
      complianceNoticeTitle: 'Legal & Compliance Notice',
      complianceNoticeDescription: compliance,
      
      faqs: faqs,
      status: 'active',
      isVisible: true,
    }

    await payload.create({
      collection: 'products',
      data: payloadData,
    })

    console.log(`Created product: ${title}`)
  }

  console.log('Seeding absolutely complete! 15 massive products generated.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Error during seeding:', err)
  process.exit(1)
})
