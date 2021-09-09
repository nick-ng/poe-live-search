#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; ! = Alt, + = Shift, ^ = Ctrl
; https://autohotkey.com/docs/Hotkeys.htm

; "Back" mouse button to auto whisper once you've copied the
XButton1::
sendWhisperToPoE()
return

; "Forward" mouse button to auto whisper once you've copied the
XButton2::
sendWhisperToPoE()
return

sendWhisperToPoE() {
    if WinExist("ahk_class POEWindowClass") {
  Clipboard := ""
  Sleep, 50
  Send {Click}
  ClipWait, 1
  if ErrorLevel
  {
    return
  }
  if WinActive("ahk_class POEWindowClass") {
    return
  }
  WinActivate
  Sleep, 50
  Send {Enter}
  Sleep, 100
  Send ^{v}
  Sleep, 100
  Send {Enter}
}
return
}


#IfWinActive ahk_class POEWindowClass

; Shift + Click
WheelUp::Send +{Click}

; Ctrl + Click
WheelDown::Send ^{Click}
