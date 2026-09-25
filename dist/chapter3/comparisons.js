// Concise comparison cards derived from the supplied Chapter 3 learning objectives.
export const comparisons={
 membrane:{title:'A protein does not automatically make transport active.',items:[
  {name:'Simple diffusion',rule:'Down a gradient',how:'Crosses the lipid bilayer without a transporter.',example:'Oxygen entering a cell.',energy:'No direct ATP use'},
  {name:'Facilitated diffusion',rule:'Down an electrochemical gradient',how:'Uses a selective channel or carrier.',example:'Glucose moving downhill through a GLUT carrier.',energy:'No direct ATP use'},
  {name:'Primary active transport',rule:'Can move against a gradient',how:'A pump directly couples transport to an energy source.',example:'Na+/K+ ATPase: 3 Na+ out, 2 K+ in.',energy:'Direct ATP use in this example'}
 ],question:'Glucose moves downhill through a carrier without ATP input. Does using a carrier make this active transport?',answer:'No. Downhill transport through a carrier is facilitated diffusion. Secondary active transport instead couples an uphill movement to another substance moving downhill; its driving gradient must be maintained.'},
 organelles:{title:'Make it, process it, send it.',items:[
  {name:'Rough ER',rule:'Protein pathway',how:'Attached ribosomes feed new proteins into or across the ER membrane.',example:'A cell making a secreted protein hormone.',energy:'Ribosomes give it the rough appearance'},
  {name:'Smooth ER',rule:'Lipids, calcium, detoxification',how:'Lacks attached ribosomes; functions vary with cell type.',example:'A cell making steroid hormones.',energy:'Smooth does not mean inactive'},
  {name:'Golgi apparatus',rule:'Modify, sort, package',how:'Receives ER cargo at the cis side and dispatches it from the trans side.',example:'Packaging processed protein into a secretory vesicle.',energy:'A sorting station, not a ribosome'}
 ],question:'A secreted protein has just entered the rough ER. Does its next stop have to be the smooth ER?',answer:'No. The main secretion route proceeds from rough ER through transport vesicles to the Golgi, then secretory vesicles and the plasma membrane. Smooth ER is not a mandatory stop on that route.'},
 nucleus:{title:'Same genetic material, different descriptions.',items:[
  {name:'Chromatin',rule:'DNA plus associated proteins',how:'Describes the DNA–protein material, whether loose or condensed.',example:'Less condensed material in an interphase nucleus.',energy:'Material and packaging'},
  {name:'Chromosome',rule:'One organized genetic unit',how:'Exists throughout the cycle; it need not look like an X.',example:'One of 46 chromosomes in a typical diploid human cell.',energy:'Before separation, a copied X is one chromosome'},
  {name:'Sister chromatid',rule:'One copied partner',how:'One of two copies in a replicated chromosome before they separate.',example:'After S phase: 46 chromosomes, 92 sister chromatids.',energy:'After separation, each is a chromosome'}
 ],question:'If chromosomes become difficult to see during interphase, has the cell lost its chromosomes?',answer:'No. The DNA–protein material is less condensed, so individual chromosomes are harder to distinguish. Condensation changes packaging, not the presence of the genome.'},
 protein:{title:'Three processes. Three different products.',items:[
  {name:'Replication',rule:'DNA → DNA',how:'DNA polymerase builds complementary DNA before division.',example:'Copying the genome during S phase.',energy:'DNA alphabet: A, T, C, G'},
  {name:'Transcription',rule:'DNA → RNA',how:'RNA polymerase reads a DNA template to make complementary RNA.',example:'Making pre-mRNA from a nuclear gene.',energy:'RNA alphabet: A, U, C, G'},
  {name:'Translation',rule:'mRNA → polypeptide',how:'Ribosomes read codons; tRNAs deliver amino acids.',example:'Building an amino-acid chain at a ribosome.',energy:'Stop is a signal, not an amino acid'}
 ],question:'A cell is making more mRNA from an existing gene. Is it copying its whole genome?',answer:'No. That is transcription. Replication copies DNA into DNA; transcription makes RNA from selected DNA regions; translation builds a polypeptide from an mRNA message.'},
 division:{title:'Three structures, three distinct jobs.',items:[
  {name:'Centrosome',rule:'Microtubule-organizing center',how:'Organizes much of the spindle machinery outside the nucleus.',example:'Typical animal cells have a centriole pair plus surrounding material.',energy:'Think spindle pole'},
  {name:'Centromere',rule:'A chromosome region',how:'Helps organize sister attachment and kinetochore assembly.',example:'The constricted region of a drawn replicated chromosome.',energy:'Think chromosome'},
  {name:'Kinetochore',rule:'A protein attachment complex',how:'Assembles at the centromere and binds spindle microtubules.',example:'Opposite sister kinetochores connect to opposite spindle poles.',energy:'Think direct microtubule attachment'}
 ],question:'A spindle fiber attaches directly to a chromosome. Which structure is its attachment site?',answer:'The kinetochore. It is assembled at a centromere. The centrosome helps organize the spindle; it is not the chromosome attachment site.'},
 differentiation:{title:'Compare possible fates, not division speed.',items:[
  {name:'Totipotent',rule:'Body plus supporting tissues',how:'Can contribute all embryonic and extraembryonic cell types for development.',example:'The zygote and very early embryonic cells.',energy:'Toti = total developmental range'},
  {name:'Pluripotent',rule:'All major body-cell types',how:'Does not alone supply the full set of extraembryonic support tissues.',example:'Embryonic stem cells and induced pluripotent stem cells.',energy:'Pluri = broad body-cell range'},
  {name:'Multipotent',rule:'Several related cell types',how:'Normal developmental choices remain within a restricted range.',example:'Blood-forming stem cells producing blood-cell lineages.',energy:'Multi = multiple related choices'}
 ],question:'Would a blood-forming stem cell normally produce a neuron simply because it can produce several types of blood cells?',answer:'No. It is multipotent within its normal blood-forming range. Oligopotent means a few related fates; unipotent stem cells produce one cell type and can still self-renew.'}
};
