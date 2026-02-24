import asyncio
import sys
import os
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(''))

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

# Load environment variables
load_dotenv()

def generateVideo(prompt, output_path, size="1280x720", duration=8):
    """Generate video with Sora 2"""
    video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
    
    print(f"🎬 Generating video: {output_path}")
    print(f"   Size: {size}, Duration: {duration}s")
    print(f"   Prompt: {prompt[:100]}...")
    
    video_bytes = video_gen.text_to_video(
        prompt=prompt,
        model="sora-2",
        size=size,
        duration=duration,
        max_wait_time=900
    )
    
    if video_bytes:
        video_gen.save_video(video_bytes, output_path)
        print(f"✅ Video saved: {output_path}")
        return output_path
    print(f"❌ Failed: {output_path}")
    return None


def main():
    # Video 1: Landscape - Stadium atmosphere with crowd excitement
    prompt1 = """Cinematic footage of a packed World Cup football stadium at night. 
    Thousands of fans cheering with colorful flags waving, confetti falling from the sky. 
    Dramatic stadium floodlights creating an electric atmosphere. 
    Camera sweeps across the excited crowd, capturing the passion and energy of a major football event. 
    Professional sports broadcast quality, vibrant colors, epic scale.
    Text overlay appears: "World Cup 2026 Tickets - Book Now" in bold white letters."""
    
    result1 = generateVideo(
        prompt=prompt1,
        output_path='/app/backend/static/ad_video_landscape.mp4',
        size="1280x720",
        duration=8
    )
    
    print(f"\n{'='*50}\n")
    
    # Video 2: Square format - Match action highlights
    prompt2 = """Fast-paced football match highlights montage. 
    Players celebrating a goal with dramatic slow motion, 
    crowd going wild in the background, stadium lights flashing. 
    Quick cuts between exciting match moments - tackles, shots, saves. 
    High energy sports advertising aesthetic with cinematic color grading.
    Bold text appears: "Limited Tickets Available" then "EuroMatchTickets.com"."""
    
    result2 = generateVideo(
        prompt=prompt2,
        output_path='/app/backend/static/ad_video_square.mp4',
        size="1024x1024",
        duration=8
    )
    
    print(f"\n{'='*50}\n")
    
    # Video 3: Portrait/Vertical - Mobile ad format
    prompt3 = """Vertical mobile-optimized football advertisement video.
    Epic stadium exterior at sunset transitioning to inside with roaring crowd.
    Fans jumping and celebrating, waving scarves and flags.
    Dramatic zoom into the pitch showing players in action.
    Modern sports marketing aesthetic with lens flares and dynamic camera movement.
    Text overlays: "World Cup 2026 Mexico" then "Get Your Tickets Now" then "Secure Checkout"."""
    
    result3 = generateVideo(
        prompt=prompt3,
        output_path='/app/backend/static/ad_video_vertical.mp4',
        size="1024x1792",
        duration=8
    )
    
    print("\n" + "="*50)
    print("🎬 VIDEO GENERATION COMPLETE")
    print("="*50)
    
    results = [result1, result2, result3]
    success_count = sum(1 for r in results if r)
    print(f"✅ Successfully generated: {success_count}/3 videos")
    
    for r in results:
        if r:
            print(f"   📹 {r}")

if __name__ == "__main__":
    # Create static directory if not exists
    os.makedirs('/app/backend/static', exist_ok=True)
    main()
