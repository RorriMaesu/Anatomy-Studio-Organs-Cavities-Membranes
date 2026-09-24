"""Blender 4.5: --background --factory-startup --python build.py -- SOURCE.blend"""
import bpy, sys, math
from pathlib import Path
root = Path(__file__).resolve().parents[2]
source = sys.argv[sys.argv.index('--') + 1]
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
with bpy.data.libraries.load(source, link=False) as (src, dst):
    dst.objects = [n for n in src.objects if n.startswith('GEO-body_male_realistic')]
body = next(o for o in dst.objects if o.name == 'GEO-body_male_realistic')
offset = body.location.copy()
def material(name, color, alpha=1):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, alpha)
    m.use_nodes = True
    bs = m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = (*color, alpha)
    bs.inputs['Roughness'].default_value = .7
    bs.inputs['Alpha'].default_value = alpha
    if alpha < 1: m.surface_render_method = 'DITHERED'
    return m
skin = material('Neutral ivory', (.72,.79,.78))
for o in dst.objects:
    bpy.context.collection.objects.link(o)
    o.location -= offset
    o.animation_data_clear()
    for mod in list(o.modifiers): o.modifiers.remove(mod)
    o.data.materials.clear()
    o.data.materials.append(skin)
    for face in o.data.polygons: face.use_smooth = True
body.name = 'Human'
planes = [
 ('Sagittal', [(0,-.65,0),(0,.65,0),(0,.65,1.98),(0,-.65,1.98)], (1,.39,.24)),
 ('Frontal', [(-.72,0,0),(.72,0,0),(.72,0,1.98),(-.72,0,1.98)], (.12,.68,1)),
 ('Transverse', [(-.72,-.65,.94),(.72,-.65,.94),(.72,.65,.94),(-.72,.65,.94)], (.98,.77,.12)),
 ('Oblique', [(-.72,-.58,.45),(.72,-.58,1.17),(.72,.58,1.17),(-.72,.58,.45)], (.73,.4,1))]
for name, verts, color in planes:
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], [(0,1,2,3)])
    mesh.update()
    o=bpy.data.objects.new(name,mesh)
    bpy.context.collection.objects.link(o)
    o.data.materials.append(material(name+' surface',color,.24))
    o['anatomical_plane']=name
bpy.context.scene['orientation']='Blender +Z superior, -Y anterior; glTF +Y superior, +Z anterior. Sagittal X=0, frontal Blender Y=0, transverse Z=0.94.'
bpy.context.scene['source']='Blender Human Base Meshes v1.0.0 archive; bundle README v1.01, CC0; Blender Foundation / Blender Studio / community.'
bpy.ops.wm.save_as_mainfile(filepath=str(root/'source/planes/body-planes.blend'))
bpy.ops.export_scene.gltf(filepath=str(root/'dist/assets/body-planes.glb'), export_format='GLB', export_extras=True)
