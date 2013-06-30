#include <stdio.h>
#define WINVER 0x0500
#include <Windows.h>
#include <WinUser.h>
#include <cctype>

void pressKey(int keycode) {
	INPUT ip;
	
	ip.type = INPUT_KEYBOARD;
	ip.ki.wScan = 0;
	ip.ki.time = 0;
	ip.ki.dwExtraInfo = 0;
	ip.ki.wVk = keycode;
	ip.ki.dwFlags = 0;
	SendInput(1, &ip, sizeof(INPUT));

	ip.ki.dwFlags = KEYEVENTF_KEYUP;
	SendInput(1, &ip, sizeof(INPUT));
}

int main(int argc, char *argv[]) {

	if (argc != 2) {
		printf("Usage keyboard.exe <keycode>\n");
		return 0;
	}

	char *input = argv[1];

	int keycode = 0;
	if (strlen(input) == 1) {
		keycode = toupper(argv[1][0]);
	} else if (strcmp(input, "return") == 0) {
		keycode = VK_RETURN;
	} else if (strcmp(input, "delete") == 0) {
		keycode = VK_BACK;
	} else if (strcmp(input, "tab") == 0) {
		keycode = VK_TAB;
	} else if (strcmp(input, "caps lock") == 0) {
		keycode = VK_CAPITAL;
	} else if (strcmp(input, "space") == 0) {
		keycode = VK_SPACE;
	}

	if (keycode != 0) {
		pressKey(keycode);
	}
	
	return 0;
}