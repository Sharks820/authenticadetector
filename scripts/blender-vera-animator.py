"""
VERA Animation Script for Blender
AuthenticaDetector - Veilbreakers

This script provides functions to:
1. Set up bone animations for VERA's rigged model
2. Create animation actions (idle, fly, monster transform, etc.)
3. Export to Spine JSON format or sprite sheets
4. Batch process animations

USAGE:
1. Open your rigged VERA model in Blender
2. Run this script from Blender's Text Editor or via command line:
   blender vera_model.blend --background --python blender-vera-animator.py

REQUIREMENTS:
- Blender 3.x or higher
- VERA model with Armature (bone rigging)
- Optional: Spine Export addon for JSON export
"""

import bpy
import math
import os
from mathutils import Euler, Vector

# =============================================================================
# CONFIGURATION
# =============================================================================

CONFIG = {
    'armature_name': 'VERA_Armature',
    'mesh_name': 'VERA_Mesh',
    'fps': 24,
    'output_path': '//exports/',
    'sprite_sheet_size': (2048, 2048),
    'sprite_frame_size': (256, 256),
}

# Bone names mapping (adjust to your VERA rig)
BONE_NAMES = {
    'root': 'root',
    'spine': ['spine_01', 'spine_02', 'chest'],
    'head': ['neck', 'head'],
    'hair': ['hair_base', 'hair_tip_L', 'hair_tip_R'],
    'wings': ['wing_L_base', 'wing_L_mid', 'wing_L_tip',
              'wing_R_base', 'wing_R_mid', 'wing_R_tip'],
    'arms': ['shoulder_L', 'arm_upper_L', 'arm_lower_L', 'hand_L',
             'shoulder_R', 'arm_upper_R', 'arm_lower_R', 'hand_R'],
    'legs': ['hip_L', 'thigh_L', 'shin_L', 'foot_L',
             'hip_R', 'thigh_R', 'shin_R', 'foot_R'],
    # Monster transformation bones
    'monster': ['horn_L', 'horn_R', 'tail_base', 'tail_mid', 'tail_tip',
                'claw_L', 'claw_R']
}

# Animation definitions
ANIMATIONS = {
    'idle': {
        'frames': 48,  # 2 seconds at 24fps
        'loop': True,
        'description': 'Gentle floating, wing flutter, hair sway'
    },
    'fly': {
        'frames': 24,  # 1 second loop
        'loop': True,
        'description': 'Active flight with pronounced wing beats'
    },
    'think': {
        'frames': 72,  # 3 seconds
        'loop': True,
        'description': 'Hand to chin, tilted head, sparkle effect'
    },
    'happy': {
        'frames': 48,
        'loop': True,
        'description': 'Bouncy hover, spread arms, bright expression'
    },
    'angry': {
        'frames': 36,
        'loop': True,
        'description': 'Crossed arms, furrowed brow, red aura hint'
    },
    'monster_transform': {
        'frames': 60,  # 2.5 seconds
        'loop': False,
        'description': 'Fairy to monster transformation sequence'
    },
    'monster_idle': {
        'frames': 48,
        'loop': True,
        'description': 'Hulking beast idle, breathing, tail sway'
    },
    'monster_roar': {
        'frames': 36,
        'loop': False,
        'description': 'Intimidating roar with claw raise'
    },
    'wave': {
        'frames': 36,
        'loop': False,
        'description': 'Friendly wave greeting'
    },
    'poke_react': {
        'frames': 24,
        'loop': False,
        'description': 'Startled reaction when poked'
    }
}

# =============================================================================
# ANIMATION FUNCTIONS
# =============================================================================

def get_armature():
    """Get the VERA armature object."""
    armature = bpy.data.objects.get(CONFIG['armature_name'])
    if not armature:
        print(f"Warning: Armature '{CONFIG['armature_name']}' not found.")
        # Try to find any armature
        for obj in bpy.data.objects:
            if obj.type == 'ARMATURE':
                print(f"Using armature: {obj.name}")
                return obj
    return armature


def create_action(name, frames):
    """Create a new animation action."""
    armature = get_armature()
    if not armature:
        return None

    # Create new action
    action = bpy.data.actions.new(name=name)
    armature.animation_data_create()
    armature.animation_data.action = action

    # Set frame range
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = frames

    return action


def get_bone(armature, bone_name):
    """Safely get a bone from armature."""
    if armature and armature.pose and bone_name in armature.pose.bones:
        return armature.pose.bones[bone_name]
    return None


