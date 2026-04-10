import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(''))
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

def generate_video():
    prompt = """Hyper-realistic extreme motorsport adrenaline montage, broadcast quality footage:

OPENING (0-3 seconds): A daring motorcycle rider doing a wheelie on one wheel at incredible speed on a narrow winding road through the green hills and stone walls of the Isle of Man TT course, the bike's front wheel high in the air, engine screaming at maximum RPM, sparks flying from the exhaust, lush green countryside and ocean cliffs visible in the background, the rider in full racing leathers leaning back.

MIDDLE (3-8 seconds): RAPID INTENSE CUTS - A race official waves the checkered flag aggressively as a pack of racing motorcycles launch from the starting grid with tire smoke and deafening engine roar, then CUT to a Formula 1 car exploding in a massive fireball crash barrier impact with carbon fiber debris and thick black smoke and orange flames everywhere, then CUT to MotoGP bikes screaming through a fast corner in a tight pack at 280kmh with knee sliders sparking on asphalt.

ENDING (8-12 seconds): Extreme slow motion close-up of a motorcycle wheel spinning at insane speed with heat distortion visible, smoke rising from burning rubber, then dramatic pull-back reveal showing the full Isle of Man TT course from aerial drone view with the ocean and green mountains, cinematic golden hour sunset lighting.

STYLE: Shot like a real motorsport broadcast with authentic camera angles, telephoto lens compression, natural motion blur, engine vibrations visible, dust and particles in the air, Michael Mann heat-haze cinematography, IMAX documentary quality, orange teal color grade."""

    print("Generating Isle of Man TT Adrenaline Video...")
    print("This will take 5-10 minutes...")
    
    video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
    
    video_bytes = video_gen.text_to_video(
        prompt=prompt,
        model="sora-2",
        size="1280x720",
        duration=12,
        max_wait_time=900
    )
    
    if video_bytes:
        output_path = '/app/frontend/public/euromatchtickets_isleofman.mp4'
        video_gen.save_video(video_bytes, output_path)
        file_size = os.path.getsize(output_path) / 1024 / 1024
        print(f"SUCCESS! Video saved: {output_path} ({file_size:.1f} MB)")
        return output_path
    else:
        print("FAILED - no video bytes returned")
        return None

if __name__ == "__main__":
    result = generate_video()
    print(f"DONE: {result}" if result else "FAILED")
