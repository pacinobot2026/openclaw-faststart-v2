# Simple VSL Generator - Text overlays on colored backgrounds
$audioFile = "C:/Users/Administrator/.openclaw/workspace/projects/local-newsletter-playbook-vsl.mp3"
$outputVideo = "C:/Users/Administrator/.openclaw/workspace/projects/local-newsletter-playbook-vsl.mp4"

Write-Host "Creating PowerPoint-style VSL..." -ForegroundColor Cyan

# One FFmpeg command to create entire video
$filterComplex = @"
color=c=0x1e293b:s=1920x1080:d=20,drawtext=fontfile='C\:/Windows/Fonts/ariblk.ttf':text='While Influencers Fight For Scraps...':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=400,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='A small group is building \\\$10K/month media businesses':fontcolor=0xfbbf24:fontsize=42:x=(w-text_w)/2:y=600[v0];
color=c=0x0f172a:s=1920x1080:d=25,drawtext=fontfile='C\:/Windows/Fonts/ariblk.ttf':text='Hi, I'\''m Chad Nicely':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=450,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='Multiple local newsletters generating monthly revenue':fontcolor=0xfbbf24:fontsize=38:x=(w-text_w)/2:y=600[v1];
color=c=0x1e293b:s=1920x1080:d=45,drawtext=fontfile='C\:/Windows/Fonts/ariblk.ttf':text='The Old Model Is BROKEN':fontcolor=white:fontsize=68:x=(w-text_w)/2:y=400,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='Personal brand → Million followers → Hope for sponsors':fontcolor=0xfbbf24:fontsize=40:x=(w-text_w)/2:y=600[v2];
color=c=0x0f172a:s=1920x1080:d=45,drawtext=fontfile='C\:/Windows/Fonts/ariblk.ttf':text='Local Newsletter Playbook':fontcolor=0xfbbf24:fontsize=72:x=(w-text_w)/2:y=450,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='Launch & monetize in 30 days or less':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=600[v3];
color=c=0x1e293b:s=1920x1080:d=60,drawtext=fontfile='C\:/Windows/Fonts/ariblk.ttf':text='The 6-Step System':fontcolor=white:fontsize=68:x=(w-text_w)/2:y=350,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='Pick niche → Setup → Create → Build list → Sell → Collect':fontcolor=0xfbbf24:fontsize=38:x=(w-text_w)/2:y=550[v4];
color=c=0x0f172a:s=1920x1080:d=30,drawtext=fontfile='C\:/Windows/Fonts/ariblk.ttf':text='Real Results':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=450,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='Works in ANY city, ANY niche':fontcolor=0xfbbf24:fontsize=48:x=(w-text_w)/2:y=600[v5];
color=c=0x1e293b:s=1920x1080:d=45,drawtext=fontfile='C\:/Windows/Fonts/ariblk.ttf':text='6 Modules + 6 Bonuses':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=450,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='Complete system from setup to scale':fontcolor=0xfbbf24:fontsize=42:x=(w-text_w)/2:y=600[v6];
color=c=0x0f172a:s=1920x1080:d=30,drawtext=fontfile='C\:/Windows/Fonts/ariblk.ttf':text='\\\$197':fontcolor=0xfbbf24:fontsize=96:x=(w-text_w)/2:y=400,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='One-time • Lifetime access • 30-day guarantee':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=600[v7];
color=c=0x1e293b:s=1920x1080:d=15,drawtext=fontfile='C\:/Windows/Fonts/ariblk.ttf':text='Get Started Now':fontcolor=0xfbbf24:fontsize=72:x=(w-text_w)/2:y=480[v8];
[v0][v1][v2][v3][v4][v5][v6][v7][v8]concat=n=9[outv]
"@

ffmpeg -f lavfi -i $filterComplex -i $audioFile -map "[outv]" -map 1:a -c:v libx264 -c:a aac -pix_fmt yuv420p -shortest -y $outputVideo 2>&1 | Out-Null

if (Test-Path $outputVideo) {
    $fileSize = (Get-Item $outputVideo).Length / 1MB
    Write-Host "✅ VSL VIDEO CREATED!" -ForegroundColor Green
    Write-Host "📁 local-newsletter-playbook-vsl.mp4 ($([math]::Round($fileSize, 2)) MB)" -ForegroundColor Cyan
} else {
    Write-Host "❌ Failed" -ForegroundColor Red
}
