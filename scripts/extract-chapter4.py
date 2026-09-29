"""Extract original textbook figure images; preserve lettering and scale bars."""
from pathlib import Path
import json
import fitz
ROOT=Path(__file__).resolve().parents[1]
doc=fitz.open(r'C:\Users\Tesla\Documents\School\AnatomyandPhysiology1\anatomy-and-physiology-textbook.pdf')
out=ROOT/'dist/chapter4/assets';out.mkdir(parents=True,exist_ok=True)
rows=[(145,0,'Micrograph of Cervical Tissue','repair'),(147,0,'Four Types of Tissue: Body','types'),(148,0,'Embryonic Origin of Tissues and Major Organs','types'),(149,0,'Tissue Membranes','types'),(152,0,'Types of Cell Junctions','epithelial'),(153,0,'Cells of Epithelial Tissue','epithelial'),(155,0,'Goblet Cell','epithelial'),(156,0,'Summary of Epithelial Tissue Cells','epithelial'),(158,0,'Types of Exocrine Glands','epithelial'),(159,0,'Modes of Glandular Secretion','epithelial'),(160,0,'Sebaceous Glands','epithelial'),(161,0,'Connective Tissue Proper','connective'),(163,0,'Adipose Tissue','connective'),(163,1,'Reticular Tissue','connective'),(164,0,'Dense Connective Tissue','connective'),(166,0,'Types of Cartilage','connective'),(167,0,'Blood: A Fluid Connective Tissue','connective'),(169,0,'Muscle Tissue','muscle'),(170,0,'The Neuron','nervous'),(171,0,'Nervous Tissue','nervous'),(172,0,'Tissue Healing','repair'),(174,0,'Development of Cancer','repair')]
micro={1,2,7,11,12,13,14,15,16,17,18,19,20}
manifest=[]
for i,(page,index,title,module) in enumerate(rows,1):
    pix=fitz.Pixmap(doc,doc[page-1].get_images()[index][0])
    if pix.n>3: pix=fitz.Pixmap(fitz.csRGB,pix)
    # High resolution originals retained; lossless web compression avoids giant page captures.
    image=pix.pil_image();image.thumbnail((2000,2400))
    name=f'figure-4-{i}.webp';image.save(out/name,format='WEBP',quality=90)
    credit='OpenStax Anatomy and Physiology 2e; educational reuse under CC BY-NC-SA 4.0. '
    if i==1:credit+='Original image credit: “Haymanj”/Wikimedia Commons (as credited in the textbook).'
    elif i in micro:credit+='Micrograph(s) provided by the Regents of University of Michigan Medical School © 2012, as credited in the textbook.'
    manifest.append(dict(id=f'4.{i}',title=title,module=module,page=page,printedPage=page-16,src='assets/'+name,width=image.width,height=image.height,credit=credit,kind='Textbook figure with micrograph' if i in micro else 'Textbook illustration',role='Study reference; original lettering retained; not used as an unlabeled assessment specimen'))
(ROOT/'dist/chapter4/figures.js').write_text('export const figures='+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print(f'Extracted {len(manifest)} figures.')
