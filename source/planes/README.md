# Interactive body planes

Authored and exported with the user's Blender 4.5.1 LTS installation. The editable scene is `body-planes.blend`; the browser loads `dist/assets/body-planes.glb`.

Human mesh: Blender Foundation / Blender Studio / Blender community, **Human Base Meshes**, official v1.0.0 archive (embedded README identifies bundle v1.01). The bundle README states: “All provided assets are public domain under the CC0 license.” Only the realistic male body and eyes are used, with new neutral materials; no Rain rig is included. A legacy text block named License refers specifically to the Rain rig, which is not used here.

Source: https://download.blender.org/demo/asset-bundles/human-base-meshes/
Download mirror: https://mirror.blender.org/demo/asset-bundles/human-base-meshes/human-base-meshes-bundle-v1.0.0.zip
CC0: https://creativecommons.org/publicdomain/zero/1.0/

Three.js 0.180.0 is vendored locally under the MIT license (see `dist/vendor/three/LICENSE`). Addon imports were changed to relative local imports. No runtime CDN or external model service is required.

## Rebuild

Extract the original archive, then run Blender with `--background --factory-startup --python source/planes/build.py -- ABSOLUTE_PATH_TO_SOURCE.blend` from this repository. The source bundle is deliberately not duplicated here; the smaller editable scene is included.

Coordinates in Blender: +Z superior, -Y anterior. The export converts to glTF +Y superior, +Z anterior. Sagittal is X=0 (left/right), frontal is Blender Y=0 (front/back), transverse is Blender Z=0.94 (upper/lower). The oblique example slopes across the torso. These are teaching surfaces, not a medical segmentation. The neutral standing human is an illustrative base mesh.
