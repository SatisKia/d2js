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

int tableIndex( char* str ){
	int i;
	int j = 0;
	for( i = 0; i < 6; i++ ){
		if( str[i] == '1' ){
			j += (1 << (5 - i));
		}
	}
	return j;
}

int main( int argc, char* argv[] ){
	int i, j, k;
	FILE* in_fp;
	FILE* out_fp;
	unsigned char data;
	char tmp[24 + 1];
	char* top;

	// 変換表
	char TABLE[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

	if( argc < 3 ){
		printf( "usage: %s <in_file> <out_file>\n", progName( argv[0] ) );
		return 0;
	}

	if( (out_fp = fopen( argv[2], "w+t" )) != NULL ){
		if( (in_fp = fopen( argv[1], "rb" )) != NULL ){
			j = 0;
			k = 0;
			while( fread( &data, sizeof(unsigned char), 1, in_fp ) > 0 ){
				for( i = 7; i >= 0; i-- ){
					tmp[j++] = ((data & (1 << i)) != 0) ? '1' : '0';
				}
				// 3バイト分の24ビット文字列が生成された場合
				if( j == 24 ){
					// 6文字ずつに分割し、変換表により1文字を得る
					for( i = 0; i < j; i += 6 ){
						fprintf( out_fp, "%c", TABLE[tableIndex( &tmp[i] )] );
						k++;
					}
					j = 0;
				}
			}
			fclose(in_fp);
			if( j > 0 ){
				if( j == 8 ){
					// 残り1バイトの場合、8ビットになるので、4文字の0を追加して12ビット文字列に
					tmp[j++] = '0';
					tmp[j++] = '0';
					tmp[j++] = '0';
					tmp[j++] = '0';
				}
				if( j == 16 ){
					// 残り2バイトの場合、16ビットになるので、2文字の0を追加して18ビット文字列に
					tmp[j++] = '0';
					tmp[j++] = '0';
				}
			}
			// 6文字ずつに分割し、変換表により1文字を得る
			for( i = 0; i < j; i += 6 ){
				fprintf( out_fp, "%c", TABLE[tableIndex( &tmp[i] )] );
				k++;
			}
			// 結果の文字列の文字数が4の倍数になるように=を追加
			if( (k % 4) != 0 ){
				for( i = 3 - (k % 4); i >= 0; i-- ){
					fprintf( out_fp, "=" );
				}
			}
		}
		fclose(out_fp);
	}

	return 0;
}
