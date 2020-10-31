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
	char* szTmp2;

	if( argc < 3 ){
		printf( "usage: %s <in_js_file> <out_js_file>\n", progName( argv[0] ) );
		return 0;
	}

	if( (fp = fopen( argv[1], "rt" )) != NULL ){
		if( (fp2 = fopen( argv[2], "w+t" )) != NULL ){
			while( fgets( line, 1024, fp ) != NULL ){
				szTmp = strstr( line, "#define " );
				if( szTmp != NULL ){
					szTmp += 8;
					szEnd = szTmp;
					while( *szEnd != '\0' ){
						if( (*szEnd == ' ') || (*szEnd == '\t') ){
							break;
						}
						szEnd++;
					}
					if( (*szEnd != '\0') && (*szEnd != '\r') && (*szEnd != '\n') ){
						*szEnd = '\0';
						szTmp2 = szEnd + 1;
						while( (*szTmp2 == ' ') || (*szTmp2 == '\t') ){
							szTmp2++;
						}
						szEnd = szTmp2;
						while( *szEnd != '\0' ){
							if( (*szEnd == '\t') || (*szEnd == '\r') || (*szEnd == '\n') ){
								break;
							}
							szEnd++;
						}
						*szEnd = '\0';
						if( (strlen( szTmp ) > 0) && (strlen( szTmp2 ) > 0) ){
							fprintf( fp2, "window.%s = ", szTmp );
							szEnd = szTmp2;
							while( *szEnd != '\0' ){
								if( *szEnd == '_' ){
									if( (szEnd == szTmp2) || ((*(szEnd - 1) < 'A') || (*(szEnd - 1) > 'Z')) ){
										fprintf( fp2, "window." );
									}
								}
								fputc( *szEnd, fp2 );
								szEnd++;
							}
							fprintf( fp2, ";\n" );
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
