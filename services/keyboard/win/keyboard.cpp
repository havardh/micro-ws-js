#include <stdio.h>
#define WINVER 0x0500
#include <Windows.h>
#include <WinUser.h>

int main(int argc, char *argv[]) {

	if (argc != 2) {
		printf("Usage keyboard.exe <keycode>");
		return 0;
	}

	int keycode = atoi(argv[1]);

	INPUT ip;
	
	ip.type = INPUT_KEYBOARD;
	ip.ki.wScan = 0;
	ip.ki.time = 0;
	ip.ki.dwExtraInfo = 0;
	ip.ki.wVk = keycode;
	ip.ki.dwFlags = 0;
	Sleep(4000);
	SendInput(1, &ip, sizeof(INPUT));

	ip.ki.dwFlags = KEYEVENTF_KEYUP;
	SendInput(1, &ip, sizeof(INPUT));
	return 0;
}