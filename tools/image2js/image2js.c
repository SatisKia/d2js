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
	FILE* fp;
	FILE* fp2;
	FILE* fp3;
	int num;
	char tmp[256 + 1];
	char* szTmp;
	char* szTop;
	char* szEnd;

	if( argc < 4 ){
		printf( "usage: %s <in_list_file> <out_id_js> <out_str_js>\n", progName( argv[0] ) );
		return 0;
	}

	if( (fp = fopen( argv[1], "rt" )) != NULL ){
		if( (fp2 = fopen( argv[2], "w+t" )) != NULL ){
			if( (fp3 = fopen( argv[3], "w+t" )) != NULL ){
				num = 0;
				fprintf( fp3, "var IMAGE = [\n" );
				while( fgets2( tmp, 256, fp ) != NULL ){
					szTop = tmp;
					if( (szEnd = strstr( szTop, ".gif" )) == NULL ){
						if( (szEnd = strstr( szTop, ".jpg" )) == NULL ){
							szEnd = strstr( szTop, ".png" );
						}
					}
					if( szEnd != NULL ){
						if( num != 0 ){
							fprintf( fp3, ",\n" );
						}
						fprintf( fp3, "\t\"%s\"", tmp );

						while( (szTmp = strrchr( szTop, '/' )) != NULL ){
							*szTmp = '_';
						}
						*szEnd = '\0';
						fprintf( fp2, "var IMAGE_%s\t= %d;\n", strupr( szTop ), num );

						num++;
					}
				}
				fprintf( fp3, "\n];\n" );
				fprintf( fp2, "var IMAGE_NUM\t= %d;\n", num );
				fclose( fp3 );
			}
			fclose( fp2 );
		}
		fclose( fp );
	}

	return 0;
}