def insert_keyframe(bone, frame, data_path='rotation_euler'):
    """Insert a keyframe for a bone."""
    if bone:
        bone.keyframe_insert(data_path=data_path, frame=frame)


def set_bone_rotation(bone, x=0, y=0, z=0):
    """Set bone rotation in degrees."""
    if bone:
        bone.rotation_mode = 'XYZ'
        bone.rotation_euler = Euler((math.radians(x), math.radians(y), math.radians(z)))


def set_bone_location(bone, x=0, y=0, z=0):
    """Set bone location offset."""
    if bone:
        bone.location = Vector((x, y, z))


# =============================================================================
# ANIMATION CREATORS
# =============================================================================

def create_idle_animation():
    """Create gentle floating idle animation."""
    action = create_action('VERA_idle', ANIMATIONS['idle']['frames'])
    armature = get_armature()
    if not armature:
        return

    frames = ANIMATIONS['idle']['frames']

    # Get bones
    root = get_bone(armature, BONE_NAMES['root'])
    head = get_bone(armature, BONE_NAMES['head'][1]) if len(BONE_NAMES['head']) > 1 else None
    spine = get_bone(armature, BONE_NAMES['spine'][1]) if len(BONE_NAMES['spine']) > 1 else None

    # Wing bones
    wing_L_base = get_bone(armature, BONE_NAMES['wings'][0]) if len(BONE_NAMES['wings']) > 0 else None
    wing_R_base = get_bone(armature, BONE_NAMES['wings'][3]) if len(BONE_NAMES['wings']) > 3 else None

    # Hair bones
    hair_base = get_bone(armature, BONE_NAMES['hair'][0]) if len(BONE_NAMES['hair']) > 0 else None

    # Keyframe 1: Starting position
    bpy.context.scene.frame_set(1)
    if root:
        set_bone_location(root, z=0)
        insert_keyframe(root, 1, 'location')
    if spine:
        set_bone_rotation(spine, x=2)
        insert_keyframe(spine, 1)
    if wing_L_base:
        set_bone_rotation(wing_L_base, z=10)
        insert_keyframe(wing_L_base, 1)
    if wing_R_base:
        set_bone_rotation(wing_R_base, z=-10)
        insert_keyframe(wing_R_base, 1)

    # Keyframe 2: Float up (frame 12)
    bpy.context.scene.frame_set(12)
    if root:
        set_bone_location(root, z=0.05)
        insert_keyframe(root, 12, 'location')
    if spine:
        set_bone_rotation(spine, x=-2)
        insert_keyframe(spine, 12)
    if wing_L_base:
        set_bone_rotation(wing_L_base, z=-15)
        insert_keyframe(wing_L_base, 12)
    if wing_R_base:
        set_bone_rotation(wing_R_base, z=15)
        insert_keyframe(wing_R_base, 12)

    # Keyframe 3: Peak (frame 24)
    bpy.context.scene.frame_set(24)
    if root:
        set_bone_location(root, z=0.03)
        insert_keyframe(root, 24, 'location')
    if head:
        set_bone_rotation(head, y=5)
        insert_keyframe(head, 24)
    if wing_L_base:
        set_bone_rotation(wing_L_base, z=5)
        insert_keyframe(wing_L_base, 24)
    if wing_R_base:
        set_bone_rotation(wing_R_base, z=-5)
        insert_keyframe(wing_R_base, 24)

    # Keyframe 4: Float down (frame 36)
    bpy.context.scene.frame_set(36)
    if root:
        set_bone_location(root, z=-0.02)
        insert_keyframe(root, 36, 'location')
    if head:
        set_bone_rotation(head, y=-3)
        insert_keyframe(head, 36)
    if wing_L_base:
        set_bone_rotation(wing_L_base, z=-10)
        insert_keyframe(wing_L_base, 36)
    if wing_R_base:
        set_bone_rotation(wing_R_base, z=10)
        insert_keyframe(wing_R_base, 36)

    # Keyframe 5: Return to start (frame 48)
    bpy.context.scene.frame_set(48)
    if root:
        set_bone_location(root, z=0)
        insert_keyframe(root, 48, 'location')
    if spine:
        set_bone_rotation(spine, x=2)
        insert_keyframe(spine, 48)
    if head:
        set_bone_rotation(head, y=0)
        insert_keyframe(head, 48)
    if wing_L_base:
        set_bone_rotation(wing_L_base, z=10)
        insert_keyframe(wing_L_base, 48)
    if wing_R_base:
        set_bone_rotation(wing_R_base, z=-10)
        insert_keyframe(wing_R_base, 48)

    print("Created VERA_idle animation")
    return action


