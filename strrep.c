#include <stdio.h>
#include <string.h>

char* progName( char* argv0 ){
	char* szTop;
	char* szTmp;
	szTop = argv0;
	if( (szTmp = strrchr( szTop, '\\' )) != NULL ){
		szTop = szTmp + 1;
	}
	if( (szTmp = strrchr( szTop, '.' )) != NULL ){
		*szTmp = '\0';
	}
	return strlwr( szTop );
}

int main( int argc, char* argv[] ){
	FILE* fp;
	char line[1024 + 1];
	char* ptrTop;
	char* ptrCur;

	if( argc < 3 ){
		printf( "usage: %s <old_str> <new_str> [<in_file>]\n", progName( argv[0] ) );
		return 0;
	}

	if( argc == 4 ){
		if( (fp = fopen( argv[3], "rt" )) == NULL ){
			printf( "%s open error.\n", argv[3] );
			return 0;
		}
	} else {
		fp = stdin;
	}

if( strncmp( argv[2], "STRING_", 7 ) == 0 ){
	printf( "// %s -> %s\n", argv[1], argv[2] );
}

	while( fgets( line, 1024, fp ) != NULL ){
		ptrTop = line;
		while( (ptrCur = strstr( ptrTop, argv[1] )) != NULL ){
			*ptrCur = '\0';
			printf( "%s%s", ptrTop, argv[2] );
			ptrTop = ptrCur + strlen( argv[1] );
		}
		printf( "%s", ptrTop );
	}

	if( argc == 4 ){
		fclose( fp );
	}

	return 0;
}
