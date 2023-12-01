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

char* fgets2( char* buf, int len, FILE* fp ){
	char* tmp = fgets( buf, len, fp );
	if( tmp != NULL ){
		/* 行末の改行コードを取り除く */
		char* szTmp = tmp;
		while( (*szTmp != '\r') && (*szTmp != '\n') && (*szTmp != '\0') ){
			szTmp++;
		}
		*szTmp = '\0';
	}
	return tmp;
}

int main( int argc, char* argv[] ){
	char tmp[256 + 1];

	if( argc < 2 ){
		printf( "usage: %s <image_type>\n", progName( argv[0] ) );
		return 0;
	}

	printf( "\"data:image/%s;base64,", argv[1] );
	while( fgets2( tmp, 256, stdin ) != NULL ){
		if( (strlen( tmp ) > 0) && (tmp[0] != '-') ){
			printf( "%s", tmp );
		}
	}
	printf( "\",\n" );

	return 0;
}
