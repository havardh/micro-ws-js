#include <stdio.h>

int main(int argc, char **argv) {

	if (argc != 2) {
		printf("Usage: controls <cmd>\n");
		return 1;
	}

	printf("Controller received %s\n", argv[1]);

	return 0;
}
