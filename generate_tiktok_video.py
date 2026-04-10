import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(''))
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

def generate_video():
    """Generate epic motorsport adrenaline video for EuroMatchTickets"""
    
    prompt = """Ultra-cinematic motorsport adrenaline montage, Hollywood blockbuster quality:

OPENING SHOCK (0-3s): Dramatic high-speed motorcycle crash on narrow road race, bike tumbling and sliding with massive shower of orange sparks and thick black smoke, fire erupting from wreckage, debris flying in slow motion - terrifying and mesmerizing.

RAPID CUTS (3-8s): Formula 1 car blasting down straight at maximum speed with exhaust flames visible, enormous tire smoke cloud during burnout, then CUT to MotoGP motorcycle at impossible lean angle with elbow dragging on asphalt creating sparks, then CUT to massive concert with 100,000 fans and giant pyrotechnic fireballs shooting from stage, then CUT to Champions League football goal celebration with red smoke flares in crowd.

VIP FINALE (8-12s): Slow motion champagne being poured in luxury VIP suite with golden bokeh lights, crystal glasses clinking, then dramatic zoom to glowing golden text floating in dark space.

STYLE: Widescreen cinematic, extreme speed ramping from 120fps slow-mo to hyper-fast cuts, anamorphic lens flares, dramatic orange-teal color grading, professional film grain, IMAX quality visuals."""

    print("Starting Sora 2 video generation (1280x720 cinematic widescreen)...")
    print("This will take 5-10 minutes. Please wait...")
    
    video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
    
    video_bytes = video_gen.text_to_video(
        prompt=prompt,
        model="sora-2",
        size="1280x720",
        duration=12,
        max_wait_time=900
    )
    
    if video_bytes:
        output_path = '/app/frontend/public/euromatchtickets_tiktok.mp4'
        video_gen.save_video(video_bytes, output_path)
        file_size = os.path.getsize(output_path) / 1024 / 1024
        print(f"SUCCESS! Video saved to: {output_path}")
        print(f"File size: {file_size:.1f} MB")
        return output_path
    else:
        print("Video generation failed - no bytes returned")
        return None

if __name__ == "__main__":
    result = generate_video()
    if result:
        print(f"DONE: {result}")
    else:
        print("FAILED")
