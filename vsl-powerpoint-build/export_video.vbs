Set pptApp = CreateObject("PowerPoint.Application")
pptApp.Visible = True

Set pptPres = pptApp.Presentations.Open("C:\Users\Administrator\.openclaw\workspace\vsl-powerpoint-build\FastStart_VSL_LOCKED_SYNC.pptx")

' Export to MP4
' CreateVideo(FileName, UseTimingsAndNarrations, DefaultSlideDuration, VertResolution, FramesPerSec, Quality)
pptPres.CreateVideo "C:\Users\Administrator\.openclaw\workspace\vsl-powerpoint-build\FastStart_VSL_TEST.mp4", True, 5, 1080, 30, 100

' Wait for export to complete
Do While pptPres.CreateVideoStatus = 0
    WScript.Sleep 1000
Loop

If pptPres.CreateVideoStatus = 2 Then
    WScript.Echo "Video created successfully!"
Else
    WScript.Echo "Video export failed. Status: " & pptPres.CreateVideoStatus
End If

pptPres.Close
pptApp.Quit
