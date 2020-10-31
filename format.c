#include <stdio.h>

int main( int argc, char* argv[] ){
	FILE* fp;
	int c;
	char n, t;
	char s;

	fp = stdin;

	n = 0;
	t = 0;
	s = 1;
	while( (c = fgetc( fp )) != EOF ){
		if( n > 0 ){
			if( c != '\n' ){
				printf( "%c", '\n' );
				n = 0;
				s = 1;
			}
		}
		if( t == 1 ){
			if( c != '\t' ){
				printf( "%c", '\t' );
				t = 0;
			}
		}
		if( c == '\n' ){
			n++;
		}
		if( c == '\t' ){
			t = 1;
		}
		if( (n == 0) && (t == 0) ){
			if( s == 1 ){
				if( c == ' ' ){
					printf( "%c", '\t' );
				} else {
					printf( "%c", c );
					s = 0;
				}
			} else {
				printf( "%c", c );
			}
		}
	}
	if( n > 0 ){
		printf( "%c", '\n' );
	}

	return 0;
}
