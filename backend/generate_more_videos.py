import sys
import os
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(''))

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

load_dotenv()

def generateVideo(prompt, output_path, size="1280x720", duration=8):
    """Generate video with Sora 2"""
    video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
    
    print(f"🎬 Generating video: {output_path}")
    print(f"   Size: {size}, Duration: {duration}s")
    
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
    os.makedirs('/app/backend/static', exist_ok=True)
    
    # Video 2: Vertical format for mobile ads
    prompt2 = """Vertical mobile-optimized football advertisement video.
    Epic World Cup stadium at night with massive crowd of fans cheering.
    Dramatic floodlights, flags waving, confetti falling.
    Quick cuts showing excited fans celebrating, high-fiving, jumping.
    Cinematic slow motion of crowd passion and energy.
    Professional sports broadcast quality with vibrant stadium atmosphere.
    Modern advertising aesthetic perfect for social media mobile ads."""
    
    result2 = generateVideo(
        prompt=prompt2,
        output_path='/app/backend/static/ad_video_vertical.mp4',
        size="720x1280",
        duration=8
    )
    
    print(f"\n{'='*50}\n")
    
    # Video 3: Another landscape with different content
    prompt3 = """Fast-paced football match highlights montage for ticket advertising.
    Dramatic slow motion of player scoring a goal, arms raised in celebration.
    Crowd erupting in joy, fans hugging and cheering in the stands.
    Quick cuts between exciting moments - the roar of the stadium, 
    close-ups of passionate fans, dramatic lighting effects.
    High energy cinematic sports footage with professional color grading.
    Perfect for World Cup 2026 ticket promotional advertising."""
    
    result3 = generateVideo(
        prompt=prompt3,
        output_path='/app/backend/static/ad_video_action.mp4',
        size="1280x720",
        duration=8
    )
    
    print("\n" + "="*50)
    print("🎬 ADDITIONAL VIDEOS COMPLETE")
    print("="*50)
    
    for r in [result2, result3]:
        if r:
            print(f"   📹 {r}")

if __name__ == "__main__":
    main()