def create_wing_flutter_animation():
    """Create fast wing flutter for active flight."""
    action = create_action('VERA_fly', ANIMATIONS['fly']['frames'])
    armature = get_armature()
    if not armature:
        return

    frames = ANIMATIONS['fly']['frames']

    # Get wing bones
    wings_L = [get_bone(armature, name) for name in BONE_NAMES['wings'][:3]]
    wings_R = [get_bone(armature, name) for name in BONE_NAMES['wings'][3:]]

    # Create flutter cycle (6 keyframes per second)
    for i in range(0, frames + 1, 4):
        bpy.context.scene.frame_set(i)

        # Alternate up/down
        up = (i // 4) % 2 == 0
        angle = 25 if up else -20

        for wing in wings_L:
            if wing:
                set_bone_rotation(wing, z=angle)
                insert_keyframe(wing, i)

        for wing in wings_R:
            if wing:
                set_bone_rotation(wing, z=-angle)
                insert_keyframe(wing, i)

    print("Created VERA_fly animation")
    return action


def create_monster_transform_animation():
    """Create fairy-to-monster transformation."""
    action = create_action('VERA_monster_transform', ANIMATIONS['monster_transform']['frames'])
    armature = get_armature()
    if not armature:
        return

    frames = ANIMATIONS['monster_transform']['frames']
    root = get_bone(armature, BONE_NAMES['root'])

    # Get monster bones
    horns = [get_bone(armature, name) for name in BONE_NAMES.get('monster', [])[:2]]
    tail_bones = [get_bone(armature, name) for name in BONE_NAMES.get('monster', [])[2:5]]
    claws = [get_bone(armature, name) for name in BONE_NAMES.get('monster', [])[5:]]

    # Stage 1: Fairy pose (frames 1-10)
    bpy.context.scene.frame_set(1)
    if root:
        set_bone_location(root, z=0)
        root.scale = Vector((1, 1, 1))
        insert_keyframe(root, 1, 'location')
        insert_keyframe(root, 1, 'scale')

    # Stage 2: Crouch and shake (frames 11-25)
    bpy.context.scene.frame_set(15)
    if root:
        set_bone_location(root, z=-0.1)
        insert_keyframe(root, 15, 'location')

    # Add shake keyframes
    for frame in range(15, 26, 2):
        bpy.context.scene.frame_set(frame)
        if root:
            shake = 0.02 if frame % 4 == 0 else -0.02
            set_bone_location(root, x=shake, z=-0.1)
            insert_keyframe(root, frame, 'location')

    # Stage 3: Growth burst (frames 26-40)
    bpy.context.scene.frame_set(30)
    if root:
        root.scale = Vector((1.2, 1.2, 1.2))
        set_bone_location(root, z=0.2)
        insert_keyframe(root, 30, 'scale')
        insert_keyframe(root, 30, 'location')

    # Horns emerge
    for horn in horns:
        if horn:
            horn.scale = Vector((1.5, 1.5, 1.5))
            insert_keyframe(horn, 30, 'scale')

    # Stage 4: Monster pose (frames 41-60)
    bpy.context.scene.frame_set(45)
    if root:
        root.scale = Vector((1.3, 1.3, 1.3))
        set_bone_location(root, z=0.1)
        insert_keyframe(root, 45, 'scale')
        insert_keyframe(root, 45, 'location')

    # Final pose
    bpy.context.scene.frame_set(60)
    if root:
        root.scale = Vector((1.3, 1.3, 1.3))
        set_bone_location(root, z=0)
        insert_keyframe(root, 60, 'scale')
        insert_keyframe(root, 60, 'location')

    # Tail sway start
    for i, tail in enumerate(tail_bones):
        if tail:
            angle = 10 * (i + 1)
            set_bone_rotation(tail, z=angle)
            insert_keyframe(tail, 60)

    print("Created VERA_monster_transform animation")
    return action


def create_happy_animation():
    """Create bouncy happy animation."""
    action = create_action('VERA_happy', ANIMATIONS['happy']['frames'])
    armature = get_armature()
    if not armature:
        return

    frames = ANIMATIONS['happy']['frames']
    root = get_bone(armature, BONE_NAMES['root'])
    head = get_bone(armature, BONE_NAMES['head'][1]) if len(BONE_NAMES['head']) > 1 else None

    # Get arm bones
    arm_L = get_bone(armature, BONE_NAMES['arms'][1]) if len(BONE_NAMES['arms']) > 1 else None
    arm_R = get_bone(armature, BONE_NAMES['arms'][5]) if len(BONE_NAMES['arms']) > 5 else None

    # Bounce cycle
    for i in range(0, frames + 1, 8):
        bpy.context.scene.frame_set(i)

        up = (i // 8) % 2 == 0

        if root:
            z_pos = 0.1 if up else -0.02
            set_bone_location(root, z=z_pos)
            insert_keyframe(root, i, 'location')

        if head:
            tilt = 10 if up else -5
            set_bone_rotation(head, z=tilt)
            insert_keyframe(head, i)

        # Arms spread on up, relax on down
        if arm_L:
            arm_angle = -30 if up else -60
            set_bone_rotation(arm_L, z=arm_angle)
            insert_keyframe(arm_L, i)

        if arm_R:
            arm_angle = 30 if up else 60
            set_bone_rotation(arm_R, z=arm_angle)
            insert_keyframe(arm_R, i)

    print("Created VERA_happy animation")
    return action


def create_think_animation():
    """Create thinking pose animation."""
    action = create_action('VERA_think', ANIMATIONS['think']['frames'])
    armature = get_armature()
    if not armature:
        return

    frames = ANIMATIONS['think']['frames']
    root = get_bone(armature, BONE_NAMES['root'])
    head = get_bone(armature, BONE_NAMES['head'][1]) if len(BONE_NAMES['head']) > 1 else None

    # Get arm and hand bones
    arm_R = get_bone(armature, BONE_NAMES['arms'][5]) if len(BONE_NAMES['arms']) > 5 else None
    hand_R = get_bone(armature, BONE_NAMES['arms'][7]) if len(BONE_NAMES['arms']) > 7 else None

    # Settle into pose (frames 1-24)
    bpy.context.scene.frame_set(1)
    if root:
        set_bone_location(root, z=0)
        insert_keyframe(root, 1, 'location')
    if head:
        set_bone_rotation(head, x=0, z=0)
        insert_keyframe(head, 1)
    if arm_R:
        set_bone_rotation(arm_R, x=0, z=60)
        insert_keyframe(arm_R, 1)

    bpy.context.scene.frame_set(24)
    if head:
        set_bone_rotation(head, x=10, z=15)  # Tilted head
        insert_keyframe(head, 24)
    if arm_R:
        set_bone_rotation(arm_R, x=-90, z=30)  # Hand to chin
        insert_keyframe(arm_R, 24)
    if hand_R:
        set_bone_rotation(hand_R, x=-30)
        insert_keyframe(hand_R, 24)

    # Subtle movement while thinking (frames 24-72)
    for frame in [36, 48, 60, 72]:
        bpy.context.scene.frame_set(frame)
        if head:
            tilt = 12 if frame in [36, 60] else 8
            set_bone_rotation(head, x=10, z=tilt)
            insert_keyframe(head, frame)

    print("Created VERA_think animation")
    return action


def create_wave_animation():
    """Create friendly wave greeting."""
    action = create_action('VERA_wave', ANIMATIONS['wave']['frames'])
    armature = get_armature()
    if not armature:
        return

    frames = ANIMATIONS['wave']['frames']

    # Get arm bones
    arm_R = get_bone(armature, BONE_NAMES['arms'][5]) if len(BONE_NAMES['arms']) > 5 else None
    forearm_R = get_bone(armature, BONE_NAMES['arms'][6]) if len(BONE_NAMES['arms']) > 6 else None
    hand_R = get_bone(armature, BONE_NAMES['arms'][7]) if len(BONE_NAMES['arms']) > 7 else None

    # Raise arm (frames 1-12)
    bpy.context.scene.frame_set(1)
    if arm_R:
        set_bone_rotation(arm_R, z=60)
        insert_keyframe(arm_R, 1)

    bpy.context.scene.frame_set(12)
    if arm_R:
        set_bone_rotation(arm_R, x=-90, z=0)  # Arm raised
        insert_keyframe(arm_R, 12)
    if forearm_R:
        set_bone_rotation(forearm_R, x=-30)
        insert_keyframe(forearm_R, 12)

    # Wave back and forth (frames 12-30)
    for frame, angle in [(16, 20), (20, -20), (24, 20), (28, -15)]:
        bpy.context.scene.frame_set(frame)
        if hand_R:
            set_bone_rotation(hand_R, z=angle)
            insert_keyframe(hand_R, frame)

    # Lower arm (frames 30-36)
    bpy.context.scene.frame_set(36)
    if arm_R:
        set_bone_rotation(arm_R, z=60)
        insert_keyframe(arm_R, 36)
    if forearm_R:
        set_bone_rotation(forearm_R, x=0)
        insert_keyframe(forearm_R, 36)
    if hand_R:
        set_bone_rotation(hand_R, z=0)
        insert_keyframe(hand_R, 36)

    print("Created VERA_wave animation")
    return action


# =============================================================================
# EXPORT FUNCTIONS
# =============================================================================

def export_sprite_sheet(action_name, rows=4, cols=8):
    """Export animation as sprite sheet."""
    armature = get_armature()
    if not armature:
        print("No armature found for export")
        return

    # Get action
    action = bpy.data.actions.get(action_name)
    if not action:
        print(f"Action '{action_name}' not found")
        return

    # Set action
    armature.animation_data.action = action

    # Calculate frame step
    total_frames = int(action.frame_range[1] - action.frame_range[0])
    total_sprites = rows * cols
    frame_step = max(1, total_frames // total_sprites)

    # Set up render settings
    scene = bpy.context.scene
    scene.render.image_settings.file_format = 'PNG'
    scene.render.film_transparent = True

    # Export path
    export_path = bpy.path.abspath(CONFIG['output_path'])
    os.makedirs(export_path, exist_ok=True)

    # Render each frame
    frame_files = []
    for i in range(total_sprites):
        frame_num = int(action.frame_range[0] + i * frame_step)
        scene.frame_set(frame_num)

        filepath = os.path.join(export_path, f'{action_name}_frame_{i:03d}.png')
        scene.render.filepath = filepath
        bpy.ops.render.render(write_still=True)
        frame_files.append(filepath)
        print(f"Rendered frame {i+1}/{total_sprites}")

    print(f"Exported {len(frame_files)} frames for {action_name}")
    return frame_files


def export_all_animations():
    """Export all defined animations as sprite sheets."""
    for anim_name in ANIMATIONS.keys():
        action_name = f'VERA_{anim_name}'
        if bpy.data.actions.get(action_name):
            export_sprite_sheet(action_name)


# =============================================================================
# MAIN EXECUTION
# =============================================================================

def create_all_animations():
    """Create all VERA animations."""
    print("\n=== VERA Animation Creation ===\n")

    create_idle_animation()
    create_wing_flutter_animation()
    create_monster_transform_animation()
    create_happy_animation()
    create_think_animation()
    create_wave_animation()

    print("\n=== All animations created ===")
    print(f"Actions: {[a.name for a in bpy.data.actions if a.name.startswith('VERA_')]}")


def setup_vera_rig():
    """Print setup instructions for VERA rig."""
    print("""
    ================================================================
    VERA RIG SETUP REQUIREMENTS
    ================================================================

    Your VERA model needs the following bone structure:

    ROOT
    └── spine_01
        └── spine_02
            └── chest
                ├── neck
                │   └── head
                │       ├── hair_base
                │       │   ├── hair_tip_L
                │       │   └── hair_tip_R
                │       └── (eyes, mouth - optional)
                ├── shoulder_L
                │   └── arm_upper_L
                │       └── arm_lower_L
                │           └── hand_L
                ├── shoulder_R
                │   └── arm_upper_R
                │       └── arm_lower_R
                │           └── hand_R
                ├── wing_L_base
                │   └── wing_L_mid
                │       └── wing_L_tip
                └── wing_R_base
                    └── wing_R_mid
                        └── wing_R_tip

    For MONSTER MODE, add:
    - horn_L, horn_R (attached to head)
    - tail_base → tail_mid → tail_tip (attached to spine_01)
    - claw_L, claw_R (attached to hands)

    IMPORTANT:
    - Set Armature object name to: VERA_Armature
    - Or update CONFIG['armature_name'] in this script

    ================================================================
    """)


# Run when script is executed
if __name__ == "__main__":
    setup_vera_rig()

    # Check if armature exists
    armature = get_armature()
    if armature:
        print(f"Found armature: {armature.name}")
        print("Creating animations...")
        create_all_animations()
    else:
        print("No armature found. Please load your VERA model first.")
        print("Then run: create_all_animations()")
