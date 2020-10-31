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

int main( int argc, char* argv[] ){
	register int i, j;
	FILE* fp;
	FILE* fp2;
	char line[1024 + 1];
	char** str;
	int* count;
	int str_cur;
	int top;
	int cur;
	int min_len;
	int min_count;

	min_len = 1;
	min_count = 1;

	if( (argc < 5) || (argc == 6) ){
		printf( "usage: %s <in_js_file> <out_js_file> <out_bat_file> <strrep_command> [<min_length> <min_count>]\n", progName( argv[0] ) );
		return 0;
	}

	if( argc >= 7 ){
		min_len = atoi( argv[5] );
		min_count = atoi( argv[6] );
	}

	/* 1ï∂éöà»è„ïKóv */
	if( min_len < 1 ){
		min_len = 1;
	}

	printf( "min length : %d\n", min_len );
	printf( "min count  : %d\n", min_count );
	printf( "\n" );

	str = malloc( sizeof(char*) * 512 );
	count = malloc( sizeof(int) * 512 );
	for( i = 0; i < 512; i++ ){
		str[i] = NULL;
		count[i] = 1;
	}
	str_cur = 0;

	if( (fp = fopen( argv[1], "rt" )) != NULL ){
		while( fgets( line, 1024, fp ) != NULL ){
			top = -1;
			cur = 0;
			for( ; ; ){
				if( line[cur] == '\0' ){
					break;
				}
				if( line[cur] == '\\' ){
					cur++;
				} else {
					if( line[cur] == '"' ){
						if( (cur > 0) && (line[cur - 1] == '\'') && (line[cur + 1] == '\'') ){
						} else if( top < 0 ){
							top = cur + 1;
						} else if( (cur > 0) && (line[cur - 1] == '\\') ){
						} else {
							str[str_cur] = malloc( cur - top + 1 );
							memcpy( str[str_cur], &line[top], cur - top );
							str[str_cur][cur - top] = '\0';
							for( i = 0; i < str_cur; i++ ){
								if( strcmp( str[i], str[str_cur] ) == 0 ){
									count[i]++;
									free( str[str_cur] );
									str[str_cur] = NULL;
									break;
								}
							}
							if( str[str_cur] != NULL ){
								if( strlen( str[str_cur] ) < min_len ){
									free( str[str_cur] );
									str[str_cur] = NULL;
								} else {
									for( i = 0; i < strlen( str[str_cur] ); i++ ){
										switch( str[str_cur][i] ){
										case '%':
										case '&':
										case '^':
										case '|':
										case '\\':
										case '<':
										case '>':
											free( str[str_cur] );
											str[str_cur] = NULL;
											break;
										}
										if( str[str_cur] == NULL ){
											break;
										}
									}
								}
							}
							if( str[str_cur] != NULL ){
								str_cur++;
							}
							top = -1;
						}
					}
				}
				cur++;
			}
		}
		fclose( fp );

		if( (fp = fopen( argv[2], "w+t" )) != NULL ){
			if( (fp2 = fopen( argv[3], "w+t" )) != NULL ){
				j = 0;
				for( i = 0; i < str_cur; i++ ){
					if( count[i] >= min_count ){
						fprintf( fp, "var STRING_%d = \"%s\";\n", j, str[i] );

						if( j == 0 ){
							fprintf( fp2, "type \"%s\" | ", argv[1] );
						} else {
							fprintf( fp2, " | " );
						}
						fprintf( fp2, "%s \"\\\"%s\\\"\" \"STRING_%d\"", argv[4], str[i], j );

						j++;
					}
					free( str[i] );
				}
				free( str );

				if( j > 0 ){
					fprintf( fp2, "\n" );
				}

				fclose( fp2 );
			}
			fclose( fp );
		}
	}

	return 0;
}
