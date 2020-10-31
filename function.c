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
	FILE* fp2;
	char line[1024 + 1];
	char* szTmp;
	char* szEnd;

	if( argc < 3 ){
		printf( "usage: %s <in_js_file> <out_js_file>\n", progName( argv[0] ) );
		return 0;
	}

	if( (fp = fopen( argv[1], "rt" )) != NULL ){
		if( (fp2 = fopen( argv[2], "w+t" )) != NULL ){
			while( fgets( line, 1024, fp ) != NULL ){
				szTmp = strstr( line, "function " );
				if( szTmp != NULL ){
					szTmp += 9;
					szEnd = strstr( szTmp, "(" );
					if( szEnd != NULL ){
						*szEnd = '\0';
						if( strlen( szTmp ) > 0 ){
							if( *szTmp == '_' ){
								if( (szTmp[1] >= 'A') && (szTmp[1] <= 'Z') ){
									fprintf( fp2, "window.%s = %s;\n", szTmp, szTmp );
								}
							} else {
								fprintf( fp2, "window.%s = %s;\n", szTmp, szTmp );
							}
						}
					}
				} else {
					szTmp = strstr( line, "var " );
					if( szTmp != NULL ){
						szTmp += 4;
						szEnd = strstr( szTmp, " " );
						if( szEnd != NULL ){
							*szEnd = '\0';
							if( strlen( szTmp ) > 0 ){
								if( *szTmp == '_' ){
									if( (szTmp[1] >= 'A') && (szTmp[1] <= 'Z') ){
										fprintf( fp2, "window.%s = %s;\n", szTmp, szTmp );
									}
								}
							}
						}
					}
				}
			}
			fclose( fp2 );
		}
		fclose( fp );
	}

	return 0;
}
