#include <stdio.h>

int main(int argc, char **argv) {

	if (argc != 2) {
		printf("Usage: echo <string>\n");
		return 1;
	}

	printf("Echo received %s\n", argv[1]);

	return 0;
}
