#include <stdio.h>
#include <stdlib.h>
#include <ApplicationServices/ApplicationServices.h>

#define K_z 6

void click(int keyCode) {
	CGEventRef down = CGEventCreateKeyboardEvent(NULL, (CGKeyCode)keyCode, true);
	CGEventRef up = CGEventCreateKeyboardEvent(NULL, (CGKeyCode)keyCode, false);

	CGEventPost( kCGHIDEventTap, down );
	CGEventPost( kCGHIDEventTap, up );
}

int main(int argc, char **argv) {

	if (argc != 2) {
		printf("Usage: keyboard <keycode>\n");
		return 1;
	}

	int keyCode = atoi(argv[1]);

	click(keyCode);

	return 0;
}
