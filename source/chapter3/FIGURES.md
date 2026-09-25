# Chapter 3 figure provenance and drawing notes

The Cell Studio uses ten original interactive SVG schematics and ten unaltered textbook figures for comparison. The schematics are defined in `dist/chapter3/diagrams.js`; source PNGs are in `dist/chapter3/assets/`. Every schematic uses an 800 × 520 viewBox. Its interactive target coordinates are percentages of this viewBox. Answer names are supplied by the application rather than permanently drawn into the SVG, so the same artwork supports study and recall.

## Source and license

**OpenStax, Anatomy and Physiology 2e, Chapter 3: The Cellular Level of Organization. ©2026 Rice University. Access for free at openstax.org.**

- Book: https://openstax.org/details/books/anatomy-and-physiology-2e
- Chapter: https://openstax.org/books/anatomy-and-physiology-2e/pages/3-introduction
- License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International, https://creativecommons.org/licenses/by-nc-sa/4.0/
- The supplied textbook's PDF copyright page (PDF page 3) explicitly identifies the above license. This is the license used here, regardless of licenses attached to older OpenStax editions elsewhere.
- The original figure PNGs are reproduced educational textbook content. The custom schematics are educational adaptations released under the same CC BY-NC-SA 4.0 license.
- Retain the attribution **“Access for free at openstax.org.”** in the page view that displays these materials. OpenStax and Rice University trademarks are not reproduced as logos.

The source PDF was the user's `anatomy-and-physiology-textbook.pdf`, supplied from their Anatomy and Physiology 1 course folder. Embedded images were extracted with PyMuPDF and converted to RGB PNG where needed. Their original labels and linework are intact; no labels were erased or invented. The resulting files were visually inspected together and checked against their PDF figure captions.

| Asset | Figure | Book page | PDF page | Image xref |
| --- | --- | ---: | ---: | ---: |
| `openstax-3-4.png` | 3.4 Cell Membrane | 88 | 104 | 349 |
| `openstax-3-9.png` | 3.9 Sodium-Potassium Pump | 92 | 108 | 364 |
| `openstax-3-13.png` | 3.13 Prototypical Human Cell | 96 | 112 | 378 |
| `openstax-3-19.png` | 3.19 The Nucleus | 102 | 118 | 399 |
| `openstax-3-24.png` | 3.24 DNA Replication | 106 | 122 | 415 |
| `openstax-3-26.png` | 3.26 Transcription: from DNA to mRNA | 108 | 124 | 421 |
| `openstax-3-28.png` | 3.28 Translation from RNA to Protein | 110 | 126 | 428 |
| `openstax-3-30.png` | 3.30 Cell Cycle | 112 | 128 | 434 |
| `openstax-3-32.png` | 3.32 Cell Division: Mitosis Followed by Cytokinesis | 113 | 129 | 439 |
| `openstax-3-34.png` | 3.34 Hematopoiesis | 117 | 133 | 449 |

## Interactive drawings

| ID | Teaching focus | Targets | Source basis |
| --- | --- | ---: | --- |
| `membrane-structure` | Bilayer, membrane proteins, carbohydrate coat | 8 | §3.1, Figs. 3.2–3.4 |
| `human-cell` | Cellular compartments and organelle functions | 13 | §3.2, Figs. 3.13–3.18 |
| `cytoskeleton` | Tubulin, actin, intermediate filaments, cilia and flagellum | 6 | §3.2, Fig. 3.18 |
| `nucleus-packaging` | Nuclear compartments and levels of DNA packaging | 8 | §3.3, Figs. 3.19, 3.22–3.23 |
| `dna-replication` | Helicase, polymerase, templates, semiconservative copying | 7 | §3.3, Fig. 3.24 |
| `transcription-splicing` | DNA strands, RNA polymerase, pre-mRNA processing | 8 | §3.4, Figs. 3.26–3.27 |
| `translation` | Codon–anticodon pairing and polypeptide synthesis | 8 | §3.4, Figs. 3.28–3.29 |
| `cell-cycle` | G1, S, G2, mitotic phase, G0, chromosome copies | 7 | §3.5, Figs. 3.30–3.31 |
| `mitosis` | Chromosome distribution, nuclei, and daughter cells | 5 | §3.5, Fig. 3.32 |
| `blood-lineage` | Self-renewal, restricted potential, blood-cell specialization | 8 | §3.6, Figs. 3.34–3.35 |

Total: **10 diagrams and 78 label targets**.

## Deliberate simplifications and accuracy decisions

- All drawings are schematics, not scale drawings. The generic human cell is a composite: no single real human cell necessarily contains every pictured structure in these proportions.
- The membrane is a cross-section. Carbohydrates appear only on the extracellular side. Hydrophilic heads face the aqueous compartments; nonpolar tails face each other. The channel is a schematic open passage, not a particular channel's molecular structure.
- Cytoskeletal filament types are enlarged separately. The cilia and sperm flagellum sketches indicate microtubule-based appendages; they do not suggest that these arise from the adjacent actin or intermediate-filament illustrations.
- The replication drawing emphasizes semiconservation and the major enzymes. It omits Okazaki fragments, primase, ligase, and leading/lagging-strand mechanics rather than implying that both strands are continuously synthesized in the same direction. The reference figure provides a more detailed view.
- **Transcription terminology correction:** the textbook paragraph on printed page 108 calls the DNA template the “coding strand.” The interactive drawing uses standard terminology consistently: RNA polymerase reads the **template strand**; RNA has the **coding strand's** sequence with U in place of T.
- RNA processing shows introns removed and retained exons joined. The cap and poly-A tail are additional context; not all exons are translated protein-coding sequence.
- The translation example is read 5′ → 3′. Its CCU codon is shown pairing with the tRNA anticodon GGA in antiparallel alignment. UAA is a stop codon. The stylized tRNA shape is a teaching symbol, not a molecular rendering.
- The cell-cycle ring does not encode phase duration by its arc sizes. G0 is outside the active division cycle and can be temporary or persistent. A typical human cell after S phase has 46 chromosomes and 92 chromatids, not 92 chromosomes.
- The mitosis drawing uses four chromosomes for clarity. Nuclear-envelope breakdown is covered with prophase as in the chapter's four-stage explanation; the reference figure also names prometaphase. Cytokinesis overlaps late mitosis, so it is not represented as requiring an entirely separate nonoverlapping interval.
- The blood-lineage drawing omits intermediate stages. It preserves the myeloid origin of erythrocytes, granulocytes, and megakaryocyte-derived platelets, and the lymphoid origin of lymphocytes. Platelets are cell fragments. The detailed reference figure is provided to show the complete branching structure.

## Validation

The ten SVGs were rendered with numbered target overlays and visually inspected. The source image contact sheet was inspected for clipping, retained labels, and correct figure matching. All target coordinates fit their viewBoxes, and all reference files are local so the viewer does not depend on an outside image host.
