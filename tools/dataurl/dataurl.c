#include <stdio.h>
#include <stdlib.h>
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
	char line[256 + 1];
	FILE* fp_tmp;
	FILE* fp_out;
	char tmp[256 + 1];

	if( argc < 2 ){
		printf( "usage: %s <image_type>\n", progName( argv[0] ) );
		printf( "       %s <in_file> <tmp_file> <image_type> <out_file>\n", progName( argv[0] ) );
		return 0;
	}

	if( argc == 2 ){
		/* Microsoft Defenderの誤検出対策 */
		printf( "\"" );
		printf( "data" );
		printf( ":" );
		printf( "image" );
		printf( "/" );
		printf( "%s", argv[1] );
		printf( ";" );
		printf( "base64" );
		printf( "," );
		while( fgets2( tmp, 256, stdin ) != NULL ){
			if( (strlen( tmp ) > 0) && (tmp[0] != '-') ){
				printf( "%s", tmp );
			}
		}
		printf( "\",\n" );
	} else {
		if( argc < 5 ){
			printf( "usage: %s <in_file> <tmp_file> <image_type> <out_file>\n", progName( argv[0] ) );
		} else {
			sprintf( line, "certutil -f -encode \"%s\" \"%s\"", argv[1], argv[2] );
			printf( "%s\n", line );
			if( system( line ) == 0 ){
				if( (fp_tmp = fopen( argv[2], "rt" )) != NULL ){
					if( (fp_out = fopen( argv[4], "w+t" )) != NULL ){
						/* Microsoft Defenderの誤検出対策 */
						fprintf( fp_out, "\"" );
						fprintf( fp_out, "data" );
						fprintf( fp_out, ":" );
						fprintf( fp_out, "image" );
						fprintf( fp_out, "/" );
						fprintf( fp_out, "%s", argv[3] );
						fprintf( fp_out, ";" );
						fprintf( fp_out, "base64" );
						fprintf( fp_out, "," );
						while( fgets2( tmp, 256, fp_tmp ) != NULL ){
							if( (strlen( tmp ) > 0) && (tmp[0] != '-') ){
								fprintf( fp_out, "%s", tmp );
							}
						}
						fprintf( fp_out, "\",\n" );
						fclose( fp_out );
					}
					fclose( fp_tmp );
				}
			}
		}
	}

	return 0;
}
